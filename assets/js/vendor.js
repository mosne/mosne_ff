"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (window, factory) {
  var lazySizes = factory(window, window.document, Date);
  window.lazySizes = lazySizes;

  if ((typeof module === "undefined" ? "undefined" : _typeof(module)) == 'object' && module.exports) {
    module.exports = lazySizes;
  }
})(typeof window != 'undefined' ? window : {}, function l(window, document, Date) {
  // Pass in the windoe Date function also for SSR because the Date class can be lost
  'use strict';
  /*jshint eqnull:true */

  var lazysizes, lazySizesCfg;

  (function () {
    var prop;
    var lazySizesDefaults = {
      lazyClass: 'lazyload',
      loadedClass: 'lazyloaded',
      loadingClass: 'lazyloading',
      preloadClass: 'lazypreload',
      errorClass: 'lazyerror',
      //strictClass: 'lazystrict',
      autosizesClass: 'lazyautosizes',
      srcAttr: 'data-src',
      srcsetAttr: 'data-srcset',
      sizesAttr: 'data-sizes',
      //preloadAfterLoad: false,
      minSize: 40,
      customMedia: {},
      init: true,
      expFactor: 1.5,
      hFac: 0.8,
      loadMode: 2,
      loadHidden: true,
      ricTimeout: 0,
      throttleDelay: 125
    };
    lazySizesCfg = window.lazySizesConfig || window.lazysizesConfig || {};

    for (prop in lazySizesDefaults) {
      if (!(prop in lazySizesCfg)) {
        lazySizesCfg[prop] = lazySizesDefaults[prop];
      }
    }
  })();

  if (!document || !document.getElementsByClassName) {
    return {
      init: function init() {},
      cfg: lazySizesCfg,
      noSupport: true
    };
  }

  var docElem = document.documentElement;
  var supportPicture = window.HTMLPictureElement;
  var _addEventListener = 'addEventListener';
  var _getAttribute = 'getAttribute';
  /**
   * Update to bind to window because 'this' becomes null during SSR
   * builds.
   */

  var addEventListener = window[_addEventListener].bind(window);

  var setTimeout = window.setTimeout;
  var requestAnimationFrame = window.requestAnimationFrame || setTimeout;
  var requestIdleCallback = window.requestIdleCallback;
  var regPicture = /^picture$/i;
  var loadEvents = ['load', 'error', 'lazyincluded', '_lazyloaded'];
  var regClassCache = {};
  var forEach = Array.prototype.forEach;

  var hasClass = function hasClass(ele, cls) {
    if (!regClassCache[cls]) {
      regClassCache[cls] = new RegExp('(\\s|^)' + cls + '(\\s|$)');
    }

    return regClassCache[cls].test(ele[_getAttribute]('class') || '') && regClassCache[cls];
  };

  var addClass = function addClass(ele, cls) {
    if (!hasClass(ele, cls)) {
      ele.setAttribute('class', (ele[_getAttribute]('class') || '').trim() + ' ' + cls);
    }
  };

  var removeClass = function removeClass(ele, cls) {
    var reg;

    if (reg = hasClass(ele, cls)) {
      ele.setAttribute('class', (ele[_getAttribute]('class') || '').replace(reg, ' '));
    }
  };

  var addRemoveLoadEvents = function addRemoveLoadEvents(dom, fn, add) {
    var action = add ? _addEventListener : 'removeEventListener';

    if (add) {
      addRemoveLoadEvents(dom, fn);
    }

    loadEvents.forEach(function (evt) {
      dom[action](evt, fn);
    });
  };

  var triggerEvent = function triggerEvent(elem, name, detail, noBubbles, noCancelable) {
    var event = document.createEvent('Event');

    if (!detail) {
      detail = {};
    }

    detail.instance = lazysizes;
    event.initEvent(name, !noBubbles, !noCancelable);
    event.detail = detail;
    elem.dispatchEvent(event);
    return event;
  };

  var updatePolyfill = function updatePolyfill(el, full) {
    var polyfill;

    if (!supportPicture && (polyfill = window.picturefill || lazySizesCfg.pf)) {
      if (full && full.src && !el[_getAttribute]('srcset')) {
        el.setAttribute('srcset', full.src);
      }

      polyfill({
        reevaluate: true,
        elements: [el]
      });
    } else if (full && full.src) {
      el.src = full.src;
    }
  };

  var getCSS = function getCSS(elem, style) {
    return (getComputedStyle(elem, null) || {})[style];
  };

  var getWidth = function getWidth(elem, parent, width) {
    width = width || elem.offsetWidth;

    while (width < lazySizesCfg.minSize && parent && !elem._lazysizesWidth) {
      width = parent.offsetWidth;
      parent = parent.parentNode;
    }

    return width;
  };

  var rAF = function () {
    var running, waiting;
    var firstFns = [];
    var secondFns = [];
    var fns = firstFns;

    var run = function run() {
      var runFns = fns;
      fns = firstFns.length ? secondFns : firstFns;
      running = true;
      waiting = false;

      while (runFns.length) {
        runFns.shift()();
      }

      running = false;
    };

    var rafBatch = function rafBatch(fn, queue) {
      if (running && !queue) {
        fn.apply(this, arguments);
      } else {
        fns.push(fn);

        if (!waiting) {
          waiting = true;
          (document.hidden ? setTimeout : requestAnimationFrame)(run);
        }
      }
    };

    rafBatch._lsFlush = run;
    return rafBatch;
  }();

  var rAFIt = function rAFIt(fn, simple) {
    return simple ? function () {
      rAF(fn);
    } : function () {
      var that = this;
      var args = arguments;
      rAF(function () {
        fn.apply(that, args);
      });
    };
  };

  var throttle = function throttle(fn) {
    var running;
    var lastTime = 0;
    var gDelay = lazySizesCfg.throttleDelay;
    var rICTimeout = lazySizesCfg.ricTimeout;

    var run = function run() {
      running = false;
      lastTime = Date.now();
      fn();
    };

    var idleCallback = requestIdleCallback && rICTimeout > 49 ? function () {
      requestIdleCallback(run, {
        timeout: rICTimeout
      });

      if (rICTimeout !== lazySizesCfg.ricTimeout) {
        rICTimeout = lazySizesCfg.ricTimeout;
      }
    } : rAFIt(function () {
      setTimeout(run);
    }, true);
    return function (isPriority) {
      var delay;

      if (isPriority = isPriority === true) {
        rICTimeout = 33;
      }

      if (running) {
        return;
      }

      running = true;
      delay = gDelay - (Date.now() - lastTime);

      if (delay < 0) {
        delay = 0;
      }

      if (isPriority || delay < 9) {
        idleCallback();
      } else {
        setTimeout(idleCallback, delay);
      }
    };
  }; //based on http://modernjavascript.blogspot.de/2013/08/building-better-debounce.html


  var debounce = function debounce(func) {
    var timeout, timestamp;
    var wait = 99;

    var run = function run() {
      timeout = null;
      func();
    };

    var later = function later() {
      var last = Date.now() - timestamp;

      if (last < wait) {
        setTimeout(later, wait - last);
      } else {
        (requestIdleCallback || run)(run);
      }
    };

    return function () {
      timestamp = Date.now();

      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
    };
  };

  var loader = function () {
    var preloadElems, isCompleted, resetPreloadingTimer, loadMode, started;
    var eLvW, elvH, eLtop, eLleft, eLright, eLbottom, isBodyHidden;
    var regImg = /^img$/i;
    var regIframe = /^iframe$/i;
    var supportScroll = 'onscroll' in window && !/(gle|ing)bot/.test(navigator.userAgent);
    var shrinkExpand = 0;
    var currentExpand = 0;
    var isLoading = 0;
    var lowRuns = -1;

    var resetPreloading = function resetPreloading(e) {
      isLoading--;

      if (!e || isLoading < 0 || !e.target) {
        isLoading = 0;
      }
    };

    var isVisible = function isVisible(elem) {
      if (isBodyHidden == null) {
        isBodyHidden = getCSS(document.body, 'visibility') == 'hidden';
      }

      return isBodyHidden || !(getCSS(elem.parentNode, 'visibility') == 'hidden' && getCSS(elem, 'visibility') == 'hidden');
    };

    var isNestedVisible = function isNestedVisible(elem, elemExpand) {
      var outerRect;
      var parent = elem;
      var visible = isVisible(elem);
      eLtop -= elemExpand;
      eLbottom += elemExpand;
      eLleft -= elemExpand;
      eLright += elemExpand;

      while (visible && (parent = parent.offsetParent) && parent != document.body && parent != docElem) {
        visible = (getCSS(parent, 'opacity') || 1) > 0;

        if (visible && getCSS(parent, 'overflow') != 'visible') {
          outerRect = parent.getBoundingClientRect();
          visible = eLright > outerRect.left && eLleft < outerRect.right && eLbottom > outerRect.top - 1 && eLtop < outerRect.bottom + 1;
        }
      }

      return visible;
    };

    var checkElements = function checkElements() {
      var eLlen, i, rect, autoLoadElem, loadedSomething, elemExpand, elemNegativeExpand, elemExpandVal, beforeExpandVal, defaultExpand, preloadExpand, hFac;
      var lazyloadElems = lazysizes.elements;

      if ((loadMode = lazySizesCfg.loadMode) && isLoading < 8 && (eLlen = lazyloadElems.length)) {
        i = 0;
        lowRuns++;

        for (; i < eLlen; i++) {
          if (!lazyloadElems[i] || lazyloadElems[i]._lazyRace) {
            continue;
          }

          if (!supportScroll || lazysizes.prematureUnveil && lazysizes.prematureUnveil(lazyloadElems[i])) {
            unveilElement(lazyloadElems[i]);
            continue;
          }

          if (!(elemExpandVal = lazyloadElems[i][_getAttribute]('data-expand')) || !(elemExpand = elemExpandVal * 1)) {
            elemExpand = currentExpand;
          }

          if (!defaultExpand) {
            defaultExpand = !lazySizesCfg.expand || lazySizesCfg.expand < 1 ? docElem.clientHeight > 500 && docElem.clientWidth > 500 ? 500 : 370 : lazySizesCfg.expand;
            lazysizes._defEx = defaultExpand;
            preloadExpand = defaultExpand * lazySizesCfg.expFactor;
            hFac = lazySizesCfg.hFac;
            isBodyHidden = null;

            if (currentExpand < preloadExpand && isLoading < 1 && lowRuns > 2 && loadMode > 2 && !document.hidden) {
              currentExpand = preloadExpand;
              lowRuns = 0;
            } else if (loadMode > 1 && lowRuns > 1 && isLoading < 6) {
              currentExpand = defaultExpand;
            } else {
              currentExpand = shrinkExpand;
            }
          }

          if (beforeExpandVal !== elemExpand) {
            eLvW = innerWidth + elemExpand * hFac;
            elvH = innerHeight + elemExpand;
            elemNegativeExpand = elemExpand * -1;
            beforeExpandVal = elemExpand;
          }

          rect = lazyloadElems[i].getBoundingClientRect();

          if ((eLbottom = rect.bottom) >= elemNegativeExpand && (eLtop = rect.top) <= elvH && (eLright = rect.right) >= elemNegativeExpand * hFac && (eLleft = rect.left) <= eLvW && (eLbottom || eLright || eLleft || eLtop) && (lazySizesCfg.loadHidden || isVisible(lazyloadElems[i])) && (isCompleted && isLoading < 3 && !elemExpandVal && (loadMode < 3 || lowRuns < 4) || isNestedVisible(lazyloadElems[i], elemExpand))) {
            unveilElement(lazyloadElems[i]);
            loadedSomething = true;

            if (isLoading > 9) {
              break;
            }
          } else if (!loadedSomething && isCompleted && !autoLoadElem && isLoading < 4 && lowRuns < 4 && loadMode > 2 && (preloadElems[0] || lazySizesCfg.preloadAfterLoad) && (preloadElems[0] || !elemExpandVal && (eLbottom || eLright || eLleft || eLtop || lazyloadElems[i][_getAttribute](lazySizesCfg.sizesAttr) != 'auto'))) {
            autoLoadElem = preloadElems[0] || lazyloadElems[i];
          }
        }

        if (autoLoadElem && !loadedSomething) {
          unveilElement(autoLoadElem);
        }
      }
    };

    var throttledCheckElements = throttle(checkElements);

    var switchLoadingClass = function switchLoadingClass(e) {
      var elem = e.target;

      if (elem._lazyCache) {
        delete elem._lazyCache;
        return;
      }

      resetPreloading(e);
      addClass(elem, lazySizesCfg.loadedClass);
      removeClass(elem, lazySizesCfg.loadingClass);
      addRemoveLoadEvents(elem, rafSwitchLoadingClass);
      triggerEvent(elem, 'lazyloaded');
    };

    var rafedSwitchLoadingClass = rAFIt(switchLoadingClass);

    var rafSwitchLoadingClass = function rafSwitchLoadingClass(e) {
      rafedSwitchLoadingClass({
        target: e.target
      });
    };

    var changeIframeSrc = function changeIframeSrc(elem, src) {
      try {
        elem.contentWindow.location.replace(src);
      } catch (e) {
        elem.src = src;
      }
    };

    var handleSources = function handleSources(source) {
      var customMedia;

      var sourceSrcset = source[_getAttribute](lazySizesCfg.srcsetAttr);

      if (customMedia = lazySizesCfg.customMedia[source[_getAttribute]('data-media') || source[_getAttribute]('media')]) {
        source.setAttribute('media', customMedia);
      }

      if (sourceSrcset) {
        source.setAttribute('srcset', sourceSrcset);
      }
    };

    var lazyUnveil = rAFIt(function (elem, detail, isAuto, sizes, isImg) {
      var src, srcset, parent, isPicture, event, firesLoad;

      if (!(event = triggerEvent(elem, 'lazybeforeunveil', detail)).defaultPrevented) {
        if (sizes) {
          if (isAuto) {
            addClass(elem, lazySizesCfg.autosizesClass);
          } else {
            elem.setAttribute('sizes', sizes);
          }
        }

        srcset = elem[_getAttribute](lazySizesCfg.srcsetAttr);
        src = elem[_getAttribute](lazySizesCfg.srcAttr);

        if (isImg) {
          parent = elem.parentNode;
          isPicture = parent && regPicture.test(parent.nodeName || '');
        }

        firesLoad = detail.firesLoad || 'src' in elem && (srcset || src || isPicture);
        event = {
          target: elem
        };
        addClass(elem, lazySizesCfg.loadingClass);

        if (firesLoad) {
          clearTimeout(resetPreloadingTimer);
          resetPreloadingTimer = setTimeout(resetPreloading, 2500);
          addRemoveLoadEvents(elem, rafSwitchLoadingClass, true);
        }

        if (isPicture) {
          forEach.call(parent.getElementsByTagName('source'), handleSources);
        }

        if (srcset) {
          elem.setAttribute('srcset', srcset);
        } else if (src && !isPicture) {
          if (regIframe.test(elem.nodeName)) {
            changeIframeSrc(elem, src);
          } else {
            elem.src = src;
          }
        }

        if (isImg && (srcset || isPicture)) {
          updatePolyfill(elem, {
            src: src
          });
        }
      }

      if (elem._lazyRace) {
        delete elem._lazyRace;
      }

      removeClass(elem, lazySizesCfg.lazyClass);
      rAF(function () {
        // Part of this can be removed as soon as this fix is older: https://bugs.chromium.org/p/chromium/issues/detail?id=7731 (2015)
        var isLoaded = elem.complete && elem.naturalWidth > 1;

        if (!firesLoad || isLoaded) {
          if (isLoaded) {
            addClass(elem, 'ls-is-cached');
          }

          switchLoadingClass(event);
          elem._lazyCache = true;
          setTimeout(function () {
            if ('_lazyCache' in elem) {
              delete elem._lazyCache;
            }
          }, 9);
        }

        if (elem.loading == 'lazy') {
          isLoading--;
        }
      }, true);
    });

    var unveilElement = function unveilElement(elem) {
      if (elem._lazyRace) {
        return;
      }

      var detail;
      var isImg = regImg.test(elem.nodeName); //allow using sizes="auto", but don't use. it's invalid. Use data-sizes="auto" or a valid value for sizes instead (i.e.: sizes="80vw")

      var sizes = isImg && (elem[_getAttribute](lazySizesCfg.sizesAttr) || elem[_getAttribute]('sizes'));

      var isAuto = sizes == 'auto';

      if ((isAuto || !isCompleted) && isImg && (elem[_getAttribute]('src') || elem.srcset) && !elem.complete && !hasClass(elem, lazySizesCfg.errorClass) && hasClass(elem, lazySizesCfg.lazyClass)) {
        return;
      }

      detail = triggerEvent(elem, 'lazyunveilread').detail;

      if (isAuto) {
        autoSizer.updateElem(elem, true, elem.offsetWidth);
      }

      elem._lazyRace = true;
      isLoading++;
      lazyUnveil(elem, detail, isAuto, sizes, isImg);
    };

    var afterScroll = debounce(function () {
      lazySizesCfg.loadMode = 3;
      throttledCheckElements();
    });

    var altLoadmodeScrollListner = function altLoadmodeScrollListner() {
      if (lazySizesCfg.loadMode == 3) {
        lazySizesCfg.loadMode = 2;
      }

      afterScroll();
    };

    var onload = function onload() {
      if (isCompleted) {
        return;
      }

      if (Date.now() - started < 999) {
        setTimeout(onload, 999);
        return;
      }

      isCompleted = true;
      lazySizesCfg.loadMode = 3;
      throttledCheckElements();
      addEventListener('scroll', altLoadmodeScrollListner, true);
    };

    return {
      _: function _() {
        started = Date.now();
        lazysizes.elements = document.getElementsByClassName(lazySizesCfg.lazyClass);
        preloadElems = document.getElementsByClassName(lazySizesCfg.lazyClass + ' ' + lazySizesCfg.preloadClass);
        addEventListener('scroll', throttledCheckElements, true);
        addEventListener('resize', throttledCheckElements, true);
        addEventListener('pageshow', function (e) {
          if (e.persisted) {
            var loadingElements = document.querySelectorAll('.' + lazySizesCfg.loadingClass);

            if (loadingElements.length && loadingElements.forEach) {
              requestAnimationFrame(function () {
                loadingElements.forEach(function (img) {
                  if (img.complete) {
                    unveilElement(img);
                  }
                });
              });
            }
          }
        });

        if (window.MutationObserver) {
          new MutationObserver(throttledCheckElements).observe(docElem, {
            childList: true,
            subtree: true,
            attributes: true
          });
        } else {
          docElem[_addEventListener]('DOMNodeInserted', throttledCheckElements, true);

          docElem[_addEventListener]('DOMAttrModified', throttledCheckElements, true);

          setInterval(throttledCheckElements, 999);
        }

        addEventListener('hashchange', throttledCheckElements, true); //, 'fullscreenchange'

        ['focus', 'mouseover', 'click', 'load', 'transitionend', 'animationend'].forEach(function (name) {
          document[_addEventListener](name, throttledCheckElements, true);
        });

        if (/d$|^c/.test(document.readyState)) {
          onload();
        } else {
          addEventListener('load', onload);

          document[_addEventListener]('DOMContentLoaded', throttledCheckElements);

          setTimeout(onload, 20000);
        }

        if (lazysizes.elements.length) {
          checkElements();

          rAF._lsFlush();
        } else {
          throttledCheckElements();
        }
      },
      checkElems: throttledCheckElements,
      unveil: unveilElement,
      _aLSL: altLoadmodeScrollListner
    };
  }();

  var autoSizer = function () {
    var autosizesElems;
    var sizeElement = rAFIt(function (elem, parent, event, width) {
      var sources, i, len;
      elem._lazysizesWidth = width;
      width += 'px';
      elem.setAttribute('sizes', width);

      if (regPicture.test(parent.nodeName || '')) {
        sources = parent.getElementsByTagName('source');

        for (i = 0, len = sources.length; i < len; i++) {
          sources[i].setAttribute('sizes', width);
        }
      }

      if (!event.detail.dataAttr) {
        updatePolyfill(elem, event.detail);
      }
    });

    var getSizeElement = function getSizeElement(elem, dataAttr, width) {
      var event;
      var parent = elem.parentNode;

      if (parent) {
        width = getWidth(elem, parent, width);
        event = triggerEvent(elem, 'lazybeforesizes', {
          width: width,
          dataAttr: !!dataAttr
        });

        if (!event.defaultPrevented) {
          width = event.detail.width;

          if (width && width !== elem._lazysizesWidth) {
            sizeElement(elem, parent, event, width);
          }
        }
      }
    };

    var updateElementsSizes = function updateElementsSizes() {
      var i;
      var len = autosizesElems.length;

      if (len) {
        i = 0;

        for (; i < len; i++) {
          getSizeElement(autosizesElems[i]);
        }
      }
    };

    var debouncedUpdateElementsSizes = debounce(updateElementsSizes);
    return {
      _: function _() {
        autosizesElems = document.getElementsByClassName(lazySizesCfg.autosizesClass);
        addEventListener('resize', debouncedUpdateElementsSizes);
      },
      checkElems: debouncedUpdateElementsSizes,
      updateElem: getSizeElement
    };
  }();

  var init = function init() {
    if (!init.i && document.getElementsByClassName) {
      init.i = true;

      autoSizer._();

      loader._();
    }
  };

  setTimeout(function () {
    if (lazySizesCfg.init) {
      init();
    }
  });
  lazysizes = {
    cfg: lazySizesCfg,
    autoSizer: autoSizer,
    loader: loader,
    init: init,
    uP: updatePolyfill,
    aC: addClass,
    rC: removeClass,
    hC: hasClass,
    fire: triggerEvent,
    gW: getWidth,
    rAF: rAF
  };
  return lazysizes;
});

