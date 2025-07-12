import type { CharMap, MultiCharMap } from "../core.js";

// Single-character Chinese mappings (most common characters)
export const zhMap: CharMap = {
  // Numbers
  一: "yi",
  二: "er",
  三: "san",
  四: "si",
  五: "wu",
  六: "liu",
  七: "qi",
  八: "ba",
  九: "jiu",
  十: "shi",
  百: "bai",
  千: "qian",
  万: "wan",
  零: "ling",

  // Common characters
  人: "ren",
  大: "da",
  小: "xiao",
  中: "zhong",
  国: "guo",
  我: "wo",
  你: "ni",
  他: "ta",
  她: "ta",
  它: "ta",
  们: "men",
  的: "de",
  是: "shi",
  有: "you",
  没: "mei",
  不: "bu",
  在: "zai",
  了: "le",
  和: "he",
  很: "hen",
  好: "hao",
  上: "shang",
  下: "xia",
  来: "lai",
  去: "qu",
  说: "shuo",
  做: "zuo",
  看: "kan",
  听: "ting",
  吃: "chi",
  喝: "he",
  走: "zou",
  跑: "pao",

  // Time
  今: "jin",
  天: "tian",
  明: "ming",
  昨: "zuo",
  年: "nian",
  月: "yue",
  日: "ri",
  时: "shi",
  分: "fen",
  秒: "miao",

  // Family
  家: "jia",
  爸: "ba",
  妈: "ma",
  儿: "er",
  女: "nv",
  子: "zi",
  哥: "ge",
  姐: "jie",
  弟: "di",
  妹: "mei",

  // Places
  北: "bei",
  南: "nan",
  东: "dong",
  西: "xi",
  城: "cheng",
  市: "shi",
  县: "xian",
  村: "cun",
  路: "lu",
  街: "jie",

  // Body
  头: "tou",
  手: "shou",
  脚: "jiao",
  眼: "yan",
  耳: "er",
  口: "kou",
  鼻: "bi",
  心: "xin",

  // Colors
  红: "hong",
  绿: "lv",
  蓝: "lan",
  黄: "huang",
  黑: "hei",
  白: "bai",

  // Animals
  猫: "mao",
  狗: "gou",
  鸟: "niao",
  鱼: "yu",
  马: "ma",
  牛: "niu",
  羊: "yang",
  鸡: "ji",

  // Food
  米: "mi",
  面: "mian",
  肉: "rou",
  菜: "cai",
  水: "shui",
  茶: "cha",
  咖: "ka",
  啡: "fei",

  // Common symbols
  "&": "he",
  "@": "at",
  "%": "baifenbi",
  "+": "jia",
  "=": "dengyu",
  "<": "xiaoyou",
  ">": "dayou",
  "©": "banquan",
  "®": "zhuce",
  "™": "shangbiao",
  "€": "ouye",
  "£": "yingbang",
  $: "meiyuan",
  "¥": "renminbi",
  "¢": "meifan",
  "°": "du",
  "№": "haoma",
};

// Multi-character Chinese sequences
export const zhMultiCharMap: MultiCharMap = {
  // Common compound words
  中国: "zhongguo",
  美国: "meiguo",
  英国: "yingguo",
  法国: "faguo",
  德国: "deguo",
  日本: "riben",
  韩国: "hanguo",

  // Greetings
  你好: "nihao",
  您好: "ninhao",
  再见: "zaijian",
  谢谢: "xiexie",
  对不起: "duibuqi",
  没关系: "meiguanxi",

  // Time expressions
  今天: "jintian",
  明天: "mingtian",
  昨天: "zuotian",
  现在: "xianzai",
  以前: "yiqian",
  以后: "yihou",

  // Common phrases
  什么: "shenme",
  哪里: "nali",
  怎么: "zenme",
  为什么: "weishenme",
  多少: "duoshao",
  几点: "jidian",

  // Locations
  北京: "beijing",
  上海: "shanghai",
  广州: "guangzhou",
  深圳: "shenzhen",
  香港: "xianggang",
  台湾: "taiwan",

  // Education
  学校: "xuexiao",
  老师: "laoshi",
  学生: "xuesheng",
  大学: "daxue",
  中学: "zhongxue",
  小学: "xiaoxue",

  // Work
  工作: "gongzuo",
  公司: "gongsi",
  老板: "laoban",
  同事: "tongshi",
  会议: "huiyi",

  // Technology
  电脑: "diannao",
  手机: "shouji",
  网络: "wangluo",
  互联网: "hulianwang",
  软件: "ruanjian",

  // Transportation
  汽车: "qiche",
  火车: "huoche",
  飞机: "feiji",
  地铁: "ditie",
  公交: "gongjiao",

  // Food
  中餐: "zhongcan",
  西餐: "xican",
  早餐: "zaocan",
  午餐: "wucan",
  晚餐: "wancan",

  // Weather
  天气: "tianqi",
  下雨: "xiayu",
  下雪: "xiaxue",
  刮风: "guafeng",
  晴天: "qingtian",
  阴天: "yintian",

  // Feelings
  高兴: "gaoxing",
  难过: "nanguo",
  生气: "shengqi",
  紧张: "jinzhang",
  轻松: "qingsong",

  // Money
  人民币: "renminbi",
  美元: "meiyuan",
  欧元: "ouyuan",
  日元: "riyuan",
  港币: "gangbi",

  // Common verbs
  知道: "zhidao",
  认识: "renshi",
  喜欢: "xihuan",
  觉得: "juede",
  希望: "xiwang",

  // Directions
  东南: "dongnan",
  东北: "dongbei",
  西南: "xinan",
  西北: "xibei",

  // Polite expressions
  请问: "qingwen",
  不客气: "bukeqi",
  打扰了: "darao le",
  麻烦您: "mafan nin",

  // Internet terms
  网站: "wangzhan",
  微信: "weixin",
  微博: "weibo",
  淘宝: "taobao",
  支付宝: "zhifubao",
};
