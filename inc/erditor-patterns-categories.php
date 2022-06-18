<?php
function register_categories(): void {

	/**
	 * usage : 'common' => [ 'label' => __( 'Common', 'mosne' ) ]
	 */
	$pattern_categories = [
		'common' => [ 'label' => __( 'Common', 'mosne' ) ],
	];

	foreach ( $pattern_categories as $name => $properties ) {
		if ( \WP_Block_Pattern_Categories_Registry::get_instance()->is_registered( $name ) ) {
			continue;
		}
		register_block_pattern_category( $name, $properties );
	}
}

add_action( 'init', 'register_categories', 10 );
