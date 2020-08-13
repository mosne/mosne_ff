<?php

/*
 * m_icon
 * example: m_icon("facebook","header__social");
 */

function m_icon( $fileName, $classes = '' , $print = true ) {

		$output = '<svg class="icon icon-' . $fileName . ' '. $classes .'" aria-hidden="true" role="img">
                <use xlink:href="' . get_template_directory_uri() . '/dist/icons.svg#icon-' . $fileName . '"></use>
        </svg>';
	if ( $print ) {
		print $output;
	}

	return $output;
}
