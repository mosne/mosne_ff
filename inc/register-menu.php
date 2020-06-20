<?php
function mosne_ff_menus() {

	$locations = array(
		'primary' => __( 'Primary Menu', 'mosne' ),
		'social'  => __( 'Social Menu', 'mosne' ),
	);

	register_nav_menus( $locations );
}

add_action( 'init', 'mosne_ff_menus' );

class Accessible_Menu_Walker extends Walker_Nav_Menu {

	function start_lvl( &$output, $depth = 0, $args = array() ) {
		$indent  = str_repeat( "\t", $depth );
		$output .= "\n$indent<div class='amenu__panel'><ul class='sub-menu amenu__sub-menu'>\n";
	}
	function end_lvl( &$output, $depth = 0, $args = array() ) {
		$indent  = str_repeat( "\t", $depth );
		$output .= "$indent</ul></div>\n";
	}
}
