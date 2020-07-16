<?php get_header();
the_post(); ?>
<main id="bd">
	<article class="push">
		<header>
		   <h1 class="big">
			<?php the_title(); ?></h1>
			<?php
			$a = '<figure class="wp-block-image size-large">
					<img src="https://2020.mosne.it/wp-content/uploads/2020/06/balance82-55-1024x576.jpg" alt="" class="wp-image-2489" srcset="https://2020.mosne.it/wp-content/uploads/2020/06/balance82-55-1024x576.jpg 1024w, https://2020.mosne.it/wp-content/uploads/2020/06/balance82-55-300x169.jpg 300w, https://2020.mosne.it/wp-content/uploads/2020/06/balance82-55-768x432.jpg 768w, https://2020.mosne.it/wp-content/uploads/2020/06/balance82-55.jpg 1280w" sizes="(max-width: 1024px) 100vw, 1024px">
				  </figure>';

			//echo get_the_post_thumbnail( null, "medium" );
			// $post_thumbnail_id = get_post_thumbnail_id( $post );
			//echo $post_thumbnail_id;
			// $img = wp_get_attachment_image( $post_thumbnail_id , "medium ");
			?>
			<?php m_image( 'image', 'hd' ); ?>
			<?php m_image( 'image', 'hd', 'gallery__img', array( 'fit' => true ) ); ?>
		</header>
		<div class="wysiwyg">
				<?php the_content(); ?>
		</div>
	</article>
</main>
<?php m_edit(); ?>
<?php get_footer(); ?>