(function (window, factory) {
  var globalInstall = function globalInstall() {
    factory(window.lazySizes);
    window.removeEventListener('lazyunveilread', globalInstall, true);
  };

  factory = factory.bind(null, window, window.document);

  if ((typeof module === "undefined" ? "undefined" : _typeof(module)) == 'object' && module.exports) {
    factory(require('lazysizes'));
  } else if (window.lazySizes) {
    globalInstall();
  } else {
    window.addEventListener('lazyunveilread', globalInstall, true);
  }
})(window, function (window, document, lazySizes) {
  'use strict';

  if (!window.addEventListener) {
    return;
  }

  var lazySizesCfg = lazySizes.cfg;
  var regWhite = /\s+/g;
  var regSplitSet = /\s*\|\s+|\s+\|\s*/g;
  var regSource = /^(.+?)(?:\s+\[\s*(.+?)\s*\])(?:\s+\[\s*(.+?)\s*\])?$/;
  var regType = /^\s*\(*\s*type\s*:\s*(.+?)\s*\)*\s*$/;
  var regBgUrlEscape = /\(|\)|'/;
  var allowedBackgroundSize = {
    contain: 1,
    cover: 1
  };

  var proxyWidth = function proxyWidth(elem) {
    var width = lazySizes.gW(elem, elem.parentNode);

    if (!elem._lazysizesWidth || width > elem._lazysizesWidth) {
      elem._lazysizesWidth = width;
    }

    return elem._lazysizesWidth;
  };

  var getBgSize = function getBgSize(elem) {
    var bgSize;
    bgSize = (getComputedStyle(elem) || {
      getPropertyValue: function getPropertyValue() {}
    }).getPropertyValue('background-size');

    if (!allowedBackgroundSize[bgSize] && allowedBackgroundSize[elem.style.backgroundSize]) {
      bgSize = elem.style.backgroundSize;
    }

    return bgSize;
  };

  var setTypeOrMedia = function setTypeOrMedia(source, match) {
    if (match) {
      var typeMatch = match.match(regType);

      if (typeMatch && typeMatch[1]) {
        source.setAttribute('type', typeMatch[1]);
      } else {
        source.setAttribute('media', lazySizesCfg.customMedia[match] || match);
      }
    }
  };

  var createPicture = function createPicture(sets, elem, img) {
    var picture = document.createElement('picture');
    var sizes = elem.getAttribute(lazySizesCfg.sizesAttr);
    var ratio = elem.getAttribute('data-ratio');
    var optimumx = elem.getAttribute('data-optimumx');

    if (elem._lazybgset && elem._lazybgset.parentNode == elem) {
      elem.removeChild(elem._lazybgset);
    }

    Object.defineProperty(img, '_lazybgset', {
      value: elem,
      writable: true
    });
    Object.defineProperty(elem, '_lazybgset', {
      value: picture,
      writable: true
    });
    sets = sets.replace(regWhite, ' ').split(regSplitSet);
    picture.style.display = 'none';
    img.className = lazySizesCfg.lazyClass;

    if (sets.length == 1 && !sizes) {
      sizes = 'auto';
    }

    sets.forEach(function (set) {
      var match;
      var source = document.createElement('source');

      if (sizes && sizes != 'auto') {
        source.setAttribute('sizes', sizes);
      }

      if (match = set.match(regSource)) {
        source.setAttribute(lazySizesCfg.srcsetAttr, match[1]);
        setTypeOrMedia(source, match[2]);
        setTypeOrMedia(source, match[3]);
      } else {
        source.setAttribute(lazySizesCfg.srcsetAttr, set);
      }

      picture.appendChild(source);
    });

    if (sizes) {
      img.setAttribute(lazySizesCfg.sizesAttr, sizes);
      elem.removeAttribute(lazySizesCfg.sizesAttr);
      elem.removeAttribute('sizes');
    }

    if (optimumx) {
      img.setAttribute('data-optimumx', optimumx);
    }

    if (ratio) {
      img.setAttribute('data-ratio', ratio);
    }

    picture.appendChild(img);
    elem.appendChild(picture);
  };

  var proxyLoad = function proxyLoad(e) {
    if (!e.target._lazybgset) {
      return;
    }

    var image = e.target;
    var elem = image._lazybgset;
    var bg = image.currentSrc || image.src;

    if (bg) {
      var event = lazySizes.fire(elem, 'bgsetproxy', {
        src: bg,
        useSrc: regBgUrlEscape.test(bg) ? JSON.stringify(bg) : bg
      });

      if (!event.defaultPrevented) {
        elem.style.backgroundImage = 'url(' + event.detail.useSrc + ')';
      }
    }

    if (image._lazybgsetLoading) {
      lazySizes.fire(elem, '_lazyloaded', {}, false, true);
      delete image._lazybgsetLoading;
    }
  };

  addEventListener('lazybeforeunveil', function (e) {
    var set, image, elem;

    if (e.defaultPrevented || !(set = e.target.getAttribute('data-bgset'))) {
      return;
    }

    elem = e.target;
    image = document.createElement('img');
    image.alt = '';
    image._lazybgsetLoading = true;
    e.detail.firesLoad = true;
    createPicture(set, elem, image);
    setTimeout(function () {
      lazySizes.loader.unveil(image);
      lazySizes.rAF(function () {
        lazySizes.fire(image, '_lazyloaded', {}, true, true);

        if (image.complete) {
          proxyLoad({
            target: image
          });
        }
      });
    });
  });
  document.addEventListener('load', proxyLoad, true);
  window.addEventListener('lazybeforesizes', function (e) {
    if (e.detail.instance != lazySizes) {
      return;
    }

    if (e.target._lazybgset && e.detail.dataAttr) {
      var elem = e.target._lazybgset;
      var bgSize = getBgSize(elem);

      if (allowedBackgroundSize[bgSize]) {
        e.target._lazysizesParentFit = bgSize;
        lazySizes.rAF(function () {
          e.target.setAttribute('data-parent-fit', bgSize);

          if (e.target._lazysizesParentFit) {
            delete e.target._lazysizesParentFit;
          }
        });
      }
    }
  }, true);
  document.documentElement.addEventListener('lazybeforesizes', function (e) {
    if (e.defaultPrevented || !e.target._lazybgset || e.detail.instance != lazySizes) {
      return;
    }

    e.detail.width = proxyWidth(e.target._lazybgset);
  });
});

(function (window, factory) {
  var globalInstall = function globalInstall() {
    factory(window.lazySizes);
    window.removeEventListener('lazyunveilread', globalInstall, true);
  };

  factory = factory.bind(null, window, window.document);

  if ((typeof module === "undefined" ? "undefined" : _typeof(module)) == 'object' && module.exports) {
    factory(require('lazysizes'));
  } else if (window.lazySizes) {
    globalInstall();
  } else {
    window.addEventListener('lazyunveilread', globalInstall, true);
  }
})(window, function (window, document, lazySizes) {
  'use strict';

  var imgSupport = 'loading' in HTMLImageElement.prototype;
  var iframeSupport = 'loading' in HTMLIFrameElement.prototype;
  var isConfigSet = false;
  var oldPrematureUnveil = lazySizes.prematureUnveil;
  var cfg = lazySizes.cfg;
  var listenerMap = {
    focus: 1,
    mouseover: 1,
    click: 1,
    load: 1,
    transitionend: 1,
    animationend: 1,
    scroll: 1,
    resize: 1
  };

  if (!cfg.nativeLoading) {
    cfg.nativeLoading = {};
  }

  if (!window.addEventListener || !window.MutationObserver || !imgSupport && !iframeSupport) {
    return;
  }

  function disableEvents() {
    var loader = lazySizes.loader;
    var throttledCheckElements = loader.checkElems;

    var removeALSL = function removeALSL() {
      setTimeout(function () {
        window.removeEventListener('scroll', loader._aLSL, true);
      }, 1000);
    };

    var currentListenerMap = _typeof(cfg.nativeLoading.disableListeners) == 'object' ? cfg.nativeLoading.disableListeners : listenerMap;

    if (currentListenerMap.scroll) {
      window.addEventListener('load', removeALSL);
      removeALSL();
      window.removeEventListener('scroll', throttledCheckElements, true);
    }

    if (currentListenerMap.resize) {
      window.removeEventListener('resize', throttledCheckElements, true);
    }

    Object.keys(currentListenerMap).forEach(function (name) {
      if (currentListenerMap[name]) {
        document.removeEventListener(name, throttledCheckElements, true);
      }
    });
  }

  function runConfig() {
    if (isConfigSet) {
      return;
    }

    isConfigSet = true;

    if (imgSupport && iframeSupport && cfg.nativeLoading.disableListeners) {
      if (cfg.nativeLoading.disableListeners === true) {
        cfg.nativeLoading.setLoadingAttribute = true;
      }

      disableEvents();
    }

    if (cfg.nativeLoading.setLoadingAttribute) {
      window.addEventListener('lazybeforeunveil', function (e) {
        var element = e.target;

        if ('loading' in element && !element.getAttribute('loading')) {
          element.setAttribute('loading', 'lazy');
        }
      }, true);
    }
  }

  lazySizes.prematureUnveil = function prematureUnveil(element) {
    if (!isConfigSet) {
      runConfig();
    }

    if ('loading' in element && (cfg.nativeLoading.setLoadingAttribute || element.getAttribute('loading')) && (element.getAttribute('data-sizes') != 'auto' || element.offsetWidth)) {
      return true;
    }

    if (oldPrematureUnveil) {
      return oldPrematureUnveil(element);
    }
  };
});

