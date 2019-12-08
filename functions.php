<?php
/**
 * @package WordPress
 * @subpackage Default_Theme
 */

//error on off
ini_set('display_errors', 1);
error_reporting(E_ALL ^ E_NOTICE);

show_admin_bar(false);

//get the the role object
$role_object = get_role( 'editor' );
$role_object->add_cap( 'edit_theme_options' );

include 'int/services.php';
include 'int/register-menu.php';
include 'int/register-sidebar.php';
include 'int/utilities.php';
include 'int/polylang.php';
include 'int/acf.php';
include 'int/woocommerce.php';

// m functions
include 'int/m_image.php';
include 'int/m_section.php';
include 'int/m_icon.php';

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


?>