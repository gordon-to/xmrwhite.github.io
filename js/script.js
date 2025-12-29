$(document).ready(function() {
  var stickyNav = function() {
    var stickyNavTop = window.innerHeight,
        scrollTop    = $(window).scrollTop();

    $('header').css('opacity', 1 - scrollTop / stickyNavTop);

    if (scrollTop > stickyNavTop) {
      $('#nav').addClass('sticky');
      $('#about').addClass('contentpush');
    } else {
      $('#nav').removeClass('sticky');
      $('#about').removeClass('contentpush');
    }
  };

  var scrollTo = function(el, off){
    $('html, body').animate({
      scrollTop: $(el).offset().top - off
    }, 650);
  };

  stickyNav();

  $(window).scroll(stickyNav);
  window.onresize = stickyNav;

  $('header').click(function() { scrollTo('nav', 0); });
  $('#title').click(function() { scrollTo('body', 0); });
  $('#navabout').click(function() {
    if (scrollTo <= window.innerHeight) scrollTo('nav', 0);
    else scrollTo('#about', 0);
  });
  $('#navprojects').click(function() { scrollTo('#projects', 50); });
  $('#navblog').click(function() { 
    // If we're on a small screen or want to go to dedicated blog page, uncomment next line:
    // window.location.href = '/blog/';
    scrollTo('#blog', 50); 
  });
  $('#navvote').click(function() { scrollTo('#vote', 50); });
  $('#navcontact').click(function() { scrollTo('#contact', 50); });
  $('#navright').click(function() { scrollTo('#vote', 50); });
});
