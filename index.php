<?php get_header(); ?>
	<div class="blocks-container">
		<?php
		if ( have_posts() ) :
			?>
			<ul>
				<?php
				while ( have_posts() ) :
					the_post();
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
		endif;
		// wp_pagenavi();
		?>
	</div>
<?php
get_footer();
