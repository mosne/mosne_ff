<?php

/** example: m_icon("facebook","header__social");
 * @param $fileName
 * @param string $classes
 * @return string
 */
function get_m_icon($fileName, $classes = '') {

        $output = '<svg class="icon icon-' . $fileName . ' '. $classes .'" aria-hidden="true" focusable="false">
        <use xlink:href="' . get_template_directory_uri() . '/dist/icons.svg#icon-' . $fileName . '"></use>
</svg>';
return $output;
}

function m_icon($fileName, $classes = ''){
        echo get_m_icon($fileName, $classes = '');
}