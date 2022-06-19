<?php
// disable non html5 wp_heads
remove_action( 'wp_head', 'feed_links_extra', 3 );
remove_action( 'wp_head', 'feed_links', 2 );
remove_action( 'wp_head', 'rsd_link' );
remove_action( 'wp_head', 'wlwmanifest_link' );
remove_action( 'wp_head', 'index_rel_link' );
remove_action( 'wp_head', 'parent_post_rel_link', 10, 0 );
remove_action( 'wp_head', 'start_post_rel_link', 10, 0 );
remove_action( 'wp_head', 'adjacent_posts_rel_link', 10, 0 );
remove_action( 'wp_head', 'wp_generator' );
remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
remove_action( 'wp_print_styles', 'print_emoji_styles' );
remove_action( 'admin_print_styles', 'print_emoji_styles' );
remove_action( 'wp_head', 'rest_output_link_wp_head', 10 );
remove_action( 'wp_head', 'wp_oembed_add_discovery_links', 10 );

if ( ! function_exists( 'bcdiv' ) ) {
	function bcdiv( $first, $second, $scale = 0 ) {
		$res = $first / $second;

		return round( $res, $scale );
	}
}

function theme_name_scripts() {
	wp_deregister_script( 'jquery' );
	wp_register_script( 'jquery', '//ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js', null, '3.3.1', true );
	wp_register_script( 'mosne_app', get_template_directory_uri() . '/dist/app.js', array( 'jquery' ), '1.0', true );
	wp_enqueue_script( 'jquery' );
	wp_enqueue_script( 'mosne_app' );
	wp_enqueue_style( 'google_fonts', 'https://fonts.googleapis.com/css2?family=Lekton:ital,wght@0,400;0,700;1,400&display=swap', null, '1.0', 'all' );
	wp_enqueue_style( 'custom_fonts', get_template_directory_uri() . '/assets/fonts/fonts.css', null, '1.0', 'all' );
	wp_enqueue_style( 'mosne_style', get_template_directory_uri() . '/dist/app.css', null, '1.0', 'all' );
	//passive touch start for performance
	wp_add_inline_script( 'jquery', 'jQuery.event.special.touchstart={setup:function(e,t,s){this.addEventListener("touchstart",s,{passive:!t.includes("noPreventDefault")})}},jQuery.event.special.touchmove={setup:function(e,t,s){this.addEventListener("touchmove",s,{passive:!t.includes("noPreventDefault")})}},jQuery.event.special.wheel={setup:function(e,t,s){this.addEventListener("wheel",s,{passive:!0})}},jQuery.event.special.mousewheel={setup:function(e,t,s){this.addEventListener("mousewheel",s,{passive:!0})}};' );
}

add_action( 'wp_enqueue_scripts', 'theme_name_scripts' );

// Add custom taxonomies to the post class
add_filter( 'post_class', 'custom_taxonomy_post_class', 10, 3 );
if ( ! function_exists( 'custom_taxonomy_post_class' ) ) {
	function custom_taxonomy_post_class( $classes, $class, $id ) {
		$taxonomy = 'anno';
		$terms    = get_the_terms( (int) $id, $taxonomy );
		if ( ! empty( $terms ) ) {
			foreach ( (array) $terms as $order => $term ) {
				if ( ! in_array( $term->slug, $classes, true ) ) {
					$classes[] = $term->taxonomy . '-' . $term->slug;
				}
			}
		}

		return $classes;
	}
}


function custom_theme_setup() {

	include 'theme-support.php';
	include 'image-sizes.php';

	function cc_mime_types( $mimes ) {
		$mimes['svg'] = 'image/svg+xml';

		return $mimes;
	}

	add_filter( 'upload_mimes', 'cc_mime_types' );
}

add_action( 'after_setup_theme', 'custom_theme_setup' );

/**
 * Gutenber Editor Style
 */
function custom_editor_style() {
	add_editor_style( 'dist/editor.css' );
}

add_action( 'init', 'custom_editor_style' );

/**
 * Editor script
 */
function mosne_editor_enqueue_scripts() {

	$script_path = '/dist/editor.js';

	// Enqueue the block index.js file
	wp_enqueue_script(
		'mosne-editor-script', // unique handle
		get_template_directory_uri() . $script_path,
		[ 'wp-blocks', 'wp-dom', 'wp-element', 'wp-i18n' ], // required dependencies for blocks
		filemtime( get_template_directory() . $script_path )
	);

}

add_action( 'enqueue_block_editor_assets', 'mosne_editor_enqueue_scripts' );
function tax_cat_active( $output, $args ) {
	if ( is_single() ) {
		global $post;
		$terms = get_the_terms( $post->ID, 'category' );
		if ( ! empty( $terms ) ) {
			foreach ( $terms as $term ) {
				if ( preg_match( '#cat-item-' . $term->term_id . '#', $output ) ) {
					$output = str_replace( 'cat-item-' . $term->term_id, 'cat-item-' . $term->term_id . ' current-cat', $output );
				}
			}
		}
	}

	return $output;
}

add_filter( 'wp_list_categories', 'tax_cat_active', 10, 2 );

/**
 * Enqueue the WP login page styles
 */
function login_enqueue_styles() {
	$theme = wp_get_theme();
	wp_enqueue_style( 'mosne-login', get_stylesheet_directory_uri() . '/dist/login.css', null, $theme->get( 'Version' ) );
}

add_action( 'login_enqueue_scripts', 'login_enqueue_styles' );


/*
function my_theme_deregister_plugin_assets_header() {
	wp_dequeue_style('yarppWidgetCss');
	wp_deregister_style('yarppRelatedCss');
}

add_action( 'wp_print_styles', 'my_theme_deregister_plugin_assets_header' );

function my_theme_deregister_plugin_assets_footer() {
	wp_dequeue_style('yarppRelatedCss');
}
add_action( 'wp_footer', 'my_theme_deregister_plugin_assets_footer' );
*/
