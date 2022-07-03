<?php
/** @var arrry $args */
$card_query   = $args['query'];
$card_columns = $args['columns'];
$card_layout  = $args['layout'];
?>
<div class="mosne-card__list" data-grid="<?php (int) esc_attr_e( $card_columns ); ?>">
	<?php
	get_template_part(
		'template-parts/parts/mosne-cards',
		'loop',
		[
			'query'  => $card_query,
			'layout' => $card_layout
		]
	);
	?>
</div>