(function (window, factory) {
  if (!window) {
    return;
  }

  var globalInstall = function globalInstall(initialEvent) {
    factory(window.lazySizes, initialEvent);
    window.removeEventListener('lazyunveilread', globalInstall, true);
  };

  factory = factory.bind(null, window, window.document);

  if ((typeof module === "undefined" ? "undefined" : _typeof(module)) == 'object' && module.exports) {
    factory(require('lazysizes'));
  } else if (window.lazySizes) {
    globalInstall();
  } else {
    window.addEventListener('lazyunveilread', globalInstall, true);
  }
})(typeof window != 'undefined' ? window : 0, function (window, document, lazySizes, initialEvent) {
  'use strict';

  var cloneElementClass;
  var style = document.createElement('a').style;
  var fitSupport = 'objectFit' in style;
  var positionSupport = fitSupport && 'objectPosition' in style;
  var regCssFit = /object-fit["']*\s*:\s*["']*(contain|cover)/;
  var regCssPosition = /object-position["']*\s*:\s*["']*(.+?)(?=($|,|'|"|;))/;
  var blankSrc = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
  var regBgUrlEscape = /\(|\)|'/;
  var positionDefaults = {
    center: 'center',
    '50% 50%': 'center'
  };

  function getObject(element) {
    var css = getComputedStyle(element, null) || {};
    var content = css.fontFamily || '';
    var objectFit = content.match(regCssFit) || '';
    var objectPosition = objectFit && content.match(regCssPosition) || '';

    if (objectPosition) {
      objectPosition = objectPosition[1];
    }

    return {
      fit: objectFit && objectFit[1] || '',
      position: positionDefaults[objectPosition] || objectPosition || 'center'
    };
  }

  function generateStyleClass() {
    if (cloneElementClass) {
      return;
    }

    var styleElement = document.createElement('style');
    cloneElementClass = lazySizes.cfg.objectFitClass || 'lazysizes-display-clone';
    document.querySelector('head').appendChild(styleElement);
  }

  function removePrevClone(element) {
    var prev = element.previousElementSibling;

    if (prev && lazySizes.hC(prev, cloneElementClass)) {
      prev.parentNode.removeChild(prev);
      element.style.position = prev.getAttribute('data-position') || '';
      element.style.visibility = prev.getAttribute('data-visibility') || '';
    }
  }

  function initFix(element, config) {
    var switchClassesAdded, addedSrc, styleElement, styleElementStyle;
    var lazysizesCfg = lazySizes.cfg;

    var onChange = function onChange() {
      var src = element.currentSrc || element.src;

      if (src && addedSrc !== src) {
        addedSrc = src;
        styleElementStyle.backgroundImage = 'url(' + (regBgUrlEscape.test(src) ? JSON.stringify(src) : src) + ')';

        if (!switchClassesAdded) {
          switchClassesAdded = true;
          lazySizes.rC(styleElement, lazysizesCfg.loadingClass);
          lazySizes.aC(styleElement, lazysizesCfg.loadedClass);
        }
      }
    };

    var rafedOnChange = function rafedOnChange() {
      lazySizes.rAF(onChange);
    };

    element._lazysizesParentFit = config.fit;
    element.addEventListener('lazyloaded', rafedOnChange, true);
    element.addEventListener('load', rafedOnChange, true);
    lazySizes.rAF(function () {
      var hideElement = element;
      var container = element.parentNode;

      if (container.nodeName.toUpperCase() == 'PICTURE') {
        hideElement = container;
        container = container.parentNode;
      }

      removePrevClone(hideElement);

      if (!cloneElementClass) {
        generateStyleClass();
      }

      styleElement = element.cloneNode(false);
      styleElementStyle = styleElement.style;
      styleElement.addEventListener('load', function () {
        var curSrc = styleElement.currentSrc || styleElement.src;

        if (curSrc && curSrc != blankSrc) {
          styleElement.src = blankSrc;
          styleElement.srcset = '';
        }
      });
      lazySizes.rC(styleElement, lazysizesCfg.loadedClass);
      lazySizes.rC(styleElement, lazysizesCfg.lazyClass);
      lazySizes.rC(styleElement, lazysizesCfg.autosizesClass);
      lazySizes.aC(styleElement, lazysizesCfg.loadingClass);
      lazySizes.aC(styleElement, cloneElementClass);
      ['data-parent-fit', 'data-parent-container', 'data-object-fit-polyfilled', lazysizesCfg.srcsetAttr, lazysizesCfg.srcAttr].forEach(function (attr) {
        styleElement.removeAttribute(attr);
      });
      styleElement.src = blankSrc;
      styleElement.srcset = '';
      styleElementStyle.backgroundRepeat = 'no-repeat';
      styleElementStyle.backgroundPosition = config.position;
      styleElementStyle.backgroundSize = config.fit;
      styleElement.setAttribute('data-position', hideElement.style.position);
      styleElement.setAttribute('data-visibility', hideElement.style.visibility);
      hideElement.style.visibility = 'hidden';
      hideElement.style.position = 'absolute';
      element.setAttribute('data-parent-fit', config.fit);
      element.setAttribute('data-parent-container', 'prev');
      element.setAttribute('data-object-fit-polyfilled', '');
      element._objectFitPolyfilledDisplay = styleElement;
      container.insertBefore(styleElement, hideElement);

      if (element._lazysizesParentFit) {
        delete element._lazysizesParentFit;
      }

      if (element.complete) {
        onChange();
      }
    });
  }

  if (!fitSupport || !positionSupport) {
    var onRead = function onRead(e) {
      if (e.detail.instance != lazySizes) {
        return;
      }

      var element = e.target;
      var obj = getObject(element);

      if (obj.fit && (!fitSupport || obj.position != 'center')) {
        initFix(element, obj);
        return true;
      }

      return false;
    };

    window.addEventListener('lazybeforesizes', function (e) {
      if (e.detail.instance != lazySizes) {
        return;
      }

      var element = e.target;

      if (element.getAttribute('data-object-fit-polyfilled') != null && !element._objectFitPolyfilledDisplay) {
        if (!onRead(e)) {
          lazySizes.rAF(function () {
            element.removeAttribute('data-object-fit-polyfilled');
          });
        }
      }
    });
    window.addEventListener('lazyunveilread', onRead, true);

    if (initialEvent && initialEvent.detail) {
      onRead(initialEvent);
    }
  }
});
/**
 * LazySizes configuration
 * https://github.com/aFarkas/lazysizes/#js-api---options
 */


lazySizes.cfg.nativeLoading = {
  setLoadingAttribute: false
};
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*! lightgallery - v1.2.19 - 2016-05-17
* http://sachinchoolur.github.io/lightGallery/
* Copyright (c) 2016 Sachin N; Licensed Apache 2.0 */
!function (a, b, c, d) {
  "use strict";

  function e(b, d) {
    if (this.el = b, this.$el = a(b), this.s = a.extend({}, f, d), this.s.dynamic && "undefined" !== this.s.dynamicEl && this.s.dynamicEl.constructor === Array && !this.s.dynamicEl.length) throw "When using dynamic mode, you must also define dynamicEl as an Array.";
    return this.modules = {}, this.lGalleryOn = !1, this.lgBusy = !1, this.hideBartimeout = !1, this.isTouch = "ontouchstart" in c.documentElement, this.s.slideEndAnimatoin && (this.s.hideControlOnEnd = !1), this.s.dynamic ? this.$items = this.s.dynamicEl : "this" === this.s.selector ? this.$items = this.$el : "" !== this.s.selector ? this.s.selectWithin ? this.$items = a(this.s.selectWithin).find(this.s.selector) : this.$items = this.$el.find(a(this.s.selector)) : this.$items = this.$el.children(), this.$slide = "", this.$outer = "", this.init(), this;
  }

  var f = {
    mode: "lg-slide",
    cssEasing: "ease",
    easing: "linear",
    speed: 600,
    height: "100%",
    width: "100%",
    addClass: "",
    startClass: "lg-start-zoom",
    backdropDuration: 150,
    hideBarsDelay: 6e3,
    useLeft: !1,
    closable: !0,
    loop: !0,
    escKey: !0,
    keyPress: !0,
    controls: !0,
    slideEndAnimatoin: !0,
    hideControlOnEnd: !1,
    mousewheel: !0,
    getCaptionFromTitleOrAlt: !0,
    appendSubHtmlTo: ".lg-sub-html",
    preload: 1,
    showAfterLoad: !0,
    selector: "",
    selectWithin: "",
    nextHtml: "",
    prevHtml: "",
    index: !1,
    iframeMaxWidth: "100%",
    download: !0,
    counter: !0,
    appendCounterTo: ".lg-toolbar",
    swipeThreshold: 50,
    enableSwipe: !0,
    enableDrag: !0,
    dynamic: !1,
    dynamicEl: [],
    galleryId: 1
  };
  e.prototype.init = function () {
    var c = this;
    c.s.preload > c.$items.length && (c.s.preload = c.$items.length);
    var d = b.location.hash;
    d.indexOf("lg=" + this.s.galleryId) > 0 && (c.index = parseInt(d.split("&slide=")[1], 10), a("body").addClass("lg-from-hash"), a("body").hasClass("lg-on") || setTimeout(function () {
      c.build(c.index), a("body").addClass("lg-on");
    })), c.s.dynamic ? (c.$el.trigger("onBeforeOpen.lg"), c.index = c.s.index || 0, a("body").hasClass("lg-on") || setTimeout(function () {
      c.build(c.index), a("body").addClass("lg-on");
    })) : c.$items.on("click.lgcustom", function (b) {
      try {
        b.preventDefault(), b.preventDefault();
      } catch (d) {
        b.returnValue = !1;
      }

      c.$el.trigger("onBeforeOpen.lg"), c.index = c.s.index || c.$items.index(this), a("body").hasClass("lg-on") || (c.build(c.index), a("body").addClass("lg-on"));
    });
  }, e.prototype.build = function (b) {
    var c = this;
    c.structure(), a.each(a.fn.lightGallery.modules, function (b) {
      c.modules[b] = new a.fn.lightGallery.modules[b](c.el);
    }), c.slide(b, !1, !1), c.s.keyPress && c.keyPress(), c.$items.length > 1 && (c.arrow(), setTimeout(function () {
      c.enableDrag(), c.enableSwipe();
    }, 50), c.s.mousewheel && c.mousewheel()), c.counter(), c.closeGallery(), c.$el.trigger("onAfterOpen.lg"), c.$outer.on("mousemove.lg click.lg touchstart.lg", function () {
      c.$outer.removeClass("lg-hide-items"), clearTimeout(c.hideBartimeout), c.hideBartimeout = setTimeout(function () {
        c.$outer.addClass("lg-hide-items");
      }, c.s.hideBarsDelay);
    });
  }, e.prototype.structure = function () {
    var c,
        d = "",
        e = "",
        f = 0,
        g = "",
        h = this;

    for (a("body").append('<div class="lg-backdrop"></div>'), a(".lg-backdrop").css("transition-duration", this.s.backdropDuration + "ms"), f = 0; f < this.$items.length; f++) {
      d += '<div class="lg-item"></div>';
    }

    if (this.s.controls && this.$items.length > 1 && (e = '<div class="lg-actions"><div class="lg-prev lg-icon">' + this.s.prevHtml + '</div><div class="lg-next lg-icon">' + this.s.nextHtml + "</div></div>"), ".lg-sub-html" === this.s.appendSubHtmlTo && (g = '<div class="lg-sub-html"></div>'), c = '<div class="lg-outer ' + this.s.addClass + " " + this.s.startClass + '"><div class="lg" style="width:' + this.s.width + "; height:" + this.s.height + '"><div class="lg-inner">' + d + '</div><div class="lg-toolbar group"><span class="lg-close lg-icon"></span></div>' + e + g + "</div></div>", a("body").append(c), this.$outer = a(".lg-outer"), this.$slide = this.$outer.find(".lg-item"), this.s.useLeft ? (this.$outer.addClass("lg-use-left"), this.s.mode = "lg-slide") : this.$outer.addClass("lg-use-css3"), h.setTop(), a(b).on("resize.lg orientationchange.lg", function () {
      setTimeout(function () {
        h.setTop();
      }, 100);
    }), this.$slide.eq(this.index).addClass("lg-current"), this.doCss() ? this.$outer.addClass("lg-css3") : (this.$outer.addClass("lg-css"), this.s.speed = 0), this.$outer.addClass(this.s.mode), this.s.enableDrag && this.$items.length > 1 && this.$outer.addClass("lg-grab"), this.s.showAfterLoad && this.$outer.addClass("lg-show-after-load"), this.doCss()) {
      var i = this.$outer.find(".lg-inner");
      i.css("transition-timing-function", this.s.cssEasing), i.css("transition-duration", this.s.speed + "ms");
    }

    a(".lg-backdrop").addClass("in"), setTimeout(function () {
      h.$outer.addClass("lg-visible");
    }, this.s.backdropDuration), this.s.download && this.$outer.find(".lg-toolbar").append('<a id="lg-download" target="_blank" download class="lg-download lg-icon"></a>'), this.prevScrollTop = a(b).scrollTop();
  }, e.prototype.setTop = function () {
    if ("100%" !== this.s.height) {
      var c = a(b).height(),
          d = (c - parseInt(this.s.height, 10)) / 2,
          e = this.$outer.find(".lg");
      c >= parseInt(this.s.height, 10) ? e.css("top", d + "px") : e.css("top", "0px");
    }
  }, e.prototype.doCss = function () {
    var a = function a() {
      var a = ["transition", "MozTransition", "WebkitTransition", "OTransition", "msTransition", "KhtmlTransition"],
          b = c.documentElement,
          d = 0;

      for (d = 0; d < a.length; d++) {
        if (a[d] in b.style) return !0;
      }
    };

    return !!a();
  }, e.prototype.isVideo = function (a, b) {
    var c;
    if (c = this.s.dynamic ? this.s.dynamicEl[b].html : this.$items.eq(b).attr("data-html"), !a && c) return {
      html5: !0
    };
    var d = a.match(/\/\/(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=|embed\/)?([a-z0-9\-\_\%]+)/i),
        e = a.match(/\/\/(?:www\.)?vimeo.com\/([0-9a-z\-_]+)/i),
        f = a.match(/\/\/(?:www\.)?dai.ly\/([0-9a-z\-_]+)/i),
        g = a.match(/\/\/(?:www\.)?(?:vk\.com|vkontakte\.ru)\/(?:video_ext\.php\?)(.*)/i);
    return d ? {
      youtube: d
    } : e ? {
      vimeo: e
    } : f ? {
      dailymotion: f
    } : g ? {
      vk: g
    } : void 0;
  }, e.prototype.counter = function () {
    this.s.counter && a(this.s.appendCounterTo).append('<div id="lg-counter"><span id="lg-counter-current">' + (parseInt(this.index, 10) + 1) + '</span>/<span id="lg-counter-all">' + this.$items.length + "</span></div>");
  }, e.prototype.addHtml = function (b) {
    var c,
        d = null;
    if (this.s.dynamic ? this.s.dynamicEl[b].subHtmlUrl ? c = this.s.dynamicEl[b].subHtmlUrl : d = this.s.dynamicEl[b].subHtml : this.$items.eq(b).attr("data-sub-html-url") ? c = this.$items.eq(b).attr("data-sub-html-url") : (d = this.$items.eq(b).attr("data-sub-html"), this.s.getCaptionFromTitleOrAlt && !d && (d = this.$items.eq(b).attr("title") || this.$items.eq(b).find("img").first().attr("alt"))), !c) if ("undefined" != typeof d && null !== d) {
      var e = d.substring(0, 1);
      "." !== e && "#" !== e || (d = a(d).html());
    } else d = "";
    ".lg-sub-html" === this.s.appendSubHtmlTo ? c ? this.$outer.find(this.s.appendSubHtmlTo).load(c) : this.$outer.find(this.s.appendSubHtmlTo).html(d) : c ? this.$slide.eq(b).load(c) : this.$slide.eq(b).append(d), "undefined" != typeof d && null !== d && ("" === d ? this.$outer.find(this.s.appendSubHtmlTo).addClass("lg-empty-html") : this.$outer.find(this.s.appendSubHtmlTo).removeClass("lg-empty-html")), this.$el.trigger("onAfterAppendSubHtml.lg", [b]);
  }, e.prototype.preload = function (a) {
    var b = 1,
        c = 1;

    for (b = 1; b <= this.s.preload && !(b >= this.$items.length - a); b++) {
      this.loadContent(a + b, !1, 0);
    }

    for (c = 1; c <= this.s.preload && !(0 > a - c); c++) {
      this.loadContent(a - c, !1, 0);
    }
  }, e.prototype.loadContent = function (c, d, e) {
    var f,
        g,
        h,
        i,
        j,
        k,
        l = this,
        m = !1,
        n = function n(c) {
      for (var d = [], e = [], f = 0; f < c.length; f++) {
        var h = c[f].split(" ");
        "" === h[0] && h.splice(0, 1), e.push(h[0]), d.push(h[1]);
      }

      for (var i = a(b).width(), j = 0; j < d.length; j++) {
        if (parseInt(d[j], 10) > i) {
          g = e[j];
          break;
        }
      }
    };

    if (l.s.dynamic) {
      if (l.s.dynamicEl[c].poster && (m = !0, h = l.s.dynamicEl[c].poster), k = l.s.dynamicEl[c].html, g = l.s.dynamicEl[c].src, l.s.dynamicEl[c].responsive) {
        var o = l.s.dynamicEl[c].responsive.split(",");
        n(o);
      }

      i = l.s.dynamicEl[c].srcset, j = l.s.dynamicEl[c].sizes;
    } else {
      if (l.$items.eq(c).attr("data-poster") && (m = !0, h = l.$items.eq(c).attr("data-poster")), k = l.$items.eq(c).attr("data-html"), g = l.$items.eq(c).attr("href") || l.$items.eq(c).attr("data-src"), l.$items.eq(c).attr("data-responsive")) {
        var p = l.$items.eq(c).attr("data-responsive").split(",");
        n(p);
      }

      i = l.$items.eq(c).attr("data-srcset"), j = l.$items.eq(c).attr("data-sizes");
    }

    var q = !1;
    l.s.dynamic ? l.s.dynamicEl[c].iframe && (q = !0) : "true" === l.$items.eq(c).attr("data-iframe") && (q = !0);
    var r = l.isVideo(g, c);

    if (!l.$slide.eq(c).hasClass("lg-loaded")) {
      if (q) l.$slide.eq(c).prepend('<div class="lg-video-cont" style="max-width:' + l.s.iframeMaxWidth + '"><div class="lg-video"><iframe class="lg-object" frameborder="0" src="' + g + '"  allowfullscreen="true"></iframe></div></div>');else if (m) {
        var s = "";
        s = r && r.youtube ? "lg-has-youtube" : r && r.vimeo ? "lg-has-vimeo" : "lg-has-html5", l.$slide.eq(c).prepend('<div class="lg-video-cont ' + s + ' "><div class="lg-video"><span class="lg-video-play"></span><img class="lg-object lg-has-poster" src="' + h + '" /></div></div>');
      } else r ? (l.$slide.eq(c).prepend('<div class="lg-video-cont "><div class="lg-video"></div></div>'), l.$el.trigger("hasVideo.lg", [c, g, k])) : l.$slide.eq(c).prepend('<div class="lg-img-wrap"><img class="lg-object lg-image" src="' + g + '" /></div>');

      if (l.$el.trigger("onAferAppendSlide.lg", [c]), f = l.$slide.eq(c).find(".lg-object"), j && f.attr("sizes", j), i) {
        f.attr("srcset", i);

        try {
          picturefill({
            elements: [f[0]]
          });
        } catch (t) {
          console.error("Make sure you have included Picturefill version 2");
        }
      }

      ".lg-sub-html" !== this.s.appendSubHtmlTo && l.addHtml(c), l.$slide.eq(c).addClass("lg-loaded");
    }

    l.$slide.eq(c).find(".lg-object").on("load.lg error.lg", function () {
      var b = 0;
      e && !a("body").hasClass("lg-from-hash") && (b = e), setTimeout(function () {
        l.$slide.eq(c).addClass("lg-complete"), l.$el.trigger("onSlideItemLoad.lg", [c, e || 0]);
      }, b);
    }), r && r.html5 && !m && l.$slide.eq(c).addClass("lg-complete"), d === !0 && (l.$slide.eq(c).hasClass("lg-complete") ? l.preload(c) : l.$slide.eq(c).find(".lg-object").on("load.lg error.lg", function () {
      l.preload(c);
    }));
  }, e.prototype.slide = function (b, c, d) {
    var e = this.$outer.find(".lg-current").index(),
        f = this;

    if (!f.lGalleryOn || e !== b) {
      var g = this.$slide.length,
          h = f.lGalleryOn ? this.s.speed : 0,
          i = !1,
          j = !1;

      if (!f.lgBusy) {
        if (this.s.download) {
          var k;
          k = f.s.dynamic ? f.s.dynamicEl[b].downloadUrl !== !1 && (f.s.dynamicEl[b].downloadUrl || f.s.dynamicEl[b].src) : "false" !== f.$items.eq(b).attr("data-download-url") && (f.$items.eq(b).attr("data-download-url") || f.$items.eq(b).attr("href") || f.$items.eq(b).attr("data-src")), k ? (a("#lg-download").attr("href", k), f.$outer.removeClass("lg-hide-download")) : f.$outer.addClass("lg-hide-download");
        }

        if (this.$el.trigger("onBeforeSlide.lg", [e, b, c, d]), f.lgBusy = !0, clearTimeout(f.hideBartimeout), ".lg-sub-html" === this.s.appendSubHtmlTo && setTimeout(function () {
          f.addHtml(b);
        }, h), this.arrowDisable(b), c) {
          var l = b - 1,
              m = b + 1;
          0 === b && e === g - 1 ? (m = 0, l = g - 1) : b === g - 1 && 0 === e && (m = 0, l = g - 1), this.$slide.removeClass("lg-prev-slide lg-current lg-next-slide"), f.$slide.eq(l).addClass("lg-prev-slide"), f.$slide.eq(m).addClass("lg-next-slide"), f.$slide.eq(b).addClass("lg-current");
        } else f.$outer.addClass("lg-no-trans"), this.$slide.removeClass("lg-prev-slide lg-next-slide"), e > b ? (j = !0, 0 !== b || e !== g - 1 || d || (j = !1, i = !0)) : b > e && (i = !0, b !== g - 1 || 0 !== e || d || (j = !0, i = !1)), j ? (this.$slide.eq(b).addClass("lg-prev-slide"), this.$slide.eq(e).addClass("lg-next-slide")) : i && (this.$slide.eq(b).addClass("lg-next-slide"), this.$slide.eq(e).addClass("lg-prev-slide")), setTimeout(function () {
          f.$slide.removeClass("lg-current"), f.$slide.eq(b).addClass("lg-current"), f.$outer.removeClass("lg-no-trans");
        }, 50);

        f.lGalleryOn ? (setTimeout(function () {
          f.loadContent(b, !0, 0);
        }, this.s.speed + 50), setTimeout(function () {
          f.lgBusy = !1, f.$el.trigger("onAfterSlide.lg", [e, b, c, d]);
        }, this.s.speed)) : (f.loadContent(b, !0, f.s.backdropDuration), f.lgBusy = !1, f.$el.trigger("onAfterSlide.lg", [e, b, c, d])), f.lGalleryOn = !0, this.s.counter && a("#lg-counter-current").text(b + 1);
      }
    }
  }, e.prototype.goToNextSlide = function (a) {
    var b = this;
    b.lgBusy || (b.index + 1 < b.$slide.length ? (b.index++, b.$el.trigger("onBeforeNextSlide.lg", [b.index]), b.slide(b.index, a, !1)) : b.s.loop ? (b.index = 0, b.$el.trigger("onBeforeNextSlide.lg", [b.index]), b.slide(b.index, a, !1)) : b.s.slideEndAnimatoin && (b.$outer.addClass("lg-right-end"), setTimeout(function () {
      b.$outer.removeClass("lg-right-end");
    }, 400)));
  }, e.prototype.goToPrevSlide = function (a) {
    var b = this;
    b.lgBusy || (b.index > 0 ? (b.index--, b.$el.trigger("onBeforePrevSlide.lg", [b.index, a]), b.slide(b.index, a, !1)) : b.s.loop ? (b.index = b.$items.length - 1, b.$el.trigger("onBeforePrevSlide.lg", [b.index, a]), b.slide(b.index, a, !1)) : b.s.slideEndAnimatoin && (b.$outer.addClass("lg-left-end"), setTimeout(function () {
      b.$outer.removeClass("lg-left-end");
    }, 400)));
  }, e.prototype.keyPress = function () {
    var c = this;
    this.$items.length > 1 && a(b).on("keyup.lg", function (a) {
      c.$items.length > 1 && (37 === a.keyCode && (a.preventDefault(), c.goToPrevSlide()), 39 === a.keyCode && (a.preventDefault(), c.goToNextSlide()));
    }), a(b).on("keydown.lg", function (a) {
      c.s.escKey === !0 && 27 === a.keyCode && (a.preventDefault(), c.$outer.hasClass("lg-thumb-open") ? c.$outer.removeClass("lg-thumb-open") : c.destroy());
    });
  }, e.prototype.arrow = function () {
    var a = this;
    this.$outer.find(".lg-prev").on("click.lg", function () {
      a.goToPrevSlide();
    }), this.$outer.find(".lg-next").on("click.lg", function () {
      a.goToNextSlide();
    });
  }, e.prototype.arrowDisable = function (a) {
    !this.s.loop && this.s.hideControlOnEnd && (a + 1 < this.$slide.length ? this.$outer.find(".lg-next").removeAttr("disabled").removeClass("disabled") : this.$outer.find(".lg-next").attr("disabled", "disabled").addClass("disabled"), a > 0 ? this.$outer.find(".lg-prev").removeAttr("disabled").removeClass("disabled") : this.$outer.find(".lg-prev").attr("disabled", "disabled").addClass("disabled"));
  }, e.prototype.setTranslate = function (a, b, c) {
    this.s.useLeft ? a.css("left", b) : a.css({
      transform: "translate3d(" + b + "px, " + c + "px, 0px)"
    });
  }, e.prototype.touchMove = function (b, c) {
    var d = c - b;
    Math.abs(d) > 15 && (this.$outer.addClass("lg-dragging"), this.setTranslate(this.$slide.eq(this.index), d, 0), this.setTranslate(a(".lg-prev-slide"), -this.$slide.eq(this.index).width() + d, 0), this.setTranslate(a(".lg-next-slide"), this.$slide.eq(this.index).width() + d, 0));
  }, e.prototype.touchEnd = function (a) {
    var b = this;
    "lg-slide" !== b.s.mode && b.$outer.addClass("lg-slide"), this.$slide.not(".lg-current, .lg-prev-slide, .lg-next-slide").css("opacity", "0"), setTimeout(function () {
      b.$outer.removeClass("lg-dragging"), 0 > a && Math.abs(a) > b.s.swipeThreshold ? b.goToNextSlide(!0) : a > 0 && Math.abs(a) > b.s.swipeThreshold ? b.goToPrevSlide(!0) : Math.abs(a) < 5 && b.$el.trigger("onSlideClick.lg"), b.$slide.removeAttr("style");
    }), setTimeout(function () {
      b.$outer.hasClass("lg-dragging") || "lg-slide" === b.s.mode || b.$outer.removeClass("lg-slide");
    }, b.s.speed + 100);
  }, e.prototype.enableSwipe = function () {
    var a = this,
        b = 0,
        c = 0,
        d = !1;
    a.s.enableSwipe && a.isTouch && a.doCss() && (a.$slide.on("touchstart.lg", function (c) {
      a.$outer.hasClass("lg-zoomed") || a.lgBusy || (c.preventDefault(), a.manageSwipeClass(), b = c.originalEvent.targetTouches[0].pageX);
    }), a.$slide.on("touchmove.lg", function (e) {
      a.$outer.hasClass("lg-zoomed") || (e.preventDefault(), c = e.originalEvent.targetTouches[0].pageX, a.touchMove(b, c), d = !0);
    }), a.$slide.on("touchend.lg", function () {
      a.$outer.hasClass("lg-zoomed") || (d ? (d = !1, a.touchEnd(c - b)) : a.$el.trigger("onSlideClick.lg"));
    }));
  }, e.prototype.enableDrag = function () {
    var c = this,
        d = 0,
        e = 0,
        f = !1,
        g = !1;
    c.s.enableDrag && !c.isTouch && c.doCss() && (c.$slide.on("mousedown.lg", function (b) {
      c.$outer.hasClass("lg-zoomed") || (a(b.target).hasClass("lg-object") || a(b.target).hasClass("lg-video-play")) && (b.preventDefault(), c.lgBusy || (c.manageSwipeClass(), d = b.pageX, f = !0, c.$outer.scrollLeft += 1, c.$outer.scrollLeft -= 1, c.$outer.removeClass("lg-grab").addClass("lg-grabbing"), c.$el.trigger("onDragstart.lg")));
    }), a(b).on("mousemove.lg", function (a) {
      f && (g = !0, e = a.pageX, c.touchMove(d, e), c.$el.trigger("onDragmove.lg"));
    }), a(b).on("mouseup.lg", function (b) {
      g ? (g = !1, c.touchEnd(e - d), c.$el.trigger("onDragend.lg")) : (a(b.target).hasClass("lg-object") || a(b.target).hasClass("lg-video-play")) && c.$el.trigger("onSlideClick.lg"), f && (f = !1, c.$outer.removeClass("lg-grabbing").addClass("lg-grab"));
    }));
  }, e.prototype.manageSwipeClass = function () {
    var a = this.index + 1,
        b = this.index - 1,
        c = this.$slide.length;
    this.s.loop && (0 === this.index ? b = c - 1 : this.index === c - 1 && (a = 0)), this.$slide.removeClass("lg-next-slide lg-prev-slide"), b > -1 && this.$slide.eq(b).addClass("lg-prev-slide"), this.$slide.eq(a).addClass("lg-next-slide");
  }, e.prototype.mousewheel = function () {
    var a = this;
    a.$outer.on("mousewheel.lg", function (b) {
      b.deltaY && (b.deltaY > 0 ? a.goToPrevSlide() : a.goToNextSlide(), b.preventDefault());
    });
  }, e.prototype.closeGallery = function () {
    var b = this,
        c = !1;
    this.$outer.find(".lg-close").on("click.lg", function () {
      b.destroy();
    }), b.s.closable && (b.$outer.on("mousedown.lg", function (b) {
      c = !!(a(b.target).is(".lg-outer") || a(b.target).is(".lg-item ") || a(b.target).is(".lg-img-wrap"));
    }), b.$outer.on("mouseup.lg", function (d) {
      (a(d.target).is(".lg-outer") || a(d.target).is(".lg-item ") || a(d.target).is(".lg-img-wrap") && c) && (b.$outer.hasClass("lg-dragging") || b.destroy());
    }));
  }, e.prototype.destroy = function (c) {
    var d = this;
    c || d.$el.trigger("onBeforeClose.lg"), a(b).scrollTop(d.prevScrollTop), c && (d.s.dynamic || this.$items.off("click.lg click.lgcustom"), a.removeData(d.el, "lightGallery")), this.$el.off(".lg.tm"), a.each(a.fn.lightGallery.modules, function (a) {
      d.modules[a] && d.modules[a].destroy();
    }), this.lGalleryOn = !1, clearTimeout(d.hideBartimeout), this.hideBartimeout = !1, a(b).off(".lg"), a("body").removeClass("lg-on lg-from-hash"), d.$outer && d.$outer.removeClass("lg-visible"), a(".lg-backdrop").removeClass("in"), setTimeout(function () {
      d.$outer && d.$outer.remove(), a(".lg-backdrop").remove(), c || d.$el.trigger("onCloseAfter.lg");
    }, d.s.backdropDuration + 50);
  }, a.fn.lightGallery = function (b) {
    return this.each(function () {
      if (a.data(this, "lightGallery")) try {
        a(this).data("lightGallery").init();
      } catch (c) {
        console.error("lightGallery has not initiated properly");
      } else a.data(this, "lightGallery", new e(this, b));
    });
  }, a.fn.lightGallery.modules = {};
}(jQuery, window, document);
;
/*! lightgallery - v1.2.19 - 2016-05-17
* http://sachinchoolur.github.io/lightGallery/
* Copyright (c) 2016 Sachin N; Licensed Apache 2.0 */

!function (a, b, c, d) {
  "use strict";

  var e = {
    videoMaxWidth: "1140px",
    youtubePlayerParams: !1,
    vimeoPlayerParams: !1,
    dailymotionPlayerParams: !1,
    vkPlayerParams: !1,
    videojs: !1,
    videojsOptions: {}
  },
      f = function f(b) {
    return this.core = a(b).data("lightGallery"), this.$el = a(b), this.core.s = a.extend({}, e, this.core.s), this.videoLoaded = !1, this.init(), this;
  };

  f.prototype.init = function () {
    var b = this;
    b.core.$el.on("hasVideo.lg.tm", function (a, c, d, e) {
      if (b.core.$slide.eq(c).find(".lg-video").append(b.loadVideo(d, "lg-object", !0, c, e)), e) if (b.core.s.videojs) try {
        videojs(b.core.$slide.eq(c).find(".lg-html5").get(0), b.core.s.videojsOptions, function () {
          b.videoLoaded || this.play();
        });
      } catch (f) {
        console.error("Make sure you have included videojs");
      } else b.core.$slide.eq(c).find(".lg-html5").get(0).play();
    }), b.core.$el.on("onAferAppendSlide.lg.tm", function (a, c) {
      b.core.$slide.eq(c).find(".lg-video-cont").css("max-width", b.core.s.videoMaxWidth), b.videoLoaded = !0;
    });

    var c = function c(a) {
      if (a.find(".lg-object").hasClass("lg-has-poster") && a.find(".lg-object").is(":visible")) if (a.hasClass("lg-has-video")) {
        var c = a.find(".lg-youtube").get(0),
            d = a.find(".lg-vimeo").get(0),
            e = a.find(".lg-dailymotion").get(0),
            f = a.find(".lg-html5").get(0);
        if (c) c.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', "*");else if (d) try {
          $f(d).api("play");
        } catch (g) {
          console.error("Make sure you have included froogaloop2 js");
        } else if (e) e.contentWindow.postMessage("play", "*");else if (f) if (b.core.s.videojs) try {
          videojs(f).play();
        } catch (g) {
          console.error("Make sure you have included videojs");
        } else f.play();
        a.addClass("lg-video-playing");
      } else {
        a.addClass("lg-video-playing lg-has-video");

        var h,
            i,
            j = function j(c, d) {
          if (a.find(".lg-video").append(b.loadVideo(c, "", !1, b.core.index, d)), d) if (b.core.s.videojs) try {
            videojs(b.core.$slide.eq(b.core.index).find(".lg-html5").get(0), b.core.s.videojsOptions, function () {
              this.play();
            });
          } catch (e) {
            console.error("Make sure you have included videojs");
          } else b.core.$slide.eq(b.core.index).find(".lg-html5").get(0).play();
        };

        b.core.s.dynamic ? (h = b.core.s.dynamicEl[b.core.index].src, i = b.core.s.dynamicEl[b.core.index].html, j(h, i)) : (h = b.core.$items.eq(b.core.index).attr("href") || b.core.$items.eq(b.core.index).attr("data-src"), i = b.core.$items.eq(b.core.index).attr("data-html"), j(h, i));
        var k = a.find(".lg-object");
        a.find(".lg-video").append(k), a.find(".lg-video-object").hasClass("lg-html5") || (a.removeClass("lg-complete"), a.find(".lg-video-object").on("load.lg error.lg", function () {
          a.addClass("lg-complete");
        }));
      }
    };

    b.core.doCss() && b.core.$items.length > 1 && (b.core.s.enableSwipe && b.core.isTouch || b.core.s.enableDrag && !b.core.isTouch) ? b.core.$el.on("onSlideClick.lg.tm", function () {
      var a = b.core.$slide.eq(b.core.index);
      c(a);
    }) : b.core.$slide.on("click.lg", function () {
      c(a(this));
    }), b.core.$el.on("onBeforeSlide.lg.tm", function (c, d, e) {
      var f = b.core.$slide.eq(d),
          g = f.find(".lg-youtube").get(0),
          h = f.find(".lg-vimeo").get(0),
          i = f.find(".lg-dailymotion").get(0),
          j = f.find(".lg-vk").get(0),
          k = f.find(".lg-html5").get(0);
      if (g) g.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', "*");else if (h) try {
        $f(h).api("pause");
      } catch (l) {
        console.error("Make sure you have included froogaloop2 js");
      } else if (i) i.contentWindow.postMessage("pause", "*");else if (k) if (b.core.s.videojs) try {
        videojs(k).pause();
      } catch (l) {
        console.error("Make sure you have included videojs");
      } else k.pause();
      j && a(j).attr("src", a(j).attr("src").replace("&autoplay", "&noplay"));
      var m;
      m = b.core.s.dynamic ? b.core.s.dynamicEl[e].src : b.core.$items.eq(e).attr("href") || b.core.$items.eq(e).attr("data-src");
      var n = b.core.isVideo(m, e) || {};
      (n.youtube || n.vimeo || n.dailymotion || n.vk) && b.core.$outer.addClass("lg-hide-download");
    }), b.core.$el.on("onAfterSlide.lg.tm", function (a, c) {
      b.core.$slide.eq(c).removeClass("lg-video-playing");
    });
  }, f.prototype.loadVideo = function (b, c, d, e, f) {
    var g = "",
        h = 1,
        i = "",
        j = this.core.isVideo(b, e) || {};
    if (d && (h = this.videoLoaded ? 0 : 1), j.youtube) i = "?wmode=opaque&autoplay=" + h + "&enablejsapi=1", this.core.s.youtubePlayerParams && (i = i + "&" + a.param(this.core.s.youtubePlayerParams)), g = '<iframe class="lg-video-object lg-youtube ' + c + '" width="560" height="315" src="//www.youtube.com/embed/' + j.youtube[1] + i + '" frameborder="0" allowfullscreen></iframe>';else if (j.vimeo) i = "?autoplay=" + h + "&api=1", this.core.s.vimeoPlayerParams && (i = i + "&" + a.param(this.core.s.vimeoPlayerParams)), g = '<iframe class="lg-video-object lg-vimeo ' + c + '" width="560" height="315"  src="//player.vimeo.com/video/' + j.vimeo[1] + i + '" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';else if (j.dailymotion) i = "?wmode=opaque&autoplay=" + h + "&api=postMessage", this.core.s.dailymotionPlayerParams && (i = i + "&" + a.param(this.core.s.dailymotionPlayerParams)), g = '<iframe class="lg-video-object lg-dailymotion ' + c + '" width="560" height="315" src="//www.dailymotion.com/embed/video/' + j.dailymotion[1] + i + '" frameborder="0" allowfullscreen></iframe>';else if (j.html5) {
      var k = f.substring(0, 1);
      "." !== k && "#" !== k || (f = a(f).html()), g = f;
    } else j.vk && (i = "&autoplay=" + h, this.core.s.vkPlayerParams && (i = i + "&" + a.param(this.core.s.vkPlayerParams)), g = '<iframe class="lg-video-object lg-vk ' + c + '" width="560" height="315" src="http://vk.com/video_ext.php?' + j.vk[1] + i + '" frameborder="0" allowfullscreen></iframe>');
    return g;
  }, f.prototype.destroy = function () {
    this.videoLoaded = !1;
  }, a.fn.lightGallery.modules.video = f;
}(jQuery, window, document);
;
/*! lg-zoom - v1.1.0 - 2017-08-08
* http://sachinchoolur.github.io/lightGallery
* Copyright (c) 2017 Sachin N; Licensed GPLv3 */

