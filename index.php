<?php get_header();?>
<main id="bd">
    <article class="page">
    <?php if ( have_posts() ) : ?>
    	<?php while ( have_posts() ) : the_post(); ?>
        <?php m_icon('youtube'); ?>
        <?php m_icon('youtube'); ?>
        <?php m_icon('youtube'); ?>
        <?php m_icon('youtube'); ?>
        <?php the_title();?>
    <?php endwhile; endif;?>
   </article>
</main>
<?php // wp_pagenavi(); ?>
<?php get_footer(); ?>
