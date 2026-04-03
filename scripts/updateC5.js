const fs = require('fs');
const path = require('path');

const membersPath = path.join(__dirname, 'members.json');
const members = JSON.parse(fs.readFileSync(membersPath, 'utf8'));

const c5Data = [
    {
        "name": "安久津智希",
        "year": "C5",
        "role": "C5の先駆者",
        "major": "経済",
        "nickname": "あくたん",
        "profile": ["星野愛久愛海に憧れてます"],
        "src": "https://live.staticflickr.com/65535/54913755215_77af0d3b20_4k.jpg"
    },
    {
        "name": "石井泰成",
        "year": "C5",
        "role": "山歩",
        "major": "情物",
        "nickname": "やすなり",
        "profile": ["トンビにふんをかけられた可哀想な男。山歩会との二刀流。"],
        "src": ""
    },
    {
        "name": "石原大智",
        "year": "C5",
        "role": "自転車職人",
        "major": "理球",
        "nickname": "だいちん",
        "profile": ["チャリと山と雪に脳を焦がれている"],
        "src": ""
    },
    {
        "name": "市川涼一",
        "year": "C5",
        "role": "イケメン、意味不明な言動",
        "major": "理球",
        "nickname": "いっちー",
        "profile": ["男だけになると暴れ始める。ボディタッチ多め。"],
        "src": "https://live.staticflickr.com/65535/54913880151_b037635978_4k.jpg"
    },
    {
        "name": "猪瀬大翔",
        "year": "C5",
        "role": "カービィ、掃除機",
        "major": "農",
        "nickname": "いのまる",
        "profile": ["向上心の塊"],
        "src": "https://live.staticflickr.com/65535/54843207138_1ff952b3e2_4k.jpg"
    },
    {
        "name": "植木仁乃亮",
        "year": "C5",
        "role": "",
        "major": "",
        "nickname": "パツキン",
        "profile": [],
        "src": ""
    },
    {
        "name": "梅津幸澄",
        "year": "C5",
        "role": "",
        "major": "情物",
        "nickname": "ウメッツ",
        "profile": [],
        "src": ""
    },
    {
        "name": "上保結里奈",
        "year": "C5",
        "role": "何でも後回し党",
        "major": "機知",
        "nickname": "ゆりな、わぼ",
        "profile": ["寝るために生きてる"],
        "src": "https://live.staticflickr.com/65535/54993936227_c7ea30f3a3_c.jpg"
    },
    {
        "name": "大關祐樹",
        "year": "C5",
        "role": "部室の駐在員",
        "major": "工・機知兼理物",
        "nickname": "ぜきちゃん",
        "profile": ["長髪オールブラックススタイルのイカツイguy。前世の記憶がある。"],
        "src": "https://live.staticflickr.com/65535/54911867391_5735e94564_4k.jpg"
    },
    {
        "name": "小髙ことみ",
        "year": "C5",
        "role": "長女",
        "major": "法",
        "nickname": "ことみん(姐さん)",
        "profile": ["運転の上手さに定評がある。ギターとピアノが弾ける。"],
        "src": "https://live.staticflickr.com/65535/54995057238_17ec6e73a3_4k.jpg"
    },
    {
        "name": "加藤尊裕",
        "year": "C5",
        "role": "黒服",
        "major": "理球",
        "nickname": "たかP",
        "profile": [],
        "src": ""
    },
    {
        "name": "菊地真琴",
        "year": "C5",
        "role": "一家に1台",
        "major": "理物",
        "nickname": "まこっちゃん",
        "profile": ["野菜1日分を毎日飲んでます"],
        "src": "https://live.staticflickr.com/65535/54927108945_5e22b4b0ff_c.jpg"
    },
    {
        "name": "木下智博",
        "year": "C5",
        "role": "落ち着き担当",
        "major": "化バイ",
        "nickname": "きのした",
        "profile": ["午前中部室にいがち。鍵ください"],
        "src": ""
    },
    {
        "name": "向後温人",
        "year": "C5",
        "role": "寡黙",
        "major": "建築",
        "nickname": "こーご",
        "profile": ["自発的に話さないが自発的に上裸になれる"],
        "src": ""
    },
    {
        "name": "古賀遼太朗",
        "year": "C5",
        "role": "スプラトゥーン係",
        "major": "情物",
        "nickname": "こがっちょ、こがちょす、こがちょりす",
        "profile": ["マックの面接落ちました"],
        "src": "https://live.staticflickr.com/65535/54832788577_3e5afe771d_4k.jpg"
    },
    {
        "name": "小林暁飛",
        "year": "C5",
        "role": "ドライバー",
        "major": "理物",
        "nickname": "あさぴ",
        "profile": ["運転モチベが異常に高いことで知られる。サー長候補とも謳われているが如何に。"],
        "src": "https://live.staticflickr.com/65535/54638552009_9289137afa_4k.jpg"
    },
    {
        "name": "小林律花",
        "year": "C5",
        "role": "ポケモンスリーパー",
        "major": "理物",
        "nickname": "りっか⤴さん",
        "profile": ["ワードセンス"],
        "src": "https://live.staticflickr.com/65535/54995158944_9e196a119c_4k.jpg"
    },
    {
        "name": "鈴木南奈",
        "year": "C5",
        "role": "マネージャー",
        "major": "農",
        "nickname": "なあc",
        "profile": ["マシュマロ焼くの得意です"],
        "src": ""
    },
    {
        "name": "瀬尾愛実",
        "year": "C5",
        "role": "負傷者",
        "major": "文",
        "nickname": "瀬尾ちゃん",
        "profile": ["怪我してるんですほんとです"],
        "src": ""
    },
    {
        "name": "徳差大輝",
        "year": "C5",
        "role": "にわか",
        "major": "情物",
        "nickname": "とくさし",
        "profile": ["ディズニー行きたい"],
        "src": "https://live.staticflickr.com/65535/54912087673_aad1d6741c_4k.jpg"
    },
    {
        "name": "中西来音",
        "year": "C5",
        "role": "前髪担当",
        "major": "農",
        "nickname": "なかにしright",
        "profile": ["C4の新歓係を宮教大の人だと思ってた。恋愛思想を語らせると面白いので聞いてみよう。"],
        "src": ""
    },
    {
        "name": "西川奏大",
        "year": "C5",
        "role": "クールキャラ(笑)",
        "major": "情物",
        "nickname": "西川は西川なんだよなぁ",
        "profile": ["ボウリング魔人.バ先荒らし."],
        "src": "https://live.staticflickr.com/65535/54723786001_bdf44d52c0_4k.jpg"
    },
    {
        "name": "秦優修",
        "year": "C5",
        "role": "",
        "major": "理物",
        "nickname": "のぶ",
        "profile": ["居酒屋バイトで声量抑え中"],
        "src": "https://live.staticflickr.com/65535/54723990763_3e13c1eccf_4k.jpg"
    },
    {
        "name": "林咲来",
        "year": "C5",
        "role": "平部員",
        "major": "機知",
        "nickname": "さくら",
        "profile": ["体力作り中です"],
        "src": "https://live.staticflickr.com/65535/54994022828_767aee65ff_c.jpg"
    },
    {
        "name": "平岡拓磨",
        "year": "C5",
        "role": "マッマ",
        "major": "理化",
        "nickname": "ぴー",
        "profile": ["ふやかした高橋文哉"],
        "src": "https://live.staticflickr.com/65535/54785888069_ec8f7837be_4k.jpg"
    },
    {
        "name": "室屋乃々佳",
        "year": "C5",
        "role": "研一LOVE",
        "major": "理球",
        "nickname": "のんきち",
        "profile": ["アルティメットやってます"],
        "src": "https://live.staticflickr.com/65535/54994831031_99dacda65e_c.jpg"
    },
    {
        "name": "山岸丸人",
        "year": "C5",
        "role": "サークルHPの破壊者",
        "major": "パソコンカタカタ学部",
        "nickname": "まるひと",
        "profile": ["ここの部員紹介を完成させるのに数時間かかりました。"],
        "src": "https://live.staticflickr.com/65535/54913016077_b20b31294a_c.jpg"
    },
    {
        "name": "山下寛",
        "year": "C5",
        "role": "C5の安心枠",
        "major": "医医(2文字目の医を強調)",
        "nickname": "医医",
        "profile": ["山行参加回数1回とは思えない存在感。発言の火力でBBQができる。"],
        "src": "https://live.staticflickr.com/65535/55086249351_8be528bd6e_c.jpg"
    }
];

// Remove existing C5 members and append the new ones
const otherMembers = members.filter(m => m.year !== 'C5');
const updatedMembers = [...otherMembers, ...c5Data];

fs.writeFileSync(membersPath, JSON.stringify(updatedMembers, null, 2), 'utf8');

console.log(`Updated members.json. Processed ${c5Data.length} C5 members.`);
