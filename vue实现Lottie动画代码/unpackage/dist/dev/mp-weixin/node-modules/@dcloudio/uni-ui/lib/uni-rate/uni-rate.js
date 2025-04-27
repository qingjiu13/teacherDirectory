"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const _sfc_main = common_vendor.defineComponent({
  name: "UniRate",
  props: {
    isFill: new UTSJSONObject({
      // 星星的类型，是否镂空
      type: [Boolean, String],
      default: true
    }),
    color: new UTSJSONObject({
      // 星星未选中的颜色
      type: String,
      default: "#ececec"
    }),
    activeColor: new UTSJSONObject({
      // 星星选中状态颜色
      type: String,
      default: "#ffca3e"
    }),
    disabledColor: new UTSJSONObject({
      // 星星禁用状态颜色
      type: String,
      default: "#c0c0c0"
    }),
    size: new UTSJSONObject({
      // 星星的大小
      type: [Number, String],
      default: 24
    }),
    value: new UTSJSONObject({
      // 当前评分
      type: [Number, String],
      default: 0
    }),
    modelValue: new UTSJSONObject({
      // 当前评分
      type: [Number, String],
      default: 0
    }),
    max: new UTSJSONObject({
      // 最大评分
      type: [Number, String],
      default: 5
    }),
    margin: new UTSJSONObject({
      // 星星的间距
      type: [Number, String],
      default: 0
    }),
    disabled: new UTSJSONObject({
      // 是否可点击
      type: [Boolean, String],
      default: false
    }),
    readonly: new UTSJSONObject({
      // 是否只读
      type: [Boolean, String],
      default: false
    }),
    allowHalf: new UTSJSONObject({
      // 是否显示半星
      type: [Boolean, String],
      default: false
    }),
    touchable: new UTSJSONObject({
      // 是否支持滑动手势
      type: [Boolean, String],
      default: true
    })
  },
  data() {
    return {
      valueSync: "",
      userMouseFristMove: true,
      userRated: false,
      userLastRate: 1
    };
  },
  watch: {
    value(newVal = null) {
      this.valueSync = Number(newVal);
    },
    modelValue(newVal = null) {
      this.valueSync = Number(newVal);
    }
  },
  computed: new UTSJSONObject({
    stars() {
      const value = this.valueSync ? this.valueSync : 0;
      const starList = [];
      const floorValue = Math.floor(value);
      const ceilValue = Math.ceil(value);
      for (let i = 0; i < this.max; i++) {
        if (floorValue > i) {
          starList.push({
            activeWitch: "100%"
          });
        } else if (ceilValue - 1 === i) {
          starList.push({
            activeWitch: (value - floorValue) * 100 + "%"
          });
        } else {
          starList.push({
            activeWitch: "0"
          });
        }
      }
      return starList;
    },
    marginNumber() {
      return Number(this.margin);
    }
  }),
  created() {
    this.valueSync = Number(this.value || this.modelValue);
    this._rateBoxLeft = 0;
    this._oldValue = null;
  },
  mounted() {
    setTimeout(() => {
      this._getSize();
    }, 100);
  },
  methods: new UTSJSONObject({
    touchstart(e = null) {
      if (this.readonly || this.disabled)
        return null;
      const _a = e.changedTouches[0], clientX = _a.clientX, screenX = _a.screenX;
      this._getRateCount(clientX || screenX);
    },
    touchmove(e = null) {
      if (this.readonly || this.disabled || !this.touchable)
        return null;
      const _a = e.changedTouches[0], clientX = _a.clientX, screenX = _a.screenX;
      this._getRateCount(clientX || screenX);
    },
    /**
     * 兼容 PC @tian
     */
    mousedown(e = null) {
    },
    mousemove(e = null) {
    },
    mouseleave(e = null) {
    },
    /**
     * 获取星星个数
     */
    _getRateCount(clientX = null) {
      this._getSize();
      const size = Number(this.size);
      if (isNaN(size)) {
        return new Error("size 属性只能设置为数字");
      }
      const rateMoveRange = clientX - this._rateBoxLeft;
      let index = parseInt(rateMoveRange / (size + this.marginNumber));
      index = index < 0 ? 0 : index;
      index = index > this.max ? this.max : index;
      const range = parseInt(rateMoveRange - (size + this.marginNumber) * index);
      let value = 0;
      if (this._oldValue === index && !this.PC)
        return null;
      this._oldValue = index;
      if (this.allowHalf) {
        if (range > size / 2) {
          value = index + 1;
        } else {
          value = index + 0.5;
        }
      } else {
        value = index + 1;
      }
      value = Math.max(0.5, Math.min(value, this.max));
      this.valueSync = value;
      this._onChange();
    },
    /**
     * 触发动态修改
     */
    _onChange() {
      this.$emit("input", this.valueSync);
      this.$emit("update:modelValue", this.valueSync);
      this.$emit("change", new UTSJSONObject({
        value: this.valueSync
      }));
    },
    /**
     * 获取星星距离屏幕左侧距离
     */
    _getSize() {
      common_vendor.index.createSelectorQuery().in(this).select(".uni-rate").boundingClientRect().exec((ret) => {
        if (ret) {
          this._rateBoxLeft = ret[0].left;
        }
      });
    }
  })
});
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  _component_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($options.stars, (star, index, i0) => {
      return {
        a: "6ca39f24-0-" + i0,
        b: "6ca39f24-1-" + i0,
        c: star.activeWitch,
        d: index,
        e: common_vendor.o((...args) => $options.touchstart && $options.touchstart(...args), index),
        f: common_vendor.o((...args) => $options.touchmove && $options.touchmove(...args), index),
        g: common_vendor.o((...args) => $options.mousedown && $options.mousedown(...args), index),
        h: common_vendor.o((...args) => $options.mousemove && $options.mousemove(...args), index),
        i: common_vendor.o((...args) => $options.mouseleave && $options.mouseleave(...args), index)
      };
    }),
    b: common_vendor.p({
      color: $props.color,
      size: $props.size,
      type: $props.isFill ? "star-filled" : "star"
    }),
    c: common_vendor.p({
      color: $props.disabled ? $props.disabledColor : $props.activeColor,
      size: $props.size,
      type: "star-filled"
    }),
    d: $props.disabled ? 1 : "",
    e: $options.marginNumber + "px",
    f: common_vendor.sei("r0-6ca39f24", "view", "uni-rate"),
    g: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../../.sourcemap/mp-weixin/node-modules/@dcloudio/uni-ui/lib/uni-rate/uni-rate.js.map
