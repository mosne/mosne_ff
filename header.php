<!doctype html>
<html <?php language_attributes(); ?> class="no-js" data-whatintent data-whatinput>
<head>
	<meta charset="utf-8">
	<meta http-equiv="x-ua-compatible" content="ie=edge">
	<title><?php wp_title( '' ); ?></title>
	<?php wp_head(); // fonts declaration inc/services.php ?>
	<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
	<meta name="theme-color" content="#ffffff">
</head>
<body <?php body_class(); ?>>

	<header id="header">
		<ul class="menu-fastaccess">
			<li class="menu-fastaccess__item"><a href="#bd"><?php esc_html_e( 'Skip to content', 'mosne' ); ?></a></li>
			<li class="menu-fastaccess__item"><a href="#nav-primary"><?php esc_html_e( 'Skip to Main Menu', 'mosne' ); ?></a></li>
			<li class="menu-fastaccess__item"><a href="#search"><?php esc_html_e( 'Skip to Search Form', 'mosne' ); ?></a></li>
		</ul>
		<div id="logo"><a class="name" href="<?php echo esc_url( home_url() ); ?>"><?php bloginfo( 'name' ); ?></a></div>
		<?php get_template_part( 'template-parts/navigation/menu-main' ); ?>
		<?php get_search_form( array( 'echo' => true ) ); ?>
	</header>
