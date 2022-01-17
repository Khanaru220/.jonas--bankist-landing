'use strict'

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(el => el.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Scrolling btn 'Learn more'
const btnScrollTo = document.querySelector('.btn--scroll-to');

const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', e => {
  section1.scrollIntoView({ behavior: 'smooth' });
});

// Page Navigation

const smoothScroll = function (e) {
  if (e.target.className === 'nav__link') {
    console.log(`Link`);
    e.preventDefault();
    const section = document.querySelector(e.target.getAttribute('href'));
    section.scrollIntoView({ behavior: 'smooth' });
  }
};

const navLinks = document.querySelector('.nav__links');
navLinks.addEventListener('click', smoothScroll);

// ------
const h1 = document.querySelector('h1');

// -----
const containerTab = document.querySelector('.operations');

containerTab.addEventListener('click', e => {
  const clicked = e.target.closest('.operations__tab');

  // Guard clause
  if (!clicked) return;

  console.log(clicked.dataset.tab);
  // Step 1: remove -active
  containerTab
    .querySelector('.operations__content--active')
    .classList.remove('operations__content--active');

  containerTab
    .querySelector('.operations__tab--active')
    .classList.remove('operations__tab--active');
  // Step 2: add -active
  containerTab
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
  clicked.classList.add('operations__tab--active');
});

// ------ Hover navigation

const nav = document.querySelector('.nav');
const navLink = document.querySelector('.nav__link');
// console.log(navLinks.children[1])

const handleHover = function (e) {
  if (!e.target.classList.contains('nav__link')) return;

  const hover = e.target;
  const logo = hover.closest('.nav').querySelector('.nav__logo');
  // remove style 'sibling'
  nav.querySelectorAll('.nav__link').forEach(el => {
    // check whether e.target's parent --> <li> <a>
    el.style.opacity = el !== e.target ? this : 1;
  });
  // remove style 'logo'
  logo.style.opacity = this;
};

nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

// ---- Sticky navigation

const header = document.querySelector('.header');
const heightNav = nav.getBoundingClientRect().height;

const stickyNav = function (entries, observer) {
  entries.forEach(entry => {
    nav.classList[!entry.isIntersecting ? 'add' : 'remove']('sticky');
  });
};

const headerObsOption = {
  root: null,
  threshold: 0,
  rootMargin: `-${heightNav}px`,
};

const headerObserver = new IntersectionObserver(stickyNav, headerObsOption);

headerObserver.observe(header);

// ---- Reveal element

const sectionHeaders = document.querySelectorAll('.section__header');

const revealSection = function (entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // find section based on current entry's target
      entry.target.closest('.section').classList.remove('section--hidden');
      // clear oberve -- to prevent callbackFn run again
      observer.unobserve(entry.target);
    }
  });
};

const sectionTitleObsOption = {
  root: null,
  threshold: 1,
  rootMargin: '80px',
};

const sectionTitleObserver = new IntersectionObserver(
  revealSection,
  sectionTitleObsOption
);

// add observer method to watch each el
sectionHeaders.forEach(function (el) {
  // INITIAL -- add section--hidden
  el.closest('.section').classList.add('section--hidden');
  //
  sectionTitleObserver.observe(el);
});

// ---- Lazy loading

const lazyImgs = document.querySelectorAll('.lazy-img');

const lazyLoading = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);
  if (!entry.isIntersecting) return;
  // 1
  // entry.target.setAttribute('src', entry.target.dataset.src);
  entry.target.src = entry.target.dataset.src;
  // 2
  entry.target.addEventListener('load', () =>
    entry.target.classList.remove('lazy-img')
  );

  // 3
  observer.unobserve(entry.target);
};

const lazyObsOption = {
  root: null,
  threshold: 0.2,
};

const lazyObserver = new IntersectionObserver(lazyLoading, lazyObsOption);

lazyImgs.forEach(el => lazyObserver.observe(el));

// ---- TESTING

// 1 Selector
const slideContainer = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');

const dotsContainer = document.querySelector('.dots');

const positionArr = Array.from({ length: slides.length }, (_, i) => i); // [0,1,2]
const translateXArr = positionArr.map(v => v * 100); // [0,100,200]

let initPosition = 0;

const createDots = function () {
  slides.forEach((_, i) =>
    dotsContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot${
        i === 0 ? ' dots__dot--active' : ''
      }" data-slide="${i}"></button>`
    )
  );
};

// 2 Function

const nextSlide = function () {
  initPosition = initPosition < positionArr.length - 1 ? ++initPosition : 0;
  goToSlide();
};

const prevSlide = function () {
  initPosition = initPosition > 0 ? --initPosition : positionArr.length - 1;
  goToSlide();
};

const btnSlide = function (btn) {
  initPosition = +btn.dataset.slide;
  goToSlide();
};

const updateDot = function () {
  document.querySelectorAll('.dots__dot').forEach(dot => {
    dot.classList.remove('dots__dot--active');
  });

  //  update "dots"
  document
    .querySelector(`.dots__dot[data-slide="${initPosition}"]`)
    .classList.add('dots__dot--active');
};

const goToSlide = function () {
  slides.forEach(
    (slide, i) =>
      (slide.style.transform = `translateX(${
        translateXArr[i] - 100 * initPosition
      }%)`)
  );

  updateDot();
};

// 3 init run
const init = function () {
  createDots();
  goToSlide();
};

init();

// 4 Event handler

slideContainer.addEventListener('click', e => {
  const clicked = e.target;
  // detect whether btnSlide OR btnDots
  if (
    !clicked.classList.contains('slider__btn') &&
    !clicked.classList.contains('dots__dot')
  )
    return;
  // A: click btnSlide
  if (clicked.classList.contains('slider__btn--right')) nextSlide();
  else if (clicked.classList.contains('slider__btn--left')) prevSlide();

  // B: click btnDots
  if (clicked.classList.contains('dots__dot')) {
    btnSlide(clicked);
  }

  console.log(initPosition);
});

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') nextSlide();
  else if (e.key === 'ArrowLeft') prevSlide();
});

//  --------- TEST Life cycle

document.addEventListener('DOMContentLoaded', () => {});
window.addEventListener('load', () => {});
