<?php

/** example: get_m_query("custom_news",['posts_per_page' => 10 ]);
 *
 * @param string $name
 * @param array $args
 *
 * @return WP_Query
 */
function get_m_query( string $name = 'post', array $args = [] ): WP_Query {
	$mosne_query_args = [];

	//add here your custom query

	// all others pages
	if ( 'page' === $name ) {
		$mosne_query_args = [
			'post_type'     => 'page',
			'no_found_rows' => true,
		];
	} elseif ( 'manual' === $name ) {
		$mosne_query_args = [
			'post_type' => [ 'page', 'post' ],
			'order'     => 'ASC',
			'orderby'   => 'post__in',
		];
	} elseif ( 'custom' === $name ) {
		$mosne_query_args = [
			'post_type' => [ 'page', 'post' ],
		];
	} else {
		// default output: all others posts
		$mosne_query_args = [
			'post_type'     => 'post',
			'no_found_rows' => true,
		];
	}

	return new WP_Query(
		wp_parse_args(
			$args,
			$mosne_query_args
		)
	);
}
