<template>
  <div class="content">
    <!-- 对话框部分 -->
    <div id="content-top" class="content-top">
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
              <van-field v-model="apiKeyValue" readonly label="梯子获取key" @keydown.enter="confirm" />
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
      this.openAIKey = process.env.VUE_APP_API_KEY || localStorage.getItem('OPEN-API-KEY')
      this.keyValue = this.openAIKey
    },
    sendMsg (e) {
      if (e.keyCode === 13 || e.type === 'click') {
        if (!this.openAIKey) return Notify({ type: 'warning', message: '请填写apiKey' })
        this.myMsg()
        this.chatMsg()
      }
    },
    myMsg () {
      // 用户样式添加
      const TopEl = document.getElementById('content-top')
      const myImgEl = document.createElement('span')
      const mySpanEl = document.createElement("span")
      const myDivEl = document.createElement("div")
      myImgEl.innerText = 'A'
      myDivEl.style = ' position: relative;display: flex;align-items: center;padding: 20px;font-size: 18px;background: #95ec69;color: #000'
      mySpanEl.style = 'flex: 1;width: 250px;word-wrap: break-word;'
      myImgEl.style = ' width: 50px;height: 50px;border-radius: 25px;margin-left:10px;background:#f4f6f8;;text-align: center;line-height: 50px;color:#000;font-weight: 700;font-size:26px'
      mySpanEl.innerText = this.input
      TopEl.appendChild(myDivEl)
      myDivEl.appendChild(mySpanEl)
      myDivEl.appendChild(myImgEl)
    },
    chatMsg () {
      let chatText;
      const TopEl = document.getElementById('content-top')
      const chatDivEl = document.createElement("div")
      const chatImgEl = document.createElement('span')
      const chatSpanEl = document.createElement("span")
      chatImgEl.innerText = 'C'
      chatDivEl.style = ' position: relative;display: flex;align-items: center;padding: 20px;font-size: 18px;background: #ffffff;color: #000'
      chatSpanEl.style = 'flex: 1;width: 250px;word-wrap: break-word;'
      chatImgEl.style = ' width: 50px;height: 50px;border-radius: 25px; margin-right: 10px;background:#d2f9d1;text-align: center;line-height: 50px;color:#000;font-weight: 700;font-size:26px'
      chatText = 'loading...'
      chatSpanEl.innerText = chatText
      TopEl.appendChild(chatDivEl)
      chatDivEl.appendChild(chatImgEl)
      chatDivEl.appendChild(chatSpanEl)
      TopEl.appendChild(chatDivEl)
      // chat样式添加
      // openFn(this.input).then(res => {
      //   chatText = res.content
      //   chatSpanEl.innerText = chatText
      // })
      // 调用node代理后的openai接口
      chatApi({ message: [{ "role": "user", "content": `${this.input}` }], apiKey: this.openAIKey }).then(res => {
        chatText = res.msg.choices[0].message.content || '接口返回错误'
        chatSpanEl.innerText = chatText
      })
      this.input = ''
      let div = document.getElementsByClassName('content');
      div.scrollTop = div.scrollHeight;
    },
    cancel () {
      this.keyValue = ''
      this.show = false
    },
    confirm () {
      if (!this.keyValue) return Notify({ type: 'warning', message: '请填写apiKey' })
      this.openAIKey = this.keyValue
      localStorage.setItem('OPEN-API-KEY', this.keyValue)
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
}

.content-top {
  width: 100%;
  height: 100%;
}

.fixed-bottom {
  position: fixed;
  bottom: 0;
  width: 100%;
}

/* 我的div样式 */
.my-div-style {
  position: relative;
  display: flex;
  align-items: center;
  padding: 20px;
  font-size: 18px;
  background: pink;
  color: #000;

}

.my-span-style {
  flex: 1;
  width: 250px;
  word-wrap: break-word;
}

.my-img-style {
  flex: 1;
  width: 250px;
  word-wrap: break-word;

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
