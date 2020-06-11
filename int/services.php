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



if( !function_exists( "bcdiv" ) )
{
    function bcdiv( $first, $second, $scale = 0 )
    {
        $res = $first / $second;
        return round( $res, $scale );
    }
}

function theme_name_scripts() {
    wp_deregister_script('jquery');
    wp_register_script('jquery', "//ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js", false, NULL , true);
    wp_register_script('mosne_app', get_template_directory_uri().'/dist/app.js', array('jquery'), '1.0', true);
    wp_enqueue_script('jquery');
    wp_enqueue_script('mosne_app');
    wp_enqueue_style( 'mosne_style', get_template_directory_uri().'/dist/app.css', NULL , '1.0', 'all' );
}
add_action( 'wp_enqueue_scripts', 'theme_name_scripts' );

// Add custom taxonomies to the post class
add_filter( 'post_class', 'custom_taxonomy_post_class', 10, 3 );
if( !function_exists( 'custom_taxonomy_post_class' ) ) {
    function custom_taxonomy_post_class( $classes, $class, $ID ) {
        $taxonomy = 'anno';
        $terms = get_the_terms( (int) $ID, $taxonomy );
        if( !empty( $terms ) ) {
            foreach( (array) $terms as $order => $term ) {
                if( !in_array( $term->slug, $classes ) ) {
                    $classes[] = $term->taxonomy.'-'.$term->slug;
                }
            }
        }
        return $classes;
    }
}


function custom_theme_setup() {

    include 'theme-support.php';
    include 'image-sizes.php';

    function cc_mime_types($mimes) {
        $mimes['svg'] = 'image/svg+xml';
        return $mimes;
    }
    add_filter('upload_mimes', 'cc_mime_types');

}

add_action( 'after_setup_theme', 'custom_theme_setup' );

/**
 * Gutenber Editor Style
*/
function custom_editor_style() {
    add_editor_style( 'dist/editor-style.css');
}
add_action( 'init', 'custom_editor_style' );


function tax_cat_active($output, $args) {
    if (is_single()) {
        global $post;
        $terms = get_the_terms($post->ID, 'category');
        if (!empty($terms)) {
            foreach( $terms as $term )
                if ( preg_match( '#cat-item-' . $term ->term_id . '#', $output ) )
                    $output = str_replace('cat-item-'.$term ->term_id, 'cat-item-'.$term ->term_id . ' current-cat', $output);
        }
    }
    return $output;
}
add_filter('wp_list_categories', 'tax_cat_active', 10, 2);