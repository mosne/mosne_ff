<?php
/*
 * m_icon
 */

$m_iconStorage = array();

function m_icon($fileName, $force = false, $print = true, $path = 'assets/icons/') {
    global $m_iconStorage;
    $keyExists = array_key_exists($path.$fileName, $m_iconStorage);

    if ( $keyExists && $force === false) {
        $output = get_partials('icon-svg', $m_iconStorage[$path.$fileName], false);
    }
    else {
        $svg = '<svg class="icon icon-'.$fileName.'"';

        if (!$keyExists) {
            $svg .= '" id="icon-'.$fileName.'"';
            $m_iconStorage[$path.$fileName] = $fileName;
        }

        $output = file_get_contents($path.$fileName.'.svg');
        $output = preg_replace('/<svg/', $svg, $output);
    }

    if ($print) {
        print $output;
    }

    return $output;
}