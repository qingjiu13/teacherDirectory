"use strict";const t=require("../../common/vendor.js"),e=require("../../common/assets.js"),o=t.defineComponent({data:()=>({postId:null,post:new UTSJSONObject({id:null,userId:null,nickname:"",avatar:"",school:"",major:"",title:"",content:"",images:[],tags:[],createTime:"",viewCount:0,likeCount:0,commentCount:0,collectCount:0,shareCount:0,isLiked:!1,isCollected:!1,isFollowed:!1}),comments:[],commentPage:1,hasMoreComments:!0,commentContent:"",inputFocus:!1,replyTarget:null,isLoadingComments:!1}),onLoad(t){t.id?(this.postId=t.id,this.loadPostDetail(),this.loadComments(),t.showComment&&(this.inputFocus=!0)):this.loadMockData()},methods:{loadMockData(){this.post={id:1,userId:101,nickname:"研究生活小助手",avatar:"/static/image/default_avatar.png",school:"北京大学",major:"计算机科学",title:"考研复习经验分享",content:"今天分享一下考研复习经验，希望对大家有帮助！数学部分要注重基础，多做真题。考研复习是一场持久战，要合理规划时间，保持良好心态。英语阅读需要每天坚持，政治要理解记忆结合。",images:[],tags:["考研","复习经验","时间规划"],createTime:"2023-06-15 14:30",viewCount:256,likeCount:42,commentCount:8,collectCount:15,shareCount:3,isLiked:!1,isCollected:!1,isFollowed:!1},this.comments=[{id:101,nickname:"考研学子",avatar:"/static/image/default_avatar.png",content:"感谢分享，对我帮助很大！",createTime:"2023-06-15 15:20",likeCount:5,isLiked:!1,replies:[{id:201,nickname:"研究生活小助手",content:"不客气，希望对你有帮助~",createTime:"2023-06-15 15:30",replyTo:101,replyToName:"考研学子"}],replyCount:1},{id:102,nickname:"未来研究生",avatar:"/static/image/default_avatar.png",content:"请问数学复习有什么具体建议吗？",createTime:"2023-06-15 16:45",likeCount:3,isLiked:!1,replies:[],replyCount:0}]},loadPostDetail(){this.loadMockData()},recordView(){this.post.viewCount++},loadComments(){if(this.isLoadingComments)return null;this.isLoadingComments=!0,setTimeout((()=>{this.commentPage>1&&(this.hasMoreComments=!1),this.isLoadingComments=!1}),500)},loadMoreComments(){if(!this.hasMoreComments||this.isLoadingComments)return null;this.commentPage++,this.loadComments()},loadMoreReplies(e=null){t.index.showToast({title:"已加载全部回复",icon:"none"})},previewImage(e=null){t.index.previewImage({urls:this.post.images,current:this.post.images[e]})},goBack(){t.index.navigateBack()},showMoreOptions(){t.index.showActionSheet({itemList:["举报","不感兴趣","分享"],success:t=>{switch(t.tapIndex){case 0:this.reportPost();break;case 1:this.markNotInterested();break;case 2:this.sharePost()}}})},toggleFollow(){this.post.isFollowed=!this.post.isFollowed,t.index.showToast({title:this.post.isFollowed?"已关注":"已取消关注",icon:"none"})},likePost(){this.post.isLiked=!this.post.isLiked,this.post.likeCount+=this.post.isLiked?1:-1},collectPost(){this.post.isCollected=!this.post.isCollected,this.post.collectCount+=this.post.isCollected?1:-1,t.index.showToast({title:this.post.isCollected?"已收藏":"已取消收藏",icon:"none"})},sharePost(){t.index.showActionSheet({itemList:["分享给好友","分享到微信好友","分享到微信群聊","分享到朋友圈"],success:e=>{this.post.shareCount++,t.index.showToast({title:"分享成功",icon:"success"})}})},reportPost(){t.index.showToast({title:"举报已提交",icon:"success"})},navigateToUserDetail(e=null){t.index.navigateTo({url:`/pages/teacher/profile?id=${e}`})},markNotInterested(){t.index.showToast({title:"已减少此类内容推送",icon:"none"}),setTimeout((()=>{t.index.navigateBack()}),1500)},likeComment(t=null){t.isLiked=!t.isLiked,t.likeCount+=t.isLiked?1:-1},replyComment(t=null){this.replyTarget={id:t.id,nickname:t.nickname,type:"comment"},this.inputFocus=!0},focusCommentInput(){this.replyTarget=null,this.inputFocus=!0},submitComment(){if(!this.commentContent.trim())return null;const e=new UTSJSONObject({id:Date.now(),nickname:"当前用户",avatar:"/static/image/default_avatar.png",content:this.commentContent,createTime:"刚刚",likeCount:0,isLiked:!1,replies:[],replyCount:0});if(this.replyTarget){const t=UTS.arrayFind(this.comments,(t=>t.id===this.replyTarget.id));if(t){const e=new UTSJSONObject({id:Date.now(),nickname:"当前用户",content:this.commentContent,createTime:"刚刚",replyTo:this.replyTarget.id,replyToName:this.replyTarget.nickname});t.replies.push(e),t.replyCount++}}else this.comments.unshift(e);this.commentContent="",this.replyTarget=null,this.post.commentCount++,t.index.showToast({title:"评论成功",icon:"success"})}}});const s=t._export_sfc(o,[["render",function(o,s,i,n,a,l){return t.e({a:t.o(((...t)=>l.goBack&&l.goBack(...t))),b:t.o(((...t)=>l.showMoreOptions&&l.showMoreOptions(...t))),c:a.post.avatar||"/static/image/default_avatar.png",d:t.o((t=>l.navigateToUserDetail(a.post.userId))),e:t.t(a.post.nickname),f:t.t(a.post.school),g:t.t(a.post.major),h:t.t(a.post.isFollowed?"已关注":"关注"),i:a.post.isFollowed?1:"",j:t.o(((...t)=>l.toggleFollow&&l.toggleFollow(...t))),k:t.t(a.post.title||"无标题"),l:t.t(a.post.content),m:a.post.images&&a.post.images.length>0},a.post.images&&a.post.images.length>0?{n:t.f(a.post.images,((e,o,s)=>({a:e,b:o,c:t.o((t=>l.previewImage(o)),o)}))),o:t.n("grid-"+(a.post.images.length>4?"multi":a.post.images.length))}:{},{p:a.post.tags&&a.post.tags.length>0},a.post.tags&&a.post.tags.length>0?{q:t.f(a.post.tags,((e,o,s)=>({a:t.t(e),b:o})))}:{},{r:t.t(a.post.createTime),s:t.t(a.post.viewCount),t:a.post.isLiked?"/static/image/like_filled.svg":"/static/image/like.svg",v:t.t(a.post.likeCount),w:t.o(((...t)=>l.likePost&&l.likePost(...t))),x:e._imports_0$3,y:t.t(a.post.commentCount),z:t.o(((...t)=>l.focusCommentInput&&l.focusCommentInput(...t))),A:a.post.isCollected?"/static/image/star_filled.svg":"/static/image/star.svg",B:t.t(a.post.collectCount),C:t.o(((...t)=>l.collectPost&&l.collectPost(...t))),D:e._imports_1,E:t.t(a.post.shareCount),F:t.o(((...t)=>l.sharePost&&l.sharePost(...t))),G:t.t(a.comments.length),H:t.f(a.comments,((e,o,s)=>t.e({a:e.avatar||"/static/image/default_avatar.png",b:t.o((t=>l.navigateToUserDetail(e.userId)),o),c:t.t(e.nickname),d:t.t(e.createTime),e:t.t(e.content),f:e.isLiked?"/static/image/like_filled.svg":"/static/image/like.svg",g:t.t(e.likeCount||0),h:t.o((t=>l.likeComment(e)),o),i:t.o((t=>l.replyComment(e)),o),j:e.replies&&e.replies.length>0},e.replies&&e.replies.length>0?t.e({k:t.f(e.replies,((e,o,s)=>t.e({a:t.t(e.nickname),b:e.replyTo},(e.replyTo,{}),{c:e.replyTo},e.replyTo?{d:t.t(e.replyToName)}:{},{e:t.t(e.content),f:o}))),l:e.replyCount>e.replies.length},e.replyCount>e.replies.length?{m:t.o((t=>l.loadMoreReplies(e)),o)}:{}):{},{n:o}))),I:a.hasMoreComments&&a.comments.length>0},a.hasMoreComments&&a.comments.length>0?{J:t.o(((...t)=>l.loadMoreComments&&l.loadMoreComments(...t)))}:{},{K:0===a.comments.length},(a.comments.length,{}),{L:t.o(((...t)=>l.loadMoreComments&&l.loadMoreComments(...t))),M:a.replyTarget?`回复 ${a.replyTarget.nickname}`:"说点什么...",N:a.inputFocus,O:t.o(((...t)=>l.submitComment&&l.submitComment(...t))),P:a.commentContent,Q:t.o((t=>a.commentContent=t.detail.value)),R:a.commentContent?1:"",S:t.o(((...t)=>l.submitComment&&l.submitComment(...t))),T:t.sei(o.virtualHostId,"view")})}]]);wx.createPage(s);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/post/detail.js.map
