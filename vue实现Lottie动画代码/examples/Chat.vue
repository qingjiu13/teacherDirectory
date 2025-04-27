<template>
  <view class="chat-container">
    <view class="chat-messages">
      <view 
        v-for="(message, index) in messages" 
        :key="index"
        :class="['message', message.isSelf ? 'self' : 'other']"
      >
        {{ message.content }}
      </view>
    </view>
    
    <view class="input-area">
      <input 
        type="text" 
        v-model="inputMessage" 
        placeholder="请输入消息" 
      />
      <button @click="handleSend">发送</button>
    </view>
  </view>
</template>

<script>
/**
 * 聊天组件示例
 * 展示如何使用嵌套模块
 */
import { chatModule } from '@/store/helpers'

export default {
  name: 'ChatComponent',
  data() {
    return {
      inputMessage: ''
    }
  },
  computed: {
    ...chatModule.mapState({
      messages: state => state.messageList,
      chatId: state => state.currentChatId,
      isLoading: state => state.loading
    }),
    ...chatModule.mapGetters([
      'unreadCount',
      'lastMessage'
    ])
  },
  methods: {
    ...chatModule.mapActions([
      'sendMessage',
      'loadMessages', 
      'clearHistory'
    ]),
    ...chatModule.mapMutations([
      'SET_CURRENT_CHAT',
      'CLEAR_UNREAD'
    ]),
    
    /**
     * 处理发送消息
     */
    handleSend() {
      if (!this.inputMessage.trim()) return;
      
      this.sendMessage({
        chatId: this.chatId,
        content: this.inputMessage,
        timestamp: Date.now()
      });
      
      this.inputMessage = '';
    },
    
    /**
     * 组件初始化时加载消息历史
     */
    onLoad() {
      // 设置当前聊天ID
      this.SET_CURRENT_CHAT(this.$route.params.id);
      
      // 加载消息历史
      this.loadMessages(this.chatId);
      
      // 清除未读状态
      this.CLEAR_UNREAD(this.chatId);
    }
  }
}
</script>

<style>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.chat-messages {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
}

.message {
  margin: 5px 0;
  padding: 8px 12px;
  border-radius: 15px;
  max-width: 70%;
}

.self {
  align-self: flex-end;
  background-color: #007AFF;
  color: #fff;
  margin-left: auto;
}

.other {
  align-self: flex-start;
  background-color: #F2F2F2;
  color: #333;
}

.input-area {
  display: flex;
  padding: 10px;
  border-top: 1px solid #eee;
}

.input-area input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.input-area button {
  margin-left: 8px;
}
</style> 