!function (a, b) {
  "function" == typeof define && define.amd ? define(["jquery"], function (a) {
    return b(a);
  }) : "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) ? module.exports = b(require("jquery")) : b(jQuery);
}(void 0, function (a) {
  !function () {
    "use strict";

    var b = function b() {
      var a = !1,
          b = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
      return b && parseInt(b[2], 10) < 54 && (a = !0), a;
    },
        c = {
      scale: 1,
      zoom: !0,
      actualSize: !0,
      enableZoomAfter: 300,
      useLeftForZoom: b()
    },
        d = function d(b) {
      return this.core = a(b).data("lightGallery"), this.core.s = a.extend({}, c, this.core.s), this.core.s.zoom && this.core.doCss() && (this.init(), this.zoomabletimeout = !1, this.pageX = a(window).width() / 2, this.pageY = a(window).height() / 2 + a(window).scrollTop()), this;
    };

    d.prototype.init = function () {
      var b = this,
          c = '<span id="lg-zoom-in" class="lg-icon"></span><span id="lg-zoom-out" class="lg-icon"></span>';
      b.core.s.actualSize && (c += '<span id="lg-actual-size" class="lg-icon"></span>'), b.core.s.useLeftForZoom ? b.core.$outer.addClass("lg-use-left-for-zoom") : b.core.$outer.addClass("lg-use-transition-for-zoom"), this.core.$outer.find(".lg-toolbar").append(c), b.core.$el.on("onSlideItemLoad.lg.tm.zoom", function (c, d, e) {
        var f = b.core.s.enableZoomAfter + e;
        a("body").hasClass("lg-from-hash") && e ? f = 0 : a("body").removeClass("lg-from-hash"), b.zoomabletimeout = setTimeout(function () {
          b.core.$slide.eq(d).addClass("lg-zoomable");
        }, f + 30);
      });

      var d = 1,
          e = function e(c) {
        var d,
            e,
            f = b.core.$outer.find(".lg-current .lg-image"),
            g = (a(window).width() - f.prop("offsetWidth")) / 2,
            h = (a(window).height() - f.prop("offsetHeight")) / 2 + a(window).scrollTop();
        d = b.pageX - g, e = b.pageY - h;
        var i = (c - 1) * d,
            j = (c - 1) * e;
        f.css("transform", "scale3d(" + c + ", " + c + ", 1)").attr("data-scale", c), b.core.s.useLeftForZoom ? f.parent().css({
          left: -i + "px",
          top: -j + "px"
        }).attr("data-x", i).attr("data-y", j) : f.parent().css("transform", "translate3d(-" + i + "px, -" + j + "px, 0)").attr("data-x", i).attr("data-y", j);
      },
          f = function f() {
        d > 1 ? b.core.$outer.addClass("lg-zoomed") : b.resetZoom(), d < 1 && (d = 1), e(d);
      },
          g = function g(c, e, _g, h) {
        var i,
            j = e.prop("offsetWidth");
        i = b.core.s.dynamic ? b.core.s.dynamicEl[_g].width || e[0].naturalWidth || j : b.core.$items.eq(_g).attr("data-width") || e[0].naturalWidth || j;
        var k;
        b.core.$outer.hasClass("lg-zoomed") ? d = 1 : i > j && (k = i / j, d = k || 2), h ? (b.pageX = a(window).width() / 2, b.pageY = a(window).height() / 2 + a(window).scrollTop()) : (b.pageX = c.pageX || c.originalEvent.targetTouches[0].pageX, b.pageY = c.pageY || c.originalEvent.targetTouches[0].pageY), f(), setTimeout(function () {
          b.core.$outer.removeClass("lg-grabbing").addClass("lg-grab");
        }, 10);
      },
          h = !1;

      b.core.$el.on("onAferAppendSlide.lg.tm.zoom", function (a, c) {
        var d = b.core.$slide.eq(c).find(".lg-image");
        d.on("dblclick", function (a) {
          g(a, d, c);
        }), d.on("touchstart", function (a) {
          h ? (clearTimeout(h), h = null, g(a, d, c)) : h = setTimeout(function () {
            h = null;
          }, 300), a.preventDefault();
        });
      }), a(window).on("resize.lg.zoom scroll.lg.zoom orientationchange.lg.zoom", function () {
        b.pageX = a(window).width() / 2, b.pageY = a(window).height() / 2 + a(window).scrollTop(), e(d);
      }), a("#lg-zoom-out").on("click.lg", function () {
        b.core.$outer.find(".lg-current .lg-image").length && (d -= b.core.s.scale, f());
      }), a("#lg-zoom-in").on("click.lg", function () {
        b.core.$outer.find(".lg-current .lg-image").length && (d += b.core.s.scale, f());
      }), a("#lg-actual-size").on("click.lg", function (a) {
        g(a, b.core.$slide.eq(b.core.index).find(".lg-image"), b.core.index, !0);
      }), b.core.$el.on("onBeforeSlide.lg.tm", function () {
        d = 1, b.resetZoom();
      }), b.zoomDrag(), b.zoomSwipe();
    }, d.prototype.resetZoom = function () {
      this.core.$outer.removeClass("lg-zoomed"), this.core.$slide.find(".lg-img-wrap").removeAttr("style data-x data-y"), this.core.$slide.find(".lg-image").removeAttr("style data-scale"), this.pageX = a(window).width() / 2, this.pageY = a(window).height() / 2 + a(window).scrollTop();
    }, d.prototype.zoomSwipe = function () {
      var a = this,
          b = {},
          c = {},
          d = !1,
          e = !1,
          f = !1;
      a.core.$slide.on("touchstart.lg", function (c) {
        if (a.core.$outer.hasClass("lg-zoomed")) {
          var d = a.core.$slide.eq(a.core.index).find(".lg-object");
          f = d.prop("offsetHeight") * d.attr("data-scale") > a.core.$outer.find(".lg").height(), e = d.prop("offsetWidth") * d.attr("data-scale") > a.core.$outer.find(".lg").width(), (e || f) && (c.preventDefault(), b = {
            x: c.originalEvent.targetTouches[0].pageX,
            y: c.originalEvent.targetTouches[0].pageY
          });
        }
      }), a.core.$slide.on("touchmove.lg", function (g) {
        if (a.core.$outer.hasClass("lg-zoomed")) {
          var h,
              i,
              j = a.core.$slide.eq(a.core.index).find(".lg-img-wrap");
          g.preventDefault(), d = !0, c = {
            x: g.originalEvent.targetTouches[0].pageX,
            y: g.originalEvent.targetTouches[0].pageY
          }, a.core.$outer.addClass("lg-zoom-dragging"), i = f ? -Math.abs(j.attr("data-y")) + (c.y - b.y) : -Math.abs(j.attr("data-y")), h = e ? -Math.abs(j.attr("data-x")) + (c.x - b.x) : -Math.abs(j.attr("data-x")), (Math.abs(c.x - b.x) > 15 || Math.abs(c.y - b.y) > 15) && (a.core.s.useLeftForZoom ? j.css({
            left: h + "px",
            top: i + "px"
          }) : j.css("transform", "translate3d(" + h + "px, " + i + "px, 0)"));
        }
      }), a.core.$slide.on("touchend.lg", function () {
        a.core.$outer.hasClass("lg-zoomed") && d && (d = !1, a.core.$outer.removeClass("lg-zoom-dragging"), a.touchendZoom(b, c, e, f));
      });
    }, d.prototype.zoomDrag = function () {
      var b = this,
          c = {},
          d = {},
          e = !1,
          f = !1,
          g = !1,
          h = !1;
      b.core.$slide.on("mousedown.lg.zoom", function (d) {
        var f = b.core.$slide.eq(b.core.index).find(".lg-object");
        h = f.prop("offsetHeight") * f.attr("data-scale") > b.core.$outer.find(".lg").height(), g = f.prop("offsetWidth") * f.attr("data-scale") > b.core.$outer.find(".lg").width(), b.core.$outer.hasClass("lg-zoomed") && a(d.target).hasClass("lg-object") && (g || h) && (d.preventDefault(), c = {
          x: d.pageX,
          y: d.pageY
        }, e = !0, b.core.$outer.scrollLeft += 1, b.core.$outer.scrollLeft -= 1, b.core.$outer.removeClass("lg-grab").addClass("lg-grabbing"));
      }), a(window).on("mousemove.lg.zoom", function (a) {
        if (e) {
          var i,
              j,
              k = b.core.$slide.eq(b.core.index).find(".lg-img-wrap");
          f = !0, d = {
            x: a.pageX,
            y: a.pageY
          }, b.core.$outer.addClass("lg-zoom-dragging"), j = h ? -Math.abs(k.attr("data-y")) + (d.y - c.y) : -Math.abs(k.attr("data-y")), i = g ? -Math.abs(k.attr("data-x")) + (d.x - c.x) : -Math.abs(k.attr("data-x")), b.core.s.useLeftForZoom ? k.css({
            left: i + "px",
            top: j + "px"
          }) : k.css("transform", "translate3d(" + i + "px, " + j + "px, 0)");
        }
      }), a(window).on("mouseup.lg.zoom", function (a) {
        e && (e = !1, b.core.$outer.removeClass("lg-zoom-dragging"), !f || c.x === d.x && c.y === d.y || (d = {
          x: a.pageX,
          y: a.pageY
        }, b.touchendZoom(c, d, g, h)), f = !1), b.core.$outer.removeClass("lg-grabbing").addClass("lg-grab");
      });
    }, d.prototype.touchendZoom = function (a, b, c, d) {
      var e = this,
          f = e.core.$slide.eq(e.core.index).find(".lg-img-wrap"),
          g = e.core.$slide.eq(e.core.index).find(".lg-object"),
          h = -Math.abs(f.attr("data-x")) + (b.x - a.x),
          i = -Math.abs(f.attr("data-y")) + (b.y - a.y),
          j = (e.core.$outer.find(".lg").height() - g.prop("offsetHeight")) / 2,
          k = Math.abs(g.prop("offsetHeight") * Math.abs(g.attr("data-scale")) - e.core.$outer.find(".lg").height() + j),
          l = (e.core.$outer.find(".lg").width() - g.prop("offsetWidth")) / 2,
          m = Math.abs(g.prop("offsetWidth") * Math.abs(g.attr("data-scale")) - e.core.$outer.find(".lg").width() + l);
      (Math.abs(b.x - a.x) > 15 || Math.abs(b.y - a.y) > 15) && (d && (i <= -k ? i = -k : i >= -j && (i = -j)), c && (h <= -m ? h = -m : h >= -l && (h = -l)), d ? f.attr("data-y", Math.abs(i)) : i = -Math.abs(f.attr("data-y")), c ? f.attr("data-x", Math.abs(h)) : h = -Math.abs(f.attr("data-x")), e.core.s.useLeftForZoom ? f.css({
        left: h + "px",
        top: i + "px"
      }) : f.css("transform", "translate3d(" + h + "px, " + i + "px, 0)"));
    }, d.prototype.destroy = function () {
      var b = this;
      b.core.$el.off(".lg.zoom"), a(window).off(".lg.zoom"), b.core.$slide.off(".lg.zoom"), b.core.$el.off(".lg.tm.zoom"), b.resetZoom(), clearTimeout(b.zoomabletimeout), b.zoomabletimeout = !1;
    }, a.fn.lightGallery.modules.zoom = d;
  }();
});
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * what-input - A global utility for tracking the current input method (mouse, keyboard or touch).
 * @version v5.2.6
 * @link https://github.com/ten1seven/what-input
 * @license MIT
 */
