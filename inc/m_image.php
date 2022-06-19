<?php
/* m_image */

/**
 * @param $max_width
 *
 * @return int
 */
function new_srcset_max( $max_width ) {
	return 3000;
}

add_filter( 'max_srcset_image_width', 'new_srcset_max' );

/**
 * @param        $image
 * @param string $sz
 *
 * @return string
 */
function m_wrapper( $image, $sz = 'medium' ) {
	return 'style="padding-bottom:' . m_bottom( $image, $sz ) . '%"';
}

/**
 * @return string
 */
function m_placehoder() {
	return 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=';
}

/**
 * @param $svg
 *
 * @return object
 */
function m_get_dimensions( $svg ) {
	$svg        = simplexml_load_file( $svg );
	$attributes = $svg->attributes();
	$viewbox    = (string) $attributes->viewBox;
	$viewbox_v  = explode( ' ', $viewbox );
	$width      = (int) $viewbox_v[2];
	$height     = (int) $viewbox_v[3];

	return (object) [
		'width'  => $width,
		'height' => $height,
	];
}


/**
 * @param        $image
 * @param string $sz
 *
 * @return float|int
 */
function m_bottom( $image, $sz = 'medium' ) {
	if ( $image ) {
		$hh = $image['sizes'][ $sz . '-height' ];
		$ww = $image['sizes'][ $sz . '-width' ];
		if ( $hh == '' ) {
			$hh = $image['height'];
			$ww = $image['width'];
		}

		if ( $image['mime_type'] == 'image/svg+xml' ) {

			$svg_file_path = get_attached_file( $image['id'] );
			$dimensions    = m_get_dimensions( $svg_file_path );

			if ( $dimensions ) {
				$hh = $dimensions->height;
				$ww = $dimensions->width;
			} else {

				$hh = 1;
				$ww = 1;

			}
		}

		$ratio = 100 * bcdiv( $hh, $ww, 5 );

		return $ratio;
	}
}

/**
 * @param        $image
 * @param string $sz
 *
 * @return float|int
 */
function m_maxsize( $image, $sz = 'medium' ) {
	if ( $image ) {
		$ww = $image['sizes'][ $sz . '-width' ];
		if ( $ww == '' ) {
			$ww = $image['width'];
		}
		return '(max-width: ' . $ww . 'px) 100vw, ' . $ww . 'px';
	}
}

/**
 * @param $size
 *
 * @return string
 */
function m_file_size( $size ) {
	$a = [ 'B', 'KB', 'MB', 'GB', 'TB', 'PB' ];

	$pos = 0;

	while ( $size >= 1024 ) {
		$size /= 1024;
		$pos ++;
	}

	return round( $size, 2 ) . ' ' . $a[ $pos ];
}


/**
 * @param $svg
 * @param $mid
 *
 * @return string|string[]|null
 */
function mosne_svg( $svg, $mid ) {

	$trans_p = 'mosne_svg_';
	if ( $_GET['cache'] == 'svg' ) {
		delete_transient( $trans_p . $mid );
	}

	if ( false === ( $svg_md5_cache = get_transient( $trans_p . $mid ) ) ) {

		$svgx          = '';
		$document      = '';
		$svg_md5_cache = '';
		$result        = '';

		$svgx   = new SimpleXMLElement( file_get_contents( $svg ) );
		$result = $svgx->xpath( '/svg' );
		unset( $svgx['x'] );
		unset( $svgx['y'] );
		unset( $svgx['version'] );
		unset( $svgx['id'] );
		unset( $svgx['width'] );
		unset( $svgx['height'] );
		unset( $svgx['enable-background'] );
		if ( ! $svgx['preserveAspectRatio'] ) {
			$svgx->addAttribute( 'preserveAspectRatio', 'xMinYMin meet' );
		}
		if ( ! $svgx['class'] ) {
			$svgx->addAttribute( 'class', 'svg-content' );
		}
		$document = $svgx->asXML();

		/* cleanup */
		$search = [
			'@<\?[\s\S]*?[ \t\n\r]*>@',            // Remove XML
			'@<!DOCTYPE[\s\S]*?[ \t\n\r]*>@',       // Remove !DOCTYPE
			'@<![\s\S]*?--[ \t\n\r]*>@',            // Remove COMMENTS
		];

		$replace       = [ '', '', '', '', '', '' ];
		$clean         = preg_replace( $search, $replace, $document );
		$svg_md5_cache = $clean;

		set_transient( $trans_p . $mid, $document, 3 * 86400 ); //3 * DAYS_IN_SECONDS

	}

	return $svg_md5_cache;

}


