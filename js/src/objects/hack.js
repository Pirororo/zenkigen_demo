(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
    'use strict';
    
    var _param = require('./param');
    
    var _param2 = _interopRequireDefault(_param);
    
    var _util = require('./module/libs/util');
    
    var _util2 = _interopRequireDefault(_util);
    
    var _googlemap = require('./module/libs/googlemap');
    
    var _googlemap2 = _interopRequireDefault(_googlemap);
    
    var _effect = require('./module/effect');
    
    var _effect2 = _interopRequireDefault(_effect);
    
    var _globalNavi = require('./module/global/globalNavi');
    
    var _globalNavi2 = _interopRequireDefault(_globalNavi);
    
    var _scrollManager = require('./module/scroll/scrollManager');
    
    var _scrollManager2 = _interopRequireDefault(_scrollManager);
    
    var _mouseManager = require('./module/mouse/mouseManager');
    
    var _mouseManager2 = _interopRequireDefault(_mouseManager);
    
    var _top = require('./page/top');
    
    var _top2 = _interopRequireDefault(_top);
    
    var _manager = require('./module/webgl/manager');
    
    var _manager2 = _interopRequireDefault(_manager);
    
    var _animeManager = require('./module/webgl/animeManager');
    
    var _animeManager2 = _interopRequireDefault(_animeManager);
    
    var _style = require('./page/style');
    
    var _style2 = _interopRequireDefault(_style);
    
    var _videoManager = require('./module/webgl/videoManager');
    
    var _videoManager2 = _interopRequireDefault(_videoManager);
    
    var _input = require('./module/input/input');
    
    var _input2 = _interopRequireDefault(_input);
    
    var _contact = require('./module/libs/contact');
    
    var _contact2 = _interopRequireDefault(_contact);
    
    var _manager3 = require('./module/modal/manager');
    
    var _manager4 = _interopRequireDefault(_manager3);
    
    var _information = require('./module/information/information');
    
    var _information2 = _interopRequireDefault(_information);
    
    var _spTurnDevice = require('./module/global/spTurnDevice');
    
    var _spTurnDevice2 = _interopRequireDefault(_spTurnDevice);
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
    
    var param = new _param2.default();
    var util = new _util2.default();
    var googlemap = void 0;
    var effect = void 0;
    var gNavi = new _globalNavi2.default();
    var scroll = void 0;
    var mouse = void 0;
    var toppage = void 0;
    var webgl = void 0;
    var webglanime = void 0;
    var style = void 0;
    var video = void 0;
    var input = void 0;
    var contact = void 0;
    var modal = void 0;
    var information = void 0;
    var turnDevice = new _spTurnDevice2.default(Useragnt.mobile || Useragnt.tablet ? "sp" : "pc");
    
    // const stats = new Stats();
    // stats.showPanel( 0 );
    // document.body.appendChild( stats.dom );
    
    var pageID = $("body").attr("id");
    var fpsRate = 0;
    var executionType = "landing"; /* 実行タイミングの制御用 */
    var _w = 0;
    var _h = 0;
    
    //element
    var $header = $('#l-header');
    var $root = $('#l-root');
    var $body = $('#l-lowlayer-body');
    var $title = $('.c-lowlayer-page-title__inner');
    var $link = $('.l-lowlayer-link');
    
    var loaded = false;
    var webglloaded = false;
    var _pjaxFlg = false;
    
    /* ---------------------------------------------------
    
      -- render
    
     --------------------------------------------------- */
    
    var render = function render() {
    
        if (!requestAnimationFrame) {
            setTimeout(function () {
                render;
            }, 1000 / 60);
        } else {
            requestAnimationFrame(render);
        }
    
        fpsRate = util.updateTimeRatio();
    
        if (_pjaxFlg) return;
    
        //stats.begin();
    
        if (!scroll.status.comp && gNavi.status.now !== "open") scroll.move(fpsRate);
    
        if (pageID === "top") {
            /* 向きをscrollmanagerに合わせる */
            if (!webgl.firstMvFlg) {
                _dir = webgl.direction = scroll.dir;
            }
        } else {
            _dir = scroll.dir;
        }
    
        if (pageID === "style") {
            mouse.move(fpsRate);
            if (loaded) style.render(mouse.obj);
        }
    
        //stats.end();
    
        if (param.videoLoaded) video.render(fpsRate); //付近まできたら実行
    };
    
    /* ---------------------------------------------------
    
      --
    
     --------------------------------------------------- */
    
    var common = function common(type) {
    
        param.type = true;
    
        if (type === "landing") {
            effect = new _effect2.default();
            mouse = new _mouseManager2.default();
        }
    
        scroll = new _scrollManager2.default(0, type);
    
        scroll.status.comp = false;
    
        switch (pageID) {
            case "top":
                param.type = 'full';
                webgl = new _manager2.default();
                webglanime = new _animeManager2.default();
                toppage = new _top2.default();
                break;
            case "style":
                param.type = 'full';
                style = new _style2.default();
                modal = new _manager4.default();
                break;
            case "about":
                googlemap = new _googlemap2.default();
                break;
            case "service":
                video = new _videoManager2.default();
                break;
            case "contact":
                input = new _input2.default();
                contact = new _contact2.default();
                break;
            case "news":
                information = new _information2.default();
                break;
        }
    
        if (type === "landing") {
            TweenMax.set($root, { opacity: 1 });
        }
        scroll.init();
        pageManager(pageID);
        resize();
    
        render();
    
        /* anchor */
        $('.c-page-link__list').on("click", function () {
            var _target = $(this).data('target');
            var _minus = void 0;
            if (param.displayType === 'pc') {
                _minus = 150;
            } else {
                _minus = 80;
            }
            scroll.resize(_w, _h);
            $('html,body').animate({ scrollTop: $('#' + _target).offset().top - _minus }, '200');
        });
    
        /* viewmore */
        $('.c-news__btn').on("click", function () {
            setTimeout(function () {
                scroll.resize(_w, _h);
            }, 1e3);
        });
    
        /* pagetop */
        $('.c-pagetop').on("click", function () {
            scroll.update(0, "prev");
            $('html,body').animate({ scrollTop: 0 }, '200');
        });
    };
    
    var pageManager = function pageManager(type) {
    
        switch (pageID) {
            case "top":
                webgl.init(type, webglloaded);
                webglloaded = true;
                $('html').addClass('is-no-scroll');
    
                var _$header = $('#l-header');
    
                TweenMax.to(_$header, 0.6, {
                    y: -100,
                    ease: Power2.easeOut,
                    onComplete: function onComplete() {
                        TweenMax.set(_$header, {
                            className: "+=is-white"
                        });
                        TweenMax.to(_$header, 0.6, {
                            y: 0,
                            delay: 1,
                            ease: Power2.easeOut
                        });
                    }
                });
                setTimeout(function () {
                    toppage.init();
                }, 1e3);
                break;
            case "style":
                style.init(param);
                modal.init();
                break;
            case "service":
                video.init(param);
                break;
            case "contact":
                input.init();
                contact.init();
                break;
            case "news":
                information.init();
                break;
        }
    
        if (pageID !== "top") {
    
            var _$body = $('#l-lowlayer-body');
            var _$title = $('.c-lowlayer-page-title__inner');
            var _$link = $('.l-lowlayer-link');
            var _$header2 = $('#l-header');
    
            TweenMax.set("html", {
                className: "-=is-no-scroll"
            });
            // TweenMax.set($header,{y:0});
            TweenMax.to(_$header2, 0.6, {
                y: 0,
                ease: Power2.easeOut
            });
    
            effect.Title(_$title, "show");
            effect.fade(_$body, "set");
            effect.fade(_$body, "show");
            effect.fade(_$link, "set");
            effect.fade(_$link, "show");
    
            if (pageID === "service" || pageID === "about") {
    
                var main = $('.l-lowlayer-section-main .c-lowlayer-section-title');
                var fade = $('.l-lowlayer-section-main .js__tsc-fade');
    
                effect.sectionTitle(main, "set");
                effect.fade(fade, "set");
                setTimeout(function () {
                    effect.sectionTitle(main, "show");
                    effect.fade(fade, "show");
                }, 600);
            }
        }
    
        setTimeout(function () {
            loaded = true;
            _pjaxFlg = false;
        }, '1e3');
    };
    
    var resize = function resize() {
    
        param.displayType = window.innerWidth > param.breakpoint ? "pc" : "sp";
    
        _w = $(window).innerWidth();
        _h = $(window).innerHeight();
    
        gNavi.resize(_w, _h);
    
        scroll.resize(_w, _h);
    
        switch (pageID) {
            case 'top':
                toppage.resize(_w, _h, param.displayType);
                webgl.resize(_w, _h);
                break;
        }
        if (Useragnt.mobile || Useragnt.tablet) turnDevice.resize();
    };
    
    /* ---------------------------------------------------
    
      -- load
    
     --------------------------------------------------- */
    
    $('html').addClass('is-no-scroll');
    
    $(window).on("load", function (e) {
        $('html,body').animate({ scrollTop: 0 }, '1');
        TweenMax.set($header, { y: -200, opacity: 1 });
        common("landing");
    });
    
    /* ---------------------------------------------------
    
      -- event
    
     --------------------------------------------------- */
    
    /* scroll */
    $(window).on("scroll", function (e) {
    
        if (!loaded || _pjaxFlg) return;
    
        scroll.inertia = Useragnt.mobile || Useragnt.tablet ? false : true;
    
        if (gNavi.status.now === "open") {
            e.preventDefault();
            return;
        } else {
            var _y2 = window.pageYOffset || document.documentElement.scrollTop;
            gNavi.status.saveScInc = _y2;
            scroll.update(_y2, "");
            switch (pageID) {
                case 'top':
                    if (!webgl.firstMvFlg && !webgl.animeFlg) {
                        scrollEvent();
                    }
                    break;
                case 'style':
                    if (param.displayType == "sp") {
                        style.resize(_w, _h, param.displayType);
                    } else {
                        $link.css({ 'opacity': 1 });
                        effect.fade([$body, $link], "in");
                    }
                    break;
            }
        }
    });
    
    var _y = 0;
    var _dir = '';
    var _delta = '';
    
    var scrollEvent = function scrollEvent() {
    
        if (!loaded || _pjaxFlg) return;
    
        if (_dir === 'prev') {
            _y = window.pageYOffset || document.documentElement.scrollTop;
    
            switch (pageID) {
                case 'top':
                    if (!webgl.firstMvFlg && !webgl.animeFlg) {
                        if (_y <= 0) {
                            webgl.scrFlg = false;
                            TweenMax.set("html", {
                                className: "+=is-no-scroll"
                            });
                        } else {
                            webgl.scrFlg = true;
                            TweenMax.set("html", {
                                className: "-=is-no-scroll"
                            });
                        }
                    }
                    break;
                case 'style':
                    if (param.displayType === 'pc' && style.firstMvFlg) {
                        if (_y <= 0) {
                            style.scrFlg = false;
                            TweenMax.set("html", {
                                className: "+=is-no-scroll"
                            });
                        } else {
                            style.scrFlg = true;
                            TweenMax.set("html", {
                                className: "-=is-no-scroll"
                            });
                        }
                    }
                    break;
            }
        }
    
        switch (pageID) {
            case 'top':
                if (webgl.scrFlg || webgl.animeFlg || !loaded || _pjaxFlg) return;
                webgl.wheel(_dir, _y);
                break;
            case 'style':
                if (style.scrFlg || style.animeFlg || !loaded || _pjaxFlg) return;
                style.wheel(_dir);
                break;
        }
    };
    
    /* wheel */
    var scroll_event = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
    $(window).on(scroll_event, function (e) {
    
        _delta = e.originalEvent.deltaY ? -e.originalEvent.deltaY : e.originalEvent.wheelDelta ? e.originalEvent.wheelDelta : -e.originalEvent.detail;
    
        switch (pageID) {
            case 'top':
                if (!webgl.scrFlg) e.preventDefault();
                break;
            case 'style':
                if (!style.scrFlg) e.preventDefault();
                break;
        }
    
        if (_delta < 0) {
            _dir = 'next';
            scrollEvent();
        } else if (_delta > 0) {
            _dir = 'prev';
            scrollEvent();
        }
    });
    
    /* [ SMP Tablet用 ]
     ------------------------------------*/
    
    var touchInc = {
        x: 0,
        y: 0,
        pos: 0
    };
    
    window.addEventListener("touchstart", function (e) {
        touchInc.x = e.touches[0].pageX;
        touchInc.y = e.touches[0].pageY;
    });
    window.addEventListener("touchmove", function (e) {
        switch (pageID) {
            case 'top':
                if (!webgl.scrFlg) e.preventDefault();
                break;
            case 'style':
                if (!style.scrFlg) e.preventDefault();
                break;
        }
    });
    window.addEventListener("touchend", function (e) {
    
        var nowY = e.changedTouches[0].pageY;
    
        if (touchInc.y > nowY && touchInc.y - nowY > 50) {
            _dir = 'next';
            scrollEvent();
        } else if (touchInc.y < nowY && nowY - touchInc.y > 50) {
            _dir = 'prev';
            scrollEvent();
        }
    });
    
    /* [ keyboard 用 ]
     ------------------------------------*/
    
    $(document).keyup(function (e) {
    
        switch (pageID) {
            case 'top':
                if (!webgl.scrFlg) e.preventDefault();return false;
                break;
            case 'style':
                if (!style.scrFlg) e.preventDefault();return false;
                break;
        }
    
        if (e.keyCode == 40 || e.keyCode == 34) {
    
            _dir = 'next';
            scrollEvent();
        } else if (e.keyCode == 38 || e.keyCode == 33) {
    
            _dir = 'prev';
            scrollEvent();
        }
    });
    
    /* mouse event */
    if (Useragnt.pc) {
        window.addEventListener("mousemove", function (e) {
    
            if (!loaded || _pjaxFlg) return;
    
            var _x = void 0;
            var _y = void 0;
    
            switch (pageID) {
                case "top":
                    _x = e.clientX / _w * 2 - 1;
                    _y = -(e.clientY / _h) * 2 + 1;
                    webgl.mouse(_x, _y);
                    break;
                case "style":
                    _x = e.clientX;
                    _y = e.clientY;
                    mouse.update(_x, _y);
                    break;
            }
        });
    }
    
    $(window).on("resize onorientationchange", function (e) {
    
        resize();
    });
    
    var min = 1;
    var max = 2;
    var random = void 0;
    
    var js_color = $('.js__colorrandom');
    js_color.hover(function () {
        random = Math.floor(Math.random() * (max + 1 - min)) + min;
        $(this).addClass('hover' + random);
    }, function () {
        $(this).removeClass();
        $(this).addClass('js__colorrandom');
    });
    
    /* ---------------------------------------------------
    
      -- PJAX
    
     --------------------------------------------------- */
    
    Barba.Pjax.start();
    Barba.Prefetch.init();
    
    var PageTransition = Barba.BaseTransition.extend({
    
        start: function start() {
    
            if (_pjaxFlg) return;
            _pjaxFlg = true;
    
            /* 画面遷移する際に発火 */
    
            Promise.all([this.newContainerLoading, this.out()]).then(this.show.bind(this));
        },
    
        out: function out() {
    
            /* 画面遷移時に消える処理 */
            gNavi.motion('hide');
            effect.Title($(this.oldContainer).find(".js__tsc-title"), "out");
            effect.sectionTitle($(this.oldContainer).find(".js__tsc-section-title"), "out");
            effect.fade([$body, $link], "out");
            if (pageID === 'top') {
                webgl.webgl.moveToNextScene();
                var _hideTarget = $(this.oldContainer).find('.p-kv__inner.is-current').attr('id');
                effect.depth($(this.oldContainer).find('.p-kv__inner.is-current .p-kv__copy').children('.text-inner').children(), 'out', _hideTarget);
                var _element = $('#p-kv__drag__inner,#p-kv__description>*');
                TweenMax.to(_element, 1.4, {
                    x: 0,
                    y: 0,
                    z: -2000,
                    rotationX: 125,
                    force3D: true,
                    opacity: 0,
                    ease: Power2.easeOut,
                    onStart: function onStart() {
                        setTimeout(function () {
                            webgl.pjax('out');
                        }, 250);
                    }
                });
            }
    
            var _this = this;
    
            TweenMax.to($root, 0.2, {
                delay: 0.6,
                opacity: 0,
                ease: Power2.easeIn,
                onComplete: function onComplete() {
                    TweenMax.set($(_this.oldContainer), { visibility: 'visible', opacity: 0 });
                    TweenMax.set($('#l-scroll'), { opacity: 0 });
                }
            });
    
            //return $(this.oldContainer).animate({ opacity: 0 }).promise();
        },
    
        show: function show() {
    
            /* 画面遷移時に表示される処理 */
    
            var _this = this;
            var $el = $(this.newContainer);
    
            if (pageID !== 'top') {
                $header.removeClass('is-white');
            } else {
                $header.addClass('is-white');
            }
    
            setTimeout(function () {
    
                $(this.oldContainer).hide();
                $("body").attr("id", pageID);
                if (pageID !== 'top') {
                    TweenMax.to($header, 0.6, {
                        y: -100,
                        ease: Power2.easeOut,
                        onComplete: function onComplete() {
                            TweenMax.set($header, {
                                className: "-=is-white"
                            });
                            TweenMax.to($header, 0.6, {
                                y: 0,
                                delay: 1,
                                ease: Power2.easeOut
                            });
                        }
                    });
                }
                $('html,body').animate({ scrollTop: 0 }, '1', function () {
                    TweenMax.set($el, { opacity: 1 });
                    TweenMax.to($root, 0.6, {
                        opacity: 1,
                        ease: Power2.easeIn,
                        onStart: function onStart() {},
                        onComplete: function onComplete() {
                            _this.done();
                            common("transition");
                        }
                    });
                });
            }, '1e3');
        }
    });
    
    Barba.Dispatcher.on('linkClicked', function () {
        //console.log("開始");
    
    });
    Barba.Dispatcher.on('newPageReady', function (currentStatus, prevStatus, HTMLElementContainer, newPageRawHTML) {
    
        /* ページ情報取得 */
        pageID = currentStatus.namespace;
    
        /* head内書き換え */
        var head = document.head;
        var newPageRawHead = newPageRawHTML.match(/<head[^>]*>([\s\S.]*)<\/head>/i)[0];
        var newPageHead = document.createElement('head');
        newPageHead.innerHTML = newPageRawHead;
    
        var removeHeadTags = ["meta[name='keywords']", "meta[name='description']", "meta[property^='og']", "meta[name^='twitter']", "meta[itemprop]", "link[itemprop]", "link[rel='prev']", "link[rel='next']", "link[rel='canonical']"].join(',');
        var headTags = head.querySelectorAll(removeHeadTags);
        for (var i = 0; i < headTags.length; i++) {
            head.removeChild(headTags[i]);
        }
        var newHeadTags = newPageHead.querySelectorAll(removeHeadTags);
    
        for (var i = 0; i < newHeadTags.length; i++) {
            head.appendChild(newHeadTags[i]);
        }
    
        executionType = "pjax";
    
        //アナリティクスに送信
        // ga('send', 'pageview', window.location.pathname.replace(/^\/?/, '/') + window.location.search);
    
        /* html書き換え */
    });
    
    Barba.Pjax.getTransition = function () {
        // console.log("getTransition");
        return PageTransition;
    };
    Barba.Dispatcher.on("load", function () {
        // console.log("test");
    });
    
    Barba.Pjax.originalPreventCheck = Barba.Pjax.preventCheck;
    Barba.Pjax.preventCheck = function (evt, element) {
        //ハッシュが含まれていてもbarbaが機能するように
        if ($(element).attr('href') && $(element).attr('href').indexOf('#') > -1) return true;else return Barba.Pjax.originalPreventCheck(evt, element);
    };
    
    },{"./module/effect":2,"./module/global/globalNavi":3,"./module/global/spTurnDevice":4,"./module/information/information":5,"./module/input/input":6,"./module/libs/contact":7,"./module/libs/googlemap":8,"./module/libs/util":9,"./module/modal/manager":10,"./module/mouse/mouseManager":12,"./module/scroll/scrollManager":15,"./module/webgl/animeManager":17,"./module/webgl/manager":19,"./module/webgl/videoManager":20,"./page/style":21,"./page/top":22,"./param":23}],2:[function(require,module,exports){
    "use strict";
    
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    
    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    var cntEasing = "Circ.easeIn";
    var cntSpeed = 2.38;
    var cntDelay = 0.1;
    
    var effectManager = function () {
        function effectManager() {
            _classCallCheck(this, effectManager);
    
            this.conf = {
    
                rotRadius: 20,
                scrollInc: 0.5,
                transY: 1,
                transX: window.innerWidth <= 320 ? 0.4 : 0.5,
                startPosiX: 0,
                transZ: 1,
                transRot: -0.22,
                opacity: 80
    
            };
    
            this.center = {
                x: window.innerWidth / 3,
                y: window.innerHeight / 10
            };
    
            this.radius = window.innerWidth / 2.5;
    
            // Math.sin(radian)は-1から1までを正弦波で返す
            // radiusをかけることでそれを半径とする円の範囲でアニメーション
            this.offsetX = Math.sin(this.radian) * this.radius;
            this.offsetZ = Math.cos(this.radian) * this.radius;
        }
    
        _createClass(effectManager, [{
            key: "photoCover",
            value: function photoCover($target, type) {
    
                if (type === "set") {
    
                    TweenMax.set($target.find('.js__tsc-photo-cover'), {
                        x: '100%'
                    });
                } else {
    
                    TweenMax.to($target, 1.4, {
                        delay: 0.4,
                        x: '100%',
                        ease: Expo.easeOut
                    });
                    TweenMax.to($target, 0.3, {
                        delay: 0.4,
                        rotation: 6,
                        transformOrigin: "50% 50%",
                        ease: Expo.easeOut,
                        onComplete: function onComplete() {
                            TweenMax.to($target, 0.5, {
                                rotation: 0,
                                transformOrigin: "50% 50%",
                                ease: Expo.easeOut
                            });
                        }
                    });
                }
            }
        }, {
            key: "content",
            value: function content($target, type) {
    
                if (type === "set") {
    
                    $target.append("<i class='js__tsc-cover'></i>");
                    TweenMax.set($target.find('.js__tsc-cover'), {
                        x: '-50%'
                    });
                } else if (type === "out") {
                    TweenMax.staggerTo($target, 1.2, {
                        opacity: 0,
                        z: 10,
                        ease: Power2.easeOut
                    }, 0.05);
                } else {
    
                    TweenMax.to($target, 2.2, {
                        delay: .8,
                        x: '100%',
                        ease: Power2.easeOut
                    });
                }
            }
        }, {
            key: "fade",
            value: function fade($target, type) {
    
                if (type === "set") {
                    TweenMax.set($target, {
                        opacity: 0,
                        y: 10
                    });
                } else if (type === "out") {
                    TweenMax.to($target, 0.6, {
                        opacity: 0,
                        z: -10,
                        ease: Power2.easeIn
                    });
                } else {
                    TweenMax.to($target, 2, {
                        delay: 0.8,
                        y: 0,
                        opacity: 1,
                        ease: Expo.easeOut
                    });
                }
            }
        }, {
            key: "show",
            value: function show($target, type) {
    
                if (type === "set") {
                    TweenMax.set($target, {
                        y: '40px',
                        opacity: 0,
                        rotationX: 30,
                        force3D: true
                    });
                } else if (type === "out") {
                    TweenMax.staggerTo($target, 0.6, {
                        opacity: 0,
                        z: 10,
                        ease: Power2.easeIn
                    }, 0.05);
                } else {
                    TweenMax.staggerTo($target, 2.4, {
                        delay: 3.0,
                        y: '0px',
                        opacity: 1,
                        rotationX: 0,
                        force3D: true,
                        ease: Expo.easeOut
                    }, 0.2);
                }
            }
        }, {
            key: "scale",
            value: function scale($target, type) {
    
                var _setZ = $('html.safari')[0] || $('html.ios')[0] ? 0 : 15;
    
                if (type === "set") {
    
                    TweenMax.set($target, {
                        x: -5,
                        y: 0,
                        z: _setZ,
                        opacity: 0
                    });
                } else if (type === "out") {
    
                    TweenMax.to($target, 0.6, {
                        scale: 0.8,
                        ease: Power2.easeIn
                    }, 0.1);
                } else {
    
                    $target.css({ 'opacity': '' });
                    TweenMax.to($target, 1, {
                        delay: 0.5,
                        x: 0,
                        y: 0,
                        z: 0,
                        ease: Expo.easeOut
                    });
                    TweenMax.from($target, 1, {
                        delay: 0.5,
                        opacity: 0,
                        ease: Expo.easeOut
                    });
                }
            }
        }, {
            key: "splitText",
            value: function splitText($target, type) {
    
                if ($target.length == 0) {
                    return;
                }
    
                if (type === "set") {
                    var text = new SplitText($target, { type: "words,chars" }),
                        chars = text.chars;
                    TweenMax.set(chars, { opacity: 0, x: 20 });
                    // TweenMax.set(chars,{ opacity:0, x:100,rotationX:-20, rotationY:15});
                } else if (type === "out") {
                    TweenMax.staggerTo($target, 0.6, {
                        opacity: 0, x: 150,
                        // filter:"blur(0px)",
                        ease: "Power2.easeIn"
                    }, 0.01);
                } else {
                    TweenMax.staggerTo($target, 2.4, {
                        // opacity:1,x:0,
                        x: 0,
                        y: 0,
                        z: 0,
                        opacity: 1,
                        scale: 1,
                        ease: Expo.easeOut
                    }, 0.1);
                }
            }
        }, {
            key: "box",
            value: function box($target, type) {
    
                if (type === "set") {
    
                    TweenMax.set($target, {
                        x: 110 + "%",
                        scale: 1.1,
                        opacity: 0
                    });
                } else if (type === "out") {
                    TweenMax.staggerTo($target, 1.1, {
                        x: -110 + "%",
                        scale: 1.1,
                        opacity: 0,
                        ease: Power2.easeIn
                    }, 0.05);
                } else {
    
                    TweenMax.staggerTo($target, 1.1, {
                        x: 0 + "%",
                        scale: 1,
                        opacity: 1,
                        ease: Power2.easeOut,
                        delay: 0.7
                        // ease: Back.easeOut.config(1),
                    }, 0.1);
                }
            }
        }, {
            key: "sectionTitle",
            value: function sectionTitle($target, type) {
    
                if ($target.length == 0) {
                    return;
                }
    
                var _title = $target.find('.js__tsc-section-title-title');
                var _text = $target.find('.js__tsc-section-title-text');
                var _line = $target.find('.js__tsc-section-title-line');
    
                if (type === "set") {
    
                    var _splittext = new SplitText(_title, { type: "words,chars" }),
                        chars = _splittext.chars;
                    TweenMax.set(chars, {
                        x: 200,
                        y: -50,
                        opacity: 0
                    });
                    TweenMax.set(_text, { opacity: 0 });
                    TweenMax.set(_line, { opacity: 0, x: '30px' });
                } else if (type === "out") {
                    TweenMax.staggerTo($target.find('.js__tsc-section-title-title').children().children(), 0.8, {
                        x: 100,
                        y: -50,
                        opacity: 0,
                        ease: Power2.easeOut
                    }, 0.05);
                    TweenMax.to($target.find('.js__tsc-section-title-text'), 0.8, {
                        opacity: 0,
                        ease: Power2.easeOut
                    });
                    TweenMax.to($target.find('.js__tsc-section-title-line'), 0.8, {
                        x: 30,
                        opacity: 0,
                        ease: Power2.easeOut
                    });
                } else {
    
                    $target.parents('.js__tsc').addClass('is-show');
    
                    TweenMax.staggerFromTo(_title.children().children(), 1.4, {
                        x: 50,
                        y: -25,
                        opacity: 0
                    }, {
                        opacity: 1,
                        x: 0,
                        y: 0,
                        ease: Expo.easeOut
                    }, 0.05);
                    TweenMax.to(_text, 2, {
                        delay: 1.2,
                        opacity: 1,
                        ease: Expo.easeOut
                    });
                    TweenMax.to(_line, .4, {
                        delay: .5,
                        x: '0px',
                        opacity: 1,
                        ease: Expo.easeOut
                    });
                    TweenMax.from(_line, 0.8, {
                        delay: .6,
                        width: '150px',
                        ease: Power2.easeOut
                    });
                }
            }
        }, {
            key: "Title",
            value: function Title($target, type) {
    
                if ($target.length == 0) {
                    return;
                }
    
                var _title = $target.find('.js__tsc-title-title');
                var _text = $target.find('.js__tsc-title-text');
                var _line = $target.find('.js__tsc-title-line');
    
                if (type === "set") {
    
                    var _splittext = new SplitText(_title, { type: "words,chars" }),
                        chars = _splittext.chars;
                    TweenMax.set(chars, {
                        y: 50,
                        color: '#2bf3d9',
                        opacity: 0
                    });
                    TweenMax.set(_text, { opacity: 0 });
                    TweenMax.set(_line, {
                        backgroundColor: '#2f3440',
                        y: 50,
                        opacity: 0
                    });
                } else if (type === "out") {
                    TweenMax.staggerTo($target.find('.js__tsc-title-title').children().children(), 0.8, {
                        y: -30,
                        color: '#2bf3d9',
                        opacity: 0,
                        ease: Power2.easeOut
                    }, 0.03);
                    TweenMax.to($target.find('.js__tsc-title-text'), 0.8, {
                        opacity: 0,
                        ease: Power2.easeOut
                    });
                    TweenMax.to($target.find('.js__tsc-title-line'), 0.8, {
                        backgroundColor: '#2f3440',
                        y: -30,
                        opacity: 0,
                        ease: Power2.easeOut
                    });
                } else {
    
                    $target.parents('.js__tsc').addClass('is-show');
    
                    TweenMax.to(_line, 1.8, {
                        opacity: 1,
                        y: 0,
                        ease: Power4.easeOut
                    });
                    TweenMax.staggerFromTo(_title.children().children(), 1.8, {
                        y: 10,
                        color: '#2bf3d9',
                        opacity: 0
                    }, {
                        delay: .15,
                        y: 0,
                        opacity: 1,
                        ease: Expo.easeOut,
                        onStart: function onStart() {
                            TweenMax.to(_line, 1.2, {
                                delay: 0.6,
                                backgroundColor: '#2bf3d9',
                                ease: Expo.easeOut
                            });
                        }
                    }, 0.05);
                    TweenMax.staggerTo(_title.children().children(), 2.1, {
                        delay: .3,
                        color: '#2f3440'
                    }, 0.06);
    
                    TweenMax.to(_text, 2, {
                        delay: 1,
                        opacity: 1,
                        ease: Expo.easeOut
                    });
                }
            }
        }, {
            key: "lineText",
            value: function lineText($target, type) {
    
                if ($target.length == 0) {
                    return;
                }
    
                var _firstText = $target.children('.text-inner').eq(0);
                var _secondText = $target.children('.text-inner').eq(1);
                var _thirdText = $target.children('.text-inner').eq(2);
    
                if (type === "set") {
    
                    TweenMax.set($target, {
                        y: 10,
                        opacity: 0
                    });
                } else if (type === "out") {
    
                    TweenMax.to($target, 1, {
                        y: 10,
                        opacity: 0,
                        ease: Power2.easeOut
                    });
                } else {
    
                    TweenMax.to($target, 3, {
                        delay: 1,
                        y: 0,
                        opacity: 1,
                        ease: Power2.easeOut
                    });
                }
            }
        }, {
            key: "depth",
            value: function depth($target, type, hideTarget) {
    
                var _this = this;
                var _length = $target.length;
                var _showID = $target.parents('.p-kv__inner').attr('id');
    
                if (type === "set") {
    
                    $target.removeAttr('style');
    
                    var _setX = _showID === 'intro' ? 10 : 1;
    
                    if (_showID !== 'intro') {
                        _this.show($('#' + _showID).find('.p-kv__text'), 'set');
                    }
    
                    TweenMax.set($target.parents('.p-kv__copy').children('.number').children(), {
                        x: 100,
                        z: -1000,
                        opacity: 0
                    });
                    TweenMax.set($target, {
                        x: _this.center.x + _this.offsetX / _setX,
                        y: -_this.center.y,
                        z: -2000,
                        rotationX: 170,
                        force3D: true,
                        opacity: 0
                    });
                } else if (type === "out") {
    
                    var _setX1 = void 0;
                    if (hideTarget === 'intro') {
                        _setX1 = _this.center.x + _this.offsetX / 10;
                    } else if (hideTarget === 'ch2') {
                        _setX1 = -(_this.center.x + _this.offsetX / 0.6);
                    } else {
                        _setX1 = _this.center.x + _this.offsetX / 0.6;
                    }
                    var _setX2 = void 0;
                    if (hideTarget === 'intro') {
                        _setX2 = '';
                    } else if (hideTarget === 'ch2') {
                        _setX2 = _this.center.x + _this.offsetX / 5.5;
                    } else {
                        _setX2 = _this.center.x + _this.offsetX / 10.5;
                    }
                    var _setX3 = hideTarget === 'intro' ? -(_this.center.x + _this.offsetX / 12) : _this.center.x + _this.offsetX / 1.2;
                    var _setY = hideTarget === 'intro' ? 1 : 10;
                    var _delay1 = $target.eq(0).children().length;
                    var _delay2 = $target.eq(1).children().length;
    
                    if (hideTarget !== 'intro') {
                        _this.show($('#' + hideTarget).find('.p-kv__text'), 'out');
                    }
                    TweenMax.staggerTo($target.parents('.p-kv__copy').children('.number').children(), 1.4, {
                        x: 100,
                        z: -1000,
                        opacity: 0,
                        ease: Power2.easeOut
                    }, 0.2);
                    TweenMax.staggerTo($target.eq(0).children(), 1.4, {
                        x: _setX1,
                        y: -(_this.center.y / _setY),
                        z: -2000,
                        rotationX: 120,
                        force3D: true,
                        opacity: 0,
                        ease: Power2.easeOut
                    }, 0.04);
                    TweenMax.staggerTo($target.eq(1).children(), 1.4, {
                        delay: _delay1 * 0.04,
                        x: _setX2,
                        y: -(_this.center.y / _setY),
                        z: -2000,
                        rotationX: 120,
                        force3D: true,
                        opacity: 0,
                        ease: Power2.easeOut
                    }, 0.04);
                    TweenMax.staggerTo($target.eq(2).children(), 1.4, {
                        delay: _delay1 * 0.04 + _delay2 * 0.04,
                        x: _setX3,
                        y: -(_this.center.y / _setY),
                        z: -2000,
                        rotationX: 120,
                        force3D: true,
                        opacity: 0,
                        ease: Power2.easeOut
                    }, 0.04);
                    setTimeout(function () {
                        $('#' + hideTarget).removeClass('is-current');
                        $('#' + hideTarget).find('.is-done').removeClass('is-done');
                        //},(_delay1*1.2 + _delay2*1.2) * 100);
                    }, (_delay1 * 1.2 + _delay2 * 1.2) * 100);
                } else {
                    var _loop = function _loop(i) {
                        TweenMax.to($target.eq(i), 1.86, {
                            delay: 0.1 * i,
                            x: 0,
                            y: 0,
                            z: 0,
                            rotationX: 0,
                            force3D: true,
                            ease: Expo.easeOut,
                            onStart: function onStart() {
                                setTimeout(function () {
                                    $target.eq(i).addClass('is-done');
                                }, 900);
                            }
                        });
                        TweenMax.to($target.eq(i), 2.2, {
                            delay: 0.12 * i,
                            opacity: 1,
                            ease: Expo.easeOut
                        });
                    };
    
                    for (var i = 0; i < _length; i++) {
                        _loop(i);
                    }
                    TweenMax.staggerTo($target.parents('.p-kv__copy').children('.number').children(), 1.4, {
                        delay: 0.6,
                        x: 0,
                        z: 0,
                        opacity: 1,
                        ease: Power2.easeOut
                    }, 0.2);
                    if (_showID !== 'intro') {
                        _this.show($('#' + _showID).find('.p-kv__text'), 'in');
                    } else {
                        var _elements = $('#p-kv__drag__inner,#p-kv__description>*');
                        TweenMax.set(_elements, {
                            x: 0,
                            y: 0,
                            z: 0,
                            rotationX: 0,
                            opacity: 1
                        });
                        var _element = $('#p-kv__drag,#p-kv__description,#c-scrolldown,.c-social-link');
                        _this.show(_element, "set");
                        _this.show(_element, "show");
                    }
                }
            }
        }, {
            key: "topAnimation",
            value: function topAnimation(type, loadType) {
    
                var _this = this;
    
                var tlSet = new TimelineMax();
                var tlOut = new TimelineMax();
    
                var _kvCopy = $('#intro .p-kv__copy');
                var _kvBtn = $('#p-kv__drag,#p-kv__description');
                var _content = $('#p-top-content');
                var _visionTitle = $("#p-top-our-vision").find('.p-top-section__title__text');
                var _visionsubTitle = $("#p-top-our-vision").find('.p-top-section__title__sub');
                var _visionLine = $("#p-top-our-vision").find('.p-top-section__title__line');
                var _visionText = $("#p-top-our-vision").find('.p-top-section__sub-title,.p-top-section__text');
    
                if (type === "set") {
    
                    var _setZ = loadType === 'landing' ? 1500 : -1500;
    
                    tlSet.set(_kvCopy.children().children().children(), {
                        x: _this.center.x + _this.offsetX,
                        y: -_this.center.y,
                        z: _setZ,
                        rotationX: 170,
                        force3D: true,
                        opacity: 0
                    }).set(_visionTitle.children().children(), {
                        y: 50,
                        color: '#2bf3d9',
                        opacity: 0
                    }).set(_visionsubTitle, { opacity: 0 }).set(_visionLine, {
                        backgroundColor: '#2f3440',
                        y: 50,
                        opacity: 0
                    }).set(_visionText, {
                        opacity: 0
                    }).set(_visionText.find('.js__tsc-cover'), {
                        x: '-50%'
                    });
                } else if (type === "out") {
    
                    TweenMax.to($("#p-kv__bg"), 2.4, {
                        opacity: 0,
                        ease: Expo.easeOut
                    });
                    _this.depth(_kvCopy.children().children(), 'out', 'intro');
    
                    var _element = $('#p-kv__drag__inner,#p-kv__description>*');
                    TweenMax.to(_element, 1.4, {
                        x: 0,
                        y: 0,
                        z: -2000,
                        rotationX: 125,
                        force3D: true,
                        opacity: 0,
                        ease: Power2.easeOut
                    });
    
                    tlOut.to(_kvBtn, 0.48, {
                        z: -2000,
                        rotationX: 170,
                        force3D: true,
                        opacity: 0,
                        ease: Expo.easeOut,
                        onComplete: function onComplete() {
                            setTimeout(function () {
                                // TweenMax.set($("#p-kv"),{
                                //     zIndex:'-1'
                                // })
                                TweenMax.to(_visionLine, 1.8, {
                                    delay: 1.2,
                                    opacity: 1,
                                    y: 0,
                                    ease: Power4.easeOut
                                });
                                TweenMax.staggerFromTo(_visionTitle.children().children(), 1.8, {
                                    y: 10,
                                    color: '#2bf3d9',
                                    opacity: 0
                                }, {
                                    delay: 1.35,
                                    y: 0,
                                    opacity: 1,
                                    ease: Expo.easeOut,
                                    onStart: function onStart() {
                                        TweenMax.to(_visionLine, 1.2, {
                                            delay: 0.9,
                                            backgroundColor: '#2bf3d9',
                                            ease: Expo.easeOut
                                        });
                                        _this.content(_visionText.find('.js__tsc-cover'), "in");
                                        _this.lineText($('#p-top-our-vision__big-text'), "show");
                                    }
                                }, 0.05);
                                TweenMax.staggerTo(_visionTitle.children().children(), 2.1, {
                                    delay: 1.6,
                                    color: '#2f3440'
                                }, 0.06);
    
                                TweenMax.to(_visionsubTitle, 2, {
                                    delay: 1.3,
                                    opacity: 1,
                                    ease: Expo.easeOut
                                });
                                TweenMax.set(_visionText, {
                                    delay: 1.3,
                                    opacity: 1
                                });
                            }, 650);
                        }
                    }).to(_content, 1.28, {
                        delay: .3,
                        //zIndex:1,
                        'opacity': 1,
                        ease: Power2.easeIn
                    });
                } else {
    
                    _kvCopy.children().children().removeAttr('style');
                    _this.show(_kvBtn, "set");
                    _this.show(_kvBtn, "show");
    
                    var _delay = loadType === 'landing' ? 0 : .48;
    
                    TweenMax.to($("#p-kv__bg"), 1.9, {
                        delay: _delay,
                        opacity: 0.1,
                        ease: Circ.easeOut
                    });
    
                    _this.depth(_kvCopy.children().children().children(), 'in');
    
                    setTimeout(function () {
                        TweenMax.to($("#l-header"), 2.8, {
                            delay: 0.4,
                            y: 0,
                            ease: Expo.easeOut
                        });
                    }, 3e3);
                }
            }
        }]);
    
        return effectManager;
    }();
    
    exports.default = effectManager;
    
    },{}],3:[function(require,module,exports){
    'use strict';
    
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    
    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
    
    var _effect = require('../effect');
    
    var _effect2 = _interopRequireDefault(_effect);
    
    var _param = require('../../param');
    
    var _param2 = _interopRequireDefault(_param);
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    var param = new _param2.default();
    var effect = new _effect2.default();
    
    var globalNavi = function () {
        function globalNavi() {
            _classCallCheck(this, globalNavi);
    
            /* 必要なDOM */
            this.$header = $("#l-header");
            this.$container = $("#l-header__navi");
            this.$bg = $("#l-header__navi__bg");
            this.$list = $("#l-header__navi>ul>li");
            this.$social = $("#l-header__social>ul>li");
            this.$btn = $("#l-header__btn");
    
            /* 設定 */
            this.conf = {};
    
            /* ステータス */
            this.status = {
                now: "close",
                device: "pc",
                saveScInc: 0,
                saveScFlg: false
            };
    
            this.init();
        }
    
        _createClass(globalNavi, [{
            key: 'init',
            value: function init() {
    
                var _this = this;
                _this.set(this.status.device);
    
                _this.$btn.on("click", function () {
                    if (_this.status.device !== "sp") return;
    
                    if (_this.status.now === "close") {
                        _this.status.now = "open";
                        _this.$btn.addClass("is-close");
                        _this.$header.addClass("is-show");
                        _this.motion("show", 'sp');
                    } else {
                        $('html,body').animate({ scrollTop: _this.status.saveScInc }, '1');
                        _this.motion("out", 'sp');
                    }
                });
            }
        }, {
            key: 'motion',
            value: function motion(mode) {
    
                var _this = this;
    
                if (param.displayType !== 'sp') return;
    
                if (mode === "show") {
    
                    TweenMax.set([_this.$list, _this.$social], {
                        y: '0px',
                        z: -450,
                        opacity: 0,
                        force3D: true
                    });
                    TweenMax.fromTo(_this.$container, 0.3, {
                        opacity: 0,
                        display: 'none',
                        force3D: true
                    }, {
                        opacity: 1,
                        display: 'block',
                        ease: Expo.easeOut
                    });
                    TweenMax.staggerTo(_this.$list, 0.8, {
                        y: '0px',
                        z: 0,
                        opacity: 1,
                        ease: Expo.easeOut
                    }, 0.03);
                    TweenMax.staggerTo(_this.$social, 0.8, {
                        delay: 0.4,
                        y: '0px',
                        z: 0,
                        opacity: 1,
                        ease: Expo.easeOut
                    }, 0.03);
                    TweenMax.fromTo(_this.$bg, 1.2, {
                        webkitFilter: "hue-rotate(0deg)",
                        filter: "hue-rotate(0deg)"
                    }, {
                        webkitFilter: "hue-rotate(360deg)",
                        filter: "hue-rotate(360deg)"
                    });
                } else {
                    TweenMax.to(_this.$container, 0.6, {
                        opacity: 0,
                        display: 'none',
                        delay: 0.3,
                        ease: Expo.easeIn
                    });
                    TweenMax.staggerTo(_this.$list, 0.8, {
                        y: '0px',
                        z: -450,
                        opacity: 0,
                        ease: Expo.easeIn
                    }, 0.03);
                    TweenMax.staggerTo(_this.$social, 0.8, {
                        y: '0px',
                        z: -450,
                        opacity: 0,
                        ease: Expo.easeIn
                    }, 0.03);
                    setTimeout(function () {
                        _this.status.now = "close";
                        _this.$btn.removeClass("is-close");
                        _this.$header.removeClass("is-show");
                    }, 5e2);
                }
            }
    
            /* 初期化するやつ */
    
        }, {
            key: 'set',
            value: function set(device) {
                if (device === "sp") {
                    TweenMax.set(this.$container, { opacity: 0 });
                    this.status.now = "close";
                    this.$btn.removeClass("is-close");
                } else {
                    TweenMax.set(this.$container, { x: 0 + "%", opacity: 1 });
                }
            }
        }, {
            key: 'resize',
            value: function resize(_w, _h) {
                if (_w > param.breakpoint) {
                    if (this.status.device === "sp") this.set("pc");
                    this.status.device = "pc";
                } else {
                    if (this.status.device === "pc") this.set("sp");
                    this.status.device = "sp";
                }
            }
        }]);
    
        return globalNavi;
    }();
    
    exports.default = globalNavi;
    
    },{"../../param":23,"../effect":2}],4:[function(require,module,exports){
    "use strict";
    
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    
    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    var spTurnDevice = function () {
        function spTurnDevice(ua) {
            _classCallCheck(this, spTurnDevice);
    
            this.ua = ua;
    
            /* 必要なDOM */
    
            /* 設定 */
            this.conf = {};
    
            /* ステータス */
            this.status = {};
        }
    
        _createClass(spTurnDevice, [{
            key: "resize",
            value: function resize() {
    
                var angle = screen && screen.orientation && screen.orientation.angle || window.orientation || 0;
    
                var _roule = this.ua === "sp" ? angle % 180 !== 0 : window.innerHeight < window.innerWidth;
    
                if (_roule) {
                    $("body").addClass("is-landscape");
                } else {
                    $("body").removeClass("is-landscape");
                }
            }
        }]);
    
        return spTurnDevice;
    }();
    
    exports.default = spTurnDevice;
    
    },{}],5:[function(require,module,exports){
    'use strict';
    
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    
    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    //import smoothScrollManager from '../module/smoothScrollManager';
    
    //const smoothScroll = new smoothScrollManager();
    
    var information = function () {
        function information() {
            _classCallCheck(this, information);
    
            //使うもの
            this.url = '';
            this.count = 0;
            this.List = '';
            this.type = '';
        }
    
        _createClass(information, [{
            key: 'init',
            value: function init() {
                information.count = 0;
                information.url = location.href; //urlのハッシュ以下を取得
                $("#js__ajaxload").on("click", function () {
                    information.count++; //クリックしたら、１個ずつ増やす
    
                    $.when( //非同期処理制御
                    $.ajax({ //非同期処理
                        url: information.url,
                        cache: false,
                        data: {
                            more: true,
                            count: information.count
                        },
                        success: function success(data) {
                            //成功したときの処理
    
                            information.list = $('#js__loadlist', $(data)).html(); //htmlを返す
    
                            $("#js__loadlist").append(information.list); //information.listを追加
    
                            //smoothScroll.resize();
                        }
    
                    })).done(function (data) {
                        //whenが終わったら
                        $("#js__ajaxload").html($('#js__ajaxload', $(data)).html());
                    });
                });
            }
        }]);
    
        return information;
    }();
    
    exports.default = information;
    
    },{}],6:[function(require,module,exports){
    'use strict';
    
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    
    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    var Input = function () {
        function Input() {
    
            /* 必要なDOM */
    
            /* 設定 */
    
            /* ステータス */
    
            _classCallCheck(this, Input);
        }
    
        _createClass(Input, [{
            key: 'init',
            value: function init() {
                var $selector = $('.selector');
                var $radioLabel = $('.radio-label');
    
                $selector.on('click', function () {
    
                    $radioLabel.toggleClass('is-active');
                    $('.is-close').toggleClass('is-open');
                });
    
                $radioLabel.on('click', function () {
                    if ($(this).hasClass('is-active')) {
                        $radioLabel.removeClass('is-active');
                    }
                    var $radio = $(this).find('span').html();
    
                    $selector.html($radio + '<span class="is-close"></span>' + '<span class="is-none-active"></span>');
    
                    $('.is-none-active').addClass('is-active');
                });
            }
        }]);
    
        return Input;
    }();
    
    exports.default = Input;
    
    },{}],7:[function(require,module,exports){
    "use strict";
    
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    
    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    var contactManager = function () {
        function contactManager() {
            _classCallCheck(this, contactManager);
    
            this.text = {
                required: "<span class='error'>※必須項目です</span>",
                hiragana: "<span class='error'>※ひらがなで入力してください</span>",
                katakana: "<span class='error'>※カタカナで入力してください</span>",
                zip: "<span class='error'>※郵便番号を正しく入力して下さい</span>",
                tel: "<span class='error'>※電話番号を正しく入力して下さい</span>",
                mail: "<span class='error'>※メールアドレスの形式が異なります</span>",
                mailcheck: "<span class='error'>※メールアドレスと一致しません</span>",
                check: "<span class='error'>※チェックをしてください</span>"
            };
    
            this.status = {
                flg: false,
                radioflg: [],
                checkflg: [],
                pref: ""
            };
    
            this.form = $("#js__form");
            this.check = $("#js__form input,#js__form select,#js__form radio,#js__form checkbox,#js__form textarea");
            this.resetBtn = $("#reset");
            this.parent = '.js__required-wrap';
    
            this.target = "";
            this.validatelist = "";
        }
    
        _createClass(contactManager, [{
            key: "init",
            value: function init() {
    
                var _this = this;
    
                //input
                this.check.blur(function () {
                    _this.target = $(this);
                    _this.validate();
                });
                this.check.change(function () {
                    _this.target = $(this);
                    _this.toggle_about_roov();
                    _this.validate();
                });
    
                //submit
                this.form.submit(function () {
                    _this.target = "all";
                    _this.validate();
                    if (_this.status.flg) {
                        //SUBMIT!!!
                    } else {
                        $('html,body').animate({ scrollTop: _this.form.position().top }, 200);
                        return false;
                    }
                });
    
                this.toggle_about_roov();
                //[ 半角へ変換 ]
                $('input').change(function () {
                    if ($(this).attr("type") != "text") return;
                    if (!$(this).attr("id").match(/tel|email|email_confirm/g)) return;
                    var _text = $(this).val();
                    var _han = _text.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) {
                        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
                    });
                    $(this).val(_han);
                });
    
                //[ 数字のみ入力 ]
                $('input[type=tel],input[type=number]').on('keydown', function (e) {
                    var _k = e.keyCode;
                    // 0～9, テンキ―0～9, スペース, backspace, delete, →, ←, 以外は入力キャンセル
                    if (!(_k >= 48 && _k <= 57 || _k >= 96 && _k <= 105 || _k == 32 || _k == 8 || _k == 46 || _k == 39 || _k == 37)) {
                        return false;
                    }
                });
            }
        }, {
            key: "validate",
            value: function validate() {
    
                var _this = this;
    
                _this.reset();
    
                for (var i = _this.validatelist.length - 1; i >= 0; i--) {
    
                    var _target = _this.validatelist.eq(i);
                    var _val = _target.val();
                    var _type = _target.attr("type");
                    var _id = _target.attr("id");
    
                    if (!_target.hasClass('js__required')) return;
    
                    //hiragana
                    if (_id.match(/hiragana/g)) {
                        if (_val == "") {
                            _target.parents(_this.parent).append(_this.text.required);
                        } else {
                            if (!_val.match(/^[ぁ-ろわをんー 　\r\n\t]*$/)) {
                                _target.parents(_this.parent).append(_this.text.hiragana);
                            }
                        }
                    }
                    //katakana
                    else if (_id.match(/katakana/g)) {
                            if (_val == "") {
                                _target.parents(_this.parent).append(_this.text.required);
                            } else {
                                if (!_val.match(/^[ァ-ロワヲンー 　\r\n\t]*$/)) {
                                    _target.parents(_this.parent).append(_this.text.katakana);
                                }
                            }
                        }
                        //zip
                        else if (_id == "zip1" || _id == "zip2") {
                                _target.parents(_this.parent).children("span.error").remove();
                                var _num = _id == "zip1" ? 3 : 4;
                                if (_val == "") {
                                    _target.parents(_this.parent).append(_this.text.required);
                                } else {
                                    if (!_val.match(/^[0-9\-]+$/) || _val.length < _num) {
                                        _target.parents(_this.parent).append(_this.text.zip);
                                    } else {
                                        if (_target.parents(_this.parent).children("input.error")[0]) {
                                            _target.parents(_this.parent).append(_this.text.zip);
                                        }
                                    }
                                }
                            }
                            //mail
                            else if (_id == "email") {
                                    if (_val == "") {
                                        _target.parents(_this.parent).append(_this.text.required);
                                    } else {
                                        if (!_val.match(/.+@.+\..+/g)) {
                                            _target.parents(_this.parent).append(_this.text.mail);
                                        }
                                    }
                                }
                                //mailcheck
                                else if (_id == "emailcheck") {
                                        if (_val == "") {
                                            _target.parents(_this.parent).append(_this.text.required);
                                        } else if (_val != $("input[name=" + _target.attr("name").replace(/^(.+)check$/, "$1") + "]").val()) {
                                            _target.parents(_this.parent).append(_this.text.mailcheck);
                                        }
                                    }
                                    // tel
                                    else if (_type == "tel") {
                                            if (_val == "") {
                                                _target.parents(_this.parent).append(_this.text.required);
                                            } else {
                                                if (!_val.match(/^[0-9\-]+$/) || _val.length < 10) {
                                                    _target.parents(_this.parent).append(_this.text.tel);
                                                }
                                            }
                                        }
                                        //必須項目のチェック
                                        else {
                                                if (_val === "") {
                                                    _target.parents(_this.parent).append(_this.text.required);
                                                }
                                            }
                }
    
                if (_this.target == "all") {
                    for (var _i = $('.js__required-list').length - 1; _i >= 0; _i--) {
                        var _flg = false;
                        var _checklist = $('.js__required-list').eq(_i).find('input');
                        for (var j = _checklist.length - 1; j >= 0; j--) {
                            if (_checklist.eq(j).prop('checked')) {
                                _flg = true;
                            }
                        }
                        if (!_flg) {
                            $('.js__required-list').eq(_i).parents(_this.parent).append(_this.text.check);
                        }
                    }
                    var _check = $('#js__check');
                    if (_check[0]) {
                        if (!_check.prop('checked')) {
                            _check.parents(_this.parent).append(_this.text.check);
                        }
                    }
                }
    
                if (_this.form.find("span.error")[0]) {
                    _this.status.flg = false;
                } else {
                    _this.status.flg = true;
                }
            }
        }, {
            key: "reset",
            value: function reset() {
    
                var _this = this;
    
                //エラーの初期化
                if (_this.target == "all") {
                    _this.form.find("span.error").remove();
                    _this.form.find("input.error,select.error,textarea.error").removeClass("error");
                    _this.validatelist = $("[type=text],[type=email],[type=tel],[type=number],select,textarea").filter(".js__required");
                } else {
                    _this.target.parents(_this.parent).children("span.error").remove();
                    _this.validatelist = _this.target;
                    _this.validatelist.removeClass("error");
                }
            }
        }, {
            key: "resize",
            value: function resize() {}
        }, {
            key: "toggle_about_roov",
            value: function toggle_about_roov() {
                //「ROOVに関して」が選択された時の変化
                var $about = this.form.find('[name="about"]:checked');
                var $about_roov_detail = $('#contact-item_about_roov_detail'); //「ご要望（複数選択可）」
                var $tel_input = $('input[name="tel"]');
                var $tel_wrap = $tel_input.parent();
    
                if ($about) {
                    if ($about.val() === 'ROOVに関して') {
                        $about_roov_detail.show();
                        $tel_input.addClass('js__required');
                        $tel_wrap.show();
                    } else if ($about.val() === 'Webセミナー参加お申し込み' || $about.val() === 'Webセミナー動画視聴お申し込み') {
                        $about_roov_detail.hide();
                $tel_input.addClass('js__required');
                $tel_wrap.show();
                    } else {
                        $about_roov_detail.hide();
                        $tel_input.removeClass('js__required');
                        $tel_wrap.hide();
                    }
                }
            }
        }]);
    
        return contactManager;
    }();
    
    exports.default = contactManager;
    
    },{}],8:[function(require,module,exports){
    'use strict';
    
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    
    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
    
    var _param = require('../../param');
    
    var _param2 = _interopRequireDefault(_param);
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
    
    function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    var param = new _param2.default();
    
    var GoogleMapManager = function () {
        function GoogleMapManager() {
            _classCallCheck(this, GoogleMapManager);
    
            if (!$('.js__map')[0]) return;
    
            this.element = $('.js__map');
            this.latlng;
            this.map;
    
            this.option = {
                style: [{
                    "stylers": [{ "saturation": -100 }]
                }]
            };
    
            this.init();
        }
    
        _createClass(GoogleMapManager, [{
            key: 'init',
            value: function init() {
    
                var _this = this;
    
                for (var i = 0; i < _this.element.length; i++) {
    
                    _this.latlng = new google.maps.LatLng(_this.element.eq(i).data('lat'), _this.element.eq(i).data('lng'));
    
                    var myOptions = _defineProperty({
                        zoom: 17, /*拡大比率*/
                        center: _this.latlng, /*表示枠内の中心点*/
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        disableDefaultUI: false,
                        zoomControl: false,
                        streetViewControl: false,
                        mapTypeControl: false
                    }, 'zoomControl', false);
    
                    var _num = i + 1;
    
                    _this.map = new google.maps.Map(document.getElementById('js__map' + _num), myOptions);
    
                    //let Url = location.href;
    
                    var width = void 0;
                    var height = void 0;
    
                    if (param.displayType == "pc") {
                        width = 98;
                        height = 100;
                    } else {
                        width = 49;
                        height = 50;
                    }
    
                    var _icon1 = {
                        url: '../assets/img/about/b-icon_map.png',
                        scaledSize: new google.maps.Size(width, height)
                        // ↑ここで画像のサイズを指定
                    };
    
                    var markerOptions = new google.maps.Marker({
                        position: _this.latlng,
                        map: _this.map,
                        icon: _icon1
                    });
    
                    markerOptions.setMap(_this.map);
    
                    var _styledMapOptions = { name: '所在地' };
                    var _mapStyle = new google.maps.StyledMapType(_this.option.style, _styledMapOptions);
    
                    _this.map.mapTypes.set('js__map' + _num, _mapStyle);
                    _this.map.setMapTypeId('js__map' + _num);
                }
            }
        }, {
            key: 'resize',
            value: function resize() {}
        }]);
    
        return GoogleMapManager;
    }();
    
    exports.default = GoogleMapManager;
    
    },{"../../param":23}],9:[function(require,module,exports){
    "use strict";
    
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    
    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    var Util = function () {
        function Util() {
            _classCallCheck(this, Util);
    
            /* updateTimeRatio 用 */
            this.time;
            this.FPS_60_SEC = 1000 / 60;
        }
    
        _createClass(Util, [{
            key: "radian",
            value: function radian(degree) {
                return degree * Math.PI / 180;
            }
    
            // 角度に変換
            // -----------------------------------
    
        }, {
            key: "degree",
            value: function degree(radian) {
                return radian * 180 / Math.PI;
            }
        }, {
            key: "random",
            value: function random(min, max) {
                return Math.random() * (max - min) + min;
            }
        }, {
            key: "range",
            value: function range(val) {
                return this.random(-val, val);
            }
    
            // 値のマッピング
            // -----------------------------------
            // @num     : マッピングする値
            // @toMin   : 変換後の最小値
            // @toMax   : 変換後の最大値
            // @fromMin : 変換前の最小値
            // @fromMax : 変換前の最大値
            // -----------------------------------
    
        }, {
            key: "map",
            value: function map(num, toMin, toMax, fromMin, fromMax) {
                if (num <= fromMin) return toMin;
                if (num >= fromMax) return toMax;
    
                var p = (toMax - toMin) / (fromMax - fromMin);
                return (num - fromMin) * p + toMin;
            }
    
            // ランダムな数(int)
            // -----------------------------------
            // @min : 最小値(int)
            // @max : 最大値(int)
            // return : min(含む)からmax(含む)までのランダムな数(int)
            // -----------------------------------
    
        }, {
            key: "randomInt",
            value: function randomInt(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
            // 1/@rangeの確率でtrueを取得
            // -----------------------------------
            // @range : 2以上の分母(int)
            // return : true or false(boolean)
            // -----------------------------------
    
        }, {
            key: "hit",
            value: function hit(range) {
                if (range < 2 || !range) {
                    range = 2;
                }
                return this.randomInt(0, range - 1) == 0;
            }
    
            // fpsのタイムレートを算出
    
        }, {
            key: "updateTimeRatio",
            value: function updateTimeRatio() {
                var _lastTime = this.time;
                var _timeRatio = 1;
                if (_lastTime > 0) {
                    var _dTime = new Date().getTime() - _lastTime;
                    _timeRatio = _dTime / this.FPS_60_SEC;
                }
                this.time = new Date().getTime();
    
                return _timeRatio;
            }
        }]);
    
        return Util;
    }();
    
    exports.default = Util;
    
    },{}],10:[function(require,module,exports){
    'use strict';
    
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    
    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    var Manager = function () {
        function Manager() {
            _classCallCheck(this, Manager);
    
            /* 必要なDOM */
            this.trigger = $('.js__modal');
            this.content = $('.p-style-kv-sp__list');
            this.bg = $('.p-style-kv-sp__bg');
            this.closeBtn = $('.p-style-kv-sp__list__close');
            this.contentList = $('.p-style-kv-sp__list ul li');
            this.hide = $('#l-scroll,#l-header,#p-style-kv');
    
            /* 設定 */
    
            /* ステータス */
        }
    
        _createClass(Manager, [{
            key: 'init',
            value: function init() {
                var _this = this;
                this.trigger.on('click', function () {
                    _this.open();
                });
                this.closeBtn.on('click', function () {
                    _this.close();
                });
            }
        }, {
            key: 'open',
            value: function open() {
                var _this = this;
                TweenMax.set([this.contentList.children(), this.bg], {
                    alpha: 0,
                    display: 'none'
                });
                TweenMax.set(this.contentList.children().eq(0), {
                    x: -20
                });
                TweenMax.set(this.contentList.children().eq(1), {
                    x: 20
                });
                TweenMax.set(this.bg, {
                    scale: 0.8
                });
    
                TweenMax.to(this.content, 1.8, {
                    alpha: 1,
                    display: 'block',
                    ease: Expo.easeOut,
                    onStart: function onStart() {
                        for (var i = 0; i < _this.contentList.length; i++) {
                            TweenMax.to(_this.contentList.eq(i).children(), 1.2, {
                                delay: 0.2 * i,
                                alpha: 1,
                                display: 'block',
                                x: 0,
                                ease: Expo.easeOut
                            });
                        }
                    }
                });
                TweenMax.set(this.bg, {
                    delay: 0.6,
                    alpha: 1,
                    display: 'block',
                    scale: 1,
                    ease: Expo.easeIn
                });
    
                TweenMax.to(_this.hide, 1.2, {
                    alpha: 0,
                    ease: Expo.easeOut
                });
            }
        }, {
            key: 'close',
            value: function close() {
    
                var _this = this;
    
                $('html,body').animate({ scrollTop: window.innerHeight }, '1', function () {
                    TweenMax.to(_this.hide, 0.5, {
                        alpha: 1,
                        ease: Expo.easeOut
                    });
                });
    
                TweenMax.to(this.contentList.children().eq(0), 0.6, {
                    alpha: 0,
                    display: 'none',
                    x: -20,
                    ease: Expo.easeOut
                });
                TweenMax.to(this.contentList.children().eq(1), 0.6, {
                    alpha: 1,
                    display: 'block',
                    x: 20,
                    ease: Expo.easeOut
                });
                TweenMax.to(this.content, 0.5, {
                    alpha: 0,
                    display: 'none'
                });
            }
        }]);
    
        return Manager;
    }();
    
    exports.default = Manager;
    
    },{}],11:[function(require,module,exports){
    "use strict";
    
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    
    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    var pararax3d = function () {
        function pararax3d() {
            _classCallCheck(this, pararax3d);
    
            this.$container = $(".js__3d-area");
            this.matrixValues = {
                "layer0": [2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1]
            };
            this.mouse = {
                incX: 0,
                incY: 0,
                nowX: 0,
                nowY: 0
            };
            this.xy = [];
        }
    
        _createClass(pararax3d, [{
            key: "init",
            value: function init() {
    
                this.$container = $(".js__3d-area");
            }
        }, {
            key: "moveMouse",
            value: function moveMouse(x, y, type) {
    
                this.mouse.incX = x;
                this.mouse.incY = y;
    
                var targetWidth = window.innerWidth;
                var targetHeight = window.innerHeight;
                var centeredXPos = -x + targetWidth / 2;
                var centeredYPos = -y + targetHeight / 2;
    
                centeredXPos = centeredXPos.map(-(targetWidth / 2), targetWidth / 2, Math.PI, 2 * Math.PI);
                centeredYPos = centeredYPos.map(-(targetHeight / 2), targetHeight / 2, Math.PI, 2 * Math.PI);
                centeredXPos = Math.cos(centeredXPos);
                centeredYPos = Math.cos(centeredYPos);
                var wrapper = this.$container.find(".js__3d-trans,.js__dir-y-3d");
    
                if (type == "out") {
                    return this.transNum(this.matrixValues["layer0"], centeredYPos * 10, centeredXPos * 10, 0);
                } else {
                    this.trans(wrapper, this.matrixValues["layer0"], centeredYPos * 10, centeredXPos * 10, 0);
                }
            }
        }, {
            key: "trans",
            value: function trans(target, matrix, x, y, z) {
    
                x = x * Math.PI / 180;
                y = y * Math.PI / 180;
                z = z * Math.PI / 180;
                var sin = Math.sin;
                var cos = Math.cos;
                matrix[0] = cos(y) * cos(z);
                matrix[1] = -cos(y) * sin(z);
                matrix[2] = sin(y);
                matrix[3] = 0;
                matrix[4] = cos(x) * sin(z) + sin(x) * sin(y) * cos(z);
                matrix[5] = cos(x) * cos(z) - sin(x) * sin(y) * sin(z);
                matrix[6] = -sin(x) * cos(y);
                matrix[7] = 0;
                matrix[8] = sin(x) * sin(z) - cos(x) * sin(y) * cos(z);
                matrix[9] = sin(x) * cos(z) + cos(x) * sin(y) * sin(z);
                matrix[10] = cos(x) * cos(y);
                matrix[11] = 0;
                this.applyTransform(target, matrix);
            }
        }, {
            key: "transNum",
            value: function transNum(matrix, x, y, z) {
    
                x = x * Math.PI / 180;
                y = y * Math.PI / 180;
                z = z * Math.PI / 180;
                var sin = Math.sin;
                var cos = Math.cos;
                matrix[0] = cos(y) * cos(z);
                matrix[1] = -cos(y) * sin(z);
                matrix[2] = sin(y);
                matrix[3] = 0;
                matrix[4] = cos(x) * sin(z) + sin(x) * sin(y) * cos(z);
                matrix[5] = cos(x) * cos(z) - sin(x) * sin(y) * sin(z);
                matrix[6] = -sin(x) * cos(y);
                matrix[7] = 0;
                matrix[8] = sin(x) * sin(z) - cos(x) * sin(y) * cos(z);
                matrix[9] = sin(x) * cos(z) + cos(x) * sin(y) * sin(z);
                matrix[10] = cos(x) * cos(y);
                matrix[11] = 0;
                //console.log(matrix.toString());
                //return "matrix3d(" + matrix.toString() + ")";
                return matrix;
            }
        }, {
            key: "rotateX",
            value: function rotateX(target, angle) {
                var radians = angle * Math.PI / 180;
                var sin = Math.sin;
                var cos = Math.cos;
                this.matrixValues[5] = cos(radians);
                this.matrixValues[6] = sin(radians);
                this.matrixValues[8] = sin(radians);
                this.matrixValues[9] = cos(radians);
                this.applyTransform(target);
            }
        }, {
            key: "rotateX",
            value: function rotateX(target, angle) {
                var radians = angle * Math.PI / 180;
                var sin = Math.sin;
                var cos = Math.cos;
                this.matrixValues[5] = cos(radians);
                this.matrixValues[6] = sin(radians);
                this.matrixValues[8] = sin(radians);
                this.matrixValues[9] = cos(radians);
                this.applyTransform(target);
            }
        }, {
            key: "rotateY",
            value: function rotateY(target, angle) {
                var radians = angle * Math.PI / 180;
                var sin = Math.sin;
                var cos = Math.cos;
                this.matrixValues[0] = cos(radians);
                this.matrixValues[2] = sin(radians);
                this.matrixValues[7] = -sin(radians);
                this.matrixValues[9] = cos(radians);
                this.applyTransform(target);
            }
        }, {
            key: "rotateZ",
            value: function rotateZ(target, angle) {
                var radians = angle * Math.PI / 180;
                var sin = Math.sin;
                var cos = Math.cos;
                this.matrixValues[0] = cos(radians);
                this.matrixValues[1] = -sin(radians);
                this.matrixValues[4] = sin(radians);
                this.matrixValues[5] = cos(radians);
                this.applyTransform(target);
            }
        }, {
            key: "matrix3dTrans",
            value: function matrix3dTrans(matrix) {
                return matrix;
            }
        }, {
            key: "applyTransform",
            value: function applyTransform(target, matrix) {
                var matrix3d = "matrix3d(" + matrix.toString() + ")";
                target.css({
                    '-webkit-transform': matrix3d,
                    '-moz-transform': matrix3d,
                    '-ms-transform': matrix3d,
                    '-o-transform': matrix3d,
                    'transform': matrix3d
                });
            }
        }]);
    
        return pararax3d;
    }();
    
    exports.default = pararax3d;
    
    
    Number.prototype.map = function (in_min, in_max, out_min, out_max) {
        return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    };
    
    },{}],12:[function(require,module,exports){
    'use strict';
    
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    
    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
    
    var _param = require('../../param');
    
    var _param2 = _interopRequireDefault(_param);
    
    var _util = require('../libs/util');
    
    var _util2 = _interopRequireDefault(_util);
    
    var _effect = require('../effect');
    
    var _effect2 = _interopRequireDefault(_effect);
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    var param = new _param2.default();
    var effect = new _effect2.default();
    var util = new _util2.default();
    
    /* ---------------------------------------
    
        -- マウス動作に合わせていい感じに値を返すやつ
    
    --------------------------------------- */
    
    var MouseManager = function () {
        function MouseManager(inc) {
            _classCallCheck(this, MouseManager);
    
            /* ポインターの位置情報 */
            this.pointer = {
                x: 0,
                y: 0
                /* 慣性動作後の値 */
            };this.obj = {
                x: 0,
                y: 0
    
                /* 設定はここ */
            };this.conf = {
                ease: 0.2
            };
        }
    
        _createClass(MouseManager, [{
            key: 'move',
            value: function move(type) {
                /* domにスタイル付けるなら("set",$target) | 値が欲しいだけなら()なし */
    
                this.obj.x += (this.pointer.x - this.obj.x) * this.conf.ease;
                this.obj.y += (this.pointer.y - this.obj.y) * this.conf.ease;
            }
        }, {
            key: 'update',
            value: function update(x, y) {
    
                if (Useragnt.pc) {
                    this.pointer.x = x;
                    this.pointer.y = y;
                } else {
                    this.pointer.x = x;
                    this.pointer.y = -y;
                }
                // console.log(this.pointer);
            }
        }]);
    
        return MouseManager;
    }();
    
    exports.default = MouseManager;
    
    },{"../../param":23,"../effect":2,"../libs/util":9}],13:[function(require,module,exports){
    'use strict';
    
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    
    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
    
    var _param = require('../../param');
    
    var _param2 = _interopRequireDefault(_param);
    
    var _effect = require('../effect');
    
    var _effect2 = _interopRequireDefault(_effect);
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    var param = new _param2.default();
    var effect = void 0;
    
    /* ---------------------------------------
    
        -- 要素の表示、非表示を管理
    
    --------------------------------------- */
    
    var Contents = function () {
        function Contents() {
            _classCallCheck(this, Contents);
    
            this.h = 0;
    
            effect = new _effect2.default();
    
            this.$header = $("#l-header");
            this.$footer = $("#l-footer");
            this.offset = {
                header: window.innerHeight,
                scrollDown: 10,
                pagetop: this.$footer.offset().top
            };
    
            this.status = {
                header: false,
                scrollDown: true
            };
        }
    
        _createClass(Contents, [{
            key: 'update',
            value: function update(inc) {
    
                /* ---------------------------------------------
                  -- [ ヘッダ切り替え/スクロールダウンの表示 ]
                 --------------------------------------------- */
    
                if ($('#p-kv')[0]) {
                    var _this = this;
                    if (inc > this.offset.header) {
                        if (!this.status.header) {
                            this.status.header = true;
                            // TweenMax.to(this.$header,0.4,{
                            //     y:-100,
                            //     ease:Power2.easeOut,
                            //     onComplete:function () {
                            //         _this.$header.removeClass("is-white");
                            //         TweenMax.to(_this.$header,0.4, {
                            //             y: 0,
                            //             ease: Power2.easeOut,
                            //         });
                            //     }
                            // });
                        }
                    } else {
                        if (this.status.header) {
                            this.status.header = false;
                            // TweenMax.to(this.$header,0.4,{
                            //     y:-100,
                            //     ease:Power2.easeOut,
                            //     onComplete:function () {
                            //         _this.$header.addClass("is-white");
                            //         TweenMax.to(_this.$header,0.4, {
                            //             y: 0,
                            //             ease: Power2.easeOut,
                            //         });
                            //     }
                            // });
                        }
                    }
                }
            }
        }, {
            key: 'resize',
            value: function resize(winH) {
    
                this.h = winH;
    
                param.displayType = window.innerWidth > param.breakpoint ? "pc" : "sp";
    
                this.offset.header = param.displayType === "pc" ? this.h : 260;
                this.offset.pagetop = this.$footer.offset().top;
            }
        }]);
    
        return Contents;
    }();
    
    exports.default = Contents;
    
    },{"../../param":23,"../effect":2}],14:[function(require,module,exports){
    'use strict';
    
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    
    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
    
    var _param = require('../../param');
    
    var _param2 = _interopRequireDefault(_param);
    
    var _effect = require('../effect');
    
    var _effect2 = _interopRequireDefault(_effect);
    
    var _dPararax = require('../mouse/3dPararax');
    
    var _dPararax2 = _interopRequireDefault(_dPararax);
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    var param = void 0;
    var effect = void 0;
    
    /* ---------------------------------------
    
        -- スクロール連動はここ
    
    --------------------------------------- */
    
    var Pararax = function () {
        function Pararax(inc) {
            _classCallCheck(this, Pararax);
    
            param = new _param2.default();
            effect = new _effect2.default();
    
            this.$prarax = $('.js__psc');
            this.paraPoint = [];
            this.paraNum = this.$prarax.length;
    
            /*  ステータスをセット */
            this.status = [];
    
            for (var i = 0; this.paraNum > i; i++) {
                var $p = this.$prarax.eq(i);
    
                this.status[i] = {
                    rate: $p.data('rate'),
                    type: ""
                };
    
                if ($p.hasClass("js__dir-y")) {
                    this.status[i].type = "dir-y";
                } else if ($p.hasClass("js__dir-y-minus")) {
                    this.status[i].type = "dir-y-minus";
                } else if ($p.hasClass("js__dir-scale")) {
                    this.status[i].type = "dir-scale";
                } else {
                    this.status[i].type = "dir-default";
                }
            }
    
            // this.datGUI();
        }
    
        _createClass(Pararax, [{
            key: 'check',
            value: function check(inc, winH) {
    
                if (param.displayType === 'sp') return;
    
                for (var i = 0; this.paraNum > i; i++) {
    
                    if (this.paraPoint[i].start < inc && this.paraPoint[i].end > inc) {
                        var $p = this.$prarax.eq(i);
    
                        var pInc = (inc - this.paraPoint[i].base) * this.status[i].rate;
    
                        switch (this.status[i].type) {
                            case "dir-y":
                                TweenMax.set(this.$prarax.eq(i), {
                                    "y": -pInc
                                });
                                break;
                            case "dir-y-minus":
                                TweenMax.set(this.$prarax.eq(i), {
                                    "y": pInc
                                });
                                break;
                            case "dir-scale":
                                var _pinc = 1.1 + pInc / 280;
                                TweenMax.set(this.$prarax.eq(i), {
                                    "scale": _pinc
                                });
                                break;
                            default:
                                TweenMax.set(this.$prarax.eq(i), {
                                    "x": -pInc / 2
                                });
                                break;
                        }
                    }
                }
            }
        }, {
            key: 'resize',
            value: function resize(winH) {
                this.paraPoint = [];
                for (var i = 0; i < this.paraNum; i++) {
    
                    var $p = this.$prarax.eq(i);
    
                    this.paraPoint[i] = {
                        base: $p.offset().top,
                        start: $p.offset().top - winH,
                        end: $p.offset().top + winH
                    };
                }
            }
        }, {
            key: 'datGUI',
            value: function datGUI() {
                var _gui = new dat.gui.GUI();
    
                _gui.remember(effect);
                // //
    
                var _f1 = _gui.addFolder('bodybg');
                // _f1.add(effect.conf, 'rotRadius', 0, 90);
                _f1.add(effect.conf, 'scrollInc', 0.00, 2.00);
                _f1.add(effect.conf, 'transY', 0.00, 2.00);
                _f1.add(effect.conf, 'transX', 0.00, 2.00);
                // let startPosiX = _f1.add(effect.conf, 'startPosiX', 0, 1000);
                // _f1.add(effect.conf, 'transZ', 0.00, 2.00);
                _f1.add(effect.conf, 'transRot', -2.00, 2.00);
            }
        }]);
    
        return Pararax;
    }();
    
    exports.default = Pararax;
    
    },{"../../param":23,"../effect":2,"../mouse/3dPararax":11}],15:[function(require,module,exports){
    'use strict';
    
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    
    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
    
    var _param = require('../../param');
    
    var _param2 = _interopRequireDefault(_param);
    
    var _pararax = require('./pararax');
    
    var _pararax2 = _interopRequireDefault(_pararax);
    
    var _scrollanimation = require('./scrollanimation');
    
    var _scrollanimation2 = _interopRequireDefault(_scrollanimation);
    
    var _contents = require('./contents');
    
    var _contents2 = _interopRequireDefault(_contents);
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    var param = new _param2.default();
    var pararax = void 0;
    var scrollAnimation = void 0;
    var contents = void 0;
    
    var smoothScrollManager = function () {
        function smoothScrollManager(inc, type) {
            _classCallCheck(this, smoothScrollManager);
    
            if (type === "landing") {
                pararax = new _pararax2.default();
                // pager = new Pager();
                contents = new _contents2.default();
            }
            scrollAnimation = new _scrollanimation2.default();
    
            this.w = $(window).innerWidth();
            this.h = $(window).innerHeight();
    
            this.$container = $("#l-scroll");
            this.$body = $("#l-scroll-body");
            this.$pararax = $(".js__psc");
    
            this.$prarax;
            this.$target;
            this.$scrollDown = $("#c-scrolldown");
            this.exPoint = []; /* 今回のゆらゆらのwebgl offsetを保持する用 */
    
            this.flg = false;
    
            this.inc = 0;
            this.nowInc = 0;
            this.prevInc = 0;
            this.amount = 0;
    
            this.paraPoint = [];
    
            this.scrollLimit = 0; // scroll limit
    
            this.timer = [];
    
            this.type = "normal";
    
            this.inertia = Useragnt.mobile || Useragnt.tablet ? false : true; /* 慣性スクロールを有効にするか */
    
            this.bodyMatrix;
            this.pararaxMatrix;
    
            /* 状態監視用のフラグ */
            this.status = {
                controll: false, /* ページャーなどで操作しているか */
                comp: true /* 慣性スクロールが完了したか */
            };
        }
    
        _createClass(smoothScrollManager, [{
            key: 'init',
            value: function init() {
    
                var _this = this;
    
                // pager.init();
    
                if (!this.inertia) $("body").addClass("is-inertia-none");
    
                $("#c-pagetop,#c-pagetop-sp").on("click", function () {
                    $('html,body').animate({ scrollTop: 0 }, '1');
                });
            }
        }, {
            key: 'update',
            value: function update(inc, dir) {
                /* スクロール方向を決めうちしないならdirは空で渡してください */
                this.inc = inc;
                this.dir = dir === "" ? this.inc > this.prevInc ? "next" : "prev" : dir;
                // this.prevInc = this.inc;
                this.mode = "scroll";
                this.status.comp = false;
                this.exPoint = 1;
            }
        }, {
            key: 'move',
            value: function move(fpsRate) {
    
                var _this = this;
    
                var add = this.inertia ? 0.08 : 0.08;
    
                /* フルスクリーン制御用 */
                //let _y = util.map(_this.inc, 0, -(_this.scrollLimit - _this.firstMvInc), 0, 1);
    
                _this.nowInc += add * (_this.inc - _this.nowInc) * fpsRate;
                _this.nowInc = _this.nowInc >= 0 ? Math.floor(_this.nowInc * 10) / 10 : 0;
    
                _this.trans();
            }
        }, {
            key: 'trans',
            value: function trans() {
    
                var _this = this;
    
                if (this.inertia) {
                    if ($('body#style')[0] && this.w < param.breakpoint) return;
                    TweenMax.set(this.$body, { y: -this.nowInc });
                }
                /* スクロール連動で動作 */
                pararax.check(this.nowInc, this.h);
                // pager.update(this.nowInc,this.dir,this.h);
                contents.update(this.nowInc);
    
                /* アニメーション対象の要素があるかチェック */
                scrollAnimation.check(this.nowInc, this.h);
    
                if (this.nowInc > this.prevInc && this.nowInc - this.prevInc < 0.1 || this.nowInc < this.prevInc && this.prevInc - this.nowInc < 0.1) {
                    this.onComplete();
                }
                this.prevInc = this.nowInc;
            }
        }, {
            key: 'resize',
            value: function resize(_w, _h) {
    
                this.w = _w;
                if ($("#l-root").hasClass("is-modal-open")) return;
    
                if (param.userAgent === 'pc') {
                    $("#l-root").css({ "height": this.$container.innerHeight() });
                }
    
                pararax.resize(_h);
                scrollAnimation.resize(_h);
                contents.resize(_h);
            }
    
            /* -------------------------------------------
               -- Callback
             ------------------------------------------- */
    
        }, {
            key: 'onComplete',
            value: function onComplete() {
                /* スクロール動作が終わったら */
                if (this.status.comp) return;
                this.status.comp = true;
    
                if (param.userAgent === 'sp' || param.userAgent === 'tablet') return;
    
                //body用
                this.bodyMatrix = this.$body.css('transform');
                this.bodyMatrix = this.matrix2d(this.bodyMatrix);
                this.bodyMatrix[3][1] = Math.round(this.bodyMatrix[3][1]);
                this.bodyMatrix = "matrix3d(" + this.bodyMatrix.toString() + ")";
                this.$body.css({
                    '-webkit-transform': this.bodyMatrix,
                    'transform': this.bodyMatrix
                });
    
                //pararax用
                for (var i = 0; i < this.$pararax.length; i++) {
                    this.pararaxMatrix = this.$pararax.eq(i).css('transform');
                    this.pararaxMatrix = this.matrix2d(this.pararaxMatrix);
                    if (!this.pararaxMatrix) return;
                    this.pararaxMatrix[3][1] = Math.round(this.pararaxMatrix[3][1]);
                    this.pararaxMatrix = "matrix3d(" + this.pararaxMatrix.toString() + ")";
                    this.$pararax.eq(i).css({
                        '-webkit-transform': this.pararaxMatrix,
                        'transform': this.pararaxMatrix
                    });
                }
            }
        }, {
            key: 'matrix3d',
            value: function matrix3d(_matrix3d) {
                var re = /matrix3d\((.*)\)/;
                var vals = _matrix3d.match(re)[1].replace(/ /g, "").split(",");
                vals = vals.map(Number);
                var matrix = [new Array(4), new Array(4), new Array(4), new Array(4)];
    
                matrix[0][0] = vals[0];
                matrix[0][1] = vals[1];
                matrix[0][2] = vals[2];
                matrix[0][3] = vals[3];
                matrix[1][0] = vals[4];
                matrix[1][1] = vals[5];
                matrix[1][2] = vals[6];
                matrix[1][3] = vals[7];
                matrix[2][0] = vals[8];
                matrix[2][1] = vals[9];
                matrix[2][2] = vals[10];
                matrix[2][3] = vals[11];
                matrix[3][0] = vals[12];
                matrix[3][1] = vals[13];
                matrix[3][2] = vals[14];
                matrix[3][3] = vals[15];
    
                return matrix;
            }
        }, {
            key: 'matrix2d',
            value: function matrix2d(matrix3d) {
                var re = /matrix\((.*)\)/;
                if (matrix3d === 'none') return;
                var vals = matrix3d.match(re)[1].replace(/ /g, "").split(",");
                vals = vals.map(Number);
                var matrix = [new Array(4), new Array(4), new Array(4), new Array(4)];
    
                matrix[0][0] = vals[0];
                matrix[0][1] = vals[1];
                matrix[0][2] = 0;
                matrix[0][3] = 0;
                matrix[1][0] = vals[2];
                matrix[1][1] = vals[3];
                matrix[1][2] = 0;
                matrix[1][3] = 0;
                matrix[2][0] = 0;
                matrix[2][1] = 0;
                matrix[2][2] = 1;
                matrix[2][3] = 0;
                matrix[3][0] = vals[4];
                matrix[3][1] = vals[5];
                matrix[3][2] = 0;
                matrix[3][3] = 1;
    
                return matrix;
            }
    
            /* -------------------------------------------
               -- ステータスいじいじするやつ
             ------------------------------------------- */
    
        }, {
            key: 'datGUI',
            value: function datGUI() {}
        }]);
    
        return smoothScrollManager;
    }();
    
    exports.default = smoothScrollManager;
    
    },{"../../param":23,"./contents":13,"./pararax":14,"./scrollanimation":16}],16:[function(require,module,exports){
    'use strict';
    
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    
    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
    
    var _effect = require('../effect');
    
    var _effect2 = _interopRequireDefault(_effect);
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    var effect = void 0;
    
    /* ---------------------------------------
    
        -- スクロール位置で発火するやつはここ
    
    --------------------------------------- */
    
    var ScrollAnimation = function () {
        function ScrollAnimation(inc) {
            _classCallCheck(this, ScrollAnimation);
    
            effect = new _effect2.default();
    
            this.$target = $('.js__tsc');
            this.scPoint = [];
            this.scNum = this.$target.length;
    
            effect.splitText($(".js__tsc-splittext"), "set");
            effect.content($(".js__tsc-content"), "set");
            effect.fade($(".js__tsc-fade"), "set");
            effect.scale($(".js__tsc-scale"), "set");
            effect.Title($(".js__tsc-title"), "set");
            effect.sectionTitle($(".js__tsc-section-title"), "set");
            effect.lineText($('#p-top-our-vision__big-text'), "set");
            effect.photoCover($(".js__tsc-photo-cover"), "set");
            this.resize();
    
            this.status = {
                comp: false /* 全部処理が終わったか */
            };
        }
    
        _createClass(ScrollAnimation, [{
            key: 'check',
            value: function check(inc, winH) {
    
                if (this.status.comp) return;
    
                var _minusPoint = Useragnt.pc ? winH / 1.5 : winH;
    
                if (this.$target) {
                    for (var i = 0; this.scNum > i; i++) {
                        if (this.scPoint[i] - _minusPoint < inc) {
    
                            var $scp = this.$target.eq(i);
                            if (!$scp.hasClass("is-show")) {
                                $scp.addClass("is-show");
    
                                var _$splitText = $scp.find(".js__tsc-splittext >* >*");
                                var _$content = $scp.find(".js__tsc-content>.js__tsc-cover");
                                var _$fade = $scp.find(".js__tsc-fade");
                                var _$scale = $scp.find(".js__tsc-scale");
                                var _$title = $scp.find(".js__tsc-title");
                                var _$sectionTitle = $scp.find(".js__tsc-section-title");
                                var _$cover = $scp.find(".js__tsc-photo-cover");
    
                                if (_$splitText[0]) effect.splitText(_$splitText, "show");
                                if (_$content[0]) effect.content(_$content, "show");
                                if (_$fade[0]) effect.fade(_$fade, "show");
                                if (_$scale[0]) effect.scale(_$scale, "show");
                                if (_$title[0]) effect.Title(_$title, "show");
                                if (_$sectionTitle[0]) effect.sectionTitle(_$sectionTitle, "show");
                                if (_$cover[0]) effect.photoCover(_$cover, "show");
    
                                if (i == this.$target.length - 1) this.status.comp = true;
                            }
                        }
                    }
                }
            }
        }, {
            key: 'resize',
            value: function resize() {
    
                if (this.$target) {
    
                    this.scPoint = [];
                    for (var i = 0; i < this.scNum; i++) {
    
                        var $scp = this.$target.eq(i);
    
                        this.scPoint[i] = $scp.offset().top;
                    }
                }
            }
        }]);
    
        return ScrollAnimation;
    }();
    
    exports.default = ScrollAnimation;
    
    },{"../effect":2}],17:[function(require,module,exports){
    'use strict';
    
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    
    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
    
    var _effect = require('../effect');
    
    var _effect2 = _interopRequireDefault(_effect);
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    var effect = new _effect2.default();
    
    var animeManager = function () {
        function animeManager() {
            _classCallCheck(this, animeManager);
    
            // element
            this.kv = $('#p-kv');
            this.kvCopy = $('#p-kv__copy');
            this.content = $('#p-top-content');
        }
    
        _createClass(animeManager, [{
            key: 'move',
            value: function move(manage, type) {
    
                var _this = this;
                var _delay = 0;
    
                if (type === 'drag') {
    
                    manage.webgl._state = 'ch1';
                    _delay = 2e3;
    
                    var _element = $('#p-kv__drag__inner,#p-kv__description>*');
                    TweenMax.to(_element, 1.4, {
                        x: 0,
                        y: 0,
                        z: -2000,
                        rotationX: 125,
                        force3D: true,
                        opacity: 0,
                        ease: Power2.easeOut
                    });
                } else if (manage.current === 0 && type === 'next' || manage.current === 4 && type === 'next') {
                    //webgl hide
    
                    _this.display('out', 'top');
    
                    TweenMax.set("html", {
                        delay: 1,
                        className: "-=is-no-scroll"
                    });
                    effect.topAnimation('out');
                    return;
                }
    
                var _hideTarget = $('.p-kv__inner.is-current').attr('id');
    
                if (_hideTarget === 'intro' && _this.current === 5 || type === 'page') {} else {
                    effect.depth($('.p-kv__inner.is-current .p-kv__copy').children('.text-inner').children(), 'out', _hideTarget);
                }
                setTimeout(function () {
                    var $current = $('#' + manage.webgl._state);
                    var $target = $current.find('.p-kv__copy').children('.text-inner').children().children();
                    $current.addClass('is-current');
                    effect.depth($target, 'set');
                    effect.depth($target, 'in');
                }, _delay);
            }
        }, {
            key: 'display',
            value: function display(type, pageID, webgl) {
    
                var _this = this;
                var _canvas = $('body>canvas');
    
                switch (type) {
                    case "out":
    
                        TweenMax.killChildTweensOf('#p-kv', '#p-top-our-vision .p-top-section__text-content');
                        _this.content.find().removeAttr('style');
    
                        TweenMax.set($('#l-scroll'), {
                            className: "-=is-hide"
                        });
    
                        TweenMax.set(_this.content, {
                            y: $(window).height(),
                            opacity: 1
                        });
                        webgl.webgl.moveToNextScene();
                        TweenMax.to(_canvas, 1.6, {
                            delay: 0.5,
                            opacity: 0,
                            ease: Power2.easeOut,
                            onComplete: function onComplete() {
                                webgl.webgl.pause();
                                if (pageID !== 'top') return;
                                webgl.scrFlg = true;
                                TweenMax.set("html", {
                                    className: "-=is-no-scroll"
                                });
                                TweenMax.set(_this.kv, {
                                    zIndex: -1
                                });
                            }
                        });
                        TweenMax.to(_this.content, 1.7, {
                            delay: 1.6,
                            y: '0',
                            ease: Expo.easeOut,
                            onStart: function onStart() {
    
                                TweenMax.to("#l-header", 0.6, {
                                    y: -100,
                                    ease: Power2.easeOut,
                                    onComplete: function onComplete() {
                                        TweenMax.set("#l-header", {
                                            className: "-=is-white"
                                        });
                                        TweenMax.to("#l-header", 0.4, {
                                            y: 0,
                                            delay: 1,
                                            ease: Power2.easeOut
                                        });
                                    }
                                });
                            },
                            onComplete: function onComplete() {
                                webgl.animeFlg = false;
                                $('body').css({ 'background': '#fff' });
                            }
                        });
                        //set
                        TweenMax.set($("#p-top-our-vision").find('.p-top-section__sub-title,.p-top-section__text'), {
                            'opacity': 0
                        });
                        if (webgl.current === 0 || webgl.current === 4) {
                            effect.topAnimation("out");
                        }
    
                        break;
                    case "show":
    
                        webgl.webgl.start();
                        webgl.webgl.moveToPrevScene();
    
                        TweenMax.set(_this.kv, {
                            zIndex: 5
                        });
    
                        $('body').removeAttr('style');
    
                        TweenMax.to("#l-header", 0.4, {
                            y: -100,
                            ease: Power2.easeOut,
                            onComplete: function onComplete() {
                                TweenMax.set("#l-header", {
                                    className: "+=is-white"
                                });
                                TweenMax.to("#l-header", 0.4, {
                                    y: 0,
                                    ease: Power2.easeOut
                                });
                            }
                        });
                        webgl.scrFlg = false;
                        TweenMax.set("html", {
                            className: "+=is-no-scroll"
                        });
    
                        if (webgl.current === 0 || webgl.current === 4) {
    
                            effect.lineText($('#p-top-our-vision__big-text'), "out");
    
                            TweenMax.to(_this.content, 1, {
                                y: $(window).height(),
                                ease: Expo.easeIn,
                                onComplete: function onComplete() {
                                    _this.content.removeAttr('style');
                                    TweenMax.to(_canvas, 1.4, {
                                        opacity: 1,
                                        ease: Expo.easeOut
                                    });
                                    webgl.animeFlg = false;
                                    effect.topAnimation("set");
                                    effect.topAnimation("show");
                                    $('#intro').addClass('is-current');
                                    TweenMax.set($('#l-scroll'), {
                                        className: "+=is-hide"
                                    });
                                }
                            });
                        } else {
                            setTimeout(function () {
                                TweenMax.to(_canvas, 1.4, {
                                    opacity: 1,
                                    ease: Expo.easeOut
                                });
                                webgl.animeFlg = false;
                                TweenMax.set($('#l-scroll'), {
                                    className: "+=is-hide"
                                });
                            }, 3e3);
                        }
    
                        break;
                }
            }
        }]);
    
        return animeManager;
    }();
    
    exports.default = animeManager;
    
    },{"../effect":2}],18:[function(require,module,exports){
    'use strict';
    
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    
    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
    
    var _param = require('../../param');
    
    var _param2 = _interopRequireDefault(_param);
    
    var _effect = require('../effect');
    
    var _effect2 = _interopRequireDefault(_effect);
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    var param = new _param2.default();
    var effect = new _effect2.default();
    
    var dragManager = function () {
        function dragManager(manage, webgl) {
            _classCallCheck(this, dragManager);
    
            //drag drop
            this.drag = {
                flag: false,
                position: 0,
                move: 0,
                set: 0,
                element: $('#p-kv__drag-start'),
                line: $('#p-kv__drag-line'),
                lineW: $('#p-kv__drag-line').width(),
                lineP: parseInt($('#p-kv__drag-line').css('left')),
                maxW: $("#p-kv__drag-line").width() - $("#p-kv__drag-end").width()
            };
    
            this.manage = manage;
            this.webgl = webgl;
    
            this.init();
        }
    
        _createClass(dragManager, [{
            key: 'init',
            value: function init() {
    
                var _this = this;
    
                /*--------------------------------------------
                  event
                 ----------------------------------------------*/
    
                _this.drag.set = _this.drag.element.css('left');
    
                var _start = "";
                var _move = "";
                var _end = "";
    
                if ($('html.pc')[0]) {
                    _start = "mousedown";
                    _move = "mousemove";
                    _end = "mouseup";
                } else {
                    _start = "touchstart";
                    _move = "touchmove";
                    _end = "touchend";
                }
    
                _this.drag.element.bind(_start, function (move) {
    
                    move.preventDefault();
                    _this.drag.flag = true;
                    // Record click position
                    if ($('html.pc')[0]) {
                        _this.drag.position = move.clientX;
                    } else {
                        _this.drag.position = move.changedTouches[0].pageX;
                    }
                    TweenMax.set(_this.drag.element, {
                        className: "-=is-anime"
                    });
                });
                $(document).bind(_end, function () {
                    _this.set();
                });
                $(document).bind(_move, function (move) {
                    if ($('html.mobile')[0]) return;
                    if (_this.drag.flag) {
                        var _nowmove = '';
                        if ($('html.pc')[0]) {
                            _nowmove = move.clientX;
                        } else {
                            _nowmove = move.changedTouches[0].pageX;
                        }
                        if (_this.drag.position !== _nowmove) {
                            // Do stuff here
                            _this.drag.move = _nowmove - _this.drag.position + parseInt(_this.drag.set);
                            if (_this.drag.move >= _this.drag.maxW) {
                                TweenMax.set(_this.drag.element, {
                                    className: "+=is-max"
                                });
                                _this.move();
                            }
                            if (_this.drag.move <= 0 || _this.drag.move >= _this.drag.maxW) return;
                            TweenMax.set(_this.drag.element, { 'left': _this.drag.move });
                            TweenMax.set(_this.drag.line, {
                                'width': _this.drag.lineW - _this.drag.move,
                                'left': _this.drag.lineP + _this.drag.move
                            });
                        }
                    }
                });
                _this.drag.element.on('touchstart', function () {
                    if ($('html.mobile')[0] || $('html.tablet')[0]) {
                        _this.move();
                    }
                });
            }
        }, {
            key: 'set',
            value: function set() {
    
                var _this = this;
    
                if (_this.drag.element.hasClass('is-max')) return;
    
                _this.drag.flag = false;
                _this.drag.move = _this.drag.set;
                TweenMax.to(_this.drag.element, .2, { 'left': _this.drag.move });
                TweenMax.to(_this.drag.line, .2, { 'width': _this.drag.lineW, 'left': _this.drag.lineP });
                TweenMax.set(_this.drag.element, {
                    className: "+=is-anime"
                });
            }
        }, {
            key: 'move',
            value: function move() {
    
                var _this = this;
                var _canvas = $('body>canvas');
    
                if (this.webgl._isTransfrom) return;
    
                this.manage.direction = 'drag';
                this.manage.update('drag');
    
                TweenMax.set(_this.drag.element, {
                    delay: 2,
                    className: "-=is-max",
                    onComplete: function onComplete() {
                        _this.set();
                    }
                });
            }
        }]);
    
        return dragManager;
    }();
    
    exports.default = dragManager;
    
    },{"../../param":23,"../effect":2}],19:[function(require,module,exports){
    "use strict";
    
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    
    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
    
    var _param = require("../../param");
    
    var _param2 = _interopRequireDefault(_param);
    
    var _animeManager = require("./animeManager");
    
    var _animeManager2 = _interopRequireDefault(_animeManager);
    
    var _dragManager = require("./dragManager");
    
    var _dragManager2 = _interopRequireDefault(_dragManager);
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    var param = new _param2.default();
    var anime = void 0;
    var drag = void 0;
    
    var webglManager = function () {
        function webglManager() {
            _classCallCheck(this, webglManager);
    
            //status
            this.assets = [];
            this.direction = '';
            this.current = 0;
    
            // element
            this.kvPager = $('#p-kv__pager');
            this.pagerPrev = $('#p-kv__pager-prev');
            this.pagerNext = $('#p-kv__pager-next');
    
            this.firstMvFlg = true;
            this.scrFlg = false;
            this.animeFlg = false;
    
            this.webgl;
        }
    
        _createClass(webglManager, [{
            key: "init",
            value: function init(type, webglloaded) {
    
                // element
                this.kvBg = $('#p-kv__bg');
                this.kvPager = $('#p-kv__pager');
                this.pagerPrev = $('#p-kv__pager-prev');
                this.pagerNext = $('#p-kv__pager-next');
    
                this.firstMvFlg = true;
                this.scrFlg = false;
                this.animeFlg = false;
    
                var _this = this;
    
                if (webglloaded) {
                    $('body>canvas').remove();
                }
    
                this.webgl = new spGl({
                    assets: param.webglAssets
                });
    
                this.webgl.on('assetsLoadDone', function () {
                    console.log('assets load done');
                });
                this.webgl.on('sceneTransformDone', function () {
                    console.log('scrne transform done');
                });
                this.webgl.start();
                this.webgl.startLoad();
    
                TweenMax.set($('#l-scroll'), {
                    className: "+=is-hide"
                });
                document.body.appendChild(this.webgl.canvas);
                TweenMax.to([_this.kvBg, $('body>canvas')], 1.16, {
                    opacity: 1,
                    ease: Power2.easeIn,
                    onComplete: function onComplete() {
                        $('body#top').addClass('is-load');
                    }
                });
    
                $('#' + this.webgl._state).addClass('is-current');
    
                /*--------------------------------------------
                  event
                 ----------------------------------------------*/
    
                //pager
                this.pagerPrev.on('click', function () {
                    if (_this.webgl._isTransfrom || _this.webgl._state === 'ch1') return;
                    _this.direction = 'prev';
                    _this.update('prev');
                });
                this.pagerNext.on('click', function () {
                    if (_this.webgl._isTransfrom || _this.webgl._state === 'intro' || _this.webgl._state === 'ch3') return;
                    _this.direction = 'next';
                    _this.update('next');
                });
    
                anime = new _animeManager2.default(this.webgl);
                drag = new _dragManager2.default(this, this.webgl);
            }
        }, {
            key: "mouse",
            value: function mouse(_x, _y) {
    
                this.webgl.mouseMoveHandler({
                    x: _x,
                    y: _y
                });
            }
        }, {
            key: "wheel",
            value: function wheel(type, _inc) {
    
                var _this = this;
    
                // this.webgl._state 現在のステータス ["intro", "ch1", "ch2", "ch3"]
                // this.webgl._isTransfrom 動かし中かどうか
    
                if (this.webgl._isTransfrom || _this.animeFlg) return; //動作中は return
    
                switch (type) {
                    case "prev":
    
                        _this.direction = 'prev';
    
                        if (_inc <= 0 && _this.current === 0 && !_this.firstMvFlg || _inc <= 0 && _this.current === 4 && !_this.firstMvFlg) {
                            //コンテンツからKVへの移動
    
                            _this.firstMvFlg = true;
                            _this.animeFlg = true;
    
                            $('html,body').animate({ scrollTop: 0 }, '1');
    
                            anime.display('show', 'top', _this, this.webgl);
                        } else {
                            //KV内センテンス変更
    
                            if (!_this.firstMvFlg || _this.current === 0) return;
    
                            _this.update('prev');
                        }
                        break;
                    case "next":
                        if (_this.current < 5) {
    
                            _this.direction = 'next';
    
                            if (_this.current === 0 && _this.firstMvFlg || _this.current === 4 && _this.firstMvFlg) {
                                //KVからコンテンツへの移動
    
                                _this.firstMvFlg = false;
                                _this.animeFlg = true;
    
                                anime.display('out', 'top', _this, this.webgl);
                            } else {
                                //KV内センテンス変更
    
                                if (!_this.firstMvFlg) return;
    
                                _this.update('next');
                            }
                        }
                        break;
                }
            }
        }, {
            key: "update",
            value: function update(type) {
    
                var _this = this;
    
                //content
                switch (type) {
                    case "prev":
                    case "page":
                        this.webgl.moveToPrevScene();
                        anime.move(_this, type);
                        _this.current--;
                        break;
                    case "next":
                        this.webgl.moveToNextScene();
                        anime.move(_this, type);
                        _this.current++;
                        break;
                    case "drag":
                        this.webgl.moveToNextScene();
                        anime.move(_this, type);
                        _this.current = 1;
                        break;
                }
    
                // pager
                if (_this.current > 0 && _this.current < 4) {
                    TweenMax.set(_this.kvPager, {
                        delay: 0.6,
                        className: "+=is-show"
                    });
                    var _currentText = $('#p-kv__pager-text .current');
                    _currentText.text('0' + _this.current);
                } else {
                    TweenMax.set(_this.kvPager, {
                        className: "-=is-show"
                    });
                }
            }
        }, {
            key: "pjax",
            value: function pjax(type) {
    
                var _this = this;
                var _canvas = $('body>canvas');
    
                switch (type) {
                    case "out":
                        TweenMax.to(_canvas, 1.6, {
                            delay: 0.5,
                            opacity: 0,
                            ease: Power2.easeOut,
                            onComplete: function onComplete() {
                                _this.webgl.pause();
                                _this.reset();
                                $('body#top').removeClass('is-load');
                            }
                        });
                        break;
                    case "show":
    
                        break;
                }
            }
        }, {
            key: "reset",
            value: function reset() {
    
                var _this = this;
    
                _this.webgl.reset();
    
                // if(_this.webgl._state === 'intro') return false;
                //
                // if(_this.webgl._state === 'ch1'){
                //     _this.webgl.moveToPrevScene();
                // }else{
                //     _this.webgl.moveToNextScene();
                // }
                //
                // setTimeout(function() {
                //     _this.reset();
                // },1e3);
            }
        }, {
            key: "resize",
            value: function resize(_w, _h) {
                this.webgl.resize(_w, _h);
            }
        }]);
    
        return webglManager;
    }();
    
    exports.default = webglManager;
    
    },{"../../param":23,"./animeManager":17,"./dragManager":18}],20:[function(require,module,exports){
    'use strict';
    
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    
    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
    
    var _util = require('../libs/util');
    
    var _util2 = _interopRequireDefault(_util);
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    var videoManager = function () {
        function videoManager() {
            _classCallCheck(this, videoManager);
    
            var util = new _util2.default();
    
            this.w = window.innerWidth;
            this.h = window.innerHeight;
    
            this.video;
            this.videoTexture;
            this.videoMesh;
            this.scene;
            this.camera;
            this.renderer;
    
            this.count = 0;
    
            this.ended = false;
    
            this.status = '';
            this._root = '';
            this._path = '';
            this._movie = '';
    
            this.videosrc = 'https://styleport.co.jp/assets/img/service/b-roov-video.mp4';
            this.videosrcMov = 'https://styleport.co.jp/assets/img/service/b-roov-video.mp4';
        }
    
        _createClass(videoManager, [{
            key: 'init',
            value: function init(param) {
                //ios用
                if (Useragnt.ios) {
                    this.makeVideo(param);
                } else {
    
                    $("#p-product__movie").append('<video id="p-product__movie__video" muted loop><source src="" type="video/mp4"><source src="" type="video/mov"></video>');
                    $("#p-product__movie__video source").eq(0).attr("src", this.videosrc);
                    $("#p-product__movie__video source").eq(1).attr("src", this.videosrcMov);
    
                    this.video = document.getElementById("p-product__movie__video");
    
                    var _this = this;
                    setTimeout(function () {
                        _this.video.play();
                    }, 1e3);
                    this.video.addEventListener('timeupdate', function () {
                        // if(_this.video.currentTime >= 3.4){
                        //     if(_this.ended) return false;
                        //     _this.ended = true;
                        // }
                    });
                }
            }
        }, {
            key: 'makeVideo',
            value: function makeVideo(param) {
    
                var _this = this;
                var _param = param;
    
                // scene ステージ
                this.scene = new THREE.Scene();
    
                // camera
                this.camera = new THREE.PerspectiveCamera(50, this.w / this.h, 1, 10000);
                this.camera.updateProjectionMatrix();
                this.camera.position.z = 1000;
    
                this.renderer = new THREE.WebGLRenderer({
                    // alpha              : true,
                    antialias: false,
                    stencil: false,
                    depth: false
                });
                this.renderer.setSize(this.w, this.h);
                this.renderer.setClearColor(0xffffff, 0);
                this.renderer.setPixelRatio(this.pixelRato);
                this.renderer.autoClear = false;
                document.getElementById('p-product__movie').appendChild(this.renderer.domElement);
    
                //このvideo要素から毎フレームキャプチャ
                this.video = document.createElement('video');
                this.video.preload = 'none';
                this.video.autoplay = false;
                this.video.loop = false;
    
                //src指定
                this.video.src = this.videosrc;
    
                //video要素からテクスチャ生成するやつ
                this.videoTexture = new THREE.VideoTexture(this.video);
                this.videoTexture.format = THREE.RGBFormat;
    
                //テクスチャサイズ可変する場合、ここ設定しておかないと警告でる
                this.videoTexture.minFilter = THREE.LinearFilter;
                this.videoTexture.magFilter = THREE.LinearFilter;
    
                this.videoTexture.needsUpdate = true;
    
                //動画の読み込み開始
                this.video.load();
    
                //テクスチャ表示するためのMesh
                var _geo = new THREE.PlaneBufferGeometry(1, 1);
                var _mat = new THREE.MeshBasicMaterial({
                    map: _this.videoTexture
                    // overdraw: true,
                    // side:THREE.DoubleSide
                });
                this.videoMesh = new THREE.Mesh(_geo, _mat);
    
                //各自用意したTHREE.Sceneに追加
                this.scene.add(this.videoMesh);
    
                // 動画のサイズがわかったらMeshのサイズを合わせる
    
                this.video.addEventListener('loadeddata', function (e) {
                    _param.videoLoaded = true;
                    _this.resize();
                    _this.video.play();
                }, false);
            }
        }, {
            key: 'render',
            value: function render(fpsRate) {
    
                var _this = this;
                this.count++;
    
                if (_this.count % 2 === 0) return;
    
                if (Useragnt.ios) {
                    _this.video.currentTime += 0.05 * fpsRate;
                    if (_this.video.currentTime >= _this.video.duration) {
                        _this.video.currentTime = 0;
                    }
                    _this.videoTexture.needsUpdate = true;
                } else {
                    // this.video.currentTime += 0.02*this.timeRatio;
                    // if(this.video.currentTime>=this.video.duration) this.video.currentTime = 0;
                }
    
                _this.renderer.render(_this.scene, _this.camera);
            }
        }, {
            key: 'resize',
            value: function resize() {
    
                //画面サイズ
                this.w = window.innerWidth;
                //this.h = window.innerHeight;
                this.h = $('#p-product__movie').innerHeight();
    
                //画面にFIXするようにMeshのサイズ(scale)を変更
                var movW = this.w;
                var movH = this.video.videoHeight * (movW / this.video.videoWidth);
                if (movH < this.h) {
                    movH = this.h;
                }
                movW = this.video.videoWidth * (movH / this.video.videoHeight);
                this.videoMesh.scale.set(movW, movH, 1);
    
                //ピクセル等倍にする
                this.camera.aspect = this.w / this.h;
                this.camera.updateProjectionMatrix();
                this.camera.position.z = this.h / Math.tan(this.camera.fov * Math.PI / 360) / 2;
    
                //this.renderer.setPixelRatio(window.devicePixelRatio || 1);
                this.renderer.setSize(this.w, this.h, true);
                //this.renderer.clear();
            }
        }]);
    
        return videoManager;
    }();
    
    exports.default = videoManager;
    
    },{"../libs/util":9}],21:[function(require,module,exports){
    'use strict';
    
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    
    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
    
    var _param = require('../param');
    
    var _param2 = _interopRequireDefault(_param);
    
    var _effect = require('../module/effect');
    
    var _effect2 = _interopRequireDefault(_effect);
    
    var _dPararax = require('../module/mouse/3dPararax');
    
    var _dPararax2 = _interopRequireDefault(_dPararax);
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    var param = void 0;
    var effect = void 0;
    var para3d = new _dPararax2.default();
    
    var styleManager = function () {
        function styleManager() {
            _classCallCheck(this, styleManager);
    
            param = new _param2.default();
            effect = new _effect2.default();
    
            //set
            this.social = $(".c-social-link");
            this.photoMosaic = $('.c-figure__photo-object.mosaic');
            this.body = $('#l-lowlayer-body');
    
            this.root = $('#l-root');
            this.scrollbody = $('#l-scroll-body');
            this.content = $('#l-scroll');
            this.contentobject = $('#p-session01 .l-lowlayer-section-block__inner').children();
    
            this.status = {
                count: 0,
                max: 3,
                dir: ''
            };
    
            this.firstMvFlg = true;
            this.scrFlg = false;
            this.animeFlg = false;
    
            this.break = 'pc';
            this.social.css({ 'opacity': 0 });
            TweenMax.to(this.social, 1, {
                alpha: 1,
                ease: Power2.easeIn
            });
        }
    
        _createClass(styleManager, [{
            key: 'init',
            value: function init() {
                this.scrFlg = false;
                TweenMax.set("html", {
                    className: "+=is-no-scroll"
                });
    
                if (this.break === 'sp') {
                    this.scrFlg = true;
                    TweenMax.set("html", {
                        className: "-=is-no-scroll"
                    });
                }
    
                var _this = this;
                this.update();
            }
        }, {
            key: 'wheel',
            value: function wheel(type) {}
        }, {
            key: 'update',
            value: function update() {
                this.animeFlg = true;
                var _this = this;
    
                _this.anime1();
            }
        }, {
            key: 'anime1',
            value: function anime1() {
                var _this = this;
                _this.animeFlg = false;
            }
        }, {
            key: 'display',
            value: function display(type) {}
        }, {
            key: 'effect',
            value: function effect(target, type) {}
        }, {
            key: 'render',
            value: function render(mouse) {
                para3d.moveMouse(mouse.x, mouse.y, 'out');
                //TweenMax.set(this.boardList.find(this.photo),{ x:para3d.moveMouse(mouse.x,mouse.y,'out')[2]*100/5 ,y:para3d.moveMouse(mouse.x,mouse.y,'out')[6]*100/5});
                //TweenMax.set(this.information,{ x:-(para3d.moveMouse(mouse.x,mouse.y,'out')[2]*100/5) ,y:-(para3d.moveMouse(mouse.x,mouse.y,'out')[6]*100/5)});
            }
        }, {
            key: 'resize',
            value: function resize(_w, _h, _display) {
    
                var _this = this;
    
                switch (_display) {
                    case 'pc':
    
                        if (_this.break === 'pc') return;
                        _this.break = 'pc';
    
                        $('html,body').animate({ scrollTop: 0 }, '1');
    
                        _this.scrFlg = false;
                        TweenMax.set("html", {
                            className: "+=is-no-scroll"
                        });
    
                        _this.content.removeAttr('style');
                        _this.scroll.removeAttr('style');
                        _this.scrollbody.removeAttr('style');
                        _this.status.count = 1;
    
                        break;
                    case 'sp':
    
                        if (_this.break === 'sp') return;
                        _this.break = 'sp';
    
                        $('html,body').animate({ scrollTop: 0 }, '1');
    
                        _this.scrFlg = true;
                        TweenMax.set("html", {
                            className: "-=is-no-scroll"
                        });
    
                        if (_this.status.count >= 1) {
                            _this.body.removeAttr('style');
                            $('#p-session01').children().children().removeAttr('style');
                            _this.scrollbody.removeAttr('style');
                        }
                        TweenMax.set(_this.content, { position: 'relative' });
                        _this.status.count = 1;
    
                        break;
                }
            }
        }]);
    
        return styleManager;
    }();
    
    exports.default = styleManager;
    
    },{"../module/effect":2,"../module/mouse/3dPararax":11,"../param":23}],22:[function(require,module,exports){
    'use strict';
    
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    
    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
    
    var _param = require('../param');
    
    var _param2 = _interopRequireDefault(_param);
    
    var _effect = require('../module/effect');
    
    var _effect2 = _interopRequireDefault(_effect);
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    var param = void 0;
    var effect = void 0;
    
    var topManager = function () {
        function topManager() {
            _classCallCheck(this, topManager);
    
            param = new _param2.default();
            effect = new _effect2.default();
    
            this.break = 'pc';
    
            // kv
            this.kvdragText = $("#p-kv__drag,#p-kv__description");
            this.scroll = $("#c-scrolldown");
            this.social = $(".c-social-link");
    
            this.resizeObject = $('#p-kv,#p-kv__bg,body,#l-root');
    
            //vision
            this.contentTitle = $("#p-top-our-vision").find('.p-top-section__title__text');
            this.contentText = $("#p-top-our-vision").find('.p-top-section__sub-title,.p-top-section__text');
    
            TweenMax.set(this.contentText, {
                'opacity': 0
            });
            effect.content(this.contentText, "set");
            effect.topAnimation("set", 'landing');
            effect.show([this.kvdragText, this.scroll, this.social], "set");
    
            var _photo = $('.c-figure__photo-object__photo');
            TweenMax.set(_photo, {
                x: 1,
                onComplete: function onComplete() {
                    TweenMax.set(_photo, {
                        x: 0
                    });
                }
            });
        }
    
        _createClass(topManager, [{
            key: 'init',
            value: function init() {
    
                var _this = this;
    
                //set
                var _splittext = new SplitText(this.contentTitle, { type: "words,chars" }),
                    chars = _splittext.chars;
    
                effect.topAnimation("show", 'landing');
            }
        }, {
            key: 'render',
            value: function render(mouse) {
    
                //this.renderer.render(this.stage);
    
            }
        }, {
            key: 'resize',
            value: function resize(_w, _h, _display) {
    
                var _this = this;
    
                switch (_display) {
                    case 'pc':
    
                        if (_this.break === 'pc') return;
                        _this.break = 'pc';
    
                        _this.scroll.removeAttr('style');
    
                        break;
                    case 'sp':
    
                        if (_this.break === 'sp') return;
                        _this.break = 'sp';
    
                        break;
                }
            }
        }, {
            key: 'modal',
            value: function modal(type) {}
        }]);
    
        return topManager;
    }();
    
    exports.default = topManager;
    
    },{"../module/effect":2,"../param":23}],23:[function(require,module,exports){
    "use strict";
    
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    var Param = function Param() {
        _classCallCheck(this, Param);
    
        this.breakpoint = 750;
        this.displayType = window.innerWidth > this.breakpoint ? "pc" : "sp";
        if (Useragnt.mobile) {
            this.userAgent = "sp";
        } else if (Useragnt.tablet) {
            this.userAgent = "tablet";
        } else {
            this.userAgent = "pc";
        }
        this.type = 'full';
        this.videoLoaded = false; // [ 動画読み込んだかどうかの判定 ]
    
        this.webglLoaded = false; // [ webgl読み込んだかどうかの判定 ]
        this.webglAssets = {
            earthImgUrl: './assets/img/webgl/earth.png',
            imgURL: './assets/img/webgl/marcellus.png',
            jsonURLs: {
                modelA: './assets/img/webgl/A_madori.json',
                modelWireA: './assets/img/webgl/A_madori_wireframe.json',
                modelB: './assets/img/webgl/B_town_.json',
                modelWireB: './assets/img/webgl/B_town_wireframe.json',
                modelEarthWire: './assets/img/webgl/earth_wireframe.json',
                font: './assets/img/webgl/marcellus.json'
            }
        };
    
        this.youtube = {
            domID: "p-modal-content-screen",
            id: "4azh4ihTZsY"
        };
    };
    
    exports.default = Param;
    
    },{}]},{},[1])
    
    //# sourceMappingURL=app.js.map
    