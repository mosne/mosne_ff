<?php
/** @var arrry $args */
$card_title = $args['title'];
$card_link  = $args['link']; ?>
<header class="mosne-card__header">
	<?php if ( ! empty( $card_title ) ) : ?>
		<h2><?php echo esc_html( $card_title ); ?> </h2>
	<?php endif; ?>
	<?php if ( ! empty( $card_link ) ) : ?>
		<a href="<?php echo esc_url( $card_link['url'] ); ?>" target="<?php echo esc_attr( $card_link['target'] ); ?>">
			<?php echo esc_html( $card_link['title'] ); ?>
		</a>
	<?php endif; ?>
</header>
