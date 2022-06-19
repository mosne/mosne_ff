<?php
/*
Template Name: Home
*/
get_header();
the_post();?>
<main id="bd">
	<article class="push">
		<header>
			<h1 class="big">
				<?php the_title(); ?>
			</h1>
		</header>
		<div class="wysiwyg">
				<?php the_content(); ?>
		</div>
		<div class="loop">
		<?php
			// The Query
			$the_query = new WP_Query(
				[
					'post_type'      => 'post',
					'posts_per_page' => -1,
				]
			);

			// The Loop
			if ( $the_query->have_posts() ) {
				echo '<ul>';
				while ( $the_query->have_posts() ) {
					$the_query->the_post();
					echo '<li>' . esc_html( get_the_title() ) . '</li>';
				}
				echo '</ul>';
			} else {
				// no posts found
			}
			/* Restore original Post Data */
			wp_reset_postdata();
			?>
		</div >
	</article >
</main >
<?php m_edit(); ?>
<?php get_footer(); ?>
