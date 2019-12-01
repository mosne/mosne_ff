"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*! lazysizes - v4.1.6 */
!function (a, b) {
  var c = b(a, a.document);
  a.lazySizes = c, "object" == (typeof module === "undefined" ? "undefined" : _typeof(module)) && module.exports && (module.exports = c);
}(window, function (a, b) {
  "use strict";

  if (b.getElementsByClassName) {
    var c,
        d,
        e = b.documentElement,
        f = a.Date,
        g = a.HTMLPictureElement,
        h = "addEventListener",
        i = "getAttribute",
        j = a[h],
        k = a.setTimeout,
        l = a.requestAnimationFrame || k,
        m = a.requestIdleCallback,
        n = /^picture$/i,
        o = ["load", "error", "lazyincluded", "_lazyloaded"],
        p = {},
        q = Array.prototype.forEach,
        r = function r(a, b) {
      return p[b] || (p[b] = new RegExp("(\\s|^)" + b + "(\\s|$)")), p[b].test(a[i]("class") || "") && p[b];
    },
        s = function s(a, b) {
      r(a, b) || a.setAttribute("class", (a[i]("class") || "").trim() + " " + b);
    },
        t = function t(a, b) {
      var c;
      (c = r(a, b)) && a.setAttribute("class", (a[i]("class") || "").replace(c, " "));
    },
        u = function u(a, b, c) {
      var d = c ? h : "removeEventListener";
      c && u(a, b), o.forEach(function (c) {
        a[d](c, b);
      });
    },
        v = function v(a, d, e, f, g) {
      var h = b.createEvent("Event");
      return e || (e = {}), e.instance = c, h.initEvent(d, !f, !g), h.detail = e, a.dispatchEvent(h), h;
    },
        w = function w(b, c) {
      var e;
      !g && (e = a.picturefill || d.pf) ? (c && c.src && !b[i]("srcset") && b.setAttribute("srcset", c.src), e({
        reevaluate: !0,
        elements: [b]
      })) : c && c.src && (b.src = c.src);
    },
        x = function x(a, b) {
      return (getComputedStyle(a, null) || {})[b];
    },
        y = function y(a, b, c) {
      for (c = c || a.offsetWidth; c < d.minSize && b && !a._lazysizesWidth;) {
        c = b.offsetWidth, b = b.parentNode;
      }

      return c;
    },
        z = function () {
      var a,
          c,
          d = [],
          e = [],
          f = d,
          g = function g() {
        var b = f;

        for (f = d.length ? e : d, a = !0, c = !1; b.length;) {
          b.shift()();
        }

        a = !1;
      },
          h = function h(d, e) {
        a && !e ? d.apply(this, arguments) : (f.push(d), c || (c = !0, (b.hidden ? k : l)(g)));
      };

      return h._lsFlush = g, h;
    }(),
        A = function A(a, b) {
      return b ? function () {
        z(a);
      } : function () {
        var b = this,
            c = arguments;
        z(function () {
          a.apply(b, c);
        });
      };
    },
        B = function B(a) {
      var b,
          c = 0,
          e = d.throttleDelay,
          g = d.ricTimeout,
          h = function h() {
        b = !1, c = f.now(), a();
      },
          i = m && g > 49 ? function () {
        m(h, {
          timeout: g
        }), g !== d.ricTimeout && (g = d.ricTimeout);
      } : A(function () {
        k(h);
      }, !0);

      return function (a) {
        var d;
        (a = !0 === a) && (g = 33), b || (b = !0, d = e - (f.now() - c), d < 0 && (d = 0), a || d < 9 ? i() : k(i, d));
      };
    },
        C = function C(a) {
      var b,
          c,
          d = 99,
          e = function e() {
        b = null, a();
      },
          g = function g() {
        var a = f.now() - c;
        a < d ? k(g, d - a) : (m || e)(e);
      };

      return function () {
        c = f.now(), b || (b = k(g, d));
      };
    };

    !function () {
      var b,
          c = {
        lazyClass: "lazyload",
        loadedClass: "lazyloaded",
        loadingClass: "lazyloading",
        preloadClass: "lazypreload",
        errorClass: "lazyerror",
        autosizesClass: "lazyautosizes",
        srcAttr: "data-src",
        srcsetAttr: "data-srcset",
        sizesAttr: "data-sizes",
        minSize: 40,
        customMedia: {},
        init: !0,
        expFactor: 1.5,
        hFac: .8,
        loadMode: 2,
        loadHidden: !0,
        ricTimeout: 0,
        throttleDelay: 125
      };
      d = a.lazySizesConfig || a.lazysizesConfig || {};

      for (b in c) {
        b in d || (d[b] = c[b]);
      }

      a.lazySizesConfig = d, k(function () {
        d.init && F();
      });
    }();

    var D = function () {
      var g,
          l,
          m,
          o,
          p,
          y,
          D,
          F,
          G,
          H,
          I,
          J,
          K = /^img$/i,
          L = /^iframe$/i,
          M = "onscroll" in a && !/(gle|ing)bot/.test(navigator.userAgent),
          N = 0,
          O = 0,
          P = 0,
          Q = -1,
          R = function R(a) {
        P--, a && a.target && u(a.target, R), (!a || P < 0 || !a.target) && (P = 0);
      },
          S = function S(a) {
        return null == J && (J = "hidden" == x(b.body, "visibility")), J || "hidden" != x(a.parentNode, "visibility") && "hidden" != x(a, "visibility");
      },
          T = function T(a, c) {
        var d,
            f = a,
            g = S(a);

        for (F -= c, I += c, G -= c, H += c; g && (f = f.offsetParent) && f != b.body && f != e;) {
          (g = (x(f, "opacity") || 1) > 0) && "visible" != x(f, "overflow") && (d = f.getBoundingClientRect(), g = H > d.left && G < d.right && I > d.top - 1 && F < d.bottom + 1);
        }

        return g;
      },
          U = function U() {
        var a,
            f,
            h,
            j,
            k,
            m,
            n,
            p,
            q,
            r,
            s,
            t,
            u = c.elements;

        if ((o = d.loadMode) && P < 8 && (a = u.length)) {
          for (f = 0, Q++, r = !d.expand || d.expand < 1 ? e.clientHeight > 500 && e.clientWidth > 500 ? 500 : 370 : d.expand, s = r * d.expFactor, t = d.hFac, J = null, O < s && P < 1 && Q > 2 && o > 2 && !b.hidden ? (O = s, Q = 0) : O = o > 1 && Q > 1 && P < 6 ? r : N; f < a; f++) {
            if (u[f] && !u[f]._lazyRace) if (M) {
              if ((p = u[f][i]("data-expand")) && (m = 1 * p) || (m = O), q !== m && (y = innerWidth + m * t, D = innerHeight + m, n = -1 * m, q = m), h = u[f].getBoundingClientRect(), (I = h.bottom) >= n && (F = h.top) <= D && (H = h.right) >= n * t && (G = h.left) <= y && (I || H || G || F) && (d.loadHidden || S(u[f])) && (l && P < 3 && !p && (o < 3 || Q < 4) || T(u[f], m))) {
                if (aa(u[f]), k = !0, P > 9) break;
              } else !k && l && !j && P < 4 && Q < 4 && o > 2 && (g[0] || d.preloadAfterLoad) && (g[0] || !p && (I || H || G || F || "auto" != u[f][i](d.sizesAttr))) && (j = g[0] || u[f]);
            } else aa(u[f]);
          }

          j && !k && aa(j);
        }
      },
          V = B(U),
          W = function W(a) {
        s(a.target, d.loadedClass), t(a.target, d.loadingClass), u(a.target, Y), v(a.target, "lazyloaded");
      },
          X = A(W),
          Y = function Y(a) {
        X({
          target: a.target
        });
      },
          Z = function Z(a, b) {
        try {
          a.contentWindow.location.replace(b);
        } catch (c) {
          a.src = b;
        }
      },
          $ = function $(a) {
        var b,
            c = a[i](d.srcsetAttr);
        (b = d.customMedia[a[i]("data-media") || a[i]("media")]) && a.setAttribute("media", b), c && a.setAttribute("srcset", c);
      },
          _ = A(function (a, b, c, e, f) {
        var g, h, j, l, o, p;
        (o = v(a, "lazybeforeunveil", b)).defaultPrevented || (e && (c ? s(a, d.autosizesClass) : a.setAttribute("sizes", e)), h = a[i](d.srcsetAttr), g = a[i](d.srcAttr), f && (j = a.parentNode, l = j && n.test(j.nodeName || "")), p = b.firesLoad || "src" in a && (h || g || l), o = {
          target: a
        }, p && (u(a, R, !0), clearTimeout(m), m = k(R, 2500), s(a, d.loadingClass), u(a, Y, !0)), l && q.call(j.getElementsByTagName("source"), $), h ? a.setAttribute("srcset", h) : g && !l && (L.test(a.nodeName) ? Z(a, g) : a.src = g), f && (h || l) && w(a, {
          src: g
        })), a._lazyRace && delete a._lazyRace, t(a, d.lazyClass), z(function () {
          (!p || a.complete && a.naturalWidth > 1) && (p ? R(o) : P--, W(o));
        }, !0);
      }),
          aa = function aa(a) {
        var b,
            c = K.test(a.nodeName),
            e = c && (a[i](d.sizesAttr) || a[i]("sizes")),
            f = "auto" == e;
        (!f && l || !c || !a[i]("src") && !a.srcset || a.complete || r(a, d.errorClass) || !r(a, d.lazyClass)) && (b = v(a, "lazyunveilread").detail, f && E.updateElem(a, !0, a.offsetWidth), a._lazyRace = !0, P++, _(a, b, f, e, c));
      },
          ba = function ba() {
        if (!l) {
          if (f.now() - p < 999) return void k(ba, 999);
          var a = C(function () {
            d.loadMode = 3, V();
          });
          l = !0, d.loadMode = 3, V(), j("scroll", function () {
            3 == d.loadMode && (d.loadMode = 2), a();
          }, !0);
        }
      };

      return {
        _: function _() {
          p = f.now(), c.elements = b.getElementsByClassName(d.lazyClass), g = b.getElementsByClassName(d.lazyClass + " " + d.preloadClass), j("scroll", V, !0), j("resize", V, !0), a.MutationObserver ? new MutationObserver(V).observe(e, {
            childList: !0,
            subtree: !0,
            attributes: !0
          }) : (e[h]("DOMNodeInserted", V, !0), e[h]("DOMAttrModified", V, !0), setInterval(V, 999)), j("hashchange", V, !0), ["focus", "mouseover", "click", "load", "transitionend", "animationend", "webkitAnimationEnd"].forEach(function (a) {
            b[h](a, V, !0);
          }), /d$|^c/.test(b.readyState) ? ba() : (j("load", ba), b[h]("DOMContentLoaded", V), k(ba, 2e4)), c.elements.length ? (U(), z._lsFlush()) : V();
        },
        checkElems: V,
        unveil: aa
      };
    }(),
        E = function () {
      var a,
          c = A(function (a, b, c, d) {
        var e, f, g;
        if (a._lazysizesWidth = d, d += "px", a.setAttribute("sizes", d), n.test(b.nodeName || "")) for (e = b.getElementsByTagName("source"), f = 0, g = e.length; f < g; f++) {
          e[f].setAttribute("sizes", d);
        }
        c.detail.dataAttr || w(a, c.detail);
      }),
          e = function e(a, b, d) {
        var e,
            f = a.parentNode;
        f && (d = y(a, f, d), e = v(a, "lazybeforesizes", {
          width: d,
          dataAttr: !!b
        }), e.defaultPrevented || (d = e.detail.width) && d !== a._lazysizesWidth && c(a, f, e, d));
      },
          f = function f() {
        var b,
            c = a.length;
        if (c) for (b = 0; b < c; b++) {
          e(a[b]);
        }
      },
          g = C(f);

      return {
        _: function _() {
          a = b.getElementsByClassName(d.autosizesClass), j("resize", g);
        },
        checkElems: g,
        updateElem: e
      };
    }(),
        F = function F() {
      F.i || (F.i = !0, E._(), D._());
    };

    return c = {
      cfg: d,
      autoSizer: E,
      loader: D,
      init: F,
      uP: w,
      aC: s,
      rC: t,
      hC: r,
      fire: v,
      gW: y,
      rAF: z
    };
  }
});
/*! lazysizes - v4.1.6 ls.respimg.min.js */

