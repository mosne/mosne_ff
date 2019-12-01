<?php
if (function_exists('acf_add_options_page')) {
    acf_add_options_page();
    /*
    //acf_add_options_page("Adv");
    add_filter('acf/settings/google_api_key', function () {
       return 'xxx';
   	});
*/

}

/*
add_action('acf/init', 'my_acf_init');
function my_acf_init() {

    // check function exists
    if( function_exists('acf_register_block') ) {

        // register a testimonial block
        acf_register_block(array(
                'name'    => 'mosne-svg',
                'title'    => __('Svg block'),
                'description'  => __('A custom svg block.'),
                'render_callback' => 'my_acf_block_render_callback',
                'category'   => 'common',
                'icon'    => 'format-image',
                'keywords'   => array( 'image', 'svg','inline','vector' )
            ));
    }
}


function my_acf_block_render_callback( $block ) {

    // convert name ("acf/testimonial") into path friendly slug ("testimonial")
    $slug = str_replace('acf/', '', $block['name']);

    // include a template part from within the "template-parts/block" folder
    if( file_exists(STYLESHEETPATH . "/block-{$slug}.php") ) {
        include( STYLESHEETPATH . "/block-{$slug}.php" );
    }
}
*/