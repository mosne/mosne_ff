<?php

// POLYLANG

$m_strings=array(
'STRING',
);

function m_register_strings($strings){
    if( function_exists('pll_register_string')){
        if(is_array($strings)){
        sort($strings);
        $theme = wp_get_theme();
        foreach($strings as $string){
            pll_register_string($string, str_replace(' ', '-', strtolower($string)) , 'mosne');
        }
    }
    }
}
m_register_strings($m_strings);