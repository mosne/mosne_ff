<?php
add_action( 'acf/init', 'my_acf_op_init' );
function my_acf_op_init() {
	// Check function exists.
	if ( function_exists( 'acf_add_options_sub_page' ) ) {

		// Add parent.
		$parent = acf_add_options_page(
			[
				'page_title' => __( 'Theme General options' ),
				'menu_title' => __( 'Options' ),
				'menu_slug'  => 'mosne-options',
				'redirect'   => false,
				'icon_url'   => 'dashicons-visibility',
				'position'   => 63,
			]
		);

		/*
		// Add sub page.
		$child = acf_add_options_sub_page(array(
			'page_title'  => __('Social Settings'),
			'menu_title'  => __('Social'),
			'parent_slug' => $parent['menu_slug'],
		));
		*/

		// Add tho the apparence menu.
		$apparence = acf_add_options_page(
			[
				'page_title'  => __( 'Footer options' ),
				'menu_title'  => __( 'Footer options' ),
				'parent_slug' => 'themes.php',
			]
		);
	}

	add_filter(
		'acf/settings/google_api_key',
		function () {
			//restricted to .mosne.it domains
			return 'AIzaSyDSt-brRexqMeWyTtMUXnCtFwvjae2lWaI';
		}
	);

	// check function exists
	if ( function_exists( 'acf_register_block' ) ) {

		acf_register_block(
			[
				'name'            => 'mosne-cards',
				'title'           => __( 'Cards' ),
				'description'     => __( 'A custom query block.' ),
				'render_callback' => 'mosne_cards_acf_block_render_callback',
				'category'        => 'common',
				'icon'            => 'grid-view',
				'mode'            => 'auto',
				'align'           => 'wide',
				'supports'        => [
					'align' => [ 'full', 'wide', 'default' ],
				],
				'keywords'        => [ 'query', 'card', 'loop', 'latest', 'manual', 'auto' ],
				'render_template' => 'template-parts/blocks/mosne-cards.php',
			]
		);
	}

}
