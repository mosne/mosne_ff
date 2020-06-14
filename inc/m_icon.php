<?php

/*
 * m_icon
 * example: m_icon("facebook");
 */

function m_icon( $fileName, $force = false, $print = true, $path = 'assets/icons/' ) {

	if ( $force === false ) {
		$output = '<svg class="icon icon-' . $fileName . '" aria-hidden="true" role="img">
                <use xlink:href="' . get_template_directory_uri() . '/dist/icons.svg#icon-' . $fileName . '"></use>
        </svg>';
	} else {
		$svg    = '<svg class="icon icon-' . $fileName . '-' . $force . '"';
		$svg   .= '" id="icon-' . $fileName . '-' . $force . '"';
		$output = file_get_contents( get_template_directory() . '/' . $path . $fileName . '.svg' );
		$output = preg_replace( '/<svg/', $svg, $output );
	}

	if ( $print ) {
		print $output;
	}

	return $output;
}