(function webpackUniversalModuleDefinition(root, factory) {
  if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && (typeof module === "undefined" ? "undefined" : _typeof(module)) === 'object') module.exports = factory();else if (typeof define === 'function' && define.amd) define("whatInput", [], factory);else if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') exports["whatInput"] = factory();else root["whatInput"] = factory();
})(void 0, function () {
  return (
    /******/
    function (modules) {
      // webpackBootstrap

      /******/
      // The module cache

      /******/
      var installedModules = {};
      /******/
      // The require function

      /******/

      function __webpack_require__(moduleId) {
        /******/
        // Check if module is in cache

        /******/
        if (installedModules[moduleId])
          /******/
          return installedModules[moduleId].exports;
        /******/
        // Create a new module (and put it into the cache)

        /******/

        var module = installedModules[moduleId] = {
          /******/
          exports: {},

          /******/
          id: moduleId,

          /******/
          loaded: false
          /******/

        };
        /******/
        // Execute the module function

        /******/

        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        /******/
        // Flag the module as loaded

        /******/

        module.loaded = true;
        /******/
        // Return the exports of the module

        /******/

        return module.exports;
        /******/
      }
      /******/
      // expose the modules object (__webpack_modules__)

      /******/


      __webpack_require__.m = modules;
      /******/
      // expose the module cache

      /******/

      __webpack_require__.c = installedModules;
      /******/
      // __webpack_public_path__

      /******/

      __webpack_require__.p = "";
      /******/
      // Load entry module and return exports

      /******/

      return __webpack_require__(0);
      /******/
    }(
    /************************************************************************/

    /******/
    [
    /* 0 */

    /***/
    function (module, exports) {
      'use strict';

      module.exports = function () {
        /*
         * bail out if there is no document or window
         * (i.e. in a node/non-DOM environment)
         *
         * Return a stubbed API instead
         */
        if (typeof document === 'undefined' || typeof window === 'undefined') {
          return {
            // always return "initial" because no interaction will ever be detected
            ask: function ask() {
              return 'initial';
            },
            // always return null
            element: function element() {
              return null;
            },
            // no-op
            ignoreKeys: function ignoreKeys() {},
            // no-op
            specificKeys: function specificKeys() {},
            // no-op
            registerOnChange: function registerOnChange() {},
            // no-op
            unRegisterOnChange: function unRegisterOnChange() {}
          };
        }
        /*
         * variables
         */
        // cache document.documentElement


        var docElem = document.documentElement; // currently focused dom element

        var currentElement = null; // last used input type

        var currentInput = 'initial'; // last used input intent

        var currentIntent = currentInput; // UNIX timestamp of current event

        var currentTimestamp = Date.now(); // check for a `data-whatpersist` attribute on either the `html` or `body` elements, defaults to `true`

        var shouldPersist = 'false'; // form input types

        var formInputs = ['button', 'input', 'select', 'textarea']; // empty array for holding callback functions

        var functionList = []; // list of modifier keys commonly used with the mouse and
        // can be safely ignored to prevent false keyboard detection

        var ignoreMap = [16, // shift
        17, // control
        18, // alt
        91, // Windows key / left Apple cmd
        93 // Windows menu / right Apple cmd
        ];
        var specificMap = []; // mapping of events to input types

        var inputMap = {
          keydown: 'keyboard',
          keyup: 'keyboard',
          mousedown: 'mouse',
          mousemove: 'mouse',
          MSPointerDown: 'pointer',
          MSPointerMove: 'pointer',
          pointerdown: 'pointer',
          pointermove: 'pointer',
          touchstart: 'touch',
          touchend: 'touch' // boolean: true if the page is being scrolled

        };
        var isScrolling = false; // store current mouse position

        var mousePos = {
          x: null,
          y: null // map of IE 10 pointer events

        };
        var pointerMap = {
          2: 'touch',
          3: 'touch',
          // treat pen like touch
          4: 'mouse' // check support for passive event listeners

        };
        var supportsPassive = false;

        try {
          var opts = Object.defineProperty({}, 'passive', {
            get: function get() {
              supportsPassive = true;
            }
          });
          window.addEventListener('test', null, opts);
        } catch (e) {} // fail silently

        /*
         * set up
         */


        var setUp = function setUp() {
          // add correct mouse wheel event mapping to `inputMap`
          inputMap[detectWheel()] = 'mouse';
          addListeners();
        };
        /*
         * events
         */


        var addListeners = function addListeners() {
          // `pointermove`, `MSPointerMove`, `mousemove` and mouse wheel event binding
          // can only demonstrate potential, but not actual, interaction
          // and are treated separately
          var options = supportsPassive ? {
            passive: true
          } : false;
          document.addEventListener('DOMContentLoaded', setPersist); // pointer events (mouse, pen, touch)

          if (window.PointerEvent) {
            window.addEventListener('pointerdown', setInput);
            window.addEventListener('pointermove', setIntent);
          } else if (window.MSPointerEvent) {
            window.addEventListener('MSPointerDown', setInput);
            window.addEventListener('MSPointerMove', setIntent);
          } else {
            // mouse events
            window.addEventListener('mousedown', setInput);
            window.addEventListener('mousemove', setIntent); // touch events

            if ('ontouchstart' in window) {
              window.addEventListener('touchstart', setInput, options);
              window.addEventListener('touchend', setInput);
            }
          } // mouse wheel


          window.addEventListener(detectWheel(), setIntent, options); // keyboard events

          window.addEventListener('keydown', setInput);
          window.addEventListener('keyup', setInput); // focus events

          window.addEventListener('focusin', setElement);
          window.addEventListener('focusout', clearElement);
        }; // checks if input persistence should happen and
        // get saved state from session storage if true (defaults to `false`)


        var setPersist = function setPersist() {
          shouldPersist = !(docElem.getAttribute('data-whatpersist') || document.body.getAttribute('data-whatpersist') === 'false');

          if (shouldPersist) {
            // check for session variables and use if available
            try {
              if (window.sessionStorage.getItem('what-input')) {
                currentInput = window.sessionStorage.getItem('what-input');
              }

              if (window.sessionStorage.getItem('what-intent')) {
                currentIntent = window.sessionStorage.getItem('what-intent');
              }
            } catch (e) {// fail silently
            }
          } // always run these so at least `initial` state is set


          doUpdate('input');
          doUpdate('intent');
        }; // checks conditions before updating new input


        var setInput = function setInput(event) {
          var eventKey = event.which;
          var value = inputMap[event.type];

          if (value === 'pointer') {
            value = pointerType(event);
          }

          var ignoreMatch = !specificMap.length && ignoreMap.indexOf(eventKey) === -1;
          var specificMatch = specificMap.length && specificMap.indexOf(eventKey) !== -1;
          var shouldUpdate = value === 'keyboard' && eventKey && (ignoreMatch || specificMatch) || value === 'mouse' || value === 'touch'; // prevent touch detection from being overridden by event execution order

          if (validateTouch(value)) {
            shouldUpdate = false;
          }

          if (shouldUpdate && currentInput !== value) {
            currentInput = value;
            persistInput('input', currentInput);
            doUpdate('input');
          }

          if (shouldUpdate && currentIntent !== value) {
            // preserve intent for keyboard interaction with form fields
            var activeElem = document.activeElement;
            var notFormInput = activeElem && activeElem.nodeName && (formInputs.indexOf(activeElem.nodeName.toLowerCase()) === -1 || activeElem.nodeName.toLowerCase() === 'button' && !checkClosest(activeElem, 'form'));

            if (notFormInput) {
              currentIntent = value;
              persistInput('intent', currentIntent);
              doUpdate('intent');
            }
          }
        }; // updates the doc and `inputTypes` array with new input


        var doUpdate = function doUpdate(which) {
          docElem.setAttribute('data-what' + which, which === 'input' ? currentInput : currentIntent);
          fireFunctions(which);
        }; // updates input intent for `mousemove` and `pointermove`


        var setIntent = function setIntent(event) {
          var value = inputMap[event.type];

          if (value === 'pointer') {
            value = pointerType(event);
          } // test to see if `mousemove` happened relative to the screen to detect scrolling versus mousemove


          detectScrolling(event); // only execute if scrolling isn't happening

          if ((!isScrolling && !validateTouch(value) || isScrolling && event.type === 'wheel' || event.type === 'mousewheel' || event.type === 'DOMMouseScroll') && currentIntent !== value) {
            currentIntent = value;
            persistInput('intent', currentIntent);
            doUpdate('intent');
          }
        };

        var setElement = function setElement(event) {
          if (!event.target.nodeName) {
            // If nodeName is undefined, clear the element
            // This can happen if click inside an <svg> element.
            clearElement();
            return;
          }

          currentElement = event.target.nodeName.toLowerCase();
          docElem.setAttribute('data-whatelement', currentElement);

          if (event.target.classList && event.target.classList.length) {
            docElem.setAttribute('data-whatclasses', event.target.classList.toString().replace(' ', ','));
          }
        };

        var clearElement = function clearElement() {
          currentElement = null;
          docElem.removeAttribute('data-whatelement');
          docElem.removeAttribute('data-whatclasses');
        };

        var persistInput = function persistInput(which, value) {
          if (shouldPersist) {
            try {
              window.sessionStorage.setItem('what-' + which, value);
            } catch (e) {// fail silently
            }
          }
        };
        /*
         * utilities
         */


        var pointerType = function pointerType(event) {
          if (typeof event.pointerType === 'number') {
            return pointerMap[event.pointerType];
          } else {
            // treat pen like touch
            return event.pointerType === 'pen' ? 'touch' : event.pointerType;
          }
        }; // prevent touch detection from being overridden by event execution order


        var validateTouch = function validateTouch(value) {
          var timestamp = Date.now();
          var touchIsValid = value === 'mouse' && currentInput === 'touch' && timestamp - currentTimestamp < 200;
          currentTimestamp = timestamp;
          return touchIsValid;
        }; // detect version of mouse wheel event to use
        // via https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event


        var detectWheel = function detectWheel() {
          var wheelType = null; // Modern browsers support "wheel"

          if ('onwheel' in document.createElement('div')) {
            wheelType = 'wheel';
          } else {
            // Webkit and IE support at least "mousewheel"
            // or assume that remaining browsers are older Firefox
            wheelType = document.onmousewheel !== undefined ? 'mousewheel' : 'DOMMouseScroll';
          }

          return wheelType;
        }; // runs callback functions


        var fireFunctions = function fireFunctions(type) {
          for (var i = 0, len = functionList.length; i < len; i++) {
            if (functionList[i].type === type) {
              functionList[i].fn.call(undefined, type === 'input' ? currentInput : currentIntent);
            }
          }
        }; // finds matching element in an object


        var objPos = function objPos(match) {
          for (var i = 0, len = functionList.length; i < len; i++) {
            if (functionList[i].fn === match) {
              return i;
            }
          }
        };

        var detectScrolling = function detectScrolling(event) {
          if (mousePos.x !== event.screenX || mousePos.y !== event.screenY) {
            isScrolling = false;
            mousePos.x = event.screenX;
            mousePos.y = event.screenY;
          } else {
            isScrolling = true;
          }
        }; // manual version of `closest()`


        var checkClosest = function checkClosest(elem, tag) {
          var ElementPrototype = window.Element.prototype;

          if (!ElementPrototype.matches) {
            ElementPrototype.matches = ElementPrototype.msMatchesSelector || ElementPrototype.webkitMatchesSelector;
          }

          if (!ElementPrototype.closest) {
            do {
              if (elem.matches(tag)) {
                return elem;
              }

              elem = elem.parentElement || elem.parentNode;
            } while (elem !== null && elem.nodeType === 1);

            return null;
          } else {
            return elem.closest(tag);
          }
        };
        /*
         * init
         */
        // don't start script unless browser cuts the mustard
        // (also passes if polyfills are used)


        if ('addEventListener' in window && Array.prototype.indexOf) {
          setUp();
        }
        /*
         * api
         */


        return {
          // returns string: the current input type
          // opt: 'intent'|'input'
          // 'input' (default): returns the same value as the `data-whatinput` attribute
          // 'intent': includes `data-whatintent` value if it's different than `data-whatinput`
          ask: function ask(opt) {
            return opt === 'intent' ? currentIntent : currentInput;
          },
          // returns string: the currently focused element or null
          element: function element() {
            return currentElement;
          },
          // overwrites ignored keys with provided array
          ignoreKeys: function ignoreKeys(arr) {
            ignoreMap = arr;
          },
          // overwrites specific char keys to update on
          specificKeys: function specificKeys(arr) {
            specificMap = arr;
          },
          // attach functions to input and intent "events"
          // funct: function to fire on change
          // eventType: 'input'|'intent'
          registerOnChange: function registerOnChange(fn, eventType) {
            functionList.push({
              fn: fn,
              type: eventType || 'input'
            });
          },
          unRegisterOnChange: function unRegisterOnChange(fn) {
            var position = objPos(fn);

            if (position || position === 0) {
              functionList.splice(position, 1);
            }
          },
          clearStorage: function clearStorage() {
            window.sessionStorage.clear();
          }
        };
      }();
      /***/

    }
    /******/
    ])
  );
});

