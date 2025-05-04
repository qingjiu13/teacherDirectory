"use strict";
const common_vendor = require("../../common/vendor.js");
function useLottieReady(cLottieRef) {
  const isReady = common_vendor.ref(false);
  const attachHandler = () => {
    if (!cLottieRef.value)
      return;
    if (typeof cLottieRef.value.on === "function") {
      cLottieRef.value.on("dataReady", () => {
        isReady.value = true;
        common_vendor.index.__f__("log", "at components/loading-animation/useLottieReady.js:22", "Lottie 动画已加载完成");
      });
    } else if (typeof cLottieRef.value.$on === "function") {
      cLottieRef.value.$on("dataReady", () => {
        isReady.value = true;
        common_vendor.index.__f__("log", "at components/loading-animation/useLottieReady.js:29", "Lottie 动画已加载完成");
      });
    }
  };
  common_vendor.onMounted(() => {
    attachHandler();
  });
  common_vendor.watch(cLottieRef, (newVal) => {
    if (newVal) {
      attachHandler();
    }
  });
  return {
    isReady
  };
}
exports.useLottieReady = useLottieReady;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/loading-animation/useLottieReady.js.map
