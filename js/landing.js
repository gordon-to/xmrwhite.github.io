$(document).ready(function() {
  // Modern sticky nav using Intersection Observer
  const header = document.querySelector('header');
  const nav = document.getElementById('nav');
  const about = document.getElementById('about');
  
  // Intersection Observer for header visibility
  if (header && nav) {
    const headerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Header is visible
            nav.classList.remove('sticky');
            if (about) about.classList.remove('contentpush');
          } else {
            // Header is out of view
            nav.classList.add('sticky');
            if (about) about.classList.add('contentpush');
          }
        });
      },
      { 
        rootMargin: '0px 0px -100% 0px', // Trigger when header completely leaves viewport
        threshold: 0 
      }
    );
    
    headerObserver.observe(header);
  }
  
  // Modern smooth scroll function
  const scrollTo = (target, offset = 0) => {
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if (!element) return;
    
    const targetPosition = element.offsetTop - offset;
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  };
  
  // Header opacity fade effect using scroll (simpler approach)
  let ticking = false;
  const updateHeaderOpacity = () => {
    if (header) {
      const scrollTop = window.pageYOffset;
      const headerHeight = header.offsetHeight;
      const opacity = Math.max(0, 1 - (scrollTop / headerHeight));
      header.style.opacity = opacity;
    }
    ticking = false;
  };
  
  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(updateHeaderOpacity);
      ticking = true;
    }
  };
  
  window.addEventListener('scroll', onScroll);
  updateHeaderOpacity(); // Initial call

  // Navigation click handlers
  $('header').click(() => scrollTo('#nav', 0));
  $('#title').click(() => scrollTo('body', 0));
  $('#navabout').click(() => scrollTo('#about', 0));
  $('#navprojects').click(() => scrollTo('#projects', 50));
  $('#navblog').click(() => scrollTo('#blog', 50));
  $('#navvote').click(() => scrollTo('#vote', 50));
  $('#navcontact').click(() => scrollTo('#contact', 50));
  $('#navright').click(() => scrollTo('#vote', 50));
});
