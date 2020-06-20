<nav id="nav-primary" class="nav-primary" aria-label="<?php _e('Main navigation','mosne');?>" role="navigation">
	<button class="menu-toggle accessible-megamenu-toggle">
		<span class="visuallyhidden">Menu</span>
		<span class="menu-icon--open"><?php m_icon( 'menu' ); ?></span>
		<span class="menu-icon--close"><?php m_icon( 'close' ); ?></span>
	</button>
<?php
wp_nav_menu(
	array(
		'theme_location'  => 'primary',
		'container'       => '',
		'menu_id'         => 'menu-main',
		'menu_class'      => 'menu-main',
		'walker'          => new Accessible_Menu_Walker(),
	)
);
?>
</nav>
