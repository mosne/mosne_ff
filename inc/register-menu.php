<?php
function mosne_ff_menus() {

	$locations = array(
		'primary'  => __( 'Desktop Horizontal Menu', 'mosne' ),
		'expanded' => __( 'Desktop Expanded Menu', 'mosne' ),
		'mobile'   => __( 'Mobile Menu', 'mosne' ),
		'footer'   => __( 'Footer Menu', 'mosne' ),
		'social'   => __( 'Social Menu', 'mosne' ),
	);

	register_nav_menus( $locations );
}

add_action( 'init', 'mosne_ff_menus' );
