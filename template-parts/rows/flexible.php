<?php
if ( have_rows( 'slides' ) ) :

	// loop through the rows of data
	while ( have_rows( 'slides' ) ) :
		the_row();

		include 'blocks/' . get_row_layout() . '.php';

	endwhile;

endif;
