	<!-- end of bd -->
	<footer id="footer">
		<nav><?php dynamic_sidebar( 'footer' ); ?></nav>
		<div class="credits">© <?php date( 'Y' ); ?> <?php bloginfo( 'name' ); ?>. All right reserved. </div>
	</footer>
	<?php wp_footer(); ?>
	<script src="https://cdn.polyfill.io/v3/polyfill.min.js?features=es5,es6,fetch,Array.prototype.includes,CustomEvent,Element.prototype.closest,NodeList.prototype.forEach"></script>
</body>
</html>
