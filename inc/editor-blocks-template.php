<?php
// add_action( 'init', 'm_custom_template_block' );

function m_custom_template_block() {
	$post_type_object = get_post_type_object( 'post' );
	$filename         = get_theme_file_path( '/template-blocks/blocks-template-exemple.json' );
	// Use the following script in the browser console to copy the template in json
	// copy(wp.data.select('core/block-editor').getBlocks())

	if ( ! file_exists( $filename ) ) {
		return;
	}

	$get_content = file_get_contents( $filename ); //phpcs:ignore

	if ( empty( $get_content ) ) {
		return;
	}

	$body = json_decode( $get_content );

	if ( empty( $body ) ) {
		return;
	}

	$template                        = generate_template_block( $body );
	$post_type_object->template      = $template;
	//$post_type_object->template_lock = 'all';  // to lock the editing
}

function generate_template_block( $blocks ) {
$block_array = [];

foreach ( $blocks as $block ) {
	$attribute = '';
	if ( ! empty( $block->innerBlocks ) ) {
		$attribute = (array) $block->attributes;
		// For the group or columns
		$inner_content = generate_template_block( $block->innerBlocks );
	} else {
		$inner_content = (array) $block->attributes;
		// Force ACF fields to empty
		if ( isset( $inner_content['data'] ) ) {
			$inner_content['data'] = [];
		}

		// Force ID blocks to empty
		if ( isset( $inner_content['id'] ) ) {
			unset( $inner_content['id'] );
		}
	}

	$args = [
		$block->name,
	];

	if ( is_array( $attribute ) ) {
		$args[] = $attribute;
	}

	if ( ! empty( $inner_content ) ) {
		$args[] = $inner_content;
	}

	$block_array[] = $args;
}

return $block_array;
}