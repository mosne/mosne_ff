<?php
/** @var arrry $args */
$card_query  = $args['query'];
$card_layout = $args['layout'];
if ( $card_query->have_posts() ) :
	while ( $card_query->have_posts() ) :
		$card_query->the_post(); ?>
		<?php get_template_part( 'template-parts/loops/loop-' . get_post_type(), $card_layout ); ?>
	<?php endwhile; ?>
	<?php wp_reset_postdata(); ?>
<?php else : ?>
	<?php get_template_part( 'template-parts/parts/mosne-cards', 'error' ); ?>
	<?php
endif;
