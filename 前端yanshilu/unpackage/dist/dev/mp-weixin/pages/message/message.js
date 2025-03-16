"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const TabBar = () => "../../components/tab-bar/tab-bar.js";
const _sfc_main = common_vendor.defineComponent({
  components: {
    TabBar
  },
  data() {
    return {
      searchKey: "",
      searchFriendKey: "",
      friendList: [
        new UTSJSONObject({
          id: "1",
          name: "张教授",
          avatar: "/static/image/default_avatar.png",
          lastMessage: "关于论文的修改建议已经发送给你了",
          lastMessageTime: Date.now() - 36e5,
          unreadCount: 2,
          title: "计算机科学教授"
        }),
        new UTSJSONObject({
          id: "2",
          name: "李老师",
          avatar: "/static/image/default_avatar.png",
          lastMessage: "下周一记得来参加组会",
          lastMessageTime: Date.now() - 72e5,
          unreadCount: 0,
          title: "软件工程讲师"
        }),
        new UTSJSONObject({
          id: "3",
          name: "学习群",
          avatar: "/static/image/default_avatar.png",
          lastMessage: "[有人@我] 请问这道题怎么解？",
          lastMessageTime: Date.now() - 12e4,
          unreadCount: 5,
          title: "群聊"
        }),
        new UTSJSONObject({
          id: "4",
          name: "系统通知",
          avatar: "/static/image/default_avatar.png",
          lastMessage: "您有新的课程提醒",
          lastMessageTime: Date.now() - 864e5,
          unreadCount: 0,
          title: "系统消息"
        })
      ]
    };
  },
  methods: {
    navigateToChat(friend = null) {
      common_vendor.index.navigateTo({
        url: `/pages/message/chat?id=${friend.id}&name=${friend.name}`
      });
    },
    navigateToAddFriend() {
      common_vendor.index.__f__("log", "at pages/message/message.uvue:117", "点击了添加好友按钮");
      common_vendor.index.navigateTo({
        url: "/pages/message/add",
        success: () => {
          common_vendor.index.__f__("log", "at pages/message/message.uvue:121", "成功跳转到添加好友页面");
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/message/message.uvue:124", "跳转失败:", err);
          common_vendor.index.showToast({
            title: "跳转失败，请重试",
            icon: "none"
          });
        }
      });
    },
    showAddFriendPopup() {
      this.$refs.addFriendPopup.open();
    },
    closeAddFriendPopup() {
      this.$refs.addFriendPopup.close();
      this.searchFriendKey = "";
    },
    formatTime(timestamp = null) {
      const date = new Date(timestamp);
      const now = /* @__PURE__ */ new Date();
      const diff = now - date;
      if (diff < 24 * 60 * 60 * 1e3) {
        return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
      } else if (diff < 7 * 24 * 60 * 60 * 1e3) {
        const days = ["日", "一", "二", "三", "四", "五", "六"];
        return `星期${days[date.getDay()]}`;
      } else {
        return `${date.getMonth() + 1}月${date.getDate()}日`;
      }
    }
  }
});
if (!Array) {
  const _easycom_tab_bar2 = common_vendor.resolveComponent("tab-bar");
  _easycom_tab_bar2();
}
const _easycom_tab_bar = () => "../../components/tab-bar/tab-bar.js";
if (!Math) {
  _easycom_tab_bar();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0,
    b: common_vendor.o((...args) => $options.navigateToAddFriend && $options.navigateToAddFriend(...args)),
    c: common_vendor.f($data.friendList, (friend, k0, i0) => {
      return common_vendor.e({
        a: friend.avatar || "/static/image/default_avatar.png",
        b: friend.unreadCount > 0
      }, friend.unreadCount > 0 ? {
        c: common_vendor.t(friend.unreadCount)
      } : {}, {
        d: common_vendor.t(friend.name),
        e: common_vendor.t($options.formatTime(friend.lastMessageTime)),
        f: common_vendor.t(friend.lastMessage),
        g: friend.id,
        h: common_vendor.o(($event) => $options.navigateToChat(friend), friend.id)
      });
    }),
    d: common_vendor.o((...args) => _ctx.loadMoreFriends && _ctx.loadMoreFriends(...args)),
    e: common_vendor.p({
      pageName: "message"
    }),
    f: common_vendor.sei(_ctx.virtualHostId, "view")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/message/message.js.map
