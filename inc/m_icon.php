<?php

/** example: m_icon("facebook","header__social");
 *
 * @param string $file_name
 * @param string $classes
 *
 * @return string
 */
function get_m_icon( string $file_name, string $classes = '' ) {
	return '<svg class="icon icon-' . $file_name . ' ' . $classes . '" aria-hidden="true" focusable="false">
        <use xlink:href="' . get_template_directory_uri() . '/dist/img/icons/icons.svg#icon-' . $file_name . '"></use>
</svg>';
}

function m_icon( $file_name, $classes = '' ) {
	echo get_m_icon( $file_name, $classes = '' ); //phpcs:ignore
}