function m_source( $field, $sz ) {

	$html = '';

	if ( is_array( $field ) ) {
		$image = $field;
	} else {
		$image = get_field( $field );
	}
	if ( $image ) {

		if ( 'image/svg+xml' == $image['mime_type'] ) {

			$svg_file_path = get_attached_file( $image['id'] );
			$html         .= mosne_svg( $svg_file_path, $image['id'] );

		} else {

			$srcset = wp_get_attachment_image_srcset( $image['id'], $sz, null );

			if ( $srcset == '' || $image['mime_type'] == 'image/gif' ) {
				$srcset = $image['url'] . ' 320w';
			}

			if ( empty( $image['alt'] ) ) {
				$image['alt'] = $image['title'];
			}

			$html .= '<source  data-srcset="' . $srcset . '"/>
				 <img class="lazyload" src="' . m_placehoder() . '" alt="' . $image['alt'] . '" sizes="' . m_maxsize( $image, $sz ) . '"/>';
		}
		return [
			'image'  => $image,
			'srcset' => $html,
		];
	}

}

function m_video( $id ) {
	$open      = '';
	$close     = '';
	$video_url = get_field( 'link', $id );
	if ( '' != $video_url ) {
		$open  = '<div class="video-push"><a href="' . $video_url . '" class="embedvideo">';
		$close = '</a>' . get_m_icon( 'play' ) . '</div>';
	}
		return [
			'head' => $open,
			'foot' => $close,
		];
}


/**
 * @param        $field
 * @param string $sz
 * @param string $class
 * @param bool  $video
 *
 * m_image($image,"medium",["fit"=> true, class="gallery__img", "video"=> false, ])
 */
function m_media( $field, $sz = 'medium', $class = '', $video = false, $fit = false ) {

	$html               = '';
	$source             = m_source( $field, $sz );
	$image              = $source['image'];
	$srcset             = $source['srcset'];
	$video_html['head'] = '';
	$video_html['foot'] = '';

	if ( $video ) {
		$video_html = m_video( $image['ID'] );
	}

	if ( 'image/svg+xml' == $image['mime_type'] ) {
		$html .= $video_html['head'] . '<figure ' . m_wrapper( $image, $sz ) . '><picture class="svg-wrap">' . $srcset . '</picture></figure>' . $video_html['foot'];
	} elseif ( true === $fit ) {
		$html .= $video_html['head'] . '<picture class="' . $class . '">' . $srcset . '</picture>' . $video_html['foot'];
	} else {
		$html .= $video_html['head'] . '<picture class="m-img-wrap ' . $class . '" ' . m_wrapper( $image, $sz ) . '>' . $srcset . '</picture>' . $video_html['foot'];
	}

	return $html;
}


function get_m_image( $field, $sz = 'medium', $class = '', $video = false ) {
	return m_media( $field, $sz, $class, $video );
}

function get_m_image_ofit( $field, $sz = 'medium', $class = '', $video = false ) {
	return m_media( $field, $sz, $class, $video, true );
}

function m_image( $field, $sz = 'medium', $class = '', $video = false ) {
	echo get_m_image( $field, $sz, $class, $video );
}

function m_image_ofit( $field, $sz = 'medium', $class = '', $video = false ) {
	echo get_m_image_ofit( $field, $sz, $class, $video, true );
}
