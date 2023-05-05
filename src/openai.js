const { Configuration, OpenAIApi } = require("openai");
// console.log(process.env.OPENAI_API_KEY,'process.env.OPENAI_API_KEY');
const configuration = new Configuration({
  apiKey: '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',
});
const openai = new OpenAIApi(configuration);

export async function openFn(msg) {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{role: "user", content: msg}],
      temperature: 1
    });
    return response.data.choices[0].message
  } catch (error) {
    console.log(error);
    let res ={}
    res.content ='网络错误,请稍后重试。'
    return res
  }
}

