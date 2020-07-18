<?php get_header(); ?>
<main id="bd">
	<article class="page">

			<?php query_posts( 'posts_per_page=-1' ); if ( have_posts() ) : ?>
				<?php
				while ( have_posts() ) :
					the_post();
					?>
				 <div class="grid">
					<div class="item"><div class="pallino" style="background-color:<?php the_field( 'color' ); ?>"></div></div>
					<div class="item"><?php m_icon( 'facebook' ); ?></div>
					<div class="item">
						<a href="<?php the_permalink();?>"><?php the_title(); ?></a></div>
					<?php $link = get_field( 'link' ); ?>
					<div class="item"><a href="<?php echo $link; ?>" target="_black"><?php echo nicelink_url( $link ); ?></a></div>
					<div class="item"><?php the_field( 'size' ); ?> | <?php m_edit(); ?></div>
				</div>
					<?php
			endwhile;
endif;
			?>

   </article>
</main>
<?php // wp_pagenavi(); ?>
<?php get_footer(); ?>