!function (a, b) {
  var c = function c() {
    b(a.lazySizes), a.removeEventListener("lazyunveilread", c, !0);
  };

  b = b.bind(null, a, a.document), "object" == (typeof module === "undefined" ? "undefined" : _typeof(module)) && module.exports ? b(require("lazysizes"), require("../fix-ios-sizes/fix-ios-sizes")) : a.lazySizes ? c() : a.addEventListener("lazyunveilread", c, !0);
}(window, function (a, b, c) {
  "use strict";

  var d,
      e = c && c.cfg || a.lazySizesConfig,
      f = b.createElement("img"),
      g = "sizes" in f && "srcset" in f,
      h = /\s+\d+h/g,
      i = function () {
    var a = /\s+(\d+)(w|h)\s+(\d+)(w|h)/,
        c = Array.prototype.forEach;
    return function () {
      var d = b.createElement("img"),
          e = function e(b) {
        var c,
            d,
            e = b.getAttribute(lazySizesConfig.srcsetAttr);
        e && ((d = e.match(a)) && (c = "w" == d[2] ? d[1] / d[3] : d[3] / d[1]) && b.setAttribute("data-aspectratio", c), b.setAttribute(lazySizesConfig.srcsetAttr, e.replace(h, "")));
      },
          f = function f(a) {
        var b = a.target.parentNode;
        b && "PICTURE" == b.nodeName && c.call(b.getElementsByTagName("source"), e), e(a.target);
      },
          g = function g() {
        d.currentSrc && b.removeEventListener("lazybeforeunveil", f);
      };

      b.addEventListener("lazybeforeunveil", f), d.onload = g, d.onerror = g, d.srcset = "data:,a 1w 1h", d.complete && g();
    };
  }();

  if (e || (e = {}, a.lazySizesConfig = e), e.supportsType || (e.supportsType = function (a) {
    return !a;
  }), !a.picturefill && !e.pf) {
    if (a.HTMLPictureElement && g) return b.msElementsFromPoint && i(navigator.userAgent.match(/Edge\/(\d+)/)), void (e.pf = function () {});
    e.pf = function (b) {
      var c, e;
      if (!a.picturefill) for (c = 0, e = b.elements.length; c < e; c++) {
        d(b.elements[c]);
      }
    }, d = function () {
      var f = function f(a, b) {
        return a.w - b.w;
      },
          i = /^\s*\d+\.*\d*px\s*$/,
          j = function j(a) {
        var b,
            c,
            d = a.length,
            e = a[d - 1],
            f = 0;

        for (f; f < d; f++) {
          if (e = a[f], e.d = e.w / a.w, e.d >= a.d) {
            !e.cached && (b = a[f - 1]) && b.d > a.d - .13 * Math.pow(a.d, 2.2) && (c = Math.pow(b.d - .6, 1.6), b.cached && (b.d += .15 * c), b.d + (e.d - a.d) * c > a.d && (e = b));
            break;
          }
        }

        return e;
      },
          k = function () {
        var a,
            b = /(([^,\s].[^\s]+)\s+(\d+)w)/g,
            c = /\s/,
            d = function d(b, c, _d, e) {
          a.push({
            c: c,
            u: _d,
            w: 1 * e
          });
        };

        return function (e) {
          return a = [], e = e.trim(), e.replace(h, "").replace(b, d), a.length || !e || c.test(e) || a.push({
            c: e,
            u: e,
            w: 99
          }), a;
        };
      }(),
          l = function l() {
        l.init || (l.init = !0, addEventListener("resize", function () {
          var a,
              c = b.getElementsByClassName("lazymatchmedia"),
              e = function e() {
            var a, b;

            for (a = 0, b = c.length; a < b; a++) {
              d(c[a]);
            }
          };

          return function () {
            clearTimeout(a), a = setTimeout(e, 66);
          };
        }()));
      },
          m = function m(b, d) {
        var f,
            g = b.getAttribute("srcset") || b.getAttribute(e.srcsetAttr);
        !g && d && (g = b._lazypolyfill ? b._lazypolyfill._set : b.getAttribute(e.srcAttr) || b.getAttribute("src")), b._lazypolyfill && b._lazypolyfill._set == g || (f = k(g || ""), d && b.parentNode && (f.isPicture = "PICTURE" == b.parentNode.nodeName.toUpperCase(), f.isPicture && a.matchMedia && (c.aC(b, "lazymatchmedia"), l())), f._set = g, Object.defineProperty(b, "_lazypolyfill", {
          value: f,
          writable: !0
        }));
      },
          n = function n(b) {
        var d = a.devicePixelRatio || 1,
            e = c.getX && c.getX(b);
        return Math.min(e || d, 2.5, d);
      },
          _o = function o(b) {
        return a.matchMedia ? (_o = function o(a) {
          return !a || (matchMedia(a) || {}).matches;
        })(b) : !b;
      },
          p = function p(a) {
        var b, d, g, h, k, l, p;
        if (h = a, m(h, !0), k = h._lazypolyfill, k.isPicture) for (d = 0, b = a.parentNode.getElementsByTagName("source"), g = b.length; d < g; d++) {
          if (e.supportsType(b[d].getAttribute("type"), a) && _o(b[d].getAttribute("media"))) {
            h = b[d], m(h), k = h._lazypolyfill;
            break;
          }
        }
        return k.length > 1 ? (p = h.getAttribute("sizes") || "", p = i.test(p) && parseInt(p, 10) || c.gW(a, a.parentNode), k.d = n(a), !k.src || !k.w || k.w < p ? (k.w = p, l = j(k.sort(f)), k.src = l) : l = k.src) : l = k[0], l;
      },
          q = function q(a) {
        if (!g || !a.parentNode || "PICTURE" == a.parentNode.nodeName.toUpperCase()) {
          var b = p(a);
          b && b.u && a._lazypolyfill.cur != b.u && (a._lazypolyfill.cur = b.u, b.cached = !0, a.setAttribute(e.srcAttr, b.u), a.setAttribute("src", b.u));
        }
      };

      return q.parse = k, q;
    }(), e.loadedClass && e.loadingClass && function () {
      var a = [];
      ['img[sizes$="px"][srcset].', "picture > img:not([srcset])."].forEach(function (b) {
        a.push(b + e.loadedClass), a.push(b + e.loadingClass);
      }), e.pf({
        elements: b.querySelectorAll(a.join(", "))
      });
    }();
  }
});
/*! lazysizes - v4.1.6 ls.parent-fit.min.js */