;
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*console*/
window.log = function f() {
  log.history = log.history || [];
  log.history.push(arguments);

  if (this.console) {
    var args = arguments,
        newarr;
    args.callee = args.callee.caller;
    newarr = [].slice.call(args);
    if (_typeof(console.log) === 'object') log.apply.call(console.log, console, newarr);else console.log.apply(console, newarr);
  }
};

(function (a) {
  function b() {}

  for (var c = "assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","), d; !!(d = c.pop());) {
    a[d] = a[d] || b;
  }
})(function () {
  try {
    console.log();
    return window.console;
  } catch (a) {
    return window.console = {};
  }
}());

;
/*strip_tags*/
// allow can be a string like '<b><i>'

function strip_tags(str, allow) {
  // making sure the allow arg is a string containing only tags in lowercase (<a><b><c>)
  allow = (((allow || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');
  var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
  var commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
  return str.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
    return allow.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
  });
}

;
;

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}
/*! lightgallery - v1.2.19 - 2016-05-17
* http://sachinchoolur.github.io/lightGallery/
* Copyright (c) 2016 Sachin N; Licensed Apache 2.0 */


!function (a, b, c, d) {
  "use strict";

  function e(b, d) {
    if (this.el = b, this.$el = a(b), this.s = a.extend({}, f, d), this.s.dynamic && "undefined" !== this.s.dynamicEl && this.s.dynamicEl.constructor === Array && !this.s.dynamicEl.length) throw "When using dynamic mode, you must also define dynamicEl as an Array.";
    return this.modules = {}, this.lGalleryOn = !1, this.lgBusy = !1, this.hideBartimeout = !1, this.isTouch = "ontouchstart" in c.documentElement, this.s.slideEndAnimatoin && (this.s.hideControlOnEnd = !1), this.s.dynamic ? this.$items = this.s.dynamicEl : "this" === this.s.selector ? this.$items = this.$el : "" !== this.s.selector ? this.s.selectWithin ? this.$items = a(this.s.selectWithin).find(this.s.selector) : this.$items = this.$el.find(a(this.s.selector)) : this.$items = this.$el.children(), this.$slide = "", this.$outer = "", this.init(), this;
  }

  var f = {
    mode: "lg-slide",
    cssEasing: "ease",
    easing: "linear",
    speed: 600,
    height: "100%",
    width: "100%",
    addClass: "",
    startClass: "lg-start-zoom",
    backdropDuration: 150,
    hideBarsDelay: 6e3,
    useLeft: !1,
    closable: !0,
    loop: !0,
    escKey: !0,
    keyPress: !0,
    controls: !0,
    slideEndAnimatoin: !0,
    hideControlOnEnd: !1,
    mousewheel: !0,
    getCaptionFromTitleOrAlt: !0,
    appendSubHtmlTo: ".lg-sub-html",
    preload: 1,
    showAfterLoad: !0,
    selector: "",
    selectWithin: "",
    nextHtml: "",
    prevHtml: "",
    index: !1,
    iframeMaxWidth: "100%",
    download: !0,
    counter: !0,
    appendCounterTo: ".lg-toolbar",
    swipeThreshold: 50,
    enableSwipe: !0,
    enableDrag: !0,
    dynamic: !1,
    dynamicEl: [],
    galleryId: 1
  };
  e.prototype.init = function () {
    var c = this;
    c.s.preload > c.$items.length && (c.s.preload = c.$items.length);
    var d = b.location.hash;
    d.indexOf("lg=" + this.s.galleryId) > 0 && (c.index = parseInt(d.split("&slide=")[1], 10), a("body").addClass("lg-from-hash"), a("body").hasClass("lg-on") || setTimeout(function () {
      c.build(c.index), a("body").addClass("lg-on");
    })), c.s.dynamic ? (c.$el.trigger("onBeforeOpen.lg"), c.index = c.s.index || 0, a("body").hasClass("lg-on") || setTimeout(function () {
      c.build(c.index), a("body").addClass("lg-on");
    })) : c.$items.on("click.lgcustom", function (b) {
      try {
        b.preventDefault(), b.preventDefault();
      } catch (d) {
        b.returnValue = !1;
      }

      c.$el.trigger("onBeforeOpen.lg"), c.index = c.s.index || c.$items.index(this), a("body").hasClass("lg-on") || (c.build(c.index), a("body").addClass("lg-on"));
    });
  }, e.prototype.build = function (b) {
    var c = this;
    c.structure(), a.each(a.fn.lightGallery.modules, function (b) {
      c.modules[b] = new a.fn.lightGallery.modules[b](c.el);
    }), c.slide(b, !1, !1), c.s.keyPress && c.keyPress(), c.$items.length > 1 && (c.arrow(), setTimeout(function () {
      c.enableDrag(), c.enableSwipe();
    }, 50), c.s.mousewheel && c.mousewheel()), c.counter(), c.closeGallery(), c.$el.trigger("onAfterOpen.lg"), c.$outer.on("mousemove.lg click.lg touchstart.lg", function () {
      c.$outer.removeClass("lg-hide-items"), clearTimeout(c.hideBartimeout), c.hideBartimeout = setTimeout(function () {
        c.$outer.addClass("lg-hide-items");
      }, c.s.hideBarsDelay);
    });
  }, e.prototype.structure = function () {
    var c,
        d = "",
        e = "",
        f = 0,
        g = "",
        h = this;

    for (a("body").append('<div class="lg-backdrop"></div>'), a(".lg-backdrop").css("transition-duration", this.s.backdropDuration + "ms"), f = 0; f < this.$items.length; f++) {
      d += '<div class="lg-item"></div>';
    }

    if (this.s.controls && this.$items.length > 1 && (e = '<div class="lg-actions"><div class="lg-prev lg-icon">' + this.s.prevHtml + '</div><div class="lg-next lg-icon">' + this.s.nextHtml + "</div></div>"), ".lg-sub-html" === this.s.appendSubHtmlTo && (g = '<div class="lg-sub-html"></div>'), c = '<div class="lg-outer ' + this.s.addClass + " " + this.s.startClass + '"><div class="lg" style="width:' + this.s.width + "; height:" + this.s.height + '"><div class="lg-inner">' + d + '</div><div class="lg-toolbar group"><span class="lg-close lg-icon"></span></div>' + e + g + "</div></div>", a("body").append(c), this.$outer = a(".lg-outer"), this.$slide = this.$outer.find(".lg-item"), this.s.useLeft ? (this.$outer.addClass("lg-use-left"), this.s.mode = "lg-slide") : this.$outer.addClass("lg-use-css3"), h.setTop(), a(b).on("resize.lg orientationchange.lg", function () {
      setTimeout(function () {
        h.setTop();
      }, 100);
    }), this.$slide.eq(this.index).addClass("lg-current"), this.doCss() ? this.$outer.addClass("lg-css3") : (this.$outer.addClass("lg-css"), this.s.speed = 0), this.$outer.addClass(this.s.mode), this.s.enableDrag && this.$items.length > 1 && this.$outer.addClass("lg-grab"), this.s.showAfterLoad && this.$outer.addClass("lg-show-after-load"), this.doCss()) {
      var i = this.$outer.find(".lg-inner");
      i.css("transition-timing-function", this.s.cssEasing), i.css("transition-duration", this.s.speed + "ms");
    }

    a(".lg-backdrop").addClass("in"), setTimeout(function () {
      h.$outer.addClass("lg-visible");
    }, this.s.backdropDuration), this.s.download && this.$outer.find(".lg-toolbar").append('<a id="lg-download" target="_blank" download class="lg-download lg-icon"></a>'), this.prevScrollTop = a(b).scrollTop();
  }, e.prototype.setTop = function () {
    if ("100%" !== this.s.height) {
      var c = a(b).height(),
          d = (c - parseInt(this.s.height, 10)) / 2,
          e = this.$outer.find(".lg");
      c >= parseInt(this.s.height, 10) ? e.css("top", d + "px") : e.css("top", "0px");
    }
  }, e.prototype.doCss = function () {
    var a = function a() {
      var a = ["transition", "MozTransition", "WebkitTransition", "OTransition", "msTransition", "KhtmlTransition"],
          b = c.documentElement,
          d = 0;

      for (d = 0; d < a.length; d++) {
        if (a[d] in b.style) return !0;
      }
    };

    return !!a();
  }, e.prototype.isVideo = function (a, b) {
    var c;
    if (c = this.s.dynamic ? this.s.dynamicEl[b].html : this.$items.eq(b).attr("data-html"), !a && c) return {
      html5: !0
    };
    var d = a.match(/\/\/(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=|embed\/)?([a-z0-9\-\_\%]+)/i),
        e = a.match(/\/\/(?:www\.)?vimeo.com\/([0-9a-z\-_]+)/i),
        f = a.match(/\/\/(?:www\.)?dai.ly\/([0-9a-z\-_]+)/i),
        g = a.match(/\/\/(?:www\.)?(?:vk\.com|vkontakte\.ru)\/(?:video_ext\.php\?)(.*)/i);
    return d ? {
      youtube: d
    } : e ? {
      vimeo: e
    } : f ? {
      dailymotion: f
    } : g ? {
      vk: g
    } : void 0;
  }, e.prototype.counter = function () {
    this.s.counter && a(this.s.appendCounterTo).append('<div id="lg-counter"><span id="lg-counter-current">' + (parseInt(this.index, 10) + 1) + '</span>/<span id="lg-counter-all">' + this.$items.length + "</span></div>");
  }, e.prototype.addHtml = function (b) {
    var c,
        d = null;
    if (this.s.dynamic ? this.s.dynamicEl[b].subHtmlUrl ? c = this.s.dynamicEl[b].subHtmlUrl : d = this.s.dynamicEl[b].subHtml : this.$items.eq(b).attr("data-sub-html-url") ? c = this.$items.eq(b).attr("data-sub-html-url") : (d = this.$items.eq(b).attr("data-sub-html"), this.s.getCaptionFromTitleOrAlt && !d && (d = this.$items.eq(b).attr("title") || this.$items.eq(b).find("img").first().attr("alt"))), !c) if ("undefined" != typeof d && null !== d) {
      var e = d.substring(0, 1);
      "." !== e && "#" !== e || (d = a(d).html());
    } else d = "";
    ".lg-sub-html" === this.s.appendSubHtmlTo ? c ? this.$outer.find(this.s.appendSubHtmlTo).load(c) : this.$outer.find(this.s.appendSubHtmlTo).html(d) : c ? this.$slide.eq(b).load(c) : this.$slide.eq(b).append(d), "undefined" != typeof d && null !== d && ("" === d ? this.$outer.find(this.s.appendSubHtmlTo).addClass("lg-empty-html") : this.$outer.find(this.s.appendSubHtmlTo).removeClass("lg-empty-html")), this.$el.trigger("onAfterAppendSubHtml.lg", [b]);
  }, e.prototype.preload = function (a) {
    var b = 1,
        c = 1;

    for (b = 1; b <= this.s.preload && !(b >= this.$items.length - a); b++) {
      this.loadContent(a + b, !1, 0);
    }

    for (c = 1; c <= this.s.preload && !(0 > a - c); c++) {
      this.loadContent(a - c, !1, 0);
    }
  }, e.prototype.loadContent = function (c, d, e) {
    var f,
        g,
        h,
        i,
        j,
        k,
        l = this,
        m = !1,
        n = function n(c) {
      for (var d = [], e = [], f = 0; f < c.length; f++) {
        var h = c[f].split(" ");
        "" === h[0] && h.splice(0, 1), e.push(h[0]), d.push(h[1]);
      }

      for (var i = a(b).width(), j = 0; j < d.length; j++) {
        if (parseInt(d[j], 10) > i) {
          g = e[j];
          break;
        }
      }
    };

    if (l.s.dynamic) {
      if (l.s.dynamicEl[c].poster && (m = !0, h = l.s.dynamicEl[c].poster), k = l.s.dynamicEl[c].html, g = l.s.dynamicEl[c].src, l.s.dynamicEl[c].responsive) {
        var o = l.s.dynamicEl[c].responsive.split(",");
        n(o);
      }

      i = l.s.dynamicEl[c].srcset, j = l.s.dynamicEl[c].sizes;
    } else {
      if (l.$items.eq(c).attr("data-poster") && (m = !0, h = l.$items.eq(c).attr("data-poster")), k = l.$items.eq(c).attr("data-html"), g = l.$items.eq(c).attr("href") || l.$items.eq(c).attr("data-src"), l.$items.eq(c).attr("data-responsive")) {
        var p = l.$items.eq(c).attr("data-responsive").split(",");
        n(p);
      }

      i = l.$items.eq(c).attr("data-srcset"), j = l.$items.eq(c).attr("data-sizes");
    }

    var q = !1;
    l.s.dynamic ? l.s.dynamicEl[c].iframe && (q = !0) : "true" === l.$items.eq(c).attr("data-iframe") && (q = !0);
    var r = l.isVideo(g, c);

    if (!l.$slide.eq(c).hasClass("lg-loaded")) {
      if (q) l.$slide.eq(c).prepend('<div class="lg-video-cont" style="max-width:' + l.s.iframeMaxWidth + '"><div class="lg-video"><iframe class="lg-object" frameborder="0" src="' + g + '"  allowfullscreen="true"></iframe></div></div>');else if (m) {
        var s = "";
        s = r && r.youtube ? "lg-has-youtube" : r && r.vimeo ? "lg-has-vimeo" : "lg-has-html5", l.$slide.eq(c).prepend('<div class="lg-video-cont ' + s + ' "><div class="lg-video"><span class="lg-video-play"></span><img class="lg-object lg-has-poster" src="' + h + '" /></div></div>');
      } else r ? (l.$slide.eq(c).prepend('<div class="lg-video-cont "><div class="lg-video"></div></div>'), l.$el.trigger("hasVideo.lg", [c, g, k])) : l.$slide.eq(c).prepend('<div class="lg-img-wrap"><img class="lg-object lg-image" src="' + g + '" /></div>');

      if (l.$el.trigger("onAferAppendSlide.lg", [c]), f = l.$slide.eq(c).find(".lg-object"), j && f.attr("sizes", j), i) {
        f.attr("srcset", i);

        try {
          picturefill({
            elements: [f[0]]
          });
        } catch (t) {
          console.error("Make sure you have included Picturefill version 2");
        }
      }

      ".lg-sub-html" !== this.s.appendSubHtmlTo && l.addHtml(c), l.$slide.eq(c).addClass("lg-loaded");
    }

    l.$slide.eq(c).find(".lg-object").on("load.lg error.lg", function () {
      var b = 0;
      e && !a("body").hasClass("lg-from-hash") && (b = e), setTimeout(function () {
        l.$slide.eq(c).addClass("lg-complete"), l.$el.trigger("onSlideItemLoad.lg", [c, e || 0]);
      }, b);
    }), r && r.html5 && !m && l.$slide.eq(c).addClass("lg-complete"), d === !0 && (l.$slide.eq(c).hasClass("lg-complete") ? l.preload(c) : l.$slide.eq(c).find(".lg-object").on("load.lg error.lg", function () {
      l.preload(c);
    }));
  }, e.prototype.slide = function (b, c, d) {
    var e = this.$outer.find(".lg-current").index(),
        f = this;

    if (!f.lGalleryOn || e !== b) {
      var g = this.$slide.length,
          h = f.lGalleryOn ? this.s.speed : 0,
          i = !1,
          j = !1;

      if (!f.lgBusy) {
        if (this.s.download) {
          var k;
          k = f.s.dynamic ? f.s.dynamicEl[b].downloadUrl !== !1 && (f.s.dynamicEl[b].downloadUrl || f.s.dynamicEl[b].src) : "false" !== f.$items.eq(b).attr("data-download-url") && (f.$items.eq(b).attr("data-download-url") || f.$items.eq(b).attr("href") || f.$items.eq(b).attr("data-src")), k ? (a("#lg-download").attr("href", k), f.$outer.removeClass("lg-hide-download")) : f.$outer.addClass("lg-hide-download");
        }

        if (this.$el.trigger("onBeforeSlide.lg", [e, b, c, d]), f.lgBusy = !0, clearTimeout(f.hideBartimeout), ".lg-sub-html" === this.s.appendSubHtmlTo && setTimeout(function () {
          f.addHtml(b);
        }, h), this.arrowDisable(b), c) {
          var l = b - 1,
              m = b + 1;
          0 === b && e === g - 1 ? (m = 0, l = g - 1) : b === g - 1 && 0 === e && (m = 0, l = g - 1), this.$slide.removeClass("lg-prev-slide lg-current lg-next-slide"), f.$slide.eq(l).addClass("lg-prev-slide"), f.$slide.eq(m).addClass("lg-next-slide"), f.$slide.eq(b).addClass("lg-current");
        } else f.$outer.addClass("lg-no-trans"), this.$slide.removeClass("lg-prev-slide lg-next-slide"), e > b ? (j = !0, 0 !== b || e !== g - 1 || d || (j = !1, i = !0)) : b > e && (i = !0, b !== g - 1 || 0 !== e || d || (j = !0, i = !1)), j ? (this.$slide.eq(b).addClass("lg-prev-slide"), this.$slide.eq(e).addClass("lg-next-slide")) : i && (this.$slide.eq(b).addClass("lg-next-slide"), this.$slide.eq(e).addClass("lg-prev-slide")), setTimeout(function () {
          f.$slide.removeClass("lg-current"), f.$slide.eq(b).addClass("lg-current"), f.$outer.removeClass("lg-no-trans");
        }, 50);

        f.lGalleryOn ? (setTimeout(function () {
          f.loadContent(b, !0, 0);
        }, this.s.speed + 50), setTimeout(function () {
          f.lgBusy = !1, f.$el.trigger("onAfterSlide.lg", [e, b, c, d]);
        }, this.s.speed)) : (f.loadContent(b, !0, f.s.backdropDuration), f.lgBusy = !1, f.$el.trigger("onAfterSlide.lg", [e, b, c, d])), f.lGalleryOn = !0, this.s.counter && a("#lg-counter-current").text(b + 1);
      }
    }
  }, e.prototype.goToNextSlide = function (a) {
    var b = this;
    b.lgBusy || (b.index + 1 < b.$slide.length ? (b.index++, b.$el.trigger("onBeforeNextSlide.lg", [b.index]), b.slide(b.index, a, !1)) : b.s.loop ? (b.index = 0, b.$el.trigger("onBeforeNextSlide.lg", [b.index]), b.slide(b.index, a, !1)) : b.s.slideEndAnimatoin && (b.$outer.addClass("lg-right-end"), setTimeout(function () {
      b.$outer.removeClass("lg-right-end");
    }, 400)));
  }, e.prototype.goToPrevSlide = function (a) {
    var b = this;
    b.lgBusy || (b.index > 0 ? (b.index--, b.$el.trigger("onBeforePrevSlide.lg", [b.index, a]), b.slide(b.index, a, !1)) : b.s.loop ? (b.index = b.$items.length - 1, b.$el.trigger("onBeforePrevSlide.lg", [b.index, a]), b.slide(b.index, a, !1)) : b.s.slideEndAnimatoin && (b.$outer.addClass("lg-left-end"), setTimeout(function () {
      b.$outer.removeClass("lg-left-end");
    }, 400)));
  }, e.prototype.keyPress = function () {
    var c = this;
    this.$items.length > 1 && a(b).on("keyup.lg", function (a) {
      c.$items.length > 1 && (37 === a.keyCode && (a.preventDefault(), c.goToPrevSlide()), 39 === a.keyCode && (a.preventDefault(), c.goToNextSlide()));
    }), a(b).on("keydown.lg", function (a) {
      c.s.escKey === !0 && 27 === a.keyCode && (a.preventDefault(), c.$outer.hasClass("lg-thumb-open") ? c.$outer.removeClass("lg-thumb-open") : c.destroy());
    });
  }, e.prototype.arrow = function () {
    var a = this;
    this.$outer.find(".lg-prev").on("click.lg", function () {
      a.goToPrevSlide();
    }), this.$outer.find(".lg-next").on("click.lg", function () {
      a.goToNextSlide();
    });
  }, e.prototype.arrowDisable = function (a) {
    !this.s.loop && this.s.hideControlOnEnd && (a + 1 < this.$slide.length ? this.$outer.find(".lg-next").removeAttr("disabled").removeClass("disabled") : this.$outer.find(".lg-next").attr("disabled", "disabled").addClass("disabled"), a > 0 ? this.$outer.find(".lg-prev").removeAttr("disabled").removeClass("disabled") : this.$outer.find(".lg-prev").attr("disabled", "disabled").addClass("disabled"));
  }, e.prototype.setTranslate = function (a, b, c) {
    this.s.useLeft ? a.css("left", b) : a.css({
      transform: "translate3d(" + b + "px, " + c + "px, 0px)"
    });
  }, e.prototype.touchMove = function (b, c) {
    var d = c - b;
    Math.abs(d) > 15 && (this.$outer.addClass("lg-dragging"), this.setTranslate(this.$slide.eq(this.index), d, 0), this.setTranslate(a(".lg-prev-slide"), -this.$slide.eq(this.index).width() + d, 0), this.setTranslate(a(".lg-next-slide"), this.$slide.eq(this.index).width() + d, 0));
  }, e.prototype.touchEnd = function (a) {
    var b = this;
    "lg-slide" !== b.s.mode && b.$outer.addClass("lg-slide"), this.$slide.not(".lg-current, .lg-prev-slide, .lg-next-slide").css("opacity", "0"), setTimeout(function () {
      b.$outer.removeClass("lg-dragging"), 0 > a && Math.abs(a) > b.s.swipeThreshold ? b.goToNextSlide(!0) : a > 0 && Math.abs(a) > b.s.swipeThreshold ? b.goToPrevSlide(!0) : Math.abs(a) < 5 && b.$el.trigger("onSlideClick.lg"), b.$slide.removeAttr("style");
    }), setTimeout(function () {
      b.$outer.hasClass("lg-dragging") || "lg-slide" === b.s.mode || b.$outer.removeClass("lg-slide");
    }, b.s.speed + 100);
  }, e.prototype.enableSwipe = function () {
    var a = this,
        b = 0,
        c = 0,
        d = !1;
    a.s.enableSwipe && a.isTouch && a.doCss() && (a.$slide.on("touchstart.lg", function (c) {
      a.$outer.hasClass("lg-zoomed") || a.lgBusy || (c.preventDefault(), a.manageSwipeClass(), b = c.originalEvent.targetTouches[0].pageX);
    }), a.$slide.on("touchmove.lg", function (e) {
      a.$outer.hasClass("lg-zoomed") || (e.preventDefault(), c = e.originalEvent.targetTouches[0].pageX, a.touchMove(b, c), d = !0);
    }), a.$slide.on("touchend.lg", function () {
      a.$outer.hasClass("lg-zoomed") || (d ? (d = !1, a.touchEnd(c - b)) : a.$el.trigger("onSlideClick.lg"));
    }));
  }, e.prototype.enableDrag = function () {
    var c = this,
        d = 0,
        e = 0,
        f = !1,
        g = !1;
    c.s.enableDrag && !c.isTouch && c.doCss() && (c.$slide.on("mousedown.lg", function (b) {
      c.$outer.hasClass("lg-zoomed") || (a(b.target).hasClass("lg-object") || a(b.target).hasClass("lg-video-play")) && (b.preventDefault(), c.lgBusy || (c.manageSwipeClass(), d = b.pageX, f = !0, c.$outer.scrollLeft += 1, c.$outer.scrollLeft -= 1, c.$outer.removeClass("lg-grab").addClass("lg-grabbing"), c.$el.trigger("onDragstart.lg")));
    }), a(b).on("mousemove.lg", function (a) {
      f && (g = !0, e = a.pageX, c.touchMove(d, e), c.$el.trigger("onDragmove.lg"));
    }), a(b).on("mouseup.lg", function (b) {
      g ? (g = !1, c.touchEnd(e - d), c.$el.trigger("onDragend.lg")) : (a(b.target).hasClass("lg-object") || a(b.target).hasClass("lg-video-play")) && c.$el.trigger("onSlideClick.lg"), f && (f = !1, c.$outer.removeClass("lg-grabbing").addClass("lg-grab"));
    }));
  }, e.prototype.manageSwipeClass = function () {
    var a = this.index + 1,
        b = this.index - 1,
        c = this.$slide.length;
    this.s.loop && (0 === this.index ? b = c - 1 : this.index === c - 1 && (a = 0)), this.$slide.removeClass("lg-next-slide lg-prev-slide"), b > -1 && this.$slide.eq(b).addClass("lg-prev-slide"), this.$slide.eq(a).addClass("lg-next-slide");
  }, e.prototype.mousewheel = function () {
    var a = this;
    a.$outer.on("mousewheel.lg", function (b) {
      b.deltaY && (b.deltaY > 0 ? a.goToPrevSlide() : a.goToNextSlide(), b.preventDefault());
    });
  }, e.prototype.closeGallery = function () {
    var b = this,
        c = !1;
    this.$outer.find(".lg-close").on("click.lg", function () {
      b.destroy();
    }), b.s.closable && (b.$outer.on("mousedown.lg", function (b) {
      c = !!(a(b.target).is(".lg-outer") || a(b.target).is(".lg-item ") || a(b.target).is(".lg-img-wrap"));
    }), b.$outer.on("mouseup.lg", function (d) {
      (a(d.target).is(".lg-outer") || a(d.target).is(".lg-item ") || a(d.target).is(".lg-img-wrap") && c) && (b.$outer.hasClass("lg-dragging") || b.destroy());
    }));
  }, e.prototype.destroy = function (c) {
    var d = this;
    c || d.$el.trigger("onBeforeClose.lg"), a(b).scrollTop(d.prevScrollTop), c && (d.s.dynamic || this.$items.off("click.lg click.lgcustom"), a.removeData(d.el, "lightGallery")), this.$el.off(".lg.tm"), a.each(a.fn.lightGallery.modules, function (a) {
      d.modules[a] && d.modules[a].destroy();
    }), this.lGalleryOn = !1, clearTimeout(d.hideBartimeout), this.hideBartimeout = !1, a(b).off(".lg"), a("body").removeClass("lg-on lg-from-hash"), d.$outer && d.$outer.removeClass("lg-visible"), a(".lg-backdrop").removeClass("in"), setTimeout(function () {
      d.$outer && d.$outer.remove(), a(".lg-backdrop").remove(), c || d.$el.trigger("onCloseAfter.lg");
    }, d.s.backdropDuration + 50);
  }, a.fn.lightGallery = function (b) {
    return this.each(function () {
      if (a.data(this, "lightGallery")) try {
        a(this).data("lightGallery").init();
      } catch (c) {
        console.error("lightGallery has not initiated properly");
      } else a.data(this, "lightGallery", new e(this, b));
    });
  }, a.fn.lightGallery.modules = {};
}(jQuery, window, document);
;
/*! lightgallery - v1.2.19 - 2016-05-17
* http://sachinchoolur.github.io/lightGallery/
* Copyright (c) 2016 Sachin N; Licensed Apache 2.0 */

