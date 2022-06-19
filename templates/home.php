<?php
/*
Template Name: Home
*/
get_header();
the_post(); ?>
	<header class="container">
		<h1><?php the_title(); ?></h1>
	</header>
	<div class="blocks-container">
		<?php the_content(); ?>
		<?php m_edit(); ?>
	</div>
	<div class="loop">
		<?php
		// The Query
		$the_query = new WP_Query(
			[
				'post_type'      => 'post',
				'posts_per_page' => - 1,
			]
		);

		// The Loop
		if ( $the_query->have_posts() ) :
			?>
			<ul>
				<?php
				while ( $the_query->have_posts() ) :
					$the_query->the_post();
					?>
					<li>
						<?php
						get_template_part( 'template-parts/loops/loop-post' );
						?>
					</li>
					<?php
				endwhile;
				?>
			</ul>
			<?php
			wp_reset_postdata();
		endif;
		?>
	</div>
<?php
get_footer();
