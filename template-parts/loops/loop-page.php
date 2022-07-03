<article class="loop loop--page" data-seo-container>
	<figure role="figure" class="loop__thumb">
		<?php the_post_thumbnail(); ?>
	</figure>
	<h3 class="loop__title">
		<a href="<?php the_permalink(); ?>" data-seo-target>
			<?php the_title(); ?>
		</a>
	</h3>
	<div class="loop__text">
		<?php the_excerpt(); ?>
	</div>
</article>
