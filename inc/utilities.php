<?php

function m_edit() {
	if ( current_user_can( 'level_3' ) ) {
		echo esc_html( edit_post_link( 'edit', '', '' ) );
	};
}

/**
 * @param $val
 *
 * @return string
 */
function m_clean( $val ) {
	return trim( preg_replace( '/\s+/', ' ', wp_strip_all_tags( $val ) ) );
}


add_filter( 'kses_allowed_protocols', 'ss_allow_skype_protocol' );
function ss_allow_skype_protocol( $protocols ) {
	$protocols[] = 'skype';

	return $protocols;
}

function m_print( $val ) {
	echo '<pre>';
	print_r( $val ); //phpcs:ignore
	echo '</pre>';
}

function m_sanitize( $what ) {
	$clean = wp_kses(
		$what,
		[
			'h1'     => [],
			'h2'     => [],
			'h3'     => [],
			'h4'     => [],
			'strong' => [],
			'br'     => [],
			'p'      => [],
			'a'      => [ 'href', 'target', 'rel' ],
		]
	);

	return $clean;
}


/**
 * @param $field
 */
function m_the_field( $field ) {
	echo esc_html( m_sanitize( get_field( $field ) ) );
}


/**
 * @param $string
 * @param $before
 * @param $after
 *
 * @return string|void
 */
function m_if( $string, $before, $after ) {

	if ( empty( $string ) ) {
		return;
	}

	return wp_kses_post( $before . esc_html( $string ) . $after );

}


/**
 * @param string $apost_id
 * @param bool $echo
 *
 * @return mixed
 */
function m_short( $apost_id = '', $echo = false ) {

	$short = get_field( 'short', $apost_id );
	if ( '' === $short ) {
		$tit = get_the_title( $apost_id );
	} else {
		$tit = $short;
	}

	if ( $echo ) {
		return $tit;
	} else {
		echo esc_html( $tit );
	}
}

function new_excerpt_more( $more ): string {
	return '&hellip;';
}

add_filter( 'excerpt_more', 'new_excerpt_more' );


function m_post_image( $id ) {
	$thumbnail_id = get_post_thumbnail_id( $id );
	if ( ! empty( $thumbnail_id ) ) {
		return acf_get_attachment( $thumbnail_id );
	}
}

function m_pr( $id ) {
	$thumbnail_id = get_post_thumbnail_id( $id );
	if ( ! empty( $thumbnail_id ) ) {
		$cover = acf_get_attachment( $thumbnail_id );
		m_image( $cover );
	}
}


function m_abs( $id ) {
	$text = wp_trim_words( get_field( 'seo_text' ), 42, '...' );
	if ( ! empty( $text ) ) {
		echo esc_html( $text );
	} else {
		the_excerpt();
	}
}


function m_more() {
	echo '<a href="' . esc_url( get_permalink() ) . '" class="btn btn--primary">More</a>';
}

function m_list( $field, $label ) {

	$links = [];
	$items = get_field( $field );
	if ( $items ) {
		echo '<h4>' . esc_html( $label ) . '</h4>';

		foreach ( $items as $item ) {

			$links[] = '<a href="' . get_permalink( $item->ID ) . '">' . m_short( $item->ID, true ) . '</a>';
		}

		echo esc_html( implode( ', ', $links ) . '.' );

	}

}

/**
 * @param        $id
 * @param        $tax
 * @param string $before
 * @param string $sep
 * @param string $after
 *
 * @return string
 */
function m_terms( $id, $tax, string $before = '', string $sep = '', string $after = '' ): string {
	$at = get_the_terms( $id, $tax );
	if ( is_array( $at ) ) {
		$final = [];
		if ( count( $at ) >= 1 ) {
			foreach ( $at as $term ) {
				$final[] = $term->name;
			}
			$glued = implode( $sep, $final );

			return $before . $glued . $after;
		}
	}
}

/**
 * @param $text
 * @param $limit
 */
function m_limit_text( $text, $limit ) {
	if ( str_word_count( $text, 0 ) > $limit ) {
		$words = str_word_count( $text, 2 );
		$pos   = array_keys( $words );
		$text  = substr( $text, 0, $pos[ $limit ] ) . '...';
	}
	echo esc_html( $text );
}


add_action( 'wp_footer', 'm_ajaxurl' );
function m_ajaxurl() {

	echo '<script type="text/javascript">
           const m_ajaxurl = "' . esc_url( admin_url( 'admin-ajax.php' ) ) . '";
         </script>';
}

add_action( 'wp_ajax_m_tags', 'm_tags' );

function m_tags() {

	$terms = get_terms(
		'post_tag',
		[
			'hide_empty' => true,
		]
	);

	$names = [];
	foreach ( $terms as $term ) {
		$names[] = $term->name;
	}
	echo wp_json_encode( $names );
}

/**
 * @param        $input
 * @param null $tag
 * @param null $class
 * @param bool $strip
 */
function m_check( $input, $tag = null, $class = null, bool $strip = false ) {
	if ( $input ) {
		if ( true === $strip ) {
			$input_s = wp_strip_all_tags( $input );
		} elseif ( false !== $strip ) {
			$input_s = wp_strip_all_tags( $input, $strip );
		} else {
			$input_s = $input;
		}
		if ( $tag ) {
			if ( $class ) {
				$otag = '<' . $tag . ' class="' . $class . '">';
			} else {
				$otag = '<' . $tag . '>';
			}
			echo wp_kses_post( $otag . $input_s . '</' . $tag . '>' );
		} else {
			echo wp_kses_post( $input_s );
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

/**
 * @param     $array
 * @param int $tot
 *
 * @return array
 */
function m_pattern( $array, $tot = 10 ) {
	$new_array = [];
	$x         = 0;
	for ( $i = 0; $i <= $tot; $i ++ ) {
		if ( count( $array ) === $x ) {
			$x = 0;
		}
		$new_array[] = $array[ $x ];
		$x ++;
	}

	return $new_array;
}


function m_custom_excerpt_length( $length ): int {
	return 20;
}

add_filter( 'excerpt_length', 'm_custom_excerpt_length', 999 );

function m_getlang() {

	$langs = explode( '_', get_locale() );

	return reset( $langs );

}

/**
 *
 * @param string	$folder
 * @param string	$file
 * @param array	$args
 * 
 * @return void|false
 */

function m_get_template($folder, $file, $args = array()) {
	get_template_part('template-parts/'.$folder.'/'.$file, '', $args);
}

/**
 * Create a slug-safe string from natural languange string
 *
 * @param string $str
 * @param string $delimiter optional
 *
 * @return string
 */
function createSlug($str, $delimiter = '-'){

	$slug = strtolower(trim(preg_replace('/[\s-]+/', $delimiter, preg_replace('/[^A-Za-z0-9-]+/', $delimiter, preg_replace('/[&]/', 'and', preg_replace('/[\']/', '', iconv('UTF-8', 'ASCII//TRANSLIT', $str))))), $delimiter));
	return $slug;

} 

/**
 * Merge post-thumbnail and gallery images in one array checking if thumbnail is duplicated pushing it on the beginning
 * 
 * @param int   $thumb_id
 * @param array $images_ids
 *
 * @return array|null
 */
function m_thumb_gallery_merge($thumb_id, $images_ids) {
	if(!$thumb_id && !$images_ids) {
		return null;
	}
	if(!$images_ids){
		return $thumb_id;
	}else{
		if(!in_array($thumb_id, $images_ids) && $thumb_id){
			array_unshift($images_ids, $thumb_id);
		}
		return $images_ids;
	}
}