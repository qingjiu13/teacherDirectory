var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod2) => function __require() {
  return mod2 || (0, cb[__getOwnPropNames(cb)[0]])((mod2 = { exports: {} }).exports, mod2), mod2.exports;
};

// ../../../../../yanshilu重新来过/针对无法启动的修改/node_modules/lottie-miniprogram/miniprogram_dist/index.js
var require_miniprogram_dist = __commonJS({
  "../../../../../yanshilu重新来过/针对无法启动的修改/node_modules/lottie-miniprogram/miniprogram_dist/index.js"(exports, module) {
    !function(t, e) {
      for (var r in e)
        t[r] = e[r];
    }(exports, function(t) {
      var e = {};
      function r(i2) {
        if (e[i2])
          return e[i2].exports;
        var s = e[i2] = { i: i2, l: false, exports: {} };
        return t[i2].call(s.exports, s, s.exports, r), s.l = true, s.exports;
      }
      return r.m = t, r.c = e, r.d = function(t2, e2, i2) {
        r.o(t2, e2) || Object.defineProperty(t2, e2, { enumerable: true, get: i2 });
      }, r.r = function(t2) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(t2, "__esModule", { value: true });
      }, r.t = function(t2, e2) {
        if (1 & e2 && (t2 = r(t2)), 8 & e2)
          return t2;
        if (4 & e2 && "object" == typeof t2 && t2 && t2.__esModule)
          return t2;
        var i2 = /* @__PURE__ */ Object.create(null);
        if (r.r(i2), Object.defineProperty(i2, "default", { enumerable: true, value: t2 }), 2 & e2 && "string" != typeof t2)
          for (var s in t2)
            r.d(i2, s, (function(e3) {
              return t2[e3];
            }).bind(null, s));
        return i2;
      }, r.n = function(t2) {
        var e2 = t2 && t2.__esModule ? function() {
          return t2.default;
        } : function() {
          return t2;
        };
        return r.d(e2, "a", e2), e2;
      }, r.o = function(t2, e2) {
        return Object.prototype.hasOwnProperty.call(t2, e2);
      }, r.p = "", r(r.s = 1);
    }([function(t, e, r) {
      "use strict";
      function i2(t2, e2) {
        for (var r2 = 0; r2 < e2.length; r2++) {
          var i3 = e2[r2];
          i3.enumerable = i3.enumerable || false, i3.configurable = true, "value" in i3 && (i3.writable = true), Object.defineProperty(t2, i3.key, i3);
        }
      }
      function s(t2, e2, r2) {
        return e2 in t2 ? Object.defineProperty(t2, e2, { value: r2, enumerable: true, configurable: true, writable: true }) : t2[e2] = r2, t2;
      }
      r.d(e, "c", function() {
        return _;
      }), r.d(e, "b", function() {
        return x;
      }), r.d(e, "a", function() {
        return P;
      });
      var a = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap(), o = /* @__PURE__ */ new WeakMap(), h = /* @__PURE__ */ new WeakMap(), l = /* @__PURE__ */ new WeakMap();
      function p(t2) {
        if ("function" == typeof this["on".concat(t2)]) {
          for (var e2 = arguments.length, r2 = new Array(e2 > 1 ? e2 - 1 : 0), i3 = 1; i3 < e2; i3++)
            r2[i3 - 1] = arguments[i3];
          this["on".concat(t2)].apply(this, r2);
        }
      }
      function f(t2) {
        this.readyState = t2, p.call(this, "readystatechange");
      }
      var m = function() {
        function t2() {
          !function(t3, e3) {
            if (!(t3 instanceof e3))
              throw new TypeError("Cannot call a class as a function");
          }(this, t2), s(this, "onabort", null), s(this, "onerror", null), s(this, "onload", null), s(this, "onloadstart", null), s(this, "onprogress", null), s(this, "ontimeout", null), s(this, "onloadend", null), s(this, "onreadystatechange", null), s(this, "readyState", 0), s(this, "response", null), s(this, "responseText", null), s(this, "responseType", ""), s(this, "responseXML", null), s(this, "status", 0), s(this, "statusText", ""), s(this, "upload", {}), s(this, "withCredentials", false), o.set(this, { "content-type": "application/x-www-form-urlencoded" }), h.set(this, {});
        }
        var e2, r2, m2;
        return e2 = t2, (r2 = [{ key: "abort", value: function() {
          var t3 = l.get(this);
          t3 && t3.abort();
        } }, { key: "getAllResponseHeaders", value: function() {
          var t3 = h.get(this);
          return Object.keys(t3).map(function(e3) {
            return "".concat(e3, ": ").concat(t3[e3]);
          }).join("\n");
        } }, { key: "getResponseHeader", value: function(t3) {
          return h.get(this)[t3];
        } }, { key: "open", value: function(e3, r3) {
          n.set(this, e3), a.set(this, r3), f.call(this, t2.OPENED);
        } }, { key: "overrideMimeType", value: function() {
        } }, { key: "send", value: function() {
          var e3 = this, r3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "";
          if (this.readyState !== t2.OPENED)
            throw new Error("Failed to execute 'send' on 'XMLHttpRequest': The object's state must be OPENED.");
          wx.request({ data: r3, url: a.get(this), method: n.get(this), header: o.get(this), success: function(r4) {
            var i3 = r4.data, s2 = r4.statusCode, a2 = r4.header;
            if ("string" != typeof i3 && !(i3 instanceof ArrayBuffer))
              try {
                i3 = JSON.stringify(i3);
              } catch (t3) {
              }
            if (e3.status = s2, h.set(e3, a2), p.call(e3, "loadstart"), f.call(e3, t2.HEADERS_RECEIVED), f.call(e3, t2.LOADING), e3.response = i3, i3 instanceof ArrayBuffer) {
              e3.responseText = "";
              for (var n2 = new Uint8Array(i3), o2 = n2.byteLength, l2 = 0; l2 < o2; l2++)
                e3.responseText += String.fromCharCode(n2[l2]);
            } else
              e3.responseText = i3;
            f.call(e3, t2.DONE), p.call(e3, "load"), p.call(e3, "loadend");
          }, fail: function(t3) {
            var r4 = t3.errMsg;
            -1 !== r4.indexOf("abort") ? p.call(e3, "abort") : p.call(e3, "error", r4), p.call(e3, "loadend");
          } });
        } }, { key: "setRequestHeader", value: function(t3, e3) {
          var r3 = o.get(this);
          r3[t3] = e3, o.set(this, r3);
        } }]) && i2(e2.prototype, r2), m2 && i2(e2, m2), t2;
      }();
      function c() {
      }
      function d() {
        console.error("小程序由于不支持动态创建 canvas 的能力，故 lottie 中有关图片处理的操作无法支持，请保持图片的原始宽高与 JSON 描述的一致，避免需要对图片处理");
      }
      function u(t2) {
        return "canvas" === t2 ? (console.warn("发现 Lottie 动态创建 canvas 组件，但小程序不支持动态创建组件，接下来可能会出现异常"), { getContext: function() {
          return { fillRect: c, createImage: d, drawImage: d };
        } }) : "img" === t2 ? function(t3) {
          if (void 0 === t3.createImage)
            return {};
          var e2 = t3.createImage();
          return e2.addEventListener = e2.addEventListener || function(t4, r2) {
            "load" === t4 ? e2.onload = function() {
              setTimeout(r2, 0);
            } : "error" === t4 && (e2.onerror = r2);
          }, e2;
        }(this) : void 0;
      }
      function y(t2, e2) {
        return function(r2) {
          return e2.call(t2, Array.from(r2));
        };
      }
      function g(t2, e2) {
        return function() {
          return e2.call(t2);
        };
      }
      function v(t2, e2, r2) {
        var i3 = t2[e2];
        t2[e2] = r2(t2, i3);
      }
      s(m, "UNSEND", 0), s(m, "OPENED", 1), s(m, "HEADERS_RECEIVED", 2), s(m, "LOADING", 3), s(m, "DONE", 4);
      var b = wx.getSystemInfoSync(), P = { requestAnimationFrame: function(t2) {
        setTimeout(function() {
          "function" == typeof t2 && t2(Date.now());
        }, 16);
      } };
      P.window = { devicePixelRatio: b.pixelRatio }, P.document = P.window.document = { body: {}, createElement: u }, P.navigator = P.window.navigator = { userAgent: "" }, XMLHttpRequest = m;
      var _ = function(t2) {
        var e2 = P.window, r2 = P.document;
        P._requestAnimationFrame = e2.requestAnimationFrame, P._cancelAnimationFrame = e2.cancelAnimationFrame, e2.requestAnimationFrame = function(e3) {
          var r3 = false;
          setTimeout(function() {
            r3 || (r3 = true, "function" == typeof e3 && e3(Date.now()));
          }, 100), t2.requestAnimationFrame(function(t3) {
            r3 || (r3 = true, "function" == typeof e3 && e3(t3));
          });
        }, e2.cancelAnimationFrame = t2.cancelAnimationFrame.bind(t2), P._body = r2.body, P._createElement = r2.createElement, r2.body = {}, r2.createElement = u.bind(t2);
        var i3 = t2.getContext("2d");
        i3.canvas || (i3.canvas = t2), v(i3, "setLineDash", y), v(i3, "fill", g);
      }, x = function() {
        var t2 = P.window, e2 = P.document;
        t2.requestAnimationFrame = P._requestAnimationFrame, t2.cancelAnimationFrame = P._cancelAnimationFrame, e2.body = P._body, e2.createElement = P._createElement;
      };
    }, function(module, __webpack_exports__, __webpack_require__) {
      "use strict";
      __webpack_require__.r(__webpack_exports__), (function(module) {
        __webpack_require__.d(__webpack_exports__, "loadAnimation", function() {
          return loadAnimation;
        }), __webpack_require__.d(__webpack_exports__, "freeze", function() {
          return freeze;
        }), __webpack_require__.d(__webpack_exports__, "unfreeze", function() {
          return unfreeze;
        });
        var _adapter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
        function _typeof(t) {
          return (_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t2) {
            return typeof t2;
          } : function(t2) {
            return t2 && "function" == typeof Symbol && t2.constructor === Symbol && t2 !== Symbol.prototype ? "symbol" : typeof t2;
          })(t);
        }
        __webpack_require__.d(__webpack_exports__, "setup", function() {
          return _adapter__WEBPACK_IMPORTED_MODULE_0__.c;
        });
        var window = _adapter__WEBPACK_IMPORTED_MODULE_0__.a.window, document = _adapter__WEBPACK_IMPORTED_MODULE_0__.a.document, navigator = _adapter__WEBPACK_IMPORTED_MODULE_0__.a.navigator;
        function loadAnimation(t) {
          if (["wrapper", "container"].forEach(function(e2) {
            if (e2 in t)
              throw new Error("Not support '".concat(e2, "' parameter in miniprogram version of lottie."));
          }), "string" == typeof t.path && !/^https?\:\/\//.test(t.path))
            throw new Error("The 'path' is only support http protocol.");
          if (!t.rendererSettings || !t.rendererSettings.context)
            throw new Error("Parameter 'rendererSettings.context' should be a CanvasRenderingContext2D.");
          t.renderer = "canvas";
          var e = window.lottie.loadAnimation(t), r = e.destroy.bind(e);
          return e.destroy = (function() {
            Object(_adapter__WEBPACK_IMPORTED_MODULE_0__.b)(), e.renderer && !e.renderer.destroyed && (e.renderer.renderConfig.clearCanvas = false), r();
          }).bind(e), e;
        }
        void 0 !== navigator && function(t, e) {
          "object" === _typeof(module) && module.exports ? module.exports = e(t) : (t.lottie = e(t), t.bodymovin = t.lottie);
        }(window || {}, function(window) {
          var svgNS = "http://www.w3.org/2000/svg", locationHref = "", initialDefaultFrame = -999999, subframeEnabled = true, expressionsPlugin, isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent), cachedColors = {}, bm_rounder = Math.round, bm_rnd, bm_pow = Math.pow, bm_sqrt = Math.sqrt, bm_abs = Math.abs, bm_floor = Math.floor, bm_max = Math.max, bm_min = Math.min, blitter = 10, BMMath = {};
          function ProjectInterface() {
            return {};
          }
          !function() {
            var t, e = ["abs", "acos", "acosh", "asin", "asinh", "atan", "atanh", "atan2", "ceil", "cbrt", "expm1", "clz32", "cos", "cosh", "exp", "floor", "fround", "hypot", "imul", "log", "log1p", "log2", "log10", "max", "min", "pow", "random", "round", "sign", "sin", "sinh", "sqrt", "tan", "tanh", "trunc", "E", "LN10", "LN2", "LOG10E", "LOG2E", "PI", "SQRT1_2", "SQRT2"], r = e.length;
            for (t = 0; t < r; t += 1)
              BMMath[e[t]] = Math[e[t]];
          }(), BMMath.random = Math.random, BMMath.abs = function(t) {
            if ("object" === _typeof(t) && t.length) {
              var e, r = createSizedArray(t.length), i2 = t.length;
              for (e = 0; e < i2; e += 1)
                r[e] = Math.abs(t[e]);
              return r;
            }
            return Math.abs(t);
          };
          var defaultCurveSegments = 150, degToRads = Math.PI / 180, roundCorner = 0.5519;
          function roundValues(t) {
            bm_rnd = t ? Math.round : function(t2) {
              return t2;
            };
          }
          function styleDiv(t) {
            t.style.position = "absolute", t.style.top = 0, t.style.left = 0, t.style.display = "block", t.style.transformOrigin = t.style.webkitTransformOrigin = "0 0", t.style.backfaceVisibility = t.style.webkitBackfaceVisibility = "visible", t.style.transformStyle = t.style.webkitTransformStyle = t.style.mozTransformStyle = "preserve-3d";
          }
          function BMEnterFrameEvent(t, e, r, i2) {
            this.type = t, this.currentTime = e, this.totalTime = r, this.direction = i2 < 0 ? -1 : 1;
          }
          function BMCompleteEvent(t, e) {
            this.type = t, this.direction = e < 0 ? -1 : 1;
          }
          function BMCompleteLoopEvent(t, e, r, i2) {
            this.type = t, this.currentLoop = r, this.totalLoops = e, this.direction = i2 < 0 ? -1 : 1;
          }
          function BMSegmentStartEvent(t, e, r) {
            this.type = t, this.firstFrame = e, this.totalFrames = r;
          }
          function BMDestroyEvent(t, e) {
            this.type = t, this.target = e;
          }
          roundValues(false);
          var createElementID = (_count = 0, function() {
            return "__lottie_element_" + ++_count;
          }), _count;
          function HSVtoRGB(t, e, r) {
            var i2, s, a, n, o, h, l, p;
            switch (h = r * (1 - e), l = r * (1 - (o = 6 * t - (n = Math.floor(6 * t))) * e), p = r * (1 - (1 - o) * e), n % 6) {
              case 0:
                i2 = r, s = p, a = h;
                break;
              case 1:
                i2 = l, s = r, a = h;
                break;
              case 2:
                i2 = h, s = r, a = p;
                break;
              case 3:
                i2 = h, s = l, a = r;
                break;
              case 4:
                i2 = p, s = h, a = r;
                break;
              case 5:
                i2 = r, s = h, a = l;
            }
            return [i2, s, a];
          }
          function RGBtoHSV(t, e, r) {
            var i2, s = Math.max(t, e, r), a = Math.min(t, e, r), n = s - a, o = 0 === s ? 0 : n / s, h = s / 255;
            switch (s) {
              case a:
                i2 = 0;
                break;
              case t:
                i2 = e - r + n * (e < r ? 6 : 0), i2 /= 6 * n;
                break;
              case e:
                i2 = r - t + 2 * n, i2 /= 6 * n;
                break;
              case r:
                i2 = t - e + 4 * n, i2 /= 6 * n;
            }
            return [i2, o, h];
          }
          function addSaturationToRGB(t, e) {
            var r = RGBtoHSV(255 * t[0], 255 * t[1], 255 * t[2]);
            return r[1] += e, r[1] > 1 ? r[1] = 1 : r[1] <= 0 && (r[1] = 0), HSVtoRGB(r[0], r[1], r[2]);
          }
          function addBrightnessToRGB(t, e) {
            var r = RGBtoHSV(255 * t[0], 255 * t[1], 255 * t[2]);
            return r[2] += e, r[2] > 1 ? r[2] = 1 : r[2] < 0 && (r[2] = 0), HSVtoRGB(r[0], r[1], r[2]);
          }
          function addHueToRGB(t, e) {
            var r = RGBtoHSV(255 * t[0], 255 * t[1], 255 * t[2]);
            return r[0] += e / 360, r[0] > 1 ? r[0] -= 1 : r[0] < 0 && (r[0] += 1), HSVtoRGB(r[0], r[1], r[2]);
          }
          var rgbToHex = function() {
            var t, e, r = [];
            for (t = 0; t < 256; t += 1)
              e = t.toString(16), r[t] = 1 == e.length ? "0" + e : e;
            return function(t2, e2, i2) {
              return t2 < 0 && (t2 = 0), e2 < 0 && (e2 = 0), i2 < 0 && (i2 = 0), "#" + r[t2] + r[e2] + r[i2];
            };
          }();
          function BaseEvent() {
          }
          BaseEvent.prototype = { triggerEvent: function(t, e) {
            if (this._cbs[t])
              for (var r = this._cbs[t].length, i2 = 0; i2 < r; i2++)
                this._cbs[t][i2](e);
          }, addEventListener: function(t, e) {
            return this._cbs[t] || (this._cbs[t] = []), this._cbs[t].push(e), (function() {
              this.removeEventListener(t, e);
            }).bind(this);
          }, removeEventListener: function(t, e) {
            if (e) {
              if (this._cbs[t]) {
                for (var r = 0, i2 = this._cbs[t].length; r < i2; )
                  this._cbs[t][r] === e && (this._cbs[t].splice(r, 1), r -= 1, i2 -= 1), r += 1;
                this._cbs[t].length || (this._cbs[t] = null);
              }
            } else
              this._cbs[t] = null;
          } };
          var createTypedArray = "function" == typeof Uint8ClampedArray && "function" == typeof Float32Array ? function(t, e) {
            return "float32" === t ? new Float32Array(e) : "int16" === t ? new Int16Array(e) : "uint8c" === t ? new Uint8ClampedArray(e) : void 0;
          } : function(t, e) {
            var r, i2 = 0, s = [];
            switch (t) {
              case "int16":
              case "uint8c":
                r = 1;
                break;
              default:
                r = 1.1;
            }
            for (i2 = 0; i2 < e; i2 += 1)
              s.push(r);
            return s;
          };
          function createSizedArray(t) {
            return Array.apply(null, { length: t });
          }
          function createTag(t) {
            return document.createElement(t);
          }
          function DynamicPropertyContainer() {
          }
          DynamicPropertyContainer.prototype = { addDynamicProperty: function(t) {
            -1 === this.dynamicProperties.indexOf(t) && (this.dynamicProperties.push(t), this.container.addDynamicProperty(this), this._isAnimated = true);
          }, iterateDynamicProperties: function() {
            this._mdf = false;
            var t, e = this.dynamicProperties.length;
            for (t = 0; t < e; t += 1)
              this.dynamicProperties[t].getValue(), this.dynamicProperties[t]._mdf && (this._mdf = true);
          }, initDynamicPropertyContainer: function(t) {
            this.container = t, this.dynamicProperties = [], this._mdf = false, this._isAnimated = false;
          } };
          var getBlendMode = (blendModeEnums = { 0: "source-over", 1: "multiply", 2: "screen", 3: "overlay", 4: "darken", 5: "lighten", 6: "color-dodge", 7: "color-burn", 8: "hard-light", 9: "soft-light", 10: "difference", 11: "exclusion", 12: "hue", 13: "saturation", 14: "color", 15: "luminosity" }, function(t) {
            return blendModeEnums[t] || "";
          }), blendModeEnums, Matrix = /* @__PURE__ */ function() {
            var t = Math.cos, e = Math.sin, r = Math.tan, i2 = Math.round;
            function s() {
              return this.props[0] = 1, this.props[1] = 0, this.props[2] = 0, this.props[3] = 0, this.props[4] = 0, this.props[5] = 1, this.props[6] = 0, this.props[7] = 0, this.props[8] = 0, this.props[9] = 0, this.props[10] = 1, this.props[11] = 0, this.props[12] = 0, this.props[13] = 0, this.props[14] = 0, this.props[15] = 1, this;
            }
            function a(r2) {
              if (0 === r2)
                return this;
              var i3 = t(r2), s2 = e(r2);
              return this._t(i3, -s2, 0, 0, s2, i3, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
            }
            function n(r2) {
              if (0 === r2)
                return this;
              var i3 = t(r2), s2 = e(r2);
              return this._t(1, 0, 0, 0, 0, i3, -s2, 0, 0, s2, i3, 0, 0, 0, 0, 1);
            }
            function o(r2) {
              if (0 === r2)
                return this;
              var i3 = t(r2), s2 = e(r2);
              return this._t(i3, 0, s2, 0, 0, 1, 0, 0, -s2, 0, i3, 0, 0, 0, 0, 1);
            }
            function h(r2) {
              if (0 === r2)
                return this;
              var i3 = t(r2), s2 = e(r2);
              return this._t(i3, -s2, 0, 0, s2, i3, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
            }
            function l(t2, e2) {
              return this._t(1, e2, t2, 1, 0, 0);
            }
            function p(t2, e2) {
              return this.shear(r(t2), r(e2));
            }
            function f(i3, s2) {
              var a2 = t(s2), n2 = e(s2);
              return this._t(a2, n2, 0, 0, -n2, a2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)._t(1, 0, 0, 0, r(i3), 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)._t(a2, -n2, 0, 0, n2, a2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
            }
            function m(t2, e2, r2) {
              return r2 || 0 === r2 || (r2 = 1), 1 === t2 && 1 === e2 && 1 === r2 ? this : this._t(t2, 0, 0, 0, 0, e2, 0, 0, 0, 0, r2, 0, 0, 0, 0, 1);
            }
            function c(t2, e2, r2, i3, s2, a2, n2, o2, h2, l2, p2, f2, m2, c2, d2, u2) {
              return this.props[0] = t2, this.props[1] = e2, this.props[2] = r2, this.props[3] = i3, this.props[4] = s2, this.props[5] = a2, this.props[6] = n2, this.props[7] = o2, this.props[8] = h2, this.props[9] = l2, this.props[10] = p2, this.props[11] = f2, this.props[12] = m2, this.props[13] = c2, this.props[14] = d2, this.props[15] = u2, this;
            }
            function d(t2, e2, r2) {
              return r2 = r2 || 0, 0 !== t2 || 0 !== e2 || 0 !== r2 ? this._t(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, t2, e2, r2, 1) : this;
            }
            function u(t2, e2, r2, i3, s2, a2, n2, o2, h2, l2, p2, f2, m2, c2, d2, u2) {
              var y2 = this.props;
              if (1 === t2 && 0 === e2 && 0 === r2 && 0 === i3 && 0 === s2 && 1 === a2 && 0 === n2 && 0 === o2 && 0 === h2 && 0 === l2 && 1 === p2 && 0 === f2)
                return y2[12] = y2[12] * t2 + y2[15] * m2, y2[13] = y2[13] * a2 + y2[15] * c2, y2[14] = y2[14] * p2 + y2[15] * d2, y2[15] = y2[15] * u2, this._identityCalculated = false, this;
              var g2 = y2[0], v2 = y2[1], b2 = y2[2], P2 = y2[3], _2 = y2[4], x2 = y2[5], S2 = y2[6], E2 = y2[7], T2 = y2[8], C2 = y2[9], A2 = y2[10], k2 = y2[11], D2 = y2[12], M2 = y2[13], I2 = y2[14], w = y2[15];
              return y2[0] = g2 * t2 + v2 * s2 + b2 * h2 + P2 * m2, y2[1] = g2 * e2 + v2 * a2 + b2 * l2 + P2 * c2, y2[2] = g2 * r2 + v2 * n2 + b2 * p2 + P2 * d2, y2[3] = g2 * i3 + v2 * o2 + b2 * f2 + P2 * u2, y2[4] = _2 * t2 + x2 * s2 + S2 * h2 + E2 * m2, y2[5] = _2 * e2 + x2 * a2 + S2 * l2 + E2 * c2, y2[6] = _2 * r2 + x2 * n2 + S2 * p2 + E2 * d2, y2[7] = _2 * i3 + x2 * o2 + S2 * f2 + E2 * u2, y2[8] = T2 * t2 + C2 * s2 + A2 * h2 + k2 * m2, y2[9] = T2 * e2 + C2 * a2 + A2 * l2 + k2 * c2, y2[10] = T2 * r2 + C2 * n2 + A2 * p2 + k2 * d2, y2[11] = T2 * i3 + C2 * o2 + A2 * f2 + k2 * u2, y2[12] = D2 * t2 + M2 * s2 + I2 * h2 + w * m2, y2[13] = D2 * e2 + M2 * a2 + I2 * l2 + w * c2, y2[14] = D2 * r2 + M2 * n2 + I2 * p2 + w * d2, y2[15] = D2 * i3 + M2 * o2 + I2 * f2 + w * u2, this._identityCalculated = false, this;
            }
            function y() {
              return this._identityCalculated || (this._identity = !(1 !== this.props[0] || 0 !== this.props[1] || 0 !== this.props[2] || 0 !== this.props[3] || 0 !== this.props[4] || 1 !== this.props[5] || 0 !== this.props[6] || 0 !== this.props[7] || 0 !== this.props[8] || 0 !== this.props[9] || 1 !== this.props[10] || 0 !== this.props[11] || 0 !== this.props[12] || 0 !== this.props[13] || 0 !== this.props[14] || 1 !== this.props[15]), this._identityCalculated = true), this._identity;
            }
            function g(t2) {
              for (var e2 = 0; e2 < 16; ) {
                if (t2.props[e2] !== this.props[e2])
                  return false;
                e2 += 1;
              }
              return true;
            }
            function v(t2) {
              var e2;
              for (e2 = 0; e2 < 16; e2 += 1)
                t2.props[e2] = this.props[e2];
            }
            function b(t2) {
              var e2;
              for (e2 = 0; e2 < 16; e2 += 1)
                this.props[e2] = t2[e2];
            }
            function P(t2, e2, r2) {
              return { x: t2 * this.props[0] + e2 * this.props[4] + r2 * this.props[8] + this.props[12], y: t2 * this.props[1] + e2 * this.props[5] + r2 * this.props[9] + this.props[13], z: t2 * this.props[2] + e2 * this.props[6] + r2 * this.props[10] + this.props[14] };
            }
            function _(t2, e2, r2) {
              return t2 * this.props[0] + e2 * this.props[4] + r2 * this.props[8] + this.props[12];
            }
            function x(t2, e2, r2) {
              return t2 * this.props[1] + e2 * this.props[5] + r2 * this.props[9] + this.props[13];
            }
            function S(t2, e2, r2) {
              return t2 * this.props[2] + e2 * this.props[6] + r2 * this.props[10] + this.props[14];
            }
            function E(t2) {
              var e2 = this.props[0] * this.props[5] - this.props[1] * this.props[4], r2 = this.props[5] / e2, i3 = -this.props[1] / e2, s2 = -this.props[4] / e2, a2 = this.props[0] / e2, n2 = (this.props[4] * this.props[13] - this.props[5] * this.props[12]) / e2, o2 = -(this.props[0] * this.props[13] - this.props[1] * this.props[12]) / e2;
              return [t2[0] * r2 + t2[1] * s2 + n2, t2[0] * i3 + t2[1] * a2 + o2, 0];
            }
            function T(t2) {
              var e2, r2 = t2.length, i3 = [];
              for (e2 = 0; e2 < r2; e2 += 1)
                i3[e2] = E(t2[e2]);
              return i3;
            }
            function C(t2, e2, r2) {
              var i3 = createTypedArray("float32", 6);
              if (this.isIdentity())
                i3[0] = t2[0], i3[1] = t2[1], i3[2] = e2[0], i3[3] = e2[1], i3[4] = r2[0], i3[5] = r2[1];
              else {
                var s2 = this.props[0], a2 = this.props[1], n2 = this.props[4], o2 = this.props[5], h2 = this.props[12], l2 = this.props[13];
                i3[0] = t2[0] * s2 + t2[1] * n2 + h2, i3[1] = t2[0] * a2 + t2[1] * o2 + l2, i3[2] = e2[0] * s2 + e2[1] * n2 + h2, i3[3] = e2[0] * a2 + e2[1] * o2 + l2, i3[4] = r2[0] * s2 + r2[1] * n2 + h2, i3[5] = r2[0] * a2 + r2[1] * o2 + l2;
              }
              return i3;
            }
            function A(t2, e2, r2) {
              return this.isIdentity() ? [t2, e2, r2] : [t2 * this.props[0] + e2 * this.props[4] + r2 * this.props[8] + this.props[12], t2 * this.props[1] + e2 * this.props[5] + r2 * this.props[9] + this.props[13], t2 * this.props[2] + e2 * this.props[6] + r2 * this.props[10] + this.props[14]];
            }
            function k(t2, e2) {
              if (this.isIdentity())
                return t2 + "," + e2;
              var r2 = this.props;
              return Math.round(100 * (t2 * r2[0] + e2 * r2[4] + r2[12])) / 100 + "," + Math.round(100 * (t2 * r2[1] + e2 * r2[5] + r2[13])) / 100;
            }
            function D() {
              for (var t2 = 0, e2 = this.props, r2 = "matrix3d("; t2 < 16; )
                r2 += i2(1e4 * e2[t2]) / 1e4, r2 += 15 === t2 ? ")" : ",", t2 += 1;
              return r2;
            }
            function M(t2) {
              return t2 < 1e-6 && t2 > 0 || t2 > -1e-6 && t2 < 0 ? i2(1e4 * t2) / 1e4 : t2;
            }
            function I() {
              var t2 = this.props;
              return "matrix(" + M(t2[0]) + "," + M(t2[1]) + "," + M(t2[4]) + "," + M(t2[5]) + "," + M(t2[12]) + "," + M(t2[13]) + ")";
            }
            return function() {
              this.reset = s, this.rotate = a, this.rotateX = n, this.rotateY = o, this.rotateZ = h, this.skew = p, this.skewFromAxis = f, this.shear = l, this.scale = m, this.setTransform = c, this.translate = d, this.transform = u, this.applyToPoint = P, this.applyToX = _, this.applyToY = x, this.applyToZ = S, this.applyToPointArray = A, this.applyToTriplePoints = C, this.applyToPointStringified = k, this.toCSS = D, this.to2dCSS = I, this.clone = v, this.cloneFromProps = b, this.equals = g, this.inversePoints = T, this.inversePoint = E, this._t = this.transform, this.isIdentity = y, this._identity = true, this._identityCalculated = false, this.props = createTypedArray("float32", 16), this.reset();
            };
          }();
          !function(t, e) {
            var r = this, i2 = e.pow(256, 6), s = e.pow(2, 52), a = 2 * s;
            function n(t2) {
              var e2, r2 = t2.length, i3 = this, s2 = 0, a2 = i3.i = i3.j = 0, n2 = i3.S = [];
              for (r2 || (t2 = [r2++]); s2 < 256; )
                n2[s2] = s2++;
              for (s2 = 0; s2 < 256; s2++)
                n2[s2] = n2[a2 = 255 & a2 + t2[s2 % r2] + (e2 = n2[s2])], n2[a2] = e2;
              i3.g = function(t3) {
                for (var e3, r3 = 0, s3 = i3.i, a3 = i3.j, n3 = i3.S; t3--; )
                  e3 = n3[s3 = 255 & s3 + 1], r3 = 256 * r3 + n3[255 & (n3[s3] = n3[a3 = 255 & a3 + e3]) + (n3[a3] = e3)];
                return i3.i = s3, i3.j = a3, r3;
              };
            }
            function o(t2, e2) {
              return e2.i = t2.i, e2.j = t2.j, e2.S = t2.S.slice(), e2;
            }
            function h(t2, e2) {
              for (var r2, i3 = t2 + "", s2 = 0; s2 < i3.length; )
                e2[255 & s2] = 255 & (r2 ^= 19 * e2[255 & s2]) + i3.charCodeAt(s2++);
              return l(e2);
            }
            function l(t2) {
              return String.fromCharCode.apply(0, t2);
            }
            e.seedrandom = function(p, f, m) {
              var c = [], d = h(function t2(e2, r2) {
                var i3, s2 = [], a2 = _typeof(e2);
                if (r2 && "object" == a2)
                  for (i3 in e2)
                    try {
                      s2.push(t2(e2[i3], r2 - 1));
                    } catch (t3) {
                    }
                return s2.length ? s2 : "string" == a2 ? e2 : e2 + "\0";
              }((f = true === f ? { entropy: true } : f || {}).entropy ? [p, l(t)] : null === p ? function() {
                try {
                  var e2 = new Uint8Array(256);
                  return (r.crypto || r.msCrypto).getRandomValues(e2), l(e2);
                } catch (e3) {
                  var i3 = r.navigator, s2 = i3 && i3.plugins;
                  return [+/* @__PURE__ */ new Date(), r, s2, r.screen, l(t)];
                }
              }() : p, 3), c), u = new n(c), y = function() {
                for (var t2 = u.g(6), e2 = i2, r2 = 0; t2 < s; )
                  t2 = 256 * (t2 + r2), e2 *= 256, r2 = u.g(1);
                for (; t2 >= a; )
                  t2 /= 2, e2 /= 2, r2 >>>= 1;
                return (t2 + r2) / e2;
              };
              return y.int32 = function() {
                return 0 | u.g(4);
              }, y.quick = function() {
                return u.g(4) / 4294967296;
              }, y.double = y, h(l(u.S), t), (f.pass || m || function(t2, r2, i3, s2) {
                return s2 && (s2.S && o(s2, u), t2.state = function() {
                  return o(u, {});
                }), i3 ? (e.random = t2, r2) : t2;
              })(y, d, "global" in f ? f.global : this == e, f.state);
            }, h(e.random(), t);
          }([], BMMath);
          var BezierFactory = function() {
            var t = { getBezierEasing: function(t2, r2, i3, s2, a2) {
              var n2 = a2 || ("bez_" + t2 + "_" + r2 + "_" + i3 + "_" + s2).replace(/\./g, "p");
              if (e[n2])
                return e[n2];
              var o2 = new h([t2, r2, i3, s2]);
              return e[n2] = o2, o2;
            } }, e = {};
            var r = "function" == typeof Float32Array;
            function i2(t2, e2) {
              return 1 - 3 * e2 + 3 * t2;
            }
            function s(t2, e2) {
              return 3 * e2 - 6 * t2;
            }
            function a(t2) {
              return 3 * t2;
            }
            function n(t2, e2, r2) {
              return ((i2(e2, r2) * t2 + s(e2, r2)) * t2 + a(e2)) * t2;
            }
            function o(t2, e2, r2) {
              return 3 * i2(e2, r2) * t2 * t2 + 2 * s(e2, r2) * t2 + a(e2);
            }
            function h(t2) {
              this._p = t2, this._mSampleValues = r ? new Float32Array(11) : new Array(11), this._precomputed = false, this.get = this.get.bind(this);
            }
            return h.prototype = { get: function(t2) {
              var e2 = this._p[0], r2 = this._p[1], i3 = this._p[2], s2 = this._p[3];
              return this._precomputed || this._precompute(), e2 === r2 && i3 === s2 ? t2 : 0 === t2 ? 0 : 1 === t2 ? 1 : n(this._getTForX(t2), r2, s2);
            }, _precompute: function() {
              var t2 = this._p[0], e2 = this._p[1], r2 = this._p[2], i3 = this._p[3];
              this._precomputed = true, t2 === e2 && r2 === i3 || this._calcSampleValues();
            }, _calcSampleValues: function() {
              for (var t2 = this._p[0], e2 = this._p[2], r2 = 0; r2 < 11; ++r2)
                this._mSampleValues[r2] = n(0.1 * r2, t2, e2);
            }, _getTForX: function(t2) {
              for (var e2 = this._p[0], r2 = this._p[2], i3 = this._mSampleValues, s2 = 0, a2 = 1; 10 !== a2 && i3[a2] <= t2; ++a2)
                s2 += 0.1;
              var h2 = s2 + 0.1 * ((t2 - i3[--a2]) / (i3[a2 + 1] - i3[a2])), l = o(h2, e2, r2);
              return l >= 1e-3 ? function(t3, e3, r3, i4) {
                for (var s3 = 0; s3 < 4; ++s3) {
                  var a3 = o(e3, r3, i4);
                  if (0 === a3)
                    return e3;
                  e3 -= (n(e3, r3, i4) - t3) / a3;
                }
                return e3;
              }(t2, h2, e2, r2) : 0 === l ? h2 : function(t3, e3, r3, i4, s3) {
                var a3, o2, h3 = 0;
                do {
                  (a3 = n(o2 = e3 + (r3 - e3) / 2, i4, s3) - t3) > 0 ? r3 = o2 : e3 = o2;
                } while (Math.abs(a3) > 1e-7 && ++h3 < 10);
                return o2;
              }(t2, s2, s2 + 0.1, e2, r2);
            } }, t;
          }();
          function extendPrototype(t, e) {
            var r, i2, s = t.length;
            for (r = 0; r < s; r += 1)
              for (var a in i2 = t[r].prototype)
                i2.hasOwnProperty(a) && (e.prototype[a] = i2[a]);
          }
          function getDescriptor(t, e) {
            return Object.getOwnPropertyDescriptor(t, e);
          }
          function createProxyFunction(t) {
            function e() {
            }
            return e.prototype = t, e;
          }
          function bezFunction() {
            Math;
            function t(t2, e2, r2, i3, s2, a2) {
              var n2 = t2 * i3 + e2 * s2 + r2 * a2 - s2 * i3 - a2 * t2 - r2 * e2;
              return n2 > -1e-3 && n2 < 1e-3;
            }
            var e = function(t2, e2, r2, i3) {
              var s2, a2, n2, o2, h, l, p = defaultCurveSegments, f = 0, m = [], c = [], d = bezier_length_pool.newElement();
              for (n2 = r2.length, s2 = 0; s2 < p; s2 += 1) {
                for (h = s2 / (p - 1), l = 0, a2 = 0; a2 < n2; a2 += 1)
                  o2 = bm_pow(1 - h, 3) * t2[a2] + 3 * bm_pow(1 - h, 2) * h * r2[a2] + 3 * (1 - h) * bm_pow(h, 2) * i3[a2] + bm_pow(h, 3) * e2[a2], m[a2] = o2, null !== c[a2] && (l += bm_pow(m[a2] - c[a2], 2)), c[a2] = m[a2];
                l && (f += l = bm_sqrt(l)), d.percents[s2] = h, d.lengths[s2] = f;
              }
              return d.addedLength = f, d;
            };
            function r(t2) {
              this.segmentLength = 0, this.points = new Array(t2);
            }
            function i2(t2, e2) {
              this.partialLength = t2, this.point = e2;
            }
            var s, a = (s = {}, function(e2, a2, n2, o2) {
              var h = (e2[0] + "_" + e2[1] + "_" + a2[0] + "_" + a2[1] + "_" + n2[0] + "_" + n2[1] + "_" + o2[0] + "_" + o2[1]).replace(/\./g, "p");
              if (!s[h]) {
                var l, p, f, m, c, d, u, y = defaultCurveSegments, g = 0, v = null;
                2 === e2.length && (e2[0] != a2[0] || e2[1] != a2[1]) && t(e2[0], e2[1], a2[0], a2[1], e2[0] + n2[0], e2[1] + n2[1]) && t(e2[0], e2[1], a2[0], a2[1], a2[0] + o2[0], a2[1] + o2[1]) && (y = 2);
                var b = new r(y);
                for (f = n2.length, l = 0; l < y; l += 1) {
                  for (u = createSizedArray(f), c = l / (y - 1), d = 0, p = 0; p < f; p += 1)
                    m = bm_pow(1 - c, 3) * e2[p] + 3 * bm_pow(1 - c, 2) * c * (e2[p] + n2[p]) + 3 * (1 - c) * bm_pow(c, 2) * (a2[p] + o2[p]) + bm_pow(c, 3) * a2[p], u[p] = m, null !== v && (d += bm_pow(u[p] - v[p], 2));
                  g += d = bm_sqrt(d), b.points[l] = new i2(d, u), v = u;
                }
                b.segmentLength = g, s[h] = b;
              }
              return s[h];
            });
            function n(t2, e2) {
              var r2 = e2.percents, i3 = e2.lengths, s2 = r2.length, a2 = bm_floor((s2 - 1) * t2), n2 = t2 * e2.addedLength, o2 = 0;
              if (a2 === s2 - 1 || 0 === a2 || n2 === i3[a2])
                return r2[a2];
              for (var h = i3[a2] > n2 ? -1 : 1, l = true; l; )
                if (i3[a2] <= n2 && i3[a2 + 1] > n2 ? (o2 = (n2 - i3[a2]) / (i3[a2 + 1] - i3[a2]), l = false) : a2 += h, a2 < 0 || a2 >= s2 - 1) {
                  if (a2 === s2 - 1)
                    return r2[a2];
                  l = false;
                }
              return r2[a2] + (r2[a2 + 1] - r2[a2]) * o2;
            }
            var o = createTypedArray("float32", 8);
            return { getSegmentsLength: function(t2) {
              var r2, i3 = segments_length_pool.newElement(), s2 = t2.c, a2 = t2.v, n2 = t2.o, o2 = t2.i, h = t2._length, l = i3.lengths, p = 0;
              for (r2 = 0; r2 < h - 1; r2 += 1)
                l[r2] = e(a2[r2], a2[r2 + 1], n2[r2], o2[r2 + 1]), p += l[r2].addedLength;
              return s2 && h && (l[r2] = e(a2[r2], a2[0], n2[r2], o2[0]), p += l[r2].addedLength), i3.totalLength = p, i3;
            }, getNewSegment: function(t2, e2, r2, i3, s2, a2, h) {
              var l, p = n(s2 = s2 < 0 ? 0 : s2 > 1 ? 1 : s2, h), f = n(a2 = a2 > 1 ? 1 : a2, h), m = t2.length, c = 1 - p, d = 1 - f, u = c * c * c, y = p * c * c * 3, g = p * p * c * 3, v = p * p * p, b = c * c * d, P = p * c * d + c * p * d + c * c * f, _ = p * p * d + c * p * f + p * c * f, x = p * p * f, S = c * d * d, E = p * d * d + c * f * d + c * d * f, T = p * f * d + c * f * f + p * d * f, C = p * f * f, A = d * d * d, k = f * d * d + d * f * d + d * d * f, D = f * f * d + d * f * f + f * d * f, M = f * f * f;
              for (l = 0; l < m; l += 1)
                o[4 * l] = Math.round(1e3 * (u * t2[l] + y * r2[l] + g * i3[l] + v * e2[l])) / 1e3, o[4 * l + 1] = Math.round(1e3 * (b * t2[l] + P * r2[l] + _ * i3[l] + x * e2[l])) / 1e3, o[4 * l + 2] = Math.round(1e3 * (S * t2[l] + E * r2[l] + T * i3[l] + C * e2[l])) / 1e3, o[4 * l + 3] = Math.round(1e3 * (A * t2[l] + k * r2[l] + D * i3[l] + M * e2[l])) / 1e3;
              return o;
            }, getPointInSegment: function(t2, e2, r2, i3, s2, a2) {
              var o2 = n(s2, a2), h = 1 - o2;
              return [Math.round(1e3 * (h * h * h * t2[0] + (o2 * h * h + h * o2 * h + h * h * o2) * r2[0] + (o2 * o2 * h + h * o2 * o2 + o2 * h * o2) * i3[0] + o2 * o2 * o2 * e2[0])) / 1e3, Math.round(1e3 * (h * h * h * t2[1] + (o2 * h * h + h * o2 * h + h * h * o2) * r2[1] + (o2 * o2 * h + h * o2 * o2 + o2 * h * o2) * i3[1] + o2 * o2 * o2 * e2[1])) / 1e3];
            }, buildBezierData: a, pointOnLine2D: t, pointOnLine3D: function(e2, r2, i3, s2, a2, n2, o2, h, l) {
              if (0 === i3 && 0 === n2 && 0 === l)
                return t(e2, r2, s2, a2, o2, h);
              var p, f = Math.sqrt(Math.pow(s2 - e2, 2) + Math.pow(a2 - r2, 2) + Math.pow(n2 - i3, 2)), m = Math.sqrt(Math.pow(o2 - e2, 2) + Math.pow(h - r2, 2) + Math.pow(l - i3, 2)), c = Math.sqrt(Math.pow(o2 - s2, 2) + Math.pow(h - a2, 2) + Math.pow(l - n2, 2));
              return (p = f > m ? f > c ? f - m - c : c - m - f : c > m ? c - m - f : m - f - c) > -1e-4 && p < 1e-4;
            } };
          }
          !function() {
            for (var t = 0, e = ["ms", "moz", "webkit", "o"], r = 0; r < e.length && !window.requestAnimationFrame; ++r)
              window.requestAnimationFrame = window[e[r] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[e[r] + "CancelAnimationFrame"] || window[e[r] + "CancelRequestAnimationFrame"];
            window.requestAnimationFrame || (window.requestAnimationFrame = function(e2, r2) {
              var i2 = (/* @__PURE__ */ new Date()).getTime(), s = Math.max(0, 16 - (i2 - t)), a = setTimeout(function() {
                e2(i2 + s);
              }, s);
              return t = i2 + s, a;
            }), window.cancelAnimationFrame || (window.cancelAnimationFrame = function(t2) {
              clearTimeout(t2);
            });
          }();
          var bez = bezFunction();
          function dataFunctionManager() {
            function t(t2, e2) {
              for (var r2 = 0, i3 = e2.length; r2 < i3; ) {
                if (e2[r2].id === t2)
                  return e2[r2].layers.__used ? JSON.parse(JSON.stringify(e2[r2].layers)) : (e2[r2].layers.__used = true, e2[r2].layers);
                r2 += 1;
              }
            }
            function e(t2) {
              var i3, s2, a2;
              for (i3 = t2.length - 1; i3 >= 0; i3 -= 1)
                if ("sh" == t2[i3].ty) {
                  if (t2[i3].ks.k.i)
                    r(t2[i3].ks.k);
                  else
                    for (a2 = t2[i3].ks.k.length, s2 = 0; s2 < a2; s2 += 1)
                      t2[i3].ks.k[s2].s && r(t2[i3].ks.k[s2].s[0]), t2[i3].ks.k[s2].e && r(t2[i3].ks.k[s2].e[0]);
                } else
                  "gr" == t2[i3].ty && e(t2[i3].it);
            }
            function r(t2) {
              var e2, r2 = t2.i.length;
              for (e2 = 0; e2 < r2; e2 += 1)
                t2.i[e2][0] += t2.v[e2][0], t2.i[e2][1] += t2.v[e2][1], t2.o[e2][0] += t2.v[e2][0], t2.o[e2][1] += t2.v[e2][1];
            }
            function i2(t2, e2) {
              var r2 = e2 ? e2.split(".") : [100, 100, 100];
              return t2[0] > r2[0] || !(r2[0] > t2[0]) && (t2[1] > r2[1] || !(r2[1] > t2[1]) && (t2[2] > r2[2] || !(r2[2] > t2[2]) && void 0));
            }
            var s, a = /* @__PURE__ */ function() {
              var t2 = [4, 4, 14];
              function e2(t3) {
                var e3, r2, i3, s2 = t3.length;
                for (e3 = 0; e3 < s2; e3 += 1)
                  5 === t3[e3].ty && (r2 = t3[e3], i3 = void 0, i3 = r2.t.d, r2.t.d = { k: [{ s: i3, t: 0 }] });
              }
              return function(r2) {
                if (i2(t2, r2.v) && (e2(r2.layers), r2.assets)) {
                  var s2, a2 = r2.assets.length;
                  for (s2 = 0; s2 < a2; s2 += 1)
                    r2.assets[s2].layers && e2(r2.assets[s2].layers);
                }
              };
            }(), n = (s = [4, 7, 99], function(t2) {
              if (t2.chars && !i2(s, t2.v)) {
                var e2, a2, n2, o2, h2, l2 = t2.chars.length;
                for (e2 = 0; e2 < l2; e2 += 1)
                  if (t2.chars[e2].data && t2.chars[e2].data.shapes)
                    for (n2 = (h2 = t2.chars[e2].data.shapes[0].it).length, a2 = 0; a2 < n2; a2 += 1)
                      (o2 = h2[a2].ks.k).__converted || (r(h2[a2].ks.k), o2.__converted = true);
              }
            }), o = /* @__PURE__ */ function() {
              var t2 = [4, 1, 9];
              function e2(t3) {
                var r3, i3, s2, a2 = t3.length;
                for (r3 = 0; r3 < a2; r3 += 1)
                  if ("gr" === t3[r3].ty)
                    e2(t3[r3].it);
                  else if ("fl" === t3[r3].ty || "st" === t3[r3].ty)
                    if (t3[r3].c.k && t3[r3].c.k[0].i)
                      for (s2 = t3[r3].c.k.length, i3 = 0; i3 < s2; i3 += 1)
                        t3[r3].c.k[i3].s && (t3[r3].c.k[i3].s[0] /= 255, t3[r3].c.k[i3].s[1] /= 255, t3[r3].c.k[i3].s[2] /= 255, t3[r3].c.k[i3].s[3] /= 255), t3[r3].c.k[i3].e && (t3[r3].c.k[i3].e[0] /= 255, t3[r3].c.k[i3].e[1] /= 255, t3[r3].c.k[i3].e[2] /= 255, t3[r3].c.k[i3].e[3] /= 255);
                    else
                      t3[r3].c.k[0] /= 255, t3[r3].c.k[1] /= 255, t3[r3].c.k[2] /= 255, t3[r3].c.k[3] /= 255;
              }
              function r2(t3) {
                var r3, i3 = t3.length;
                for (r3 = 0; r3 < i3; r3 += 1)
                  4 === t3[r3].ty && e2(t3[r3].shapes);
              }
              return function(e3) {
                if (i2(t2, e3.v) && (r2(e3.layers), e3.assets)) {
                  var s2, a2 = e3.assets.length;
                  for (s2 = 0; s2 < a2; s2 += 1)
                    e3.assets[s2].layers && r2(e3.assets[s2].layers);
                }
              };
            }(), h = /* @__PURE__ */ function() {
              var t2 = [4, 4, 18];
              function e2(t3) {
                var r3, i3, s2;
                for (r3 = t3.length - 1; r3 >= 0; r3 -= 1)
                  if ("sh" == t3[r3].ty) {
                    if (t3[r3].ks.k.i)
                      t3[r3].ks.k.c = t3[r3].closed;
                    else
                      for (s2 = t3[r3].ks.k.length, i3 = 0; i3 < s2; i3 += 1)
                        t3[r3].ks.k[i3].s && (t3[r3].ks.k[i3].s[0].c = t3[r3].closed), t3[r3].ks.k[i3].e && (t3[r3].ks.k[i3].e[0].c = t3[r3].closed);
                  } else
                    "gr" == t3[r3].ty && e2(t3[r3].it);
              }
              function r2(t3) {
                var r3, i3, s2, a2, n2, o2, h2 = t3.length;
                for (i3 = 0; i3 < h2; i3 += 1) {
                  if ((r3 = t3[i3]).hasMask) {
                    var l2 = r3.masksProperties;
                    for (a2 = l2.length, s2 = 0; s2 < a2; s2 += 1)
                      if (l2[s2].pt.k.i)
                        l2[s2].pt.k.c = l2[s2].cl;
                      else
                        for (o2 = l2[s2].pt.k.length, n2 = 0; n2 < o2; n2 += 1)
                          l2[s2].pt.k[n2].s && (l2[s2].pt.k[n2].s[0].c = l2[s2].cl), l2[s2].pt.k[n2].e && (l2[s2].pt.k[n2].e[0].c = l2[s2].cl);
                  }
                  4 === r3.ty && e2(r3.shapes);
                }
              }
              return function(e3) {
                if (i2(t2, e3.v) && (r2(e3.layers), e3.assets)) {
                  var s2, a2 = e3.assets.length;
                  for (s2 = 0; s2 < a2; s2 += 1)
                    e3.assets[s2].layers && r2(e3.assets[s2].layers);
                }
              };
            }();
            function l(t2, e2) {
              0 !== t2.t.a.length || "m" in t2.t.p || (t2.singleShape = true);
            }
            var p = { completeData: function(i3, s2) {
              i3.__complete || (o(i3), a(i3), n(i3), h(i3), function i4(s3, a2, n2) {
                var o2, h2, p2, f, m, c, d = s3.length;
                for (h2 = 0; h2 < d; h2 += 1)
                  if ("ks" in (o2 = s3[h2]) && !o2.completed) {
                    if (o2.completed = true, o2.tt && (s3[h2 - 1].td = o2.tt), [], -1, o2.hasMask) {
                      var u = o2.masksProperties;
                      for (f = u.length, p2 = 0; p2 < f; p2 += 1)
                        if (u[p2].pt.k.i)
                          r(u[p2].pt.k);
                        else
                          for (c = u[p2].pt.k.length, m = 0; m < c; m += 1)
                            u[p2].pt.k[m].s && r(u[p2].pt.k[m].s[0]), u[p2].pt.k[m].e && r(u[p2].pt.k[m].e[0]);
                    }
                    0 === o2.ty ? (o2.layers = t(o2.refId, a2), i4(o2.layers, a2, n2)) : 4 === o2.ty ? e(o2.shapes) : 5 == o2.ty && l(o2, n2);
                  }
              }(i3.layers, i3.assets, s2), i3.__complete = true);
            } };
            return p;
          }
          var dataManager = dataFunctionManager(), FontManager = function() {
            var t = { w: 0, size: 0, shapes: [] }, e = [];
            function r(t2, e2) {
              var r2 = createTag("span");
              r2.style.fontFamily = e2;
              var i3 = createTag("span");
              i3.innerHTML = "giItT1WQy@!-/#", r2.style.position = "absolute", r2.style.left = "-10000px", r2.style.top = "-10000px", r2.style.fontSize = "300px", r2.style.fontVariant = "normal", r2.style.fontStyle = "normal", r2.style.fontWeight = "normal", r2.style.letterSpacing = "0", r2.appendChild(i3), document.body.appendChild(r2);
              var s2 = i3.offsetWidth;
              return i3.style.fontFamily = t2 + ", " + e2, { node: i3, w: s2, parent: r2 };
            }
            function i2(t2, e2) {
              var r2 = createNS("text");
              return r2.style.fontSize = "100px", r2.setAttribute("font-family", e2.fFamily), r2.setAttribute("font-style", e2.fStyle), r2.setAttribute("font-weight", e2.fWeight), r2.textContent = "1", e2.fClass ? (r2.style.fontFamily = "inherit", r2.setAttribute("class", e2.fClass)) : r2.style.fontFamily = e2.fFamily, t2.appendChild(r2), createTag("canvas").getContext("2d").font = e2.fWeight + " " + e2.fStyle + " 100px " + e2.fFamily, r2;
            }
            e = e.concat([2304, 2305, 2306, 2307, 2362, 2363, 2364, 2364, 2366, 2367, 2368, 2369, 2370, 2371, 2372, 2373, 2374, 2375, 2376, 2377, 2378, 2379, 2380, 2381, 2382, 2383, 2387, 2388, 2389, 2390, 2391, 2402, 2403]);
            var s = function() {
              this.fonts = [], this.chars = null, this.typekitLoaded = 0, this.isLoaded = false, this.initTime = Date.now();
            };
            return s.getCombinedCharacterCodes = function() {
              return e;
            }, s.prototype.addChars = function(t2) {
              if (t2) {
                this.chars || (this.chars = []);
                var e2, r2, i3, s2 = t2.length, a = this.chars.length;
                for (e2 = 0; e2 < s2; e2 += 1) {
                  for (r2 = 0, i3 = false; r2 < a; )
                    this.chars[r2].style === t2[e2].style && this.chars[r2].fFamily === t2[e2].fFamily && this.chars[r2].ch === t2[e2].ch && (i3 = true), r2 += 1;
                  i3 || (this.chars.push(t2[e2]), a += 1);
                }
              }
            }, s.prototype.addFonts = function(t2, e2) {
              if (t2) {
                if (this.chars)
                  return this.isLoaded = true, void (this.fonts = t2.list);
                var s2, a = t2.list, n = a.length, o = n;
                for (s2 = 0; s2 < n; s2 += 1) {
                  var h, l, p = true;
                  if (a[s2].loaded = false, a[s2].monoCase = r(a[s2].fFamily, "monospace"), a[s2].sansCase = r(a[s2].fFamily, "sans-serif"), a[s2].fPath) {
                    if ("p" === a[s2].fOrigin || 3 === a[s2].origin) {
                      if ((h = document.querySelectorAll('style[f-forigin="p"][f-family="' + a[s2].fFamily + '"], style[f-origin="3"][f-family="' + a[s2].fFamily + '"]')).length > 0 && (p = false), p) {
                        var f = createTag("style");
                        f.setAttribute("f-forigin", a[s2].fOrigin), f.setAttribute("f-origin", a[s2].origin), f.setAttribute("f-family", a[s2].fFamily), f.type = "text/css", f.innerHTML = "@font-face {font-family: " + a[s2].fFamily + "; font-style: normal; src: url('" + a[s2].fPath + "');}", e2.appendChild(f);
                      }
                    } else if ("g" === a[s2].fOrigin || 1 === a[s2].origin) {
                      for (h = document.querySelectorAll('link[f-forigin="g"], link[f-origin="1"]'), l = 0; l < h.length; l++)
                        -1 !== h[l].href.indexOf(a[s2].fPath) && (p = false);
                      if (p) {
                        var m = createTag("link");
                        m.setAttribute("f-forigin", a[s2].fOrigin), m.setAttribute("f-origin", a[s2].origin), m.type = "text/css", m.rel = "stylesheet", m.href = a[s2].fPath, document.body.appendChild(m);
                      }
                    } else if ("t" === a[s2].fOrigin || 2 === a[s2].origin) {
                      for (h = document.querySelectorAll('script[f-forigin="t"], script[f-origin="2"]'), l = 0; l < h.length; l++)
                        a[s2].fPath === h[l].src && (p = false);
                      if (p) {
                        var c = createTag("link");
                        c.setAttribute("f-forigin", a[s2].fOrigin), c.setAttribute("f-origin", a[s2].origin), c.setAttribute("rel", "stylesheet"), c.setAttribute("href", a[s2].fPath), e2.appendChild(c);
                      }
                    }
                  } else
                    a[s2].loaded = true, o -= 1;
                  a[s2].helper = i2(e2, a[s2]), a[s2].cache = {}, this.fonts.push(a[s2]);
                }
                0 === o ? this.isLoaded = true : setTimeout(this.checkLoadedFonts.bind(this), 100);
              } else
                this.isLoaded = true;
            }, s.prototype.getCharData = function(e2, r2, i3) {
              for (var s2 = 0, a = this.chars.length; s2 < a; ) {
                if (this.chars[s2].ch === e2 && this.chars[s2].style === r2 && this.chars[s2].fFamily === i3)
                  return this.chars[s2];
                s2 += 1;
              }
              return ("string" == typeof e2 && 13 !== e2.charCodeAt(0) || !e2) && console && console.warn && console.warn("Missing character from exported characters list: ", e2, r2, i3), t;
            }, s.prototype.getFontByName = function(t2) {
              for (var e2 = 0, r2 = this.fonts.length; e2 < r2; ) {
                if (this.fonts[e2].fName === t2)
                  return this.fonts[e2];
                e2 += 1;
              }
              return this.fonts[0];
            }, s.prototype.measureText = function(t2, e2, r2) {
              var i3 = this.getFontByName(e2), s2 = t2.charCodeAt(0);
              if (!i3.cache[s2 + 1]) {
                var a = i3.helper;
                if (" " === t2) {
                  a.textContent = "|" + t2 + "|";
                  var n = a.getComputedTextLength();
                  a.textContent = "||";
                  var o = a.getComputedTextLength();
                  i3.cache[s2 + 1] = (n - o) / 100;
                } else
                  a.textContent = t2, i3.cache[s2 + 1] = a.getComputedTextLength() / 100;
              }
              return i3.cache[s2 + 1] * r2;
            }, s.prototype.checkLoadedFonts = function() {
              var t2, e2, r2, i3 = this.fonts.length, s2 = i3;
              for (t2 = 0; t2 < i3; t2 += 1)
                this.fonts[t2].loaded ? s2 -= 1 : "n" === this.fonts[t2].fOrigin || 0 === this.fonts[t2].origin ? this.fonts[t2].loaded = true : (e2 = this.fonts[t2].monoCase.node, r2 = this.fonts[t2].monoCase.w, e2.offsetWidth !== r2 ? (s2 -= 1, this.fonts[t2].loaded = true) : (e2 = this.fonts[t2].sansCase.node, r2 = this.fonts[t2].sansCase.w, e2.offsetWidth !== r2 && (s2 -= 1, this.fonts[t2].loaded = true)), this.fonts[t2].loaded && (this.fonts[t2].sansCase.parent.parentNode.removeChild(this.fonts[t2].sansCase.parent), this.fonts[t2].monoCase.parent.parentNode.removeChild(this.fonts[t2].monoCase.parent)));
              0 !== s2 && Date.now() - this.initTime < 5e3 ? setTimeout(this.checkLoadedFonts.bind(this), 20) : setTimeout((function() {
                this.isLoaded = true;
              }).bind(this), 0);
            }, s.prototype.loaded = function() {
              return this.isLoaded;
            }, s;
          }(), PropertyFactory = /* @__PURE__ */ function() {
            var t = initialDefaultFrame, e = Math.abs;
            function r(t2, e2) {
              var r2, s2 = this.offsetTime;
              "multidimensional" === this.propType && (r2 = createTypedArray("float32", this.pv.length));
              for (var a2, n2, o2, h2, l2, p2, f2, m, c = e2.lastIndex, d = c, u = this.keyframes.length - 1, y = true; y; ) {
                if (a2 = this.keyframes[d], n2 = this.keyframes[d + 1], d === u - 1 && t2 >= n2.t - s2) {
                  a2.h && (a2 = n2), c = 0;
                  break;
                }
                if (n2.t - s2 > t2) {
                  c = d;
                  break;
                }
                d < u - 1 ? d += 1 : (c = 0, y = false);
              }
              var g, v = n2.t - s2, b = a2.t - s2;
              if (a2.to) {
                a2.bezierData || (a2.bezierData = bez.buildBezierData(a2.s, n2.s || a2.e, a2.to, a2.ti));
                var P = a2.bezierData;
                if (t2 >= v || t2 < b) {
                  var _ = t2 >= v ? P.points.length - 1 : 0;
                  for (h2 = P.points[_].point.length, o2 = 0; o2 < h2; o2 += 1)
                    r2[o2] = P.points[_].point[o2];
                } else {
                  a2.__fnct ? m = a2.__fnct : (m = BezierFactory.getBezierEasing(a2.o.x, a2.o.y, a2.i.x, a2.i.y, a2.n).get, a2.__fnct = m), l2 = m((t2 - b) / (v - b));
                  var x, S = P.segmentLength * l2, E = e2.lastFrame < t2 && e2._lastKeyframeIndex === d ? e2._lastAddedLength : 0;
                  for (f2 = e2.lastFrame < t2 && e2._lastKeyframeIndex === d ? e2._lastPoint : 0, y = true, p2 = P.points.length; y; ) {
                    if (E += P.points[f2].partialLength, 0 === S || 0 === l2 || f2 === P.points.length - 1) {
                      for (h2 = P.points[f2].point.length, o2 = 0; o2 < h2; o2 += 1)
                        r2[o2] = P.points[f2].point[o2];
                      break;
                    }
                    if (S >= E && S < E + P.points[f2 + 1].partialLength) {
                      for (x = (S - E) / P.points[f2 + 1].partialLength, h2 = P.points[f2].point.length, o2 = 0; o2 < h2; o2 += 1)
                        r2[o2] = P.points[f2].point[o2] + (P.points[f2 + 1].point[o2] - P.points[f2].point[o2]) * x;
                      break;
                    }
                    f2 < p2 - 1 ? f2 += 1 : y = false;
                  }
                  e2._lastPoint = f2, e2._lastAddedLength = E - P.points[f2].partialLength, e2._lastKeyframeIndex = d;
                }
              } else {
                var T, C, A, k, D;
                if (u = a2.s.length, g = n2.s || a2.e, this.sh && 1 !== a2.h)
                  if (t2 >= v)
                    r2[0] = g[0], r2[1] = g[1], r2[2] = g[2];
                  else if (t2 <= b)
                    r2[0] = a2.s[0], r2[1] = a2.s[1], r2[2] = a2.s[2];
                  else {
                    !function(t3, e3) {
                      var r3 = e3[0], i3 = e3[1], s3 = e3[2], a3 = e3[3], n3 = Math.atan2(2 * i3 * a3 - 2 * r3 * s3, 1 - 2 * i3 * i3 - 2 * s3 * s3), o3 = Math.asin(2 * r3 * i3 + 2 * s3 * a3), h3 = Math.atan2(2 * r3 * a3 - 2 * i3 * s3, 1 - 2 * r3 * r3 - 2 * s3 * s3);
                      t3[0] = n3 / degToRads, t3[1] = o3 / degToRads, t3[2] = h3 / degToRads;
                    }(r2, function(t3, e3, r3) {
                      var i3, s3, a3, n3, o3, h3 = [], l3 = t3[0], p3 = t3[1], f3 = t3[2], m2 = t3[3], c2 = e3[0], d2 = e3[1], u2 = e3[2], y2 = e3[3];
                      (s3 = l3 * c2 + p3 * d2 + f3 * u2 + m2 * y2) < 0 && (s3 = -s3, c2 = -c2, d2 = -d2, u2 = -u2, y2 = -y2);
                      1 - s3 > 1e-6 ? (i3 = Math.acos(s3), a3 = Math.sin(i3), n3 = Math.sin((1 - r3) * i3) / a3, o3 = Math.sin(r3 * i3) / a3) : (n3 = 1 - r3, o3 = r3);
                      return h3[0] = n3 * l3 + o3 * c2, h3[1] = n3 * p3 + o3 * d2, h3[2] = n3 * f3 + o3 * u2, h3[3] = n3 * m2 + o3 * y2, h3;
                    }(i2(a2.s), i2(g), (t2 - b) / (v - b)));
                  }
                else
                  for (d = 0; d < u; d += 1)
                    1 !== a2.h && (t2 >= v ? l2 = 1 : t2 < b ? l2 = 0 : (a2.o.x.constructor === Array ? (a2.__fnct || (a2.__fnct = []), a2.__fnct[d] ? m = a2.__fnct[d] : (T = void 0 === a2.o.x[d] ? a2.o.x[0] : a2.o.x[d], C = void 0 === a2.o.y[d] ? a2.o.y[0] : a2.o.y[d], A = void 0 === a2.i.x[d] ? a2.i.x[0] : a2.i.x[d], k = void 0 === a2.i.y[d] ? a2.i.y[0] : a2.i.y[d], m = BezierFactory.getBezierEasing(T, C, A, k).get, a2.__fnct[d] = m)) : a2.__fnct ? m = a2.__fnct : (T = a2.o.x, C = a2.o.y, A = a2.i.x, k = a2.i.y, m = BezierFactory.getBezierEasing(T, C, A, k).get, a2.__fnct = m), l2 = m((t2 - b) / (v - b)))), g = n2.s || a2.e, D = 1 === a2.h ? a2.s[d] : a2.s[d] + (g[d] - a2.s[d]) * l2, 1 === u ? r2 = D : r2[d] = D;
              }
              return e2.lastIndex = c, r2;
            }
            function i2(t2) {
              var e2 = t2[0] * degToRads, r2 = t2[1] * degToRads, i3 = t2[2] * degToRads, s2 = Math.cos(e2 / 2), a2 = Math.cos(r2 / 2), n2 = Math.cos(i3 / 2), o2 = Math.sin(e2 / 2), h2 = Math.sin(r2 / 2), l2 = Math.sin(i3 / 2);
              return [o2 * h2 * n2 + s2 * a2 * l2, o2 * a2 * n2 + s2 * h2 * l2, s2 * h2 * n2 - o2 * a2 * l2, s2 * a2 * n2 - o2 * h2 * l2];
            }
            function s() {
              var e2 = this.comp.renderedFrame - this.offsetTime, r2 = this.keyframes[0].t - this.offsetTime, i3 = this.keyframes[this.keyframes.length - 1].t - this.offsetTime;
              if (!(e2 === this._caching.lastFrame || this._caching.lastFrame !== t && (this._caching.lastFrame >= i3 && e2 >= i3 || this._caching.lastFrame < r2 && e2 < r2))) {
                this._caching.lastFrame >= e2 && (this._caching._lastKeyframeIndex = -1, this._caching.lastIndex = 0);
                var s2 = this.interpolateValue(e2, this._caching);
                this.pv = s2;
              }
              return this._caching.lastFrame = e2, this.pv;
            }
            function a(t2) {
              var r2;
              if ("unidimensional" === this.propType)
                r2 = t2 * this.mult, e(this.v - r2) > 1e-5 && (this.v = r2, this._mdf = true);
              else
                for (var i3 = 0, s2 = this.v.length; i3 < s2; )
                  r2 = t2[i3] * this.mult, e(this.v[i3] - r2) > 1e-5 && (this.v[i3] = r2, this._mdf = true), i3 += 1;
            }
            function n() {
              if (this.elem.globalData.frameId !== this.frameId && this.effectsSequence.length)
                if (this.lock)
                  this.setVValue(this.pv);
                else {
                  this.lock = true, this._mdf = this._isFirstFrame;
                  var t2, e2 = this.effectsSequence.length, r2 = this.kf ? this.pv : this.data.k;
                  for (t2 = 0; t2 < e2; t2 += 1)
                    r2 = this.effectsSequence[t2](r2);
                  this.setVValue(r2), this._isFirstFrame = false, this.lock = false, this.frameId = this.elem.globalData.frameId;
                }
            }
            function o(t2) {
              this.effectsSequence.push(t2), this.container.addDynamicProperty(this);
            }
            function h(t2, e2, r2, i3) {
              this.propType = "unidimensional", this.mult = r2 || 1, this.data = e2, this.v = r2 ? e2.k * r2 : e2.k, this.pv = e2.k, this._mdf = false, this.elem = t2, this.container = i3, this.comp = t2.comp, this.k = false, this.kf = false, this.vel = 0, this.effectsSequence = [], this._isFirstFrame = true, this.getValue = n, this.setVValue = a, this.addEffect = o;
            }
            function l(t2, e2, r2, i3) {
              this.propType = "multidimensional", this.mult = r2 || 1, this.data = e2, this._mdf = false, this.elem = t2, this.container = i3, this.comp = t2.comp, this.k = false, this.kf = false, this.frameId = -1;
              var s2, h2 = e2.k.length;
              this.v = createTypedArray("float32", h2), this.pv = createTypedArray("float32", h2);
              createTypedArray("float32", h2);
              for (this.vel = createTypedArray("float32", h2), s2 = 0; s2 < h2; s2 += 1)
                this.v[s2] = e2.k[s2] * this.mult, this.pv[s2] = e2.k[s2];
              this._isFirstFrame = true, this.effectsSequence = [], this.getValue = n, this.setVValue = a, this.addEffect = o;
            }
            function p(e2, i3, h2, l2) {
              this.propType = "unidimensional", this.keyframes = i3.k, this.offsetTime = e2.data.st, this.frameId = -1, this._caching = { lastFrame: t, lastIndex: 0, value: 0, _lastKeyframeIndex: -1 }, this.k = true, this.kf = true, this.data = i3, this.mult = h2 || 1, this.elem = e2, this.container = l2, this.comp = e2.comp, this.v = t, this.pv = t, this._isFirstFrame = true, this.getValue = n, this.setVValue = a, this.interpolateValue = r, this.effectsSequence = [s.bind(this)], this.addEffect = o;
            }
            function f(e2, i3, h2, l2) {
              this.propType = "multidimensional";
              var p2, f2, m, c, d, u = i3.k.length;
              for (p2 = 0; p2 < u - 1; p2 += 1)
                i3.k[p2].to && i3.k[p2].s && i3.k[p2].e && (f2 = i3.k[p2].s, m = i3.k[p2].e, c = i3.k[p2].to, d = i3.k[p2].ti, (2 === f2.length && (f2[0] !== m[0] || f2[1] !== m[1]) && bez.pointOnLine2D(f2[0], f2[1], m[0], m[1], f2[0] + c[0], f2[1] + c[1]) && bez.pointOnLine2D(f2[0], f2[1], m[0], m[1], m[0] + d[0], m[1] + d[1]) || 3 === f2.length && (f2[0] !== m[0] || f2[1] !== m[1] || f2[2] !== m[2]) && bez.pointOnLine3D(f2[0], f2[1], f2[2], m[0], m[1], m[2], f2[0] + c[0], f2[1] + c[1], f2[2] + c[2]) && bez.pointOnLine3D(f2[0], f2[1], f2[2], m[0], m[1], m[2], m[0] + d[0], m[1] + d[1], m[2] + d[2])) && (i3.k[p2].to = null, i3.k[p2].ti = null), f2[0] === m[0] && f2[1] === m[1] && 0 === c[0] && 0 === c[1] && 0 === d[0] && 0 === d[1] && (2 === f2.length || f2[2] === m[2] && 0 === c[2] && 0 === d[2]) && (i3.k[p2].to = null, i3.k[p2].ti = null));
              this.effectsSequence = [s.bind(this)], this.keyframes = i3.k, this.offsetTime = e2.data.st, this.k = true, this.kf = true, this._isFirstFrame = true, this.mult = h2 || 1, this.elem = e2, this.container = l2, this.comp = e2.comp, this.getValue = n, this.setVValue = a, this.interpolateValue = r, this.frameId = -1;
              var y = i3.k[0].s.length;
              for (this.v = createTypedArray("float32", y), this.pv = createTypedArray("float32", y), p2 = 0; p2 < y; p2 += 1)
                this.v[p2] = t, this.pv[p2] = t;
              this._caching = { lastFrame: t, lastIndex: 0, value: createTypedArray("float32", y) }, this.addEffect = o;
            }
            return { getProp: function(t2, e2, r2, i3, s2) {
              var a2;
              if (e2.k.length)
                if ("number" == typeof e2.k[0])
                  a2 = new l(t2, e2, i3, s2);
                else
                  switch (r2) {
                    case 0:
                      a2 = new p(t2, e2, i3, s2);
                      break;
                    case 1:
                      a2 = new f(t2, e2, i3, s2);
                  }
              else
                a2 = new h(t2, e2, i3, s2);
              return a2.effectsSequence.length && s2.addDynamicProperty(a2), a2;
            } };
          }(), TransformPropertyFactory = function() {
            function t(t2, e, r) {
              if (this.elem = t2, this.frameId = -1, this.propType = "transform", this.data = e, this.v = new Matrix(), this.pre = new Matrix(), this.appliedTransformations = 0, this.initDynamicPropertyContainer(r || t2), e.p && e.p.s ? (this.px = PropertyFactory.getProp(t2, e.p.x, 0, 0, this), this.py = PropertyFactory.getProp(t2, e.p.y, 0, 0, this), e.p.z && (this.pz = PropertyFactory.getProp(t2, e.p.z, 0, 0, this))) : this.p = PropertyFactory.getProp(t2, e.p || { k: [0, 0, 0] }, 1, 0, this), e.rx) {
                if (this.rx = PropertyFactory.getProp(t2, e.rx, 0, degToRads, this), this.ry = PropertyFactory.getProp(t2, e.ry, 0, degToRads, this), this.rz = PropertyFactory.getProp(t2, e.rz, 0, degToRads, this), e.or.k[0].ti) {
                  var i2, s = e.or.k.length;
                  for (i2 = 0; i2 < s; i2 += 1)
                    e.or.k[i2].to = e.or.k[i2].ti = null;
                }
                this.or = PropertyFactory.getProp(t2, e.or, 1, degToRads, this), this.or.sh = true;
              } else
                this.r = PropertyFactory.getProp(t2, e.r || { k: 0 }, 0, degToRads, this);
              e.sk && (this.sk = PropertyFactory.getProp(t2, e.sk, 0, degToRads, this), this.sa = PropertyFactory.getProp(t2, e.sa, 0, degToRads, this)), this.a = PropertyFactory.getProp(t2, e.a || { k: [0, 0, 0] }, 1, 0, this), this.s = PropertyFactory.getProp(t2, e.s || { k: [100, 100, 100] }, 1, 0.01, this), e.o ? this.o = PropertyFactory.getProp(t2, e.o, 0, 0.01, t2) : this.o = { _mdf: false, v: 1 }, this._isDirty = true, this.dynamicProperties.length || this.getValue(true);
            }
            return t.prototype = { applyToMatrix: function(t2) {
              var e = this._mdf;
              this.iterateDynamicProperties(), this._mdf = this._mdf || e, this.a && t2.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]), this.s && t2.scale(this.s.v[0], this.s.v[1], this.s.v[2]), this.sk && t2.skewFromAxis(-this.sk.v, this.sa.v), this.r ? t2.rotate(-this.r.v) : t2.rotateZ(-this.rz.v).rotateY(this.ry.v).rotateX(this.rx.v).rotateZ(-this.or.v[2]).rotateY(this.or.v[1]).rotateX(this.or.v[0]), this.data.p.s ? this.data.p.z ? t2.translate(this.px.v, this.py.v, -this.pz.v) : t2.translate(this.px.v, this.py.v, 0) : t2.translate(this.p.v[0], this.p.v[1], -this.p.v[2]);
            }, getValue: function(t2) {
              if (this.elem.globalData.frameId !== this.frameId) {
                if (this._isDirty && (this.precalculateMatrix(), this._isDirty = false), this.iterateDynamicProperties(), this._mdf || t2) {
                  if (this.v.cloneFromProps(this.pre.props), this.appliedTransformations < 1 && this.v.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]), this.appliedTransformations < 2 && this.v.scale(this.s.v[0], this.s.v[1], this.s.v[2]), this.sk && this.appliedTransformations < 3 && this.v.skewFromAxis(-this.sk.v, this.sa.v), this.r && this.appliedTransformations < 4 ? this.v.rotate(-this.r.v) : !this.r && this.appliedTransformations < 4 && this.v.rotateZ(-this.rz.v).rotateY(this.ry.v).rotateX(this.rx.v).rotateZ(-this.or.v[2]).rotateY(this.or.v[1]).rotateX(this.or.v[0]), this.autoOriented) {
                    var e, r, i2 = this.elem.globalData.frameRate;
                    if (this.p && this.p.keyframes && this.p.getValueAtTime)
                      this.p._caching.lastFrame + this.p.offsetTime <= this.p.keyframes[0].t ? (e = this.p.getValueAtTime((this.p.keyframes[0].t + 0.01) / i2, 0), r = this.p.getValueAtTime(this.p.keyframes[0].t / i2, 0)) : this.p._caching.lastFrame + this.p.offsetTime >= this.p.keyframes[this.p.keyframes.length - 1].t ? (e = this.p.getValueAtTime(this.p.keyframes[this.p.keyframes.length - 1].t / i2, 0), r = this.p.getValueAtTime((this.p.keyframes[this.p.keyframes.length - 1].t - 0.01) / i2, 0)) : (e = this.p.pv, r = this.p.getValueAtTime((this.p._caching.lastFrame + this.p.offsetTime - 0.01) / i2, this.p.offsetTime));
                    else if (this.px && this.px.keyframes && this.py.keyframes && this.px.getValueAtTime && this.py.getValueAtTime) {
                      e = [], r = [];
                      var s = this.px, a = this.py;
                      s._caching.lastFrame + s.offsetTime <= s.keyframes[0].t ? (e[0] = s.getValueAtTime((s.keyframes[0].t + 0.01) / i2, 0), e[1] = a.getValueAtTime((a.keyframes[0].t + 0.01) / i2, 0), r[0] = s.getValueAtTime(s.keyframes[0].t / i2, 0), r[1] = a.getValueAtTime(a.keyframes[0].t / i2, 0)) : s._caching.lastFrame + s.offsetTime >= s.keyframes[s.keyframes.length - 1].t ? (e[0] = s.getValueAtTime(s.keyframes[s.keyframes.length - 1].t / i2, 0), e[1] = a.getValueAtTime(a.keyframes[a.keyframes.length - 1].t / i2, 0), r[0] = s.getValueAtTime((s.keyframes[s.keyframes.length - 1].t - 0.01) / i2, 0), r[1] = a.getValueAtTime((a.keyframes[a.keyframes.length - 1].t - 0.01) / i2, 0)) : (e = [s.pv, a.pv], r[0] = s.getValueAtTime((s._caching.lastFrame + s.offsetTime - 0.01) / i2, s.offsetTime), r[1] = a.getValueAtTime((a._caching.lastFrame + a.offsetTime - 0.01) / i2, a.offsetTime));
                    }
                    this.v.rotate(-Math.atan2(e[1] - r[1], e[0] - r[0]));
                  }
                  this.data.p && this.data.p.s ? this.data.p.z ? this.v.translate(this.px.v, this.py.v, -this.pz.v) : this.v.translate(this.px.v, this.py.v, 0) : this.v.translate(this.p.v[0], this.p.v[1], -this.p.v[2]);
                }
                this.frameId = this.elem.globalData.frameId;
              }
            }, precalculateMatrix: function() {
              if (!this.a.k && (this.pre.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]), this.appliedTransformations = 1, !this.s.effectsSequence.length)) {
                if (this.pre.scale(this.s.v[0], this.s.v[1], this.s.v[2]), this.appliedTransformations = 2, this.sk) {
                  if (this.sk.effectsSequence.length || this.sa.effectsSequence.length)
                    return;
                  this.pre.skewFromAxis(-this.sk.v, this.sa.v), this.appliedTransformations = 3;
                }
                if (this.r) {
                  if (this.r.effectsSequence.length)
                    return;
                  this.pre.rotate(-this.r.v), this.appliedTransformations = 4;
                } else
                  this.rz.effectsSequence.length || this.ry.effectsSequence.length || this.rx.effectsSequence.length || this.or.effectsSequence.length || (this.pre.rotateZ(-this.rz.v).rotateY(this.ry.v).rotateX(this.rx.v).rotateZ(-this.or.v[2]).rotateY(this.or.v[1]).rotateX(this.or.v[0]), this.appliedTransformations = 4);
              }
            }, autoOrient: function() {
            } }, extendPrototype([DynamicPropertyContainer], t), t.prototype.addDynamicProperty = function(t2) {
              this._addDynamicProperty(t2), this.elem.addDynamicProperty(t2), this._isDirty = true;
            }, t.prototype._addDynamicProperty = DynamicPropertyContainer.prototype.addDynamicProperty, { getTransformProperty: function(e, r, i2) {
              return new t(e, r, i2);
            } };
          }();
          function ShapePath() {
            this.c = false, this._length = 0, this._maxLength = 8, this.v = createSizedArray(this._maxLength), this.o = createSizedArray(this._maxLength), this.i = createSizedArray(this._maxLength);
          }
          ShapePath.prototype.setPathData = function(t, e) {
            this.c = t, this.setLength(e);
            for (var r = 0; r < e; )
              this.v[r] = point_pool.newElement(), this.o[r] = point_pool.newElement(), this.i[r] = point_pool.newElement(), r += 1;
          }, ShapePath.prototype.setLength = function(t) {
            for (; this._maxLength < t; )
              this.doubleArrayLength();
            this._length = t;
          }, ShapePath.prototype.doubleArrayLength = function() {
            this.v = this.v.concat(createSizedArray(this._maxLength)), this.i = this.i.concat(createSizedArray(this._maxLength)), this.o = this.o.concat(createSizedArray(this._maxLength)), this._maxLength *= 2;
          }, ShapePath.prototype.setXYAt = function(t, e, r, i2, s) {
            var a;
            switch (this._length = Math.max(this._length, i2 + 1), this._length >= this._maxLength && this.doubleArrayLength(), r) {
              case "v":
                a = this.v;
                break;
              case "i":
                a = this.i;
                break;
              case "o":
                a = this.o;
            }
            (!a[i2] || a[i2] && !s) && (a[i2] = point_pool.newElement()), a[i2][0] = t, a[i2][1] = e;
          }, ShapePath.prototype.setTripleAt = function(t, e, r, i2, s, a, n, o) {
            this.setXYAt(t, e, "v", n, o), this.setXYAt(r, i2, "o", n, o), this.setXYAt(s, a, "i", n, o);
          }, ShapePath.prototype.reverse = function() {
            var t = new ShapePath();
            t.setPathData(this.c, this._length);
            var e = this.v, r = this.o, i2 = this.i, s = 0;
            this.c && (t.setTripleAt(e[0][0], e[0][1], i2[0][0], i2[0][1], r[0][0], r[0][1], 0, false), s = 1);
            var a, n = this._length - 1, o = this._length;
            for (a = s; a < o; a += 1)
              t.setTripleAt(e[n][0], e[n][1], i2[n][0], i2[n][1], r[n][0], r[n][1], a, false), n -= 1;
            return t;
          };
          var ShapePropertyFactory = function() {
            function t(t2, e2, r2) {
              var i3, s2, a2, n2, o2, h2, l2, p2, f2, m = r2.lastIndex, c = this.keyframes;
              if (t2 < c[0].t - this.offsetTime)
                i3 = c[0].s[0], a2 = true, m = 0;
              else if (t2 >= c[c.length - 1].t - this.offsetTime)
                i3 = c[c.length - 1].s ? c[c.length - 1].s[0] : c[c.length - 2].e[0], a2 = true;
              else {
                for (var d, u, y = m, g = c.length - 1, v = true; v && (d = c[y], !((u = c[y + 1]).t - this.offsetTime > t2)); )
                  y < g - 1 ? y += 1 : v = false;
                if (m = y, !(a2 = 1 === d.h)) {
                  if (t2 >= u.t - this.offsetTime)
                    p2 = 1;
                  else if (t2 < d.t - this.offsetTime)
                    p2 = 0;
                  else {
                    var b;
                    d.__fnct ? b = d.__fnct : (b = BezierFactory.getBezierEasing(d.o.x, d.o.y, d.i.x, d.i.y).get, d.__fnct = b), p2 = b((t2 - (d.t - this.offsetTime)) / (u.t - this.offsetTime - (d.t - this.offsetTime)));
                  }
                  s2 = u.s ? u.s[0] : d.e[0];
                }
                i3 = d.s[0];
              }
              for (h2 = e2._length, l2 = i3.i[0].length, r2.lastIndex = m, n2 = 0; n2 < h2; n2 += 1)
                for (o2 = 0; o2 < l2; o2 += 1)
                  f2 = a2 ? i3.i[n2][o2] : i3.i[n2][o2] + (s2.i[n2][o2] - i3.i[n2][o2]) * p2, e2.i[n2][o2] = f2, f2 = a2 ? i3.o[n2][o2] : i3.o[n2][o2] + (s2.o[n2][o2] - i3.o[n2][o2]) * p2, e2.o[n2][o2] = f2, f2 = a2 ? i3.v[n2][o2] : i3.v[n2][o2] + (s2.v[n2][o2] - i3.v[n2][o2]) * p2, e2.v[n2][o2] = f2;
            }
            function e() {
              var t2 = this.comp.renderedFrame - this.offsetTime, e2 = this.keyframes[0].t - this.offsetTime, r2 = this.keyframes[this.keyframes.length - 1].t - this.offsetTime, i3 = this._caching.lastFrame;
              return -999999 !== i3 && (i3 < e2 && t2 < e2 || i3 > r2 && t2 > r2) || (this._caching.lastIndex = i3 < t2 ? this._caching.lastIndex : 0, this.interpolateShape(t2, this.pv, this._caching)), this._caching.lastFrame = t2, this.pv;
            }
            function r() {
              this.paths = this.localShapeCollection;
            }
            function i2(t2) {
              (function(t3, e2) {
                if (t3._length !== e2._length || t3.c !== e2.c)
                  return false;
                var r2, i3 = t3._length;
                for (r2 = 0; r2 < i3; r2 += 1)
                  if (t3.v[r2][0] !== e2.v[r2][0] || t3.v[r2][1] !== e2.v[r2][1] || t3.o[r2][0] !== e2.o[r2][0] || t3.o[r2][1] !== e2.o[r2][1] || t3.i[r2][0] !== e2.i[r2][0] || t3.i[r2][1] !== e2.i[r2][1])
                    return false;
                return true;
              })(this.v, t2) || (this.v = shape_pool.clone(t2), this.localShapeCollection.releaseShapes(), this.localShapeCollection.addShape(this.v), this._mdf = true, this.paths = this.localShapeCollection);
            }
            function s() {
              if (this.elem.globalData.frameId !== this.frameId)
                if (this.effectsSequence.length)
                  if (this.lock)
                    this.setVValue(this.pv);
                  else {
                    this.lock = true, this._mdf = false;
                    var t2, e2 = this.kf ? this.pv : this.data.ks ? this.data.ks.k : this.data.pt.k, r2 = this.effectsSequence.length;
                    for (t2 = 0; t2 < r2; t2 += 1)
                      e2 = this.effectsSequence[t2](e2);
                    this.setVValue(e2), this.lock = false, this.frameId = this.elem.globalData.frameId;
                  }
                else
                  this._mdf = false;
            }
            function a(t2, e2, i3) {
              this.propType = "shape", this.comp = t2.comp, this.container = t2, this.elem = t2, this.data = e2, this.k = false, this.kf = false, this._mdf = false;
              var s2 = 3 === i3 ? e2.pt.k : e2.ks.k;
              this.v = shape_pool.clone(s2), this.pv = shape_pool.clone(this.v), this.localShapeCollection = shapeCollection_pool.newShapeCollection(), this.paths = this.localShapeCollection, this.paths.addShape(this.v), this.reset = r, this.effectsSequence = [];
            }
            function n(t2) {
              this.effectsSequence.push(t2), this.container.addDynamicProperty(this);
            }
            function o(t2, i3, s2) {
              this.propType = "shape", this.comp = t2.comp, this.elem = t2, this.container = t2, this.offsetTime = t2.data.st, this.keyframes = 3 === s2 ? i3.pt.k : i3.ks.k, this.k = true, this.kf = true;
              var a2 = this.keyframes[0].s[0].i.length;
              this.keyframes[0].s[0].i[0].length;
              this.v = shape_pool.newElement(), this.v.setPathData(this.keyframes[0].s[0].c, a2), this.pv = shape_pool.clone(this.v), this.localShapeCollection = shapeCollection_pool.newShapeCollection(), this.paths = this.localShapeCollection, this.paths.addShape(this.v), this.lastFrame = -999999, this.reset = r, this._caching = { lastFrame: -999999, lastIndex: 0 }, this.effectsSequence = [e.bind(this)];
            }
            a.prototype.interpolateShape = t, a.prototype.getValue = s, a.prototype.setVValue = i2, a.prototype.addEffect = n, o.prototype.getValue = s, o.prototype.interpolateShape = t, o.prototype.setVValue = i2, o.prototype.addEffect = n;
            var h = function() {
              var t2 = roundCorner;
              function e2(t3, e3) {
                this.v = shape_pool.newElement(), this.v.setPathData(true, 4), this.localShapeCollection = shapeCollection_pool.newShapeCollection(), this.paths = this.localShapeCollection, this.localShapeCollection.addShape(this.v), this.d = e3.d, this.elem = t3, this.comp = t3.comp, this.frameId = -1, this.initDynamicPropertyContainer(t3), this.p = PropertyFactory.getProp(t3, e3.p, 1, 0, this), this.s = PropertyFactory.getProp(t3, e3.s, 1, 0, this), this.dynamicProperties.length ? this.k = true : (this.k = false, this.convertEllToPath());
              }
              return e2.prototype = { reset: r, getValue: function() {
                this.elem.globalData.frameId !== this.frameId && (this.frameId = this.elem.globalData.frameId, this.iterateDynamicProperties(), this._mdf && this.convertEllToPath());
              }, convertEllToPath: function() {
                var e3 = this.p.v[0], r2 = this.p.v[1], i3 = this.s.v[0] / 2, s2 = this.s.v[1] / 2, a2 = 3 !== this.d, n2 = this.v;
                n2.v[0][0] = e3, n2.v[0][1] = r2 - s2, n2.v[1][0] = a2 ? e3 + i3 : e3 - i3, n2.v[1][1] = r2, n2.v[2][0] = e3, n2.v[2][1] = r2 + s2, n2.v[3][0] = a2 ? e3 - i3 : e3 + i3, n2.v[3][1] = r2, n2.i[0][0] = a2 ? e3 - i3 * t2 : e3 + i3 * t2, n2.i[0][1] = r2 - s2, n2.i[1][0] = a2 ? e3 + i3 : e3 - i3, n2.i[1][1] = r2 - s2 * t2, n2.i[2][0] = a2 ? e3 + i3 * t2 : e3 - i3 * t2, n2.i[2][1] = r2 + s2, n2.i[3][0] = a2 ? e3 - i3 : e3 + i3, n2.i[3][1] = r2 + s2 * t2, n2.o[0][0] = a2 ? e3 + i3 * t2 : e3 - i3 * t2, n2.o[0][1] = r2 - s2, n2.o[1][0] = a2 ? e3 + i3 : e3 - i3, n2.o[1][1] = r2 + s2 * t2, n2.o[2][0] = a2 ? e3 - i3 * t2 : e3 + i3 * t2, n2.o[2][1] = r2 + s2, n2.o[3][0] = a2 ? e3 - i3 : e3 + i3, n2.o[3][1] = r2 - s2 * t2;
              } }, extendPrototype([DynamicPropertyContainer], e2), e2;
            }(), l = function() {
              function t2(t3, e2) {
                this.v = shape_pool.newElement(), this.v.setPathData(true, 0), this.elem = t3, this.comp = t3.comp, this.data = e2, this.frameId = -1, this.d = e2.d, this.initDynamicPropertyContainer(t3), 1 === e2.sy ? (this.ir = PropertyFactory.getProp(t3, e2.ir, 0, 0, this), this.is = PropertyFactory.getProp(t3, e2.is, 0, 0.01, this), this.convertToPath = this.convertStarToPath) : this.convertToPath = this.convertPolygonToPath, this.pt = PropertyFactory.getProp(t3, e2.pt, 0, 0, this), this.p = PropertyFactory.getProp(t3, e2.p, 1, 0, this), this.r = PropertyFactory.getProp(t3, e2.r, 0, degToRads, this), this.or = PropertyFactory.getProp(t3, e2.or, 0, 0, this), this.os = PropertyFactory.getProp(t3, e2.os, 0, 0.01, this), this.localShapeCollection = shapeCollection_pool.newShapeCollection(), this.localShapeCollection.addShape(this.v), this.paths = this.localShapeCollection, this.dynamicProperties.length ? this.k = true : (this.k = false, this.convertToPath());
              }
              return t2.prototype = { reset: r, getValue: function() {
                this.elem.globalData.frameId !== this.frameId && (this.frameId = this.elem.globalData.frameId, this.iterateDynamicProperties(), this._mdf && this.convertToPath());
              }, convertStarToPath: function() {
                var t3, e2, r2, i3, s2 = 2 * Math.floor(this.pt.v), a2 = 2 * Math.PI / s2, n2 = true, o2 = this.or.v, h2 = this.ir.v, l2 = this.os.v, p2 = this.is.v, f2 = 2 * Math.PI * o2 / (2 * s2), m = 2 * Math.PI * h2 / (2 * s2), c = -Math.PI / 2;
                c += this.r.v;
                var d = 3 === this.data.d ? -1 : 1;
                for (this.v._length = 0, t3 = 0; t3 < s2; t3 += 1) {
                  r2 = n2 ? l2 : p2, i3 = n2 ? f2 : m;
                  var u = (e2 = n2 ? o2 : h2) * Math.cos(c), y = e2 * Math.sin(c), g = 0 === u && 0 === y ? 0 : y / Math.sqrt(u * u + y * y), v = 0 === u && 0 === y ? 0 : -u / Math.sqrt(u * u + y * y);
                  u += +this.p.v[0], y += +this.p.v[1], this.v.setTripleAt(u, y, u - g * i3 * r2 * d, y - v * i3 * r2 * d, u + g * i3 * r2 * d, y + v * i3 * r2 * d, t3, true), n2 = !n2, c += a2 * d;
                }
              }, convertPolygonToPath: function() {
                var t3, e2 = Math.floor(this.pt.v), r2 = 2 * Math.PI / e2, i3 = this.or.v, s2 = this.os.v, a2 = 2 * Math.PI * i3 / (4 * e2), n2 = -Math.PI / 2, o2 = 3 === this.data.d ? -1 : 1;
                for (n2 += this.r.v, this.v._length = 0, t3 = 0; t3 < e2; t3 += 1) {
                  var h2 = i3 * Math.cos(n2), l2 = i3 * Math.sin(n2), p2 = 0 === h2 && 0 === l2 ? 0 : l2 / Math.sqrt(h2 * h2 + l2 * l2), f2 = 0 === h2 && 0 === l2 ? 0 : -h2 / Math.sqrt(h2 * h2 + l2 * l2);
                  h2 += +this.p.v[0], l2 += +this.p.v[1], this.v.setTripleAt(h2, l2, h2 - p2 * a2 * s2 * o2, l2 - f2 * a2 * s2 * o2, h2 + p2 * a2 * s2 * o2, l2 + f2 * a2 * s2 * o2, t3, true), n2 += r2 * o2;
                }
                this.paths.length = 0, this.paths[0] = this.v;
              } }, extendPrototype([DynamicPropertyContainer], t2), t2;
            }(), p = function() {
              function t2(t3, e2) {
                this.v = shape_pool.newElement(), this.v.c = true, this.localShapeCollection = shapeCollection_pool.newShapeCollection(), this.localShapeCollection.addShape(this.v), this.paths = this.localShapeCollection, this.elem = t3, this.comp = t3.comp, this.frameId = -1, this.d = e2.d, this.initDynamicPropertyContainer(t3), this.p = PropertyFactory.getProp(t3, e2.p, 1, 0, this), this.s = PropertyFactory.getProp(t3, e2.s, 1, 0, this), this.r = PropertyFactory.getProp(t3, e2.r, 0, 0, this), this.dynamicProperties.length ? this.k = true : (this.k = false, this.convertRectToPath());
              }
              return t2.prototype = { convertRectToPath: function() {
                var t3 = this.p.v[0], e2 = this.p.v[1], r2 = this.s.v[0] / 2, i3 = this.s.v[1] / 2, s2 = bm_min(r2, i3, this.r.v), a2 = s2 * (1 - roundCorner);
                this.v._length = 0, 2 === this.d || 1 === this.d ? (this.v.setTripleAt(t3 + r2, e2 - i3 + s2, t3 + r2, e2 - i3 + s2, t3 + r2, e2 - i3 + a2, 0, true), this.v.setTripleAt(t3 + r2, e2 + i3 - s2, t3 + r2, e2 + i3 - a2, t3 + r2, e2 + i3 - s2, 1, true), 0 !== s2 ? (this.v.setTripleAt(t3 + r2 - s2, e2 + i3, t3 + r2 - s2, e2 + i3, t3 + r2 - a2, e2 + i3, 2, true), this.v.setTripleAt(t3 - r2 + s2, e2 + i3, t3 - r2 + a2, e2 + i3, t3 - r2 + s2, e2 + i3, 3, true), this.v.setTripleAt(t3 - r2, e2 + i3 - s2, t3 - r2, e2 + i3 - s2, t3 - r2, e2 + i3 - a2, 4, true), this.v.setTripleAt(t3 - r2, e2 - i3 + s2, t3 - r2, e2 - i3 + a2, t3 - r2, e2 - i3 + s2, 5, true), this.v.setTripleAt(t3 - r2 + s2, e2 - i3, t3 - r2 + s2, e2 - i3, t3 - r2 + a2, e2 - i3, 6, true), this.v.setTripleAt(t3 + r2 - s2, e2 - i3, t3 + r2 - a2, e2 - i3, t3 + r2 - s2, e2 - i3, 7, true)) : (this.v.setTripleAt(t3 - r2, e2 + i3, t3 - r2 + a2, e2 + i3, t3 - r2, e2 + i3, 2), this.v.setTripleAt(t3 - r2, e2 - i3, t3 - r2, e2 - i3 + a2, t3 - r2, e2 - i3, 3))) : (this.v.setTripleAt(t3 + r2, e2 - i3 + s2, t3 + r2, e2 - i3 + a2, t3 + r2, e2 - i3 + s2, 0, true), 0 !== s2 ? (this.v.setTripleAt(t3 + r2 - s2, e2 - i3, t3 + r2 - s2, e2 - i3, t3 + r2 - a2, e2 - i3, 1, true), this.v.setTripleAt(t3 - r2 + s2, e2 - i3, t3 - r2 + a2, e2 - i3, t3 - r2 + s2, e2 - i3, 2, true), this.v.setTripleAt(t3 - r2, e2 - i3 + s2, t3 - r2, e2 - i3 + s2, t3 - r2, e2 - i3 + a2, 3, true), this.v.setTripleAt(t3 - r2, e2 + i3 - s2, t3 - r2, e2 + i3 - a2, t3 - r2, e2 + i3 - s2, 4, true), this.v.setTripleAt(t3 - r2 + s2, e2 + i3, t3 - r2 + s2, e2 + i3, t3 - r2 + a2, e2 + i3, 5, true), this.v.setTripleAt(t3 + r2 - s2, e2 + i3, t3 + r2 - a2, e2 + i3, t3 + r2 - s2, e2 + i3, 6, true), this.v.setTripleAt(t3 + r2, e2 + i3 - s2, t3 + r2, e2 + i3 - s2, t3 + r2, e2 + i3 - a2, 7, true)) : (this.v.setTripleAt(t3 - r2, e2 - i3, t3 - r2 + a2, e2 - i3, t3 - r2, e2 - i3, 1, true), this.v.setTripleAt(t3 - r2, e2 + i3, t3 - r2, e2 + i3 - a2, t3 - r2, e2 + i3, 2, true), this.v.setTripleAt(t3 + r2, e2 + i3, t3 + r2 - a2, e2 + i3, t3 + r2, e2 + i3, 3, true)));
              }, getValue: function(t3) {
                this.elem.globalData.frameId !== this.frameId && (this.frameId = this.elem.globalData.frameId, this.iterateDynamicProperties(), this._mdf && this.convertRectToPath());
              }, reset: r }, extendPrototype([DynamicPropertyContainer], t2), t2;
            }();
            var f = { getShapeProp: function(t2, e2, r2) {
              var i3;
              return 3 === r2 || 4 === r2 ? i3 = (3 === r2 ? e2.pt : e2.ks).k.length ? new o(t2, e2, r2) : new a(t2, e2, r2) : 5 === r2 ? i3 = new p(t2, e2) : 6 === r2 ? i3 = new h(t2, e2) : 7 === r2 && (i3 = new l(t2, e2)), i3.k && t2.addDynamicProperty(i3), i3;
            }, getConstructorFunction: function() {
              return a;
            }, getKeyframedConstructorFunction: function() {
              return o;
            } };
            return f;
          }(), ShapeModifiers = function() {
            var t = {}, e = {};
            return t.registerModifier = function(t2, r) {
              e[t2] || (e[t2] = r);
            }, t.getModifier = function(t2, r, i2) {
              return new e[t2](r, i2);
            }, t;
          }();
          function ShapeModifier() {
          }
          function TrimModifier() {
          }
          function RoundCornersModifier() {
          }
          function RepeaterModifier() {
          }
          function ShapeCollection() {
            this._length = 0, this._maxLength = 4, this.shapes = createSizedArray(this._maxLength);
          }
          function DashProperty(t, e, r, i2) {
            this.elem = t, this.frameId = -1, this.dataProps = createSizedArray(e.length), this.renderer = r, this.k = false, this.dashStr = "", this.dashArray = createTypedArray("float32", e.length ? e.length - 1 : 0), this.dashoffset = createTypedArray("float32", 1), this.initDynamicPropertyContainer(i2);
            var s, a, n = e.length || 0;
            for (s = 0; s < n; s += 1)
              a = PropertyFactory.getProp(t, e[s].v, 0, 0, this), this.k = a.k || this.k, this.dataProps[s] = { n: e[s].n, p: a };
            this.k || this.getValue(true), this._isAnimated = this.k;
          }
          function GradientProperty(t, e, r) {
            this.data = e, this.c = createTypedArray("uint8c", 4 * e.p);
            var i2 = e.k.k[0].s ? e.k.k[0].s.length - 4 * e.p : e.k.k.length - 4 * e.p;
            this.o = createTypedArray("float32", i2), this._cmdf = false, this._omdf = false, this._collapsable = this.checkCollapsable(), this._hasOpacity = i2, this.initDynamicPropertyContainer(r), this.prop = PropertyFactory.getProp(t, e.k, 1, null, this), this.k = this.prop.k, this.getValue(true);
          }
          ShapeModifier.prototype.initModifierProperties = function() {
          }, ShapeModifier.prototype.addShapeToModifier = function() {
          }, ShapeModifier.prototype.addShape = function(t) {
            if (!this.closed) {
              t.sh.container.addDynamicProperty(t.sh);
              var e = { shape: t.sh, data: t, localShapeCollection: shapeCollection_pool.newShapeCollection() };
              this.shapes.push(e), this.addShapeToModifier(e), this._isAnimated && t.setAsAnimated();
            }
          }, ShapeModifier.prototype.init = function(t, e) {
            this.shapes = [], this.elem = t, this.initDynamicPropertyContainer(t), this.initModifierProperties(t, e), this.frameId = initialDefaultFrame, this.closed = false, this.k = false, this.dynamicProperties.length ? this.k = true : this.getValue(true);
          }, ShapeModifier.prototype.processKeys = function() {
            this.elem.globalData.frameId !== this.frameId && (this.frameId = this.elem.globalData.frameId, this.iterateDynamicProperties());
          }, extendPrototype([DynamicPropertyContainer], ShapeModifier), extendPrototype([ShapeModifier], TrimModifier), TrimModifier.prototype.initModifierProperties = function(t, e) {
            this.s = PropertyFactory.getProp(t, e.s, 0, 0.01, this), this.e = PropertyFactory.getProp(t, e.e, 0, 0.01, this), this.o = PropertyFactory.getProp(t, e.o, 0, 0, this), this.sValue = 0, this.eValue = 0, this.getValue = this.processKeys, this.m = e.m, this._isAnimated = !!this.s.effectsSequence.length || !!this.e.effectsSequence.length || !!this.o.effectsSequence.length;
          }, TrimModifier.prototype.addShapeToModifier = function(t) {
            t.pathsData = [];
          }, TrimModifier.prototype.calculateShapeEdges = function(t, e, r, i2, s) {
            var a = [];
            e <= 1 ? a.push({ s: t, e }) : t >= 1 ? a.push({ s: t - 1, e: e - 1 }) : (a.push({ s: t, e: 1 }), a.push({ s: 0, e: e - 1 }));
            var n, o, h = [], l = a.length;
            for (n = 0; n < l; n += 1) {
              var p, f;
              if ((o = a[n]).e * s < i2 || o.s * s > i2 + r)
                ;
              else
                p = o.s * s <= i2 ? 0 : (o.s * s - i2) / r, f = o.e * s >= i2 + r ? 1 : (o.e * s - i2) / r, h.push([p, f]);
            }
            return h.length || h.push([0, 0]), h;
          }, TrimModifier.prototype.releasePathsData = function(t) {
            var e, r = t.length;
            for (e = 0; e < r; e += 1)
              segments_length_pool.release(t[e]);
            return t.length = 0, t;
          }, TrimModifier.prototype.processShapes = function(t) {
            var e, r, i2;
            if (this._mdf || t) {
              var s = this.o.v % 360 / 360;
              if (s < 0 && (s += 1), (e = (this.s.v > 1 ? 1 : this.s.v < 0 ? 0 : this.s.v) + s) > (r = (this.e.v > 1 ? 1 : this.e.v < 0 ? 0 : this.e.v) + s)) {
                var a = e;
                e = r, r = a;
              }
              e = 1e-4 * Math.round(1e4 * e), r = 1e-4 * Math.round(1e4 * r), this.sValue = e, this.eValue = r;
            } else
              e = this.sValue, r = this.eValue;
            var n, o, h, l, p, f, m = this.shapes.length, c = 0;
            if (r === e)
              for (n = 0; n < m; n += 1)
                this.shapes[n].localShapeCollection.releaseShapes(), this.shapes[n].shape._mdf = true, this.shapes[n].shape.paths = this.shapes[n].localShapeCollection;
            else if (1 === r && 0 === e || 0 === r && 1 === e) {
              if (this._mdf)
                for (n = 0; n < m; n += 1)
                  this.shapes[n].pathsData.length = 0, this.shapes[n].shape._mdf = true;
            } else {
              var d, u, y = [];
              for (n = 0; n < m; n += 1)
                if ((d = this.shapes[n]).shape._mdf || this._mdf || t || 2 === this.m) {
                  if (h = (i2 = d.shape.paths)._length, f = 0, !d.shape._mdf && d.pathsData.length)
                    f = d.totalShapeLength;
                  else {
                    for (l = this.releasePathsData(d.pathsData), o = 0; o < h; o += 1)
                      p = bez.getSegmentsLength(i2.shapes[o]), l.push(p), f += p.totalLength;
                    d.totalShapeLength = f, d.pathsData = l;
                  }
                  c += f, d.shape._mdf = true;
                } else
                  d.shape.paths = d.localShapeCollection;
              var g, v = e, b = r, P = 0;
              for (n = m - 1; n >= 0; n -= 1)
                if ((d = this.shapes[n]).shape._mdf) {
                  for ((u = d.localShapeCollection).releaseShapes(), 2 === this.m && m > 1 ? (g = this.calculateShapeEdges(e, r, d.totalShapeLength, P, c), P += d.totalShapeLength) : g = [[v, b]], h = g.length, o = 0; o < h; o += 1) {
                    v = g[o][0], b = g[o][1], y.length = 0, b <= 1 ? y.push({ s: d.totalShapeLength * v, e: d.totalShapeLength * b }) : v >= 1 ? y.push({ s: d.totalShapeLength * (v - 1), e: d.totalShapeLength * (b - 1) }) : (y.push({ s: d.totalShapeLength * v, e: d.totalShapeLength }), y.push({ s: 0, e: d.totalShapeLength * (b - 1) }));
                    var _ = this.addShapes(d, y[0]);
                    if (y[0].s !== y[0].e) {
                      if (y.length > 1)
                        if (d.shape.paths.shapes[d.shape.paths._length - 1].c) {
                          var x = _.pop();
                          this.addPaths(_, u), _ = this.addShapes(d, y[1], x);
                        } else
                          this.addPaths(_, u), _ = this.addShapes(d, y[1]);
                      this.addPaths(_, u);
                    }
                  }
                  d.shape.paths = u;
                }
            }
          }, TrimModifier.prototype.addPaths = function(t, e) {
            var r, i2 = t.length;
            for (r = 0; r < i2; r += 1)
              e.addShape(t[r]);
          }, TrimModifier.prototype.addSegment = function(t, e, r, i2, s, a, n) {
            s.setXYAt(e[0], e[1], "o", a), s.setXYAt(r[0], r[1], "i", a + 1), n && s.setXYAt(t[0], t[1], "v", a), s.setXYAt(i2[0], i2[1], "v", a + 1);
          }, TrimModifier.prototype.addSegmentFromArray = function(t, e, r, i2) {
            e.setXYAt(t[1], t[5], "o", r), e.setXYAt(t[2], t[6], "i", r + 1), i2 && e.setXYAt(t[0], t[4], "v", r), e.setXYAt(t[3], t[7], "v", r + 1);
          }, TrimModifier.prototype.addShapes = function(t, e, r) {
            var i2, s, a, n, o, h, l, p, f = t.pathsData, m = t.shape.paths.shapes, c = t.shape.paths._length, d = 0, u = [], y = true;
            for (r ? (o = r._length, p = r._length) : (r = shape_pool.newElement(), o = 0, p = 0), u.push(r), i2 = 0; i2 < c; i2 += 1) {
              for (h = f[i2].lengths, r.c = m[i2].c, a = m[i2].c ? h.length : h.length + 1, s = 1; s < a; s += 1)
                if (d + (n = h[s - 1]).addedLength < e.s)
                  d += n.addedLength, r.c = false;
                else {
                  if (d > e.e) {
                    r.c = false;
                    break;
                  }
                  e.s <= d && e.e >= d + n.addedLength ? (this.addSegment(m[i2].v[s - 1], m[i2].o[s - 1], m[i2].i[s], m[i2].v[s], r, o, y), y = false) : (l = bez.getNewSegment(m[i2].v[s - 1], m[i2].v[s], m[i2].o[s - 1], m[i2].i[s], (e.s - d) / n.addedLength, (e.e - d) / n.addedLength, h[s - 1]), this.addSegmentFromArray(l, r, o, y), y = false, r.c = false), d += n.addedLength, o += 1;
                }
              if (m[i2].c && h.length) {
                if (n = h[s - 1], d <= e.e) {
                  var g = h[s - 1].addedLength;
                  e.s <= d && e.e >= d + g ? (this.addSegment(m[i2].v[s - 1], m[i2].o[s - 1], m[i2].i[0], m[i2].v[0], r, o, y), y = false) : (l = bez.getNewSegment(m[i2].v[s - 1], m[i2].v[0], m[i2].o[s - 1], m[i2].i[0], (e.s - d) / g, (e.e - d) / g, h[s - 1]), this.addSegmentFromArray(l, r, o, y), y = false, r.c = false);
                } else
                  r.c = false;
                d += n.addedLength, o += 1;
              }
              if (r._length && (r.setXYAt(r.v[p][0], r.v[p][1], "i", p), r.setXYAt(r.v[r._length - 1][0], r.v[r._length - 1][1], "o", r._length - 1)), d > e.e)
                break;
              i2 < c - 1 && (r = shape_pool.newElement(), y = true, u.push(r), o = 0);
            }
            return u;
          }, ShapeModifiers.registerModifier("tm", TrimModifier), extendPrototype([ShapeModifier], RoundCornersModifier), RoundCornersModifier.prototype.initModifierProperties = function(t, e) {
            this.getValue = this.processKeys, this.rd = PropertyFactory.getProp(t, e.r, 0, null, this), this._isAnimated = !!this.rd.effectsSequence.length;
          }, RoundCornersModifier.prototype.processPath = function(t, e) {
            var r = shape_pool.newElement();
            r.c = t.c;
            var i2, s, a, n, o, h, l, p, f, m, c, d, u, y = t._length, g = 0;
            for (i2 = 0; i2 < y; i2 += 1)
              s = t.v[i2], n = t.o[i2], a = t.i[i2], s[0] === n[0] && s[1] === n[1] && s[0] === a[0] && s[1] === a[1] ? 0 !== i2 && i2 !== y - 1 || t.c ? (o = 0 === i2 ? t.v[y - 1] : t.v[i2 - 1], l = (h = Math.sqrt(Math.pow(s[0] - o[0], 2) + Math.pow(s[1] - o[1], 2))) ? Math.min(h / 2, e) / h : 0, p = d = s[0] + (o[0] - s[0]) * l, f = u = s[1] - (s[1] - o[1]) * l, m = p - (p - s[0]) * roundCorner, c = f - (f - s[1]) * roundCorner, r.setTripleAt(p, f, m, c, d, u, g), g += 1, o = i2 === y - 1 ? t.v[0] : t.v[i2 + 1], l = (h = Math.sqrt(Math.pow(s[0] - o[0], 2) + Math.pow(s[1] - o[1], 2))) ? Math.min(h / 2, e) / h : 0, p = m = s[0] + (o[0] - s[0]) * l, f = c = s[1] + (o[1] - s[1]) * l, d = p - (p - s[0]) * roundCorner, u = f - (f - s[1]) * roundCorner, r.setTripleAt(p, f, m, c, d, u, g), g += 1) : (r.setTripleAt(s[0], s[1], n[0], n[1], a[0], a[1], g), g += 1) : (r.setTripleAt(t.v[i2][0], t.v[i2][1], t.o[i2][0], t.o[i2][1], t.i[i2][0], t.i[i2][1], g), g += 1);
            return r;
          }, RoundCornersModifier.prototype.processShapes = function(t) {
            var e, r, i2, s, a, n, o = this.shapes.length, h = this.rd.v;
            if (0 !== h)
              for (r = 0; r < o; r += 1) {
                if ((a = this.shapes[r]).shape.paths, n = a.localShapeCollection, a.shape._mdf || this._mdf || t)
                  for (n.releaseShapes(), a.shape._mdf = true, e = a.shape.paths.shapes, s = a.shape.paths._length, i2 = 0; i2 < s; i2 += 1)
                    n.addShape(this.processPath(e[i2], h));
                a.shape.paths = a.localShapeCollection;
              }
            this.dynamicProperties.length || (this._mdf = false);
          }, ShapeModifiers.registerModifier("rd", RoundCornersModifier), extendPrototype([ShapeModifier], RepeaterModifier), RepeaterModifier.prototype.initModifierProperties = function(t, e) {
            this.getValue = this.processKeys, this.c = PropertyFactory.getProp(t, e.c, 0, null, this), this.o = PropertyFactory.getProp(t, e.o, 0, null, this), this.tr = TransformPropertyFactory.getTransformProperty(t, e.tr, this), this.so = PropertyFactory.getProp(t, e.tr.so, 0, 0.01, this), this.eo = PropertyFactory.getProp(t, e.tr.eo, 0, 0.01, this), this.data = e, this.dynamicProperties.length || this.getValue(true), this._isAnimated = !!this.dynamicProperties.length, this.pMatrix = new Matrix(), this.rMatrix = new Matrix(), this.sMatrix = new Matrix(), this.tMatrix = new Matrix(), this.matrix = new Matrix();
          }, RepeaterModifier.prototype.applyTransforms = function(t, e, r, i2, s, a) {
            var n = a ? -1 : 1, o = i2.s.v[0] + (1 - i2.s.v[0]) * (1 - s), h = i2.s.v[1] + (1 - i2.s.v[1]) * (1 - s);
            t.translate(i2.p.v[0] * n * s, i2.p.v[1] * n * s, i2.p.v[2]), e.translate(-i2.a.v[0], -i2.a.v[1], i2.a.v[2]), e.rotate(-i2.r.v * n * s), e.translate(i2.a.v[0], i2.a.v[1], i2.a.v[2]), r.translate(-i2.a.v[0], -i2.a.v[1], i2.a.v[2]), r.scale(a ? 1 / o : o, a ? 1 / h : h), r.translate(i2.a.v[0], i2.a.v[1], i2.a.v[2]);
          }, RepeaterModifier.prototype.init = function(t, e, r, i2) {
            this.elem = t, this.arr = e, this.pos = r, this.elemsData = i2, this._currentCopies = 0, this._elements = [], this._groups = [], this.frameId = -1, this.initDynamicPropertyContainer(t), this.initModifierProperties(t, e[r]);
            for (; r > 0; )
              r -= 1, this._elements.unshift(e[r]), 1;
            this.dynamicProperties.length ? this.k = true : this.getValue(true);
          }, RepeaterModifier.prototype.resetElements = function(t) {
            var e, r = t.length;
            for (e = 0; e < r; e += 1)
              t[e]._processed = false, "gr" === t[e].ty && this.resetElements(t[e].it);
          }, RepeaterModifier.prototype.cloneElements = function(t) {
            t.length;
            var e = JSON.parse(JSON.stringify(t));
            return this.resetElements(e), e;
          }, RepeaterModifier.prototype.changeGroupRender = function(t, e) {
            var r, i2 = t.length;
            for (r = 0; r < i2; r += 1)
              t[r]._render = e, "gr" === t[r].ty && this.changeGroupRender(t[r].it, e);
          }, RepeaterModifier.prototype.processShapes = function(t) {
            var e, r, i2, s, a;
            if (this._mdf || t) {
              var n, o = Math.ceil(this.c.v);
              if (this._groups.length < o) {
                for (; this._groups.length < o; ) {
                  var h = { it: this.cloneElements(this._elements), ty: "gr" };
                  h.it.push({ a: { a: 0, ix: 1, k: [0, 0] }, nm: "Transform", o: { a: 0, ix: 7, k: 100 }, p: { a: 0, ix: 2, k: [0, 0] }, r: { a: 1, ix: 6, k: [{ s: 0, e: 0, t: 0 }, { s: 0, e: 0, t: 1 }] }, s: { a: 0, ix: 3, k: [100, 100] }, sa: { a: 0, ix: 5, k: 0 }, sk: { a: 0, ix: 4, k: 0 }, ty: "tr" }), this.arr.splice(0, 0, h), this._groups.splice(0, 0, h), this._currentCopies += 1;
                }
                this.elem.reloadShapes();
              }
              for (a = 0, i2 = 0; i2 <= this._groups.length - 1; i2 += 1)
                n = a < o, this._groups[i2]._render = n, this.changeGroupRender(this._groups[i2].it, n), a += 1;
              this._currentCopies = o;
              var l = this.o.v, p = l % 1, f = l > 0 ? Math.floor(l) : Math.ceil(l), m = (this.tr.v.props, this.pMatrix.props), c = this.rMatrix.props, d = this.sMatrix.props;
              this.pMatrix.reset(), this.rMatrix.reset(), this.sMatrix.reset(), this.tMatrix.reset(), this.matrix.reset();
              var u, y, g = 0;
              if (l > 0) {
                for (; g < f; )
                  this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, 1, false), g += 1;
                p && (this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, p, false), g += p);
              } else if (l < 0) {
                for (; g > f; )
                  this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, 1, true), g -= 1;
                p && (this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, -p, true), g -= p);
              }
              for (i2 = 1 === this.data.m ? 0 : this._currentCopies - 1, s = 1 === this.data.m ? 1 : -1, a = this._currentCopies; a; ) {
                if (y = (r = (e = this.elemsData[i2].it)[e.length - 1].transform.mProps.v.props).length, e[e.length - 1].transform.mProps._mdf = true, e[e.length - 1].transform.op._mdf = true, e[e.length - 1].transform.op.v = this.so.v + (this.eo.v - this.so.v) * (i2 / (this._currentCopies - 1)), 0 !== g) {
                  for ((0 !== i2 && 1 === s || i2 !== this._currentCopies - 1 && -1 === s) && this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, 1, false), this.matrix.transform(c[0], c[1], c[2], c[3], c[4], c[5], c[6], c[7], c[8], c[9], c[10], c[11], c[12], c[13], c[14], c[15]), this.matrix.transform(d[0], d[1], d[2], d[3], d[4], d[5], d[6], d[7], d[8], d[9], d[10], d[11], d[12], d[13], d[14], d[15]), this.matrix.transform(m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8], m[9], m[10], m[11], m[12], m[13], m[14], m[15]), u = 0; u < y; u += 1)
                    r[u] = this.matrix.props[u];
                  this.matrix.reset();
                } else
                  for (this.matrix.reset(), u = 0; u < y; u += 1)
                    r[u] = this.matrix.props[u];
                g += 1, a -= 1, i2 += s;
              }
            } else
              for (a = this._currentCopies, i2 = 0, s = 1; a; )
                r = (e = this.elemsData[i2].it)[e.length - 1].transform.mProps.v.props, e[e.length - 1].transform.mProps._mdf = false, e[e.length - 1].transform.op._mdf = false, a -= 1, i2 += s;
          }, RepeaterModifier.prototype.addShape = function() {
          }, ShapeModifiers.registerModifier("rp", RepeaterModifier), ShapeCollection.prototype.addShape = function(t) {
            this._length === this._maxLength && (this.shapes = this.shapes.concat(createSizedArray(this._maxLength)), this._maxLength *= 2), this.shapes[this._length] = t, this._length += 1;
          }, ShapeCollection.prototype.releaseShapes = function() {
            var t;
            for (t = 0; t < this._length; t += 1)
              shape_pool.release(this.shapes[t]);
            this._length = 0;
          }, DashProperty.prototype.getValue = function(t) {
            if ((this.elem.globalData.frameId !== this.frameId || t) && (this.frameId = this.elem.globalData.frameId, this.iterateDynamicProperties(), this._mdf = this._mdf || t, this._mdf)) {
              var e = 0, r = this.dataProps.length;
              for ("svg" === this.renderer && (this.dashStr = ""), e = 0; e < r; e += 1)
                "o" != this.dataProps[e].n ? "svg" === this.renderer ? this.dashStr += " " + this.dataProps[e].p.v : this.dashArray[e] = this.dataProps[e].p.v : this.dashoffset[0] = this.dataProps[e].p.v;
            }
          }, extendPrototype([DynamicPropertyContainer], DashProperty), GradientProperty.prototype.comparePoints = function(t, e) {
            for (var r = 0, i2 = this.o.length / 2; r < i2; ) {
              if (Math.abs(t[4 * r] - t[4 * e + 2 * r]) > 0.01)
                return false;
              r += 1;
            }
            return true;
          }, GradientProperty.prototype.checkCollapsable = function() {
            if (this.o.length / 2 != this.c.length / 4)
              return false;
            if (this.data.k.k[0].s)
              for (var t = 0, e = this.data.k.k.length; t < e; ) {
                if (!this.comparePoints(this.data.k.k[t].s, this.data.p))
                  return false;
                t += 1;
              }
            else if (!this.comparePoints(this.data.k.k, this.data.p))
              return false;
            return true;
          }, GradientProperty.prototype.getValue = function(t) {
            if (this.prop.getValue(), this._mdf = false, this._cmdf = false, this._omdf = false, this.prop._mdf || t) {
              var e, r, i2, s = 4 * this.data.p;
              for (e = 0; e < s; e += 1)
                r = e % 4 == 0 ? 100 : 255, i2 = Math.round(this.prop.v[e] * r), this.c[e] !== i2 && (this.c[e] = i2, this._cmdf = !t);
              if (this.o.length)
                for (s = this.prop.v.length, e = 4 * this.data.p; e < s; e += 1)
                  r = e % 2 == 0 ? 100 : 1, i2 = e % 2 == 0 ? Math.round(100 * this.prop.v[e]) : this.prop.v[e], this.o[e - 4 * this.data.p] !== i2 && (this.o[e - 4 * this.data.p] = i2, this._omdf = !t);
              this._mdf = !t;
            }
          }, extendPrototype([DynamicPropertyContainer], GradientProperty);
          var buildShapeString = function(t, e, r, i2) {
            if (0 === e)
              return "";
            var s, a = t.o, n = t.i, o = t.v, h = " M" + i2.applyToPointStringified(o[0][0], o[0][1]);
            for (s = 1; s < e; s += 1)
              h += " C" + i2.applyToPointStringified(a[s - 1][0], a[s - 1][1]) + " " + i2.applyToPointStringified(n[s][0], n[s][1]) + " " + i2.applyToPointStringified(o[s][0], o[s][1]);
            return r && e && (h += " C" + i2.applyToPointStringified(a[s - 1][0], a[s - 1][1]) + " " + i2.applyToPointStringified(n[0][0], n[0][1]) + " " + i2.applyToPointStringified(o[0][0], o[0][1]), h += "z"), h;
          }, ImagePreloader = function() {
            var t = function() {
              var t2 = createTag("canvas");
              t2.width = 1, t2.height = 1;
              var e2 = t2.getContext("2d");
              return e2.fillStyle = "rgba(0,0,0,0)", e2.fillRect(0, 0, 1, 1), t2;
            }();
            function e() {
              this.loadedAssets += 1, this.loadedAssets === this.totalImages && this.imagesLoadedCb && this.imagesLoadedCb(null);
            }
            function r(e2) {
              var r2 = function(t2, e3, r3) {
                var i4 = "";
                if (t2.e)
                  i4 = t2.p;
                else if (e3) {
                  var s3 = t2.p;
                  -1 !== s3.indexOf("images/") && (s3 = s3.split("/")[1]), i4 = e3 + s3;
                } else
                  i4 = r3, i4 += t2.u ? t2.u : "", i4 += t2.p;
                return i4;
              }(e2, this.assetsPath, this.path), i3 = createTag("img");
              i3.crossOrigin = "anonymous", i3.addEventListener("load", this._imageLoaded.bind(this), false), i3.addEventListener("error", (function() {
                s2.img = t, this._imageLoaded();
              }).bind(this), false), i3.src = r2;
              var s2 = { img: i3, assetData: e2 };
              return s2;
            }
            function i2(t2, e2) {
              this.imagesLoadedCb = e2;
              var r2, i3 = t2.length;
              for (r2 = 0; r2 < i3; r2 += 1)
                t2[r2].layers || (this.totalImages += 1, this.images.push(this._createImageData(t2[r2])));
            }
            function s(t2) {
              this.path = t2 || "";
            }
            function a(t2) {
              this.assetsPath = t2 || "";
            }
            function n(t2) {
              for (var e2 = 0, r2 = this.images.length; e2 < r2; ) {
                if (this.images[e2].assetData === t2)
                  return this.images[e2].img;
                e2 += 1;
              }
            }
            function o() {
              this.imagesLoadedCb = null, this.images.length = 0;
            }
            function h() {
              return this.totalImages === this.loadedAssets;
            }
            return function() {
              this.loadAssets = i2, this.setAssetsPath = a, this.setPath = s, this.loaded = h, this.destroy = o, this.getImage = n, this._createImageData = r, this._imageLoaded = e, this.assetsPath = "", this.path = "", this.totalImages = 0, this.loadedAssets = 0, this.imagesLoadedCb = null, this.images = [];
            };
          }(), featureSupport = function() {
            var t = { maskType: true };
            return (/MSIE 10/i.test(navigator.userAgent) || /MSIE 9/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent) || /Edge\/\d./i.test(navigator.userAgent)) && (t.maskType = false), t;
          }(), filtersFactory = function() {
            var t = {};
            return t.createFilter = function(t2) {
              var e = createNS("filter");
              return e.setAttribute("id", t2), e.setAttribute("filterUnits", "objectBoundingBox"), e.setAttribute("x", "0%"), e.setAttribute("y", "0%"), e.setAttribute("width", "100%"), e.setAttribute("height", "100%"), e;
            }, t.createAlphaToLuminanceFilter = function() {
              var t2 = createNS("feColorMatrix");
              return t2.setAttribute("type", "matrix"), t2.setAttribute("color-interpolation-filters", "sRGB"), t2.setAttribute("values", "0 0 0 1 0  0 0 0 1 0  0 0 0 1 0  0 0 0 1 1"), t2;
            }, t;
          }(), assetLoader = /* @__PURE__ */ function() {
            function t(t2) {
              return t2.response && "object" === _typeof(t2.response) ? t2.response : t2.response && "string" == typeof t2.response ? JSON.parse(t2.response) : t2.responseText ? JSON.parse(t2.responseText) : void 0;
            }
            return { load: function(e, r, i2) {
              var s, a = new XMLHttpRequest();
              a.open("GET", e, true);
              try {
                a.responseType = "json";
              } catch (t2) {
              }
              a.send(), a.onreadystatechange = function() {
                if (4 == a.readyState)
                  if (200 == a.status)
                    s = t(a), r(s);
                  else
                    try {
                      s = t(a), r(s);
                    } catch (t2) {
                      i2 && i2(t2);
                    }
              };
            } };
          }();
          function TextAnimatorProperty(t, e, r) {
            this._isFirstFrame = true, this._hasMaskedPath = false, this._frameId = -1, this._textData = t, this._renderType = e, this._elem = r, this._animatorsData = createSizedArray(this._textData.a.length), this._pathData = {}, this._moreOptions = { alignment: {} }, this.renderedLetters = [], this.lettersChangedFlag = false, this.initDynamicPropertyContainer(r);
          }
          function TextAnimatorDataProperty(t, e, r) {
            var i2 = { propType: false }, s = PropertyFactory.getProp, a = e.a;
            this.a = { r: a.r ? s(t, a.r, 0, degToRads, r) : i2, rx: a.rx ? s(t, a.rx, 0, degToRads, r) : i2, ry: a.ry ? s(t, a.ry, 0, degToRads, r) : i2, sk: a.sk ? s(t, a.sk, 0, degToRads, r) : i2, sa: a.sa ? s(t, a.sa, 0, degToRads, r) : i2, s: a.s ? s(t, a.s, 1, 0.01, r) : i2, a: a.a ? s(t, a.a, 1, 0, r) : i2, o: a.o ? s(t, a.o, 0, 0.01, r) : i2, p: a.p ? s(t, a.p, 1, 0, r) : i2, sw: a.sw ? s(t, a.sw, 0, 0, r) : i2, sc: a.sc ? s(t, a.sc, 1, 0, r) : i2, fc: a.fc ? s(t, a.fc, 1, 0, r) : i2, fh: a.fh ? s(t, a.fh, 0, 0, r) : i2, fs: a.fs ? s(t, a.fs, 0, 0.01, r) : i2, fb: a.fb ? s(t, a.fb, 0, 0.01, r) : i2, t: a.t ? s(t, a.t, 0, 0, r) : i2 }, this.s = TextSelectorProp.getTextSelectorProp(t, e.s, r), this.s.t = e.s.t;
          }
          function LetterProps(t, e, r, i2, s, a) {
            this.o = t, this.sw = e, this.sc = r, this.fc = i2, this.m = s, this.p = a, this._mdf = { o: true, sw: !!e, sc: !!r, fc: !!i2, m: true, p: true };
          }
          function TextProperty(t, e) {
            this._frameId = initialDefaultFrame, this.pv = "", this.v = "", this.kf = false, this._isFirstFrame = true, this._mdf = false, this.data = e, this.elem = t, this.comp = this.elem.comp, this.keysIndex = 0, this.canResize = false, this.minimumFontSize = 1, this.effectsSequence = [], this.currentData = { ascent: 0, boxWidth: this.defaultBoxWidth, f: "", fStyle: "", fWeight: "", fc: "", j: "", justifyOffset: "", l: [], lh: 0, lineWidths: [], ls: "", of: "", s: "", sc: "", sw: 0, t: 0, tr: 0, sz: 0, ps: null, fillColorAnim: false, strokeColorAnim: false, strokeWidthAnim: false, yOffset: 0, finalSize: 0, finalText: [], finalLineHeight: 0, __complete: false }, this.copyData(this.currentData, this.data.d.k[0].s), this.searchProperty() || this.completeTextData(this.currentData);
          }
          TextAnimatorProperty.prototype.searchProperties = function() {
            var t, e, r = this._textData.a.length, i2 = PropertyFactory.getProp;
            for (t = 0; t < r; t += 1)
              e = this._textData.a[t], this._animatorsData[t] = new TextAnimatorDataProperty(this._elem, e, this);
            this._textData.p && "m" in this._textData.p ? (this._pathData = { f: i2(this._elem, this._textData.p.f, 0, 0, this), l: i2(this._elem, this._textData.p.l, 0, 0, this), r: this._textData.p.r, m: this._elem.maskManager.getMaskProperty(this._textData.p.m) }, this._hasMaskedPath = true) : this._hasMaskedPath = false, this._moreOptions.alignment = i2(this._elem, this._textData.m.a, 1, 0, this);
          }, TextAnimatorProperty.prototype.getMeasures = function(t, e) {
            if (this.lettersChangedFlag = e, this._mdf || this._isFirstFrame || e || this._hasMaskedPath && this._pathData.m._mdf) {
              this._isFirstFrame = false;
              var r, i2, s, a, n, o, h, l, p, f, m, c, d, u, y, g, v, b, P, _ = this._moreOptions.alignment.v, x = this._animatorsData, S = this._textData, E = this.mHelper, T = this._renderType, C = this.renderedLetters.length, A = (this.data, t.l);
              if (this._hasMaskedPath) {
                if (P = this._pathData.m, !this._pathData.n || this._pathData._mdf) {
                  var k, D = P.v;
                  for (this._pathData.r && (D = D.reverse()), n = { tLength: 0, segments: [] }, a = D._length - 1, g = 0, s = 0; s < a; s += 1)
                    k = bez.buildBezierData(D.v[s], D.v[s + 1], [D.o[s][0] - D.v[s][0], D.o[s][1] - D.v[s][1]], [D.i[s + 1][0] - D.v[s + 1][0], D.i[s + 1][1] - D.v[s + 1][1]]), n.tLength += k.segmentLength, n.segments.push(k), g += k.segmentLength;
                  s = a, P.v.c && (k = bez.buildBezierData(D.v[s], D.v[0], [D.o[s][0] - D.v[s][0], D.o[s][1] - D.v[s][1]], [D.i[0][0] - D.v[0][0], D.i[0][1] - D.v[0][1]]), n.tLength += k.segmentLength, n.segments.push(k), g += k.segmentLength), this._pathData.pi = n;
                }
                if (n = this._pathData.pi, o = this._pathData.f.v, m = 0, f = 1, l = 0, p = true, u = n.segments, o < 0 && P.v.c)
                  for (n.tLength < Math.abs(o) && (o = -Math.abs(o) % n.tLength), f = (d = u[m = u.length - 1].points).length - 1; o < 0; )
                    o += d[f].partialLength, (f -= 1) < 0 && (f = (d = u[m -= 1].points).length - 1);
                c = (d = u[m].points)[f - 1], y = (h = d[f]).partialLength;
              }
              a = A.length, r = 0, i2 = 0;
              var M, I, w, F, R = 1.2 * t.finalSize * 0.714, V = true;
              w = x.length;
              var L, O, z, B, N, G, j, q, H, W, Y, X, K, $ = -1, J = o, U = m, Z = f, Q = -1, tt = "", et = this.defaultPropsArray;
              if (2 === t.j || 1 === t.j) {
                var rt = 0, it = 0, st = 2 === t.j ? -0.5 : -1, at = 0, nt = true;
                for (s = 0; s < a; s += 1)
                  if (A[s].n) {
                    for (rt && (rt += it); at < s; )
                      A[at].animatorJustifyOffset = rt, at += 1;
                    rt = 0, nt = true;
                  } else {
                    for (I = 0; I < w; I += 1)
                      (M = x[I].a).t.propType && (nt && 2 === t.j && (it += M.t.v * st), (L = x[I].s.getMult(A[s].anIndexes[I], S.a[I].s.totalChars)).length ? rt += M.t.v * L[0] * st : rt += M.t.v * L * st);
                    nt = false;
                  }
                for (rt && (rt += it); at < s; )
                  A[at].animatorJustifyOffset = rt, at += 1;
              }
              for (s = 0; s < a; s += 1) {
                if (E.reset(), N = 1, A[s].n)
                  r = 0, i2 += t.yOffset, i2 += V ? 1 : 0, o = J, V = false, 0, this._hasMaskedPath && (f = Z, c = (d = u[m = U].points)[f - 1], y = (h = d[f]).partialLength, l = 0), K = W = X = tt = "", et = this.defaultPropsArray;
                else {
                  if (this._hasMaskedPath) {
                    if (Q !== A[s].line) {
                      switch (t.j) {
                        case 1:
                          o += g - t.lineWidths[A[s].line];
                          break;
                        case 2:
                          o += (g - t.lineWidths[A[s].line]) / 2;
                      }
                      Q = A[s].line;
                    }
                    $ !== A[s].ind && (A[$] && (o += A[$].extra), o += A[s].an / 2, $ = A[s].ind), o += _[0] * A[s].an / 200;
                    var ot = 0;
                    for (I = 0; I < w; I += 1)
                      (M = x[I].a).p.propType && ((L = x[I].s.getMult(A[s].anIndexes[I], S.a[I].s.totalChars)).length ? ot += M.p.v[0] * L[0] : ot += M.p.v[0] * L), M.a.propType && ((L = x[I].s.getMult(A[s].anIndexes[I], S.a[I].s.totalChars)).length ? ot += M.a.v[0] * L[0] : ot += M.a.v[0] * L);
                    for (p = true; p; )
                      l + y >= o + ot || !d ? (v = (o + ot - l) / h.partialLength, z = c.point[0] + (h.point[0] - c.point[0]) * v, B = c.point[1] + (h.point[1] - c.point[1]) * v, E.translate(-_[0] * A[s].an / 200, -_[1] * R / 100), p = false) : d && (l += h.partialLength, (f += 1) >= d.length && (f = 0, u[m += 1] ? d = u[m].points : P.v.c ? (f = 0, d = u[m = 0].points) : (l -= h.partialLength, d = null)), d && (c = h, y = (h = d[f]).partialLength));
                    O = A[s].an / 2 - A[s].add, E.translate(-O, 0, 0);
                  } else
                    O = A[s].an / 2 - A[s].add, E.translate(-O, 0, 0), E.translate(-_[0] * A[s].an / 200, -_[1] * R / 100, 0);
                  for (A[s].l / 2, I = 0; I < w; I += 1)
                    (M = x[I].a).t.propType && (L = x[I].s.getMult(A[s].anIndexes[I], S.a[I].s.totalChars), 0 === r && 0 === t.j || (this._hasMaskedPath ? L.length ? o += M.t.v * L[0] : o += M.t.v * L : L.length ? r += M.t.v * L[0] : r += M.t.v * L));
                  for (A[s].l / 2, t.strokeWidthAnim && (j = t.sw || 0), t.strokeColorAnim && (G = t.sc ? [t.sc[0], t.sc[1], t.sc[2]] : [0, 0, 0]), t.fillColorAnim && t.fc && (q = [t.fc[0], t.fc[1], t.fc[2]]), I = 0; I < w; I += 1)
                    (M = x[I].a).a.propType && ((L = x[I].s.getMult(A[s].anIndexes[I], S.a[I].s.totalChars)).length ? E.translate(-M.a.v[0] * L[0], -M.a.v[1] * L[1], M.a.v[2] * L[2]) : E.translate(-M.a.v[0] * L, -M.a.v[1] * L, M.a.v[2] * L));
                  for (I = 0; I < w; I += 1)
                    (M = x[I].a).s.propType && ((L = x[I].s.getMult(A[s].anIndexes[I], S.a[I].s.totalChars)).length ? E.scale(1 + (M.s.v[0] - 1) * L[0], 1 + (M.s.v[1] - 1) * L[1], 1) : E.scale(1 + (M.s.v[0] - 1) * L, 1 + (M.s.v[1] - 1) * L, 1));
                  for (I = 0; I < w; I += 1) {
                    if (M = x[I].a, L = x[I].s.getMult(A[s].anIndexes[I], S.a[I].s.totalChars), M.sk.propType && (L.length ? E.skewFromAxis(-M.sk.v * L[0], M.sa.v * L[1]) : E.skewFromAxis(-M.sk.v * L, M.sa.v * L)), M.r.propType && (L.length ? E.rotateZ(-M.r.v * L[2]) : E.rotateZ(-M.r.v * L)), M.ry.propType && (L.length ? E.rotateY(M.ry.v * L[1]) : E.rotateY(M.ry.v * L)), M.rx.propType && (L.length ? E.rotateX(M.rx.v * L[0]) : E.rotateX(M.rx.v * L)), M.o.propType && (L.length ? N += (M.o.v * L[0] - N) * L[0] : N += (M.o.v * L - N) * L), t.strokeWidthAnim && M.sw.propType && (L.length ? j += M.sw.v * L[0] : j += M.sw.v * L), t.strokeColorAnim && M.sc.propType)
                      for (H = 0; H < 3; H += 1)
                        L.length ? G[H] = G[H] + (M.sc.v[H] - G[H]) * L[0] : G[H] = G[H] + (M.sc.v[H] - G[H]) * L;
                    if (t.fillColorAnim && t.fc) {
                      if (M.fc.propType)
                        for (H = 0; H < 3; H += 1)
                          L.length ? q[H] = q[H] + (M.fc.v[H] - q[H]) * L[0] : q[H] = q[H] + (M.fc.v[H] - q[H]) * L;
                      M.fh.propType && (q = L.length ? addHueToRGB(q, M.fh.v * L[0]) : addHueToRGB(q, M.fh.v * L)), M.fs.propType && (q = L.length ? addSaturationToRGB(q, M.fs.v * L[0]) : addSaturationToRGB(q, M.fs.v * L)), M.fb.propType && (q = L.length ? addBrightnessToRGB(q, M.fb.v * L[0]) : addBrightnessToRGB(q, M.fb.v * L));
                    }
                  }
                  for (I = 0; I < w; I += 1)
                    (M = x[I].a).p.propType && (L = x[I].s.getMult(A[s].anIndexes[I], S.a[I].s.totalChars), this._hasMaskedPath ? L.length ? E.translate(0, M.p.v[1] * L[0], -M.p.v[2] * L[1]) : E.translate(0, M.p.v[1] * L, -M.p.v[2] * L) : L.length ? E.translate(M.p.v[0] * L[0], M.p.v[1] * L[1], -M.p.v[2] * L[2]) : E.translate(M.p.v[0] * L, M.p.v[1] * L, -M.p.v[2] * L));
                  if (t.strokeWidthAnim && (W = j < 0 ? 0 : j), t.strokeColorAnim && (Y = "rgb(" + Math.round(255 * G[0]) + "," + Math.round(255 * G[1]) + "," + Math.round(255 * G[2]) + ")"), t.fillColorAnim && t.fc && (X = "rgb(" + Math.round(255 * q[0]) + "," + Math.round(255 * q[1]) + "," + Math.round(255 * q[2]) + ")"), this._hasMaskedPath) {
                    if (E.translate(0, -t.ls), E.translate(0, _[1] * R / 100 + i2, 0), S.p.p) {
                      b = (h.point[1] - c.point[1]) / (h.point[0] - c.point[0]);
                      var ht = 180 * Math.atan(b) / Math.PI;
                      h.point[0] < c.point[0] && (ht += 180), E.rotate(-ht * Math.PI / 180);
                    }
                    E.translate(z, B, 0), o -= _[0] * A[s].an / 200, A[s + 1] && $ !== A[s + 1].ind && (o += A[s].an / 2, o += t.tr / 1e3 * t.finalSize);
                  } else {
                    switch (E.translate(r, i2, 0), t.ps && E.translate(t.ps[0], t.ps[1] + t.ascent, 0), t.j) {
                      case 1:
                        E.translate(A[s].animatorJustifyOffset + t.justifyOffset + (t.boxWidth - t.lineWidths[A[s].line]), 0, 0);
                        break;
                      case 2:
                        E.translate(A[s].animatorJustifyOffset + t.justifyOffset + (t.boxWidth - t.lineWidths[A[s].line]) / 2, 0, 0);
                    }
                    E.translate(0, -t.ls), E.translate(O, 0, 0), E.translate(_[0] * A[s].an / 200, _[1] * R / 100, 0), r += A[s].l + t.tr / 1e3 * t.finalSize;
                  }
                  "html" === T ? tt = E.toCSS() : "svg" === T ? tt = E.to2dCSS() : et = [E.props[0], E.props[1], E.props[2], E.props[3], E.props[4], E.props[5], E.props[6], E.props[7], E.props[8], E.props[9], E.props[10], E.props[11], E.props[12], E.props[13], E.props[14], E.props[15]], K = N;
                }
                C <= s ? (F = new LetterProps(K, W, Y, X, tt, et), this.renderedLetters.push(F), C += 1, this.lettersChangedFlag = true) : (F = this.renderedLetters[s], this.lettersChangedFlag = F.update(K, W, Y, X, tt, et) || this.lettersChangedFlag);
              }
            }
          }, TextAnimatorProperty.prototype.getValue = function() {
            this._elem.globalData.frameId !== this._frameId && (this._frameId = this._elem.globalData.frameId, this.iterateDynamicProperties());
          }, TextAnimatorProperty.prototype.mHelper = new Matrix(), TextAnimatorProperty.prototype.defaultPropsArray = [], extendPrototype([DynamicPropertyContainer], TextAnimatorProperty), LetterProps.prototype.update = function(t, e, r, i2, s, a) {
            this._mdf.o = false, this._mdf.sw = false, this._mdf.sc = false, this._mdf.fc = false, this._mdf.m = false, this._mdf.p = false;
            var n = false;
            return this.o !== t && (this.o = t, this._mdf.o = true, n = true), this.sw !== e && (this.sw = e, this._mdf.sw = true, n = true), this.sc !== r && (this.sc = r, this._mdf.sc = true, n = true), this.fc !== i2 && (this.fc = i2, this._mdf.fc = true, n = true), this.m !== s && (this.m = s, this._mdf.m = true, n = true), !a.length || this.p[0] === a[0] && this.p[1] === a[1] && this.p[4] === a[4] && this.p[5] === a[5] && this.p[12] === a[12] && this.p[13] === a[13] || (this.p = a, this._mdf.p = true, n = true), n;
          }, TextProperty.prototype.defaultBoxWidth = [0, 0], TextProperty.prototype.copyData = function(t, e) {
            for (var r in e)
              e.hasOwnProperty(r) && (t[r] = e[r]);
            return t;
          }, TextProperty.prototype.setCurrentData = function(t) {
            t.__complete || this.completeTextData(t), this.currentData = t, this.currentData.boxWidth = this.currentData.boxWidth || this.defaultBoxWidth, this._mdf = true;
          }, TextProperty.prototype.searchProperty = function() {
            return this.searchKeyframes();
          }, TextProperty.prototype.searchKeyframes = function() {
            return this.kf = this.data.d.k.length > 1, this.kf && this.addEffect(this.getKeyframeValue.bind(this)), this.kf;
          }, TextProperty.prototype.addEffect = function(t) {
            this.effectsSequence.push(t), this.elem.addDynamicProperty(this);
          }, TextProperty.prototype.getValue = function(t) {
            if (this.elem.globalData.frameId !== this.frameId && this.effectsSequence.length || t) {
              this.currentData.t = this.data.d.k[this.keysIndex].s.t;
              var e = this.currentData, r = this.keysIndex;
              if (this.lock)
                this.setCurrentData(this.currentData);
              else {
                this.lock = true, this._mdf = false;
                var i2, s = this.effectsSequence.length, a = t || this.data.d.k[this.keysIndex].s;
                for (i2 = 0; i2 < s; i2 += 1)
                  a = r !== this.keysIndex ? this.effectsSequence[i2](a, a.t) : this.effectsSequence[i2](this.currentData, a.t);
                e !== a && this.setCurrentData(a), this.pv = this.v = this.currentData, this.lock = false, this.frameId = this.elem.globalData.frameId;
              }
            }
          }, TextProperty.prototype.getKeyframeValue = function() {
            for (var t = this.data.d.k, e = this.elem.comp.renderedFrame, r = 0, i2 = t.length; r <= i2 - 1 && (t[r].s, !(r === i2 - 1 || t[r + 1].t > e)); )
              r += 1;
            return this.keysIndex !== r && (this.keysIndex = r), this.data.d.k[this.keysIndex].s;
          }, TextProperty.prototype.buildFinalText = function(t) {
            for (var e, r = FontManager.getCombinedCharacterCodes(), i2 = [], s = 0, a = t.length; s < a; )
              e = t.charCodeAt(s), -1 !== r.indexOf(e) ? i2[i2.length - 1] += t.charAt(s) : e >= 55296 && e <= 56319 && (e = t.charCodeAt(s + 1)) >= 56320 && e <= 57343 ? (i2.push(t.substr(s, 2)), ++s) : i2.push(t.charAt(s)), s += 1;
            return i2;
          }, TextProperty.prototype.completeTextData = function(t) {
            t.__complete = true;
            var e, r, i2, s, a, n, o, h = this.elem.globalData.fontManager, l = this.data, p = [], f = 0, m = l.m.g, c = 0, d = 0, u = 0, y = [], g = 0, v = 0, b = h.getFontByName(t.f), P = 0, _ = b.fStyle ? b.fStyle.split(" ") : [], x = "normal", S = "normal";
            for (r = _.length, e = 0; e < r; e += 1)
              switch (_[e].toLowerCase()) {
                case "italic":
                  S = "italic";
                  break;
                case "bold":
                  x = "700";
                  break;
                case "black":
                  x = "900";
                  break;
                case "medium":
                  x = "500";
                  break;
                case "regular":
                case "normal":
                  x = "400";
                  break;
                case "light":
                case "thin":
                  x = "200";
              }
            t.fWeight = b.fWeight || x, t.fStyle = S, t.finalSize = t.s, t.finalText = this.buildFinalText(t.t), r = t.finalText.length, t.finalLineHeight = t.lh;
            var E, T = t.tr / 1e3 * t.finalSize;
            if (t.sz)
              for (var C, A, k = true, D = t.sz[0], M = t.sz[1]; k; ) {
                C = 0, g = 0, r = (A = this.buildFinalText(t.t)).length, T = t.tr / 1e3 * t.finalSize;
                var I = -1;
                for (e = 0; e < r; e += 1)
                  E = A[e].charCodeAt(0), i2 = false, " " === A[e] ? I = e : 13 !== E && 3 !== E || (g = 0, i2 = true, C += t.finalLineHeight || 1.2 * t.finalSize), h.chars ? (o = h.getCharData(A[e], b.fStyle, b.fFamily), P = i2 ? 0 : o.w * t.finalSize / 100) : P = h.measureText(A[e], t.f, t.finalSize), g + P > D && " " !== A[e] ? (-1 === I ? r += 1 : e = I, C += t.finalLineHeight || 1.2 * t.finalSize, A.splice(e, I === e ? 1 : 0, "\r"), I = -1, g = 0) : (g += P, g += T);
                C += b.ascent * t.finalSize / 100, this.canResize && t.finalSize > this.minimumFontSize && M < C ? (t.finalSize -= 1, t.finalLineHeight = t.finalSize * t.lh / t.s) : (t.finalText = A, r = t.finalText.length, k = false);
              }
            g = -T, P = 0;
            var w, F = 0;
            for (e = 0; e < r; e += 1)
              if (i2 = false, E = (w = t.finalText[e]).charCodeAt(0), " " === w ? s = " " : 13 === E || 3 === E ? (F = 0, y.push(g), v = g > v ? g : v, g = -2 * T, s = "", i2 = true, u += 1) : s = t.finalText[e], h.chars ? (o = h.getCharData(w, b.fStyle, h.getFontByName(t.f).fFamily), P = i2 ? 0 : o.w * t.finalSize / 100) : P = h.measureText(s, t.f, t.finalSize), " " === w ? F += P + T : (g += P + T + F, F = 0), p.push({ l: P, an: P, add: c, n: i2, anIndexes: [], val: s, line: u, animatorJustifyOffset: 0 }), 2 == m) {
                if (c += P, "" === s || " " === s || e === r - 1) {
                  for ("" !== s && " " !== s || (c -= P); d <= e; )
                    p[d].an = c, p[d].ind = f, p[d].extra = P, d += 1;
                  f += 1, c = 0;
                }
              } else if (3 == m) {
                if (c += P, "" === s || e === r - 1) {
                  for ("" === s && (c -= P); d <= e; )
                    p[d].an = c, p[d].ind = f, p[d].extra = P, d += 1;
                  c = 0, f += 1;
                }
              } else
                p[f].ind = f, p[f].extra = 0, f += 1;
            if (t.l = p, v = g > v ? g : v, y.push(g), t.sz)
              t.boxWidth = t.sz[0], t.justifyOffset = 0;
            else
              switch (t.boxWidth = v, t.j) {
                case 1:
                  t.justifyOffset = -t.boxWidth;
                  break;
                case 2:
                  t.justifyOffset = -t.boxWidth / 2;
                  break;
                default:
                  t.justifyOffset = 0;
              }
            t.lineWidths = y;
            var R, V, L = l.a;
            n = L.length;
            var O, z, B = [];
            for (a = 0; a < n; a += 1) {
              for ((R = L[a]).a.sc && (t.strokeColorAnim = true), R.a.sw && (t.strokeWidthAnim = true), (R.a.fc || R.a.fh || R.a.fs || R.a.fb) && (t.fillColorAnim = true), z = 0, O = R.s.b, e = 0; e < r; e += 1)
                (V = p[e]).anIndexes[a] = z, (1 == O && "" !== V.val || 2 == O && "" !== V.val && " " !== V.val || 3 == O && (V.n || " " == V.val || e == r - 1) || 4 == O && (V.n || e == r - 1)) && (1 === R.s.rn && B.push(z), z += 1);
              l.a[a].s.totalChars = z;
              var N, G = -1;
              if (1 === R.s.rn)
                for (e = 0; e < r; e += 1)
                  G != (V = p[e]).anIndexes[a] && (G = V.anIndexes[a], N = B.splice(Math.floor(Math.random() * B.length), 1)[0]), V.anIndexes[a] = N;
            }
            t.yOffset = t.finalLineHeight || 1.2 * t.finalSize, t.ls = t.ls || 0, t.ascent = b.ascent * t.finalSize / 100;
          }, TextProperty.prototype.updateDocumentData = function(t, e) {
            e = void 0 === e ? this.keysIndex : e;
            var r = this.copyData({}, this.data.d.k[e].s);
            r = this.copyData(r, t), this.data.d.k[e].s = r, this.recalculate(e), this.elem.addDynamicProperty(this);
          }, TextProperty.prototype.recalculate = function(t) {
            var e = this.data.d.k[t].s;
            e.__complete = false, this.keysIndex = 0, this._isFirstFrame = true, this.getValue(e);
          }, TextProperty.prototype.canResizeFont = function(t) {
            this.canResize = t, this.recalculate(this.keysIndex), this.elem.addDynamicProperty(this);
          }, TextProperty.prototype.setMinimumFontSize = function(t) {
            this.minimumFontSize = Math.floor(t) || 1, this.recalculate(this.keysIndex), this.elem.addDynamicProperty(this);
          };
          var TextSelectorProp = function() {
            var t = Math.max, e = Math.min, r = Math.floor;
            function i2(t2, e2) {
              this._currentTextLength = -1, this.k = false, this.data = e2, this.elem = t2, this.comp = t2.comp, this.finalS = 0, this.finalE = 0, this.initDynamicPropertyContainer(t2), this.s = PropertyFactory.getProp(t2, e2.s || { k: 0 }, 0, 0, this), this.e = "e" in e2 ? PropertyFactory.getProp(t2, e2.e, 0, 0, this) : { v: 100 }, this.o = PropertyFactory.getProp(t2, e2.o || { k: 0 }, 0, 0, this), this.xe = PropertyFactory.getProp(t2, e2.xe || { k: 0 }, 0, 0, this), this.ne = PropertyFactory.getProp(t2, e2.ne || { k: 0 }, 0, 0, this), this.a = PropertyFactory.getProp(t2, e2.a, 0, 0.01, this), this.dynamicProperties.length || this.getValue();
            }
            return i2.prototype = { getMult: function(i3) {
              this._currentTextLength !== this.elem.textProperty.currentData.l.length && this.getValue();
              var s = BezierFactory.getBezierEasing(this.ne.v / 100, 0, 1 - this.xe.v / 100, 1).get, a = 0, n = this.finalS, o = this.finalE, h = this.data.sh;
              if (2 == h)
                a = s(a = o === n ? i3 >= o ? 1 : 0 : t(0, e(0.5 / (o - n) + (i3 - n) / (o - n), 1)));
              else if (3 == h)
                a = s(a = o === n ? i3 >= o ? 0 : 1 : 1 - t(0, e(0.5 / (o - n) + (i3 - n) / (o - n), 1)));
              else if (4 == h)
                o === n ? a = 0 : (a = t(0, e(0.5 / (o - n) + (i3 - n) / (o - n), 1))) < 0.5 ? a *= 2 : a = 1 - 2 * (a - 0.5), a = s(a);
              else if (5 == h) {
                if (o === n)
                  a = 0;
                else {
                  var l = o - n, p = -l / 2 + (i3 = e(t(0, i3 + 0.5 - n), o - n)), f = l / 2;
                  a = Math.sqrt(1 - p * p / (f * f));
                }
                a = s(a);
              } else
                6 == h ? (o === n ? a = 0 : (i3 = e(t(0, i3 + 0.5 - n), o - n), a = (1 + Math.cos(Math.PI + 2 * Math.PI * i3 / (o - n))) / 2), a = s(a)) : (i3 >= r(n) && (a = i3 - n < 0 ? 1 - (n - i3) : t(0, e(o - i3, 1))), a = s(a));
              return a * this.a.v;
            }, getValue: function(t2) {
              this.iterateDynamicProperties(), this._mdf = t2 || this._mdf, this._currentTextLength = this.elem.textProperty.currentData.l.length || 0, t2 && 2 === this.data.r && (this.e.v = this._currentTextLength);
              var e2 = 2 === this.data.r ? 1 : 100 / this.data.totalChars, r2 = this.o.v / e2, i3 = this.s.v / e2 + r2, s = this.e.v / e2 + r2;
              if (i3 > s) {
                var a = i3;
                i3 = s, s = a;
              }
              this.finalS = i3, this.finalE = s;
            } }, extendPrototype([DynamicPropertyContainer], i2), { getTextSelectorProp: function(t2, e2, r2) {
              return new i2(t2, e2, r2);
            } };
          }(), pool_factory = function(t, e, r, i2) {
            var s = 0, a = t, n = createSizedArray(a);
            function o() {
              return s ? n[s -= 1] : e();
            }
            return { newElement: o, release: function(t2) {
              s === a && (n = pooling.double(n), a *= 2), r && r(t2), n[s] = t2, s += 1;
            } };
          }, pooling = { double: function(t) {
            return t.concat(createSizedArray(t.length));
          } }, point_pool = pool_factory(8, function() {
            return createTypedArray("float32", 2);
          }), shape_pool = (factory = pool_factory(4, function() {
            return new ShapePath();
          }, function(t) {
            var e, r = t._length;
            for (e = 0; e < r; e += 1)
              point_pool.release(t.v[e]), point_pool.release(t.i[e]), point_pool.release(t.o[e]), t.v[e] = null, t.i[e] = null, t.o[e] = null;
            t._length = 0, t.c = false;
          }), factory.clone = function(t) {
            var e, r = factory.newElement(), i2 = void 0 === t._length ? t.v.length : t._length;
            for (r.setLength(i2), r.c = t.c, e = 0; e < i2; e += 1)
              r.setTripleAt(t.v[e][0], t.v[e][1], t.o[e][0], t.o[e][1], t.i[e][0], t.i[e][1], e);
            return r;
          }, factory), factory, shapeCollection_pool = function() {
            var t = { newShapeCollection: function() {
              var t2;
              t2 = e ? i2[e -= 1] : new ShapeCollection();
              return t2;
            }, release: function(t2) {
              var s, a = t2._length;
              for (s = 0; s < a; s += 1)
                shape_pool.release(t2.shapes[s]);
              t2._length = 0, e === r && (i2 = pooling.double(i2), r *= 2);
              i2[e] = t2, e += 1;
            } }, e = 0, r = 4, i2 = createSizedArray(r);
            return t;
          }(), segments_length_pool = pool_factory(8, function() {
            return { lengths: [], totalLength: 0 };
          }, function(t) {
            var e, r = t.lengths.length;
            for (e = 0; e < r; e += 1)
              bezier_length_pool.release(t.lengths[e]);
            t.lengths.length = 0;
          }), bezier_length_pool = pool_factory(8, function() {
            return { addedLength: 0, percents: createTypedArray("float32", defaultCurveSegments), lengths: createTypedArray("float32", defaultCurveSegments) };
          });
          function BaseRenderer() {
          }
          function SVGRenderer(t, e) {
            this.animationItem = t, this.layers = null, this.renderedFrame = -1, this.svgElement = createNS("svg");
            var r = "";
            if (e && e.title) {
              var i2 = createNS("title"), s = createElementID();
              i2.setAttribute("id", s), i2.textContent = e.title, this.svgElement.appendChild(i2), r += s;
            }
            if (e && e.description) {
              var a = createNS("desc"), n = createElementID();
              a.setAttribute("id", n), a.textContent = e.description, this.svgElement.appendChild(a), r += " " + n;
            }
            r && this.svgElement.setAttribute("aria-labelledby", r);
            var o = createNS("defs");
            this.svgElement.appendChild(o);
            var h = createNS("g");
            this.svgElement.appendChild(h), this.layerElement = h, this.renderConfig = { preserveAspectRatio: e && e.preserveAspectRatio || "xMidYMid meet", imagePreserveAspectRatio: e && e.imagePreserveAspectRatio || "xMidYMid slice", progressiveLoad: e && e.progressiveLoad || false, hideOnTransparent: !e || false !== e.hideOnTransparent, viewBoxOnly: e && e.viewBoxOnly || false, viewBoxSize: e && e.viewBoxSize || false, className: e && e.className || "" }, this.globalData = { _mdf: false, frameNum: -1, defs: o, renderConfig: this.renderConfig }, this.elements = [], this.pendingElements = [], this.destroyed = false, this.rendererType = "svg";
          }
          function CanvasRenderer(t, e) {
            this.animationItem = t, this.renderConfig = { clearCanvas: !e || void 0 === e.clearCanvas || e.clearCanvas, context: e && e.context || null, progressiveLoad: e && e.progressiveLoad || false, preserveAspectRatio: e && e.preserveAspectRatio || "xMidYMid meet", imagePreserveAspectRatio: e && e.imagePreserveAspectRatio || "xMidYMid slice", className: e && e.className || "" }, this.renderConfig.dpr = e && e.dpr || 1, this.animationItem.wrapper && (this.renderConfig.dpr = e && e.dpr || window.devicePixelRatio || 1), this.renderedFrame = -1, this.globalData = { frameNum: -1, _mdf: false, renderConfig: this.renderConfig, currentGlobalAlpha: -1 }, this.contextData = new CVContextData(), this.elements = [], this.pendingElements = [], this.transformMat = new Matrix(), this.completeLayers = false, this.rendererType = "canvas";
          }
          function MaskElement(t, e, r) {
            this.data = t, this.element = e, this.globalData = r, this.storedData = [], this.masksProperties = this.data.masksProperties || [], this.maskElement = null;
            var i2, s = this.globalData.defs, a = this.masksProperties ? this.masksProperties.length : 0;
            this.viewData = createSizedArray(a), this.solidPath = "";
            var n, o, h, l, p, f, m, c = this.masksProperties, d = 0, u = [], y = createElementID(), g = "clipPath", v = "clip-path";
            for (i2 = 0; i2 < a; i2++)
              if (("a" !== c[i2].mode && "n" !== c[i2].mode || c[i2].inv || 100 !== c[i2].o.k || c[i2].o.x) && (g = "mask", v = "mask"), "s" != c[i2].mode && "i" != c[i2].mode || 0 !== d ? l = null : ((l = createNS("rect")).setAttribute("fill", "#ffffff"), l.setAttribute("width", this.element.comp.data.w || 0), l.setAttribute("height", this.element.comp.data.h || 0), u.push(l)), n = createNS("path"), "n" != c[i2].mode) {
                var b;
                if (d += 1, n.setAttribute("fill", "s" === c[i2].mode ? "#000000" : "#ffffff"), n.setAttribute("clip-rule", "nonzero"), 0 !== c[i2].x.k ? (g = "mask", v = "mask", m = PropertyFactory.getProp(this.element, c[i2].x, 0, null, this.element), b = createElementID(), (p = createNS("filter")).setAttribute("id", b), (f = createNS("feMorphology")).setAttribute("operator", "erode"), f.setAttribute("in", "SourceGraphic"), f.setAttribute("radius", "0"), p.appendChild(f), s.appendChild(p), n.setAttribute("stroke", "s" === c[i2].mode ? "#000000" : "#ffffff")) : (f = null, m = null), this.storedData[i2] = { elem: n, x: m, expan: f, lastPath: "", lastOperator: "", filterId: b, lastRadius: 0 }, "i" == c[i2].mode) {
                  h = u.length;
                  var P = createNS("g");
                  for (o = 0; o < h; o += 1)
                    P.appendChild(u[o]);
                  var _ = createNS("mask");
                  _.setAttribute("mask-type", "alpha"), _.setAttribute("id", y + "_" + d), _.appendChild(n), s.appendChild(_), P.setAttribute("mask", "url(" + locationHref + "#" + y + "_" + d + ")"), u.length = 0, u.push(P);
                } else
                  u.push(n);
                c[i2].inv && !this.solidPath && (this.solidPath = this.createLayerSolidPath()), this.viewData[i2] = { elem: n, lastPath: "", op: PropertyFactory.getProp(this.element, c[i2].o, 0, 0.01, this.element), prop: ShapePropertyFactory.getShapeProp(this.element, c[i2], 3), invRect: l }, this.viewData[i2].prop.k || this.drawPath(c[i2], this.viewData[i2].prop.v, this.viewData[i2]);
              } else
                this.viewData[i2] = { op: PropertyFactory.getProp(this.element, c[i2].o, 0, 0.01, this.element), prop: ShapePropertyFactory.getShapeProp(this.element, c[i2], 3), elem: n, lastPath: "" }, s.appendChild(n);
            for (this.maskElement = createNS(g), a = u.length, i2 = 0; i2 < a; i2 += 1)
              this.maskElement.appendChild(u[i2]);
            d > 0 && (this.maskElement.setAttribute("id", y), this.element.maskedElement.setAttribute(v, "url(" + locationHref + "#" + y + ")"), s.appendChild(this.maskElement)), this.viewData.length && this.element.addRenderableComponent(this);
          }
          function HierarchyElement() {
          }
          function FrameElement() {
          }
          function TransformElement() {
          }
          function RenderableElement() {
          }
          function RenderableDOMElement() {
          }
          function ProcessedElement(t, e) {
            this.elem = t, this.pos = e;
          }
          function SVGShapeData(t, e, r) {
            this.caches = [], this.styles = [], this.transformers = t, this.lStr = "", this.sh = r, this.lvl = e, this._isAnimated = !!r.k;
            for (var i2 = 0, s = t.length; i2 < s; ) {
              if (t[i2].mProps.dynamicProperties.length) {
                this._isAnimated = true;
                break;
              }
              i2 += 1;
            }
          }
          function ShapeGroupData() {
            this.it = [], this.prevViewData = [], this.gr = createNS("g");
          }
          function ShapeTransformManager() {
            this.sequences = {}, this.sequenceList = [], this.transform_key_count = 0;
          }
          function CVShapeData(t, e, r, i2) {
            this.styledShapes = [], this.tr = [0, 0, 0, 0, 0, 0];
            var s = 4;
            "rc" == e.ty ? s = 5 : "el" == e.ty ? s = 6 : "sr" == e.ty && (s = 7), this.sh = ShapePropertyFactory.getShapeProp(t, e, s, t);
            var a, n, o = r.length;
            for (a = 0; a < o; a += 1)
              r[a].closed || (n = { transforms: i2.addTransformSequence(r[a].transforms), trNodes: [] }, this.styledShapes.push(n), r[a].elements.push(n));
          }
          function BaseElement() {
          }
          function NullElement(t, e, r) {
            this.initFrame(), this.initBaseData(t, e, r), this.initFrame(), this.initTransform(t, e, r), this.initHierarchy();
          }
          function SVGBaseElement() {
          }
          function IShapeElement() {
          }
          function ITextElement() {
          }
          function ICompElement() {
          }
          function IImageElement(t, e, r) {
            this.assetData = e.getAssetData(t.refId), this.initElement(t, e, r), this.sourceRect = { top: 0, left: 0, width: this.assetData.w, height: this.assetData.h };
          }
          function ISolidElement(t, e, r) {
            this.initElement(t, e, r);
          }
          function SVGShapeElement(t, e, r) {
            this.shapes = [], this.shapesData = t.shapes, this.stylesList = [], this.shapeModifiers = [], this.itemsData = [], this.processedElements = [], this.animatedContents = [], this.initElement(t, e, r), this.prevViewData = [];
          }
          function CVContextData() {
            this.saved = [], this.cArrPos = 0, this.cTr = new Matrix(), this.cO = 1;
            var t;
            for (this.savedOp = createTypedArray("float32", 15), t = 0; t < 15; t += 1)
              this.saved[t] = createTypedArray("float32", 16);
            this._length = 15;
          }
          function CVBaseElement() {
          }
          function CVImageElement(t, e, r) {
            this.assetData = e.getAssetData(t.refId), this.img = e.imageLoader.getImage(this.assetData), this.initElement(t, e, r);
          }
          function CVCompElement(t, e, r) {
            this.completeLayers = false, this.layers = t.layers, this.pendingElements = [], this.elements = createSizedArray(this.layers.length), this.initElement(t, e, r), this.tm = t.tm ? PropertyFactory.getProp(this, t.tm, 0, e.frameRate, this) : { _placeholder: true };
          }
          function CVMaskElement(t, e) {
            this.data = t, this.element = e, this.masksProperties = this.data.masksProperties || [], this.viewData = createSizedArray(this.masksProperties.length);
            var r, i2 = this.masksProperties.length, s = false;
            for (r = 0; r < i2; r++)
              "n" !== this.masksProperties[r].mode && (s = true), this.viewData[r] = ShapePropertyFactory.getShapeProp(this.element, this.masksProperties[r], 3);
            this.hasMasks = s, s && this.element.addRenderableComponent(this);
          }
          function CVShapeElement(t, e, r) {
            this.shapes = [], this.shapesData = t.shapes, this.stylesList = [], this.itemsData = [], this.prevViewData = [], this.shapeModifiers = [], this.processedElements = [], this.transformsManager = new ShapeTransformManager(), this.initElement(t, e, r);
          }
          function CVSolidElement(t, e, r) {
            this.initElement(t, e, r);
          }
          function CVTextElement(t, e, r) {
            this.textSpans = [], this.yOffset = 0, this.fillColorAnim = false, this.strokeColorAnim = false, this.strokeWidthAnim = false, this.stroke = false, this.fill = false, this.justifyOffset = 0, this.currentRender = null, this.renderType = "canvas", this.values = { fill: "rgba(0,0,0,0)", stroke: "rgba(0,0,0,0)", sWidth: 0, fValue: "" }, this.initElement(t, e, r);
          }
          function CVEffects() {
          }
          BaseRenderer.prototype.checkLayers = function(t) {
            var e, r, i2 = this.layers.length;
            for (this.completeLayers = true, e = i2 - 1; e >= 0; e--)
              this.elements[e] || (r = this.layers[e]).ip - r.st <= t - this.layers[e].st && r.op - r.st > t - this.layers[e].st && this.buildItem(e), this.completeLayers = !!this.elements[e] && this.completeLayers;
            this.checkPendingElements();
          }, BaseRenderer.prototype.createItem = function(t) {
            switch (t.ty) {
              case 2:
                return this.createImage(t);
              case 0:
                return this.createComp(t);
              case 1:
                return this.createSolid(t);
              case 3:
                return this.createNull(t);
              case 4:
                return this.createShape(t);
              case 5:
                return this.createText(t);
              case 13:
                return this.createCamera(t);
            }
            return this.createNull(t);
          }, BaseRenderer.prototype.createCamera = function() {
            throw new Error("You're using a 3d camera. Try the html renderer.");
          }, BaseRenderer.prototype.buildAllItems = function() {
            var t, e = this.layers.length;
            for (t = 0; t < e; t += 1)
              this.buildItem(t);
            this.checkPendingElements();
          }, BaseRenderer.prototype.includeLayers = function(t) {
            this.completeLayers = false;
            var e, r, i2 = t.length, s = this.layers.length;
            for (e = 0; e < i2; e += 1)
              for (r = 0; r < s; ) {
                if (this.layers[r].id == t[e].id) {
                  this.layers[r] = t[e];
                  break;
                }
                r += 1;
              }
          }, BaseRenderer.prototype.setProjectInterface = function(t) {
            this.globalData.projectInterface = t;
          }, BaseRenderer.prototype.initItems = function() {
            this.globalData.progressiveLoad || this.buildAllItems();
          }, BaseRenderer.prototype.buildElementParenting = function(t, e, r) {
            for (var i2 = this.elements, s = this.layers, a = 0, n = s.length; a < n; )
              s[a].ind == e && (i2[a] && true !== i2[a] ? (r.push(i2[a]), i2[a].setAsParent(), void 0 !== s[a].parent ? this.buildElementParenting(t, s[a].parent, r) : t.setHierarchy(r)) : (this.buildItem(a), this.addPendingElement(t))), a += 1;
          }, BaseRenderer.prototype.addPendingElement = function(t) {
            this.pendingElements.push(t);
          }, BaseRenderer.prototype.searchExtraCompositions = function(t) {
            var e, r = t.length;
            for (e = 0; e < r; e += 1)
              if (t[e].xt) {
                var i2 = this.createComp(t[e]);
                i2.initExpressions(), this.globalData.projectInterface.registerComposition(i2);
              }
          }, BaseRenderer.prototype.setupGlobalData = function(t, e) {
            this.globalData.fontManager = new FontManager(), this.globalData.fontManager.addChars(t.chars), this.globalData.fontManager.addFonts(t.fonts, e), this.globalData.getAssetData = this.animationItem.getAssetData.bind(this.animationItem), this.globalData.getAssetsPath = this.animationItem.getAssetsPath.bind(this.animationItem), this.globalData.imageLoader = this.animationItem.imagePreloader, this.globalData.frameId = 0, this.globalData.frameRate = t.fr, this.globalData.nm = t.nm, this.globalData.compSize = { w: t.w, h: t.h };
          }, extendPrototype([BaseRenderer], SVGRenderer), SVGRenderer.prototype.createNull = function(t) {
            return new NullElement(t, this.globalData, this);
          }, SVGRenderer.prototype.createShape = function(t) {
            return new SVGShapeElement(t, this.globalData, this);
          }, SVGRenderer.prototype.createText = function(t) {
            return new SVGTextElement(t, this.globalData, this);
          }, SVGRenderer.prototype.createImage = function(t) {
            return new IImageElement(t, this.globalData, this);
          }, SVGRenderer.prototype.createComp = function(t) {
            return new SVGCompElement(t, this.globalData, this);
          }, SVGRenderer.prototype.createSolid = function(t) {
            return new ISolidElement(t, this.globalData, this);
          }, SVGRenderer.prototype.configAnimation = function(t) {
            this.svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg"), this.renderConfig.viewBoxSize ? this.svgElement.setAttribute("viewBox", this.renderConfig.viewBoxSize) : this.svgElement.setAttribute("viewBox", "0 0 " + t.w + " " + t.h), this.renderConfig.viewBoxOnly || (this.svgElement.setAttribute("width", t.w), this.svgElement.setAttribute("height", t.h), this.svgElement.style.width = "100%", this.svgElement.style.height = "100%", this.svgElement.style.transform = "translate3d(0,0,0)"), this.renderConfig.className && this.svgElement.setAttribute("class", this.renderConfig.className), this.svgElement.setAttribute("preserveAspectRatio", this.renderConfig.preserveAspectRatio), this.animationItem.wrapper.appendChild(this.svgElement);
            var e = this.globalData.defs;
            this.setupGlobalData(t, e), this.globalData.progressiveLoad = this.renderConfig.progressiveLoad, this.data = t;
            var r = createNS("clipPath"), i2 = createNS("rect");
            i2.setAttribute("width", t.w), i2.setAttribute("height", t.h), i2.setAttribute("x", 0), i2.setAttribute("y", 0);
            var s = createElementID();
            r.setAttribute("id", s), r.appendChild(i2), this.layerElement.setAttribute("clip-path", "url(" + locationHref + "#" + s + ")"), e.appendChild(r), this.layers = t.layers, this.elements = createSizedArray(t.layers.length);
          }, SVGRenderer.prototype.destroy = function() {
            this.animationItem.wrapper.innerHTML = "", this.layerElement = null, this.globalData.defs = null;
            var t, e = this.layers ? this.layers.length : 0;
            for (t = 0; t < e; t++)
              this.elements[t] && this.elements[t].destroy();
            this.elements.length = 0, this.destroyed = true, this.animationItem = null;
          }, SVGRenderer.prototype.updateContainerSize = function() {
          }, SVGRenderer.prototype.buildItem = function(t) {
            var e = this.elements;
            if (!e[t] && 99 != this.layers[t].ty) {
              e[t] = true;
              var r = this.createItem(this.layers[t]);
              e[t] = r, expressionsPlugin && (0 === this.layers[t].ty && this.globalData.projectInterface.registerComposition(r), r.initExpressions()), this.appendElementInPos(r, t), this.layers[t].tt && (this.elements[t - 1] && true !== this.elements[t - 1] ? r.setMatte(e[t - 1].layerId) : (this.buildItem(t - 1), this.addPendingElement(r)));
            }
          }, SVGRenderer.prototype.checkPendingElements = function() {
            for (; this.pendingElements.length; ) {
              var t = this.pendingElements.pop();
              if (t.checkParenting(), t.data.tt)
                for (var e = 0, r = this.elements.length; e < r; ) {
                  if (this.elements[e] === t) {
                    t.setMatte(this.elements[e - 1].layerId);
                    break;
                  }
                  e += 1;
                }
            }
          }, SVGRenderer.prototype.renderFrame = function(t) {
            if (this.renderedFrame !== t && !this.destroyed) {
              null === t ? t = this.renderedFrame : this.renderedFrame = t, this.globalData.frameNum = t, this.globalData.frameId += 1, this.globalData.projectInterface.currentFrame = t, this.globalData._mdf = false;
              var e, r = this.layers.length;
              for (this.completeLayers || this.checkLayers(t), e = r - 1; e >= 0; e--)
                (this.completeLayers || this.elements[e]) && this.elements[e].prepareFrame(t - this.layers[e].st);
              if (this.globalData._mdf)
                for (e = 0; e < r; e += 1)
                  (this.completeLayers || this.elements[e]) && this.elements[e].renderFrame();
            }
          }, SVGRenderer.prototype.appendElementInPos = function(t, e) {
            var r = t.getBaseElement();
            if (r) {
              for (var i2, s = 0; s < e; )
                this.elements[s] && true !== this.elements[s] && this.elements[s].getBaseElement() && (i2 = this.elements[s].getBaseElement()), s += 1;
              i2 ? this.layerElement.insertBefore(r, i2) : this.layerElement.appendChild(r);
            }
          }, SVGRenderer.prototype.hide = function() {
            this.layerElement.style.display = "none";
          }, SVGRenderer.prototype.show = function() {
            this.layerElement.style.display = "block";
          }, extendPrototype([BaseRenderer], CanvasRenderer), CanvasRenderer.prototype.createShape = function(t) {
            return new CVShapeElement(t, this.globalData, this);
          }, CanvasRenderer.prototype.createText = function(t) {
            return new CVTextElement(t, this.globalData, this);
          }, CanvasRenderer.prototype.createImage = function(t) {
            return new CVImageElement(t, this.globalData, this);
          }, CanvasRenderer.prototype.createComp = function(t) {
            return new CVCompElement(t, this.globalData, this);
          }, CanvasRenderer.prototype.createSolid = function(t) {
            return new CVSolidElement(t, this.globalData, this);
          }, CanvasRenderer.prototype.createNull = SVGRenderer.prototype.createNull, CanvasRenderer.prototype.ctxTransform = function(t) {
            if (1 !== t[0] || 0 !== t[1] || 0 !== t[4] || 1 !== t[5] || 0 !== t[12] || 0 !== t[13])
              if (this.renderConfig.clearCanvas) {
                this.transformMat.cloneFromProps(t);
                var e = this.contextData.cTr.props;
                this.transformMat.transform(e[0], e[1], e[2], e[3], e[4], e[5], e[6], e[7], e[8], e[9], e[10], e[11], e[12], e[13], e[14], e[15]), this.contextData.cTr.cloneFromProps(this.transformMat.props);
                var r = this.contextData.cTr.props;
                this.canvasContext.setTransform(r[0], r[1], r[4], r[5], r[12], r[13]);
              } else
                this.canvasContext.transform(t[0], t[1], t[4], t[5], t[12], t[13]);
          }, CanvasRenderer.prototype.ctxOpacity = function(t) {
            if (!this.renderConfig.clearCanvas)
              return this.canvasContext.globalAlpha *= t < 0 ? 0 : t, void (this.globalData.currentGlobalAlpha = this.contextData.cO);
            this.contextData.cO *= t < 0 ? 0 : t, this.globalData.currentGlobalAlpha !== this.contextData.cO && (this.canvasContext.globalAlpha = this.contextData.cO, this.globalData.currentGlobalAlpha = this.contextData.cO);
          }, CanvasRenderer.prototype.reset = function() {
            this.renderConfig.clearCanvas ? this.contextData.reset() : this.canvasContext.restore();
          }, CanvasRenderer.prototype.save = function(t) {
            if (this.renderConfig.clearCanvas) {
              t && this.canvasContext.save();
              var e = this.contextData.cTr.props;
              this.contextData._length <= this.contextData.cArrPos && this.contextData.duplicate();
              var r, i2 = this.contextData.saved[this.contextData.cArrPos];
              for (r = 0; r < 16; r += 1)
                i2[r] = e[r];
              this.contextData.savedOp[this.contextData.cArrPos] = this.contextData.cO, this.contextData.cArrPos += 1;
            } else
              this.canvasContext.save();
          }, CanvasRenderer.prototype.restore = function(t) {
            if (this.renderConfig.clearCanvas) {
              t && (this.canvasContext.restore(), this.globalData.blendMode = "source-over"), this.contextData.cArrPos -= 1;
              var e, r = this.contextData.saved[this.contextData.cArrPos], i2 = this.contextData.cTr.props;
              for (e = 0; e < 16; e += 1)
                i2[e] = r[e];
              this.canvasContext.setTransform(r[0], r[1], r[4], r[5], r[12], r[13]), r = this.contextData.savedOp[this.contextData.cArrPos], this.contextData.cO = r, this.globalData.currentGlobalAlpha !== r && (this.canvasContext.globalAlpha = r, this.globalData.currentGlobalAlpha = r);
            } else
              this.canvasContext.restore();
          }, CanvasRenderer.prototype.configAnimation = function(t) {
            this.animationItem.wrapper ? (this.animationItem.container = createTag("canvas"), this.animationItem.container.style.width = "100%", this.animationItem.container.style.height = "100%", this.animationItem.container.style.transformOrigin = this.animationItem.container.style.mozTransformOrigin = this.animationItem.container.style.webkitTransformOrigin = this.animationItem.container.style["-webkit-transform"] = "0px 0px 0px", this.animationItem.wrapper.appendChild(this.animationItem.container), this.canvasContext = this.animationItem.container.getContext("2d"), this.renderConfig.className && this.animationItem.container.setAttribute("class", this.renderConfig.className)) : this.canvasContext = this.renderConfig.context, this.data = t, this.layers = t.layers, this.transformCanvas = { w: t.w, h: t.h, sx: 0, sy: 0, tx: 0, ty: 0 }, this.setupGlobalData(t, document.body), this.globalData.canvasContext = this.canvasContext, this.globalData.renderer = this, this.globalData.isDashed = false, this.globalData.progressiveLoad = this.renderConfig.progressiveLoad, this.globalData.transformCanvas = this.transformCanvas, this.elements = createSizedArray(t.layers.length), this.updateContainerSize();
          }, CanvasRenderer.prototype.updateContainerSize = function() {
            var t, e, r, i2;
            if (this.reset(), this.animationItem.wrapper && this.animationItem.container ? (t = this.animationItem.wrapper.offsetWidth, e = this.animationItem.wrapper.offsetHeight, this.animationItem.container.setAttribute("width", t * this.renderConfig.dpr), this.animationItem.container.setAttribute("height", e * this.renderConfig.dpr)) : (t = this.canvasContext.canvas.width * this.renderConfig.dpr, e = this.canvasContext.canvas.height * this.renderConfig.dpr), -1 !== this.renderConfig.preserveAspectRatio.indexOf("meet") || -1 !== this.renderConfig.preserveAspectRatio.indexOf("slice")) {
              var s = this.renderConfig.preserveAspectRatio.split(" "), a = s[1] || "meet", n = s[0] || "xMidYMid", o = n.substr(0, 4), h = n.substr(4);
              r = t / e, (i2 = this.transformCanvas.w / this.transformCanvas.h) > r && "meet" === a || i2 < r && "slice" === a ? (this.transformCanvas.sx = t / (this.transformCanvas.w / this.renderConfig.dpr), this.transformCanvas.sy = t / (this.transformCanvas.w / this.renderConfig.dpr)) : (this.transformCanvas.sx = e / (this.transformCanvas.h / this.renderConfig.dpr), this.transformCanvas.sy = e / (this.transformCanvas.h / this.renderConfig.dpr)), this.transformCanvas.tx = "xMid" === o && (i2 < r && "meet" === a || i2 > r && "slice" === a) ? (t - this.transformCanvas.w * (e / this.transformCanvas.h)) / 2 * this.renderConfig.dpr : "xMax" === o && (i2 < r && "meet" === a || i2 > r && "slice" === a) ? (t - this.transformCanvas.w * (e / this.transformCanvas.h)) * this.renderConfig.dpr : 0, this.transformCanvas.ty = "YMid" === h && (i2 > r && "meet" === a || i2 < r && "slice" === a) ? (e - this.transformCanvas.h * (t / this.transformCanvas.w)) / 2 * this.renderConfig.dpr : "YMax" === h && (i2 > r && "meet" === a || i2 < r && "slice" === a) ? (e - this.transformCanvas.h * (t / this.transformCanvas.w)) * this.renderConfig.dpr : 0;
            } else
              "none" == this.renderConfig.preserveAspectRatio ? (this.transformCanvas.sx = t / (this.transformCanvas.w / this.renderConfig.dpr), this.transformCanvas.sy = e / (this.transformCanvas.h / this.renderConfig.dpr), this.transformCanvas.tx = 0, this.transformCanvas.ty = 0) : (this.transformCanvas.sx = this.renderConfig.dpr, this.transformCanvas.sy = this.renderConfig.dpr, this.transformCanvas.tx = 0, this.transformCanvas.ty = 0);
            this.transformCanvas.props = [this.transformCanvas.sx, 0, 0, 0, 0, this.transformCanvas.sy, 0, 0, 0, 0, 1, 0, this.transformCanvas.tx, this.transformCanvas.ty, 0, 1], this.ctxTransform(this.transformCanvas.props), this.canvasContext.beginPath(), this.canvasContext.rect(0, 0, this.transformCanvas.w, this.transformCanvas.h), this.canvasContext.closePath(), this.canvasContext.clip(), this.renderFrame(this.renderedFrame, true);
          }, CanvasRenderer.prototype.destroy = function() {
            var t;
            for (this.renderConfig.clearCanvas && (this.animationItem.wrapper.innerHTML = ""), t = (this.layers ? this.layers.length : 0) - 1; t >= 0; t -= 1)
              this.elements[t] && this.elements[t].destroy();
            this.elements.length = 0, this.globalData.canvasContext = null, this.animationItem.container = null, this.destroyed = true;
          }, CanvasRenderer.prototype.renderFrame = function(t, e) {
            if ((this.renderedFrame !== t || true !== this.renderConfig.clearCanvas || e) && !this.destroyed && -1 !== t) {
              this.renderedFrame = t, this.globalData.frameNum = t - this.animationItem._isFirstFrame, this.globalData.frameId += 1, this.globalData._mdf = !this.renderConfig.clearCanvas || e, this.globalData.projectInterface.currentFrame = t;
              var r, i2 = this.layers.length;
              for (this.completeLayers || this.checkLayers(t), r = 0; r < i2; r++)
                (this.completeLayers || this.elements[r]) && this.elements[r].prepareFrame(t - this.layers[r].st);
              if (this.globalData._mdf) {
                for (true === this.renderConfig.clearCanvas ? this.canvasContext.clearRect(0, 0, this.transformCanvas.w, this.transformCanvas.h) : this.save(), r = i2 - 1; r >= 0; r -= 1)
                  (this.completeLayers || this.elements[r]) && this.elements[r].renderFrame();
                true !== this.renderConfig.clearCanvas && this.restore();
              }
            }
          }, CanvasRenderer.prototype.buildItem = function(t) {
            var e = this.elements;
            if (!e[t] && 99 != this.layers[t].ty) {
              var r = this.createItem(this.layers[t], this, this.globalData);
              e[t] = r, r.initExpressions();
            }
          }, CanvasRenderer.prototype.checkPendingElements = function() {
            for (; this.pendingElements.length; ) {
              this.pendingElements.pop().checkParenting();
            }
          }, CanvasRenderer.prototype.hide = function() {
            this.animationItem.container.style.display = "none";
          }, CanvasRenderer.prototype.show = function() {
            this.animationItem.container.style.display = "block";
          }, MaskElement.prototype.getMaskProperty = function(t) {
            return this.viewData[t].prop;
          }, MaskElement.prototype.renderFrame = function(t) {
            var e, r = this.element.finalTransform.mat, i2 = this.masksProperties.length;
            for (e = 0; e < i2; e++)
              if ((this.viewData[e].prop._mdf || t) && this.drawPath(this.masksProperties[e], this.viewData[e].prop.v, this.viewData[e]), (this.viewData[e].op._mdf || t) && this.viewData[e].elem.setAttribute("fill-opacity", this.viewData[e].op.v), "n" !== this.masksProperties[e].mode && (this.viewData[e].invRect && (this.element.finalTransform.mProp._mdf || t) && (this.viewData[e].invRect.setAttribute("x", -r.props[12]), this.viewData[e].invRect.setAttribute("y", -r.props[13])), this.storedData[e].x && (this.storedData[e].x._mdf || t))) {
                var s = this.storedData[e].expan;
                this.storedData[e].x.v < 0 ? ("erode" !== this.storedData[e].lastOperator && (this.storedData[e].lastOperator = "erode", this.storedData[e].elem.setAttribute("filter", "url(" + locationHref + "#" + this.storedData[e].filterId + ")")), s.setAttribute("radius", -this.storedData[e].x.v)) : ("dilate" !== this.storedData[e].lastOperator && (this.storedData[e].lastOperator = "dilate", this.storedData[e].elem.setAttribute("filter", null)), this.storedData[e].elem.setAttribute("stroke-width", 2 * this.storedData[e].x.v));
              }
          }, MaskElement.prototype.getMaskelement = function() {
            return this.maskElement;
          }, MaskElement.prototype.createLayerSolidPath = function() {
            var t = "M0,0 ";
            return t += " h" + this.globalData.compSize.w, t += " v" + this.globalData.compSize.h, t += " h-" + this.globalData.compSize.w, t += " v-" + this.globalData.compSize.h + " ";
          }, MaskElement.prototype.drawPath = function(t, e, r) {
            var i2, s, a = " M" + e.v[0][0] + "," + e.v[0][1];
            for (s = e._length, i2 = 1; i2 < s; i2 += 1)
              a += " C" + e.o[i2 - 1][0] + "," + e.o[i2 - 1][1] + " " + e.i[i2][0] + "," + e.i[i2][1] + " " + e.v[i2][0] + "," + e.v[i2][1];
            if (e.c && s > 1 && (a += " C" + e.o[i2 - 1][0] + "," + e.o[i2 - 1][1] + " " + e.i[0][0] + "," + e.i[0][1] + " " + e.v[0][0] + "," + e.v[0][1]), r.lastPath !== a) {
              var n = "";
              r.elem && (e.c && (n = t.inv ? this.solidPath + a : a), r.elem.setAttribute("d", n)), r.lastPath = a;
            }
          }, MaskElement.prototype.destroy = function() {
            this.element = null, this.globalData = null, this.maskElement = null, this.data = null, this.masksProperties = null;
          }, HierarchyElement.prototype = { initHierarchy: function() {
            this.hierarchy = [], this._isParent = false, this.checkParenting();
          }, setHierarchy: function(t) {
            this.hierarchy = t;
          }, setAsParent: function() {
            this._isParent = true;
          }, checkParenting: function() {
            void 0 !== this.data.parent && this.comp.buildElementParenting(this, this.data.parent, []);
          } }, FrameElement.prototype = { initFrame: function() {
            this._isFirstFrame = false, this.dynamicProperties = [], this._mdf = false;
          }, prepareProperties: function(t, e) {
            var r, i2 = this.dynamicProperties.length;
            for (r = 0; r < i2; r += 1)
              (e || this._isParent && "transform" === this.dynamicProperties[r].propType) && (this.dynamicProperties[r].getValue(), this.dynamicProperties[r]._mdf && (this.globalData._mdf = true, this._mdf = true));
          }, addDynamicProperty: function(t) {
            -1 === this.dynamicProperties.indexOf(t) && this.dynamicProperties.push(t);
          } }, TransformElement.prototype = { initTransform: function() {
            this.finalTransform = { mProp: this.data.ks ? TransformPropertyFactory.getTransformProperty(this, this.data.ks, this) : { o: 0 }, _matMdf: false, _opMdf: false, mat: new Matrix() }, this.data.ao && (this.finalTransform.mProp.autoOriented = true), this.data.ty;
          }, renderTransform: function() {
            if (this.finalTransform._opMdf = this.finalTransform.mProp.o._mdf || this._isFirstFrame, this.finalTransform._matMdf = this.finalTransform.mProp._mdf || this._isFirstFrame, this.hierarchy) {
              var t, e = this.finalTransform.mat, r = 0, i2 = this.hierarchy.length;
              if (!this.finalTransform._matMdf)
                for (; r < i2; ) {
                  if (this.hierarchy[r].finalTransform.mProp._mdf) {
                    this.finalTransform._matMdf = true;
                    break;
                  }
                  r += 1;
                }
              if (this.finalTransform._matMdf)
                for (t = this.finalTransform.mProp.v.props, e.cloneFromProps(t), r = 0; r < i2; r += 1)
                  t = this.hierarchy[r].finalTransform.mProp.v.props, e.transform(t[0], t[1], t[2], t[3], t[4], t[5], t[6], t[7], t[8], t[9], t[10], t[11], t[12], t[13], t[14], t[15]);
            }
          }, globalToLocal: function(t) {
            var e = [];
            e.push(this.finalTransform);
            for (var r = true, i2 = this.comp; r; )
              i2.finalTransform ? (i2.data.hasMask && e.splice(0, 0, i2.finalTransform), i2 = i2.comp) : r = false;
            var s, a, n = e.length;
            for (s = 0; s < n; s += 1)
              a = e[s].mat.applyToPointArray(0, 0, 0), t = [t[0] - a[0], t[1] - a[1], 0];
            return t;
          }, mHelper: new Matrix() }, RenderableElement.prototype = { initRenderable: function() {
            this.isInRange = false, this.hidden = false, this.isTransparent = false, this.renderableComponents = [];
          }, addRenderableComponent: function(t) {
            -1 === this.renderableComponents.indexOf(t) && this.renderableComponents.push(t);
          }, removeRenderableComponent: function(t) {
            -1 !== this.renderableComponents.indexOf(t) && this.renderableComponents.splice(this.renderableComponents.indexOf(t), 1);
          }, prepareRenderableFrame: function(t) {
            this.checkLayerLimits(t);
          }, checkTransparency: function() {
            this.finalTransform.mProp.o.v <= 0 ? !this.isTransparent && this.globalData.renderConfig.hideOnTransparent && (this.isTransparent = true, this.hide()) : this.isTransparent && (this.isTransparent = false, this.show());
          }, checkLayerLimits: function(t) {
            this.data.ip - this.data.st <= t && this.data.op - this.data.st > t ? true !== this.isInRange && (this.globalData._mdf = true, this._mdf = true, this.isInRange = true, this.show()) : false !== this.isInRange && (this.globalData._mdf = true, this.isInRange = false, this.hide());
          }, renderRenderable: function() {
            var t, e = this.renderableComponents.length;
            for (t = 0; t < e; t += 1)
              this.renderableComponents[t].renderFrame(this._isFirstFrame);
          }, sourceRectAtTime: function() {
            return { top: 0, left: 0, width: 100, height: 100 };
          }, getLayerSize: function() {
            return 5 === this.data.ty ? { w: this.data.textData.width, h: this.data.textData.height } : { w: this.data.width, h: this.data.height };
          } }, extendPrototype([RenderableElement, createProxyFunction({ initElement: function(t, e, r) {
            this.initFrame(), this.initBaseData(t, e, r), this.initTransform(t, e, r), this.initHierarchy(), this.initRenderable(), this.initRendererElement(), this.createContainerElements(), this.createRenderableComponents(), this.createContent(), this.hide();
          }, hide: function() {
            this.hidden || this.isInRange && !this.isTransparent || ((this.baseElement || this.layerElement).style.display = "none", this.hidden = true);
          }, show: function() {
            this.isInRange && !this.isTransparent && (this.data.hd || ((this.baseElement || this.layerElement).style.display = "block"), this.hidden = false, this._isFirstFrame = true);
          }, renderFrame: function() {
            this.data.hd || this.hidden || (this.renderTransform(), this.renderRenderable(), this.renderElement(), this.renderInnerContent(), this._isFirstFrame && (this._isFirstFrame = false));
          }, renderInnerContent: function() {
          }, prepareFrame: function(t) {
            this._mdf = false, this.prepareRenderableFrame(t), this.prepareProperties(t, this.isInRange), this.checkTransparency();
          }, destroy: function() {
            this.innerElem = null, this.destroyBaseElement();
          } })], RenderableDOMElement), SVGShapeData.prototype.setAsAnimated = function() {
            this._isAnimated = true;
          }, ShapeTransformManager.prototype = { addTransformSequence: function(t) {
            var e, r = t.length, i2 = "_";
            for (e = 0; e < r; e += 1)
              i2 += t[e].transform.key + "_";
            var s = this.sequences[i2];
            return s || (s = { transforms: [].concat(t), finalTransform: new Matrix(), _mdf: false }, this.sequences[i2] = s, this.sequenceList.push(s)), s;
          }, processSequence: function(t, e) {
            for (var r, i2 = 0, s = t.transforms.length, a = e; i2 < s && !e; ) {
              if (t.transforms[i2].transform.mProps._mdf) {
                a = true;
                break;
              }
              i2 += 1;
            }
            if (a)
              for (t.finalTransform.reset(), i2 = s - 1; i2 >= 0; i2 -= 1)
                r = t.transforms[i2].transform.mProps.v.props, t.finalTransform.transform(r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8], r[9], r[10], r[11], r[12], r[13], r[14], r[15]);
            t._mdf = a;
          }, processSequences: function(t) {
            var e, r = this.sequenceList.length;
            for (e = 0; e < r; e += 1)
              this.processSequence(this.sequenceList[e], t);
          }, getNewKey: function() {
            return "_" + this.transform_key_count++;
          } }, CVShapeData.prototype.setAsAnimated = SVGShapeData.prototype.setAsAnimated, BaseElement.prototype = { checkMasks: function() {
            if (!this.data.hasMask)
              return false;
            for (var t = 0, e = this.data.masksProperties.length; t < e; ) {
              if ("n" !== this.data.masksProperties[t].mode && false !== this.data.masksProperties[t].cl)
                return true;
              t += 1;
            }
            return false;
          }, initExpressions: function() {
            this.layerInterface = LayerExpressionInterface(this), this.data.hasMask && this.maskManager && this.layerInterface.registerMaskInterface(this.maskManager);
            var t = EffectsExpressionInterface.createEffectsInterface(this, this.layerInterface);
            this.layerInterface.registerEffectsInterface(t), 0 === this.data.ty || this.data.xt ? this.compInterface = CompExpressionInterface(this) : 4 === this.data.ty ? (this.layerInterface.shapeInterface = ShapeExpressionInterface(this.shapesData, this.itemsData, this.layerInterface), this.layerInterface.content = this.layerInterface.shapeInterface) : 5 === this.data.ty && (this.layerInterface.textInterface = TextExpressionInterface(this), this.layerInterface.text = this.layerInterface.textInterface);
          }, setBlendMode: function() {
            var t = getBlendMode(this.data.bm);
            (this.baseElement || this.layerElement).style["mix-blend-mode"] = t;
          }, initBaseData: function(t, e, r) {
            this.globalData = e, this.comp = r, this.data = t, this.layerId = createElementID(), this.data.sr || (this.data.sr = 1), this.effectsManager = new EffectsManager(this.data, this, this.dynamicProperties);
          }, getType: function() {
            return this.type;
          }, sourceRectAtTime: function() {
          } }, NullElement.prototype.prepareFrame = function(t) {
            this.prepareProperties(t, true);
          }, NullElement.prototype.renderFrame = function() {
          }, NullElement.prototype.getBaseElement = function() {
            return null;
          }, NullElement.prototype.destroy = function() {
          }, NullElement.prototype.sourceRectAtTime = function() {
          }, NullElement.prototype.hide = function() {
          }, extendPrototype([BaseElement, TransformElement, HierarchyElement, FrameElement], NullElement), SVGBaseElement.prototype = { initRendererElement: function() {
            this.layerElement = createNS("g");
          }, createContainerElements: function() {
            this.matteElement = createNS("g"), this.transformedElement = this.layerElement, this.maskedElement = this.layerElement, this._sizeChanged = false;
            var t, e, r, i2 = null;
            if (this.data.td) {
              if (3 == this.data.td || 1 == this.data.td) {
                var s = createNS("mask");
                s.setAttribute("id", this.layerId), s.setAttribute("mask-type", 3 == this.data.td ? "luminance" : "alpha"), s.appendChild(this.layerElement), i2 = s, this.globalData.defs.appendChild(s), featureSupport.maskType || 1 != this.data.td || (s.setAttribute("mask-type", "luminance"), t = createElementID(), e = filtersFactory.createFilter(t), this.globalData.defs.appendChild(e), e.appendChild(filtersFactory.createAlphaToLuminanceFilter()), (r = createNS("g")).appendChild(this.layerElement), i2 = r, s.appendChild(r), r.setAttribute("filter", "url(" + locationHref + "#" + t + ")"));
              } else if (2 == this.data.td) {
                var a = createNS("mask");
                a.setAttribute("id", this.layerId), a.setAttribute("mask-type", "alpha");
                var n = createNS("g");
                a.appendChild(n), t = createElementID(), e = filtersFactory.createFilter(t);
                var o = createNS("feComponentTransfer");
                o.setAttribute("in", "SourceGraphic"), e.appendChild(o);
                var h = createNS("feFuncA");
                h.setAttribute("type", "table"), h.setAttribute("tableValues", "1.0 0.0"), o.appendChild(h), this.globalData.defs.appendChild(e);
                var l = createNS("rect");
                l.setAttribute("width", this.comp.data.w), l.setAttribute("height", this.comp.data.h), l.setAttribute("x", "0"), l.setAttribute("y", "0"), l.setAttribute("fill", "#ffffff"), l.setAttribute("opacity", "0"), n.setAttribute("filter", "url(" + locationHref + "#" + t + ")"), n.appendChild(l), n.appendChild(this.layerElement), i2 = n, featureSupport.maskType || (a.setAttribute("mask-type", "luminance"), e.appendChild(filtersFactory.createAlphaToLuminanceFilter()), r = createNS("g"), n.appendChild(l), r.appendChild(this.layerElement), i2 = r, n.appendChild(r)), this.globalData.defs.appendChild(a);
              }
            } else
              this.data.tt ? (this.matteElement.appendChild(this.layerElement), i2 = this.matteElement, this.baseElement = this.matteElement) : this.baseElement = this.layerElement;
            if (this.data.ln && this.layerElement.setAttribute("id", this.data.ln), this.data.cl && this.layerElement.setAttribute("class", this.data.cl), 0 === this.data.ty && !this.data.hd) {
              var p = createNS("clipPath"), f = createNS("path");
              f.setAttribute("d", "M0,0 L" + this.data.w + ",0 L" + this.data.w + "," + this.data.h + " L0," + this.data.h + "z");
              var m = createElementID();
              if (p.setAttribute("id", m), p.appendChild(f), this.globalData.defs.appendChild(p), this.checkMasks()) {
                var c = createNS("g");
                c.setAttribute("clip-path", "url(" + locationHref + "#" + m + ")"), c.appendChild(this.layerElement), this.transformedElement = c, i2 ? i2.appendChild(this.transformedElement) : this.baseElement = this.transformedElement;
              } else
                this.layerElement.setAttribute("clip-path", "url(" + locationHref + "#" + m + ")");
            }
            0 !== this.data.bm && this.setBlendMode();
          }, renderElement: function() {
            this.finalTransform._matMdf && this.transformedElement.setAttribute("transform", this.finalTransform.mat.to2dCSS()), this.finalTransform._opMdf && this.transformedElement.setAttribute("opacity", this.finalTransform.mProp.o.v);
          }, destroyBaseElement: function() {
            this.layerElement = null, this.matteElement = null, this.maskManager.destroy();
          }, getBaseElement: function() {
            return this.data.hd ? null : this.baseElement;
          }, createRenderableComponents: function() {
            this.maskManager = new MaskElement(this.data, this, this.globalData), this.renderableEffectsManager = new SVGEffects(this);
          }, setMatte: function(t) {
            this.matteElement && this.matteElement.setAttribute("mask", "url(" + locationHref + "#" + t + ")");
          } }, IShapeElement.prototype = { addShapeToModifiers: function(t) {
            var e, r = this.shapeModifiers.length;
            for (e = 0; e < r; e += 1)
              this.shapeModifiers[e].addShape(t);
          }, isShapeInAnimatedModifiers: function(t) {
            for (var e = this.shapeModifiers.length; 0 < e; )
              if (this.shapeModifiers[0].isAnimatedWithShape(t))
                return true;
            return false;
          }, renderModifiers: function() {
            if (this.shapeModifiers.length) {
              var t, e = this.shapes.length;
              for (t = 0; t < e; t += 1)
                this.shapes[t].sh.reset();
              for (t = (e = this.shapeModifiers.length) - 1; t >= 0; t -= 1)
                this.shapeModifiers[t].processShapes(this._isFirstFrame);
            }
          }, lcEnum: { 1: "butt", 2: "round", 3: "square" }, ljEnum: { 1: "miter", 2: "round", 3: "bevel" }, searchProcessedElement: function(t) {
            for (var e = this.processedElements, r = 0, i2 = e.length; r < i2; ) {
              if (e[r].elem === t)
                return e[r].pos;
              r += 1;
            }
            return 0;
          }, addProcessedElement: function(t, e) {
            for (var r = this.processedElements, i2 = r.length; i2; )
              if (r[i2 -= 1].elem === t)
                return void (r[i2].pos = e);
            r.push(new ProcessedElement(t, e));
          }, prepareFrame: function(t) {
            this.prepareRenderableFrame(t), this.prepareProperties(t, this.isInRange);
          } }, ITextElement.prototype.initElement = function(t, e, r) {
            this.lettersChangedFlag = true, this.initFrame(), this.initBaseData(t, e, r), this.textProperty = new TextProperty(this, t.t, this.dynamicProperties), this.textAnimator = new TextAnimatorProperty(t.t, this.renderType, this), this.initTransform(t, e, r), this.initHierarchy(), this.initRenderable(), this.initRendererElement(), this.createContainerElements(), this.createRenderableComponents(), this.createContent(), this.hide(), this.textAnimator.searchProperties(this.dynamicProperties);
          }, ITextElement.prototype.prepareFrame = function(t) {
            this._mdf = false, this.prepareRenderableFrame(t), this.prepareProperties(t, this.isInRange), (this.textProperty._mdf || this.textProperty._isFirstFrame) && (this.buildNewText(), this.textProperty._isFirstFrame = false, this.textProperty._mdf = false);
          }, ITextElement.prototype.createPathShape = function(t, e) {
            var r, i2, s = e.length, a = "";
            for (r = 0; r < s; r += 1)
              i2 = e[r].ks.k, a += buildShapeString(i2, i2.i.length, true, t);
            return a;
          }, ITextElement.prototype.updateDocumentData = function(t, e) {
            this.textProperty.updateDocumentData(t, e);
          }, ITextElement.prototype.canResizeFont = function(t) {
            this.textProperty.canResizeFont(t);
          }, ITextElement.prototype.setMinimumFontSize = function(t) {
            this.textProperty.setMinimumFontSize(t);
          }, ITextElement.prototype.applyTextPropertiesToMatrix = function(t, e, r, i2, s) {
            switch (t.ps && e.translate(t.ps[0], t.ps[1] + t.ascent, 0), e.translate(0, -t.ls, 0), t.j) {
              case 1:
                e.translate(t.justifyOffset + (t.boxWidth - t.lineWidths[r]), 0, 0);
                break;
              case 2:
                e.translate(t.justifyOffset + (t.boxWidth - t.lineWidths[r]) / 2, 0, 0);
            }
            e.translate(i2, s, 0);
          }, ITextElement.prototype.buildColor = function(t) {
            return "rgb(" + Math.round(255 * t[0]) + "," + Math.round(255 * t[1]) + "," + Math.round(255 * t[2]) + ")";
          }, ITextElement.prototype.emptyProp = new LetterProps(), ITextElement.prototype.destroy = function() {
          }, extendPrototype([BaseElement, TransformElement, HierarchyElement, FrameElement, RenderableDOMElement], ICompElement), ICompElement.prototype.initElement = function(t, e, r) {
            this.initFrame(), this.initBaseData(t, e, r), this.initTransform(t, e, r), this.initRenderable(), this.initHierarchy(), this.initRendererElement(), this.createContainerElements(), this.createRenderableComponents(), !this.data.xt && e.progressiveLoad || this.buildAllItems(), this.hide();
          }, ICompElement.prototype.prepareFrame = function(t) {
            if (this._mdf = false, this.prepareRenderableFrame(t), this.prepareProperties(t, this.isInRange), this.isInRange || this.data.xt) {
              if (this.tm._placeholder)
                this.renderedFrame = t / this.data.sr;
              else {
                var e = this.tm.v;
                e === this.data.op && (e = this.data.op - 1), this.renderedFrame = e;
              }
              var r, i2 = this.elements.length;
              for (this.completeLayers || this.checkLayers(this.renderedFrame), r = i2 - 1; r >= 0; r -= 1)
                (this.completeLayers || this.elements[r]) && (this.elements[r].prepareFrame(this.renderedFrame - this.layers[r].st), this.elements[r]._mdf && (this._mdf = true));
            }
          }, ICompElement.prototype.renderInnerContent = function() {
            var t, e = this.layers.length;
            for (t = 0; t < e; t += 1)
              (this.completeLayers || this.elements[t]) && this.elements[t].renderFrame();
          }, ICompElement.prototype.setElements = function(t) {
            this.elements = t;
          }, ICompElement.prototype.getElements = function() {
            return this.elements;
          }, ICompElement.prototype.destroyElements = function() {
            var t, e = this.layers.length;
            for (t = 0; t < e; t += 1)
              this.elements[t] && this.elements[t].destroy();
          }, ICompElement.prototype.destroy = function() {
            this.destroyElements(), this.destroyBaseElement();
          }, extendPrototype([BaseElement, TransformElement, SVGBaseElement, HierarchyElement, FrameElement, RenderableDOMElement], IImageElement), IImageElement.prototype.createContent = function() {
            var t = this.globalData.getAssetsPath(this.assetData);
            this.innerElem = createNS("image"), this.innerElem.setAttribute("width", this.assetData.w + "px"), this.innerElem.setAttribute("height", this.assetData.h + "px"), this.innerElem.setAttribute("preserveAspectRatio", this.assetData.pr || this.globalData.renderConfig.imagePreserveAspectRatio), this.innerElem.setAttributeNS("http://www.w3.org/1999/xlink", "href", t), this.layerElement.appendChild(this.innerElem);
          }, IImageElement.prototype.sourceRectAtTime = function() {
            return this.sourceRect;
          }, extendPrototype([IImageElement], ISolidElement), ISolidElement.prototype.createContent = function() {
            var t = createNS("rect");
            t.setAttribute("width", this.data.sw), t.setAttribute("height", this.data.sh), t.setAttribute("fill", this.data.sc), this.layerElement.appendChild(t);
          }, extendPrototype([BaseElement, TransformElement, SVGBaseElement, IShapeElement, HierarchyElement, FrameElement, RenderableDOMElement], SVGShapeElement), SVGShapeElement.prototype.initSecondaryElement = function() {
          }, SVGShapeElement.prototype.identityMatrix = new Matrix(), SVGShapeElement.prototype.buildExpressionInterface = function() {
          }, SVGShapeElement.prototype.createContent = function() {
            this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, this.layerElement, 0, [], true), this.filterUniqueShapes();
          }, SVGShapeElement.prototype.filterUniqueShapes = function() {
            var t, e, r, i2, s = this.shapes.length, a = this.stylesList.length, n = [], o = false;
            for (r = 0; r < a; r += 1) {
              for (i2 = this.stylesList[r], o = false, n.length = 0, t = 0; t < s; t += 1)
                -1 !== (e = this.shapes[t]).styles.indexOf(i2) && (n.push(e), o = e._isAnimated || o);
              n.length > 1 && o && this.setShapesAsAnimated(n);
            }
          }, SVGShapeElement.prototype.setShapesAsAnimated = function(t) {
            var e, r = t.length;
            for (e = 0; e < r; e += 1)
              t[e].setAsAnimated();
          }, SVGShapeElement.prototype.createStyleElement = function(t, e) {
            var r, i2 = new SVGStyleData(t, e), s = i2.pElem;
            if ("st" === t.ty)
              r = new SVGStrokeStyleData(this, t, i2);
            else if ("fl" === t.ty)
              r = new SVGFillStyleData(this, t, i2);
            else if ("gf" === t.ty || "gs" === t.ty) {
              r = new ("gf" === t.ty ? SVGGradientFillStyleData : SVGGradientStrokeStyleData)(this, t, i2), this.globalData.defs.appendChild(r.gf), r.maskId && (this.globalData.defs.appendChild(r.ms), this.globalData.defs.appendChild(r.of), s.setAttribute("mask", "url(" + locationHref + "#" + r.maskId + ")"));
            }
            return "st" !== t.ty && "gs" !== t.ty || (s.setAttribute("stroke-linecap", this.lcEnum[t.lc] || "round"), s.setAttribute("stroke-linejoin", this.ljEnum[t.lj] || "round"), s.setAttribute("fill-opacity", "0"), 1 === t.lj && s.setAttribute("stroke-miterlimit", t.ml)), 2 === t.r && s.setAttribute("fill-rule", "evenodd"), t.ln && s.setAttribute("id", t.ln), t.cl && s.setAttribute("class", t.cl), t.bm && (s.style["mix-blend-mode"] = getBlendMode(t.bm)), this.stylesList.push(i2), this.addToAnimatedContents(t, r), r;
          }, SVGShapeElement.prototype.createGroupElement = function(t) {
            var e = new ShapeGroupData();
            return t.ln && e.gr.setAttribute("id", t.ln), t.cl && e.gr.setAttribute("class", t.cl), t.bm && (e.gr.style["mix-blend-mode"] = getBlendMode(t.bm)), e;
          }, SVGShapeElement.prototype.createTransformElement = function(t, e) {
            var r = TransformPropertyFactory.getTransformProperty(this, t, this), i2 = new SVGTransformData(r, r.o, e);
            return this.addToAnimatedContents(t, i2), i2;
          }, SVGShapeElement.prototype.createShapeElement = function(t, e, r) {
            var i2 = 4;
            "rc" === t.ty ? i2 = 5 : "el" === t.ty ? i2 = 6 : "sr" === t.ty && (i2 = 7);
            var s = new SVGShapeData(e, r, ShapePropertyFactory.getShapeProp(this, t, i2, this));
            return this.shapes.push(s), this.addShapeToModifiers(s), this.addToAnimatedContents(t, s), s;
          }, SVGShapeElement.prototype.addToAnimatedContents = function(t, e) {
            for (var r = 0, i2 = this.animatedContents.length; r < i2; ) {
              if (this.animatedContents[r].element === e)
                return;
              r += 1;
            }
            this.animatedContents.push({ fn: SVGElementsRenderer.createRenderFunction(t), element: e, data: t });
          }, SVGShapeElement.prototype.setElementStyles = function(t) {
            var e, r = t.styles, i2 = this.stylesList.length;
            for (e = 0; e < i2; e += 1)
              this.stylesList[e].closed || r.push(this.stylesList[e]);
          }, SVGShapeElement.prototype.reloadShapes = function() {
            this._isFirstFrame = true;
            var t, e = this.itemsData.length;
            for (t = 0; t < e; t += 1)
              this.prevViewData[t] = this.itemsData[t];
            for (this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, this.layerElement, 0, [], true), this.filterUniqueShapes(), e = this.dynamicProperties.length, t = 0; t < e; t += 1)
              this.dynamicProperties[t].getValue();
            this.renderModifiers();
          }, SVGShapeElement.prototype.searchShapes = function(t, e, r, i2, s, a, n) {
            var o, h, l, p, f, m, c = [].concat(a), d = t.length - 1, u = [], y = [];
            for (o = d; o >= 0; o -= 1) {
              if ((m = this.searchProcessedElement(t[o])) ? e[o] = r[m - 1] : t[o]._render = n, "fl" == t[o].ty || "st" == t[o].ty || "gf" == t[o].ty || "gs" == t[o].ty)
                m ? e[o].style.closed = false : e[o] = this.createStyleElement(t[o], s), t[o]._render && i2.appendChild(e[o].style.pElem), u.push(e[o].style);
              else if ("gr" == t[o].ty) {
                if (m)
                  for (l = e[o].it.length, h = 0; h < l; h += 1)
                    e[o].prevViewData[h] = e[o].it[h];
                else
                  e[o] = this.createGroupElement(t[o]);
                this.searchShapes(t[o].it, e[o].it, e[o].prevViewData, e[o].gr, s + 1, c, n), t[o]._render && i2.appendChild(e[o].gr);
              } else
                "tr" == t[o].ty ? (m || (e[o] = this.createTransformElement(t[o], i2)), p = e[o].transform, c.push(p)) : "sh" == t[o].ty || "rc" == t[o].ty || "el" == t[o].ty || "sr" == t[o].ty ? (m || (e[o] = this.createShapeElement(t[o], c, s)), this.setElementStyles(e[o])) : "tm" == t[o].ty || "rd" == t[o].ty || "ms" == t[o].ty ? (m ? (f = e[o]).closed = false : ((f = ShapeModifiers.getModifier(t[o].ty)).init(this, t[o]), e[o] = f, this.shapeModifiers.push(f)), y.push(f)) : "rp" == t[o].ty && (m ? (f = e[o]).closed = true : (f = ShapeModifiers.getModifier(t[o].ty), e[o] = f, f.init(this, t, o, e), this.shapeModifiers.push(f), n = false), y.push(f));
              this.addProcessedElement(t[o], o + 1);
            }
            for (d = u.length, o = 0; o < d; o += 1)
              u[o].closed = true;
            for (d = y.length, o = 0; o < d; o += 1)
              y[o].closed = true;
          }, SVGShapeElement.prototype.renderInnerContent = function() {
            this.renderModifiers();
            var t, e = this.stylesList.length;
            for (t = 0; t < e; t += 1)
              this.stylesList[t].reset();
            for (this.renderShape(), t = 0; t < e; t += 1)
              (this.stylesList[t]._mdf || this._isFirstFrame) && (this.stylesList[t].msElem && (this.stylesList[t].msElem.setAttribute("d", this.stylesList[t].d), this.stylesList[t].d = "M0 0" + this.stylesList[t].d), this.stylesList[t].pElem.setAttribute("d", this.stylesList[t].d || "M0 0"));
          }, SVGShapeElement.prototype.renderShape = function() {
            var t, e, r = this.animatedContents.length;
            for (t = 0; t < r; t += 1)
              e = this.animatedContents[t], (this._isFirstFrame || e.element._isAnimated) && true !== e.data && e.fn(e.data, e.element, this._isFirstFrame);
          }, SVGShapeElement.prototype.destroy = function() {
            this.destroyBaseElement(), this.shapesData = null, this.itemsData = null;
          }, CVContextData.prototype.duplicate = function() {
            var t = 2 * this._length, e = this.savedOp;
            this.savedOp = createTypedArray("float32", t), this.savedOp.set(e);
            var r = 0;
            for (r = this._length; r < t; r += 1)
              this.saved[r] = createTypedArray("float32", 16);
            this._length = t;
          }, CVContextData.prototype.reset = function() {
            this.cArrPos = 0, this.cTr.reset(), this.cO = 1;
          }, CVBaseElement.prototype = { createElements: function() {
          }, initRendererElement: function() {
          }, createContainerElements: function() {
            this.canvasContext = this.globalData.canvasContext, this.renderableEffectsManager = new CVEffects(this);
          }, createContent: function() {
          }, setBlendMode: function() {
            var t = this.globalData;
            if (t.blendMode !== this.data.bm) {
              t.blendMode = this.data.bm;
              var e = getBlendMode(this.data.bm);
              t.canvasContext.globalCompositeOperation = e;
            }
          }, createRenderableComponents: function() {
            this.maskManager = new CVMaskElement(this.data, this);
          }, hideElement: function() {
            this.hidden || this.isInRange && !this.isTransparent || (this.hidden = true);
          }, showElement: function() {
            this.isInRange && !this.isTransparent && (this.hidden = false, this._isFirstFrame = true, this.maskManager._isFirstFrame = true);
          }, renderFrame: function() {
            this.hidden || this.data.hd || (this.renderTransform(), this.renderRenderable(), this.setBlendMode(), this.globalData.renderer.save(), this.globalData.renderer.ctxTransform(this.finalTransform.mat.props), this.globalData.renderer.ctxOpacity(this.finalTransform.mProp.o.v), this.renderInnerContent(), this.globalData.renderer.restore(), this.maskManager.hasMasks && this.globalData.renderer.restore(true), this._isFirstFrame && (this._isFirstFrame = false));
          }, destroy: function() {
            this.canvasContext = null, this.data = null, this.globalData = null, this.maskManager.destroy();
          }, mHelper: new Matrix() }, CVBaseElement.prototype.hide = CVBaseElement.prototype.hideElement, CVBaseElement.prototype.show = CVBaseElement.prototype.showElement, extendPrototype([BaseElement, TransformElement, CVBaseElement, HierarchyElement, FrameElement, RenderableElement], CVImageElement), CVImageElement.prototype.initElement = SVGShapeElement.prototype.initElement, CVImageElement.prototype.prepareFrame = IImageElement.prototype.prepareFrame, CVImageElement.prototype.createContent = function() {
            if (this.img.width && (this.assetData.w !== this.img.width || this.assetData.h !== this.img.height)) {
              var t = createTag("canvas");
              t.width = this.assetData.w, t.height = this.assetData.h;
              var e, r, i2 = t.getContext("2d"), s = this.img.width, a = this.img.height, n = s / a, o = this.assetData.w / this.assetData.h, h = this.assetData.pr || this.globalData.renderConfig.imagePreserveAspectRatio;
              n > o && "xMidYMid slice" === h || n < o && "xMidYMid slice" !== h ? e = (r = a) * o : r = (e = s) / o, i2.drawImage(this.img, (s - e) / 2, (a - r) / 2, e, r, 0, 0, this.assetData.w, this.assetData.h), this.img = t;
            }
          }, CVImageElement.prototype.renderInnerContent = function(t) {
            this.canvasContext.drawImage(this.img, 0, 0);
          }, CVImageElement.prototype.destroy = function() {
            this.img = null;
          }, extendPrototype([CanvasRenderer, ICompElement, CVBaseElement], CVCompElement), CVCompElement.prototype.renderInnerContent = function() {
            var t;
            for (t = this.layers.length - 1; t >= 0; t -= 1)
              (this.completeLayers || this.elements[t]) && this.elements[t].renderFrame();
          }, CVCompElement.prototype.destroy = function() {
            var t;
            for (t = this.layers.length - 1; t >= 0; t -= 1)
              this.elements[t] && this.elements[t].destroy();
            this.layers = null, this.elements = null;
          }, CVMaskElement.prototype.renderFrame = function() {
            if (this.hasMasks) {
              var t, e, r, i2, s = this.element.finalTransform.mat, a = this.element.canvasContext, n = this.masksProperties.length;
              for (a.beginPath(), t = 0; t < n; t++)
                if ("n" !== this.masksProperties[t].mode) {
                  this.masksProperties[t].inv && (a.moveTo(0, 0), a.lineTo(this.element.globalData.compSize.w, 0), a.lineTo(this.element.globalData.compSize.w, this.element.globalData.compSize.h), a.lineTo(0, this.element.globalData.compSize.h), a.lineTo(0, 0)), i2 = this.viewData[t].v, e = s.applyToPointArray(i2.v[0][0], i2.v[0][1], 0), a.moveTo(e[0], e[1]);
                  var o, h = i2._length;
                  for (o = 1; o < h; o++)
                    r = s.applyToTriplePoints(i2.o[o - 1], i2.i[o], i2.v[o]), a.bezierCurveTo(r[0], r[1], r[2], r[3], r[4], r[5]);
                  r = s.applyToTriplePoints(i2.o[o - 1], i2.i[0], i2.v[0]), a.bezierCurveTo(r[0], r[1], r[2], r[3], r[4], r[5]);
                }
              this.element.globalData.renderer.save(true), a.clip();
            }
          }, CVMaskElement.prototype.getMaskProperty = MaskElement.prototype.getMaskProperty, CVMaskElement.prototype.destroy = function() {
            this.element = null;
          }, extendPrototype([BaseElement, TransformElement, CVBaseElement, IShapeElement, HierarchyElement, FrameElement, RenderableElement], CVShapeElement), CVShapeElement.prototype.initElement = RenderableDOMElement.prototype.initElement, CVShapeElement.prototype.transformHelper = { opacity: 1, _opMdf: false }, CVShapeElement.prototype.dashResetter = [], CVShapeElement.prototype.createContent = function() {
            this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, true, []);
          }, CVShapeElement.prototype.createStyleElement = function(t, e) {
            var r = { data: t, type: t.ty, preTransforms: this.transformsManager.addTransformSequence(e), transforms: [], elements: [], closed: true === t.hd }, i2 = {};
            if ("fl" == t.ty || "st" == t.ty ? (i2.c = PropertyFactory.getProp(this, t.c, 1, 255, this), i2.c.k || (r.co = "rgb(" + bm_floor(i2.c.v[0]) + "," + bm_floor(i2.c.v[1]) + "," + bm_floor(i2.c.v[2]) + ")")) : "gf" !== t.ty && "gs" !== t.ty || (i2.s = PropertyFactory.getProp(this, t.s, 1, null, this), i2.e = PropertyFactory.getProp(this, t.e, 1, null, this), i2.h = PropertyFactory.getProp(this, t.h || { k: 0 }, 0, 0.01, this), i2.a = PropertyFactory.getProp(this, t.a || { k: 0 }, 0, degToRads, this), i2.g = new GradientProperty(this, t.g, this)), i2.o = PropertyFactory.getProp(this, t.o, 0, 0.01, this), "st" == t.ty || "gs" == t.ty) {
              if (r.lc = this.lcEnum[t.lc] || "round", r.lj = this.ljEnum[t.lj] || "round", 1 == t.lj && (r.ml = t.ml), i2.w = PropertyFactory.getProp(this, t.w, 0, null, this), i2.w.k || (r.wi = i2.w.v), t.d) {
                var s = new DashProperty(this, t.d, "canvas", this);
                i2.d = s, i2.d.k || (r.da = i2.d.dashArray, r.do = i2.d.dashoffset[0]);
              }
            } else
              r.r = 2 === t.r ? "evenodd" : "nonzero";
            return this.stylesList.push(r), i2.style = r, i2;
          }, CVShapeElement.prototype.createGroupElement = function(t) {
            return { it: [], prevViewData: [] };
          }, CVShapeElement.prototype.createTransformElement = function(t) {
            return { transform: { opacity: 1, _opMdf: false, key: this.transformsManager.getNewKey(), op: PropertyFactory.getProp(this, t.o, 0, 0.01, this), mProps: TransformPropertyFactory.getTransformProperty(this, t, this) } };
          }, CVShapeElement.prototype.createShapeElement = function(t) {
            var e = new CVShapeData(this, t, this.stylesList, this.transformsManager);
            return this.shapes.push(e), this.addShapeToModifiers(e), e;
          }, CVShapeElement.prototype.reloadShapes = function() {
            this._isFirstFrame = true;
            var t, e = this.itemsData.length;
            for (t = 0; t < e; t += 1)
              this.prevViewData[t] = this.itemsData[t];
            for (this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, true, []), e = this.dynamicProperties.length, t = 0; t < e; t += 1)
              this.dynamicProperties[t].getValue();
            this.renderModifiers(), this.transformsManager.processSequences(this._isFirstFrame);
          }, CVShapeElement.prototype.addTransformToStyleList = function(t) {
            var e, r = this.stylesList.length;
            for (e = 0; e < r; e += 1)
              this.stylesList[e].closed || this.stylesList[e].transforms.push(t);
          }, CVShapeElement.prototype.removeTransformFromStyleList = function() {
            var t, e = this.stylesList.length;
            for (t = 0; t < e; t += 1)
              this.stylesList[t].closed || this.stylesList[t].transforms.pop();
          }, CVShapeElement.prototype.closeStyles = function(t) {
            var e, r = t.length;
            for (e = 0; e < r; e += 1)
              t[e].closed = true;
          }, CVShapeElement.prototype.searchShapes = function(t, e, r, i2, s) {
            var a, n, o, h, l, p, f = t.length - 1, m = [], c = [], d = [].concat(s);
            for (a = f; a >= 0; a -= 1) {
              if ((h = this.searchProcessedElement(t[a])) ? e[a] = r[h - 1] : t[a]._shouldRender = i2, "fl" == t[a].ty || "st" == t[a].ty || "gf" == t[a].ty || "gs" == t[a].ty)
                h ? e[a].style.closed = false : e[a] = this.createStyleElement(t[a], d), m.push(e[a].style);
              else if ("gr" == t[a].ty) {
                if (h)
                  for (o = e[a].it.length, n = 0; n < o; n += 1)
                    e[a].prevViewData[n] = e[a].it[n];
                else
                  e[a] = this.createGroupElement(t[a]);
                this.searchShapes(t[a].it, e[a].it, e[a].prevViewData, i2, d);
              } else
                "tr" == t[a].ty ? (h || (p = this.createTransformElement(t[a]), e[a] = p), d.push(e[a]), this.addTransformToStyleList(e[a])) : "sh" == t[a].ty || "rc" == t[a].ty || "el" == t[a].ty || "sr" == t[a].ty ? h || (e[a] = this.createShapeElement(t[a])) : "tm" == t[a].ty || "rd" == t[a].ty ? (h ? (l = e[a]).closed = false : ((l = ShapeModifiers.getModifier(t[a].ty)).init(this, t[a]), e[a] = l, this.shapeModifiers.push(l)), c.push(l)) : "rp" == t[a].ty && (h ? (l = e[a]).closed = true : (l = ShapeModifiers.getModifier(t[a].ty), e[a] = l, l.init(this, t, a, e), this.shapeModifiers.push(l), i2 = false), c.push(l));
              this.addProcessedElement(t[a], a + 1);
            }
            for (this.removeTransformFromStyleList(), this.closeStyles(m), f = c.length, a = 0; a < f; a += 1)
              c[a].closed = true;
          }, CVShapeElement.prototype.renderInnerContent = function() {
            this.transformHelper.opacity = 1, this.transformHelper._opMdf = false, this.renderModifiers(), this.transformsManager.processSequences(this._isFirstFrame), this.renderShape(this.transformHelper, this.shapesData, this.itemsData, true);
          }, CVShapeElement.prototype.renderShapeTransform = function(t, e) {
            (t._opMdf || e.op._mdf || this._isFirstFrame) && (e.opacity = t.opacity, e.opacity *= e.op.v, e._opMdf = true);
          }, CVShapeElement.prototype.drawLayer = function() {
            var t, e, r, i2, s, a, n, o, h, l = this.stylesList.length, p = this.globalData.renderer, f = this.globalData.canvasContext;
            for (t = 0; t < l; t += 1)
              if (("st" !== (o = (h = this.stylesList[t]).type) && "gs" !== o || 0 !== h.wi) && h.data._shouldRender && 0 !== h.coOp && 0 !== this.globalData.currentGlobalAlpha) {
                for (p.save(), a = h.elements, "st" === o || "gs" === o ? (f.strokeStyle = "st" === o ? h.co : h.grd, f.lineWidth = h.wi, f.lineCap = h.lc, f.lineJoin = h.lj, f.miterLimit = h.ml || 0) : f.fillStyle = "fl" === o ? h.co : h.grd, p.ctxOpacity(h.coOp), "st" !== o && "gs" !== o && f.beginPath(), p.ctxTransform(h.preTransforms.finalTransform.props), r = a.length, e = 0; e < r; e += 1) {
                  for ("st" !== o && "gs" !== o || (f.beginPath(), h.da && (f.setLineDash(h.da), f.lineDashOffset = h.do)), s = (n = a[e].trNodes).length, i2 = 0; i2 < s; i2 += 1)
                    "m" == n[i2].t ? f.moveTo(n[i2].p[0], n[i2].p[1]) : "c" == n[i2].t ? f.bezierCurveTo(n[i2].pts[0], n[i2].pts[1], n[i2].pts[2], n[i2].pts[3], n[i2].pts[4], n[i2].pts[5]) : f.closePath();
                  "st" !== o && "gs" !== o || (f.stroke(), h.da && f.setLineDash(this.dashResetter));
                }
                "st" !== o && "gs" !== o && f.fill(h.r), p.restore();
              }
          }, CVShapeElement.prototype.renderShape = function(t, e, r, i2) {
            var s, a;
            for (a = t, s = e.length - 1; s >= 0; s -= 1)
              "tr" == e[s].ty ? (a = r[s].transform, this.renderShapeTransform(t, a)) : "sh" == e[s].ty || "el" == e[s].ty || "rc" == e[s].ty || "sr" == e[s].ty ? this.renderPath(e[s], r[s]) : "fl" == e[s].ty ? this.renderFill(e[s], r[s], a) : "st" == e[s].ty ? this.renderStroke(e[s], r[s], a) : "gf" == e[s].ty || "gs" == e[s].ty ? this.renderGradientFill(e[s], r[s], a) : "gr" == e[s].ty ? this.renderShape(a, e[s].it, r[s].it) : e[s].ty;
            i2 && this.drawLayer();
          }, CVShapeElement.prototype.renderStyledShape = function(t, e) {
            if (this._isFirstFrame || e._mdf || t.transforms._mdf) {
              var r, i2, s, a = t.trNodes, n = e.paths, o = n._length;
              a.length = 0;
              var h = t.transforms.finalTransform;
              for (s = 0; s < o; s += 1) {
                var l = n.shapes[s];
                if (l && l.v) {
                  for (i2 = l._length, r = 1; r < i2; r += 1)
                    1 === r && a.push({ t: "m", p: h.applyToPointArray(l.v[0][0], l.v[0][1], 0) }), a.push({ t: "c", pts: h.applyToTriplePoints(l.o[r - 1], l.i[r], l.v[r]) });
                  1 === i2 && a.push({ t: "m", p: h.applyToPointArray(l.v[0][0], l.v[0][1], 0) }), l.c && i2 && (a.push({ t: "c", pts: h.applyToTriplePoints(l.o[r - 1], l.i[0], l.v[0]) }), a.push({ t: "z" }));
                }
              }
              t.trNodes = a;
            }
          }, CVShapeElement.prototype.renderPath = function(t, e) {
            if (true !== t.hd && t._shouldRender) {
              var r, i2 = e.styledShapes.length;
              for (r = 0; r < i2; r += 1)
                this.renderStyledShape(e.styledShapes[r], e.sh);
            }
          }, CVShapeElement.prototype.renderFill = function(t, e, r) {
            var i2 = e.style;
            (e.c._mdf || this._isFirstFrame) && (i2.co = "rgb(" + bm_floor(e.c.v[0]) + "," + bm_floor(e.c.v[1]) + "," + bm_floor(e.c.v[2]) + ")"), (e.o._mdf || r._opMdf || this._isFirstFrame) && (i2.coOp = e.o.v * r.opacity);
          }, CVShapeElement.prototype.renderGradientFill = function(t, e, r) {
            var i2 = e.style;
            if (!i2.grd || e.g._mdf || e.s._mdf || e.e._mdf || 1 !== t.t && (e.h._mdf || e.a._mdf)) {
              var s = this.globalData.canvasContext, a = e.s.v, n = e.e.v;
              if (1 === t.t)
                m = s.createLinearGradient(a[0], a[1], n[0], n[1]);
              else
                var o = Math.sqrt(Math.pow(a[0] - n[0], 2) + Math.pow(a[1] - n[1], 2)), h = Math.atan2(n[1] - a[1], n[0] - a[0]), l = o * (e.h.v >= 1 ? 0.99 : e.h.v <= -1 ? -0.99 : e.h.v), p = Math.cos(h + e.a.v) * l + a[0], f = Math.sin(h + e.a.v) * l + a[1], m = s.createRadialGradient(p, f, 0, a[0], a[1], o);
              var c, d = t.g.p, u = e.g.c, y = 1;
              for (c = 0; c < d; c += 1)
                e.g._hasOpacity && e.g._collapsable && (y = e.g.o[2 * c + 1]), m.addColorStop(u[4 * c] / 100, "rgba(" + u[4 * c + 1] + "," + u[4 * c + 2] + "," + u[4 * c + 3] + "," + y + ")");
              i2.grd = m;
            }
            i2.coOp = e.o.v * r.opacity;
          }, CVShapeElement.prototype.renderStroke = function(t, e, r) {
            var i2 = e.style, s = e.d;
            s && (s._mdf || this._isFirstFrame) && (i2.da = s.dashArray, i2.do = s.dashoffset[0]), (e.c._mdf || this._isFirstFrame) && (i2.co = "rgb(" + bm_floor(e.c.v[0]) + "," + bm_floor(e.c.v[1]) + "," + bm_floor(e.c.v[2]) + ")"), (e.o._mdf || r._opMdf || this._isFirstFrame) && (i2.coOp = e.o.v * r.opacity), (e.w._mdf || this._isFirstFrame) && (i2.wi = e.w.v);
          }, CVShapeElement.prototype.destroy = function() {
            this.shapesData = null, this.globalData = null, this.canvasContext = null, this.stylesList.length = 0, this.itemsData.length = 0;
          }, extendPrototype([BaseElement, TransformElement, CVBaseElement, HierarchyElement, FrameElement, RenderableElement], CVSolidElement), CVSolidElement.prototype.initElement = SVGShapeElement.prototype.initElement, CVSolidElement.prototype.prepareFrame = IImageElement.prototype.prepareFrame, CVSolidElement.prototype.renderInnerContent = function() {
            var t = this.canvasContext;
            t.fillStyle = this.data.sc, t.fillRect(0, 0, this.data.sw, this.data.sh);
          }, extendPrototype([BaseElement, TransformElement, CVBaseElement, HierarchyElement, FrameElement, RenderableElement, ITextElement], CVTextElement), CVTextElement.prototype.tHelper = createTag("canvas").getContext("2d"), CVTextElement.prototype.buildNewText = function() {
            var t = this.textProperty.currentData;
            this.renderedLetters = createSizedArray(t.l ? t.l.length : 0);
            var e = false;
            t.fc ? (e = true, this.values.fill = this.buildColor(t.fc)) : this.values.fill = "rgba(0,0,0,0)", this.fill = e;
            var r = false;
            t.sc && (r = true, this.values.stroke = this.buildColor(t.sc), this.values.sWidth = t.sw);
            var i2, s, a = this.globalData.fontManager.getFontByName(t.f), n = t.l, o = this.mHelper;
            this.stroke = r, this.values.fValue = t.finalSize + "px " + this.globalData.fontManager.getFontByName(t.f).fFamily, s = t.finalText.length;
            var h, l, p, f, m, c, d, u, y, g, v = this.data.singleShape, b = t.tr / 1e3 * t.finalSize, P = 0, _ = 0, x = true, S = 0;
            for (i2 = 0; i2 < s; i2 += 1) {
              for (l = (h = this.globalData.fontManager.getCharData(t.finalText[i2], a.fStyle, this.globalData.fontManager.getFontByName(t.f).fFamily)) && h.data || {}, o.reset(), v && n[i2].n && (P = -b, _ += t.yOffset, _ += x ? 1 : 0, x = false), d = (m = l.shapes ? l.shapes[0].it : []).length, o.scale(t.finalSize / 100, t.finalSize / 100), v && this.applyTextPropertiesToMatrix(t, o, n[i2].line, P, _), y = createSizedArray(d), c = 0; c < d; c += 1) {
                for (f = m[c].ks.k.i.length, u = m[c].ks.k, g = [], p = 1; p < f; p += 1)
                  1 == p && g.push(o.applyToX(u.v[0][0], u.v[0][1], 0), o.applyToY(u.v[0][0], u.v[0][1], 0)), g.push(o.applyToX(u.o[p - 1][0], u.o[p - 1][1], 0), o.applyToY(u.o[p - 1][0], u.o[p - 1][1], 0), o.applyToX(u.i[p][0], u.i[p][1], 0), o.applyToY(u.i[p][0], u.i[p][1], 0), o.applyToX(u.v[p][0], u.v[p][1], 0), o.applyToY(u.v[p][0], u.v[p][1], 0));
                g.push(o.applyToX(u.o[p - 1][0], u.o[p - 1][1], 0), o.applyToY(u.o[p - 1][0], u.o[p - 1][1], 0), o.applyToX(u.i[0][0], u.i[0][1], 0), o.applyToY(u.i[0][0], u.i[0][1], 0), o.applyToX(u.v[0][0], u.v[0][1], 0), o.applyToY(u.v[0][0], u.v[0][1], 0)), y[c] = g;
              }
              v && (P += n[i2].l, P += b), this.textSpans[S] ? this.textSpans[S].elem = y : this.textSpans[S] = { elem: y }, S += 1;
            }
          }, CVTextElement.prototype.renderInnerContent = function() {
            var t, e, r, i2, s, a, n = this.canvasContext;
            this.finalTransform.mat.props;
            n.font = this.values.fValue, n.lineCap = "butt", n.lineJoin = "miter", n.miterLimit = 4, this.data.singleShape || this.textAnimator.getMeasures(this.textProperty.currentData, this.lettersChangedFlag);
            var o, h = this.textAnimator.renderedLetters, l = this.textProperty.currentData.l;
            e = l.length;
            var p, f, m = null, c = null, d = null;
            for (t = 0; t < e; t += 1)
              if (!l[t].n) {
                if ((o = h[t]) && (this.globalData.renderer.save(), this.globalData.renderer.ctxTransform(o.p), this.globalData.renderer.ctxOpacity(o.o)), this.fill) {
                  for (o && o.fc ? m !== o.fc && (m = o.fc, n.fillStyle = o.fc) : m !== this.values.fill && (m = this.values.fill, n.fillStyle = this.values.fill), i2 = (p = this.textSpans[t].elem).length, this.globalData.canvasContext.beginPath(), r = 0; r < i2; r += 1)
                    for (a = (f = p[r]).length, this.globalData.canvasContext.moveTo(f[0], f[1]), s = 2; s < a; s += 6)
                      this.globalData.canvasContext.bezierCurveTo(f[s], f[s + 1], f[s + 2], f[s + 3], f[s + 4], f[s + 5]);
                  this.globalData.canvasContext.closePath(), this.globalData.canvasContext.fill();
                }
                if (this.stroke) {
                  for (o && o.sw ? d !== o.sw && (d = o.sw, n.lineWidth = o.sw) : d !== this.values.sWidth && (d = this.values.sWidth, n.lineWidth = this.values.sWidth), o && o.sc ? c !== o.sc && (c = o.sc, n.strokeStyle = o.sc) : c !== this.values.stroke && (c = this.values.stroke, n.strokeStyle = this.values.stroke), i2 = (p = this.textSpans[t].elem).length, this.globalData.canvasContext.beginPath(), r = 0; r < i2; r += 1)
                    for (a = (f = p[r]).length, this.globalData.canvasContext.moveTo(f[0], f[1]), s = 2; s < a; s += 6)
                      this.globalData.canvasContext.bezierCurveTo(f[s], f[s + 1], f[s + 2], f[s + 3], f[s + 4], f[s + 5]);
                  this.globalData.canvasContext.closePath(), this.globalData.canvasContext.stroke();
                }
                o && this.globalData.renderer.restore();
              }
          }, CVEffects.prototype.renderFrame = function() {
          };
          var animationManager = function() {
            var t = {}, e = [], r = 0, i2 = 0, s = 0, a = true, n = false;
            function o(t2) {
              for (var r2 = 0, s2 = t2.target; r2 < i2; )
                e[r2].animation === s2 && (e.splice(r2, 1), r2 -= 1, i2 -= 1, s2.isPaused || p()), r2 += 1;
            }
            function h(t2, r2) {
              if (!t2)
                return null;
              for (var s2 = 0; s2 < i2; ) {
                if (e[s2].elem == t2 && null !== e[s2].elem)
                  return e[s2].animation;
                s2 += 1;
              }
              var a2 = new AnimationItem();
              return f(a2, t2), a2.setData(t2, r2), a2;
            }
            function l() {
              s += 1, d();
            }
            function p() {
              s -= 1;
            }
            function f(t2, r2) {
              t2.addEventListener("destroy", o), t2.addEventListener("_active", l), t2.addEventListener("_idle", p), e.push({ elem: r2, animation: t2 }), i2 += 1;
            }
            function m(t2) {
              var o2, h2 = t2 - r;
              for (o2 = 0; o2 < i2; o2 += 1)
                e[o2].animation.advanceTime(h2);
              r = t2, s && !n ? window.requestAnimationFrame(m) : a = true;
            }
            function c(t2) {
              r = t2, window.requestAnimationFrame(m);
            }
            function d() {
              !n && s && a && (window.requestAnimationFrame(c), a = false);
            }
            return t.registerAnimation = h, t.loadAnimation = function(t2) {
              var e2 = new AnimationItem();
              return f(e2, null), e2.setParams(t2), e2;
            }, t.setSpeed = function(t2, r2) {
              var s2;
              for (s2 = 0; s2 < i2; s2 += 1)
                e[s2].animation.setSpeed(t2, r2);
            }, t.setDirection = function(t2, r2) {
              var s2;
              for (s2 = 0; s2 < i2; s2 += 1)
                e[s2].animation.setDirection(t2, r2);
            }, t.play = function(t2) {
              var r2;
              for (r2 = 0; r2 < i2; r2 += 1)
                e[r2].animation.play(t2);
            }, t.pause = function(t2) {
              var r2;
              for (r2 = 0; r2 < i2; r2 += 1)
                e[r2].animation.pause(t2);
            }, t.stop = function(t2) {
              var r2;
              for (r2 = 0; r2 < i2; r2 += 1)
                e[r2].animation.stop(t2);
            }, t.togglePause = function(t2) {
              var r2;
              for (r2 = 0; r2 < i2; r2 += 1)
                e[r2].animation.togglePause(t2);
            }, t.searchAnimations = function(t2, e2, r2) {
              var i3, s2 = [].concat([].slice.call(document.getElementsByClassName("lottie")), [].slice.call(document.getElementsByClassName("bodymovin"))), a2 = s2.length;
              for (i3 = 0; i3 < a2; i3 += 1)
                r2 && s2[i3].setAttribute("data-bm-type", r2), h(s2[i3], t2);
              if (e2 && 0 === a2) {
                r2 || (r2 = "svg");
                var n2 = document.getElementsByTagName("body")[0];
                n2.innerHTML = "";
                var o2 = createTag("div");
                o2.style.width = "100%", o2.style.height = "100%", o2.setAttribute("data-bm-type", r2), n2.appendChild(o2), h(o2, t2);
              }
            }, t.resize = function() {
              var t2;
              for (t2 = 0; t2 < i2; t2 += 1)
                e[t2].animation.resize();
            }, t.goToAndStop = function(t2, r2, s2) {
              var a2;
              for (a2 = 0; a2 < i2; a2 += 1)
                e[a2].animation.goToAndStop(t2, r2, s2);
            }, t.destroy = function(t2) {
              var r2;
              for (r2 = i2 - 1; r2 >= 0; r2 -= 1)
                e[r2].animation.destroy(t2);
            }, t.freeze = function() {
              n = true;
            }, t.unfreeze = function() {
              n = false, d();
            }, t.getRegisteredAnimations = function() {
              var t2, r2 = e.length, i3 = [];
              for (t2 = 0; t2 < r2; t2 += 1)
                i3.push(e[t2].animation);
              return i3;
            }, t;
          }(), AnimationItem = function() {
            this._cbs = [], this.name = "", this.path = "", this.isLoaded = false, this.currentFrame = 0, this.currentRawFrame = 0, this.totalFrames = 0, this.frameRate = 0, this.frameMult = 0, this.playSpeed = 1, this.playDirection = 1, this.playCount = 0, this.animationData = {}, this.assets = [], this.isPaused = true, this.autoplay = false, this.loop = true, this.renderer = null, this.animationID = createElementID(), this.assetsPath = "", this.timeCompleted = 0, this.segmentPos = 0, this.subframeEnabled = subframeEnabled, this.segments = [], this._idle = true, this._completedLoop = false, this.projectInterface = ProjectInterface(), this.imagePreloader = new ImagePreloader();
          };
          extendPrototype([BaseEvent], AnimationItem), AnimationItem.prototype.setParams = function(t) {
            t.context && (this.context = t.context), (t.wrapper || t.container) && (this.wrapper = t.wrapper || t.container);
            var e = t.animType ? t.animType : t.renderer ? t.renderer : "svg";
            switch (e) {
              case "canvas":
                this.renderer = new CanvasRenderer(this, t.rendererSettings);
                break;
              case "svg":
                this.renderer = new SVGRenderer(this, t.rendererSettings);
                break;
              default:
                this.renderer = new HybridRenderer(this, t.rendererSettings);
            }
            this.renderer.setProjectInterface(this.projectInterface), this.animType = e, "" === t.loop || null === t.loop || (false === t.loop ? this.loop = false : true === t.loop ? this.loop = true : this.loop = parseInt(t.loop)), this.autoplay = !("autoplay" in t) || t.autoplay, this.name = t.name ? t.name : "", this.autoloadSegments = !t.hasOwnProperty("autoloadSegments") || t.autoloadSegments, this.assetsPath = t.assetsPath, t.animationData ? this.configAnimation(t.animationData) : t.path && ("json" != t.path.substr(-4) && ("/" != t.path.substr(-1, 1) && (t.path += "/"), t.path += "data.json"), -1 != t.path.lastIndexOf("\\") ? this.path = t.path.substr(0, t.path.lastIndexOf("\\") + 1) : this.path = t.path.substr(0, t.path.lastIndexOf("/") + 1), this.fileName = t.path.substr(t.path.lastIndexOf("/") + 1), this.fileName = this.fileName.substr(0, this.fileName.lastIndexOf(".json")), assetLoader.load(t.path, this.configAnimation.bind(this), (function() {
              this.trigger("data_failed");
            }).bind(this)));
          }, AnimationItem.prototype.setData = function(t, e) {
            var r = { wrapper: t, animationData: e ? "object" === _typeof(e) ? e : JSON.parse(e) : null }, i2 = t.attributes;
            r.path = i2.getNamedItem("data-animation-path") ? i2.getNamedItem("data-animation-path").value : i2.getNamedItem("data-bm-path") ? i2.getNamedItem("data-bm-path").value : i2.getNamedItem("bm-path") ? i2.getNamedItem("bm-path").value : "", r.animType = i2.getNamedItem("data-anim-type") ? i2.getNamedItem("data-anim-type").value : i2.getNamedItem("data-bm-type") ? i2.getNamedItem("data-bm-type").value : i2.getNamedItem("bm-type") ? i2.getNamedItem("bm-type").value : i2.getNamedItem("data-bm-renderer") ? i2.getNamedItem("data-bm-renderer").value : i2.getNamedItem("bm-renderer") ? i2.getNamedItem("bm-renderer").value : "canvas";
            var s = i2.getNamedItem("data-anim-loop") ? i2.getNamedItem("data-anim-loop").value : i2.getNamedItem("data-bm-loop") ? i2.getNamedItem("data-bm-loop").value : i2.getNamedItem("bm-loop") ? i2.getNamedItem("bm-loop").value : "";
            "" === s || (r.loop = "false" !== s && ("true" === s || parseInt(s)));
            var a = i2.getNamedItem("data-anim-autoplay") ? i2.getNamedItem("data-anim-autoplay").value : i2.getNamedItem("data-bm-autoplay") ? i2.getNamedItem("data-bm-autoplay").value : !i2.getNamedItem("bm-autoplay") || i2.getNamedItem("bm-autoplay").value;
            r.autoplay = "false" !== a, r.name = i2.getNamedItem("data-name") ? i2.getNamedItem("data-name").value : i2.getNamedItem("data-bm-name") ? i2.getNamedItem("data-bm-name").value : i2.getNamedItem("bm-name") ? i2.getNamedItem("bm-name").value : "", "false" === (i2.getNamedItem("data-anim-prerender") ? i2.getNamedItem("data-anim-prerender").value : i2.getNamedItem("data-bm-prerender") ? i2.getNamedItem("data-bm-prerender").value : i2.getNamedItem("bm-prerender") ? i2.getNamedItem("bm-prerender").value : "") && (r.prerender = false), this.setParams(r);
          }, AnimationItem.prototype.includeLayers = function(t) {
            t.op > this.animationData.op && (this.animationData.op = t.op, this.totalFrames = Math.floor(t.op - this.animationData.ip));
            var e, r, i2 = this.animationData.layers, s = i2.length, a = t.layers, n = a.length;
            for (r = 0; r < n; r += 1)
              for (e = 0; e < s; ) {
                if (i2[e].id == a[r].id) {
                  i2[e] = a[r];
                  break;
                }
                e += 1;
              }
            if ((t.chars || t.fonts) && (this.renderer.globalData.fontManager.addChars(t.chars), this.renderer.globalData.fontManager.addFonts(t.fonts, this.renderer.globalData.defs)), t.assets)
              for (s = t.assets.length, e = 0; e < s; e += 1)
                this.animationData.assets.push(t.assets[e]);
            this.animationData.__complete = false, dataManager.completeData(this.animationData, this.renderer.globalData.fontManager), this.renderer.includeLayers(t.layers), expressionsPlugin && expressionsPlugin.initExpressions(this), this.loadNextSegment();
          }, AnimationItem.prototype.loadNextSegment = function() {
            var t = this.animationData.segments;
            if (!t || 0 === t.length || !this.autoloadSegments)
              return this.trigger("data_ready"), void (this.timeCompleted = this.totalFrames);
            var e = t.shift();
            this.timeCompleted = e.time * this.frameRate;
            var r = this.path + this.fileName + "_" + this.segmentPos + ".json";
            this.segmentPos += 1, assetLoader.load(r, this.includeLayers.bind(this), (function() {
              this.trigger("data_failed");
            }).bind(this));
          }, AnimationItem.prototype.loadSegments = function() {
            this.animationData.segments || (this.timeCompleted = this.totalFrames), this.loadNextSegment();
          }, AnimationItem.prototype.imagesLoaded = function() {
            this.trigger("loaded_images"), this.checkLoaded();
          }, AnimationItem.prototype.preloadImages = function() {
            this.imagePreloader.setAssetsPath(this.assetsPath), this.imagePreloader.setPath(this.path), this.imagePreloader.loadAssets(this.animationData.assets, this.imagesLoaded.bind(this));
          }, AnimationItem.prototype.configAnimation = function(t) {
            this.renderer && (this.animationData = t, this.totalFrames = Math.floor(this.animationData.op - this.animationData.ip), this.renderer.configAnimation(t), t.assets || (t.assets = []), this.renderer.searchExtraCompositions(t.assets), this.assets = this.animationData.assets, this.frameRate = this.animationData.fr, this.firstFrame = Math.round(this.animationData.ip), this.frameMult = this.animationData.fr / 1e3, this.trigger("config_ready"), this.preloadImages(), this.loadSegments(), this.updaFrameModifier(), this.waitForFontsLoaded());
          }, AnimationItem.prototype.waitForFontsLoaded = function() {
            this.renderer && (this.renderer.globalData.fontManager.loaded() ? this.checkLoaded() : setTimeout(this.waitForFontsLoaded.bind(this), 20));
          }, AnimationItem.prototype.checkLoaded = function() {
            this.isLoaded || !this.renderer.globalData.fontManager.loaded() || !this.imagePreloader.loaded() && "canvas" === this.renderer.rendererType || (this.isLoaded = true, dataManager.completeData(this.animationData, this.renderer.globalData.fontManager), expressionsPlugin && expressionsPlugin.initExpressions(this), this.renderer.initItems(), setTimeout((function() {
              this.trigger("DOMLoaded");
            }).bind(this), 0), this.gotoFrame(), this.autoplay && this.play());
          }, AnimationItem.prototype.resize = function() {
            this.renderer.updateContainerSize();
          }, AnimationItem.prototype.setSubframe = function(t) {
            this.subframeEnabled = !!t;
          }, AnimationItem.prototype.gotoFrame = function() {
            this.currentFrame = this.subframeEnabled ? this.currentRawFrame : ~~this.currentRawFrame, this.timeCompleted !== this.totalFrames && this.currentFrame > this.timeCompleted && (this.currentFrame = this.timeCompleted), this.trigger("enterFrame"), this.renderFrame();
          }, AnimationItem.prototype.renderFrame = function() {
            false !== this.isLoaded && this.renderer.renderFrame(this.currentFrame + this.firstFrame);
          }, AnimationItem.prototype.play = function(t) {
            t && this.name != t || true === this.isPaused && (this.isPaused = false, this._idle && (this._idle = false, this.trigger("_active")));
          }, AnimationItem.prototype.pause = function(t) {
            t && this.name != t || false === this.isPaused && (this.isPaused = true, this._idle = true, this.trigger("_idle"));
          }, AnimationItem.prototype.togglePause = function(t) {
            t && this.name != t || (true === this.isPaused ? this.play() : this.pause());
          }, AnimationItem.prototype.stop = function(t) {
            t && this.name != t || (this.pause(), this.playCount = 0, this._completedLoop = false, this.setCurrentRawFrameValue(0));
          }, AnimationItem.prototype.goToAndStop = function(t, e, r) {
            r && this.name != r || (e ? this.setCurrentRawFrameValue(t) : this.setCurrentRawFrameValue(t * this.frameModifier), this.pause());
          }, AnimationItem.prototype.goToAndPlay = function(t, e, r) {
            this.goToAndStop(t, e, r), this.play();
          }, AnimationItem.prototype.advanceTime = function(t) {
            if (true !== this.isPaused && false !== this.isLoaded) {
              var e = this.currentRawFrame + t * this.frameModifier, r = false;
              e >= this.totalFrames - 1 && this.frameModifier > 0 ? this.loop && this.playCount !== this.loop ? e >= this.totalFrames ? (this.playCount += 1, this.checkSegments(e % this.totalFrames) || (this.setCurrentRawFrameValue(e % this.totalFrames), this._completedLoop = true, this.trigger("loopComplete"))) : this.setCurrentRawFrameValue(e) : this.checkSegments(e > this.totalFrames ? e % this.totalFrames : 0) || (r = true, e = this.totalFrames - 1) : e < 0 ? this.checkSegments(e % this.totalFrames) || (!this.loop || this.playCount-- <= 0 && true !== this.loop ? (r = true, e = 0) : (this.setCurrentRawFrameValue(this.totalFrames + e % this.totalFrames), this._completedLoop ? this.trigger("loopComplete") : this._completedLoop = true)) : this.setCurrentRawFrameValue(e), r && (this.setCurrentRawFrameValue(e), this.pause(), this.trigger("complete"));
            }
          }, AnimationItem.prototype.adjustSegment = function(t, e) {
            this.playCount = 0, t[1] < t[0] ? (this.frameModifier > 0 && (this.playSpeed < 0 ? this.setSpeed(-this.playSpeed) : this.setDirection(-1)), this.timeCompleted = this.totalFrames = t[0] - t[1], this.firstFrame = t[1], this.setCurrentRawFrameValue(this.totalFrames - 1e-3 - e)) : t[1] > t[0] && (this.frameModifier < 0 && (this.playSpeed < 0 ? this.setSpeed(-this.playSpeed) : this.setDirection(1)), this.timeCompleted = this.totalFrames = t[1] - t[0], this.firstFrame = t[0], this.setCurrentRawFrameValue(1e-3 + e)), this.trigger("segmentStart");
          }, AnimationItem.prototype.setSegment = function(t, e) {
            var r = -1;
            this.isPaused && (this.currentRawFrame + this.firstFrame < t ? r = t : this.currentRawFrame + this.firstFrame > e && (r = e - t)), this.firstFrame = t, this.timeCompleted = this.totalFrames = e - t, -1 !== r && this.goToAndStop(r, true);
          }, AnimationItem.prototype.playSegments = function(t, e) {
            if (e && (this.segments.length = 0), "object" === _typeof(t[0])) {
              var r, i2 = t.length;
              for (r = 0; r < i2; r += 1)
                this.segments.push(t[r]);
            } else
              this.segments.push(t);
            this.segments.length && e && this.adjustSegment(this.segments.shift(), 0), this.isPaused && this.play();
          }, AnimationItem.prototype.resetSegments = function(t) {
            this.segments.length = 0, this.segments.push([this.animationData.ip, this.animationData.op]), t && this.checkSegments(0);
          }, AnimationItem.prototype.checkSegments = function(t) {
            return !!this.segments.length && (this.adjustSegment(this.segments.shift(), t), true);
          }, AnimationItem.prototype.destroy = function(t) {
            t && this.name != t || !this.renderer || (this.renderer.destroy(), this.imagePreloader.destroy(), this.trigger("destroy"), this._cbs = null, this.onEnterFrame = this.onLoopComplete = this.onComplete = this.onSegmentStart = this.onDestroy = null, this.renderer = null);
          }, AnimationItem.prototype.setCurrentRawFrameValue = function(t) {
            this.currentRawFrame = t, this.gotoFrame();
          }, AnimationItem.prototype.setSpeed = function(t) {
            this.playSpeed = t, this.updaFrameModifier();
          }, AnimationItem.prototype.setDirection = function(t) {
            this.playDirection = t < 0 ? -1 : 1, this.updaFrameModifier();
          }, AnimationItem.prototype.updaFrameModifier = function() {
            this.frameModifier = this.frameMult * this.playSpeed * this.playDirection;
          }, AnimationItem.prototype.getPath = function() {
            return this.path;
          }, AnimationItem.prototype.getAssetsPath = function(t) {
            var e = "";
            if (t.e)
              e = t.p;
            else if (this.assetsPath) {
              var r = t.p;
              -1 !== r.indexOf("images/") && (r = r.split("/")[1]), e = this.assetsPath + r;
            } else
              e = this.path, e += t.u ? t.u : "", e += t.p;
            return e;
          }, AnimationItem.prototype.getAssetData = function(t) {
            for (var e = 0, r = this.assets.length; e < r; ) {
              if (t == this.assets[e].id)
                return this.assets[e];
              e += 1;
            }
          }, AnimationItem.prototype.hide = function() {
            this.renderer.hide();
          }, AnimationItem.prototype.show = function() {
            this.renderer.show();
          }, AnimationItem.prototype.getDuration = function(t) {
            return t ? this.totalFrames : this.totalFrames / this.frameRate;
          }, AnimationItem.prototype.trigger = function(t) {
            if (this._cbs && this._cbs[t])
              switch (t) {
                case "enterFrame":
                  this.triggerEvent(t, new BMEnterFrameEvent(t, this.currentFrame, this.totalFrames, this.frameModifier));
                  break;
                case "loopComplete":
                  this.triggerEvent(t, new BMCompleteLoopEvent(t, this.loop, this.playCount, this.frameMult));
                  break;
                case "complete":
                  this.triggerEvent(t, new BMCompleteEvent(t, this.frameMult));
                  break;
                case "segmentStart":
                  this.triggerEvent(t, new BMSegmentStartEvent(t, this.firstFrame, this.totalFrames));
                  break;
                case "destroy":
                  this.triggerEvent(t, new BMDestroyEvent(t, this));
                  break;
                default:
                  this.triggerEvent(t);
              }
            "enterFrame" === t && this.onEnterFrame && this.onEnterFrame.call(this, new BMEnterFrameEvent(t, this.currentFrame, this.totalFrames, this.frameMult)), "loopComplete" === t && this.onLoopComplete && this.onLoopComplete.call(this, new BMCompleteLoopEvent(t, this.loop, this.playCount, this.frameMult)), "complete" === t && this.onComplete && this.onComplete.call(this, new BMCompleteEvent(t, this.frameMult)), "segmentStart" === t && this.onSegmentStart && this.onSegmentStart.call(this, new BMSegmentStartEvent(t, this.firstFrame, this.totalFrames)), "destroy" === t && this.onDestroy && this.onDestroy.call(this, new BMDestroyEvent(t, this));
          };
          var Expressions = function() {
            var t = {};
            return t.initExpressions = function(t2) {
              var e = 0, r = [];
              t2.renderer.compInterface = CompExpressionInterface(t2.renderer), t2.renderer.globalData.projectInterface.registerComposition(t2.renderer), t2.renderer.globalData.pushExpression = function() {
                e += 1;
              }, t2.renderer.globalData.popExpression = function() {
                0 === (e -= 1) && function() {
                  var t3, e2 = r.length;
                  for (t3 = 0; t3 < e2; t3 += 1)
                    r[t3].release();
                  r.length = 0;
                }();
              }, t2.renderer.globalData.registerExpressionProperty = function(t3) {
                -1 === r.indexOf(t3) && r.push(t3);
              };
            }, t;
          }();
          expressionsPlugin = Expressions;
          var ExpressionManager = function() {
            var ob = {}, Math = BMMath, window = null, document = null;
            function $bm_isInstanceOfArray(t) {
              return t.constructor === Array || t.constructor === Float32Array;
            }
            function isNumerable(t, e) {
              return "number" === t || "boolean" === t || "string" === t || e instanceof Number;
            }
            function $bm_neg(t) {
              var e = _typeof(t);
              if ("number" === e || "boolean" === e || t instanceof Number)
                return -t;
              if ($bm_isInstanceOfArray(t)) {
                var r, i2 = t.length, s = [];
                for (r = 0; r < i2; r += 1)
                  s[r] = -t[r];
                return s;
              }
              return t.propType ? t.v : void 0;
            }
            var easeInBez = BezierFactory.getBezierEasing(0.333, 0, 0.833, 0.833, "easeIn").get, easeOutBez = BezierFactory.getBezierEasing(0.167, 0.167, 0.667, 1, "easeOut").get, easeInOutBez = BezierFactory.getBezierEasing(0.33, 0, 0.667, 1, "easeInOut").get;
            function sum(t, e) {
              var r = _typeof(t), i2 = _typeof(e);
              if ("string" === r || "string" === i2)
                return t + e;
              if (isNumerable(r, t) && isNumerable(i2, e))
                return t + e;
              if ($bm_isInstanceOfArray(t) && isNumerable(i2, e))
                return (t = t.slice(0))[0] = t[0] + e, t;
              if (isNumerable(r, t) && $bm_isInstanceOfArray(e))
                return (e = e.slice(0))[0] = t + e[0], e;
              if ($bm_isInstanceOfArray(t) && $bm_isInstanceOfArray(e)) {
                for (var s = 0, a = t.length, n = e.length, o = []; s < a || s < n; )
                  ("number" == typeof t[s] || t[s] instanceof Number) && ("number" == typeof e[s] || e[s] instanceof Number) ? o[s] = t[s] + e[s] : o[s] = void 0 === e[s] ? t[s] : t[s] || e[s], s += 1;
                return o;
              }
              return 0;
            }
            var add = sum;
            function sub(t, e) {
              var r = _typeof(t), i2 = _typeof(e);
              if (isNumerable(r, t) && isNumerable(i2, e))
                return "string" === r && (t = parseInt(t)), "string" === i2 && (e = parseInt(e)), t - e;
              if ($bm_isInstanceOfArray(t) && isNumerable(i2, e))
                return (t = t.slice(0))[0] = t[0] - e, t;
              if (isNumerable(r, t) && $bm_isInstanceOfArray(e))
                return (e = e.slice(0))[0] = t - e[0], e;
              if ($bm_isInstanceOfArray(t) && $bm_isInstanceOfArray(e)) {
                for (var s = 0, a = t.length, n = e.length, o = []; s < a || s < n; )
                  ("number" == typeof t[s] || t[s] instanceof Number) && ("number" == typeof e[s] || e[s] instanceof Number) ? o[s] = t[s] - e[s] : o[s] = void 0 === e[s] ? t[s] : t[s] || e[s], s += 1;
                return o;
              }
              return 0;
            }
            function mul(t, e) {
              var r, i2, s, a = _typeof(t), n = _typeof(e);
              if (isNumerable(a, t) && isNumerable(n, e))
                return t * e;
              if ($bm_isInstanceOfArray(t) && isNumerable(n, e)) {
                for (s = t.length, r = createTypedArray("float32", s), i2 = 0; i2 < s; i2 += 1)
                  r[i2] = t[i2] * e;
                return r;
              }
              if (isNumerable(a, t) && $bm_isInstanceOfArray(e)) {
                for (s = e.length, r = createTypedArray("float32", s), i2 = 0; i2 < s; i2 += 1)
                  r[i2] = t * e[i2];
                return r;
              }
              return 0;
            }
            function div(t, e) {
              var r, i2, s, a = _typeof(t), n = _typeof(e);
              if (isNumerable(a, t) && isNumerable(n, e))
                return t / e;
              if ($bm_isInstanceOfArray(t) && isNumerable(n, e)) {
                for (s = t.length, r = createTypedArray("float32", s), i2 = 0; i2 < s; i2 += 1)
                  r[i2] = t[i2] / e;
                return r;
              }
              if (isNumerable(a, t) && $bm_isInstanceOfArray(e)) {
                for (s = e.length, r = createTypedArray("float32", s), i2 = 0; i2 < s; i2 += 1)
                  r[i2] = t / e[i2];
                return r;
              }
              return 0;
            }
            function mod(t, e) {
              return "string" == typeof t && (t = parseInt(t)), "string" == typeof e && (e = parseInt(e)), t % e;
            }
            var $bm_sum = sum, $bm_sub = sub, $bm_mul = mul, $bm_div = div, $bm_mod = mod;
            function clamp(t, e, r) {
              if (e > r) {
                var i2 = r;
                r = e, e = i2;
              }
              return Math.min(Math.max(t, e), r);
            }
            function radiansToDegrees(t) {
              return t / degToRads;
            }
            var radians_to_degrees = radiansToDegrees;
            function degreesToRadians(t) {
              return t * degToRads;
            }
            var degrees_to_radians = radiansToDegrees, helperLengthArray = [0, 0, 0, 0, 0, 0];
            function length(t, e) {
              if ("number" == typeof t || t instanceof Number)
                return e = e || 0, Math.abs(t - e);
              e || (e = helperLengthArray);
              var r, i2 = Math.min(t.length, e.length), s = 0;
              for (r = 0; r < i2; r += 1)
                s += Math.pow(e[r] - t[r], 2);
              return Math.sqrt(s);
            }
            function normalize(t) {
              return div(t, length(t));
            }
            function rgbToHsl(t) {
              var e, r, i2 = t[0], s = t[1], a = t[2], n = Math.max(i2, s, a), o = Math.min(i2, s, a), h = (n + o) / 2;
              if (n == o)
                e = r = 0;
              else {
                var l = n - o;
                switch (r = h > 0.5 ? l / (2 - n - o) : l / (n + o), n) {
                  case i2:
                    e = (s - a) / l + (s < a ? 6 : 0);
                    break;
                  case s:
                    e = (a - i2) / l + 2;
                    break;
                  case a:
                    e = (i2 - s) / l + 4;
                }
                e /= 6;
              }
              return [e, r, h, t[3]];
            }
            function hue2rgb(t, e, r) {
              return r < 0 && (r += 1), r > 1 && (r -= 1), r < 1 / 6 ? t + 6 * (e - t) * r : r < 0.5 ? e : r < 2 / 3 ? t + (e - t) * (2 / 3 - r) * 6 : t;
            }
            function hslToRgb(t) {
              var e, r, i2, s = t[0], a = t[1], n = t[2];
              if (0 === a)
                e = r = i2 = n;
              else {
                var o = n < 0.5 ? n * (1 + a) : n + a - n * a, h = 2 * n - o;
                e = hue2rgb(h, o, s + 1 / 3), r = hue2rgb(h, o, s), i2 = hue2rgb(h, o, s - 1 / 3);
              }
              return [e, r, i2, t[3]];
            }
            function linear(t, e, r, i2, s) {
              if (void 0 !== i2 && void 0 !== s || (i2 = e, s = r, e = 0, r = 1), r < e) {
                var a = r;
                r = e, e = a;
              }
              if (t <= e)
                return i2;
              if (t >= r)
                return s;
              var n = r === e ? 0 : (t - e) / (r - e);
              if (!i2.length)
                return i2 + (s - i2) * n;
              var o, h = i2.length, l = createTypedArray("float32", h);
              for (o = 0; o < h; o += 1)
                l[o] = i2[o] + (s[o] - i2[o]) * n;
              return l;
            }
            function random(t, e) {
              if (void 0 === e && (void 0 === t ? (t = 0, e = 1) : (e = t, t = void 0)), e.length) {
                var r, i2 = e.length;
                t || (t = createTypedArray("float32", i2));
                var s = createTypedArray("float32", i2), a = BMMath.random();
                for (r = 0; r < i2; r += 1)
                  s[r] = t[r] + a * (e[r] - t[r]);
                return s;
              }
              return void 0 === t && (t = 0), t + BMMath.random() * (e - t);
            }
            function createPath(t, e, r, i2) {
              var s, a = t.length, n = shape_pool.newElement();
              n.setPathData(!!i2, a);
              var o, h, l = [0, 0];
              for (s = 0; s < a; s += 1)
                o = e && e[s] ? e[s] : l, h = r && r[s] ? r[s] : l, n.setTripleAt(t[s][0], t[s][1], h[0] + t[s][0], h[1] + t[s][1], o[0] + t[s][0], o[1] + t[s][1], s, true);
              return n;
            }
            function initiateExpression(elem, data, property) {
              var val = data.x, needsVelocity = /velocity(?![\w\d])/.test(val), _needsRandom = -1 !== val.indexOf("random"), elemType = elem.data.ty, transform, $bm_transform, content, effect, thisProperty = property;
              thisProperty.valueAtTime = thisProperty.getValueAtTime, Object.defineProperty(thisProperty, "value", { get: function() {
                return thisProperty.v;
              } }), elem.comp.frameDuration = 1 / elem.comp.globalData.frameRate, elem.comp.displayStartTime = 0;
              var inPoint = elem.data.ip / elem.comp.globalData.frameRate, outPoint = elem.data.op / elem.comp.globalData.frameRate, width = elem.data.sw ? elem.data.sw : 0, height = elem.data.sh ? elem.data.sh : 0, name = elem.data.nm, loopIn, loop_in, loopOut, loop_out, smooth, toWorld, fromWorld, fromComp, toComp, fromCompToSurface, position, rotation, anchorPoint, scale, thisLayer, thisComp, mask, valueAtTime, velocityAtTime, __expression_functions = [], scoped_bm_rt;
              if (data.xf) {
                var i, len = data.xf.length;
                for (i = 0; i < len; i += 1)
                  __expression_functions[i] = eval("(function(){ return " + data.xf[i] + "}())");
              }
              var expression_function = eval("[function _expression_function(){" + val + ";scoped_bm_rt=$bm_rt}]")[0], numKeys = property.kf ? data.k.length : 0, active = !this.data || true !== this.data.hd, wiggle = (function(t, e) {
                var r, i2, s = this.pv.length ? this.pv.length : 1, a = createTypedArray("float32", s);
                var n = Math.floor(5 * time);
                for (r = 0, i2 = 0; r < n; ) {
                  for (i2 = 0; i2 < s; i2 += 1)
                    a[i2] += -e + 2 * e * BMMath.random();
                  r += 1;
                }
                var o = 5 * time, h = o - Math.floor(o), l = createTypedArray("float32", s);
                if (s > 1) {
                  for (i2 = 0; i2 < s; i2 += 1)
                    l[i2] = this.pv[i2] + a[i2] + (-e + 2 * e * BMMath.random()) * h;
                  return l;
                }
                return this.pv + a[0] + (-e + 2 * e * BMMath.random()) * h;
              }).bind(this);
              function loopInDuration(t, e) {
                return loopIn(t, e, true);
              }
              function loopOutDuration(t, e) {
                return loopOut(t, e, true);
              }
              thisProperty.loopIn && (loopIn = thisProperty.loopIn.bind(thisProperty), loop_in = loopIn), thisProperty.loopOut && (loopOut = thisProperty.loopOut.bind(thisProperty), loop_out = loopOut), thisProperty.smooth && (smooth = thisProperty.smooth.bind(thisProperty)), this.getValueAtTime && (valueAtTime = this.getValueAtTime.bind(this)), this.getVelocityAtTime && (velocityAtTime = this.getVelocityAtTime.bind(this));
              var comp = elem.comp.globalData.projectInterface.bind(elem.comp.globalData.projectInterface), time, velocity, value, text, textIndex, textTotal, selectorValue;
              function lookAt(t, e) {
                var r = [e[0] - t[0], e[1] - t[1], e[2] - t[2]], i2 = Math.atan2(r[0], Math.sqrt(r[1] * r[1] + r[2] * r[2])) / degToRads;
                return [-Math.atan2(r[1], r[2]) / degToRads, i2, 0];
              }
              function easeOut(t, e, r, i2, s) {
                return applyEase(easeOutBez, t, e, r, i2, s);
              }
              function easeIn(t, e, r, i2, s) {
                return applyEase(easeInBez, t, e, r, i2, s);
              }
              function ease(t, e, r, i2, s) {
                return applyEase(easeInOutBez, t, e, r, i2, s);
              }
              function applyEase(t, e, r, i2, s, a) {
                void 0 === s ? (s = r, a = i2) : e = (e - r) / (i2 - r);
                var n = t(e = e > 1 ? 1 : e < 0 ? 0 : e);
                if ($bm_isInstanceOfArray(s)) {
                  var o, h = s.length, l = createTypedArray("float32", h);
                  for (o = 0; o < h; o += 1)
                    l[o] = (a[o] - s[o]) * n + s[o];
                  return l;
                }
                return (a - s) * n + s;
              }
              function nearestKey(t) {
                var e, r, i2, s = data.k.length;
                if (data.k.length && "number" != typeof data.k[0])
                  if (r = -1, (t *= elem.comp.globalData.frameRate) < data.k[0].t)
                    r = 1, i2 = data.k[0].t;
                  else {
                    for (e = 0; e < s - 1; e += 1) {
                      if (t === data.k[e].t) {
                        r = e + 1, i2 = data.k[e].t;
                        break;
                      }
                      if (t > data.k[e].t && t < data.k[e + 1].t) {
                        t - data.k[e].t > data.k[e + 1].t - t ? (r = e + 2, i2 = data.k[e + 1].t) : (r = e + 1, i2 = data.k[e].t);
                        break;
                      }
                    }
                    -1 === r && (r = e + 1, i2 = data.k[e].t);
                  }
                else
                  r = 0, i2 = 0;
                var a = {};
                return a.index = r, a.time = i2 / elem.comp.globalData.frameRate, a;
              }
              function key(t) {
                var e, r, i2;
                if (!data.k.length || "number" == typeof data.k[0])
                  throw new Error("The property has no keyframe at index " + t);
                t -= 1, e = { time: data.k[t].t / elem.comp.globalData.frameRate, value: [] };
                var s = data.k[t].hasOwnProperty("s") ? data.k[t].s : data.k[t - 1].e;
                for (i2 = s.length, r = 0; r < i2; r += 1)
                  e[r] = s[r], e.value[r] = s[r];
                return e;
              }
              function framesToTime(t, e) {
                return e || (e = elem.comp.globalData.frameRate), t / e;
              }
              function timeToFrames(t, e) {
                return t || 0 === t || (t = time), e || (e = elem.comp.globalData.frameRate), t * e;
              }
              function seedRandom(t) {
                BMMath.seedrandom(randSeed + t);
              }
              function sourceRectAtTime() {
                return elem.sourceRectAtTime();
              }
              function substring(t, e) {
                return "string" == typeof value ? void 0 === e ? value.substring(t) : value.substring(t, e) : "";
              }
              function substr(t, e) {
                return "string" == typeof value ? void 0 === e ? value.substr(t) : value.substr(t, e) : "";
              }
              var index = elem.data.ind, hasParent = !(!elem.hierarchy || !elem.hierarchy.length), parent, randSeed = Math.floor(1e6 * Math.random()), globalData = elem.globalData;
              function executeExpression(t) {
                return value = t, _needsRandom && seedRandom(randSeed), this.frameExpressionId === elem.globalData.frameId && "textSelector" !== this.propType ? value : ("textSelector" === this.propType && (textIndex = this.textIndex, textTotal = this.textTotal, selectorValue = this.selectorValue), thisLayer || (text = elem.layerInterface.text, thisLayer = elem.layerInterface, thisComp = elem.comp.compInterface, toWorld = thisLayer.toWorld.bind(thisLayer), fromWorld = thisLayer.fromWorld.bind(thisLayer), fromComp = thisLayer.fromComp.bind(thisLayer), toComp = thisLayer.toComp.bind(thisLayer), mask = thisLayer.mask ? thisLayer.mask.bind(thisLayer) : null, fromCompToSurface = fromComp), transform || (transform = elem.layerInterface("ADBE Transform Group"), $bm_transform = transform, transform && (anchorPoint = transform.anchorPoint)), 4 !== elemType || content || (content = thisLayer("ADBE Root Vectors Group")), effect || (effect = thisLayer(4)), (hasParent = !(!elem.hierarchy || !elem.hierarchy.length)) && !parent && (parent = elem.hierarchy[0].layerInterface), time = this.comp.renderedFrame / this.comp.globalData.frameRate, needsVelocity && (velocity = velocityAtTime(time)), expression_function(), this.frameExpressionId = elem.globalData.frameId, "shape" === scoped_bm_rt.propType && (scoped_bm_rt = scoped_bm_rt.v), scoped_bm_rt);
              }
              return executeExpression;
            }
            return ob.initiateExpression = initiateExpression, ob;
          }(), expressionHelpers = { searchExpressions: function(t, e, r) {
            e.x && (r.k = true, r.x = true, r.initiateExpression = ExpressionManager.initiateExpression, r.effectsSequence.push(r.initiateExpression(t, e, r).bind(r)));
          }, getSpeedAtTime: function(t) {
            var e = this.getValueAtTime(t), r = this.getValueAtTime(t + -0.01), i2 = 0;
            if (e.length) {
              var s;
              for (s = 0; s < e.length; s += 1)
                i2 += Math.pow(r[s] - e[s], 2);
              i2 = 100 * Math.sqrt(i2);
            } else
              i2 = 0;
            return i2;
          }, getVelocityAtTime: function(t) {
            if (void 0 !== this.vel)
              return this.vel;
            var e, r, i2 = this.getValueAtTime(t), s = this.getValueAtTime(t + -1e-3);
            if (i2.length)
              for (e = createTypedArray("float32", i2.length), r = 0; r < i2.length; r += 1)
                e[r] = (s[r] - i2[r]) / -1e-3;
            else
              e = (s - i2) / -1e-3;
            return e;
          }, getValueAtTime: function(t) {
            return t *= this.elem.globalData.frameRate, (t -= this.offsetTime) !== this._cachingAtTime.lastFrame && (this._cachingAtTime.lastIndex = this._cachingAtTime.lastFrame < t ? this._cachingAtTime.lastIndex : 0, this._cachingAtTime.value = this.interpolateValue(t, this._cachingAtTime), this._cachingAtTime.lastFrame = t), this._cachingAtTime.value;
          }, getStaticValueAtTime: function() {
            return this.pv;
          }, setGroupProperty: function(t) {
            this.propertyGroup = t;
          } };
          !function() {
            function t(t2, e2, r2) {
              if (!this.k || !this.keyframes)
                return this.pv;
              t2 = t2 ? t2.toLowerCase() : "";
              var i3, s2, a2, n2, o2, h2 = this.comp.renderedFrame, l2 = this.keyframes, p2 = l2[l2.length - 1].t;
              if (h2 <= p2)
                return this.pv;
              if (r2 ? s2 = p2 - (i3 = e2 ? Math.abs(p2 - elem.comp.globalData.frameRate * e2) : Math.max(0, p2 - this.elem.data.ip)) : ((!e2 || e2 > l2.length - 1) && (e2 = l2.length - 1), i3 = p2 - (s2 = l2[l2.length - 1 - e2].t)), "pingpong" === t2) {
                if (Math.floor((h2 - s2) / i3) % 2 != 0)
                  return this.getValueAtTime((i3 - (h2 - s2) % i3 + s2) / this.comp.globalData.frameRate, 0);
              } else {
                if ("offset" === t2) {
                  var f = this.getValueAtTime(s2 / this.comp.globalData.frameRate, 0), m = this.getValueAtTime(p2 / this.comp.globalData.frameRate, 0), c = this.getValueAtTime(((h2 - s2) % i3 + s2) / this.comp.globalData.frameRate, 0), d = Math.floor((h2 - s2) / i3);
                  if (this.pv.length) {
                    for (n2 = (o2 = new Array(f.length)).length, a2 = 0; a2 < n2; a2 += 1)
                      o2[a2] = (m[a2] - f[a2]) * d + c[a2];
                    return o2;
                  }
                  return (m - f) * d + c;
                }
                if ("continue" === t2) {
                  var u = this.getValueAtTime(p2 / this.comp.globalData.frameRate, 0), y = this.getValueAtTime((p2 - 1e-3) / this.comp.globalData.frameRate, 0);
                  if (this.pv.length) {
                    for (n2 = (o2 = new Array(u.length)).length, a2 = 0; a2 < n2; a2 += 1)
                      o2[a2] = u[a2] + (u[a2] - y[a2]) * ((h2 - p2) / this.comp.globalData.frameRate) / 5e-4;
                    return o2;
                  }
                  return u + (h2 - p2) / 1e-3 * (u - y);
                }
              }
              return this.getValueAtTime(((h2 - s2) % i3 + s2) / this.comp.globalData.frameRate, 0);
            }
            function e(t2, e2, r2) {
              if (!this.k)
                return this.pv;
              t2 = t2 ? t2.toLowerCase() : "";
              var i3, s2, a2, n2, o2, h2 = this.comp.renderedFrame, l2 = this.keyframes, p2 = l2[0].t;
              if (h2 >= p2)
                return this.pv;
              if (r2 ? s2 = p2 + (i3 = e2 ? Math.abs(elem.comp.globalData.frameRate * e2) : Math.max(0, this.elem.data.op - p2)) : ((!e2 || e2 > l2.length - 1) && (e2 = l2.length - 1), i3 = (s2 = l2[e2].t) - p2), "pingpong" === t2) {
                if (Math.floor((p2 - h2) / i3) % 2 == 0)
                  return this.getValueAtTime(((p2 - h2) % i3 + p2) / this.comp.globalData.frameRate, 0);
              } else {
                if ("offset" === t2) {
                  var f = this.getValueAtTime(p2 / this.comp.globalData.frameRate, 0), m = this.getValueAtTime(s2 / this.comp.globalData.frameRate, 0), c = this.getValueAtTime((i3 - (p2 - h2) % i3 + p2) / this.comp.globalData.frameRate, 0), d = Math.floor((p2 - h2) / i3) + 1;
                  if (this.pv.length) {
                    for (n2 = (o2 = new Array(f.length)).length, a2 = 0; a2 < n2; a2 += 1)
                      o2[a2] = c[a2] - (m[a2] - f[a2]) * d;
                    return o2;
                  }
                  return c - (m - f) * d;
                }
                if ("continue" === t2) {
                  var u = this.getValueAtTime(p2 / this.comp.globalData.frameRate, 0), y = this.getValueAtTime((p2 + 1e-3) / this.comp.globalData.frameRate, 0);
                  if (this.pv.length) {
                    for (n2 = (o2 = new Array(u.length)).length, a2 = 0; a2 < n2; a2 += 1)
                      o2[a2] = u[a2] + (u[a2] - y[a2]) * (p2 - h2) / 1e-3;
                    return o2;
                  }
                  return u + (u - y) * (p2 - h2) / 1e-3;
                }
              }
              return this.getValueAtTime((i3 - (p2 - h2) % i3 + p2) / this.comp.globalData.frameRate, 0);
            }
            function r(t2, e2) {
              if (!this.k)
                return this.pv;
              if (t2 = 0.5 * (t2 || 0.4), (e2 = Math.floor(e2 || 5)) <= 1)
                return this.pv;
              var r2, i3, s2 = this.comp.renderedFrame / this.comp.globalData.frameRate, a2 = s2 - t2, n2 = e2 > 1 ? (s2 + t2 - a2) / (e2 - 1) : 1, o2 = 0, h2 = 0;
              for (r2 = this.pv.length ? createTypedArray("float32", this.pv.length) : 0; o2 < e2; ) {
                if (i3 = this.getValueAtTime(a2 + o2 * n2), this.pv.length)
                  for (h2 = 0; h2 < this.pv.length; h2 += 1)
                    r2[h2] += i3[h2];
                else
                  r2 += i3;
                o2 += 1;
              }
              if (this.pv.length)
                for (h2 = 0; h2 < this.pv.length; h2 += 1)
                  r2[h2] /= e2;
              else
                r2 /= e2;
              return r2;
            }
            function i2(t2) {
              console.warn("Transform at time not supported");
            }
            function s(t2) {
            }
            var a = TransformPropertyFactory.getTransformProperty;
            TransformPropertyFactory.getTransformProperty = function(t2, e2, r2) {
              var n2 = a(t2, e2, r2);
              return n2.dynamicProperties.length ? n2.getValueAtTime = i2.bind(n2) : n2.getValueAtTime = s.bind(n2), n2.setGroupProperty = expressionHelpers.setGroupProperty, n2;
            };
            var n = PropertyFactory.getProp;
            PropertyFactory.getProp = function(i3, s2, a2, o2, h2) {
              var l2 = n(i3, s2, a2, o2, h2);
              l2.kf ? l2.getValueAtTime = expressionHelpers.getValueAtTime.bind(l2) : l2.getValueAtTime = expressionHelpers.getStaticValueAtTime.bind(l2), l2.setGroupProperty = expressionHelpers.setGroupProperty, l2.loopOut = t, l2.loopIn = e, l2.smooth = r, l2.getVelocityAtTime = expressionHelpers.getVelocityAtTime.bind(l2), l2.getSpeedAtTime = expressionHelpers.getSpeedAtTime.bind(l2), l2.numKeys = 1 === s2.a ? s2.k.length : 0, l2.propertyIndex = s2.ix;
              var p2 = 0;
              return 0 !== a2 && (p2 = createTypedArray("float32", 1 === s2.a ? s2.k[0].s.length : s2.k.length)), l2._cachingAtTime = { lastFrame: initialDefaultFrame, lastIndex: 0, value: p2 }, expressionHelpers.searchExpressions(i3, s2, l2), l2.k && h2.addDynamicProperty(l2), l2;
            };
            var o = ShapePropertyFactory.getConstructorFunction(), h = ShapePropertyFactory.getKeyframedConstructorFunction();
            function l() {
            }
            l.prototype = { vertices: function(t2, e2) {
              this.k && this.getValue();
              var r2 = this.v;
              void 0 !== e2 && (r2 = this.getValueAtTime(e2, 0));
              var i3, s2 = r2._length, a2 = r2[t2], n2 = r2.v, o2 = createSizedArray(s2);
              for (i3 = 0; i3 < s2; i3 += 1)
                o2[i3] = "i" === t2 || "o" === t2 ? [a2[i3][0] - n2[i3][0], a2[i3][1] - n2[i3][1]] : [a2[i3][0], a2[i3][1]];
              return o2;
            }, points: function(t2) {
              return this.vertices("v", t2);
            }, inTangents: function(t2) {
              return this.vertices("i", t2);
            }, outTangents: function(t2) {
              return this.vertices("o", t2);
            }, isClosed: function() {
              return this.v.c;
            }, pointOnPath: function(t2, e2) {
              var r2 = this.v;
              void 0 !== e2 && (r2 = this.getValueAtTime(e2, 0)), this._segmentsLength || (this._segmentsLength = bez.getSegmentsLength(r2));
              for (var i3, s2 = this._segmentsLength, a2 = s2.lengths, n2 = s2.totalLength * t2, o2 = 0, h2 = a2.length, l2 = 0; o2 < h2; ) {
                if (l2 + a2[o2].addedLength > n2) {
                  var p2 = o2, f = r2.c && o2 === h2 - 1 ? 0 : o2 + 1, m = (n2 - l2) / a2[o2].addedLength;
                  i3 = bez.getPointInSegment(r2.v[p2], r2.v[f], r2.o[p2], r2.i[f], m, a2[o2]);
                  break;
                }
                l2 += a2[o2].addedLength, o2 += 1;
              }
              return i3 || (i3 = r2.c ? [r2.v[0][0], r2.v[0][1]] : [r2.v[r2._length - 1][0], r2.v[r2._length - 1][1]]), i3;
            }, vectorOnPath: function(t2, e2, r2) {
              t2 = 1 == t2 ? this.v.c ? 0 : 0.999 : t2;
              var i3 = this.pointOnPath(t2, e2), s2 = this.pointOnPath(t2 + 1e-3, e2), a2 = s2[0] - i3[0], n2 = s2[1] - i3[1], o2 = Math.sqrt(Math.pow(a2, 2) + Math.pow(n2, 2));
              return 0 === o2 ? [0, 0] : "tangent" === r2 ? [a2 / o2, n2 / o2] : [-n2 / o2, a2 / o2];
            }, tangentOnPath: function(t2, e2) {
              return this.vectorOnPath(t2, e2, "tangent");
            }, normalOnPath: function(t2, e2) {
              return this.vectorOnPath(t2, e2, "normal");
            }, setGroupProperty: expressionHelpers.setGroupProperty, getValueAtTime: expressionHelpers.getStaticValueAtTime }, extendPrototype([l], o), extendPrototype([l], h), h.prototype.getValueAtTime = function(t2) {
              return this._cachingAtTime || (this._cachingAtTime = { shapeValue: shape_pool.clone(this.pv), lastIndex: 0, lastTime: initialDefaultFrame }), t2 *= this.elem.globalData.frameRate, (t2 -= this.offsetTime) !== this._cachingAtTime.lastTime && (this._cachingAtTime.lastIndex = this._cachingAtTime.lastTime < t2 ? this._caching.lastIndex : 0, this._cachingAtTime.lastTime = t2, this.interpolateShape(t2, this._cachingAtTime.shapeValue, this._cachingAtTime)), this._cachingAtTime.shapeValue;
            }, h.prototype.initiateExpression = ExpressionManager.initiateExpression;
            var p = ShapePropertyFactory.getShapeProp;
            ShapePropertyFactory.getShapeProp = function(t2, e2, r2, i3, s2) {
              var a2 = p(t2, e2, r2, i3, s2);
              return a2.propertyIndex = e2.ix, a2.lock = false, 3 === r2 ? expressionHelpers.searchExpressions(t2, e2.pt, a2) : 4 === r2 && expressionHelpers.searchExpressions(t2, e2.ks, a2), a2.k && t2.addDynamicProperty(a2), a2;
            };
          }(), TextProperty.prototype.getExpressionValue = function(t, e) {
            var r = this.calculateExpression(e);
            if (t.t !== r) {
              var i2 = {};
              return this.copyData(i2, t), i2.t = r.toString(), i2.__complete = false, i2;
            }
            return t;
          }, TextProperty.prototype.searchProperty = function() {
            var t = this.searchKeyframes(), e = this.searchExpressions();
            return this.kf = t || e, this.kf;
          }, TextProperty.prototype.searchExpressions = function() {
            if (this.data.d.x)
              return this.calculateExpression = ExpressionManager.initiateExpression.bind(this)(this.elem, this.data.d, this), this.addEffect(this.getExpressionValue.bind(this)), true;
          };
          var ShapeExpressionInterface = /* @__PURE__ */ function() {
            function t(t2, f, m) {
              var c, d = [], u = t2 ? t2.length : 0;
              for (c = 0; c < u; c += 1)
                "gr" == t2[c].ty ? d.push(e(t2[c], f[c], m)) : "fl" == t2[c].ty ? d.push(r(t2[c], f[c], m)) : "st" == t2[c].ty ? d.push(i2(t2[c], f[c], m)) : "tm" == t2[c].ty ? d.push(s(t2[c], f[c], m)) : "tr" == t2[c].ty || ("el" == t2[c].ty ? d.push(a(t2[c], f[c], m)) : "sr" == t2[c].ty ? d.push(n(t2[c], f[c], m)) : "sh" == t2[c].ty ? d.push(p(t2[c], f[c], m)) : "rc" == t2[c].ty ? d.push(o(t2[c], f[c], m)) : "rd" == t2[c].ty ? d.push(h(t2[c], f[c], m)) : "rp" == t2[c].ty && d.push(l(t2[c], f[c], m)));
              return d;
            }
            function e(e2, r2, i3) {
              var s2 = function(t2) {
                switch (t2) {
                  case "ADBE Vectors Group":
                  case "Contents":
                  case 2:
                    return s2.content;
                  default:
                    return s2.transform;
                }
              };
              s2.propertyGroup = function(t2) {
                return 1 === t2 ? s2 : i3(t2 - 1);
              };
              var a2 = function(e3, r3, i4) {
                var s3, a3 = function(t2) {
                  for (var e4 = 0, r4 = s3.length; e4 < r4; ) {
                    if (s3[e4]._name === t2 || s3[e4].mn === t2 || s3[e4].propertyIndex === t2 || s3[e4].ix === t2 || s3[e4].ind === t2)
                      return s3[e4];
                    e4 += 1;
                  }
                  if ("number" == typeof t2)
                    return s3[t2 - 1];
                };
                return a3.propertyGroup = function(t2) {
                  return 1 === t2 ? a3 : i4(t2 - 1);
                }, s3 = t(e3.it, r3.it, a3.propertyGroup), a3.numProperties = s3.length, a3.propertyIndex = e3.cix, a3._name = e3.nm, a3;
              }(e2, r2, s2.propertyGroup), n2 = function(t2, e3, r3) {
                function i4(t3) {
                  return 1 == t3 ? s3 : r3(--t3);
                }
                e3.transform.mProps.o.setGroupProperty(i4), e3.transform.mProps.p.setGroupProperty(i4), e3.transform.mProps.a.setGroupProperty(i4), e3.transform.mProps.s.setGroupProperty(i4), e3.transform.mProps.r.setGroupProperty(i4), e3.transform.mProps.sk && (e3.transform.mProps.sk.setGroupProperty(i4), e3.transform.mProps.sa.setGroupProperty(i4));
                function s3(e4) {
                  return t2.a.ix === e4 || "Anchor Point" === e4 ? s3.anchorPoint : t2.o.ix === e4 || "Opacity" === e4 ? s3.opacity : t2.p.ix === e4 || "Position" === e4 ? s3.position : t2.r.ix === e4 || "Rotation" === e4 || "ADBE Vector Rotation" === e4 ? s3.rotation : t2.s.ix === e4 || "Scale" === e4 ? s3.scale : t2.sk && t2.sk.ix === e4 || "Skew" === e4 ? s3.skew : t2.sa && t2.sa.ix === e4 || "Skew Axis" === e4 ? s3.skewAxis : void 0;
                }
                return e3.transform.op.setGroupProperty(i4), Object.defineProperties(s3, { opacity: { get: ExpressionPropertyInterface(e3.transform.mProps.o) }, position: { get: ExpressionPropertyInterface(e3.transform.mProps.p) }, anchorPoint: { get: ExpressionPropertyInterface(e3.transform.mProps.a) }, scale: { get: ExpressionPropertyInterface(e3.transform.mProps.s) }, rotation: { get: ExpressionPropertyInterface(e3.transform.mProps.r) }, skew: { get: ExpressionPropertyInterface(e3.transform.mProps.sk) }, skewAxis: { get: ExpressionPropertyInterface(e3.transform.mProps.sa) }, _name: { value: t2.nm } }), s3.ty = "tr", s3.mn = t2.mn, s3.propertyGroup = r3, s3;
              }(e2.it[e2.it.length - 1], r2.it[r2.it.length - 1], s2.propertyGroup);
              return s2.content = a2, s2.transform = n2, Object.defineProperty(s2, "_name", { get: function() {
                return e2.nm;
              } }), s2.numProperties = e2.np, s2.propertyIndex = e2.ix, s2.nm = e2.nm, s2.mn = e2.mn, s2;
            }
            function r(t2, e2, r2) {
              function i3(t3) {
                return "Color" === t3 || "color" === t3 ? i3.color : "Opacity" === t3 || "opacity" === t3 ? i3.opacity : void 0;
              }
              return Object.defineProperties(i3, { color: { get: ExpressionPropertyInterface(e2.c) }, opacity: { get: ExpressionPropertyInterface(e2.o) }, _name: { value: t2.nm }, mn: { value: t2.mn } }), e2.c.setGroupProperty(r2), e2.o.setGroupProperty(r2), i3;
            }
            function i2(t2, e2, r2) {
              function i3(t3) {
                return 1 === t3 ? ob : r2(t3 - 1);
              }
              function s2(t3) {
                return 1 === t3 ? h2 : i3(t3 - 1);
              }
              function a2(r3) {
                Object.defineProperty(h2, t2.d[r3].nm, { get: ExpressionPropertyInterface(e2.d.dataProps[r3].p) });
              }
              var n2, o2 = t2.d ? t2.d.length : 0, h2 = {};
              for (n2 = 0; n2 < o2; n2 += 1)
                a2(n2), e2.d.dataProps[n2].p.setGroupProperty(s2);
              function l2(t3) {
                return "Color" === t3 || "color" === t3 ? l2.color : "Opacity" === t3 || "opacity" === t3 ? l2.opacity : "Stroke Width" === t3 || "stroke width" === t3 ? l2.strokeWidth : void 0;
              }
              return Object.defineProperties(l2, { color: { get: ExpressionPropertyInterface(e2.c) }, opacity: { get: ExpressionPropertyInterface(e2.o) }, strokeWidth: { get: ExpressionPropertyInterface(e2.w) }, dash: { get: function() {
                return h2;
              } }, _name: { value: t2.nm }, mn: { value: t2.mn } }), e2.c.setGroupProperty(i3), e2.o.setGroupProperty(i3), e2.w.setGroupProperty(i3), l2;
            }
            function s(t2, e2, r2) {
              function i3(t3) {
                return 1 == t3 ? s2 : r2(--t3);
              }
              function s2(e3) {
                return e3 === t2.e.ix || "End" === e3 || "end" === e3 ? s2.end : e3 === t2.s.ix ? s2.start : e3 === t2.o.ix ? s2.offset : void 0;
              }
              return s2.propertyIndex = t2.ix, e2.s.setGroupProperty(i3), e2.e.setGroupProperty(i3), e2.o.setGroupProperty(i3), s2.propertyIndex = t2.ix, s2.propertyGroup = r2, Object.defineProperties(s2, { start: { get: ExpressionPropertyInterface(e2.s) }, end: { get: ExpressionPropertyInterface(e2.e) }, offset: { get: ExpressionPropertyInterface(e2.o) }, _name: { value: t2.nm } }), s2.mn = t2.mn, s2;
            }
            function a(t2, e2, r2) {
              function i3(t3) {
                return 1 == t3 ? a2 : r2(--t3);
              }
              a2.propertyIndex = t2.ix;
              var s2 = "tm" === e2.sh.ty ? e2.sh.prop : e2.sh;
              function a2(e3) {
                return t2.p.ix === e3 ? a2.position : t2.s.ix === e3 ? a2.size : void 0;
              }
              return s2.s.setGroupProperty(i3), s2.p.setGroupProperty(i3), Object.defineProperties(a2, { size: { get: ExpressionPropertyInterface(s2.s) }, position: { get: ExpressionPropertyInterface(s2.p) }, _name: { value: t2.nm } }), a2.mn = t2.mn, a2;
            }
            function n(t2, e2, r2) {
              function i3(t3) {
                return 1 == t3 ? a2 : r2(--t3);
              }
              var s2 = "tm" === e2.sh.ty ? e2.sh.prop : e2.sh;
              function a2(e3) {
                return t2.p.ix === e3 ? a2.position : t2.r.ix === e3 ? a2.rotation : t2.pt.ix === e3 ? a2.points : t2.or.ix === e3 || "ADBE Vector Star Outer Radius" === e3 ? a2.outerRadius : t2.os.ix === e3 ? a2.outerRoundness : !t2.ir || t2.ir.ix !== e3 && "ADBE Vector Star Inner Radius" !== e3 ? t2.is && t2.is.ix === e3 ? a2.innerRoundness : void 0 : a2.innerRadius;
              }
              return a2.propertyIndex = t2.ix, s2.or.setGroupProperty(i3), s2.os.setGroupProperty(i3), s2.pt.setGroupProperty(i3), s2.p.setGroupProperty(i3), s2.r.setGroupProperty(i3), t2.ir && (s2.ir.setGroupProperty(i3), s2.is.setGroupProperty(i3)), Object.defineProperties(a2, { position: { get: ExpressionPropertyInterface(s2.p) }, rotation: { get: ExpressionPropertyInterface(s2.r) }, points: { get: ExpressionPropertyInterface(s2.pt) }, outerRadius: { get: ExpressionPropertyInterface(s2.or) }, outerRoundness: { get: ExpressionPropertyInterface(s2.os) }, innerRadius: { get: ExpressionPropertyInterface(s2.ir) }, innerRoundness: { get: ExpressionPropertyInterface(s2.is) }, _name: { value: t2.nm } }), a2.mn = t2.mn, a2;
            }
            function o(t2, e2, r2) {
              function i3(t3) {
                return 1 == t3 ? a2 : r2(--t3);
              }
              var s2 = "tm" === e2.sh.ty ? e2.sh.prop : e2.sh;
              function a2(e3) {
                return t2.p.ix === e3 ? a2.position : t2.r.ix === e3 ? a2.roundness : t2.s.ix === e3 || "Size" === e3 || "ADBE Vector Rect Size" === e3 ? a2.size : void 0;
              }
              return a2.propertyIndex = t2.ix, s2.p.setGroupProperty(i3), s2.s.setGroupProperty(i3), s2.r.setGroupProperty(i3), Object.defineProperties(a2, { position: { get: ExpressionPropertyInterface(s2.p) }, roundness: { get: ExpressionPropertyInterface(s2.r) }, size: { get: ExpressionPropertyInterface(s2.s) }, _name: { value: t2.nm } }), a2.mn = t2.mn, a2;
            }
            function h(t2, e2, r2) {
              var i3 = e2;
              function s2(e3) {
                if (t2.r.ix === e3 || "Round Corners 1" === e3)
                  return s2.radius;
              }
              return s2.propertyIndex = t2.ix, i3.rd.setGroupProperty(function(t3) {
                return 1 == t3 ? s2 : r2(--t3);
              }), Object.defineProperties(s2, { radius: { get: ExpressionPropertyInterface(i3.rd) }, _name: { value: t2.nm } }), s2.mn = t2.mn, s2;
            }
            function l(t2, e2, r2) {
              function i3(t3) {
                return 1 == t3 ? a2 : r2(--t3);
              }
              var s2 = e2;
              function a2(e3) {
                return t2.c.ix === e3 || "Copies" === e3 ? a2.copies : t2.o.ix === e3 || "Offset" === e3 ? a2.offset : void 0;
              }
              return a2.propertyIndex = t2.ix, s2.c.setGroupProperty(i3), s2.o.setGroupProperty(i3), Object.defineProperties(a2, { copies: { get: ExpressionPropertyInterface(s2.c) }, offset: { get: ExpressionPropertyInterface(s2.o) }, _name: { value: t2.nm } }), a2.mn = t2.mn, a2;
            }
            function p(t2, e2, r2) {
              var i3 = e2.sh;
              function s2(t3) {
                if ("Shape" === t3 || "shape" === t3 || "Path" === t3 || "path" === t3 || "ADBE Vector Shape" === t3 || 2 === t3)
                  return s2.path;
              }
              return i3.setGroupProperty(function(t3) {
                return 1 == t3 ? s2 : r2(--t3);
              }), Object.defineProperties(s2, { path: { get: function() {
                return i3.k && i3.getValue(), i3;
              } }, shape: { get: function() {
                return i3.k && i3.getValue(), i3;
              } }, _name: { value: t2.nm }, ix: { value: t2.ix }, propertyIndex: { value: t2.ix }, mn: { value: t2.mn } }), s2;
            }
            return function(e2, r2, i3) {
              var s2;
              function a2(t2) {
                if ("number" == typeof t2)
                  return s2[t2 - 1];
                for (var e3 = 0, r3 = s2.length; e3 < r3; ) {
                  if (s2[e3]._name === t2)
                    return s2[e3];
                  e3 += 1;
                }
              }
              return a2.propertyGroup = i3, s2 = t(e2, r2, a2), a2.numProperties = s2.length, a2;
            };
          }(), TextExpressionInterface = function(t) {
            var e;
            function r() {
            }
            return Object.defineProperty(r, "sourceText", { get: function() {
              t.textProperty.getValue();
              var r2 = t.textProperty.currentData.t;
              return void 0 !== r2 && (t.textProperty.currentData.t = void 0, (e = new String(r2)).value = r2 || new String(r2)), e;
            } }), r;
          }, LayerExpressionInterface = /* @__PURE__ */ function() {
            function t(t2, e2) {
              var r2 = new Matrix();
              if (r2.reset(), this._elem.finalTransform.mProp.applyToMatrix(r2), this._elem.hierarchy && this._elem.hierarchy.length) {
                var i3, s = this._elem.hierarchy.length;
                for (i3 = 0; i3 < s; i3 += 1)
                  this._elem.hierarchy[i3].finalTransform.mProp.applyToMatrix(r2);
                return r2.applyToPointArray(t2[0], t2[1], t2[2] || 0);
              }
              return r2.applyToPointArray(t2[0], t2[1], t2[2] || 0);
            }
            function e(t2, e2) {
              var r2 = new Matrix();
              if (r2.reset(), this._elem.finalTransform.mProp.applyToMatrix(r2), this._elem.hierarchy && this._elem.hierarchy.length) {
                var i3, s = this._elem.hierarchy.length;
                for (i3 = 0; i3 < s; i3 += 1)
                  this._elem.hierarchy[i3].finalTransform.mProp.applyToMatrix(r2);
                return r2.inversePoint(t2);
              }
              return r2.inversePoint(t2);
            }
            function r(t2) {
              var e2 = new Matrix();
              if (e2.reset(), this._elem.finalTransform.mProp.applyToMatrix(e2), this._elem.hierarchy && this._elem.hierarchy.length) {
                var r2, i3 = this._elem.hierarchy.length;
                for (r2 = 0; r2 < i3; r2 += 1)
                  this._elem.hierarchy[r2].finalTransform.mProp.applyToMatrix(e2);
                return e2.inversePoint(t2);
              }
              return e2.inversePoint(t2);
            }
            function i2() {
              return [1, 1, 1, 1];
            }
            return function(s) {
              var a;
              function n(t2) {
                switch (t2) {
                  case "ADBE Root Vectors Group":
                  case "Contents":
                  case 2:
                    return n.shapeInterface;
                  case 1:
                  case 6:
                  case "Transform":
                  case "transform":
                  case "ADBE Transform Group":
                    return a;
                  case 4:
                  case "ADBE Effect Parade":
                  case "effects":
                  case "Effects":
                    return n.effect;
                }
              }
              n.toWorld = t, n.fromWorld = e, n.toComp = t, n.fromComp = r, n.sampleImage = i2, n.sourceRectAtTime = s.sourceRectAtTime.bind(s), n._elem = s;
              var o = getDescriptor(a = TransformExpressionInterface(s.finalTransform.mProp), "anchorPoint");
              return Object.defineProperties(n, { hasParent: { get: function() {
                return s.hierarchy.length;
              } }, parent: { get: function() {
                return s.hierarchy[0].layerInterface;
              } }, rotation: getDescriptor(a, "rotation"), scale: getDescriptor(a, "scale"), position: getDescriptor(a, "position"), opacity: getDescriptor(a, "opacity"), anchorPoint: o, anchor_point: o, transform: { get: function() {
                return a;
              } }, active: { get: function() {
                return s.isInRange;
              } } }), n.startTime = s.data.st, n.index = s.data.ind, n.source = s.data.refId, n.height = 0 === s.data.ty ? s.data.h : 100, n.width = 0 === s.data.ty ? s.data.w : 100, n.inPoint = s.data.ip / s.comp.globalData.frameRate, n.outPoint = s.data.op / s.comp.globalData.frameRate, n._name = s.data.nm, n.registerMaskInterface = function(t2) {
                n.mask = new MaskManagerInterface(t2, s);
              }, n.registerEffectsInterface = function(t2) {
                n.effect = t2;
              }, n;
            };
          }(), CompExpressionInterface = function(t) {
            function e(e2) {
              for (var r = 0, i2 = t.layers.length; r < i2; ) {
                if (t.layers[r].nm === e2 || t.layers[r].ind === e2)
                  return t.elements[r].layerInterface;
                r += 1;
              }
              return null;
            }
            return Object.defineProperty(e, "_name", { value: t.data.nm }), e.layer = e, e.pixelAspect = 1, e.height = t.data.h || t.globalData.compSize.h, e.width = t.data.w || t.globalData.compSize.w, e.pixelAspect = 1, e.frameDuration = 1 / t.globalData.frameRate, e.displayStartTime = 0, e.numLayers = t.layers.length, e;
          }, TransformExpressionInterface = function(t) {
            function e(t2) {
              switch (t2) {
                case "scale":
                case "Scale":
                case "ADBE Scale":
                case 6:
                  return e.scale;
                case "rotation":
                case "Rotation":
                case "ADBE Rotation":
                case "ADBE Rotate Z":
                case 10:
                  return e.rotation;
                case "ADBE Rotate X":
                  return e.xRotation;
                case "ADBE Rotate Y":
                  return e.yRotation;
                case "position":
                case "Position":
                case "ADBE Position":
                case 2:
                  return e.position;
                case "ADBE Position_0":
                  return e.xPosition;
                case "ADBE Position_1":
                  return e.yPosition;
                case "ADBE Position_2":
                  return e.zPosition;
                case "anchorPoint":
                case "AnchorPoint":
                case "Anchor Point":
                case "ADBE AnchorPoint":
                case 1:
                  return e.anchorPoint;
                case "opacity":
                case "Opacity":
                case 11:
                  return e.opacity;
              }
            }
            if (Object.defineProperty(e, "rotation", { get: ExpressionPropertyInterface(t.r || t.rz) }), Object.defineProperty(e, "zRotation", { get: ExpressionPropertyInterface(t.rz || t.r) }), Object.defineProperty(e, "xRotation", { get: ExpressionPropertyInterface(t.rx) }), Object.defineProperty(e, "yRotation", { get: ExpressionPropertyInterface(t.ry) }), Object.defineProperty(e, "scale", { get: ExpressionPropertyInterface(t.s) }), t.p)
              var r = ExpressionPropertyInterface(t.p);
            return Object.defineProperty(e, "position", { get: function() {
              return t.p ? r() : [t.px.v, t.py.v, t.pz ? t.pz.v : 0];
            } }), Object.defineProperty(e, "xPosition", { get: ExpressionPropertyInterface(t.px) }), Object.defineProperty(e, "yPosition", { get: ExpressionPropertyInterface(t.py) }), Object.defineProperty(e, "zPosition", { get: ExpressionPropertyInterface(t.pz) }), Object.defineProperty(e, "anchorPoint", { get: ExpressionPropertyInterface(t.a) }), Object.defineProperty(e, "opacity", { get: ExpressionPropertyInterface(t.o) }), Object.defineProperty(e, "skew", { get: ExpressionPropertyInterface(t.sk) }), Object.defineProperty(e, "skewAxis", { get: ExpressionPropertyInterface(t.sa) }), Object.defineProperty(e, "orientation", { get: ExpressionPropertyInterface(t.or) }), e;
          }, ProjectInterface = /* @__PURE__ */ function() {
            function t(t2) {
              this.compositions.push(t2);
            }
            return function() {
              function e(t2) {
                for (var e2 = 0, r = this.compositions.length; e2 < r; ) {
                  if (this.compositions[e2].data && this.compositions[e2].data.nm === t2)
                    return this.compositions[e2].prepareFrame && this.compositions[e2].data.xt && this.compositions[e2].prepareFrame(this.currentFrame), this.compositions[e2].compInterface;
                  e2 += 1;
                }
              }
              return e.compositions = [], e.currentFrame = 0, e.registerComposition = t, e;
            };
          }(), EffectsExpressionInterface = /* @__PURE__ */ function() {
            function t(r, i2, s, a) {
              var n, o = [], h = r.ef.length;
              for (n = 0; n < h; n += 1)
                5 === r.ef[n].ty ? o.push(t(r.ef[n], i2.effectElements[n], i2.effectElements[n].propertyGroup, a)) : o.push(e(i2.effectElements[n], r.ef[n].ty, a, l));
              function l(t2) {
                return 1 === t2 ? p : s(t2 - 1);
              }
              var p = function(t2) {
                for (var e2 = r.ef, i3 = 0, s2 = e2.length; i3 < s2; ) {
                  if (t2 === e2[i3].nm || t2 === e2[i3].mn || t2 === e2[i3].ix)
                    return 5 === e2[i3].ty ? o[i3] : o[i3]();
                  i3 += 1;
                }
                return o[0]();
              };
              return p.propertyGroup = l, "ADBE Color Control" === r.mn && Object.defineProperty(p, "color", { get: function() {
                return o[0]();
              } }), Object.defineProperty(p, "numProperties", { get: function() {
                return r.np;
              } }), p.active = p.enabled = 0 !== r.en, p;
            }
            function e(t2, e2, r, i2) {
              var s = ExpressionPropertyInterface(t2.p);
              return t2.p.setGroupProperty && t2.p.setGroupProperty(i2), function() {
                return 10 === e2 ? r.comp.compInterface(t2.p.v) : s();
              };
            }
            return { createEffectsInterface: function(e2, r) {
              if (e2.effectsManager) {
                var i2, s = [], a = e2.data.ef, n = e2.effectsManager.effectElements.length;
                for (i2 = 0; i2 < n; i2 += 1)
                  s.push(t(a[i2], e2.effectsManager.effectElements[i2], r, e2));
                return function(t2) {
                  for (var r2 = e2.data.ef || [], i3 = 0, a2 = r2.length; i3 < a2; ) {
                    if (t2 === r2[i3].nm || t2 === r2[i3].mn || t2 === r2[i3].ix)
                      return s[i3];
                    i3 += 1;
                  }
                };
              }
            } };
          }(), MaskManagerInterface = function() {
            function t(t2, e) {
              this._mask = t2, this._data = e;
            }
            Object.defineProperty(t.prototype, "maskPath", { get: function() {
              return this._mask.prop.k && this._mask.prop.getValue(), this._mask.prop;
            } }), Object.defineProperty(t.prototype, "maskOpacity", { get: function() {
              return this._mask.op.k && this._mask.op.getValue(), 100 * this._mask.op.v;
            } });
            return function(e, r) {
              var i2, s = createSizedArray(e.viewData.length), a = e.viewData.length;
              for (i2 = 0; i2 < a; i2 += 1)
                s[i2] = new t(e.viewData[i2], e.masksProperties[i2]);
              return function(t2) {
                for (i2 = 0; i2 < a; ) {
                  if (e.masksProperties[i2].nm === t2)
                    return s[i2];
                  i2 += 1;
                }
              };
            };
          }(), ExpressionPropertyInterface = /* @__PURE__ */ function() {
            var t = { pv: 0, v: 0, mult: 1 }, e = { pv: [0, 0, 0], v: [0, 0, 0], mult: 1 };
            function r(t2, e2, r2) {
              Object.defineProperty(t2, "velocity", { get: function() {
                return e2.getVelocityAtTime(e2.comp.currentFrame);
              } }), t2.numKeys = e2.keyframes ? e2.keyframes.length : 0, t2.key = function(i3) {
                if (t2.numKeys) {
                  var s = "";
                  s = "s" in e2.keyframes[i3 - 1] ? e2.keyframes[i3 - 1].s : "e" in e2.keyframes[i3 - 2] ? e2.keyframes[i3 - 2].e : e2.keyframes[i3 - 2].s;
                  var a = "unidimensional" === r2 ? new Number(s) : Object.assign({}, s);
                  return a.time = e2.keyframes[i3 - 1].t / e2.elem.comp.globalData.frameRate, a;
                }
                return 0;
              }, t2.valueAtTime = e2.getValueAtTime, t2.speedAtTime = e2.getSpeedAtTime, t2.velocityAtTime = e2.getVelocityAtTime, t2.propertyGroup = e2.propertyGroup;
            }
            function i2() {
              return t;
            }
            return function(s) {
              return s ? "unidimensional" === s.propType ? function(e2) {
                e2 && "pv" in e2 || (e2 = t);
                var i3 = 1 / e2.mult, s2 = e2.pv * i3, a = new Number(s2);
                return a.value = s2, r(a, e2, "unidimensional"), function() {
                  return e2.k && e2.getValue(), s2 = e2.v * i3, a.value !== s2 && ((a = new Number(s2)).value = s2, r(a, e2, "unidimensional")), a;
                };
              }(s) : function(t2) {
                t2 && "pv" in t2 || (t2 = e);
                var i3 = 1 / t2.mult, s2 = t2.pv.length, a = createTypedArray("float32", s2), n = createTypedArray("float32", s2);
                return a.value = n, r(a, t2, "multidimensional"), function() {
                  t2.k && t2.getValue();
                  for (var e2 = 0; e2 < s2; e2 += 1)
                    a[e2] = n[e2] = t2.v[e2] * i3;
                  return a;
                };
              }(s) : i2;
            };
          }(), TextExpressionSelectorProp, propertyGetTextProp;
          function SliderEffect(t, e, r) {
            this.p = PropertyFactory.getProp(e, t.v, 0, 0, r);
          }
          function AngleEffect(t, e, r) {
            this.p = PropertyFactory.getProp(e, t.v, 0, 0, r);
          }
          function ColorEffect(t, e, r) {
            this.p = PropertyFactory.getProp(e, t.v, 1, 0, r);
          }
          function PointEffect(t, e, r) {
            this.p = PropertyFactory.getProp(e, t.v, 1, 0, r);
          }
          function LayerIndexEffect(t, e, r) {
            this.p = PropertyFactory.getProp(e, t.v, 0, 0, r);
          }
          function MaskIndexEffect(t, e, r) {
            this.p = PropertyFactory.getProp(e, t.v, 0, 0, r);
          }
          function CheckboxEffect(t, e, r) {
            this.p = PropertyFactory.getProp(e, t.v, 0, 0, r);
          }
          function NoValueEffect() {
            this.p = {};
          }
          function EffectsManager() {
          }
          function EffectsManager(t, e) {
            var r = t.ef || [];
            this.effectElements = [];
            var i2, s, a = r.length;
            for (i2 = 0; i2 < a; i2++)
              s = new GroupEffect(r[i2], e), this.effectElements.push(s);
          }
          function GroupEffect(t, e) {
            this.init(t, e);
          }
          TextExpressionSelectorProp = /* @__PURE__ */ function() {
            function t(t2, e) {
              return this.textIndex = t2 + 1, this.textTotal = e, this.v = this.getValue() * this.mult, this.v;
            }
            return function(e, r) {
              this.pv = 1, this.comp = e.comp, this.elem = e, this.mult = 0.01, this.propType = "textSelector", this.textTotal = r.totalChars, this.selectorValue = 100, this.lastValue = [1, 1, 1], this.k = true, this.x = true, this.getValue = ExpressionManager.initiateExpression.bind(this)(e, r, this), this.getMult = t, this.getVelocityAtTime = expressionHelpers.getVelocityAtTime, this.kf ? this.getValueAtTime = expressionHelpers.getValueAtTime.bind(this) : this.getValueAtTime = expressionHelpers.getStaticValueAtTime.bind(this), this.setGroupProperty = expressionHelpers.setGroupProperty;
            };
          }(), propertyGetTextProp = TextSelectorProp.getTextSelectorProp, TextSelectorProp.getTextSelectorProp = function(t, e, r) {
            return 1 === e.t ? new TextExpressionSelectorProp(t, e, r) : propertyGetTextProp(t, e, r);
          }, extendPrototype([DynamicPropertyContainer], GroupEffect), GroupEffect.prototype.getValue = GroupEffect.prototype.iterateDynamicProperties, GroupEffect.prototype.init = function(t, e) {
            this.data = t, this.effectElements = [], this.initDynamicPropertyContainer(e);
            var r, i2, s = this.data.ef.length, a = this.data.ef;
            for (r = 0; r < s; r += 1) {
              switch (i2 = null, a[r].ty) {
                case 0:
                  i2 = new SliderEffect(a[r], e, this);
                  break;
                case 1:
                  i2 = new AngleEffect(a[r], e, this);
                  break;
                case 2:
                  i2 = new ColorEffect(a[r], e, this);
                  break;
                case 3:
                  i2 = new PointEffect(a[r], e, this);
                  break;
                case 4:
                case 7:
                  i2 = new CheckboxEffect(a[r], e, this);
                  break;
                case 10:
                  i2 = new LayerIndexEffect(a[r], e, this);
                  break;
                case 11:
                  i2 = new MaskIndexEffect(a[r], e, this);
                  break;
                case 5:
                  i2 = new EffectsManager(a[r], e, this);
                  break;
                default:
                  i2 = new NoValueEffect(a[r], e, this);
              }
              i2 && this.effectElements.push(i2);
            }
          };
          var lottiejs = {}, _isFrozen = false;
          function setLocationHref(t) {
            locationHref = t;
          }
          function searchAnimations() {
            true === standalone ? animationManager.searchAnimations(animationData, standalone, renderer) : animationManager.searchAnimations();
          }
          function setSubframeRendering(t) {
            subframeEnabled = t;
          }
          function loadAnimation(t) {
            return true === standalone && (t.animationData = JSON.parse(animationData)), animationManager.loadAnimation(t);
          }
          function setQuality(t) {
            if ("string" == typeof t)
              switch (t) {
                case "high":
                  defaultCurveSegments = 200;
                  break;
                case "medium":
                  defaultCurveSegments = 50;
                  break;
                case "low":
                  defaultCurveSegments = 10;
              }
            else
              !isNaN(t) && t > 1 && (defaultCurveSegments = t);
            roundValues(!(defaultCurveSegments >= 50));
          }
          function inBrowser() {
            return void 0 !== navigator;
          }
          function installPlugin(t, e) {
            "expressions" === t && (expressionsPlugin = e);
          }
          function getFactory(t) {
            switch (t) {
              case "propertyFactory":
                return PropertyFactory;
              case "shapePropertyFactory":
                return ShapePropertyFactory;
              case "matrix":
                return Matrix;
            }
          }
          function checkReady() {
            "complete" === document.readyState && (clearInterval(readyStateCheckInterval), searchAnimations());
          }
          function getQueryVariable(t) {
            for (var e = queryString.split("&"), r = 0; r < e.length; r++) {
              var i2 = e[r].split("=");
              if (decodeURIComponent(i2[0]) == t)
                return decodeURIComponent(i2[1]);
            }
          }
          lottiejs.play = animationManager.play, lottiejs.pause = animationManager.pause, lottiejs.setLocationHref = setLocationHref, lottiejs.togglePause = animationManager.togglePause, lottiejs.setSpeed = animationManager.setSpeed, lottiejs.setDirection = animationManager.setDirection, lottiejs.stop = animationManager.stop, lottiejs.searchAnimations = searchAnimations, lottiejs.registerAnimation = animationManager.registerAnimation, lottiejs.loadAnimation = loadAnimation, lottiejs.setSubframeRendering = setSubframeRendering, lottiejs.resize = animationManager.resize, lottiejs.goToAndStop = animationManager.goToAndStop, lottiejs.destroy = animationManager.destroy, lottiejs.setQuality = setQuality, lottiejs.inBrowser = inBrowser, lottiejs.installPlugin = installPlugin, lottiejs.freeze = animationManager.freeze, lottiejs.unfreeze = animationManager.unfreeze, lottiejs.getRegisteredAnimations = animationManager.getRegisteredAnimations, lottiejs.__getFactory = getFactory, lottiejs.version = "5.5.7";
          var standalone = "", animationData = "__[ANIMATIONDATA]__", renderer = "";
          if (standalone) {
            var scripts = document.getElementsByTagName("script"), index = scripts.length - 1, myScript = scripts[index] || { src: "" }, queryString = myScript.src.replace(/^[^\?]+\??/, "");
            renderer = getQueryVariable("renderer");
          }
          var readyStateCheckInterval = setInterval(checkReady, 100);
          return lottiejs;
        });
        var _window$lottie = window.lottie, freeze = _window$lottie.freeze, unfreeze = _window$lottie.unfreeze;
      }).call(this, __webpack_require__(2)(module));
    }, function(t, e) {
      t.exports = function(t2) {
        if (!t2.webpackPolyfill) {
          var e2 = Object.create(t2);
          e2.children || (e2.children = []), Object.defineProperty(e2, "loaded", { enumerable: true, get: function() {
            return e2.l;
          } }), Object.defineProperty(e2, "id", { enumerable: true, get: function() {
            return e2.i;
          } }), Object.defineProperty(e2, "exports", { enumerable: true }), e2.webpackPolyfill = 1;
        }
        return e2;
      };
    }]));
  }
});
export default require_miniprogram_dist();
/*! Bundled license information:

lottie-miniprogram/miniprogram_dist/index.js:
  (*!
     Transformation Matrix v2.0
     (c) Epistemex 2014-2015
     www.epistemex.com
     By Ken Fyrstenberg
     Contributions by leeoniya.
     License: MIT, header required.
     *)
*/
//# sourceMappingURL=lottie-miniprogram.js.map
