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
	return 'class="m-img-wrap" style="padding-bottom:' . m_bottom( $image, $sz ) . '%"';
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

	return (object) array(
		'width'  => $width,
		'height' => $height,
	);
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
 * @param $size
 *
 * @return string
 */
function m_file_size( $size ) {
	$a = array( 'B', 'KB', 'MB', 'GB', 'TB', 'PB' );

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
		$search = array(
			'@<\?[\s\S]*?[ \t\n\r]*>@',            // Remove XML
			'@<!DOCTYPE[\s\S]*?[ \t\n\r]*>@',       // Remove !DOCTYPE
			'@<![\s\S]*?--[ \t\n\r]*>@',            // Remove COMMENTS
		);

		$replace       = array( '', '', '', '', '', '' );
		$clean         = preg_replace( $search, $replace, $document );
		$svg_md5_cache = $clean;

		set_transient( $trans_p . $mid, $document, 3 * 86400 ); //3 * DAYS_IN_SECONDS

	}

	return $svg_md5_cache;

}


/**
 * @param        $field
 * @param string $sz
 * @param bool   $video
 */
function m_image( $field, $sz = 'medium', $video = false ) {

	if ( is_array( $field ) ) {
		$image = $field;
	} else {
		$image = get_field( $field );
	}

	if ( $image['mime_type'] == 'image/svg+xml' ) {

		if ( $image ) {

			$svg_file_path = get_attached_file( $image['id'] );
			echo '<div ' . m_wrapper( $image, $sz ) . '><div class="svg-wrap">
                ' . mosne_svg( $svg_file_path, $image['id'] ) . '
                </div></div>';
		}
	} else {

		$srcset = wp_get_attachment_image_srcset( $image['id'], $sz, true );

		if ( $srcset == '' ) {
			$srcset = $image['url'] . ' 320w';
		}

		if ( $image ) {
			if ( $video ) {
				$video_url = get_field( 'link', $image['ID'] );
			}
			if ( $image['mime_type'] == 'image/gif' ) {
				echo '<div ' . m_wrapper( $image, $sz ) . '>
				<img src="' . m_placehoder() . '" alt="' . $image['title'] . '" ' . $extraok . '/>
				</div>';
			} else {

				if ( $video_url != '' ) {
					echo '<div class="video-push"><a href="' . $video_url . '" class="embedvideo">';
				}
				echo '<div ' . m_wrapper( $image, $sz ) . '><img class="lazyload" src="' . m_placehoder() . '" data-sizes="auto" data-srcset="' . $srcset . '" alt="' . $image['title'] . '"/></div>';
				if ( $video_url != '' ) {
					echo '</a></div>';
				}
			}
		}
	}
}


/**
 * @param        $field
 * @param string $sz
 * @param string $mode
 */
function obj_m_image( $field, $sz = 'medium', $mode = 'cover' ) {

	if ( is_array( $field ) ) {
		$image = $field;
	} else {
		$image = get_field( $field );
	}

	if ( $srcset == '' ) {
		$srcset = $image['url'] . ' 320w';
	}

	$aspectratio = bcdiv( m_bottom( $image, $sz ), 100, 2 );

	$srcset = wp_get_attachment_image_srcset( $image['id'], $sz, true );

	if ( $srcset == '' ) {
		$srcset = $image['url'] . ' 320w';
	}

	// $srcset_h = preg_replace('/(.*?)(\d+)x(\d+)(.*?)\s(\d+)(w)/', '$0 $3h', $srcset);

	if ( $image ) {

		echo '<img class="imagecontainer-img lazyload" data-sizes="auto" data-parent-fit="' . $mode . '" data-aspectratio="' . $aspectratio . '" src="' . m_placehoder() . '" data-srcset="' . $srcset . '" alt="' . $image['title'] . '"/>';
	}
}


/**
 * @param        $field
 * @param        $ratio
 * @param string $sz
 */
