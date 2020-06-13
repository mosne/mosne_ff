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

include 'inc/services.php';
include 'inc/register-menu.php';
include 'inc/register-sidebar.php';
include 'inc/utilities.php';
include 'inc/polylang.php';
include 'inc/acf.php';
include 'inc/woocommerce.php';

// m functions
include 'inc/m_image.php';
include 'inc/m_section.php';
include 'inc/m_icon.php';

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


function nicelink_url($url){
    
    preg_match("/[a-z0-9\-]{1,63}\.[a-z\.]{2,6}$/", parse_url($url, PHP_URL_HOST), $_domain_tld);
    return $_domain_tld[0];

   // return $link_url;
}


?>
