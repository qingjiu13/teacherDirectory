"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_cLottie_components_cLottie_js_uuid = require("./js/uuid.js");
const _sfc_main = common_vendor.defineComponent({
  props: {
    canvasId: {
      type: String
    },
    width: {
      type: String,
      default: "750rpx"
    },
    height: {
      type: String,
      default: "750rpx"
    },
    src: {
      type: String
    },
    data: {
      type: String
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    loop: {
      type: Boolean,
      default: true
    },
    renderer: {
      type: String,
      default: "canvas"
    },
    isOnChange: {
      type: Boolean,
      default: false
    }
  },
  emits: ["Complete", "LoopComplete", "EnterFrame", "SegmentStart", "dataReady", "dataFailed"],
  data() {
    return {
      fun: new UTSJSONObject({})
    };
  },
  computed: {
    myCanvasId() {
      if (!this.canvasId) {
        return "c" + uni_modules_cLottie_components_cLottie_js_uuid.uuid(18);
      } else {
        return this.canvasId;
      }
    },
    lottieData() {
      return new UTSJSONObject({
        myCanvasId: this.myCanvasId,
        width: this.width,
        height: this.height,
        src: this.src,
        data: this.data,
        autoPlay: this.autoPlay,
        loop: this.loop,
        renderer: this.renderer,
        isOnChange: this.isOnChange
      });
    }
  },
  watch: {
    lottieData() {
      this.render();
    }
  },
  methods: {
    call(name = null, args = null) {
      this.fun = new UTSJSONObject({ name, args });
      this.callPlayer(this.fun);
    },
    getContext() {
      return new Promise((resolve) => {
        const pixelRatio = common_vendor.index.getWindowInfo().pixelRatio;
        common_vendor.index.createSelectorQuery().in(this).select(`#${this.myCanvasId}`).fields(new UTSJSONObject({
          node: true,
          size: true
        })).exec((res) => {
          const _a = res[0], width = _a.width, height = _a.height;
          const canvas = res[0].node;
          resolve({
            canvas,
            width,
            height,
            pixelRatio
          });
        });
      });
    },
    render() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (this.player) {
          this.call("destroy", this.player);
        }
        let _a = yield this.getContext(), canvas = _a.canvas, width = _a.width, height = _a.height, pixelRatio = _a.pixelRatio;
        this.myCanvas = canvas;
        this.context = canvas.getContext("2d");
        this.context.scale(pixelRatio, pixelRatio);
        canvas.width = width * pixelRatio;
        canvas.height = height * pixelRatio;
        common_vendor.lottie.setup(this.myCanvas);
        this.player = common_vendor.lottie.loadAnimation({
          loop: this.loop,
          autoplay: this.autoPlay,
          // 动画json的本地数据
          animationData: this.data,
          //远程动画。一定要把json格式的文件放到服务器中，并且注意域名是合法的
          path: this.src,
          rendererSettings: {
            context: this.context
          }
        });
        this.player.addEventListener("data_ready", (val = null) => {
          this.$emit("dataReady", val);
        });
        this.player.addEventListener("data_failed", (val = null) => {
          this.$emit("dataFailed", val);
        });
        this.player.onComplete = (val = null) => {
          this.$emit("Complete", val);
        };
        this.player.onLoopComplete = (val = null) => {
          this.$emit("LoopComplete", val);
        };
        if (this.isOnChange) {
          this.player.onEnterFrame = (val = null) => {
            this.$emit("EnterFrame", val);
          };
        }
        this.player.onSegmentStart = (val = null) => {
          this.$emit("SegmentStart", val);
        };
      });
    },
    callPlayer(val = null) {
      if (!val.name)
        return null;
      let name = val.name, args = val.args;
      if (Array.isArray(args)) {
        this.player[name](...args);
      } else {
        this.player[name](args);
      }
    }
  },
  mounted() {
    this.render();
  },
  beforeDestroy() {
    this.call("destroy");
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.sei($options.myCanvasId, "canvas"),
    b: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
    c: $props.width,
    d: $props.height
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-bb75a63f"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/c-lottie/components/c-lottie/c-lottie.js.map
