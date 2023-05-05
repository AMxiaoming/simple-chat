<template>
  <div class="content" id="content">
    <!-- 对话框部分 -->
    <div id="content-top" class="content-top">
      <!-- 用户数据 -->
      <!-- 此层div不加会报key的错误 -->
      <div v-for="(item, index) in userVal" :key="index">
        <div class="user-content" v-if="index % 2 == 0">
          <span>{{ item }}</span>
          <span>A</span>
        </div>
        <!-- chat数据 -->
        <div class="chat-content" v-if="index % 2 != 0">
          <span>C</span>
          <span>{{ item }}</span>
        </div>
      </div>
    </div>
    <div class="fixed-bottom">
      <van-field v-model="input" center clearable placeholder="请输入内容" @keydown="sendMsg($event)">
        <template #button>
          <van-button size="small" type="primary" @click="sendMsg">发送</van-button>
        </template>
      </van-field>
    </div>
    <!-- 固定显示key弹框按钮 -->
    <div class="fixed-keyBtn" v-if="!openAIKey">
      <van-button type="primary" @click="show = true">
        K
      </van-button>
    </div>
    <!-- 弹框部分 -->
    <van-overlay :show="show && !openAIKey" @click="show = false">
      <div class="wrapper" @click.stop>
        <div class="block">
          <div class="block-title">
            请填写您的ApiKey
          </div>
          <div class="block-tip">
            <van-cell-group>
              <van-field v-model="apiKeyValue" readonly label="梯子获取key" />
            </van-cell-group>
          </div>
          <div class="block-input">
            <van-cell-group>
              <van-field v-model="keyValue" label="apiKey" placeholder="请输入您的ApiKey" @keydown.enter="confirm" />
            </van-cell-group>
          </div>
          <div class="block-btn">
            <van-button plain type="default" @click="cancel">取消</van-button>
            <van-button plain type="primary" style="margin-left:10px;" @click="confirm">确认</van-button>
          </div>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import { chatApi } from "@/api/chat.js";
import { Notify } from 'vant';

export default {
  data () {
    return {
      input: '',
      chatText: '',
      userVal: [],
      // 弹框显示
      show: true,
      keyValue: '',
      apiKeyValue: 'https://platform.openai.com/account/api-keys',
      openAIKey: ''
    }
  },
  created () {
    this.getData()
  },
  mounted () {

  },
  methods: {
    getData () {
      this.openAIKey = process.env.VUE_APP_API_KEY || localStorage.getItem('OPEN-API-KEY') || ''
      this.keyValue = this.openAIKey
    },
    async sendMsg (e) {
      if (e.keyCode === 13 || e.type === 'click') {
        if (!this.input) return Notify({ type: 'warning', message: '请输入内容' })
        this.chatMsg(this.input)
        this.input = ''
      }
    },
    async chatMsg (val) {
      this.userVal.push(val)
      this.userVal.push('loading...')
      this.scrollFn()
      const res = await chatApi({ message: [{ "role": "user", "content": `${val}` }], apiKey: this.openAIKey })
      if(res.code === 200 && res.msg) {
        this.chatText = res.msg.choices[0].message.content || '接口返回错误'
      } else if (res.content && res.content.status === 429) {
        this.chatText = '接口请求频繁，请稍后重试'
      } else if (res.content && res.content.status === 401) {
        this.openAIKey = ''
        this.keyValue =''
        this.chatText = '请填写正确的apiKey'
      } else {
        this.chatText = '未知错误，请稍后重试'
      }
      this.$set(this.userVal, this.userVal.length - 1, this.chatText)
      this.scrollFn()
    },
    scrollFn () {
      // 自动滚动到底部
      const element = document.getElementById('content');
      // 将滚动条滚动到最底部
      element.scrollTop = element.scrollHeight - element.clientHeight;
    },
    // 弹框事件
    cancel () {
      this.keyValue = ''
      this.show = false
    },
    confirm () {
      if (!this.keyValue) return Notify({ type: 'warning', message: '请填写apiKey' })
      this.openAIKey = this.keyValue
      localStorage.setItem('OPEN-API-KEY', this.openAIKey)
      this.show = false
    }
  }
}
</script>

<style scoped >
.content {
  width: 100%;
  height: calc(100vh - 55px);
  overflow-y: auto;
  background: #f5f5f5;
  scroll-behavior: smooth;
  scroll-snap-type: y mandatory;
  scroll-padding-bottom: -55px;
}

.content-top {
  width: 100%;
  height: 100%;
}

/* 对话内容样式 */
.user-content,.chat-content {
  position: relative;
  display: flex;
  align-items: flex-start;
  padding: 20px;
  font-size: 18px;
  background: #95ec69;
  color: #000;
}
.user-content {
  justify-content: flex-end;
}
.chat-content {
  background: #ffffff;
}

.user-content span:first-child,
.chat-content span:last-child {
  width: 70vw;
  word-wrap: break-word;
  margin-top: 10px;
}

.user-content span:last-child,
.chat-content span:first-child {
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-left: 10px;
  background: #f4f6f8;
  text-align: center;
  line-height: 50px;
  color: #000;
  font-weight: 700;
  font-size: 26px
}

.chat-content span:first-child {
  margin-left: 0;
  margin-right: 10px;
}


.user-content span:first-child {
  text-align: right;
}
/* 底部输入框 */
.fixed-bottom {
  position: fixed;
  bottom: 0;
  width: 100%;
}


/* key-btn */
.fixed-keyBtn {
  position: fixed;
  top: 50px;
  right: 0;
}

/* 弹框样式 */
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.block {
  width: 80%;
  /* height: 200px; */
  background-color: #fff;
}

.block-title {
  padding: 0 20px;
  height: 60px;
  line-height: 60px;
  text-align: left;
  font-size: 20px;
  font-weight: 600;
}

.block-input {
  display: flex;
  justify-content: center;
}

.block-btn {
  display: flex;
  justify-content: flex-end;
  padding: 20px;
}

.block-tip {
  font-size: 12px;
}
</style>
