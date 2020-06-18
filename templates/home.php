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
	</article>
</main>
<?php m_edit(); ?>
<?php get_footer(); ?>
