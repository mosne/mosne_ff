<?php
/**
 * Mosne Cards Block Template.
 *
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param   (int|string) $post_id The post ID this block is saved to.
 */

// Create id attribute allowing for custom "anchor" value.
$id = 'wp-block-' . $block['id'];
if ( ! empty( $block['anchor'] ) ) {
	$id = $block['anchor'];
}

// Create class attribute allowing for custom "className" and "align" values.
$className = 'mosne-cards';
if ( ! empty( $block['className'] ) ) {
	$className .= ' ' . $block['className'];
}
if ( ! empty( $block['align'] ) ) {
	$className .= ' align' . $block['align'];
}

// Load values and assing defaults.
$cards_has_header = get_field( 'cards_has_header' );
$cards_columns    = get_field( 'cards_columns' );
$cards_layout     = get_field( 'cards_layout' );
$cards_mode       = get_field( 'cards_mode' );

if ( 'auto' === $cards_mode ) {
	$cards_mode_auto  = get_field( 'cards_mode_auto' );
	$cards_query_args = [
		'offset'         => get_field( 'cards_offset' ),
		'posts_per_page' => get_field( 'cards_number' ),
		'post__not_in'   => [ $post_id ], //phpcs:ignore]
	];
	$cards_query      = get_m_query( $cards_mode_auto, $cards_query_args );
} else {
	$cards_mode_manual = get_field( 'cards_mode_manual' );
	if(empty($cards_mode_manual)){
		//prevent retrieving all posts
		$cards_mode_manual = [0];
	}
	$cards_query       = get_m_query( 'manual', [ 'post__in' => $cards_mode_manual ] );
}

?>
<div id="<?php echo esc_attr( $id ); ?>" class="<?php echo esc_attr( $className ); ?>">
	<?php
	if ( $cards_has_header && $cards_query->have_posts() ) {
		$cards_title = get_field( 'cards_title' );
		$cards_link  = get_field( 'cards_link' );
		get_template_part(
			'template-parts/parts/mosne-cards',
			'header',
			[
				'title' => $cards_title,
				'link'  => $cards_link,
			]
		);
	}
	echo $cards_layout;
	get_template_part(
		'template-parts/parts/mosne-cards',
		$cards_layout,
		[
			'query'   => $cards_query,
			'columns' => $cards_columns,
			'layout'  => $cards_layout,
		]
	);
	?>
</div>
