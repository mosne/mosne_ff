<?php
/**
 * White list of gutenberg blocks
 */
function wpdocs_allowed_block_types( $block_editor_context, $editor_context ) {
	if ( ! empty( $editor_context->post ) ) {
		return [
			//base
			'core/heading',
			'core/paragraph',
			'core/image',
			'core/list',
			'core/quote',
			'core/pullquote',
			'core/table',
			'core/buttons',
			'core/button',
			'core/group',
			'core/columns',
			'core/column',
			'core/media-text',
			'core/spacer',
			'core/separator',
			'core/cover',
			'core/gallery',
			'core/video',
			'core/file',
			'core/embed',
			// custom
		];
//		if ( 'news' === $editor_context->post->post_type ) {
//			return array(
//				'core/paragraph',
//				'core/list',
//				'core/image',
//				'core/buttons',
//			);
//		}
	}

	return $block_editor_context;
}

// add_filter( 'allowed_block_types_all', 'wpdocs_allowed_block_types', 10, 2 );
