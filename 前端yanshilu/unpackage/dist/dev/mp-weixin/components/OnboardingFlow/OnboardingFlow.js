"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = common_vendor.defineComponent({
  props: {
    // 引导步骤配置
    steps: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 完成引导后显示的卡片数据
    cards: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 遮罩颜色
    maskColor: {
      type: String,
      default: "rgba(0,0,0,0.5)"
    },
    // 主题色
    primaryColor: {
      type: String,
      default: "#2563eb"
    },
    // 引导标识符，用于localStorage存储
    guideKey: {
      type: String,
      default: "guideCompleted"
    }
  },
  setup(props, _a) {
    var emit = _a.emit;
    const showContent = common_vendor.ref(true);
    const showGuide = common_vendor.ref(false);
    const showCards = common_vendor.ref(false);
    const showCardDetail = common_vendor.ref(false);
    const selectedCard = common_vendor.ref(new UTSJSONObject({}));
    const currentStepIndex = common_vendor.ref(0);
    const highlightStyle = common_vendor.ref(new UTSJSONObject({}));
    const guidePosition = common_vendor.ref(new UTSJSONObject({}));
    const currentStep = common_vendor.computed(() => {
      return props.steps[currentStepIndex.value] || {};
    });
    const isLastStep = common_vendor.computed(() => {
      return currentStepIndex.value === props.steps.length - 1;
    });
    function checkGuideCompleted() {
      try {
        return common_vendor.index.getStorageSync(props.guideKey) === "true";
      } catch (e) {
        common_vendor.index.__f__("error", "at components/OnboardingFlow/OnboardingFlow.uvue:124", "获取引导状态失败", e);
        return false;
      }
    }
    function initGuide() {
      if (props.steps && props.steps.length > 0) {
        if (!checkGuideCompleted()) {
          currentStepIndex.value = 0;
          showGuide.value = true;
          showCards.value = false;
          setTimeout(() => {
            updateHighlight();
          }, 300);
        } else if (props.cards && props.cards.length > 0) {
          showGuide.value = false;
          showCards.value = true;
        } else {
          showContent.value = false;
        }
      }
    }
    function updateHighlight() {
      if (!currentStep.value || !currentStep.value.target)
        return null;
      const query = common_vendor.index.createSelectorQuery();
      query.select(`#${currentStep.value.target}`).boundingClientRect((data = null) => {
        if (!data) {
          common_vendor.index.__f__("warn", "at components/OnboardingFlow/OnboardingFlow.uvue:159", `目标元素 #${currentStep.value.target} 不存在，自动跳过`);
          if (isLastStep.value) {
            completeGuide();
          } else {
            currentStepIndex.value++;
            setTimeout(() => {
              return updateHighlight();
            }, 100);
          }
          return null;
        }
        highlightStyle.value = new UTSJSONObject({
          width: `${data.width}px`,
          height: `${data.height}px`,
          left: `${data.left}px`,
          top: `${data.top}px`
        });
        const placement = currentStep.value.placement || "bottom";
        const guidePos = calculateGuidePosition(data, placement);
        guidePosition.value = new UTSJSONObject({
          left: `${guidePos.x}px`,
          top: `${guidePos.y}px`
        });
      }).exec();
    }
    function calculateGuidePosition(targetRect = null, placement = null) {
      const offset = 20;
      const viewportWidth = common_vendor.index.getSystemInfoSync().windowWidth;
      const viewportHeight = common_vendor.index.getSystemInfoSync().windowHeight;
      const contentWidth = 300;
      const contentHeight = 150;
      let position = new UTSJSONObject({ x: 0, y: 0 });
      switch (placement) {
        case "bottom":
          position = new UTSJSONObject({
            x: targetRect.left + targetRect.width / 2 - contentWidth / 2,
            y: targetRect.top + targetRect.height + offset
          });
          break;
        case "top":
          position = new UTSJSONObject({
            x: targetRect.left + targetRect.width / 2 - contentWidth / 2,
            y: targetRect.top - contentHeight - offset
          });
          break;
        case "left":
          position = new UTSJSONObject({
            x: targetRect.left - contentWidth - offset,
            y: targetRect.top + targetRect.height / 2 - contentHeight / 2
          });
          break;
        case "right":
          position = new UTSJSONObject({
            x: targetRect.left + targetRect.width + offset,
            y: targetRect.top + targetRect.height / 2 - contentHeight / 2
          });
          break;
        default:
          position = new UTSJSONObject({
            x: targetRect.left + targetRect.width / 2 - contentWidth / 2,
            y: targetRect.top + targetRect.height + offset
          });
      }
      position.x = Math.max(10, Math.min(position.x, viewportWidth - contentWidth - 10));
      position.y = Math.max(10, Math.min(position.y, viewportHeight - contentHeight - 10));
      return position;
    }
    function nextStep() {
      if (isLastStep.value) {
        completeGuide();
      } else {
        currentStepIndex.value++;
        setTimeout(() => {
          updateHighlight();
        }, 100);
      }
    }
    function prevStep() {
      if (currentStepIndex.value > 0) {
        currentStepIndex.value--;
        setTimeout(() => {
          updateHighlight();
        }, 100);
      }
    }
    function completeGuide() {
      showGuide.value = false;
      try {
        common_vendor.index.setStorageSync(props.guideKey, "true");
      } catch (e) {
        common_vendor.index.__f__("error", "at components/OnboardingFlow/OnboardingFlow.uvue:268", "保存引导状态失败", e);
      }
      emit("complete");
      if (props.cards && props.cards.length > 0) {
        showCards.value = true;
      } else {
        showContent.value = false;
      }
    }
    function handleCardClick(card = null) {
      selectedCard.value = card;
      showCardDetail.value = true;
      emit("card-click", card);
    }
    function closeCardDetail() {
      showCardDetail.value = false;
    }
    function restartGuide() {
      try {
        common_vendor.index.removeStorageSync(props.guideKey);
      } catch (e) {
        common_vendor.index.__f__("error", "at components/OnboardingFlow/OnboardingFlow.uvue:299", "清除引导状态失败", e);
      }
      currentStepIndex.value = 0;
      showGuide.value = true;
      showCards.value = false;
      showCardDetail.value = false;
      showContent.value = true;
      setTimeout(() => {
        updateHighlight();
      }, 300);
    }
    common_vendor.onMounted(() => {
      initGuide();
    });
    return new UTSJSONObject({
      // 状态
      showContent,
      showGuide,
      showCards,
      showCardDetail,
      currentStepIndex,
      highlightStyle,
      guidePosition,
      selectedCard,
      // 计算属性
      currentStep,
      isLastStep,
      // 方法
      nextStep,
      prevStep,
      handleCardClick,
      closeCardDetail,
      restartGuide
    });
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $setup.showContent
  }, $setup.showContent ? common_vendor.e({
    b: $setup.showGuide
  }, $setup.showGuide ? common_vendor.e({
    c: common_vendor.s($setup.highlightStyle),
    d: common_vendor.t($setup.currentStep.title || ""),
    e: common_vendor.t($setup.currentStep.content),
    f: $setup.currentStepIndex > 0
  }, $setup.currentStepIndex > 0 ? {
    g: common_vendor.o((...args) => $setup.prevStep && $setup.prevStep(...args))
  } : {}, {
    h: common_vendor.t($setup.isLastStep ? "完成" : "下一步"),
    i: $props.primaryColor,
    j: common_vendor.o((...args) => $setup.nextStep && $setup.nextStep(...args)),
    k: common_vendor.s($setup.guidePosition),
    l: $props.maskColor
  }) : {}, {
    m: $setup.showCards
  }, $setup.showCards ? {
    n: common_vendor.f($props.cards, (card, index, i0) => {
      return common_vendor.e({
        a: card.icon,
        b: common_vendor.t(card.title),
        c: common_vendor.f(5, (i, k1, i1) => {
          return {
            a: i,
            b: i <= card.rating ? 1 : ""
          };
        }),
        d: common_vendor.t(card.description),
        e: card.buttonText
      }, card.buttonText ? {
        f: common_vendor.t(card.buttonText),
        g: $props.primaryColor
      } : {}, {
        h: card.id || index,
        i: common_vendor.o(($event) => $setup.handleCardClick(card), card.id || index)
      });
    })
  } : {}, {
    o: $setup.showCardDetail
  }, $setup.showCardDetail ? common_vendor.e({
    p: common_vendor.o((...args) => $setup.closeCardDetail && $setup.closeCardDetail(...args)),
    q: $setup.selectedCard.icon,
    r: common_vendor.t($setup.selectedCard.title),
    s: common_vendor.f(5, (i, k0, i0) => {
      return {
        a: i,
        b: i <= $setup.selectedCard.rating ? 1 : ""
      };
    }),
    t: common_vendor.t($setup.selectedCard.description),
    v: $setup.selectedCard.buttonText
  }, $setup.selectedCard.buttonText ? {
    w: common_vendor.t($setup.selectedCard.buttonText),
    x: $props.primaryColor
  } : {}) : {}, {
    y: common_vendor.sei(_ctx.virtualHostId, "view")
  }) : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/OnboardingFlow/OnboardingFlow.js.map
