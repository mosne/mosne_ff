<?php

/**
 * @param       $filePath
 * @param array $variables
 * @param bool  $print
 * @param int   $nbinclude
 *
 * @return false|string|null
 */
function m_include( $filePath, $variables = array(), $print = true, $nbinclude = 1 ) {

	// if $variables is integer switch with $nbInclude
	if ( gettype( $variables ) === 'integer' ) {
		$nbinclude = $variables;
		$variables = array();
	}
	// else convert other types as array
	elseif ( gettype( $variables ) !== 'array' ) {
		$variables = array( 'variable' => $variables );
	}

	$output = null;
	if ( file_exists( $filePath ) ) {
		// Extract the variables to a local namespace
		extract( $variables );

		// Start output buffering
		ob_start();

		for ( $i = 0; $i < $nbInclude; $i++ ) {
			// Include the template file
			include $filePath;
		}

		// End buffering and return its contents
		$output = ob_get_clean();
	}
	if ( $print ) {
		print $output;
	}
	return $output;
}

/**
 * @param       $file
 * @param array $variables
 * @param int   $nbInclude
 * @param bool  $print
 *
 * @return false|string|null
 */
function m_section( $file, $variables = array(), $nbInclude = 1, $print = true ) {
	if ( $nbInclude === false ) {
		$nbInclude = 1;
		$print     = false;
	}

	return m_include( 'sections/' . $file . '.php', $variables, $print, $nbInclude );
}