!function (a, b) {
  var c = function c() {
    b(a.lazySizes), a.removeEventListener("lazyunveilread", c, !0);
  };

  b = b.bind(null, a, a.document), "object" == (typeof module === "undefined" ? "undefined" : _typeof(module)) && module.exports ? b(require("lazysizes")) : a.lazySizes ? c() : a.addEventListener("lazyunveilread", c, !0);
}(window, function (a, b, c) {
  "use strict";

  if (a.addEventListener) {
    var d = /\s+(\d+)(w|h)\s+(\d+)(w|h)/,
        e = /parent-fit["']*\s*:\s*["']*(contain|cover|width)/,
        f = /parent-container["']*\s*:\s*["']*(.+?)(?=(\s|$|,|'|"|;))/,
        g = /^picture$/i,
        h = function h(a) {
      return getComputedStyle(a, null) || {};
    },
        i = {
      getParent: function getParent(b, c) {
        var d = b,
            e = b.parentNode;
        return c && "prev" != c || !e || !g.test(e.nodeName || "") || (e = e.parentNode), "self" != c && (d = "prev" == c ? b.previousElementSibling : c && (e.closest || a.jQuery) ? (e.closest ? e.closest(c) : jQuery(e).closest(c)[0]) || e : e), d;
      },
      getFit: function getFit(a) {
        var b,
            c,
            d = h(a),
            g = d.content || d.fontFamily,
            j = {
          fit: a._lazysizesParentFit || a.getAttribute("data-parent-fit")
        };
        return !j.fit && g && (b = g.match(e)) && (j.fit = b[1]), j.fit ? (c = a._lazysizesParentContainer || a.getAttribute("data-parent-container"), !c && g && (b = g.match(f)) && (c = b[1]), j.parent = i.getParent(a, c)) : j.fit = d.objectFit, j;
      },
      getImageRatio: function getImageRatio(b) {
        var c,
            e,
            f,
            h,
            i,
            j = b.parentNode,
            k = j && g.test(j.nodeName || "") ? j.querySelectorAll("source, img") : [b];

        for (c = 0; c < k.length; c++) {
          if (b = k[c], e = b.getAttribute(lazySizesConfig.srcsetAttr) || b.getAttribute("srcset") || b.getAttribute("data-pfsrcset") || b.getAttribute("data-risrcset") || "", f = b._lsMedia || b.getAttribute("media"), f = lazySizesConfig.customMedia[b.getAttribute("data-media") || f] || f, e && (!f || (a.matchMedia && matchMedia(f) || {}).matches)) {
            h = parseFloat(b.getAttribute("data-aspectratio")), !h && (i = e.match(d)) && (h = "w" == i[2] ? i[1] / i[3] : i[3] / i[1]);
            break;
          }
        }

        return h;
      },
      calculateSize: function calculateSize(a, b) {
        var c,
            d,
            e,
            f,
            g = this.getFit(a),
            h = g.fit,
            i = g.parent;
        return "width" == h || ("contain" == h || "cover" == h) && (e = this.getImageRatio(a)) ? (i ? b = i.clientWidth : i = a, f = b, "width" == h ? f = b : (d = i.clientHeight) > 40 && (c = b / d) && ("cover" == h && c < e || "contain" == h && c > e) && (f = b * (e / c)), f) : b;
      }
    };

    c.parentFit = i, b.addEventListener("lazybeforesizes", function (a) {
      if (!a.defaultPrevented && a.detail.instance == c) {
        var b = a.target;
        a.detail.width = i.calculateSize(b, a.detail.width);
      }
    });
  }
});
/*! lazysizes - v4.1.6 ls.bgset.min.js*/

!function (a, b) {
  var c = function c() {
    b(a.lazySizes), a.removeEventListener("lazyunveilread", c, !0);
  };

  b = b.bind(null, a, a.document), "object" == (typeof module === "undefined" ? "undefined" : _typeof(module)) && module.exports ? b(require("lazysizes")) : a.lazySizes ? c() : a.addEventListener("lazyunveilread", c, !0);
}(window, function (a, b, c) {
  "use strict";

  if (a.addEventListener) {
    var d = /\s+/g,
        e = /\s*\|\s+|\s+\|\s*/g,
        f = /^(.+?)(?:\s+\[\s*(.+?)\s*\])(?:\s+\[\s*(.+?)\s*\])?$/,
        g = /^\s*\(*\s*type\s*:\s*(.+?)\s*\)*\s*$/,
        h = /\(|\)|'/,
        i = {
      contain: 1,
      cover: 1
    },
        j = function j(a) {
      var b = c.gW(a, a.parentNode);
      return (!a._lazysizesWidth || b > a._lazysizesWidth) && (a._lazysizesWidth = b), a._lazysizesWidth;
    },
        k = function k(a) {
      var b;
      return b = (getComputedStyle(a) || {
        getPropertyValue: function getPropertyValue() {}
      }).getPropertyValue("background-size"), !i[b] && i[a.style.backgroundSize] && (b = a.style.backgroundSize), b;
    },
        l = function l(a, b) {
      if (b) {
        var c = b.match(g);
        c && c[1] ? a.setAttribute("type", c[1]) : a.setAttribute("media", lazySizesConfig.customMedia[b] || b);
      }
    },
        m = function m(a, c, g) {
      var h = b.createElement("picture"),
          i = c.getAttribute(lazySizesConfig.sizesAttr),
          j = c.getAttribute("data-ratio"),
          k = c.getAttribute("data-optimumx");
      c._lazybgset && c._lazybgset.parentNode == c && c.removeChild(c._lazybgset), Object.defineProperty(g, "_lazybgset", {
        value: c,
        writable: !0
      }), Object.defineProperty(c, "_lazybgset", {
        value: h,
        writable: !0
      }), a = a.replace(d, " ").split(e), h.style.display = "none", g.className = lazySizesConfig.lazyClass, 1 != a.length || i || (i = "auto"), a.forEach(function (a) {
        var c,
            d = b.createElement("source");
        i && "auto" != i && d.setAttribute("sizes", i), (c = a.match(f)) ? (d.setAttribute(lazySizesConfig.srcsetAttr, c[1]), l(d, c[2]), l(d, c[3])) : d.setAttribute(lazySizesConfig.srcsetAttr, a), h.appendChild(d);
      }), i && (g.setAttribute(lazySizesConfig.sizesAttr, i), c.removeAttribute(lazySizesConfig.sizesAttr), c.removeAttribute("sizes")), k && g.setAttribute("data-optimumx", k), j && g.setAttribute("data-ratio", j), h.appendChild(g), c.appendChild(h);
    },
        n = function n(a) {
      if (a.target._lazybgset) {
        var b = a.target,
            d = b._lazybgset,
            e = b.currentSrc || b.src;

        if (e) {
          var f = c.fire(d, "bgsetproxy", {
            src: e,
            useSrc: h.test(e) ? JSON.stringify(e) : e
          });
          f.defaultPrevented || (d.style.backgroundImage = "url(" + f.detail.useSrc + ")");
        }

        b._lazybgsetLoading && (c.fire(d, "_lazyloaded", {}, !1, !0), delete b._lazybgsetLoading);
      }
    };

    addEventListener("lazybeforeunveil", function (a) {
      var d, e, f;
      !a.defaultPrevented && (d = a.target.getAttribute("data-bgset")) && (f = a.target, e = b.createElement("img"), e.alt = "", e._lazybgsetLoading = !0, a.detail.firesLoad = !0, m(d, f, e), setTimeout(function () {
        c.loader.unveil(e), c.rAF(function () {
          c.fire(e, "_lazyloaded", {}, !0, !0), e.complete && n({
            target: e
          });
        });
      }));
    }), b.addEventListener("load", n, !0), a.addEventListener("lazybeforesizes", function (a) {
      if (a.detail.instance == c && a.target._lazybgset && a.detail.dataAttr) {
        var b = a.target._lazybgset,
            d = k(b);
        i[d] && (a.target._lazysizesParentFit = d, c.rAF(function () {
          a.target.setAttribute("data-parent-fit", d), a.target._lazysizesParentFit && delete a.target._lazysizesParentFit;
        }));
      }
    }, !0), b.documentElement.addEventListener("lazybeforesizes", function (a) {
      !a.defaultPrevented && a.target._lazybgset && a.detail.instance == c && (a.detail.width = j(a.target._lazybgset));
    });
  }
});
/*! lazysizes - v4.1.6 ls.object-fit.min.js */

!function (a, b) {
  var c = function c(d) {
    b(a.lazySizes, d), a.removeEventListener("lazyunveilread", c, !0);
  };

  b = b.bind(null, a, a.document), "object" == (typeof module === "undefined" ? "undefined" : _typeof(module)) && module.exports ? b(require("lazysizes")) : a.lazySizes ? c() : a.addEventListener("lazyunveilread", c, !0);
}(window, function (a, b, c, d) {
  "use strict";

  function e(a) {
    var b = getComputedStyle(a, null) || {},
        c = b.fontFamily || "",
        d = c.match(j) || "",
        e = d && c.match(k) || "";
    return e && (e = e[1]), {
      fit: d && d[1] || "",
      position: n[e] || e || "center"
    };
  }

  function f(a, b) {
    var d,
        e,
        f = c.cfg,
        g = a.cloneNode(!1),
        h = g.style,
        i = function i() {
      var b = a.currentSrc || a.src;
      b && e !== b && (e = b, h.backgroundImage = "url(" + (m.test(b) ? JSON.stringify(b) : b) + ")", d || (d = !0, c.rC(g, f.loadingClass), c.aC(g, f.loadedClass)));
    },
        j = function j() {
      c.rAF(i);
    };

    a._lazysizesParentFit = b.fit, a.addEventListener("lazyloaded", j, !0), a.addEventListener("load", j, !0), g.addEventListener("load", function () {
      var a = g.currentSrc || g.src;
      a && a != l && (g.src = l, g.srcset = "");
    }), c.rAF(function () {
      var d = a,
          e = a.parentNode;
      "PICTURE" == e.nodeName.toUpperCase() && (d = e, e = e.parentNode), c.rC(g, f.loadedClass), c.rC(g, f.lazyClass), c.aC(g, f.loadingClass), c.aC(g, f.objectFitClass || "lazysizes-display-clone"), g.getAttribute(f.srcsetAttr) && g.setAttribute(f.srcsetAttr, ""), g.getAttribute(f.srcAttr) && g.setAttribute(f.srcAttr, ""), g.src = l, g.srcset = "", h.backgroundRepeat = "no-repeat", h.backgroundPosition = b.position, h.backgroundSize = b.fit, d.style.display = "none", a.setAttribute("data-parent-fit", b.fit), a.setAttribute("data-parent-container", "prev"), e.insertBefore(g, d), a._lazysizesParentFit && delete a._lazysizesParentFit, a.complete && i();
    });
  }

  var g = b.createElement("a").style,
      h = "objectFit" in g,
      i = h && "objectPosition" in g,
      j = /object-fit["']*\s*:\s*["']*(contain|cover)/,
      k = /object-position["']*\s*:\s*["']*(.+?)(?=($|,|'|"|;))/,
      l = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
      m = /\(|\)|'/,
      n = {
    center: "center",
    "50% 50%": "center"
  };

  if (!h || !i) {
    var o = function o(a) {
      if (a.detail.instance == c) {
        var b = a.target,
            d = e(b);
        !d.fit || h && "center" == d.position || f(b, d);
      }
    };

    a.addEventListener("lazyunveilread", o, !0), d && d.detail && o(d);
  }
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
/*! lazysizes - v4.1.6 */


!function (a, b) {
  var c = b(a, a.document);
  a.lazySizes = c, "object" == (typeof module === "undefined" ? "undefined" : _typeof(module)) && module.exports && (module.exports = c);
}(window, function (a, b) {
  "use strict";

  if (b.getElementsByClassName) {
    var c,
        d,
        e = b.documentElement,
        f = a.Date,
        g = a.HTMLPictureElement,
        h = "addEventListener",
        i = "getAttribute",
        j = a[h],
        k = a.setTimeout,
        l = a.requestAnimationFrame || k,
        m = a.requestIdleCallback,
        n = /^picture$/i,
        o = ["load", "error", "lazyincluded", "_lazyloaded"],
        p = {},
        q = Array.prototype.forEach,
        r = function r(a, b) {
      return p[b] || (p[b] = new RegExp("(\\s|^)" + b + "(\\s|$)")), p[b].test(a[i]("class") || "") && p[b];
    },
        s = function s(a, b) {
      r(a, b) || a.setAttribute("class", (a[i]("class") || "").trim() + " " + b);
    },
        t = function t(a, b) {
      var c;
      (c = r(a, b)) && a.setAttribute("class", (a[i]("class") || "").replace(c, " "));
    },
        u = function u(a, b, c) {
      var d = c ? h : "removeEventListener";
      c && u(a, b), o.forEach(function (c) {
        a[d](c, b);
      });
    },
        v = function v(a, d, e, f, g) {
      var h = b.createEvent("Event");
      return e || (e = {}), e.instance = c, h.initEvent(d, !f, !g), h.detail = e, a.dispatchEvent(h), h;
    },
        w = function w(b, c) {
      var e;
      !g && (e = a.picturefill || d.pf) ? (c && c.src && !b[i]("srcset") && b.setAttribute("srcset", c.src), e({
        reevaluate: !0,
        elements: [b]
      })) : c && c.src && (b.src = c.src);
    },
        x = function x(a, b) {
      return (getComputedStyle(a, null) || {})[b];
    },
        y = function y(a, b, c) {
      for (c = c || a.offsetWidth; c < d.minSize && b && !a._lazysizesWidth;) {
        c = b.offsetWidth, b = b.parentNode;
      }

      return c;
    },
        z = function () {
      var a,
          c,
          d = [],
          e = [],
          f = d,
          g = function g() {
        var b = f;

        for (f = d.length ? e : d, a = !0, c = !1; b.length;) {
          b.shift()();
        }

        a = !1;
      },
          h = function h(d, e) {
        a && !e ? d.apply(this, arguments) : (f.push(d), c || (c = !0, (b.hidden ? k : l)(g)));
      };

      return h._lsFlush = g, h;
    }(),
        A = function A(a, b) {
      return b ? function () {
        z(a);
      } : function () {
        var b = this,
            c = arguments;
        z(function () {
          a.apply(b, c);
        });
      };
    },
        B = function B(a) {
      var b,
          c = 0,
          e = d.throttleDelay,
          g = d.ricTimeout,
          h = function h() {
        b = !1, c = f.now(), a();
      },
          i = m && g > 49 ? function () {
        m(h, {
          timeout: g
        }), g !== d.ricTimeout && (g = d.ricTimeout);
      } : A(function () {
        k(h);
      }, !0);

      return function (a) {
        var d;
        (a = !0 === a) && (g = 33), b || (b = !0, d = e - (f.now() - c), d < 0 && (d = 0), a || d < 9 ? i() : k(i, d));
      };
    },
        C = function C(a) {
      var b,
          c,
          d = 99,
          e = function e() {
        b = null, a();
      },
          g = function g() {
        var a = f.now() - c;
        a < d ? k(g, d - a) : (m || e)(e);
      };

      return function () {
        c = f.now(), b || (b = k(g, d));
      };
    };

    !function () {
      var b,
          c = {
        lazyClass: "lazyload",
        loadedClass: "lazyloaded",
        loadingClass: "lazyloading",
        preloadClass: "lazypreload",
        errorClass: "lazyerror",
        autosizesClass: "lazyautosizes",
        srcAttr: "data-src",
        srcsetAttr: "data-srcset",
        sizesAttr: "data-sizes",
        minSize: 40,
        customMedia: {},
        init: !0,
        expFactor: 1.5,
        hFac: .8,
        loadMode: 2,
        loadHidden: !0,
        ricTimeout: 0,
        throttleDelay: 125
      };
      d = a.lazySizesConfig || a.lazysizesConfig || {};

      for (b in c) {
        b in d || (d[b] = c[b]);
      }

      a.lazySizesConfig = d, k(function () {
        d.init && F();
      });
    }();

    var D = function () {
      var g,
          l,
          m,
          o,
          p,
          y,
          D,
          F,
          G,
          H,
          I,
          J,
          K = /^img$/i,
          L = /^iframe$/i,
          M = "onscroll" in a && !/(gle|ing)bot/.test(navigator.userAgent),
          N = 0,
          O = 0,
          P = 0,
          Q = -1,
          R = function R(a) {
        P--, a && a.target && u(a.target, R), (!a || P < 0 || !a.target) && (P = 0);
      },
          S = function S(a) {
        return null == J && (J = "hidden" == x(b.body, "visibility")), J || "hidden" != x(a.parentNode, "visibility") && "hidden" != x(a, "visibility");
      },
          T = function T(a, c) {
        var d,
            f = a,
            g = S(a);

        for (F -= c, I += c, G -= c, H += c; g && (f = f.offsetParent) && f != b.body && f != e;) {
          (g = (x(f, "opacity") || 1) > 0) && "visible" != x(f, "overflow") && (d = f.getBoundingClientRect(), g = H > d.left && G < d.right && I > d.top - 1 && F < d.bottom + 1);
        }

        return g;
      },
          U = function U() {
        var a,
            f,
            h,
            j,
            k,
            m,
            n,
            p,
            q,
            r,
            s,
            t,
            u = c.elements;

        if ((o = d.loadMode) && P < 8 && (a = u.length)) {
          for (f = 0, Q++, r = !d.expand || d.expand < 1 ? e.clientHeight > 500 && e.clientWidth > 500 ? 500 : 370 : d.expand, s = r * d.expFactor, t = d.hFac, J = null, O < s && P < 1 && Q > 2 && o > 2 && !b.hidden ? (O = s, Q = 0) : O = o > 1 && Q > 1 && P < 6 ? r : N; f < a; f++) {
            if (u[f] && !u[f]._lazyRace) if (M) {
              if ((p = u[f][i]("data-expand")) && (m = 1 * p) || (m = O), q !== m && (y = innerWidth + m * t, D = innerHeight + m, n = -1 * m, q = m), h = u[f].getBoundingClientRect(), (I = h.bottom) >= n && (F = h.top) <= D && (H = h.right) >= n * t && (G = h.left) <= y && (I || H || G || F) && (d.loadHidden || S(u[f])) && (l && P < 3 && !p && (o < 3 || Q < 4) || T(u[f], m))) {
                if (aa(u[f]), k = !0, P > 9) break;
              } else !k && l && !j && P < 4 && Q < 4 && o > 2 && (g[0] || d.preloadAfterLoad) && (g[0] || !p && (I || H || G || F || "auto" != u[f][i](d.sizesAttr))) && (j = g[0] || u[f]);
            } else aa(u[f]);
          }

          j && !k && aa(j);
        }
      },
          V = B(U),
          W = function W(a) {
        s(a.target, d.loadedClass), t(a.target, d.loadingClass), u(a.target, Y), v(a.target, "lazyloaded");
      },
          X = A(W),
          Y = function Y(a) {
        X({
          target: a.target
        });
      },
          Z = function Z(a, b) {
        try {
          a.contentWindow.location.replace(b);
        } catch (c) {
          a.src = b;
        }
      },
          $ = function $(a) {
        var b,
            c = a[i](d.srcsetAttr);
        (b = d.customMedia[a[i]("data-media") || a[i]("media")]) && a.setAttribute("media", b), c && a.setAttribute("srcset", c);
      },
          _ = A(function (a, b, c, e, f) {
        var g, h, j, l, o, p;
        (o = v(a, "lazybeforeunveil", b)).defaultPrevented || (e && (c ? s(a, d.autosizesClass) : a.setAttribute("sizes", e)), h = a[i](d.srcsetAttr), g = a[i](d.srcAttr), f && (j = a.parentNode, l = j && n.test(j.nodeName || "")), p = b.firesLoad || "src" in a && (h || g || l), o = {
          target: a
        }, p && (u(a, R, !0), clearTimeout(m), m = k(R, 2500), s(a, d.loadingClass), u(a, Y, !0)), l && q.call(j.getElementsByTagName("source"), $), h ? a.setAttribute("srcset", h) : g && !l && (L.test(a.nodeName) ? Z(a, g) : a.src = g), f && (h || l) && w(a, {
          src: g
        })), a._lazyRace && delete a._lazyRace, t(a, d.lazyClass), z(function () {
          (!p || a.complete && a.naturalWidth > 1) && (p ? R(o) : P--, W(o));
        }, !0);
      }),
          aa = function aa(a) {
        var b,
            c = K.test(a.nodeName),
            e = c && (a[i](d.sizesAttr) || a[i]("sizes")),
            f = "auto" == e;
        (!f && l || !c || !a[i]("src") && !a.srcset || a.complete || r(a, d.errorClass) || !r(a, d.lazyClass)) && (b = v(a, "lazyunveilread").detail, f && E.updateElem(a, !0, a.offsetWidth), a._lazyRace = !0, P++, _(a, b, f, e, c));
      },
          ba = function ba() {
        if (!l) {
          if (f.now() - p < 999) return void k(ba, 999);
          var a = C(function () {
            d.loadMode = 3, V();
          });
          l = !0, d.loadMode = 3, V(), j("scroll", function () {
            3 == d.loadMode && (d.loadMode = 2), a();
          }, !0);
        }
      };

      return {
        _: function _() {
          p = f.now(), c.elements = b.getElementsByClassName(d.lazyClass), g = b.getElementsByClassName(d.lazyClass + " " + d.preloadClass), j("scroll", V, !0), j("resize", V, !0), a.MutationObserver ? new MutationObserver(V).observe(e, {
            childList: !0,
            subtree: !0,
            attributes: !0
          }) : (e[h]("DOMNodeInserted", V, !0), e[h]("DOMAttrModified", V, !0), setInterval(V, 999)), j("hashchange", V, !0), ["focus", "mouseover", "click", "load", "transitionend", "animationend", "webkitAnimationEnd"].forEach(function (a) {
            b[h](a, V, !0);
          }), /d$|^c/.test(b.readyState) ? ba() : (j("load", ba), b[h]("DOMContentLoaded", V), k(ba, 2e4)), c.elements.length ? (U(), z._lsFlush()) : V();
        },
        checkElems: V,
        unveil: aa
      };
    }(),
        E = function () {
      var a,
          c = A(function (a, b, c, d) {
        var e, f, g;
        if (a._lazysizesWidth = d, d += "px", a.setAttribute("sizes", d), n.test(b.nodeName || "")) for (e = b.getElementsByTagName("source"), f = 0, g = e.length; f < g; f++) {
          e[f].setAttribute("sizes", d);
        }
        c.detail.dataAttr || w(a, c.detail);
      }),
          e = function e(a, b, d) {
        var e,
            f = a.parentNode;
        f && (d = y(a, f, d), e = v(a, "lazybeforesizes", {
          width: d,
          dataAttr: !!b
        }), e.defaultPrevented || (d = e.detail.width) && d !== a._lazysizesWidth && c(a, f, e, d));
      },
          f = function f() {
        var b,
            c = a.length;
        if (c) for (b = 0; b < c; b++) {
          e(a[b]);
        }
      },
          g = C(f);

      return {
        _: function _() {
          a = b.getElementsByClassName(d.autosizesClass), j("resize", g);
        },
        checkElems: g,
        updateElem: e
      };
    }(),
        F = function F() {
      F.i || (F.i = !0, E._(), D._());
    };

    return c = {
      cfg: d,
      autoSizer: E,
      loader: D,
      init: F,
      uP: w,
      aC: s,
      rC: t,
      hC: r,
      fire: v,
      gW: y,
      rAF: z
    };
  }
});
/*! lazysizes - v4.1.6 ls.respimg.min.js */

!function (a, b) {
  var c = function c() {
    b(a.lazySizes), a.removeEventListener("lazyunveilread", c, !0);
  };

  b = b.bind(null, a, a.document), "object" == (typeof module === "undefined" ? "undefined" : _typeof(module)) && module.exports ? b(require("lazysizes"), require("../fix-ios-sizes/fix-ios-sizes")) : a.lazySizes ? c() : a.addEventListener("lazyunveilread", c, !0);
}(window, function (a, b, c) {
  "use strict";

  var d,
      e = c && c.cfg || a.lazySizesConfig,
      f = b.createElement("img"),
      g = "sizes" in f && "srcset" in f,
      h = /\s+\d+h/g,
      i = function () {
    var a = /\s+(\d+)(w|h)\s+(\d+)(w|h)/,
        c = Array.prototype.forEach;
    return function () {
      var d = b.createElement("img"),
          e = function e(b) {
        var c,
            d,
            e = b.getAttribute(lazySizesConfig.srcsetAttr);
        e && ((d = e.match(a)) && (c = "w" == d[2] ? d[1] / d[3] : d[3] / d[1]) && b.setAttribute("data-aspectratio", c), b.setAttribute(lazySizesConfig.srcsetAttr, e.replace(h, "")));
      },
          f = function f(a) {
        var b = a.target.parentNode;
        b && "PICTURE" == b.nodeName && c.call(b.getElementsByTagName("source"), e), e(a.target);
      },
          g = function g() {
        d.currentSrc && b.removeEventListener("lazybeforeunveil", f);
      };

      b.addEventListener("lazybeforeunveil", f), d.onload = g, d.onerror = g, d.srcset = "data:,a 1w 1h", d.complete && g();
    };
  }();

  if (e || (e = {}, a.lazySizesConfig = e), e.supportsType || (e.supportsType = function (a) {
    return !a;
  }), !a.picturefill && !e.pf) {
    if (a.HTMLPictureElement && g) return b.msElementsFromPoint && i(navigator.userAgent.match(/Edge\/(\d+)/)), void (e.pf = function () {});
    e.pf = function (b) {
      var c, e;
      if (!a.picturefill) for (c = 0, e = b.elements.length; c < e; c++) {
        d(b.elements[c]);
      }
    }, d = function () {
      var f = function f(a, b) {
        return a.w - b.w;
      },
          i = /^\s*\d+\.*\d*px\s*$/,
          j = function j(a) {
        var b,
            c,
            d = a.length,
            e = a[d - 1],
            f = 0;

        for (f; f < d; f++) {
          if (e = a[f], e.d = e.w / a.w, e.d >= a.d) {
            !e.cached && (b = a[f - 1]) && b.d > a.d - .13 * Math.pow(a.d, 2.2) && (c = Math.pow(b.d - .6, 1.6), b.cached && (b.d += .15 * c), b.d + (e.d - a.d) * c > a.d && (e = b));
            break;
          }
        }

        return e;
      },
          k = function () {
        var a,
            b = /(([^,\s].[^\s]+)\s+(\d+)w)/g,
            c = /\s/,
            d = function d(b, c, _d, e) {
          a.push({
            c: c,
            u: _d,
            w: 1 * e
          });
        };

        return function (e) {
          return a = [], e = e.trim(), e.replace(h, "").replace(b, d), a.length || !e || c.test(e) || a.push({
            c: e,
            u: e,
            w: 99
          }), a;
        };
      }(),
          l = function l() {
        l.init || (l.init = !0, addEventListener("resize", function () {
          var a,
              c = b.getElementsByClassName("lazymatchmedia"),
              e = function e() {
            var a, b;

            for (a = 0, b = c.length; a < b; a++) {
              d(c[a]);
            }
          };

          return function () {
            clearTimeout(a), a = setTimeout(e, 66);
          };
        }()));
      },
          m = function m(b, d) {
        var f,
            g = b.getAttribute("srcset") || b.getAttribute(e.srcsetAttr);
        !g && d && (g = b._lazypolyfill ? b._lazypolyfill._set : b.getAttribute(e.srcAttr) || b.getAttribute("src")), b._lazypolyfill && b._lazypolyfill._set == g || (f = k(g || ""), d && b.parentNode && (f.isPicture = "PICTURE" == b.parentNode.nodeName.toUpperCase(), f.isPicture && a.matchMedia && (c.aC(b, "lazymatchmedia"), l())), f._set = g, Object.defineProperty(b, "_lazypolyfill", {
          value: f,
          writable: !0
        }));
      },
          n = function n(b) {
        var d = a.devicePixelRatio || 1,
            e = c.getX && c.getX(b);
        return Math.min(e || d, 2.5, d);
      },
          _o = function o(b) {
        return a.matchMedia ? (_o = function o(a) {
          return !a || (matchMedia(a) || {}).matches;
        })(b) : !b;
      },
          p = function p(a) {
        var b, d, g, h, k, l, p;
        if (h = a, m(h, !0), k = h._lazypolyfill, k.isPicture) for (d = 0, b = a.parentNode.getElementsByTagName("source"), g = b.length; d < g; d++) {
          if (e.supportsType(b[d].getAttribute("type"), a) && _o(b[d].getAttribute("media"))) {
            h = b[d], m(h), k = h._lazypolyfill;
            break;
          }
        }
        return k.length > 1 ? (p = h.getAttribute("sizes") || "", p = i.test(p) && parseInt(p, 10) || c.gW(a, a.parentNode), k.d = n(a), !k.src || !k.w || k.w < p ? (k.w = p, l = j(k.sort(f)), k.src = l) : l = k.src) : l = k[0], l;
      },
          q = function q(a) {
        if (!g || !a.parentNode || "PICTURE" == a.parentNode.nodeName.toUpperCase()) {
          var b = p(a);
          b && b.u && a._lazypolyfill.cur != b.u && (a._lazypolyfill.cur = b.u, b.cached = !0, a.setAttribute(e.srcAttr, b.u), a.setAttribute("src", b.u));
        }
      };

      return q.parse = k, q;
    }(), e.loadedClass && e.loadingClass && function () {
      var a = [];
      ['img[sizes$="px"][srcset].', "picture > img:not([srcset])."].forEach(function (b) {
        a.push(b + e.loadedClass), a.push(b + e.loadingClass);
      }), e.pf({
        elements: b.querySelectorAll(a.join(", "))
      });
    }();
  }
});
/*! lazysizes - v4.1.6 ls.parent-fit.min.js */

!function (a, b) {
  var c = function c() {
    b(a.lazySizes), a.removeEventListener("lazyunveilread", c, !0);
  };

  b = b.bind(null, a, a.document), "object" == (typeof module === "undefined" ? "undefined" : _typeof(module)) && module.exports ? b(require("lazysizes")) : a.lazySizes ? c() : a.addEventListener("lazyunveilread", c, !0);
}(window, function (a, b, c) {
  "use strict";

  if (a.addEventListener) {
    var d = /\s+(\d+)(w|h)\s+(\d+)(w|h)/,
        e = /parent-fit["']*\s*:\s*["']*(contain|cover|width)/,
        f = /parent-container["']*\s*:\s*["']*(.+?)(?=(\s|$|,|'|"|;))/,
        g = /^picture$/i,
        h = function h(a) {
      return getComputedStyle(a, null) || {};
    },
        i = {
      getParent: function getParent(b, c) {
        var d = b,
            e = b.parentNode;
        return c && "prev" != c || !e || !g.test(e.nodeName || "") || (e = e.parentNode), "self" != c && (d = "prev" == c ? b.previousElementSibling : c && (e.closest || a.jQuery) ? (e.closest ? e.closest(c) : jQuery(e).closest(c)[0]) || e : e), d;
      },
      getFit: function getFit(a) {
        var b,
            c,
            d = h(a),
            g = d.content || d.fontFamily,
            j = {
          fit: a._lazysizesParentFit || a.getAttribute("data-parent-fit")
        };
        return !j.fit && g && (b = g.match(e)) && (j.fit = b[1]), j.fit ? (c = a._lazysizesParentContainer || a.getAttribute("data-parent-container"), !c && g && (b = g.match(f)) && (c = b[1]), j.parent = i.getParent(a, c)) : j.fit = d.objectFit, j;
      },
      getImageRatio: function getImageRatio(b) {
        var c,
            e,
            f,
            h,
            i,
            j = b.parentNode,
            k = j && g.test(j.nodeName || "") ? j.querySelectorAll("source, img") : [b];

        for (c = 0; c < k.length; c++) {
          if (b = k[c], e = b.getAttribute(lazySizesConfig.srcsetAttr) || b.getAttribute("srcset") || b.getAttribute("data-pfsrcset") || b.getAttribute("data-risrcset") || "", f = b._lsMedia || b.getAttribute("media"), f = lazySizesConfig.customMedia[b.getAttribute("data-media") || f] || f, e && (!f || (a.matchMedia && matchMedia(f) || {}).matches)) {
            h = parseFloat(b.getAttribute("data-aspectratio")), !h && (i = e.match(d)) && (h = "w" == i[2] ? i[1] / i[3] : i[3] / i[1]);
            break;
          }
        }

        return h;
      },
      calculateSize: function calculateSize(a, b) {
        var c,
            d,
            e,
            f,
            g = this.getFit(a),
            h = g.fit,
            i = g.parent;
        return "width" == h || ("contain" == h || "cover" == h) && (e = this.getImageRatio(a)) ? (i ? b = i.clientWidth : i = a, f = b, "width" == h ? f = b : (d = i.clientHeight) > 40 && (c = b / d) && ("cover" == h && c < e || "contain" == h && c > e) && (f = b * (e / c)), f) : b;
      }
    };

    c.parentFit = i, b.addEventListener("lazybeforesizes", function (a) {
      if (!a.defaultPrevented && a.detail.instance == c) {
        var b = a.target;
        a.detail.width = i.calculateSize(b, a.detail.width);
      }
    });
  }
});
/*! lazysizes - v4.1.6 ls.bgset.min.js*/

!function (a, b) {
  var c = function c() {
    b(a.lazySizes), a.removeEventListener("lazyunveilread", c, !0);
  };

  b = b.bind(null, a, a.document), "object" == (typeof module === "undefined" ? "undefined" : _typeof(module)) && module.exports ? b(require("lazysizes")) : a.lazySizes ? c() : a.addEventListener("lazyunveilread", c, !0);
}(window, function (a, b, c) {
  "use strict";

  if (a.addEventListener) {
    var d = /\s+/g,
        e = /\s*\|\s+|\s+\|\s*/g,
        f = /^(.+?)(?:\s+\[\s*(.+?)\s*\])(?:\s+\[\s*(.+?)\s*\])?$/,
        g = /^\s*\(*\s*type\s*:\s*(.+?)\s*\)*\s*$/,
        h = /\(|\)|'/,
        i = {
      contain: 1,
      cover: 1
    },
        j = function j(a) {
      var b = c.gW(a, a.parentNode);
      return (!a._lazysizesWidth || b > a._lazysizesWidth) && (a._lazysizesWidth = b), a._lazysizesWidth;
    },
        k = function k(a) {
      var b;
      return b = (getComputedStyle(a) || {
        getPropertyValue: function getPropertyValue() {}
      }).getPropertyValue("background-size"), !i[b] && i[a.style.backgroundSize] && (b = a.style.backgroundSize), b;
    },
        l = function l(a, b) {
      if (b) {
        var c = b.match(g);
        c && c[1] ? a.setAttribute("type", c[1]) : a.setAttribute("media", lazySizesConfig.customMedia[b] || b);
      }
    },
        m = function m(a, c, g) {
      var h = b.createElement("picture"),
          i = c.getAttribute(lazySizesConfig.sizesAttr),
          j = c.getAttribute("data-ratio"),
          k = c.getAttribute("data-optimumx");
      c._lazybgset && c._lazybgset.parentNode == c && c.removeChild(c._lazybgset), Object.defineProperty(g, "_lazybgset", {
        value: c,
        writable: !0
      }), Object.defineProperty(c, "_lazybgset", {
        value: h,
        writable: !0
      }), a = a.replace(d, " ").split(e), h.style.display = "none", g.className = lazySizesConfig.lazyClass, 1 != a.length || i || (i = "auto"), a.forEach(function (a) {
        var c,
            d = b.createElement("source");
        i && "auto" != i && d.setAttribute("sizes", i), (c = a.match(f)) ? (d.setAttribute(lazySizesConfig.srcsetAttr, c[1]), l(d, c[2]), l(d, c[3])) : d.setAttribute(lazySizesConfig.srcsetAttr, a), h.appendChild(d);
      }), i && (g.setAttribute(lazySizesConfig.sizesAttr, i), c.removeAttribute(lazySizesConfig.sizesAttr), c.removeAttribute("sizes")), k && g.setAttribute("data-optimumx", k), j && g.setAttribute("data-ratio", j), h.appendChild(g), c.appendChild(h);
    },
        n = function n(a) {
      if (a.target._lazybgset) {
        var b = a.target,
            d = b._lazybgset,
            e = b.currentSrc || b.src;

        if (e) {
          var f = c.fire(d, "bgsetproxy", {
            src: e,
            useSrc: h.test(e) ? JSON.stringify(e) : e
          });
          f.defaultPrevented || (d.style.backgroundImage = "url(" + f.detail.useSrc + ")");
        }

        b._lazybgsetLoading && (c.fire(d, "_lazyloaded", {}, !1, !0), delete b._lazybgsetLoading);
      }
    };

    addEventListener("lazybeforeunveil", function (a) {
      var d, e, f;
      !a.defaultPrevented && (d = a.target.getAttribute("data-bgset")) && (f = a.target, e = b.createElement("img"), e.alt = "", e._lazybgsetLoading = !0, a.detail.firesLoad = !0, m(d, f, e), setTimeout(function () {
        c.loader.unveil(e), c.rAF(function () {
          c.fire(e, "_lazyloaded", {}, !0, !0), e.complete && n({
            target: e
          });
        });
      }));
    }), b.addEventListener("load", n, !0), a.addEventListener("lazybeforesizes", function (a) {
      if (a.detail.instance == c && a.target._lazybgset && a.detail.dataAttr) {
        var b = a.target._lazybgset,
            d = k(b);
        i[d] && (a.target._lazysizesParentFit = d, c.rAF(function () {
          a.target.setAttribute("data-parent-fit", d), a.target._lazysizesParentFit && delete a.target._lazysizesParentFit;
        }));
      }
    }, !0), b.documentElement.addEventListener("lazybeforesizes", function (a) {
      !a.defaultPrevented && a.target._lazybgset && a.detail.instance == c && (a.detail.width = j(a.target._lazybgset));
    });
  }
});
/*! lazysizes - v4.1.6 ls.object-fit.min.js */

!function (a, b) {
  var c = function c(d) {
    b(a.lazySizes, d), a.removeEventListener("lazyunveilread", c, !0);
  };

  b = b.bind(null, a, a.document), "object" == (typeof module === "undefined" ? "undefined" : _typeof(module)) && module.exports ? b(require("lazysizes")) : a.lazySizes ? c() : a.addEventListener("lazyunveilread", c, !0);
}(window, function (a, b, c, d) {
  "use strict";

  function e(a) {
    var b = getComputedStyle(a, null) || {},
        c = b.fontFamily || "",
        d = c.match(j) || "",
        e = d && c.match(k) || "";
    return e && (e = e[1]), {
      fit: d && d[1] || "",
      position: n[e] || e || "center"
    };
  }

  function f(a, b) {
    var d,
        e,
        f = c.cfg,
        g = a.cloneNode(!1),
        h = g.style,
        i = function i() {
      var b = a.currentSrc || a.src;
      b && e !== b && (e = b, h.backgroundImage = "url(" + (m.test(b) ? JSON.stringify(b) : b) + ")", d || (d = !0, c.rC(g, f.loadingClass), c.aC(g, f.loadedClass)));
    },
        j = function j() {
      c.rAF(i);
    };

    a._lazysizesParentFit = b.fit, a.addEventListener("lazyloaded", j, !0), a.addEventListener("load", j, !0), g.addEventListener("load", function () {
      var a = g.currentSrc || g.src;
      a && a != l && (g.src = l, g.srcset = "");
    }), c.rAF(function () {
      var d = a,
          e = a.parentNode;
      "PICTURE" == e.nodeName.toUpperCase() && (d = e, e = e.parentNode), c.rC(g, f.loadedClass), c.rC(g, f.lazyClass), c.aC(g, f.loadingClass), c.aC(g, f.objectFitClass || "lazysizes-display-clone"), g.getAttribute(f.srcsetAttr) && g.setAttribute(f.srcsetAttr, ""), g.getAttribute(f.srcAttr) && g.setAttribute(f.srcAttr, ""), g.src = l, g.srcset = "", h.backgroundRepeat = "no-repeat", h.backgroundPosition = b.position, h.backgroundSize = b.fit, d.style.display = "none", a.setAttribute("data-parent-fit", b.fit), a.setAttribute("data-parent-container", "prev"), e.insertBefore(g, d), a._lazysizesParentFit && delete a._lazysizesParentFit, a.complete && i();
    });
  }

  var g = b.createElement("a").style,
      h = "objectFit" in g,
      i = h && "objectPosition" in g,
      j = /object-fit["']*\s*:\s*["']*(contain|cover)/,
      k = /object-position["']*\s*:\s*["']*(.+?)(?=($|,|'|"|;))/,
      l = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
      m = /\(|\)|'/,
      n = {
    center: "center",
    "50% 50%": "center"
  };

  if (!h || !i) {
    var o = function o(a) {
      if (a.detail.instance == c) {
        var b = a.target,
            d = e(b);
        !d.fit || h && "center" == d.position || f(b, d);
      }
    };

    a.addEventListener("lazyunveilread", o, !0), d && d.detail && o(d);
  }
});
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