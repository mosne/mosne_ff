<?php
/** @var arrry $args */
$title = $args['title'];
$link  = $args['link']; ?>
<header class="mosne-card__header">
	<?php if ( ! empty( $title ) ) : ?>
		<h2><?php echo esc_html( $title ); ?> </h2>
	<?php endif; ?>
	<?php if ( ! empty( $link ) ) : ?>
		<a href="<?php echo esc_url( $link['url'] ); ?>" target="<?php echo esc_attr( $link['target'] ); ?>">
			<?php echo esc_html( $link['title'] ); ?>
		</a>
	<?php endif; ?>
</header>
