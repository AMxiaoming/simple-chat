const axios = require('axios');

// node转发
const express = require('express');
const app = express();
// 解决跨域
const cors = require('cors');

app.use(cors())
app.use(express.json());

app.post("/chat", async (req, res) => {
  console.log(req.body.apiKey,'req.body.apiKey');
  var data = JSON.stringify({
    "model": "gpt-3.5-turbo",
    "messages": req.body.message //messages就是你发的消息是数组形式
  });
  var config = {
    method: 'post',
    url: 'https://api.openai-proxy.com/v1/chat/completions',
    headers: {
      'Authorization': `Bearer ${req.body.apiKey}`,
      'Content-Type': 'application/json',
    },
    data: data
  };
  console.log(config,'config');
  axios(config)
    .then(function (response) {
      // console.log(JSON.stringify(response.data));
      res.send({ code: 200, msg: response.data })
    })
    .catch(function (error) {
      console.log('error');
      res.send({code:400,content:error})
    });
  // res.send({ code: 200, msg: req.body })
})

// 测试接口
app.get('/get-data', (req, res) => {
  res.json({ "content": "hi" });
})




const port = process.env.PORT || 3005;
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
