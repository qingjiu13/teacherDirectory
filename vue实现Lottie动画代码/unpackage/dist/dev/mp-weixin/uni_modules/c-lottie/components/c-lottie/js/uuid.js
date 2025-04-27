"use strict";
const uuid = (len = 32, radix = null) => {
  let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
  let uuid2 = [];
  radix = radix || chars.length;
  if (len) {
    for (let i = 0; i < len; i++)
      uuid2[i] = chars[0 | Math.random() * radix];
  } else {
    let r;
    uuid2[8] = uuid2[13] = uuid2[18] = uuid2[23] = "-";
    uuid2[14] = "4";
    for (let i = 0; i < 36; i++) {
      if (!uuid2[i]) {
        r = 0 | Math.random() * 16;
        uuid2[i] = chars[i == 19 ? r & 3 | 8 : r];
      }
    }
  }
  return uuid2.join("");
};
exports.uuid = uuid;
//# sourceMappingURL=../../../../../../.sourcemap/mp-weixin/uni_modules/c-lottie/components/c-lottie/js/uuid.js.map
