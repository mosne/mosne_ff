"use strict";

var body = $("body");
$("#selector").on("click", function (e) {
  e.preventDefault();
  body.toggleClass("menu-main-open");
  selector = $("#selector");
  expandend = selector.attr("aria-expanded") == 'false' ? 'true' : 'false';
  selector.attr("aria-expanded", expandend);
  menu = $("#menu");
  expandend = menu.attr("aria-hidden") == 'false' ? 'true' : 'false';
  menu.attr("aria-hidden", expandend);
});