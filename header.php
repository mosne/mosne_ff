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
		<a id="skip-navigation" class="visuallyhidden" href="#bd">skip navigation</a>
		<div class="grid">
			<div id="logo"><a class="name" href="<?php echo esc_url( home_url() ); ?>"><?php bloginfo( 'name' ); ?></a></div>
			<?php get_template_part( 'components/menu/menu-main' ); ?>
		</div>
		<?php echo get_search_form(); ?>
	</header>
