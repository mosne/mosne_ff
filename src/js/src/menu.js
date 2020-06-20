/**
 * Main Menu
 */
;(function($) {
  $('#nav-primary').accessibleMegaMenu({
    /* prefix for generated unique id attributes, which are required
       to indicate aria-owns, aria-controls and aria-labelledby */
    uuidPrefix: '.menu',

    /* css class used to define the megamenu styling */
    menuClass: 'menu-main',

    /* css class for a top-level navigation item in the megamenu */
    topNavItemClass: 'menu-item-has-children',

    /* css class for a megamenu panel */
    panelClass: 'sub-menu',

    /* css class for a group of items within a megamenu panel */
    panelGroupClass: 'sub-menu-group',

    /* css class for the hover state */
    hoverClass: 'hover',

    /* css class for the focus state */
    focusClass: 'focus',

    /* css class for the open state */
    openClass: 'open',
  })
})(jQuery)
