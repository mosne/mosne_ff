<?php

function m_edit() {
	if ( current_user_can( 'level_3' ) ) {
		echo edit_post_link( 'edit', '', '' );
	};
}

function m_clean( $val ) {
	return trim( preg_replace( '/\s+/', ' ', strip_tags( $val ) ) );
}


function custom_notice_message( $args ) {
	$args['see_more_opt']['text'] = __( $args['see_more_opt']['text'] );
	$args['accept_text']          = __( $args['accept_text'] );
	$args['message_text']         = __( $args['message_text'] );
	return $args;
}


function ss_allow_skype_protocol( $protocols ) {
	$protocols[] = 'skype';
	return $protocols;
}


add_filter( 'kses_allowed_protocols', 'ss_allow_skype_protocol' );

function m_print( $val ) {
	echo '<pre>';
	print_r( $val );
	echo '</pre>';
}

function m_sanitize( $what ) {
	$clean = wp_kses(
		$what,
		array(
			'h1'     => array(),
			'h2'     => array(),
			'h3'     => array(),
			'h4'     => array(),
			'strong' => array(),
			'br'     => array(),
			'p'      => array(),
			'a'      => array( 'href', 'target' ),
		)
	);
	return $clean;
}


function m_the_field( $field ) {
	echo m_sanitize( get_field( $field ) );
}


function m_if( $string, $b, $a ) {
	if ( $string != '' ) {
		echo $b . $string . $a;
	}
}


function m_short( $apost_id = '', $echo = false ) {

	$short = get_field( 'short', $apost_id );
	if ( $short == '' ) {
		$tit = get_the_title( $apost_id );
	} else {
		$tit = $short;
	}

	if ( $echo ) {
		return $tit;
	} else {
		echo $tit;
	}
}

function new_excerpt_more( $more ) {
	return '&hellip;';
}
add_filter( 'excerpt_more', 'new_excerpt_more' );


function m_post_image( $id ) {
	$thumbnail_id = get_post_thumbnail_id( $id );
	if ( $thumbnail_id != '' ) {
		$cover = acf_get_attachment( $thumbnail_id );
		return $cover;
	}

}

function m_pr( $id ) {
	$thumbnail_id = get_post_thumbnail_id( $id );
	if ( $thumbnail_id != '' ) {
		$cover = acf_get_attachment( $thumbnail_id );
		m_image( $cover );
	}
}


function m_abs( $id ) {
	$text = wp_trim_words( get_field( 'seo_text' ), 42, '...' );
	if ( $text != '' ) {
		echo( $text );
	} else {
		the_excerpt();
	}
}


function m_more() {
	echo '<br><a href="' . get_permalink() . '" class="button">More</a>';
};

function the_m_list( $field, $label ) {

	$links = array();
	$items = get_field( $field );
	if ( $items ) {
		echo '<h4>' . $label . '</h4>';

		foreach ( $items as $item ) {

			$links[] = '<a href="' . get_permalink( $item->ID ) . '">' . m_short( $item->ID, true ) . '</a>';
		}

		echo implode( ', ', $links ) . '.';

	}

}


function mdida( $img ) {
	//.'<strong>'.__($img["title"]).musbr(__($img["alt"])).'</strong>'.musbr(nl2br(__($img["description"]))).'<br/>'

	echo '<figcaption itemprop="caption description" id="caption' . $img['id'] . '"><span class="wrap">'
		. '<span itemprop="copyrightHolder" class="credits">' . nl2br( __( $img['caption'] ) ) . '</span></span>
        </figcaption>';
}


function m_terms( $id, $tax, $before = '', $sep = '', $after = '' ) {
	$at = get_the_terms( $id, $tax );
	if ( is_array( $at ) ) {
		$final = array();
		if ( count( $at ) >= 1 ) {
			foreach ( $at as $term ) {
				$final[] = $term->name;
			}
			$glued = implode( $sep, $final );
			return $before . $glued . $after;
		}
	}
}

function m_limit_text( $text, $limit ) {
	if ( str_word_count( $text, 0 ) > $limit ) {
		$words = str_word_count( $text, 2 );
		$pos   = array_keys( $words );
		$text  = substr( $text, 0, $pos[ $limit ] ) . '...';
	}
	echo $text;
}


add_action( 'wp_footer', 'm_ajaxurl' );
function m_ajaxurl() {

	echo '<script type="text/javascript">
           var m_ajaxurl = "' . admin_url( 'admin-ajax.php' ) . '";
         </script>';
}
add_action( 'wp_ajax_m_tags', 'm_tags' );

function m_tags() {

	$terms = get_terms(
		'post_tag',
		array(
			'hide_empty' => true,
		)
	);

	$names = array();
	foreach ( $terms as $term ) {
		$names[] = $term->name;
	}
	echo json_encode( $names );

	die();
}

function m_check( $input, $tag = null, $class = null, $strip = 'false' ) {
	if ( $input ) {
		if ( $strip == 'true' ) {
			$input_s = strip_tags( $input );} elseif ( $strip !== 'false' ) {
			$input_s = strip_tags( $input, $strip ); } else {
				$input_s = $input;}
			if ( $tag ) {
				if ( $class ) {
					$otag = '<' . $tag . ' class="' . $class . '">';} else {
								$otag = '<' . $tag . '>';}
					echo $otag . $input_s . '</' . $tag . '>';
			} else {
				echo $input_s;
			}
	}
}

/* ripete array

	//setup prima del loop
	$sets = array("layout1","layout2","layout3");
	$pattern = m_pattern($sets,30);

	//nei loop
	$class = $pattern[$cc]; $c++;
*/

function m_pattern( $array, $tot = 10 ) {
	$new_array = array();
	$x         = 0;
	for ( $i = 0; $i <= $tot; $i++ ) {
		if ( $x == count( $array ) ) {
			$x = 0; }
		$new_array[] = $array[ $x ];
		$x++;
	}
	return $new_array;
}


function m_custom_excerpt_length( $length ) {
	return 20;
}
add_filter( 'excerpt_length', 'm_custom_excerpt_length', 999 );
