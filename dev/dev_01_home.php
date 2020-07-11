<?php
$pageTitle = 'Home';
$bodyClass = 'home';
require 'dev_header.php'; ?>
<main id="bd">
	<h1>Hello world</h1>
	<p><?php get_lorem( 100, 200 ); ?></p>
	<div class="demo" style="max-width:800px">
	<?php m_icon( 'close' ); ?>
	<?php m_image( 800, 600 ); ?>
	</div>

</div>
<?php require 'dev_footer.php'; ?>
