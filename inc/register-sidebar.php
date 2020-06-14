<?php
function m_widgets_init() {

		register_sidebar(
			array(
				'name'          => __( 'Header', 'mosne' ),
				'id'            => 'header',
				'description'   => __( 'The Header widget area', 'm' ),
				'before_widget' => '',
				'after_widget'  => '',
			)
		);

		register_sidebar(
			array(
				'name'          => __( 'Footer', 'mosne' ),
				'id'            => 'footer',
				'description'   => __( 'The Footer column 2', 'm' ),
				'before_widget' => '<div id="%1$s" class="item %2$s">',
				'after_widget'  => '</div>',
				'before_title'  => '<h4>',
				'after_title'   => '</h4>',
			)
		);

}

add_action( 'widgets_init', 'm_widgets_init' );
