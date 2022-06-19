<?php
function m_widgets_init() {

		register_sidebar(
			[
				'name'          => __( 'Header', 'mosne' ),
				'id'            => 'header',
				'description'   => __( 'The Header widget area', 'm' ),
				'before_widget' => '',
				'after_widget'  => '',
			]
		);

		register_sidebar(
			[
				'name'          => __( 'Footer', 'mosne' ),
				'id'            => 'footer',
				'description'   => __( 'The Footer column 2', 'm' ),
				'before_widget' => '',
				'after_widget'  => '',
				'before_title'  => '<div role="heading" aria-level="2" class="footer__title">',
				'after_title'   => '</div>',
			]
		);

}

add_action( 'widgets_init', 'm_widgets_init' );