function m_ratioimage( $field, $ratio, $sz = 'medium' ) {
	if ( is_array( $field ) ) {
		$image = $field;
	} else {
		$image = get_field( $field );
	}

	$srcset = wp_get_attachment_image_srcset( $image['id'], $sz );

	if ( $srcset == '' ) {
		$srcset = $image['url'] . ' 320w';
	}
	$ih = $image['sizes'][ $sz . '-height' ];
	$ww = $image['sizes'][ $sz . '-width' ];
	$ch = $ww * $ratio;

	$diff  = ( ( $ch - $ih ) * 100 ) / $ih;
	$vdiff = ( ( $ch - $ih ) * 100 ) / $ww;

	if ( $diff > 0 ) {
		$style = 'width:' . ( 100 + $diff ) . '%;margin-left:-' . ( $diff / 2 ) . '%;';
	} elseif ( $diff < 0 ) {
		$style = 'margin-top:' . ( $vdiff / 2 ) . '%;';
	} else {
		$style = '';
	}

	if ( $image ) {

		echo '<div class="m-img-wrap m-ratio" style="padding-bottom:' . ( $ratio * 100 ) . '%;"><img class="lazyload" style="' . $style . '"
                        src="' . $image['sizes']['small'] . '"
                        data-sizes="auto"
                        data-srcset="' . $srcset . '"
                        alt="' . $image['title'] . '"/></div>';
	}
}


/**
 * @param $media
 */
function m_caption( $media ) {
	if ( $media ) {
		$c_title   = get_field( 'title_' . pll_current_language(), $media['ID'] );
		$c_caption = get_field( 'caption_' . pll_current_language(), $media['ID'] );

		if ( $c_title != '' ) {
			echo '<div class="captions">
    <p><strong>' . $c_title . '</strong><br>
                ' . $c_caption . '</p>
         </div>';
		}
	}
}


/**
 * @param $file
 */
function gm_image( $file ) {

	if ( $file ) {

		//m_print($file);
		$video_url = get_field( 'link', $file['ID'] );

		if ( $file['type'] == 'image' && $video_url == '' ) {

			//immagine
			echo '<a class="zoom" data-rel="gallery-' . $post->ID . '"  href="' . $file['url'] . '">';
			m_image( $file, 'medium', false );
			echo '</a>';
			m_caption( $file );

		} elseif ( $file['type'] == 'image' && $video_url != '' ) {

			if ( preg_match( '/archivioluce.com/i', $video_url ) ) {

				echo '<div class="video-push"><a class="avideo" data-rel="gallery-media-' . $post->ID . '"  href="' . $video_url . '" target="_blank">';

			} else {
				echo '<div class="video-push"><a class="zoom avideo" data-rel="gallery-media-' . $post->ID . '"  href="' . $video_url . '">';
			}

			m_image( $file, 'medium', false );
			echo '</a></div>';
			m_caption( $file );

		} elseif ( $file['type'] == 'audio' ) {
			echo '<figure class="wp-block-audio"><audio controls="" controlsList="nodownload" src="' . $file['url'] . '"></audio></figure>';
			m_caption( $file );
		} else {

			echo '<div class="documenti"><a href="' . $file['url'] . '" target="_blank">';
			m_caption( $file );
			echo '</a></div>';

		}
	}
}

/**
 * @param        $image
 * @param int    $c
 * @param string $video
 */
function zcm_image( $image, $c = 0, $video = '' ) {
	global $post;
	if ( $video != '' ) {
		echo '<a class="zoom" data-rel="gallery-' . $post->ID . '" href="' . $video . '" data-sub-html="#caption-' . $image['id'] . '" title="' . $image['title'] . '">';
	} else {
		echo '<a class="zoom" data-rel="gallery-' . $post->ID . '"  href="' . $image['url'] . '" data-sub-html="#caption-' . $image['id'] . '" title="' . $image['title'] . '">';
	}
	echo $c . '</a>';
	echo '<div id="caption-' . $image['id'] . '" class="hide"><h4>' . $post->post_title . '</h4></div>';
	/*'.$image['caption'].'*/
}
