---
layout: post
title: "Building Smooth Icon Animations with Jekyll and Claude"
date: 2025-12-29 15:30:00 -0500
categories: jekyll animation css javascript
excerpt: "How I transformed my static projects section into a smooth, animated carousel using Jekyll collections, CSS icon cropping, and custom JavaScript animations—all with Claude's help."
---

Today I spent some time modernizing my portfolio's projects section, and the results were pretty amazing. What started as a simple request to make my projects more manageable turned into a deep dive into Jekyll collections, CSS sprite animations, and buttery-smooth JavaScript interactions.

## The Challenge: From Static to Dynamic

My original projects section was hardcoded HTML—functional but a pain to maintain. Every time I wanted to add or reorder a project, I had to dig into the template and manually update the markup. Not exactly the developer experience I was going for.

The goal was simple: create a `_projects` directory that works like Jekyll's built-in `_posts`, but for showcasing my work instead of blog content.

## Setting Up Jekyll Collections

The first step was configuring Jekyll to recognize projects as a custom collection. This required adding just a few lines to `_config.yml`:

```yaml
collections:
  projects:
    output: false
```

Setting `output: false` was important—unlike blog posts, I didn't want individual pages for each project. They would live entirely within the main portfolio page.

Next, I created markdown files in `_projects/` with front matter like this:

```yaml
---
title: "Senior Software Engineer at Firework"
icon: "img/icons.png"
icon_class: "crop-img crop-video"
description: "Worked with a small team building social commerce experiences..."
external_url: "https://firework.com"
from_date: 2020-07-01
to_date: 2022-12-01
---
```

The template could then iterate through projects chronologically:

```liquid
{% assign sorted_projects = site.projects | sort: 'to_date' | reverse %}
{% for project in sorted_projects %}
  <!-- render project -->
{% endfor %}
```

## The Icon System: CSS Sprite Magic

Rather than managing dozens of individual icon files, I consolidated everything into a single `icons.png` sprite sheet. Using CSS `object-fit` and `object-position`, I could crop out individual icons:

```scss
.crop-img {
  width: 309px;
  height: 263px;
  object-fit: none;
}

.crop-video {
  object-position: -425px -82px;
}
```

To keep the layout consistent, I wrapped each icon in a fixed-size container:

```scss
.icon-wrapper {
  width: 128px;
  height: 128px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
```

This approach gave me pixel-perfect icon control while keeping my asset management simple.

## Building the Carousel

Static grids are so 2010. I wanted something more interactive—a swipeable carousel that would work beautifully on both desktop and mobile.

The HTML structure was straightforward:

```html
<div class="carousel-container">
  <div class="carousel-track" id="projectCarousel">
    {% for project in sorted_projects %}
      <div class="carousel-card">
        <!-- project content -->
      </div>
    {% endfor %}
  </div>
</div>
```

The CSS handled the horizontal scrolling and visual polish:

```scss
.carousel-track {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

.carousel-card {
  flex: 0 0 256px;
  background: #8cbc8b;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.carousel-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}
```

## The Animation Challenge

The trickiest part was creating smooth hover-triggered scrolling. I wanted desktop users to be able to hover over partially visible cards and have the carousel automatically scroll to reveal them—but without jittery, competing animations.

After several iterations, the winning approach used:

1. **Partial visibility detection**: Only trigger on cards that are actually cut off
2. **Fixed scroll distances**: Always move 1.5 card widths for consistent pacing  
3. **Animation throttling**: 2-second cooldowns prevent overlapping animations
4. **Custom easing**: Quadratic ease-in-out for natural motion

```javascript
function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function smoothScrollTo(element, targetPosition, duration = 1200) {
  const startPosition = element.scrollLeft;
  const distance = targetPosition - startPosition;
  const startTime = performance.now();
  
  function animation(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutQuad(progress);
    
    element.scrollLeft = startPosition + (distance * easedProgress);
    
    if (progress < 1) {
      requestAnimationFrame(animation);
    }
  }
  
  requestAnimationFrame(animation);
}
```

## Working with Claude

What made this project particularly interesting was doing it all as a conversation with Claude. Instead of getting stuck in my usual patterns, I could quickly explore different approaches:

- "Let's try edge-zone triggers instead of partial visibility"
- "The easing feels jerky—can we make it smoother?"
- "What if we prevent animation cancellation?"

Each iteration was fast and focused. Claude understood both the technical requirements and the UX goals, suggesting solutions that I might not have considered on my own.

## The Results

The final carousel feels incredibly smooth. Desktop users get intelligent hover scrolling that reveals partially hidden projects, while mobile users get native touch scrolling. The CSS animations provide subtle feedback that makes the interface feel responsive and polished.

Most importantly, adding new projects is now trivial—just drop a markdown file in `_projects/` with the right front matter, and it automatically appears in chronological order.

## Key Takeaways

1. **Jekyll collections are underused**: They're perfect for any content that isn't blog posts
2. **CSS sprites still rock**: One image file beats managing dozens of icons
3. **Animation timing is everything**: Throttling and easing curves matter more than complex logic
4. **AI pair programming works**: Having Claude as a sounding board accelerated every decision

The whole conversation took about an hour and resulted in a portfolio section that feels modern and maintainable. Not bad for a Sunday afternoon with an AI coding buddy.