!function (a, b, c, d) {
  "use strict";

  var e = {
    videoMaxWidth: "1140px",
    youtubePlayerParams: !1,
    vimeoPlayerParams: !1,
    dailymotionPlayerParams: !1,
    vkPlayerParams: !1,
    videojs: !1,
    videojsOptions: {}
  },
      f = function f(b) {
    return this.core = a(b).data("lightGallery"), this.$el = a(b), this.core.s = a.extend({}, e, this.core.s), this.videoLoaded = !1, this.init(), this;
  };

  f.prototype.init = function () {
    var b = this;
    b.core.$el.on("hasVideo.lg.tm", function (a, c, d, e) {
      if (b.core.$slide.eq(c).find(".lg-video").append(b.loadVideo(d, "lg-object", !0, c, e)), e) if (b.core.s.videojs) try {
        videojs(b.core.$slide.eq(c).find(".lg-html5").get(0), b.core.s.videojsOptions, function () {
          b.videoLoaded || this.play();
        });
      } catch (f) {
        console.error("Make sure you have included videojs");
      } else b.core.$slide.eq(c).find(".lg-html5").get(0).play();
    }), b.core.$el.on("onAferAppendSlide.lg.tm", function (a, c) {
      b.core.$slide.eq(c).find(".lg-video-cont").css("max-width", b.core.s.videoMaxWidth), b.videoLoaded = !0;
    });

    var c = function c(a) {
      if (a.find(".lg-object").hasClass("lg-has-poster") && a.find(".lg-object").is(":visible")) if (a.hasClass("lg-has-video")) {
        var c = a.find(".lg-youtube").get(0),
            d = a.find(".lg-vimeo").get(0),
            e = a.find(".lg-dailymotion").get(0),
            f = a.find(".lg-html5").get(0);
        if (c) c.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', "*");else if (d) try {
          $f(d).api("play");
        } catch (g) {
          console.error("Make sure you have included froogaloop2 js");
        } else if (e) e.contentWindow.postMessage("play", "*");else if (f) if (b.core.s.videojs) try {
          videojs(f).play();
        } catch (g) {
          console.error("Make sure you have included videojs");
        } else f.play();
        a.addClass("lg-video-playing");
      } else {
        a.addClass("lg-video-playing lg-has-video");

        var h,
            i,
            j = function j(c, d) {
          if (a.find(".lg-video").append(b.loadVideo(c, "", !1, b.core.index, d)), d) if (b.core.s.videojs) try {
            videojs(b.core.$slide.eq(b.core.index).find(".lg-html5").get(0), b.core.s.videojsOptions, function () {
              this.play();
            });
          } catch (e) {
            console.error("Make sure you have included videojs");
          } else b.core.$slide.eq(b.core.index).find(".lg-html5").get(0).play();
        };

        b.core.s.dynamic ? (h = b.core.s.dynamicEl[b.core.index].src, i = b.core.s.dynamicEl[b.core.index].html, j(h, i)) : (h = b.core.$items.eq(b.core.index).attr("href") || b.core.$items.eq(b.core.index).attr("data-src"), i = b.core.$items.eq(b.core.index).attr("data-html"), j(h, i));
        var k = a.find(".lg-object");
        a.find(".lg-video").append(k), a.find(".lg-video-object").hasClass("lg-html5") || (a.removeClass("lg-complete"), a.find(".lg-video-object").on("load.lg error.lg", function () {
          a.addClass("lg-complete");
        }));
      }
    };

    b.core.doCss() && b.core.$items.length > 1 && (b.core.s.enableSwipe && b.core.isTouch || b.core.s.enableDrag && !b.core.isTouch) ? b.core.$el.on("onSlideClick.lg.tm", function () {
      var a = b.core.$slide.eq(b.core.index);
      c(a);
    }) : b.core.$slide.on("click.lg", function () {
      c(a(this));
    }), b.core.$el.on("onBeforeSlide.lg.tm", function (c, d, e) {
      var f = b.core.$slide.eq(d),
          g = f.find(".lg-youtube").get(0),
          h = f.find(".lg-vimeo").get(0),
          i = f.find(".lg-dailymotion").get(0),
          j = f.find(".lg-vk").get(0),
          k = f.find(".lg-html5").get(0);
      if (g) g.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', "*");else if (h) try {
        $f(h).api("pause");
      } catch (l) {
        console.error("Make sure you have included froogaloop2 js");
      } else if (i) i.contentWindow.postMessage("pause", "*");else if (k) if (b.core.s.videojs) try {
        videojs(k).pause();
      } catch (l) {
        console.error("Make sure you have included videojs");
      } else k.pause();
      j && a(j).attr("src", a(j).attr("src").replace("&autoplay", "&noplay"));
      var m;
      m = b.core.s.dynamic ? b.core.s.dynamicEl[e].src : b.core.$items.eq(e).attr("href") || b.core.$items.eq(e).attr("data-src");
      var n = b.core.isVideo(m, e) || {};
      (n.youtube || n.vimeo || n.dailymotion || n.vk) && b.core.$outer.addClass("lg-hide-download");
    }), b.core.$el.on("onAfterSlide.lg.tm", function (a, c) {
      b.core.$slide.eq(c).removeClass("lg-video-playing");
    });
  }, f.prototype.loadVideo = function (b, c, d, e, f) {
    var g = "",
        h = 1,
        i = "",
        j = this.core.isVideo(b, e) || {};
    if (d && (h = this.videoLoaded ? 0 : 1), j.youtube) i = "?wmode=opaque&autoplay=" + h + "&enablejsapi=1", this.core.s.youtubePlayerParams && (i = i + "&" + a.param(this.core.s.youtubePlayerParams)), g = '<iframe class="lg-video-object lg-youtube ' + c + '" width="560" height="315" src="//www.youtube.com/embed/' + j.youtube[1] + i + '" frameborder="0" allowfullscreen></iframe>';else if (j.vimeo) i = "?autoplay=" + h + "&api=1", this.core.s.vimeoPlayerParams && (i = i + "&" + a.param(this.core.s.vimeoPlayerParams)), g = '<iframe class="lg-video-object lg-vimeo ' + c + '" width="560" height="315"  src="//player.vimeo.com/video/' + j.vimeo[1] + i + '" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';else if (j.dailymotion) i = "?wmode=opaque&autoplay=" + h + "&api=postMessage", this.core.s.dailymotionPlayerParams && (i = i + "&" + a.param(this.core.s.dailymotionPlayerParams)), g = '<iframe class="lg-video-object lg-dailymotion ' + c + '" width="560" height="315" src="//www.dailymotion.com/embed/video/' + j.dailymotion[1] + i + '" frameborder="0" allowfullscreen></iframe>';else if (j.html5) {
      var k = f.substring(0, 1);
      "." !== k && "#" !== k || (f = a(f).html()), g = f;
    } else j.vk && (i = "&autoplay=" + h, this.core.s.vkPlayerParams && (i = i + "&" + a.param(this.core.s.vkPlayerParams)), g = '<iframe class="lg-video-object lg-vk ' + c + '" width="560" height="315" src="http://vk.com/video_ext.php?' + j.vk[1] + i + '" frameborder="0" allowfullscreen></iframe>');
    return g;
  }, f.prototype.destroy = function () {
    this.videoLoaded = !1;
  }, a.fn.lightGallery.modules.video = f;
}(jQuery, window, document);
;
/*! lg-zoom - v1.1.0 - 2017-08-08
* http://sachinchoolur.github.io/lightGallery
* Copyright (c) 2017 Sachin N; Licensed GPLv3 */

