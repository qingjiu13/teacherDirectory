"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      postId: null,
      post: new UTSJSONObject({
        id: null,
        userId: null,
        nickname: "",
        avatar: "",
        school: "",
        major: "",
        title: "",
        content: "",
        images: [],
        tags: [],
        createTime: "",
        viewCount: 0,
        likeCount: 0,
        commentCount: 0,
        collectCount: 0,
        shareCount: 0,
        isLiked: false,
        isCollected: false,
        isFollowed: false
      }),
      comments: [],
      commentPage: 1,
      hasMoreComments: true,
      commentContent: "",
      inputFocus: false,
      replyTarget: null,
      isLoadingComments: false
    };
  },
  onLoad(options) {
    if (options.id) {
      this.postId = options.id;
      this.loadPostDetail();
      this.loadComments();
      if (options.showComment) {
        this.inputFocus = true;
      }
    } else {
      this.loadMockData();
    }
  },
  methods: {
    /**
     * @description 加载模拟数据
     */
    loadMockData() {
      this.post = {
        id: 1,
        userId: 101,
        nickname: "研究生活小助手",
        avatar: "/static/image/default_avatar.png",
        school: "北京大学",
        major: "计算机科学",
        title: "考研复习经验分享",
        content: "今天分享一下考研复习经验，希望对大家有帮助！数学部分要注重基础，多做真题。考研复习是一场持久战，要合理规划时间，保持良好心态。英语阅读需要每天坚持，政治要理解记忆结合。",
        images: [],
        tags: ["考研", "复习经验", "时间规划"],
        createTime: "2023-06-15 14:30",
        viewCount: 256,
        likeCount: 42,
        commentCount: 8,
        collectCount: 15,
        shareCount: 3,
        isLiked: false,
        isCollected: false,
        isFollowed: false
      };
      this.comments = [
        {
          id: 101,
          nickname: "考研学子",
          avatar: "/static/image/default_avatar.png",
          content: "感谢分享，对我帮助很大！",
          createTime: "2023-06-15 15:20",
          likeCount: 5,
          isLiked: false,
          replies: [
            {
              id: 201,
              nickname: "研究生活小助手",
              content: "不客气，希望对你有帮助~",
              createTime: "2023-06-15 15:30",
              replyTo: 101,
              replyToName: "考研学子"
            }
          ],
          replyCount: 1
        },
        {
          id: 102,
          nickname: "未来研究生",
          avatar: "/static/image/default_avatar.png",
          content: "请问数学复习有什么具体建议吗？",
          createTime: "2023-06-15 16:45",
          likeCount: 3,
          isLiked: false,
          replies: [],
          replyCount: 0
        }
      ];
    },
    /**
     * @description 加载帖子详情
     */
    loadPostDetail() {
      this.loadMockData();
    },
    /**
     * @description 记录浏览量
     */
    recordView() {
      this.post.viewCount++;
    },
    /**
     * @description 加载评论
     */
    loadComments() {
      if (this.isLoadingComments)
        return null;
      this.isLoadingComments = true;
      setTimeout(() => {
        if (this.commentPage > 1) {
          this.hasMoreComments = false;
        }
        this.isLoadingComments = false;
      }, 500);
    },
    /**
     * @description 加载更多评论
     */
    loadMoreComments() {
      if (!this.hasMoreComments || this.isLoadingComments)
        return null;
      this.commentPage++;
      this.loadComments();
    },
    /**
     * @description 加载更多回复
     */
    loadMoreReplies(comment = null) {
      common_vendor.index.showToast({
        title: "已加载全部回复",
        icon: "none"
      });
    },
    /**
     * @description 预览图片
     */
    previewImage(index = null) {
      common_vendor.index.previewImage({
        urls: this.post.images,
        current: this.post.images[index]
      });
    },
    /**
     * @description 返回上一页
     */
    goBack() {
      common_vendor.index.navigateBack();
    },
    /**
     * @description 显示更多选项
     */
    showMoreOptions() {
      common_vendor.index.showActionSheet({
        itemList: ["举报", "不感兴趣", "分享"],
        success: (res) => {
          switch (res.tapIndex) {
            case 0:
              this.reportPost();
              break;
            case 1:
              this.markNotInterested();
              break;
            case 2:
              this.sharePost();
              break;
          }
        }
      });
    },
    /**
     * @description 关注/取消关注用户
     */
    toggleFollow() {
      this.post.isFollowed = !this.post.isFollowed;
      common_vendor.index.showToast({
        title: this.post.isFollowed ? "已关注" : "已取消关注",
        icon: "none"
      });
    },
    /**
     * @description 点赞帖子
     */
    likePost() {
      this.post.isLiked = !this.post.isLiked;
      this.post.likeCount += this.post.isLiked ? 1 : -1;
    },
    /**
     * @description 收藏帖子
     */
    collectPost() {
      this.post.isCollected = !this.post.isCollected;
      this.post.collectCount += this.post.isCollected ? 1 : -1;
      common_vendor.index.showToast({
        title: this.post.isCollected ? "已收藏" : "已取消收藏",
        icon: "none"
      });
    },
    /**
     * @description 分享帖子
     */
    sharePost() {
      common_vendor.index.showActionSheet({
        itemList: ["分享给好友", "分享到微信好友", "分享到微信群聊", "分享到朋友圈"],
        success: (res) => {
          this.post.shareCount++;
          common_vendor.index.showToast({
            title: "分享成功",
            icon: "success"
          });
        }
      });
    },
    /**
     * @description 举报帖子
     */
    reportPost() {
      common_vendor.index.showToast({
        title: "举报已提交",
        icon: "success"
      });
    },
    /**
     * @description 标记为不感兴趣
     */
    markNotInterested() {
      common_vendor.index.showToast({
        title: "已减少此类内容推送",
        icon: "none"
      });
      setTimeout(() => {
        common_vendor.index.navigateBack();
      }, 1500);
    },
    /**
     * @description 点赞评论
     */
    likeComment(comment = null) {
      comment.isLiked = !comment.isLiked;
      comment.likeCount += comment.isLiked ? 1 : -1;
    },
    /**
     * @description 回复评论
     */
    replyComment(comment = null) {
      this.replyTarget = {
        id: comment.id,
        nickname: comment.nickname,
        type: "comment"
      };
      this.inputFocus = true;
    },
    /**
     * @description 聚焦评论输入框
     */
    focusCommentInput() {
      this.replyTarget = null;
      this.inputFocus = true;
    },
    /**
     * @description 提交评论或回复
     */
    submitComment() {
      if (!this.commentContent.trim()) {
        return null;
      }
      const newComment = new UTSJSONObject({
        id: Date.now(),
        nickname: "当前用户",
        avatar: "/static/image/default_avatar.png",
        content: this.commentContent,
        createTime: "刚刚",
        likeCount: 0,
        isLiked: false,
        replies: [],
        replyCount: 0
      });
      if (this.replyTarget) {
        const targetComment = UTS.arrayFind(this.comments, (c) => {
          return c.id === this.replyTarget.id;
        });
        if (targetComment) {
          const newReply = new UTSJSONObject({
            id: Date.now(),
            nickname: "当前用户",
            content: this.commentContent,
            createTime: "刚刚",
            replyTo: this.replyTarget.id,
            replyToName: this.replyTarget.nickname
          });
          targetComment.replies.push(newReply);
          targetComment.replyCount++;
        }
      } else {
        this.comments.unshift(newComment);
      }
      this.commentContent = "";
      this.replyTarget = null;
      this.post.commentCount++;
      common_vendor.index.showToast({
        title: "评论成功",
        icon: "success"
      });
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: common_vendor.o((...args) => $options.showMoreOptions && $options.showMoreOptions(...args)),
    c: $data.post.avatar || "/static/image/default_avatar.png",
    d: common_vendor.t($data.post.nickname),
    e: common_vendor.t($data.post.school),
    f: common_vendor.t($data.post.major),
    g: common_vendor.t($data.post.isFollowed ? "已关注" : "关注"),
    h: $data.post.isFollowed ? 1 : "",
    i: common_vendor.o((...args) => $options.toggleFollow && $options.toggleFollow(...args)),
    j: common_vendor.t($data.post.title || "无标题"),
    k: common_vendor.t($data.post.content),
    l: $data.post.images && $data.post.images.length > 0
  }, $data.post.images && $data.post.images.length > 0 ? {
    m: common_vendor.f($data.post.images, (image, index, i0) => {
      return {
        a: image,
        b: index,
        c: common_vendor.o(($event) => $options.previewImage(index), index)
      };
    }),
    n: common_vendor.n("grid-" + ($data.post.images.length > 4 ? "multi" : $data.post.images.length))
  } : {}, {
    o: $data.post.tags && $data.post.tags.length > 0
  }, $data.post.tags && $data.post.tags.length > 0 ? {
    p: common_vendor.f($data.post.tags, (tag, index, i0) => {
      return {
        a: common_vendor.t(tag),
        b: index
      };
    })
  } : {}, {
    q: common_vendor.t($data.post.createTime),
    r: common_vendor.t($data.post.viewCount),
    s: $data.post.isLiked ? "/static/image/like_filled.svg" : "/static/image/like.svg",
    t: common_vendor.t($data.post.likeCount),
    v: common_vendor.o((...args) => $options.likePost && $options.likePost(...args)),
    w: common_assets._imports_0$1,
    x: common_vendor.t($data.post.commentCount),
    y: common_vendor.o((...args) => $options.focusCommentInput && $options.focusCommentInput(...args)),
    z: $data.post.isCollected ? "/static/image/star_filled.svg" : "/static/image/star.svg",
    A: common_vendor.t($data.post.collectCount),
    B: common_vendor.o((...args) => $options.collectPost && $options.collectPost(...args)),
    C: common_assets._imports_1,
    D: common_vendor.t($data.post.shareCount),
    E: common_vendor.o((...args) => $options.sharePost && $options.sharePost(...args)),
    F: common_vendor.t($data.comments.length),
    G: common_vendor.f($data.comments, (comment, index, i0) => {
      return common_vendor.e({
        a: comment.avatar || "/static/image/default_avatar.png",
        b: common_vendor.t(comment.nickname),
        c: common_vendor.t(comment.createTime),
        d: common_vendor.t(comment.content),
        e: comment.isLiked ? "/static/image/like_small_filled.svg" : "/static/image/like_small.svg",
        f: common_vendor.t(comment.likeCount || 0),
        g: common_vendor.o(($event) => $options.likeComment(comment), index),
        h: common_vendor.o(($event) => $options.replyComment(comment), index),
        i: comment.replies && comment.replies.length > 0
      }, comment.replies && comment.replies.length > 0 ? common_vendor.e({
        j: common_vendor.f(comment.replies, (reply, replyIndex, i1) => {
          return common_vendor.e({
            a: common_vendor.t(reply.nickname),
            b: reply.replyTo
          }, reply.replyTo ? {} : {}, {
            c: reply.replyTo
          }, reply.replyTo ? {
            d: common_vendor.t(reply.replyToName)
          } : {}, {
            e: common_vendor.t(reply.content),
            f: replyIndex
          });
        }),
        k: comment.replyCount > comment.replies.length
      }, comment.replyCount > comment.replies.length ? {
        l: common_vendor.o(($event) => $options.loadMoreReplies(comment), index)
      } : {}) : {}, {
        m: index
      });
    }),
    H: $data.hasMoreComments && $data.comments.length > 0
  }, $data.hasMoreComments && $data.comments.length > 0 ? {
    I: common_vendor.o((...args) => $options.loadMoreComments && $options.loadMoreComments(...args))
  } : {}, {
    J: $data.comments.length === 0
  }, $data.comments.length === 0 ? {} : {}, {
    K: common_vendor.o((...args) => $options.loadMoreComments && $options.loadMoreComments(...args)),
    L: $data.replyTarget ? `回复 ${$data.replyTarget.nickname}` : "说点什么...",
    M: $data.inputFocus,
    N: common_vendor.o((...args) => $options.submitComment && $options.submitComment(...args)),
    O: $data.commentContent,
    P: common_vendor.o(($event) => $data.commentContent = $event.detail.value),
    Q: $data.commentContent ? 1 : "",
    R: common_vendor.o((...args) => $options.submitComment && $options.submitComment(...args)),
    S: common_vendor.sei(_ctx.virtualHostId, "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/post/detail.js.map
