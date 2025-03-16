"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      postTitle: "",
      postContent: "",
      selectedCategory: "专业课",
      selectedTags: [],
      images: [],
      userInfo: null,
      isDraft: false,
      draftId: null
    };
  },
  // 组件初始化
  onLoad(options) {
    if (options.draftId) {
      this.draftId = options.draftId;
      this.loadDraft(options.draftId);
    }
    this.getUserInfo();
  },
  // 页面显示
  onShow() {
    if (!this.isDraft && !this.draftId) {
      this.checkAutoSaveDraft();
    }
  },
  // 页面隐藏
  onHide() {
    this.autoSaveDraft();
  },
  methods: {
    /**
     * @description 获取用户信息
     */
    getUserInfo() {
      this.userInfo = {
        id: 100,
        nickname: "考研学生",
        avatar: "/static/image/default_avatar.png",
        school: "清华大学",
        major: "计算机科学"
      };
    },
    /**
     * @description 返回上一页
     */
    goBack() {
      if (this.postContent || this.images.length > 0) {
        common_vendor.index.showModal({
          title: "提示",
          content: "是否保存为草稿？",
          cancelText: "不保存",
          confirmText: "保存",
          success: (res) => {
            if (res.confirm) {
              this.saveAsDraft();
            } else {
              common_vendor.index.navigateBack({
                delta: 1,
                fail: () => {
                  common_vendor.index.reLaunch({
                    url: "/pages/publish/publish"
                  });
                }
              });
            }
          }
        });
      } else {
        common_vendor.index.navigateBack({
          delta: 1,
          fail: () => {
            common_vendor.index.reLaunch({
              url: "/pages/publish/publish"
            });
          }
        });
      }
    },
    /**
     * @description 显示标签选择器
     */
    showTagSelector() {
      common_vendor.index.showActionSheet({
        itemList: ["专业课", "数学", "英语", "政治", "历史", "地理", "物理", "化学", "生物"],
        success: (res) => {
          const selectedIndex = res.tapIndex;
          this.selectedCategory = ["专业课", "数学", "英语", "政治", "历史", "地理", "物理", "化学", "生物"][selectedIndex];
        }
      });
    },
    /**
     * @description 显示添加标签提示框
     */
    showTagPrompt() {
      common_vendor.index.showModal({
        title: "添加标签",
        content: "添加一个标签，方便他人查找（15字以内）",
        editable: true,
        placeholderText: "如：复习方法",
        success: (res) => {
          if (res.confirm && res.content) {
            if (res.content.length > 15) {
              common_vendor.index.showToast({
                title: "标签过长",
                icon: "none"
              });
              return null;
            }
            if (this.selectedTags.length >= 3) {
              common_vendor.index.showToast({
                title: "最多添加3个标签",
                icon: "none"
              });
              return null;
            }
            if (this.selectedTags.includes(res.content)) {
              common_vendor.index.showToast({
                title: "标签已存在",
                icon: "none"
              });
              return null;
            }
            this.selectedTags.push(res.content);
          }
        }
      });
    },
    /**
     * @description 移除标签
     * @param {Number} index - 标签索引
     */
    removeTag(index = null) {
      this.selectedTags.splice(index, 1);
    },
    /**
     * @description 选择图片
     */
    chooseImage() {
      common_vendor.index.chooseImage({
        count: 9 - this.images.length,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          this.checkImageContent(res.tempFilePaths);
        }
      });
    },
    /**
     * @description 检查图片内容(防止二维码等)
     * @param {Array} imagePaths - 图片路径数组
     */
    checkImageContent(imagePaths = null) {
      setTimeout(() => {
        this.images = [...this.images, ...imagePaths];
        if (this.images.length > 9) {
          this.images = this.images.slice(0, 9);
        }
      }, 500);
    },
    /**
     * @description 删除图片
     * @param {Number} index - 图片索引
     */
    deleteImage(index = null) {
      this.images.splice(index, 1);
    },
    /**
     * @description 保存为草稿
     */
    saveAsDraft() {
      if (!this.postContent && this.images.length === 0) {
        common_vendor.index.showToast({
          title: "请先输入内容",
          icon: "none"
        });
        return null;
      }
      new UTSJSONObject({
        id: this.draftId || null,
        title: this.postTitle,
        content: this.postContent,
        category: this.selectedCategory,
        tags: this.selectedTags,
        images: this.images,
        updateTime: (/* @__PURE__ */ new Date()).getTime()
      });
      common_vendor.index.showLoading({
        title: "保存中..."
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "草稿保存成功",
          icon: "success"
        });
        if (!this.draftId) {
          this.draftId = (/* @__PURE__ */ new Date()).getTime().toString();
        }
        setTimeout(() => {
          common_vendor.index.navigateBack({
            delta: 1,
            fail: () => {
              common_vendor.index.reLaunch({
                url: "/pages/publish/publish"
              });
            }
          });
        }, 1e3);
      }, 800);
    },
    /**
     * @description 自动保存草稿(本地)
     */
    autoSaveDraft() {
      if (this.postContent || this.images.length > 0) {
        try {
          common_vendor.index.setStorageSync("post_draft_auto", new UTSJSONObject({
            content: this.postContent,
            category: this.selectedCategory,
            tags: this.selectedTags,
            images: this.images,
            updateTime: (/* @__PURE__ */ new Date()).getTime()
          }));
        } catch (e) {
          common_vendor.index.__f__("error", "at pages/publish/editor.uvue:391", "自动保存草稿失败", e);
        }
      }
    },
    /**
     * @description 检查自动保存的草稿
     */
    checkAutoSaveDraft() {
      try {
        const autoDraft = common_vendor.index.getStorageSync("post_draft_auto");
        if (autoDraft && autoDraft.updateTime) {
          const timeAgo = Math.floor(((/* @__PURE__ */ new Date()).getTime() - autoDraft.updateTime) / 6e4);
          if (timeAgo < 60) {
            common_vendor.index.showModal({
              title: "发现未发布的内容",
              content: `您有${timeAgo}分钟前编辑的内容未发布，是否继续编辑？`,
              success: (res) => {
                if (res.confirm) {
                  this.postContent = autoDraft.content || "";
                  this.selectedCategory = autoDraft.category || "专业课";
                  this.selectedTags = autoDraft.tags || [];
                  this.images = autoDraft.images || [];
                } else {
                  common_vendor.index.removeStorageSync("post_draft_auto");
                }
              }
            });
          } else {
            common_vendor.index.removeStorageSync("post_draft_auto");
          }
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/publish/editor.uvue:427", "检查自动草稿失败", e);
      }
    },
    /**
     * @description 加载草稿内容
     * @param {String} draftId - 草稿ID
     */
    loadDraft(draftId = null) {
      setTimeout(() => {
        const mockDraft = new UTSJSONObject({
          title: "考研复习经验分享",
          content: "分享一下我的考研经验，希望对大家有所帮助...",
          category: "专业课",
          tags: ["复习方法", "时间规划"],
          images: []
        });
        this.postTitle = mockDraft.title;
        this.postContent = mockDraft.content;
        this.selectedCategory = mockDraft.category;
        this.selectedTags = mockDraft.tags;
        this.images = mockDraft.images;
        this.isDraft = true;
      }, 500);
    },
    /**
     * @description 发布帖子
     */
    publishPost() {
      if (!this.postContent) {
        common_vendor.index.showToast({
          title: "请输入内容",
          icon: "none"
        });
        return null;
      }
      common_vendor.index.showLoading({
        title: "发布中..."
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "发布成功",
          icon: "success"
        });
        common_vendor.index.removeStorageSync("post_draft_auto");
        setTimeout(() => {
          common_vendor.index.navigateBack({
            delta: 1,
            fail: () => {
              common_vendor.index.reLaunch({
                url: "/pages/publish/publish"
              });
            }
          });
        }, 1e3);
      }, 1500);
    },
    /**
     * @description 检查内容是否合规(无二维码、手机号、微信号)
     * @param {Function} callback - 检查通过后的回调
     */
    checkContent(callback = null) {
      const phoneRegex = /1[3-9]\d{9}/g;
      const wechatRegex = /(微信|wx|weixin)[: ]*([a-zA-Z0-9_-]{6,20})/gi;
      if (phoneRegex.test(this.postContent) || wechatRegex.test(this.postContent)) {
        common_vendor.index.showToast({
          title: "内容含有联系方式，请修改后重试",
          icon: "none"
        });
        return null;
      }
      common_vendor.index.request({
        url: "YOUR_API_URL/content/check",
        method: "POST",
        data: new UTSJSONObject({
          content: this.postContent
        }),
        success: (res) => {
          if (res.statusCode === 200 && res.data.valid) {
            callback && callback();
          } else {
            common_vendor.index.showToast({
              title: res.data.message || "内容不合规，请修改后重试",
              icon: "none"
            });
          }
        },
        fail: () => {
          common_vendor.index.showToast({
            title: "网络异常，请稍后再试",
            icon: "none"
          });
        }
      });
    },
    /**
     * @description 上传图片
     * @param {Function} callback - 上传完成后的回调，参数为图片URL数组
     */
    uploadImages(callback = null) {
      if (this.images.length === 0) {
        callback && callback([]);
        return null;
      }
      const uploadedUrls = [];
      let uploadCount = 0;
      common_vendor.index.showLoading({
        title: `上传图片 0/${this.images.length}`
      });
      this.images.forEach((path) => {
        common_vendor.index.uploadFile({
          url: "YOUR_API_URL/upload/image",
          filePath: path,
          name: "file",
          success: (res) => {
            uploadCount++;
            common_vendor.index.showLoading({
              title: `上传图片 ${uploadCount}/${this.images.length}`
            });
            if (res.statusCode === 200) {
              try {
                const data = UTS.JSON.parse(res.data);
                if (data.url) {
                  uploadedUrls.push(data.url);
                }
              } catch (e) {
                common_vendor.index.__f__("error", "at pages/publish/editor.uvue:668", "解析上传响应失败", e);
              }
            }
            if (uploadCount === this.images.length) {
              common_vendor.index.hideLoading();
              callback && callback(uploadedUrls);
            }
          },
          fail: () => {
            uploadCount++;
            common_vendor.index.showLoading({
              title: `上传图片 ${uploadCount}/${this.images.length}`
            });
            if (uploadCount === this.images.length) {
              common_vendor.index.hideLoading();
              callback && callback(uploadedUrls);
            }
          }
        });
      });
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: common_vendor.t($data.isDraft ? "编辑草稿" : "发布新动态"),
    c: common_vendor.t($data.selectedCategory),
    d: common_assets._imports_0,
    e: common_vendor.o((...args) => $options.showTagSelector && $options.showTagSelector(...args)),
    f: common_vendor.f($data.selectedTags, (tag, index, i0) => {
      return {
        a: common_vendor.t(tag),
        b: common_vendor.o(($event) => $options.removeTag(index), index),
        c: index
      };
    }),
    g: $data.selectedTags.length < 3
  }, $data.selectedTags.length < 3 ? {
    h: common_vendor.o((...args) => $options.showTagPrompt && $options.showTagPrompt(...args))
  } : {}, {
    i: $data.postContent,
    j: common_vendor.o(($event) => $data.postContent = $event.detail.value),
    k: common_vendor.t($data.postContent.length),
    l: common_vendor.f($data.images, (image, index, i0) => {
      return {
        a: image,
        b: common_vendor.o(($event) => $options.deleteImage(index), index),
        c: index
      };
    }),
    m: $data.images.length < 9
  }, $data.images.length < 9 ? {
    n: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args))
  } : {}, {
    o: common_vendor.o((...args) => $options.saveAsDraft && $options.saveAsDraft(...args)),
    p: common_vendor.o((...args) => $options.publishPost && $options.publishPost(...args)),
    q: !$data.postContent.trim(),
    r: common_vendor.sei(_ctx.virtualHostId, "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/publish/editor.js.map
