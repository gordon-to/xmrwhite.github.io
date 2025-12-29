document.addEventListener('DOMContentLoaded', function() {
  const carousel = document.getElementById('projectCarousel');
  const cards = carousel.querySelectorAll('.carousel-card');
  
  if (!carousel || cards.length === 0) return;
  
  let isAnimating = false;
  let scrollTimeout = null;
  let lastScrollTime = 0;
  let currentHoveredCard = null;
  let hoverDirection = null;
  
  // Custom easing function (smoother ease-in-out)
  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }
  
  // Custom smooth scroll with acceleration/deceleration
  function smoothScrollTo(element, targetPosition, duration = 1200) {
    const startPosition = element.scrollLeft;
    const distance = targetPosition - startPosition;
    const startTime = performance.now();
    isAnimating = true;
    
    function animation(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutQuad(progress);
      
      element.scrollLeft = startPosition + (distance * easedProgress);
      
      if (progress < 1) {
        requestAnimationFrame(animation);
      } else {
        isAnimating = false;
      }
    }
    
    requestAnimationFrame(animation);
  }
  
  function performScroll(direction) {
    const now = Date.now();
    
    // Don't scroll if we just scrolled or if already animating
    if (isAnimating || (now - lastScrollTime < 2000)) {
      return;
    }
    
    const containerRect = carousel.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const cardWidth = 256 + 20; // card width + gap
    const scrollDistance = cardWidth * 1.5;
    
    let targetPosition;
    if (direction === 'left') {
      targetPosition = Math.max(0, carousel.scrollLeft - scrollDistance);
    } else {
      const maxScroll = carousel.scrollWidth - containerWidth;
      targetPosition = Math.min(maxScroll, carousel.scrollLeft + scrollDistance);
    }
    
    smoothScrollTo(carousel, targetPosition);
    lastScrollTime = now;
    
    // Set a timeout to check if we should continue scrolling
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      if (currentHoveredCard && hoverDirection) {
        checkContinuousScroll();
      }
    }, 2000);
  }
  
  function checkContinuousScroll() {
    if (!currentHoveredCard || isAnimating) return;
    
    const cardRect = currentHoveredCard.getBoundingClientRect();
    const containerRect = carousel.getBoundingClientRect();
    
    const cardLeft = cardRect.left;
    const cardRight = cardRect.right;
    const containerLeft = containerRect.left;
    const containerRight = containerRect.right;
    
    // Check if the hovered card is still partially visible
    const isPartiallyVisible = (
      (cardLeft < containerLeft && cardRight > containerLeft) ||
      (cardRight > containerRight && cardLeft < containerRight)
    );
    
    if (isPartiallyVisible) {
      performScroll(hoverDirection);
    }
  }
  
  // Desktop hover scrolling
  if (window.innerWidth >= 768) {
    // Clear hover tracking when mouse leaves carousel
    carousel.addEventListener('mouseleave', function() {
      currentHoveredCard = null;
      hoverDirection = null;
      clearTimeout(scrollTimeout);
    });
    
    cards.forEach((card, index) => {
      card.addEventListener('mouseenter', function() {
        currentHoveredCard = card;
        
        const cardRect = card.getBoundingClientRect();
        const containerRect = carousel.getBoundingClientRect();
        
        const cardLeft = cardRect.left;
        const cardRight = cardRect.right;
        const containerLeft = containerRect.left;
        const containerRight = containerRect.right;
        
        // Check if card is partially visible (cut off on either side)
        const isPartiallyVisible = (
          (cardLeft < containerLeft && cardRight > containerLeft) ||
          (cardRight > containerRight && cardLeft < containerRight)
        );
        
        if (isPartiallyVisible) {
          // Determine scroll direction based on which side is cut off
          if (cardLeft < containerLeft) {
            hoverDirection = 'left';
            performScroll('left');
          } else if (cardRight > containerRight) {
            hoverDirection = 'right';
            performScroll('right');
          }
        }
      });
      
      card.addEventListener('mouseleave', function() {
        if (currentHoveredCard === card) {
          currentHoveredCard = null;
          hoverDirection = null;
        }
      });
    });
  }
});