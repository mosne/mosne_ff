;(function($) {
  var body = $('body')
  $('#selector').on('click', function(e) {
    e.preventDefault()
    body.toggleClass('menu-main-open')
    const selector = $('#selector')
    const expandend = selector.attr('aria-expanded') === 'false' ? 'true' : 'false'
    selector.attr('aria-expanded', expandend)
    const menu = $('#menu')
    const hidden = menu.attr('aria-hidden') === 'false' ? 'true' : 'false'
    menu.attr('aria-hidden', hidden)
  })
})(jQuery)
