<?php
/** @var arrry $args */
$card_query   = $args['query'];
$card_columns = $args['columns'];
$card_layout  = $args['layout'];
?>
<div class="mosne-card__grid" data-grid="<?php echo esc_attr( $card_columns ); ?>">
	<?php
	get_template_part(
		'template-parts/parts/mosne-cards',
		'loop',
		[
			'query'  => $card_query,
			'layout' => $card_layout,
		]
	);
	?>
</div>
