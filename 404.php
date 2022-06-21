<?php get_header(); ?>
<div class="blocks-container">
	<h1><?php esc_html_e( '404 error', 'mosne' ); ?></h1>
	<p><?php esc_html_e( 'Sorry, the page you are looking for cannot be found or has been deleted.', 'mosne' ); ?></p>
	<p><a class="button button-block" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Back to the homepage', 'mosne' ); ?></a></p>
</div>
<?php get_footer(); ?>
