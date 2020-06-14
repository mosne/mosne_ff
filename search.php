<?php get_header();

?>
<main id="bd" class="scheda">

<header >
<?php
global $wp_query;
$total_results = $wp_query->found_posts;
?>
<h1 class="big">
<?php
echo $total_results . ' ';
_e( 'Risultati', $theme->name );
?>
</h1>
</header>

<?php if ( have_posts() ) : ?>
		<?php
		while ( have_posts() ) :
			the_post();
			?>

			<?php include 'loop-opere.php'; ?>

			<?php
	endwhile;
endif;
?>

</main>
<?php m_edit(); ?>
<?php get_footer(); ?>
