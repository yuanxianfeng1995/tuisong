const config = {
    // 公众号配置
    app_id: "wxe8fb06fcf8eac0a9", // 公众号appId
    app_secret: "83c6c409765f9e2db842172203053774", // 公众号appSecret
    user: ["oldvH5pG6mCEMnSjc1Q8fITZKs8U", "oldvH5kCO-hcFVNKzG7WznLf5G-I"], // 接收公众号消息的微信号
    template_id: "ufi2ookeLPrF06kv1Djox5o6qNwdAYFePsvuct4QCPo", // 模板 id
    // 信息配置
    city: "长沙", // 所在城市
    birthday1: { "name": "陈思卉", "birthday": "9,18" }, // 宝贝生日（阳历），姓名和生日，生日格式为"年-月-日"
    birthday2: { "name": "袁先锋", "birthday": "10,20" }, // 我的生日，同上
    love_date: "2021-8-7", // 在一起的日期，年月日以"-"分隔
    loveStr: "", // 如果填写,则以填写内容为主，如果不填写则自动获取土味情话语句
}
module.exports = config