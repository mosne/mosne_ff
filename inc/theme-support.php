<?php
/** defines theme supports **/
add_theme_support( 'post-thumbnails' );
add_theme_support( 'woocommerce' );
add_theme_support( 'align-wide' );
add_theme_support( 'responsive-embeds' );
add_theme_support( 'html5', [ 'comment-list', 'comment-form', 'search-form', 'gallery', 'caption', 'script', 'style' ] );
add_theme_support( 'title-tag' );
add_theme_support( 'async-fonts' );
add_theme_support( 'async-js' );
add_theme_support( 'yoast-seo-breadcrumbs' );
add_theme_support( 'editor-styles' );
add_theme_support( 'wp-block-styles' );
add_post_type_support( 'page', 'excerpt' );
add_theme_support( 'disable-custom-colors' );
// remove al default patterns
remove_theme_support( 'core-block-patterns' );
