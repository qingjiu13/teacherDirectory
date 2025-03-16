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
      posts: [],
      filter: new UTSJSONObject({
        category: "专业课",
        school: "",
        major: "",
        userType: "all",
        sort: "latest"
        // 'latest', 'popular'
      }),
      currentPage: 1,
      isLoading: false,
      hasMore: true,
      isRefreshing: false
    };
  },
  onShow() {
    try {
      common_vendor.index.hideTabBar({
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/publish/publish.uvue:132", "hideTabBar失败:", err);
        }
      });
    } catch (e) {
      common_vendor.index.__f__("error", "at pages/publish/publish.uvue:136", "hideTabBar异常:", e);
    }
    this.loadPosts();
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.currentPage = 1;
    this.posts = [];
    this.loadPosts(() => {
      common_vendor.index.stopPullDownRefresh();
    });
  },
  // 上拉加载更多
  onReachBottom() {
    if (this.hasMore && !this.isLoading) {
      this.loadMorePosts();
    }
  },
  methods: {
    /**
     * @description 加载动态列表
     * @param {Function} callback - 完成后的回调函数
     */
    loadPosts(callback = null) {
      if (this.isLoading)
        return null;
      this.isLoading = true;
      new UTSJSONObject({
        page: this.currentPage,
        pageSize: 10,
        category: this.filter.category,
        school: this.filter.school,
        major: this.filter.major,
        userType: this.filter.userType,
        sort: this.filter.sort
      });
      const mockPosts = this.getMockData();
      this.posts = this.currentPage === 1 ? mockPosts : [...this.posts, ...mockPosts];
      this.hasMore = this.currentPage < 3;
      setTimeout(() => {
        this.isLoading = false;
        callback && callback();
      }, 500);
    },
    /**
     * @description 判断是否应用了筛选条件
     * @return {Boolean} 是否有筛选条件
     */
    hasFilter() {
      return this.filter.school || this.filter.major || this.filter.userType !== "all" || this.filter.sort !== "latest";
    },
    /**
     * @description 加载相关推荐内容
     */
    loadRelatedPosts() {
      common_vendor.index.showModal({
        title: "暂无匹配内容",
        content: "为您推荐相关内容",
        showCancel: false,
        success: () => {
          const tempFilter = new UTSJSONObject({
            category: this.filter.category,
            major: this.filter.major,
            school: "",
            userType: "all",
            sort: "latest"
          });
          common_vendor.index.request({
            url: "YOUR_API_URL/related-posts",
            data: tempFilter,
            method: "GET",
            success: (res) => {
              if (res.statusCode === 200 && res.data) {
                this.posts = res.data.posts || [];
                if (this.posts.length === 0) {
                  common_vendor.index.showToast({
                    title: "没有找到相关内容",
                    icon: "none"
                  });
                }
              }
            }
          });
        }
      });
    },
    /**
     * @description 加载更多动态
     */
    loadMorePosts() {
      this.currentPage++;
      this.loadPosts();
    },
    /**
     * @description 查看动态详情
     * @param {Number} postId - 动态ID
     */
    viewPostDetail(postId = null) {
      common_vendor.index.navigateTo({
        url: `/pages/post/detail?id=${postId}`
      });
    },
    /**
     * @description 关注/取消关注用户
     * @param {Object} post - 动态对象
     */
    toggleFollow(post = null) {
      const action = post.isFollowed ? "unfollow" : "follow";
      const userId = post.userId;
      common_vendor.index.request({
        url: `YOUR_API_URL/user/${action}`,
        method: "POST",
        data: new UTSJSONObject({ userId }),
        success: (res) => {
          if (res.statusCode === 200) {
            post.isFollowed = !post.isFollowed;
            common_vendor.index.showToast({
              title: post.isFollowed ? "已关注" : "已取消关注",
              icon: "none"
            });
          }
        }
      });
    },
    /**
     * @description 点赞动态
     * @param {Object} post - 动态对象
     */
    likePost(post = null) {
      const action = post.isLiked ? "unlike" : "like";
      common_vendor.index.request({
        url: `YOUR_API_URL/post/${action}`,
        method: "POST",
        data: new UTSJSONObject({ postId: post.id }),
        success: (res) => {
          if (res.statusCode === 200) {
            post.isLiked = !post.isLiked;
            post.likeCount += post.isLiked ? 1 : -1;
          }
        }
      });
    },
    /**
     * @description 评论动态
     * @param {Object} post - 动态对象
     */
    commentPost(post = null) {
      common_vendor.index.navigateTo({
        url: `/pages/post/detail?id=${post.id}&showComment=true`
      });
    },
    /**
     * @description 收藏动态
     * @param {Object} post - 动态对象
     */
    collectPost(post = null) {
      const action = post.isCollected ? "uncollect" : "collect";
      common_vendor.index.request({
        url: `YOUR_API_URL/post/${action}`,
        method: "POST",
        data: new UTSJSONObject({ postId: post.id }),
        success: (res) => {
          if (res.statusCode === 200) {
            post.isCollected = !post.isCollected;
            post.collectCount += post.isCollected ? 1 : -1;
            common_vendor.index.showToast({
              title: post.isCollected ? "已收藏" : "已取消收藏",
              icon: "none"
            });
          }
        }
      });
    },
    /**
     * @description 分享动态
     * @param {Object} post - 动态对象
     */
    sharePost(post = null) {
      common_vendor.index.showActionSheet({
        itemList: ["分享给好友", "分享到微信好友", "分享到微信群聊", "分享到朋友圈"],
        success: (res) => {
          const index = res.tapIndex;
          switch (index) {
            case 0:
              common_vendor.index.navigateTo({
                url: `/pages/share/friends?postId=${post.id}`
              });
              break;
            case 1:
            case 2:
            case 3:
              common_vendor.index.share(new UTSJSONObject({
                provider: "weixin",
                scene: index === 1 ? "WXSceneSession" : index === 2 ? "WXSceneSession" : "WXSceneTimeline",
                type: 0,
                title: post.title || "分享内容",
                summary: post.content.substring(0, 50) + (post.content.length > 50 ? "..." : ""),
                imageUrl: post.images && post.images.length > 0 ? post.images[0] : "/static/image/share_default.png",
                href: `YOUR_SHARE_URL/post/${post.id}`,
                success: function() {
                  common_vendor.index.__f__("log", "at pages/publish/publish.uvue:405", "分享成功");
                  post.shareCount++;
                },
                fail: function() {
                  common_vendor.index.__f__("log", "at pages/publish/publish.uvue:410", "分享失败");
                }
              }));
              break;
          }
        }
      });
    },
    /**
     * @description 跳转到发布编辑页面
     */
    navigateToPublishEditor() {
      common_vendor.index.navigateTo({
        url: "/pages/publish/editor"
      });
    },
    /**
     * @description 获取模拟数据
     * @return {Array} 模拟的动态数据
     */
    getMockData() {
      return [
        new UTSJSONObject({
          id: 1,
          userId: 101,
          nickname: "研究生活小助手",
          avatar: "/static/image/default_avatar.png",
          school: "北京大学",
          major: "计算机科学",
          content: "今天分享一下考研复习经验，希望对大家有帮助！数学部分要注重基础，多做真题。#考研# #复习经验#",
          viewCount: 256,
          likeCount: 42,
          commentCount: 8,
          collectCount: 15,
          shareCount: 3,
          isLiked: false,
          isCollected: false,
          isFollowed: false,
          images: []
        }),
        new UTSJSONObject({
          id: 2,
          userId: 102,
          nickname: "考研达人",
          avatar: "/static/image/default_avatar.png",
          school: "清华大学",
          major: "电子工程",
          content: "考研英语阅读理解技巧分享，掌握这些方法效率提升50%！长难句分析方法和常见词汇搭配整理。",
          viewCount: 189,
          likeCount: 36,
          commentCount: 12,
          collectCount: 20,
          shareCount: 5,
          isLiked: true,
          isCollected: false,
          isFollowed: true,
          images: []
        }),
        new UTSJSONObject({
          id: 3,
          userId: 103,
          nickname: "政治高分学姐",
          avatar: "/static/image/default_avatar.png",
          school: "复旦大学",
          major: "政治学",
          content: "考研政治复习时间规划，建议8月开始系统学习，10月开始真题训练，12月开始背诵考点。提供我整理的笔记供大家参考。",
          viewCount: 320,
          likeCount: 67,
          commentCount: 23,
          collectCount: 45,
          shareCount: 12,
          isLiked: false,
          isCollected: true,
          isFollowed: false,
          images: []
        })
      ];
    },
    selectCategory(category = null) {
      this.filter.category = category;
      this.currentPage = 1;
      this.posts = [];
      this.loadPosts();
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
  return common_vendor.e({
    a: $data.isRefreshing
  }, $data.isRefreshing ? {} : {}, {
    b: common_assets._imports_0$1,
    c: $data.filter.category === "专业课" ? 1 : "",
    d: common_vendor.o(($event) => $options.selectCategory("专业课")),
    e: $data.filter.category === "数学" ? 1 : "",
    f: common_vendor.o(($event) => $options.selectCategory("数学")),
    g: $data.filter.category === "英语" ? 1 : "",
    h: common_vendor.o(($event) => $options.selectCategory("英语")),
    i: $data.filter.category === "政治" ? 1 : "",
    j: common_vendor.o(($event) => $options.selectCategory("政治")),
    k: common_vendor.f($data.posts, (post, index, i0) => {
      return {
        a: post.avatar || "/static/image/default_avatar.png",
        b: common_vendor.t(post.nickname),
        c: common_vendor.t(post.school),
        d: common_vendor.t(post.major),
        e: common_vendor.t(post.isFollowed ? "已关注" : "关注"),
        f: post.isFollowed ? 1 : "",
        g: common_vendor.o(($event) => $options.toggleFollow(post), index),
        h: common_vendor.t(post.content),
        i: common_vendor.t(post.viewCount),
        j: post.isLiked ? "/static/image/like_filled.svg" : "/static/image/like.svg",
        k: common_vendor.t(post.likeCount),
        l: common_vendor.o(($event) => $options.likePost(post), index),
        m: common_vendor.t(post.commentCount),
        n: common_vendor.o(($event) => $options.commentPost(post), index),
        o: post.isCollected ? "/static/image/star_filled.svg" : "/static/image/star.svg",
        p: common_vendor.t(post.collectCount),
        q: common_vendor.o(($event) => $options.collectPost(post), index),
        r: common_vendor.t(post.shareCount),
        s: common_vendor.o(($event) => $options.sharePost(post), index),
        t: index,
        v: common_vendor.o(($event) => $options.viewPostDetail(post.id), index)
      };
    }),
    l: common_assets._imports_0$2,
    m: common_assets._imports_1,
    n: $data.isLoading && $data.posts.length > 0
  }, $data.isLoading && $data.posts.length > 0 ? {} : {}, {
    o: $data.posts.length === 0 && !$data.isLoading
  }, $data.posts.length === 0 && !$data.isLoading ? {} : {}, {
    p: common_vendor.o((...args) => $options.navigateToPublishEditor && $options.navigateToPublishEditor(...args)),
    q: common_vendor.p({
      pageName: "publish"
    }),
    r: common_vendor.sei(_ctx.virtualHostId, "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/publish/publish.js.map
