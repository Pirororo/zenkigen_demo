
export default class MobileNav {

  constructor() {
    this.breakPoint = 1024;
    this.windowWidth = window.innerWidth;

  }

  init() {
    // header main
    const headerEl = document.querySelector('header');
    const headerNav = document.querySelector('.header-nav');

    // modal
    const modalEl = document.querySelector('.modal');
    const closeBtn = document.querySelector('.btn-close');
    const modalNavList = document.querySelector('.mobile-nav-list');

    if (this.windowWidth < this.breakPoint) {
      headerNav.addEventListener('click', function () {
        modalEl.classList.add('active');
        modalNavList.classList.add('active');

      }, false);

      closeBtn.addEventListener('click', function () {
        modalEl.classList.remove('active');
        modalNavList.classList.remove('active');
      }, false);

      modalEl.addEventListener('click', function () {
        modalEl.classList.remove('active');
        modalNavList.classList.remove('active');
      }, false);
    }
  }
}
