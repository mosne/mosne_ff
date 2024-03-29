<!DOCTYPE html>
<html class="no-js" <?php language_attributes(); ?>>
<head>
	<script type="text/javascript">(function() { let c = document.documentElement.className; c = c.replace(/no-js/, 'js'); document.documentElement.className = c})();</script>
	<meta charset="<?php bloginfo( 'charset' ); ?>"/>
	<meta http-equiv="Content-Type" content="text/html; charset=<?php bloginfo( 'charset' ); ?>"/>
	<meta name="viewport" content="width=device-width, initial-scale=1"/>
	<meta http-equiv="x-ua-compatible" content="ie=edge">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php
get_template_part( 'template-parts/navigation/skip-links' );
get_template_part( 'template-parts/navigation/header' );
?>
<main id="content" role="main" tabindex="-1" aria-label="<?php esc_html_e( 'Main content', 'mosne' ); ?>">
<?php
wp_body_open();
