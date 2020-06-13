<?php

/*
 * m_icon
 */

$m_iconStorage = array();

function m_icon($fileName, $force = false, $print = true, $path = 'assets/icons/') {
    global $m_iconStorage;
    $keyExists = array_key_exists($path.$fileName, $m_iconStorage);

    if ( $keyExists && $force === false) {
        $output = '<svg class="icon icon-'.$fileName.'" aria-hidden="true" role="img">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-'.$fileName.'"></use>
        </svg>';
    }

    else {
        $svg = '<svg class="icon icon-'.$fileName.'"';

        if (!$keyExists) {
            $svg .= '" id="icon-'.$fileName.'"';
            $m_iconStorage[$path.$fileName] = $fileName;
        }

        $output = file_get_contents(get_template_directory().'/'.$path.$fileName.'.svg');
        $output = preg_replace('/<svg/', $svg, $output);
    }

    if ($print) {
        print $output;
    }

    return $output;
}