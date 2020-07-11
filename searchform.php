<form action="/" method="get" class="searchfrom" id="searchfrom">
	<label for="search" class="searchfrom__label"><?php esc_attr_e( $text, $domain )( 'Search' ); ?></label>
	<input type="text" name="s" id="search" autocomplete="off" value="<?php the_search_query(); ?>" class="searchfrom__input"/>
	<input type="submit" class="searchfrom__submit" value="<?php esc_attr_e( 'Submit' ); ?>"/>
</form>
