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
require_once __DIR__ . '/inc/editor-blocks-template.php';

//patterns
require_once __DIR__ . '/inc/erditor-patterns-categories.php';
require_once __DIR__ . '/inc/erditor-patterns.php';

// helpers
require_once __DIR__ . '/inc/m_query.php';
require_once __DIR__ . '/inc/m_image.php';
require_once __DIR__ . '/inc/m_icon.php';



