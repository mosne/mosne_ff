<?php
/**
 * @package WordPress
 * @subpackage Default_Theme
 */
show_admin_bar( false );

//get the the role object
$role_object = get_role( 'editor' );
$role_object->add_cap( 'edit_theme_options' );

require_once __DIR__ . '/inc/services.php';
require_once __DIR__ . '/inc/register-menu.php';
require_once __DIR__ . '/inc/register-sidebar.php';
require_once __DIR__ . '/inc/utilities.php';
require_once __DIR__ . '/inc/polylang.php';
require_once __DIR__ . '/inc/acf.php';
require_once __DIR__ . '/inc/woocommerce.php';

//editor
require_once __DIR__ . '/inc/editor-white-list.php';
require_once __DIR__ . '/inc/editor-color-palette.php';
require_once __DIR__ . '/inc/editor-font-size.php';
require_once __DIR__ . '/inc/editor-block-styles.php';

//patterns
require_once __DIR__ . '/inc/erditor-patterns-categories.php';
require_once __DIR__ . '/inc/erditor-patterns.php';

// m functions
require_once __DIR__ . '/inc/m_image.php';
require_once __DIR__ . '/inc/m_section.php';
require_once __DIR__ . '/inc/m_icon.php';

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


function nicelink_url( $url ) {

	preg_match( '/[a-z0-9\-]{1,63}\.[a-z\.]{2,6}$/', parse_url( $url, PHP_URL_HOST ), $_domain_tld );

	return $_domain_tld[0];

}



