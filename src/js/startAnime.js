import { uA } from './helpers';


export default class StartAnime {

  constructor() {
    this.mainEl = document.querySelector('main');
    this.wLoader = document.getElementById('wrap-loader');
    // this.webglEl = document.getElementById('WebGL-output');
  }

  init() {

    // if (!uA.isValid()) {
    //   this.webglEl.classList.add('ie');
    // }

    setTimeout(() => {
      this.wLoader.classList.add('hide');

      setTimeout(() => {
        this.wLoader.classList.add('remove');
        this.mainEl.classList.add('show');
      }, 700);
      document.querySelector('header').classList.add('show');
    }, 1000);

  }

  // textEffect(textList) {
  //   const textEffectArr = [].slice.call(textList);
  //   // console.log(textEffectArr);
  //   for (let i = 0; i < textEffectArr.length; i++) {
  //     const text = textEffectArr[i].textContent;
  //     textEffectArr[i].innerHTML = null;
  //     text.split('').forEach(function (c) {
  //       textEffectArr[i].innerHTML += '<span class="te">' + c + '</span>';
  //     });
  //   }
  // }
}
