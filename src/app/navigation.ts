import type { MouseEvent } from 'react';

let activeScrollAnimation: number | null = null;

function animateScrollTo(targetTop: number) {
  if (activeScrollAnimation !== null) {
    cancelAnimationFrame(activeScrollAnimation);
  }

  const startTop = window.scrollY;
  const distance = targetTop - startTop;
  const duration = 550;
  const startTime = performance.now();

  const step = (currentTime: number) => {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);

    window.scrollTo(0, startTop + distance * easedProgress);

    if (progress < 1) {
      activeScrollAnimation = requestAnimationFrame(step);
    } else {
      activeScrollAnimation = null;
    }
  };

  activeScrollAnimation = requestAnimationFrame(step);
}

export function scrollToTop() {
  window.history.pushState(null, '', `${window.location.pathname}${window.location.search}`);
  animateScrollTo(0);
}

export function scrollToSection(
  event: MouseEvent<HTMLAnchorElement>,
  sectionId: string,
) {
  const section = document.getElementById(sectionId);
  if (!section) return;

  event.preventDefault();

  const scrollMargin = parseFloat(getComputedStyle(section).scrollMarginTop) || 0;
  const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
  const targetTop = Math.min(
    Math.max(0, section.getBoundingClientRect().top + window.scrollY - scrollMargin),
    maxScrollTop,
  );

  window.history.pushState(null, '', `#${sectionId}`);
  animateScrollTo(targetTop);
}
