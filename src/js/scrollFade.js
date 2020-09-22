export default class ScrollFade {

  constructor(width, height) {
    this.windowWidth = width;
    this.windowHeight = height;
    this.remainder = 80;

    // スクロール位置を取得
    this.scrollY = window.pageYOffset || document.documentElement.scrollTop;
    this.fadeContentsRect = [];
    this.fadeContentsTop = [];
    this.fadeContents = null;
    this.stageEl = null;
    this.startScFag = null;
    this.messageTitle = "";
  }

  init() {
    this.setFadeContents();
    if (this.scrollY < this.windowHeight) {
      this.stateFadeIn();
      // console.log('<');
      this.startScFag = false;
    } else {
      this.allFadeIn();
      // console.log('>');
    }

    // window.addEventListener('scroll', function () {
    //   this.scrollFadeIn();
    // });
  }


  setFadeContents() {
    // console.log('setFadeContents');
    // console.log('scrollY' + this.scrollY);
    this.startScFag = false;
    // console.log('this.startScFag: ' + this.startScFag);
    const scFade = document.querySelectorAll('.sc-fade');
    const scFadeArr = [].slice.call(scFade);
    // const scFadeMask = document.querySelectorAll('.sc-fade-mask');
    // const scFadeMaskArr = [].slice.call(scFadeMask);
    // this.fadeContents = scFadeArr.concat(scFadeMaskArr);
    this.fadeContents = scFadeArr;
    // console.log(this.fadeContents);

    // 要素の位置を取得
    for (let i = 0; i < this.fadeContents.length; i++) {
      this.fadeContentsRect.push(this.fadeContents[i].getBoundingClientRect());
    }
    for (let i = 0; i < this.fadeContentsRect.length; i++) {
      this.fadeContentsTop.push(this.fadeContentsRect[i].top + this.scrollY);
    }

    this.stageEl = document.getElementById('stage');
    this.messageEl = document.getElementById('message');
  }


  scrollFadeIn() {
    // スクロール位置を取得
    this.scrollY = window.pageYOffset || document.documentElement.scrollTop;
    let viewHeightTop = this.scrollY;
    let viewHeightBottom = this.scrollY + this.windowHeight - this.remainder;
    // console.log('stateFadeIn: viewHeightTop' + viewHeightTop, 'viewHeightBottom' + viewHeightBottom);

    //#messageの背景
    if (viewHeightTop > this.remainder) {
      this.startScFag = true;
      this.stageEl.classList.add('in');
    } else {
      this.startScFag = false;
      this.stageEl.classList.remove('in');
    }
    // console.log('this.startScFag: ' + this.startScFag);

    if (this.startScFag === true) {
      for (let i = 0; i < this.fadeContents.length; i++) {
        if (this.fadeContentsTop[i] >= viewHeightTop && this.fadeContentsTop[i] < viewHeightBottom) {
          this.fadeContents[i].classList.add('in');
        }
      }
      // if (viewHeightTop > 788 && viewHeightTop < 1800) {
      //   this.messageEl.classList.add('set');
      // } else {
      //   this.messageEl.classList.remove('set');
      // }
    }
    // console.log('scrollY' + this.scrollY);
  }

  stateFadeIn() {
    // console.log('stateFadeIn');
    // スクロール位置を取得
    this.scrollY = window.pageYOffset || document.documentElement.scrollTop;
    let viewHeightTop = this.scrollY;
    let viewHeightBottom = this.scrollY + this.windowHeight;
    // console.log('stateFadeIn: viewHeightTop' + viewHeightTop, 'viewHeightBottom' + viewHeightBottom);
    if (this.startScFag === true) {
      for (var i = 0; i < this.fadeContents.length; i++) {
        if (this.fadeContentsTop[i] >= viewHeightTop && this.fadeContentsTop[i] < viewHeightBottom) {
          this.fadeContents[i].classList.add('in');
        }
      }
    }
  }

  allFadeIn() {
    // console.log('allFadeIn');
    if (this.startScFag === true) {
      for (var i = 0; i < this.fadeContents.length; i++) {
        this.fadeContents[i].classList.add('in');
      }
    }
  }
}