!function (a, b) {
  "function" == typeof define && define.amd ? define(["jquery"], function (a) {
    return b(a);
  }) : "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) ? module.exports = b(require("jquery")) : b(jQuery);
}(void 0, function (a) {
  !function () {
    "use strict";

    var b = function b() {
      var a = !1,
          b = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
      return b && parseInt(b[2], 10) < 54 && (a = !0), a;
    },
        c = {
      scale: 1,
      zoom: !0,
      actualSize: !0,
      enableZoomAfter: 300,
      useLeftForZoom: b()
    },
        d = function d(b) {
      return this.core = a(b).data("lightGallery"), this.core.s = a.extend({}, c, this.core.s), this.core.s.zoom && this.core.doCss() && (this.init(), this.zoomabletimeout = !1, this.pageX = a(window).width() / 2, this.pageY = a(window).height() / 2 + a(window).scrollTop()), this;
    };

    d.prototype.init = function () {
      var b = this,
          c = '<span id="lg-zoom-in" class="lg-icon"></span><span id="lg-zoom-out" class="lg-icon"></span>';
      b.core.s.actualSize && (c += '<span id="lg-actual-size" class="lg-icon"></span>'), b.core.s.useLeftForZoom ? b.core.$outer.addClass("lg-use-left-for-zoom") : b.core.$outer.addClass("lg-use-transition-for-zoom"), this.core.$outer.find(".lg-toolbar").append(c), b.core.$el.on("onSlideItemLoad.lg.tm.zoom", function (c, d, e) {
        var f = b.core.s.enableZoomAfter + e;
        a("body").hasClass("lg-from-hash") && e ? f = 0 : a("body").removeClass("lg-from-hash"), b.zoomabletimeout = setTimeout(function () {
          b.core.$slide.eq(d).addClass("lg-zoomable");
        }, f + 30);
      });

      var d = 1,
          e = function e(c) {
        var d,
            e,
            f = b.core.$outer.find(".lg-current .lg-image"),
            g = (a(window).width() - f.prop("offsetWidth")) / 2,
            h = (a(window).height() - f.prop("offsetHeight")) / 2 + a(window).scrollTop();
        d = b.pageX - g, e = b.pageY - h;
        var i = (c - 1) * d,
            j = (c - 1) * e;
        f.css("transform", "scale3d(" + c + ", " + c + ", 1)").attr("data-scale", c), b.core.s.useLeftForZoom ? f.parent().css({
          left: -i + "px",
          top: -j + "px"
        }).attr("data-x", i).attr("data-y", j) : f.parent().css("transform", "translate3d(-" + i + "px, -" + j + "px, 0)").attr("data-x", i).attr("data-y", j);
      },
          f = function f() {
        d > 1 ? b.core.$outer.addClass("lg-zoomed") : b.resetZoom(), d < 1 && (d = 1), e(d);
      },
          g = function g(c, e, _g, h) {
        var i,
            j = e.prop("offsetWidth");
        i = b.core.s.dynamic ? b.core.s.dynamicEl[_g].width || e[0].naturalWidth || j : b.core.$items.eq(_g).attr("data-width") || e[0].naturalWidth || j;
        var k;
        b.core.$outer.hasClass("lg-zoomed") ? d = 1 : i > j && (k = i / j, d = k || 2), h ? (b.pageX = a(window).width() / 2, b.pageY = a(window).height() / 2 + a(window).scrollTop()) : (b.pageX = c.pageX || c.originalEvent.targetTouches[0].pageX, b.pageY = c.pageY || c.originalEvent.targetTouches[0].pageY), f(), setTimeout(function () {
          b.core.$outer.removeClass("lg-grabbing").addClass("lg-grab");
        }, 10);
      },
          h = !1;

      b.core.$el.on("onAferAppendSlide.lg.tm.zoom", function (a, c) {
        var d = b.core.$slide.eq(c).find(".lg-image");
        d.on("dblclick", function (a) {
          g(a, d, c);
        }), d.on("touchstart", function (a) {
          h ? (clearTimeout(h), h = null, g(a, d, c)) : h = setTimeout(function () {
            h = null;
          }, 300), a.preventDefault();
        });
      }), a(window).on("resize.lg.zoom scroll.lg.zoom orientationchange.lg.zoom", function () {
        b.pageX = a(window).width() / 2, b.pageY = a(window).height() / 2 + a(window).scrollTop(), e(d);
      }), a("#lg-zoom-out").on("click.lg", function () {
        b.core.$outer.find(".lg-current .lg-image").length && (d -= b.core.s.scale, f());
      }), a("#lg-zoom-in").on("click.lg", function () {
        b.core.$outer.find(".lg-current .lg-image").length && (d += b.core.s.scale, f());
      }), a("#lg-actual-size").on("click.lg", function (a) {
        g(a, b.core.$slide.eq(b.core.index).find(".lg-image"), b.core.index, !0);
      }), b.core.$el.on("onBeforeSlide.lg.tm", function () {
        d = 1, b.resetZoom();
      }), b.zoomDrag(), b.zoomSwipe();
    }, d.prototype.resetZoom = function () {
      this.core.$outer.removeClass("lg-zoomed"), this.core.$slide.find(".lg-img-wrap").removeAttr("style data-x data-y"), this.core.$slide.find(".lg-image").removeAttr("style data-scale"), this.pageX = a(window).width() / 2, this.pageY = a(window).height() / 2 + a(window).scrollTop();
    }, d.prototype.zoomSwipe = function () {
      var a = this,
          b = {},
          c = {},
          d = !1,
          e = !1,
          f = !1;
      a.core.$slide.on("touchstart.lg", function (c) {
        if (a.core.$outer.hasClass("lg-zoomed")) {
          var d = a.core.$slide.eq(a.core.index).find(".lg-object");
          f = d.prop("offsetHeight") * d.attr("data-scale") > a.core.$outer.find(".lg").height(), e = d.prop("offsetWidth") * d.attr("data-scale") > a.core.$outer.find(".lg").width(), (e || f) && (c.preventDefault(), b = {
            x: c.originalEvent.targetTouches[0].pageX,
            y: c.originalEvent.targetTouches[0].pageY
          });
        }
      }), a.core.$slide.on("touchmove.lg", function (g) {
        if (a.core.$outer.hasClass("lg-zoomed")) {
          var h,
              i,
              j = a.core.$slide.eq(a.core.index).find(".lg-img-wrap");
          g.preventDefault(), d = !0, c = {
            x: g.originalEvent.targetTouches[0].pageX,
            y: g.originalEvent.targetTouches[0].pageY
          }, a.core.$outer.addClass("lg-zoom-dragging"), i = f ? -Math.abs(j.attr("data-y")) + (c.y - b.y) : -Math.abs(j.attr("data-y")), h = e ? -Math.abs(j.attr("data-x")) + (c.x - b.x) : -Math.abs(j.attr("data-x")), (Math.abs(c.x - b.x) > 15 || Math.abs(c.y - b.y) > 15) && (a.core.s.useLeftForZoom ? j.css({
            left: h + "px",
            top: i + "px"
          }) : j.css("transform", "translate3d(" + h + "px, " + i + "px, 0)"));
        }
      }), a.core.$slide.on("touchend.lg", function () {
        a.core.$outer.hasClass("lg-zoomed") && d && (d = !1, a.core.$outer.removeClass("lg-zoom-dragging"), a.touchendZoom(b, c, e, f));
      });
    }, d.prototype.zoomDrag = function () {
      var b = this,
          c = {},
          d = {},
          e = !1,
          f = !1,
          g = !1,
          h = !1;
      b.core.$slide.on("mousedown.lg.zoom", function (d) {
        var f = b.core.$slide.eq(b.core.index).find(".lg-object");
        h = f.prop("offsetHeight") * f.attr("data-scale") > b.core.$outer.find(".lg").height(), g = f.prop("offsetWidth") * f.attr("data-scale") > b.core.$outer.find(".lg").width(), b.core.$outer.hasClass("lg-zoomed") && a(d.target).hasClass("lg-object") && (g || h) && (d.preventDefault(), c = {
          x: d.pageX,
          y: d.pageY
        }, e = !0, b.core.$outer.scrollLeft += 1, b.core.$outer.scrollLeft -= 1, b.core.$outer.removeClass("lg-grab").addClass("lg-grabbing"));
      }), a(window).on("mousemove.lg.zoom", function (a) {
        if (e) {
          var i,
              j,
              k = b.core.$slide.eq(b.core.index).find(".lg-img-wrap");
          f = !0, d = {
            x: a.pageX,
            y: a.pageY
          }, b.core.$outer.addClass("lg-zoom-dragging"), j = h ? -Math.abs(k.attr("data-y")) + (d.y - c.y) : -Math.abs(k.attr("data-y")), i = g ? -Math.abs(k.attr("data-x")) + (d.x - c.x) : -Math.abs(k.attr("data-x")), b.core.s.useLeftForZoom ? k.css({
            left: i + "px",
            top: j + "px"
          }) : k.css("transform", "translate3d(" + i + "px, " + j + "px, 0)");
        }
      }), a(window).on("mouseup.lg.zoom", function (a) {
        e && (e = !1, b.core.$outer.removeClass("lg-zoom-dragging"), !f || c.x === d.x && c.y === d.y || (d = {
          x: a.pageX,
          y: a.pageY
        }, b.touchendZoom(c, d, g, h)), f = !1), b.core.$outer.removeClass("lg-grabbing").addClass("lg-grab");
      });
    }, d.prototype.touchendZoom = function (a, b, c, d) {
      var e = this,
          f = e.core.$slide.eq(e.core.index).find(".lg-img-wrap"),
          g = e.core.$slide.eq(e.core.index).find(".lg-object"),
          h = -Math.abs(f.attr("data-x")) + (b.x - a.x),
          i = -Math.abs(f.attr("data-y")) + (b.y - a.y),
          j = (e.core.$outer.find(".lg").height() - g.prop("offsetHeight")) / 2,
          k = Math.abs(g.prop("offsetHeight") * Math.abs(g.attr("data-scale")) - e.core.$outer.find(".lg").height() + j),
          l = (e.core.$outer.find(".lg").width() - g.prop("offsetWidth")) / 2,
          m = Math.abs(g.prop("offsetWidth") * Math.abs(g.attr("data-scale")) - e.core.$outer.find(".lg").width() + l);
      (Math.abs(b.x - a.x) > 15 || Math.abs(b.y - a.y) > 15) && (d && (i <= -k ? i = -k : i >= -j && (i = -j)), c && (h <= -m ? h = -m : h >= -l && (h = -l)), d ? f.attr("data-y", Math.abs(i)) : i = -Math.abs(f.attr("data-y")), c ? f.attr("data-x", Math.abs(h)) : h = -Math.abs(f.attr("data-x")), e.core.s.useLeftForZoom ? f.css({
        left: h + "px",
        top: i + "px"
      }) : f.css("transform", "translate3d(" + h + "px, " + i + "px, 0)"));
    }, d.prototype.destroy = function () {
      var b = this;
      b.core.$el.off(".lg.zoom"), a(window).off(".lg.zoom"), b.core.$slide.off(".lg.zoom"), b.core.$el.off(".lg.tm.zoom"), b.resetZoom(), clearTimeout(b.zoomabletimeout), b.zoomabletimeout = !1;
    }, a.fn.lightGallery.modules.zoom = d;
  }();
});
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*console*/
window.log = function f() {
  log.history = log.history || [];
  log.history.push(arguments);

  if (this.console) {
    var args = arguments,
        newarr;
    args.callee = args.callee.caller;
    newarr = [].slice.call(args);
    if (_typeof(console.log) === 'object') log.apply.call(console.log, console, newarr);else console.log.apply(console, newarr);
  }
};

(function (a) {
  function b() {}

  for (var c = "assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","), d; !!(d = c.pop());) {
    a[d] = a[d] || b;
  }
})(function () {
  try {
    console.log();
    return window.console;
  } catch (a) {
    return window.console = {};
  }
}());

;
/*strip_tags*/
// allow can be a string like '<b><i>'

function strip_tags(str, allow) {
  // making sure the allow arg is a string containing only tags in lowercase (<a><b><c>)
  allow = (((allow || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');
  var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
  var commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
  return str.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
    return allow.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
  });
}

;
;

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}