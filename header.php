<!doctype html>
<html <?php language_attributes(); ?> class="no-js" data-whatintent data-whatinput>
<head>
    <meta charset="utf-8">
    <title><?php wp_title(''); ?></title>
    <link href="<?php echo get_template_directory_uri(); ?>/assets/fonts.css?v=1.0.0" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Lekton:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
    <?php wp_head(); ?>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta name="theme-color" content="#ffffff">
</head>
<body <?php body_class(); ?>>

    <header id="header">
        <a id="skip-navigation" class="visuallyhidden" href="#bd">skip navigation</a>
        <div class="grid">
            <div id="logo"><a class="name" href="<?php echo esc_url(home_url()); ?>"><?php bloginfo('name'); ?></a></div>
                <nav id="menu" class="serif" aria-hidden="true" aria-label="Main Navigation">
        	            <?php dynamic_sidebar('s_header_0'); ?>
                </nav>
        </div>
        <?php echo get_search_form(); ?>
    </header>