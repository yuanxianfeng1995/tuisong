/************** 注意：此文件中的代码，不要做任何修改 ****************/
const config = require("./config")
const axios = require('axios');
const lunarFun = require('lunar-fun');
// 导入 dayjs 模块
const dayjs = require("dayjs")
// 导入 dayjs 插件
const weekday = require('dayjs/plugin/weekday')
const isSameOrAfter = require("dayjs/plugin/isSameOrAfter")
// 使用 dayjs 插件
dayjs.extend(weekday)
dayjs.extend(isSameOrAfter);
let templateMessageSend;
try {
  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

  const axiosPost = function (url, params) {
    return new Promise((resolve, reject) => {
      axios
        .post(url, params)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  };
  const axiosGet = function (url, params) {
    return new Promise((resolve, reject) => {
      axios
        .get(url, {
          params,
        })
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  };

  // 获取token
  async function getToken() {
    const params = {
      grant_type: 'client_credential',
      appid: config.app_id,
      secret: config.app_secret,
    };
    let res = await axiosGet('https://api.weixin.qq.com/cgi-bin/token', params);
    return res.data.access_token;
  }
  // 获取天气情况
  async function get_weather() {
    const params = {
      openId: "aiuicus",
      clientType: "h5",
      sign: "h5",
      city: config.city
    }
    let res = await axiosGet(`http://autodev.openspeech.cn/csp/api/v2.1/weather`, params)
    return res.data.data.list[0]
  }
  get_weather()

  // 获取当前时间：格式 2022年8月25日 星期五
  function getCurrentDate() {
    let days = ""
    switch (dayjs().weekday()) { // 当前星期几
      case 1:
        days = '星期一';
        break;
      case 2:
        days = '星期二';
        break;
      case 3:
        days = '星期三';
        break;
      case 4:
        days = '星期四';
        break;
      case 5:
        days = '星期五';
        break;
      case 6:
        days = '星期六';
        break;
      case 0:
        days = '星期日';
        break;
    }
    return dayjs().format('YYYY-MM-DD') + " " + days
  }

  // 计算生日还有多少天
  // function brthDate(brth) {
  //   return dayjs(brth).diff(dayjs(), 'day')
  // }

  function brthDate(month, day) {
    let now = new Date();
    let thisYear = now.getFullYear();
    //今年的生日
    let birthday = new Date(thisYear, month - 1, day);
    if (birthday < now) {
      birthday.setFullYear(now.getFullYear() + 1);
    }
    let timeDec = birthday - now;
    let days = timeDec / (24 * 60 * 60 * 1000);
    return Math.ceil(days);
  }

  // 土味情话
  async function sweetNothings() {
    let res = await axiosGet("https://api.1314.cool/words/api.php?return=json")
    let str = ""
    config.loveStr ? str = config.loveStr : str = res.data.word
    return str
  }

  // 2、舔狗日记
  async function getTianGou() {
    let res = await axiosGet('https://v.api.aa1.cn/api/tiangou/index.php')
    console.log('res.newslist[0]', res.data.newslist[0])
    return res.data.newslist[0].content;
  }

  // 3、网易云热评
  async function getWangYiYun() {
    let res = await axiosGet('https://keai.icu/apiwyy/api')
    return res.data;
  }

  // 随机颜色
  function randomColor() {
    let randomColor = "#" + parseInt(Math.random() * 0x1000000).toString(16).padStart(6, "0")
    return randomColor
  }

  templateMessageSend = async function () {
    const token = await getToken();
    const url = 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=' + token;
    try {


      // 天气信息
      let weatherInfo = await get_weather()
      // 计算在一起的天数
      let together_day = dayjs().diff(config.love_date, "day")
      // 每日情话
      let loveStr = await sweetNothings()
      // 网易云热评
      let wangYiYun = await getWangYiYun()
      // 舔狗日记
      let tianGou = await getTianGou()


      const arr = config.birthday1.birthday.split(',')
      const arr1 = config.birthday2.birthday.split(',')
      let now = new Date();
      let thisYear = now.getFullYear();
      let date1 = lunarFun.gregorianToLunal(thisYear, arr[0], arr[1]); // [1999, 4, 23, false]
      let date2 = lunarFun.gregorianToLunal(thisYear, arr1[0], arr1[1]); // [1999, 4, 23, false]
      console.log('date1', 'date2', date1, date2)
      let params = {
        touser: config.user,
        template_id: config.template_id,
        url: 'http://weixin.qq.com/download',
        topcolor: '#FF0000',
        data: {
          // 当前日期
          nowDate: {
            value: getCurrentDate(),
            color: randomColor(),
          },
          // 省份
          province: {
            value: weatherInfo.province,
            color: randomColor(),
          },
          // 城市
          city: {
            value: weatherInfo.city,
            color: randomColor(),
          },
          // 天气
          weather: {
            value: weatherInfo.weather,
            color: randomColor(),
          },
          // 当前气温
          temp: {
            value: weatherInfo.temp + "°C",
            color: randomColor(),
          },
          // 最低气温
          low: {
            value: weatherInfo.low + "°C",
            color: randomColor(),
          },
          // 最高气温
          high: {
            value: weatherInfo.high + "°C",
            color: randomColor(),
          },
          // 风向
          wind: {
            value: weatherInfo.wind,
            color: randomColor(),
          },
          // 空气质量
          airQuality: {
            value: weatherInfo.airQuality,
            color: randomColor(),
          },
          // 湿度
          humidity: {
            value: weatherInfo.humidity,
            color: randomColor(),
          },
          // 宝贝的名字
          dearName: {
            value: config.birthday1.name,
            color: randomColor(),
          },
          // 我的名字
          myName: {
            value: config.birthday2.name,
            color: randomColor(),
          },
          // 距离宝贝生日
          dearBrthDays: {
            value: brthDate(date1[1], date1[2]),
            color: randomColor(),
          },
          // 距离我的生日
          myBrthDays: {
            value: brthDate(date2[1], date2[2]),
            color: randomColor(),
          },
          // 在一起的天数
          loveDays: {
            value: together_day,
            color: randomColor(),
          },
          // 每日情话
          loveWords: {
            value: loveStr,
            color: randomColor(),
          },
          wangYiYunWords: {
            value: `作者:${wangYiYun.user} 歌名:${wangYiYun.music}------${wangYiYun.content}`,
            color: randomColor(),
          },
          tianGouWords: {
            value: tianGou,
            color: randomColor(),
          }
        },
      };
      for (const user of config.user) {
        // 模板id 配置项
        params.touser = user
        let res = await axiosPost(url, params);
        switch (res.data.errcode) {
          case 40001:
            console.log("推送消息失败,请检查 appId/appSecret 是否正确");
            break
          case 40003:
            console.log("推送消息失败,请检查微信号是否正确");
            break
          case 40037:
            console.log("推送消息失败,请检查模板id是否正确");
            break
          case 0:
            console.log("推送消息成功");
            break
        }
      }
    } catch (error) {
      console.log('error', error)
    }
  }
  // 调用函数，推送模板消息
  templateMessageSend(); // 第一次执行程序时会推送一次消息，如使用定时器
} catch (error) {
  console.log('error', error)
  templateMessageSend();
}

