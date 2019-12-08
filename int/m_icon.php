<?php

function includeWithVariables($filePath, $variables = array(), $print = true, $nbInclude = 1){
    // if $variables is integer switch with $nbInclude
    if (gettype($variables) === 'integer') {
        $nbInclude = $variables;
        $variables = array();
    }
    // else convert other types as array
    elseif (gettype($variables) !== 'array') {
        $variables = array('variable' => $variables);
    }

    $output = NULL;
    if(file_exists($filePath)){
        // Extract the variables to a local namespace
        extract($variables);

        // Start output buffering
        ob_start();

        for ($i = 0; $i < $nbInclude; $i++) {
            // Include the template file
            include $filePath;
        }

        // End buffering and return its contents
        $output = ob_get_clean();
    }
    if ($print) {
        print $output;
    }
    return $output;
}

// shortcut for including partials/ files
function get_partials($file, $variables = array(), $nbInclude = 1, $print = true) {
    if ($nbInclude === false) {
        $nbInclude = 1;
        $print = false;
    }

    return includeWithVariables(get_template_directory().'/partials/'.$file.'.php', $variables, $print, $nbInclude);
}

function get_local_file_contents( $file_path ) {
    ob_start();
    include $file_path;
    $contents = ob_get_clean();

    return $contents;
}

/*
 * m_icon
 */

$m_iconStorage = array();

function m_icon($fileName, $force = false, $print = true, $path = 'assets/svg/') {
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

        $output = file_get_contents(get_template_directory().'/'.$path.$fileName.'.svg');
        $output = preg_replace('/<svg/', $svg, $output);
    }

    if ($print) {
        print $output;
    }

    return $output;
}