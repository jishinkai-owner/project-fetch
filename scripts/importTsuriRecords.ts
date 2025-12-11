/**
 * importAllRecords.ts
 * 
 * 山行記録データを一括でデータベースにインポートするスクリプト
 * 
 * 機能:
 * - 2007年〜2009年の山行記録データ（ハードコーディング）をPrismaを使ってデータベースに登録
 * - 各年度の山行データには年度、ファイル名、場所、タイトル、日付、活動タイプ、詳細が含まれる
 * - filenameがnullの場合は中止になった山行やファイルが存在しない記録
 * - 主にRecordテーブルへのデータ投入に使用
 * 
 * 使用方法:
 * npm run records
 */

import "dotenv/config";
import fs from "fs-extra";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

const prisma = new PrismaClient();

const NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!NEXT_PUBLIC_SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ 環境変数が正しく設定されていません。");
  process.exit(1);
}
const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// =====================================
// MountainRecord 型（upload.ts）
// =====================================
interface MountainRecord {
  id: number;
  year: number;
  filename: string | null;
  place: string | null;
  title: string | null;
  date: string;
  activityType: string;
  details: string | null;
}

// MountainRecord 型（upload.ts のデータ形式）
interface MountainRecord {
  id: number;
  year: number;
  filename: string | null;
  place: string | null;
  title: string | null;
  date: string;
  activityType: string;
  details: string | null;
}


// dataOther配列は年度別Tabiデータに統合されました

// 年度別Tabiデータは以下に統合されています

const dataTsuri: Omit<MountainRecord, "id">[] = [
  {
    year: 2007,
    filename: "legacy/unavailable",
    place: "サビキ釣り大会",
    title: null,
    date: "07/07",
    activityType: "tsuri",
    details: null,
  },
  {
    year: 2007,
    filename: "legacy/unavailable",
    place: "釣り合宿（網地島・田代島）",
    title: null,
    date: "08/29～31",
    activityType: "tsuri",
    details: null,
  },
  {
    year: 2008,
    filename: null,
    place: "1年生体験釣り",
    title: null,
    date: "05/24",
    activityType: "tsuri",
    details: null,
  },
  {
    year: 2008,
    filename: null,
    place: "釣り合宿（網地島・田代島）",
    title: null,
    date: "??/??",
    activityType: "tsuri",
    details: null,
  },
  {
    year: 2009,
    filename: "legacy/unavailable",
    place: "釣り合宿（田代島）",
    title: null,
    date: "??/??",
    activityType: "tsuri",
    details: null,
  },
  // 2010年
  {
    year: 2010,
    filename: null,
    place: "釣り合宿（新潟市）",
    title: null,
    date: "??/??",
    activityType: "tsuri",
    details: null,
  },
  // 2011年
  {
    year: 2011,
    filename: null,
    place: "個人活動",
    title: null,
    date: "??/??",
    activityType: "tsuri",
    details: "釣り合宿はありませんでした。個人単位での川釣りや池釣りがありました。ザリガニを釣って水槽に入れたりもしました。",
  },
  // 2012年
  {
    year: 2012,
    filename: null,
    place: "個人活動",
    title: null,
    date: "??/??",
    activityType: "tsuri",
    details: "釣り合宿はありませんでした。個人単位での活動が多かったです。3人くらいでアナゴやカレイを釣りに行くこともありました。さばいておいしくいただきました。",
  },
  // 2013年 塩釜港
  {
    year: 2013,
    filename: "2013/11.30.Shiogama/shiogama",
    place: "塩釜港 @2013",
    title: null,
    date: "11/30",
    activityType: "tsuri",
    details: null,
  },

  // 2014年 ワカサギ釣り 岩洞湖
  {
    year: 2014,
    filename: "2014/02.08.gandouko/wakasagi_gandouko",
    place: "岩洞湖 ワカサギ釣り",
    title: null,
    date: "02/08",
    activityType: "tsuri",
    details: null,
  },

  // 2015年 塩釜港
  {
    year: 2015,
    filename: "2015/11.22.shiogama",
    place: "塩釜港 @2015",
    title: null,
    date: "11/22",
    activityType: "tsuri",
    details: null,
  },
  {
    year: 2015,
    filename: null,
    place: "仙台港",
    title: null,
    date: "08/09",
    activityType: "tsuri",
    details: null,
  },
  {
    year: 2016,
    filename: null,
    place: "塩釜港 @2016",
    title: null,
    date: "09/10",
    activityType: "tsuri",
    details: null,
  },

  // 2018年
  {
    year: 2018,
    filename: null,
    place: "仙台港",
    title: null,
    date: "09/??",
    activityType: "tsuri",
    details: null,
  },
  {
    year: 2018,
    filename: null,
    place: "釣り堀カフェクローバー",
    title: null,
    date: "10/07",
    activityType: "tsuri",
    details: null,
  },
  {
    year: 2018,
    filename: null,
    place: "七ヶ浜",
    title: null,
    date: "12/02",
    activityType: "tsuri",
    details: null,
  },

  // 2019年
  {
    year: 2019,
    filename: null,
    place: "第一回ワカサギ釣り",
    title: null,
    date: "02/07",
    activityType: "tsuri",
    details: null,
  },
  {
    year: 2019,
    filename: null,
    place: "第二回ワカサギ釣り",
    title: null,
    date: "03/17",
    activityType: "tsuri",
    details: null,
  },
  {
    year: 2019,
    filename: null,
    place: "閖上",
    title: null,
    date: "03/31",
    activityType: "tsuri",
    details: null,
  },

  // 2017年 七ヶ浜
  {
    year: 2017,
    filename: "2017/06.18.shichigahama/06.18.shichigahama",
    place: "七ヶ浜",
    title: null,
    date: "06/18",
    activityType: "tsuri",
    details: null,
  },

  // 2017年 作並
  {
    year: 2017,
    filename: "2017/07.02.sakunami/07.02.sakunami",
    place: "渓流釣り in作並",
    title: null,
    date: "07/02",
    activityType: "tsuri",
    details: null,
  },
  {
    year: 2017,
    filename: null,
    place: "ワカサギ釣り @2017",
    title: null,
    date: "03/??",
    activityType: "tsuri",
    details: null,
  },

  // 2018年 ワカサギ釣り
  {
    year: 2018,
    filename: "2018/wakasagi2018",
    place: "ワカサギ釣り",
    title: null,
    date: "02/25",
    activityType: "tsuri",
    details: null,
  },

  // 2024年 塩釜港
  {
    year: 2024,
    filename: "2024/2024_shiogama",
    place: "C3釣り紀行 in塩釜港",
    title: null,
    date: "05/17",
    activityType: "tsuri",
    details: null,
  }
];

const data2007Tabi: Omit<MountainRecord, "id">[] = [
  {
    year: 2007,
    filename: "2007/18kippu.aso/2007.09aso.beppu",
    place: "18切符で行く九州",
    title: null,
    date: "09/02～06",
    activityType: "tabi",
    details: null
  },
  {
    year: 2007,
    filename: "2007/Goshikinuma/2007623ray",
    place: "五色沼探索",
    title: null,
    date: "06/23",
    activityType: "tabi",
    details: null
  },
  {
    year: 2007,
    filename: "2007/Hotaru/20070701toho",
    place: "ホタル観賞の旅",
    title: "徒歩編",
    date: "06/30",
    activityType: "tabi",
    details: null
  },
  {
    year: 2007,
    filename: "2007/Hotaru/2007630ray",
    place: "ホタル観賞の旅",
    title: "チャリ編",
    date: "06/30",
    activityType: "tabi",
    details: null
  },
  {
    year: 2007,
    filename: "2007/Kisei/200708.yamamoto.kisei",
    place: "原付で行く帰省の旅",
    title: null,
    date: "08/06～08",
    activityType: "tabi",
    details: null
  },
  {
    year: 2007,
    filename: "2007/Michinoeki/2007428ray",
    place: "東北「道の駅」の旅 Part1",
    title: null,
    date: "04/28〜05/06",
    activityType: "tabi",
    details: null
  },
  {
    year: 2007,
    filename: "2007/Michinoeki/2007602ray",
    place: "東北「道の駅」の旅 Part2",
    title: null,
    date: "06/02～03",
    activityType: "tabi",
    details: null
  },
  {
    year: 2007,
    filename: "2007/Michinoeki/ray",
    place: "東北「道の駅」の旅　最終章",
    title: null,
    date: "07/??",
    activityType: "tabi",
    details: null
  },
  {
    year: 2007,
    filename: "2007/Momijigari/2007.momijigari",
    place: "紅葉狩り in紅葉川渓流",
    title: null,
    date: "11/03",
    activityType: "tabi",
    details: null
  },
  {
    year: 2007,
    filename: "2007/Nebuta/20070802nebuta",
    place: "鈍行列車で行くねぶた祭りの旅",
    title: null,
    date: "08/02～04",
    activityType: "tabi",
    details: null
  },
  // dataOtherから統合された2007年データ
  {
    year: 2007,
    filename: null,
    place: "大反省会＆忘年会",
    title: null,
    date: "12/14",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2007,
    filename: null,
    place: "スケート",
    title: null,
    date: "12/09",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2007,
    filename: null,
    place: "映画鑑賞会＆モツ鍋会",
    title: null,
    date: "12/02",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2007,
    filename: null,
    place: "スキー初滑りin湯殿山",
    title: null,
    date: "12/01",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2007,
    filename: null,
    place: "ぶどう狩り",
    title: null,
    date: "10/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2007,
    filename: null,
    place: "芋煮",
    title: null,
    date: "10/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2007,
    filename: null,
    place: "餃子パーティー",
    title: null,
    date: "06/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2007,
    filename: null,
    place: "潮干狩り",
    title: null,
    date: "05/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2007,
    filename: null,
    place: "新入生歓迎花見",
    title: null,
    date: "04/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2007,
    filename: null,
    place: "新入生歓迎ジンギスカン会",
    title: null,
    date: "04/??",
    activityType: "tabi",
    details: null,
  },
];

const data2008Tabi: Omit<MountainRecord, "id">[] = [
  {
    year: 2008,
    filename: "2008/Korea/2008.05.05kankoku",
    place: "犬鍋を求めて韓国旅行",
    title: null,
    date: "05/05～08",
    activityType: "tabi",
    details: null
  },
  {
    year: 2008,
    filename: null,
    place: "日本三大地獄　川原毛地獄",
    title: null,
    date: "05/31",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2008,
    filename: null,
    place: "自転車で行く「ニッカウイスキー工場＆作並温泉」",
    title: null,
    date: "06/08",
    activityType: "tabi",
    details: null,
  },
  // dataOtherから統合された2008年データ
  {
    year: 2008,
    filename: null,
    place: "北雄杯駅伝",
    title: null,
    date: "05/24",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2008,
    filename: "legacy/unavailable",
    place: "潮干狩り",
    title: null,
    date: "05/10",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2008,
    filename: null,
    place: "追いコン",
    title: null,
    date: "02/24",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2008,
    filename: null,
    place: "スキー合宿（山形蔵王）",
    title: null,
    date: "02/11～13",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2008,
    filename: null,
    place: "どんと祭はだか参り",
    title: null,
    date: "01/14",
    activityType: "tabi",
    details: null,
  },
];

const data2009Tabi: Omit<MountainRecord, "id">[] = [
  {
    year: 2009,
    filename: "2009/Hokkaido.souya.rishiri/09.9rishiri",
    place: "北海道 利尻山・宗谷岬",
    title: null,
    date: "09/19～21",
    activityType: "tabi",
    details: null
  },
  {
    year: 2009,
    filename: "2009/Hokuriku/hokuriku1",
    place: "北陸一周の旅",
    title: "Part1",
    date: "09/05～09",
    activityType: "tabi",
    details: null
  },
  {
    year: 2009,
    filename: "2009/Hokuriku/hokuriku2",
    place: "北陸一周の旅",
    title: "Part2",
    date: "09/05～09",
    activityType: "tabi",
    details: null
  },
  {
    year: 2009,
    filename: "2009/Hokuriku/hokuriku3",
    place: "北陸一周の旅",
    title: "Part3",
    date: "09/05～09",
    activityType: "tabi",
    details: null
  },
  {
    year: 2009,
    filename: "2009/Hotaru.bike/09hotaru",
    place: "ホタル観賞会(バイク組)",
    title: null,
    date: "06/26",
    activityType: "tabi",
    details: null
  },
  {
    year: 2009,
    filename: "2009/Momijigari/09.11momiji-yamadera",
    place: "紅葉狩り(紅葉側渓流～山寺)",
    title: null,
    date: "11/??",
    activityType: "tabi",
    details: null
  },
  {
    year: 2009,
    filename: "2009/Unstoppable/ray.bohsoh",
    place: "房総半島を暴走！！",
    title: null,
    date: "03/10～12",
    activityType: "tabi",
    details: null
  },
  {
    year: 2009,
    filename: "2009/Yakushima/2009.yakushima",
    place: "「屋久島」制覇の旅！！",
    title: null,
    date: "03/??",
    activityType: "tabi",
    details: null
  },
  // dataOtherから統合された2009年データ
  {
    year: 2009,
    filename: "legacy/unavailable",
    place: "新入生歓迎花見",
    title: null,
    date: "04/18～19",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2009,
    filename: "legacy/unavailable",
    place: "スキー合宿（山形蔵王）",
    title: null,
    date: "02/23～25",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2009,
    filename: "legacy/unavailable",
    place: "どんと祭",
    title: null,
    date: "01/14",
    activityType: "tabi",
    details: null,
  },
];

const data2010Tabi: Omit<MountainRecord, "id">[] = [
  { 
    year: 2010, 
    filename: "2010/Ichigogari/2010ichigogari", 
    place: "いちご狩り",
    title: null, 
    date: "05/03～05", 
    activityType: "tabi", 
    details: null 
  },
  { 
    year: 2010, 
    filename: "2010/Matsushima/matsushima", 
    place: "松島チャリ旅",
    title: null, 
    date: "09/18", 
    activityType: "tabi", 
    details: null 
  },
  { 
    year: 2010, 
    filename: "2010/MountFuji/2010huji1", 
    place: "富士の旅",
    title: "富士サファリパーク編", 
    date: "08/19～21", 
    activityType: "tabi", 
    details: null 
  },
  {
    year: 2010,
    filename: null,
    place: "青森ツーリング（1日目・2日目・3日目・最終日）",
    title: null,
    date: "08/31～09/03",
    activityType: "tabi",
    details: null,
  },
  { 
    year: 2010, 
    filename: "2010/MountFuji/2010huji2", 
    place: "富士の旅",
    title: "富士山", 
    date: "08/19～21", 
    activityType: "tabi", 
    details: null 
  },
  { 
    year: 2010, 
    filename: "2010/Ohenro/ohenro", 
    place: "カブで行く!! 四国八十八ヵ所お遍路の旅",
    title: "Part1", 
    date: "03/02～09", 
    activityType: "tabi", 
    details: null 
  },
  { 
    year: 2010, 
    filename: "2010/Ohenro/ohenro2", 
    place: "カブで行く!! 四国八十八ヵ所お遍路の旅",
    title: "Part2", 
    date: "03/02～09", 
    activityType: "tabi", 
    details: null 
  },
  { 
    year: 2010, 
    filename: "2010/Ohenro/ohenro3", 
    place: "カブで行く!! 四国八十八ヵ所お遍路の旅",
    title: "Part3", 
    date: "03/02～09", 
    activityType: "tabi", 
    details: null 
  },
  { 
    year: 2010, 
    filename: "2010/Sakunami/2010sakunami", 
    place: "バンジー＆温泉＆ニッカウヰスキーin作並",
    title: null, 
    date: "06/06", 
    activityType: "tabi", 
    details: null 
  },
  { 
    year: 2010, 
    filename: "2010/Sakurajima/2010sakurajima", 
    place: "種子島・桜島の旅",
    title: "桜島編", 
    date: "03/??", 
    activityType: "tabi", 
    details: null 
  },
  { 
    year: 2010, 
    filename: "2010/Tanegashima/2010.3tanega", 
    place: "種子島・桜島の旅",
    title: "種子島編", 
    date: "03/??", 
    activityType: "tabi", 
    details: null 
  },
  { 
    year: 2010, 
    filename: "2010/Tanegashima/tanegashima2010", 
    place: "種子島・桜島の旅",
    title: "姫路・広島編編", 
    date: "03/??", 
    activityType: "tabi", 
    details: null 
  },

  { 
    year: 2010, 
    filename: "2010/Shirakami/2010shirakami", 
    place: "白神山地",
    title: null, 
    date: "08/07～11", 
    activityType: "tabi", 
    details: null 
  },

  { 
    year: 2010, 
    filename: "2010renta1/2010renta1", 
    place: "尾瀬レンタカーの旅",
    title: "初日", 
    date: "09/21〜24", 
    activityType: "tabi", 
    details: null 
  },
  { 
    year: 2010, 
    filename: "2010renta2/2010renta2", 
    place: "尾瀬レンタカーの旅",
    title: "2日目", 
    date: "09/21〜24", 
    activityType: "tabi", 
    details: null 
  },
  { 
    year: 2010, 
    filename: "2010renta3/2010renta3", 
    place: "尾瀬レンタカーの旅",
    title: "3日目", 
    date: "09/21〜24", 
    activityType: "tabi", 
    details: null 
  },
  { 
    year: 2010, 
    filename: "2010renta4/2010renta4", 
    place: "尾瀬レンタカーの旅",
    title: "最終日", 
    date: "09/21〜24", 
    activityType: "tabi", 
    details: null 
  },
  // dataOtherから統合された2010年データ
  {
    year: 2010,
    filename: "legacy/unavailable",
    place: "スキー合宿（山形蔵王）",
    title: null,
    date: "02/23～25",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2010,
    filename: "legacy/unavailable",
    place: "1月14日　どんと祭",
    title: null,
    date: "01/14",
    activityType: "tabi",
    details: null,
  },
];

const data2011Tabi: Omit<MountainRecord, "id">[] = [
  // 24時間レンタカーの旅（全4編）
  {
    year: 2011,
    filename: "2011car24h_1/2011car24h_1",
    place: "24時間レンタカーの旅",
    title: "序章",
    date: "03/05～06",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2011,
    filename: "2011car24h_2/2011car24h_2",
    place: "24時間レンタカーの旅",
    title: "朝～夕編",
    date: "03/05～06",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2011,
    filename: "2011car24h_3/2011car24h_3",
    place: "24時間レンタカーの旅",
    title: "夜～翌朝",
    date: "03/05～06",
    activityType: "tabi",
    details: null,
  },
  
  // 帰り旅行記（全4編）
  {
    year: 2011,
    filename: "2011kaeri_1/2011kaeri_1",
    place: "24時間旅行の帰り",
    title: "その１",
    date: "03/06～08",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2011,
    filename: "2011kaeri_2/2011kaeri_2",
    place: "24時間旅行の帰り",
    title: "その２",
    date: "03/06～08",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2011,
    filename: "2011kaeri_3/2011kaeri_3",
    place: "24時間旅行の帰り",
    title: "その３",
    date: "03/06～08",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2011,
    filename: "2011kaeri_4/2011kaeri_4",
    place: "24時間旅行の帰り",
    title: "その４",
    date: "03/06～08",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2011,
    filename: "2011kaeri_4/2011kaeri_4b",
    place: "24時間旅行の帰り",
    title: "記録",
    date: "03/06～08",
    activityType: "tabi",
    details: null,
  },
  
  // 北陸レンタカー旅行
  {
    year: 2011,
    filename: "2011hokuriku/2011hokuriku",
    place: "北陸レンタカーの旅",
    title: null,
    date: "08/21～24",
    activityType: "tabi",
    details: null,
  },
  
  // 伊豆旅行記
  {
    year: 2011,
    filename: "2011izu/2011izu",
    place: "伊豆ドライブ",
    title: null,
    date: "09/07～09",
    activityType: "tabi",
    details: null,
  },
  
  // 草津温泉旅行（全3編）
  {
    year: 2011,
    filename: "2011kusatu/kusatu1/kusatu1",
    place: "草津温泉",
    title: "一日目",
    date: "03/20～22",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2011,
    filename: "2011kusatu/kusatu2/kusatu2",
    place: "草津温泉",
    title: "二日目",
    date: "03/20～22",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2011,
    filename: "2011kusatu/kusatu3/kusatu3",
    place: "草津温泉",
    title: "三日目",
    date: "03/20～22",
    activityType: "tabi",
    details: null,
  },
  
  // ベトナム・屋久島
  {
    year: 2011,
    filename: "2011vietnam/2011vietnam",
    place: "ベトナム旅行【動画】",
    title: null,
    date: "02/19～03/11",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2011,
    filename: "2011yakushima01/2011yakushima01",
    place: "屋久島・西日本満喫の旅～やくしーたんもえー～",
    title: null,
    date: "04/03～16",
    activityType: "tabi",
    details: null,
  },
  // dataOtherから統合された2011年データ
  {
    year: 2011,
    filename: "legacy/unavailable",
    place: "追いコン",
    title: null,
    date: "05/07",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2011,
    filename: "legacy/unavailable",
    place: "スキー合宿（山形蔵王）",
    title: null,
    date: "02/13～15",
    activityType: "tabi",
    details: null,
  },
];

const data2013Tabi: Omit<MountainRecord, "id">[] = [
  {
    year: 2013,
    filename: null,
    place: "鳴子温泉と松島を巡る旅",
    title: null,
    date: "12/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2013,
    filename: null,
    place: "山梨方面 富士急ハイランドを目指す旅",
    title: null,
    date: "11/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2013,
    filename: null,
    place: "北海道",
    title: null,
    date: "09/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2013,
    filename: null,
    place: "ベトナム",
    title: null,
    date: "08/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2013,
    filename: null,
    place: "ハイランドでバンジージャンプ",
    title: null,
    date: "05/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2013,
    filename: null,
    place: "一目千本桜",
    title: null,
    date: "04/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2013,
    filename: "2013.02.kitakata/newfile",
    place: "喜多方ラーメン食べ歩き&会津若松の旅",
    title: null,
    date: "02/19～21",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2013,
    filename: null,
    place: "カラオケ",
    title: null,
    date: "08/02～09/30",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2013,
    filename: null,
    place: "サーカス",
    title: null,
    date: "08/02～09/30",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2013,
    filename: null,
    place: "ラーメン食べ歩き",
    title: null,
    date: "08/02～09/30",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2013,
    filename: null,
    place: "大曲の花火",
    title: null,
    date: "08/02～09/30",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2013,
    filename: null,
    place: "花笠まつり",
    title: null,
    date: "08/02～09/30",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2013,
    filename: null,
    place: "前期セメスター打ち上げ",
    title: null,
    date: "08/07",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2013,
    filename: null,
    place: "泉ヶ岳登山(新歓登山)",
    title: null,
    date: "04/27",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2013,
    filename: null,
    place: "新入生歓迎会",
    title: null,
    date: "04/??",
    activityType: "tabi",
    details: null,
  },
];

const data2012Tabi: Omit<MountainRecord, "id">[] = [
  {
    year: 2012,
    filename: null,
    place: "猫の島",
    title: null,
    date: "11/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2012,
    filename: null,
    place: "霊山ハイキング",
    title: null,
    date: "11/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2012,
    filename: null,
    place: "東京旅行",
    title: null,
    date: "11/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2012,
    filename: null,
    place: "平泉",
    title: null,
    date: "11/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2012,
    filename: null,
    place: "インド",
    title: null,
    date: "09/18～28",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2012,
    filename: null,
    place: "タイ",
    title: null,
    date: "09/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2012,
    filename: null,
    place: "原付旅行",
    title: null,
    date: "09/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2012,
    filename: null,
    place: "富士山ハイキング",
    title: null,
    date: "09/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2012,
    filename: null,
    place: "喜多方方面18きっぷ消費旅行",
    title: null,
    date: "08/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2012,
    filename: null,
    place: "富士山ハイキング",
    title: null,
    date: "08/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2012,
    filename: "2012.05.aomori/newfile",
    place: "青森旅行",
    title: null,
    date: "05/03～04",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2012,
    filename: null,
    place: "山形花見電車旅",
    title: null,
    date: "04/30",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2012,
    filename: null,
    place: "中国",
    title: null,
    date: "03/??～04/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2012,
    filename: null,
    place: "箱根旅行",
    title: null,
    date: "03/07～09",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2012,
    filename: null,
    place: "佐渡旅行",
    title: null,
    date: "03/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2012,
    filename: null,
    place: "大阪レンタカー旅行",
    title: null,
    date: "03/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2012,
    filename: null,
    place: "東北自動車道高速無料化区間制覇の旅（高速無料化最後の数日）",
    title: null,
    date: "03/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2012,
    filename: null,
    place: "ヨーロッパ",
    title: null,
    date: "03/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2012,
    filename: null,
    place: "ふたご座流星群観測",
    title: null,
    date: "12/13",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2012,
    filename: null,
    place: "大反省会＆忘年会",
    title: null,
    date: "12/08",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2012,
    filename: null,
    place: "芋煮",
    title: null,
    date: "10/27",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2012,
    filename: null,
    place: "後期セメスターから本気出す会",
    title: null,
    date: "09/28",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2012,
    filename: null,
    place: "女川サンマ祭り",
    title: null,
    date: "09/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2012,
    filename: null,
    place: "前期セメスター打ち上げ",
    title: null,
    date: "08/07",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2012,
    filename: null,
    place: "花火大会",
    title: null,
    date: "08/05",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2012,
    filename: null,
    place: "jojo展",
    title: null,
    date: "08/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2012,
    filename: null,
    place: "新入生歓迎会",
    title: null,
    date: "04/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2012,
    filename: null,
    place: "その他いろいろ",
    title: null,
    date: "??/??",
    activityType: "tabi",
    details: null,
  },
];

const data2014Tabi: Omit<MountainRecord, "id">[] = [
  {
    year: 2014,
    filename: null,
    place: "横浜に行くB4旅行",
    title: null,
    date: "10/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2014,
    filename: null,
    place: "富山へのバイク旅",
    title: null,
    date: "09/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2014,
    filename: null,
    place: "原付でケツを破壊する東北の旅",
    title: null,
    date: "09/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2014,
    filename: null,
    place: "原付でケツを破壊する北海道の旅",
    title: null,
    date: "08/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2014,
    filename: null,
    place: "弘前へのレンタカー旅",
    title: null,
    date: "05/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2014,
    filename: null,
    place: "鈍行で行く稚内への旅×3",
    title: null,
    date: "03/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2014,
    filename: null,
    place: "コタツで鍋（野外）",
    title: null,
    date: "10/??",
    activityType: "tabi",
    details: null,
  },
];

const data2015Tabi: Omit<MountainRecord, "id">[] = [
  {
    year: 2015,
    filename: null,
    place: "タイカンボジア旅行",
    title: null,
    date: "09/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2015,
    filename: null,
    place: "東南アジア横断旅行",
    title: null,
    date: "09/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2015,
    filename: null,
    place: "屋久島",
    title: null,
    date: "09/??",
    activityType: "tabi",
    details: null,
  },
  // 48hカー潮岬往復旅行
  {
    year: 2015,
    filename: "2015car48h/48hcar-top",
    place: "48時間ぐらいレンタカー",
    title: "トップページ",
    date: "06/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2015,
    filename: "2015car48h/day1",
    place: "48時間ぐらいレンタカー",
    title: "一日目",
    date: "06/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2015,
    filename: "2015car48h/48hcar-day2",
    place: "48時間ぐらいレンタカー",
    title: "二日目",
    date: "06/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2015,
    filename: "2015car48h/toottatokoro",
    place: "48時間ぐらいレンタカー",
    title: "通ったところ",
    date: "06/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2015,
    filename: null,
    place: "銀山温泉",
    title: null,
    date: "03/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2015,
    filename: null,
    place: "マレー半島鉄道縦断の旅",
    title: null,
    date: "03/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2015,
    filename: null,
    place: "飯坂温泉に行くB3旅行",
    title: null,
    date: "02/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2015,
    filename: null,
    place: "ネパールトレッキング合宿",
    title: null,
    date: "02/??",
    activityType: "tabi",
    details: null,
  },
  // dataOtherから統合された2015年データ
  {
    year: 2015,
    filename: null,
    place: "地下鉄東西線開通ぶらり旅",
    title: null,
    date: "12/06",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2015,
    filename: null,
    place: "もう誰もメキシコ湾水をストレートで飲めないように、ミシガン湖水でメキシコ湾を割る。",
    title: null,
    date: "12/13～01/02",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2015,
    filename: null,
    place: "鳥を焼く会（大学祭）",
    title: null,
    date: "10/30",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2015,
    filename: null,
    place: "前期セメスター打ち上げ",
    title: null,
    date: "08/03",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2015,
    filename: null,
    place: "廃道めぐり　万世大路（栗子隧道）",
    title: null,
    date: "07/12",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2015,
    filename: null,
    place: "盛岡でわんこそばをアレする",
    title: null,
    date: "05/02",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2015,
    filename: null,
    place: "新歓BBQ",
    title: null,
    date: "04/18",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2015,
    filename: null,
    place: "新歓なべ",
    title: null,
    date: "04/11",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2015,
    filename: null,
    place: "タクラマカン砂漠に黄砂を返却しにいく",
    title: null,
    date: "02/18～03/03",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2015,
    filename: "other/ski2015",
    place: "スキー合宿(安比高原)",
    title: null,
    date: "02/14～15",
    activityType: "tabi",
    details: null,
  },
];

const data2016Tabi: Omit<MountainRecord, "id">[] = [
  // イスタンブール旅行
  {
    year: 2016,
    filename: "2016/Constantinopolis/istanbul",
    place: "イスタンブール",
    title: "旅行記",
    date: "03/01～09",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2016,
    filename: "2016/Constantinopolis/udon",
    place: "イスタンブール",
    title: "おまけ",
    date: "03/01～09",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2016,
    filename: "2016/Constantinopolis/udon2",
    place: "イスタンブール",
    title: "帰国後",
    date: "03/01～09",
    activityType: "tabi",
    details: null,
  },
  // 修学旅行
  {
    year: 2016,
    filename: "2016/syuugakuryokou/day1",
    place: "修学旅行",
    title: "もくじ",
    date: "03/07～14",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2016,
    filename: "2016/syuugakuryokou/day2",
    place: "修学旅行",
    title: "初日",
    date: "03/07～14",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2016,
    filename: "2016/syuugakuryokou/day3",
    place: "修学旅行",
    title: "2日目（神戸）",
    date: "03/07～14",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2016,
    filename: "2016/syuugakuryokou/day4",
    place: "修学旅行",
    title: "3日目（大阪）",
    date: "03/07～14",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2016,
    filename: "2016/syuugakuryokou/day5",
    place: "修学旅行",
    title: "4日目（奈良１）",
    date: "03/07～14",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2016,
    filename: "2016/syuugakuryokou/day6",
    place: "修学旅行",
    title: "5日目（奈良２京都１）",
    date: "03/07～14",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2016,
    filename: "2016/syuugakuryokou/day7",
    place: "修学旅行",
    title: "6日目（京都２）",
    date: "03/07～14",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2016,
    filename: "2016/syuugakuryokou/day8",
    place: "修学旅行",
    title: "7日目（京都３）",
    date: "03/07～14",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2016,
    filename: "2016/syuugakuryokou/day9",
    place: "修学旅行",
    title: "8日目（京都４）",
    date: "03/07～14",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2016,
    filename: null,
    place: "B3旅行",
    title: null,
    date: "02/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2016,
    filename: null,
    place: "B4旅行",
    title: null,
    date: "04/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2016,
    filename: null,
    place: "本州4端企画",
    title: null,
    date: "11/??",
    activityType: "tabi",
    details: null,
  },
  // dataOtherから統合された2016年データ
  {
    year: 2016,
    filename: "other/2016ohsoji",
    place: "大掃除",
    title: null,
    date: "12/10",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2016,
    filename: "other/imoni2016",
    place: "芋煮会with鍋二郎",
    title: null,
    date: "10/23",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2016,
    filename: "other/onikoube/onikoube",
    place: "温泉卵を食べたくて車を走らせたら鬼首だった日",
    title: null,
    date: "09/17",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2016,
    filename: null,
    place: "セメ終わり飲み",
    title: null,
    date: "08/08",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2016,
    filename: null,
    place: "「五.二◯黒い雨」(主犯: 原田、共犯: 坂井)",
    title: null,
    date: "05/20",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2016,
    filename: "other/wankosoba2016",
    place: "わんこそば2016",
    title: null,
    date: "05/08",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2016,
    filename: null,
    place: "新歓BBQ",
    title: null,
    date: "04/16",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2016,
    filename: null,
    place: "新歓女子会",
    title: null,
    date: "04/14",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2016,
    filename: "legacy/unavailable",
    place: "スキー合宿",
    title: null,
    date: "02/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2016,
    filename: "other/dontosai2016",
    place: "どんと祭",
    title: null,
    date: "01/14",
    activityType: "tabi",
    details: null,
  },
];

const data2017Tabi: Omit<MountainRecord, "id">[] = [
  // B5旅行 (Multiple entries from b5gj folder)
  {
    year: 2017,
    filename: "other/dontosai2017",
    place: "どんと祭",
    title: null,
    date: "01/14",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2017,
    filename: "2017/b5gj/1",
    place: "真･B5旅行～B5厄介3人組が共に大阪を目指す～",
    title: "一日目",
    date: "09/15～20", // Adjust date range as needed
    activityType: "tabi",
    details: null,
  },
  {
    year: 2017,
    filename: "2017/b5gj/2",
    place: "真･B5旅行～B5厄介3人組が共に大阪を目指す～",
    title: "二日目",
    date: "09/15～20",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2017,
    filename: "2017/b5gj/3",
    place: "真･B5旅行～B5厄介3人組が共に大阪を目指す～",
    title: "三日目",
    date: "09/15～20",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2017,
    filename: "2017/b5gj/4",
    place: "真･B5旅行～B5厄介3人組が共に大阪を目指す～",
    title: "四日目",
    date: "09/15～20",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2017,
    filename: "2017/b5gj/5",
    place: "真･B5旅行～B5厄介3人組が共に大阪を目指す～",
    title: "五日目",
    date: "09/15～20",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2017,
    filename: "2017/b5gj/6",
    place: "真･B5旅行～B5厄介3人組が共に大阪を目指す～",
    title: "六日目",
    date: "09/15～20",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2017,
    filename: "2017/b5gj/top",
    place: "真･B5旅行～B5厄介3人組が共に大阪を目指す～",
    title: "目次",
    date: "09/15～20",
    activityType: "tabi",
    details: null,
  },

  // B5温泉旅行
  {
    year: 2017,
    filename: "2017/2017b5onsen",
    place: "B5温泉旅行",
    title: null,
    date: "09/15", // Adjust date as needed
    activityType: "tabi",
    details: null,
  },

  // サハリン (樺太) 旅行
  {
    year: 2017,
    filename: "2017/2017sakhalin",
    place: "おそロシア＠樺太サハリン",
    title: "本編",
    date: "10/05～12", // Adjust date range as needed
    activityType: "tabi",
    details: null,
  },
  {
    year: 2017,
    filename: "2017/2017sakhalin2",
    place: "おそロシア＠樺太サハリン",
    title: "追記",
    date: "10/05～12", // Same date range as main entry
    activityType: "tabi", 
    details: null,
  },

  // 北陸ドライブ
  {
    year: 2017,
    filename: "2017/hokuriku",
    place: "(B6)北陸旅行",
    title: null,
    date: "03/26～30", // Date range mentioned in the content
    activityType: "tabi",
    details: null,
  },

  // 富士山登山 (【6端企画】)
  {
    year: 2017,
    filename: "2017/rokutan/fujisan/fujisan",
    place: "【6端企画】",
    title: null,
    date: "08/21～25",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2017,
    filename: "2017/rokutan/fujisan/fujicopy",
    place: "【6端企画】",
    title: null,
    date: "08/21～25",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2017,
    filename: "2017/rokutan/fujisan/fujicopy2",
    place: "【6端企画】",
    title: null,
    date: "08/21～25",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2017,
    filename: "2017/rokutan/fujisan/fujicopy3",
    place: "【6端企画】",
    title: null,
    date: "08/21～25",
    activityType: "tabi",
    details: null,
  },
  // data2017 北東低端編の例：
  // 1) 2017/09/03-06: 北東低端編 (1日目)
  {
    year: 2017,
    filename: "2017/rokutan/rokutan",
    place: "【6端企画】",
    title: "【6端企画】目次",
    date: "09/03～06",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2017,
    filename: "2017/rokutan/hokkaido/hokkaido_top",
    place: "【6端企画】",
    title: null,
    date: "09/03～06",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2017,
    filename: "2017/rokutan/hokkaido/hokkaido_day1",
    place: "【6端企画】",
    title: null,
    date: "09/03～06",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2017,
    filename: "2017/rokutan/hokkaido/hokkaido_day2",
    place: "【6端企画】",
    title: null,
    date: "09/03～06",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2017,
    filename: "2017/rokutan/hokkaido/hokkaido_day3",
    place: "【6端企画】",
    title: null,
    date: "09/03～06",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2017,
    filename: "2017/rokutan/hokkaido/hokkaido_day4",
    place: "【6端企画】",
    title: null,
    date: "09/03～06",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2017,
    filename: "2017/rokutan/hokkaido/hokkaido_addition",
    place: "【6端企画】",
    title: null,
    date: "09/03～06",
    activityType: "tabi",
    details: null,
  },
  // 【6端企画】
  {
    year: 2017,
    filename: "2017/rokutan/kyusyu/kyusyu",
    place: "【6端企画】",
    title: null,
    date: "09/05～13",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2017,
    filename: "2017/rokutan/kyusyu/ichinichime",
    place: "【6端企画】",
    title: null,
    date: "09/05～13",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2017,
    filename: "2017/rokutan/kyusyu/1",
    place: "【6端企画】",
    title: null,
    date: "09/05～13",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2017,
    filename: "2017/rokutan/kyusyu/2",
    place: "【6端企画】",
    title: null,
    date: "09/05～13",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2017,
    filename: "2017/rokutan/kyusyu/3",
    place: "【6端企画】",
    title: null,
    date: "09/05～13",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2017,
    filename: "2017/rokutan/kyusyu/yokkame",
    place: "【6端企画】",
    title: null,
    date: "09/05～13",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2017,
    filename: "2017/rokutan/kyusyu/4",
    place: "【6端企画】",
    title: null,
    date: "09/05～13",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2017,
    filename: "2017/rokutan/kyusyu/6nichime",
    place: "【6端企画】",
    title: null,
    date: "09/05～13",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2017,
    filename: "2017/rokutan/kyusyu/nanokame",
    place: "【6端企画】",
    title: null,
    date: "09/05～13",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2017,
    filename: "2017/rokutan/kyusyu/7and8",
    place: "【6端企画】",
    title: null,
    date: "09/05～13",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2017,
    filename: "2017/rokutan/kyusyu/zenpen",
    place: "【6端企画】",
    title: null,
    date: "09/05～13",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2017,
    filename: "2017/rokutan/kyusyu/tyuhen",
    place: "【6端企画】",
    title: null,
    date: "09/05～13",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2017,
    filename: "2017/rokutan/kyusyu/kouhen",
    place: "【6端企画】",
    title: null,
    date: "09/05～13",
    activityType: "tabi",
    details: null,
  },

  // 2) 2017/??/??: 船形山
  {
    year: 2017,
    filename: "2017funagata/funagata",
    place: "船形山",
    title: null,
    date: "10/16",
    activityType: "tabi",
    details: null,
  },
  // dataOtherから統合された2017年データ
  {
    year: 2017,
    filename: "other/2017gakusai",
    place: "やきとりを焼く会（大学祭）",
    title: null,
    date: "11/01～03",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2017,
    filename: "legacy/unavailable",
    place: "B7歩行",
    title: "後編",
    date: "10/07～08",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2017,
    filename: "other/2017B7hokou/hokou2",
    place: "B7歩行",
    title: "中編",
    date: "10/07～08",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2017,
    filename: "other/2017B7hokou/hokou1",
    place: "B7歩行",
    title: "前編",
    date: "10/07～08",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2017,
    filename: null,
    place: "地酒飲み",
    title: null,
    date: "09/30",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2017,
    filename: null,
    place: "Jonas来仙",
    title: null,
    date: "08/23",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2017,
    filename: "other/2017uraginza",
    place: "裏銀座",
    title: null,
    date: "08/11～14",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2017,
    filename: null,
    place: "山形花笠まつり",
    title: null,
    date: "08/07",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2017,
    filename: "other/2017nebuta",
    place: "青森ねぶた祭",
    title: null,
    date: "08/06",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2017,
    filename: "other/2017shogi",
    place: "将棋大会",
    title: null,
    date: "04/22",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2017,
    filename: "other/2017yzf-meeting",
    place: "自親会バイク勢で行くミーティング",
    title: null,
    date: "02/10",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2017,
    filename: null,
    place: "追いコン",
    title: null,
    date: "02/10",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2017,
    filename: null,
    place: "スキー合宿",
    title: null,
    date: "02/16~02/18",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2017,
    filename: null,
    place: "新歓",
    title: null,
    date: "04/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2017,
    filename: null,
    place: "無限パスタ",
    title: null,
    date: "05/07",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2017,
    filename: null,
    place: "B5小旅行in塩釜松島",
    title: null,
    date: "05/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2017,
    filename: null,
    place: "無限ギョウザ",
    title: null,
    date: "06/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2017,
    filename: "other/2017_B4ryokou",
    place: "B4旅行2017",
    title: null,
    date: "06/17〜18",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2017,
    filename: "2017/2017sisen",
    place: "四川省でMikeさんと会う",
    title: null,
    date: "02/20〜03/02",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2017,
    filename: "other/2017nagashi",
    place: "流しそうめん",
    title: null,
    date: "07/16",
    activityType: "tabi",
    details: null,
  },
];

const data2018Tabi: Omit<MountainRecord, "id">[] = [// For the first file
  {
    year: 2018,
    filename: "2018/b7inMalayPeninsula/top",
    place: "B7二人マレー半島縦断",
    title: "目次",
    date: "02/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2018,
    filename: "2018/b7inMalayPeninsula/1",
    place: "B7二人マレー半島縦断",
    title: "1日目",
    date: "02/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2018,
    filename: "2018/b7inMalayPeninsula/2",
    place: "B7二人マレー半島縦断",
    title: "2日目",
    date: "02/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2018,
    filename: "2018/b7inMalayPeninsula/3",
    place: "B7二人マレー半島縦断",
    title: "3日目",
    date: "02/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2018,
    filename: "2018/b7inMalayPeninsula/4",
    place: "B7二人マレー半島縦断",
    title: "4日目",
    date: "02/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2018,
    filename: "2018/b7inMalayPeninsula/5",
    place: "B7二人マレー半島縦断",
    title: "5日目",
    date: "02/??",
    activityType: "tabi",
    details: null,
  },{
    year: 2018,
    filename: "2018/b7Hiraizumi/top",
    place: "B7平泉",
    title: "目次",
    date: "05/04～06",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2018,
    filename: "2018/b7Hiraizumi/intro",
    place: "B7平泉",
    title: "イントロ",
    date: "05/04～06",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2018,
    filename: "2018/b7Hiraizumi/top",
    place: "B7平泉",
    title: "目次",
    date: "05/04～06",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2018,
    filename: "2018/b7Hiraizumi/intro",
    place: "B7平泉",
    title: "序章",
    date: "05/04～06",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2018,
    filename: "2018/b7Hiraizumi/day1",
    place: "B7平泉",
    title: "1日目",
    date: "05/04～06",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2018,
    filename: "2018/b7Hiraizumi/day2",
    place: "B7平泉",
    title: "2日目",
    date: "05/04～06",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2018,
    filename: "2018/b7Hiraizumi/day3",
    place: "B7平泉",
    title: "3日目",
    date: "05/04～06",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2018,
    filename: "2018/b7Hiraizumi/mamachari",
    place: "B7平泉",
    title: "ママチャリ編",
    date: "05/04～06",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2018,
    filename: "2018/b4inThailand/top",
    place: "B4卒業旅行inタイ",
    title: "もくじ",
    date: "03/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2018,
    filename: "2018/b4inThailand/1",
    place: "B4卒業旅行inタイ",
    title: "1日目",
    date: "03/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2018,
    filename: "2018/b4inThailand/2",
    place: "B4卒業旅行inタイ",
    title: "2日目",
    date: "03/??",
    activityType: "tabi",
    details: null,
  },{
    year: 2018,
    filename: "2018/b5inPRC/index",
    place: "B5仲良しトリオ シルクロードの旅",
    title: "目次",
    date: "03/15〜21",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2018,
    filename: "2018/b5inPRC/1",
    place: "B5仲良しトリオ シルクロードの旅",
    title: "西安は大都会",
    date: "03/15〜21",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2018,
    filename: "2018/b5inPRC/2",
    place: "B5仲良しトリオ シルクロードの旅", 
    title: "寝台列車はやることない",
    date: "03/15〜21",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2018,
    filename: "2018/b5inPRC/3",
    place: "B5仲良しトリオ シルクロードの旅",
    title: "莫高窟はすごい",
    date: "03/15〜21",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2018,
    filename: "2018/b5inPRC/4",
    place: "B5仲良しトリオ シルクロードの旅",
    title: "鳴沙山はすごい",
    date: "03/15〜21",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2018,
    filename: "2018/b5inPRC/5",
    place: "B5仲良しトリオ シルクロードの旅",
    title: "兵馬俑はすごい",
    date: "03/15〜21",
    activityType: "tabi",
    details: null,
  },
    // ラダックについて
    {
      year: 2018,
      filename: "2018/Ladakh/1",
      place: "ラダック旅行",
      title: "ラダックについて",
      date: "09/16～28",
      activityType: "tabi",
      details: null,
    },
    // 日本～ラダック
    {
      year: 2018,
      filename: "2018/Ladakh/2",
      place: "ラダック旅行",
      title: "日本～ラダック",
      date: "09/16～28",
      activityType: "tabi",
      details: null,
    },
    // ラダック前編
    {
      year: 2018,
      filename: "2018/Ladakh/3",
      place: "ラダック旅行",
      title: "ラダック前編",
      date: "09/16～28",
      activityType: "tabi",
      details: null,
    },
    // ラダック中編
    {
      year: 2018,
      filename: "2018/Ladakh/4",
      place: "ラダック旅行",
      title: "ラダック中編",
      date: "09/16～28",
      activityType: "tabi",
      details: null,
    },
    // ラダック後編
    {
      year: 2018,
      filename: "2018/Ladakh/5",
      place: "ラダック旅行",
      title: "ラダック後編",
      date: "09/16～28",
      activityType: "tabi",
      details: null,
    },
    // 帰路
    {
      year: 2018,
      filename: "2018/Ladakh/6",
      place: "ラダック旅行",
      title: "帰路",
      date: "09/16～28",
      activityType: "tabi",
      details: null,
    },
    // まとめ
    {
      year: 2018,
      filename: "2018/Ladakh/7",
      place: "ラダック旅行",
      title: "まとめ",
      date: "09/16～28",
      activityType: "tabi",
      details: null,
    },
    // 目次
    {
      year: 2018,
      filename: "2018/Ladakh/mokuji",
      place: "ラダック旅行",
      title: "もくじ",
      date: "09/16～28",
      activityType: "tabi",
      details: null,
    },
    {
      year: 2018,
      filename: "2018/hachimantai/hachimantai",
      place: "八幡平",
      title: null,
      date: "05/06",
      activityType: "tabi",
      details: null,
    },
    {
      year: 2018, 
      filename: "2018/tyuukikyanpu/tyuukikyanpu",
      place: "中期キャンプ",
      title: null,
      date: "09/12～13",
      activityType: "tabi",
      details: null,
    },
    // メンバー紹介
    {
      year: 2018,
      filename: "2018/shikoku88/sikoku88.syoukai",
      place: "四国八十八箇所巡り",
      title: "メンバー紹介",
      date: "02/26～03/06",
      activityType: "tabi",
      details: null,
    },
    // 前編 2/26-27
    {
      year: 2018,
      filename: "2018/shikoku88/shikoku88.zenpen",
      place: "四国八十八箇所巡り",
      title: "前編",
      date: "02/26～03/06",
      activityType: "tabi",
      details: null,
    },
    // 後編 3/5-6
    {
      year: 2018,
      filename: "2018/shikoku88/shikoku88.kouhen",
      place: "四国八十八箇所巡り",
      title: "後編",
      date: "02/26～03/06",
      activityType: "tabi",
      details: null,
    },
      // 1) 2018/08/17～21: 長期山行
      {
        year: 2018,
        filename: "2018/xinjiang/top",
        place: "中国西域辺境一人旅～新疆ウイグル自治区編～",
        title: "目次",
        date: "04/25〜05/04",
        activityType: "tabi",
        details: null,
      },
      {
        year: 2018,
        filename: "2018/xinjiang/1st",
        place: "中国西域辺境一人旅～新疆ウイグル自治区編～",
        title: "1日目",
        date: "04/25〜05/04",
        activityType: "tabi",
        details: null,
      },
      {
        year: 2018,
        filename: "2018/xinjiang/2nd",
        place: "中国西域辺境一人旅～新疆ウイグル自治区編～",
        title: "2日目",
        date: "04/25〜05/04",
        activityType: "tabi",
        details: null,
      },
      {
        year: 2018,
        filename: "2018/xinjiang/3rd",
        place: "中国西域辺境一人旅～新疆ウイグル自治区編～",
        title: "3日目",
        date: "04/25〜05/04",
        activityType: "tabi",
        details: null,
      },
      {
        year: 2018,
        filename: "2018/xinjiang/4thday",
        place: "中国西域辺境一人旅～新疆ウイグル自治区編～",
        title: "4日目",
        date: "04/25〜05/04",
        activityType: "tabi",
        details: null,
      },
      {
        year: 2018,
        filename: "2018/xinjiang/5th",
        place: "中国西域辺境一人旅～新疆ウイグル自治区編～",
        title: "5日目",
        date: "04/25〜05/04",
        activityType: "tabi",
        details: null,
      },
      {
        year: 2018,
        filename: "2018/xinjiang/6th",
        place: "中国西域辺境一人旅～新疆ウイグル自治区編～",
        title: "6日目",
        date: "04/25〜05/04",
        activityType: "tabi",
        details: null,
      },
      {
        year: 2018,
        filename: "2018/xinjiang/7th",
        place: "中国西域辺境一人旅～新疆ウイグル自治区編～",
        title: "7日目",
        date: "04/25〜05/04",
        activityType: "tabi",
        details: null,
      },
      {
        year: 2018,
        filename: "2018/xinjiang/8th",
        place: "中国西域辺境一人旅～新疆ウイグル自治区編～",
        title: "8日目",
        date: "04/25〜05/04",
        activityType: "tabi",
        details: null,
      },
      {
        year: 2018,
        filename: "2018/xinjiang/9th",
        place: "中国西域辺境一人旅～新疆ウイグル自治区編～",
        title: "9日目",
        date: "04/25〜05/04",
        activityType: "tabi",
        details: null,
      },
      {
        year: 2018,
        filename: "2018/xinjiang/10th",
        place: "中国西域辺境一人旅～新疆ウイグル自治区編～",
        title: "10日目",
        date: "04/25〜05/04",
        activityType: "tabi",
        details: null,
      },
      // 他のカテゴリーも同様に追加
      {
        year: 2018,
        filename: "2018/yurucamp/yurucampniku",
        place: "ゆるキャン 2018年度ゆるキャン△",
        title: "肉車班",
        date: "12/08～09",
        activityType: "tabi",
        details: null,
      },
      {
        year: 2018,
        filename: "2018/yurucampfish/fish",
        place: "ゆるキャン 2018年度ゆるキャン△",
        title: "魚車班",
        date: "12/08～09",
        activityType: "tabi",
        details: null,
      },
      {
        year: 2018,
        filename: "2018B8soukou/B8soukou-matsushima",
        place: "B8走行 松島編",
        title: "前哨戦",
        date: "08/05～31",
        activityType: "tabi",
        details: null,
      },
      {
        year: 2018,
        filename: "2018B8soukou/B8soukou.1",
        place: "B8走行 松島編",
        title: "一日目",
        date: "08/05～31",
        activityType: "tabi",
        details: null,
      },
      {
        year: 2018,
        filename: "2018B8soukou/B8soukou.2",
        place: "B8走行 松島編",
        title: "二日目",
        date: "08/05～31",
        activityType: "tabi",
        details: null,
      },
      {
        year: 2018,
        filename: "2018B8soukou/B8soukou.3",
        place: "B8走行 松島編",
        title: "三日目",
        date: "08/05～31",
        activityType: "tabi",
        details: null,
      },
      // dataOtherから統合された2018年データ
      {
        year: 2018,
        filename: null,
        place: "お茶会",
        title: null,
        date: "07/01",
        activityType: "tabi",
        details: null,
      },
      {
        year: 2018,
        filename: null,
        place: "山菜採り",
        title: null,
        date: "05/20",
        activityType: "tabi",
        details: null,
      },
      {
        year: 2018,
        filename: null,
        place: "キャンプツーリング",
        title: null,
        date: "04/??",
        activityType: "tabi",
        details: null,
      },
      {
        year: 2018,
        filename: null,
        place: "卒業式",
        title: null,
        date: "03/27",
        activityType: "tabi",
        details: null,
      },
      {
        year: 2018,
        filename: "other/ski2018/skitengen2018",
        place: "スキー合宿",
        title: null,
        date: "02/12～14",
        activityType: "tabi",
        details: null,
      },
      {
        year: 2018,
        filename: "other/shinkan2018/index",
        place: "新歓2018",
        title: null,
        date: "04/??",
        activityType: "tabi",
        details: null,
      },
      {
        year: 2018,
        filename: "other/shinkan2018/closed",
        place: "新歓2018",
        title: "終了後",
        date: "04/??",
        activityType: "tabi",
        details: null,
      },
      {
        year: 2018,
        filename: null,
        place: "追いコン",
        title: null,
        date: "02/03",
        activityType: "tabi",
        details: null,
      },
      {
        year: 2018,
        filename: "other/2018donto",
        place: "どんと祭",
        title: null,
        date: "01/14",
        activityType: "tabi",
        details: null,
      },
  ];

const data2019Tabi: Omit<MountainRecord, "id">[] = [
  // エベレスト
  {
    year: 2019,
    filename: "2019/everest/mokuji",
    place: "エベレスト",
    title: "目次",
    date: "02/24～03/18",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2019,
    filename: "2019/everest/mokuji2",
    place: "エベレスト",
    title: "目次2",
    date: "02/24～03/18",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2019,
    filename: "2019/everest/1",
    place: "エベレスト",
    title: "1",
    date: "02/24～03/18",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2019,
    filename: "2019/everest/2",
    place: "エベレスト",
    title: "2",
    date: "02/24～03/18",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2019,
    filename: "2019/everest/3",
    place: "エベレスト",
    title: "3",
    date: "02/24～03/18",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2019,
    filename: "2019/everest/4",
    place: "エベレスト",
    title: "4",
    date: "02/24～03/18",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2019,
    filename: "2019/everest/5",
    place: "エベレスト",
    title: "5",
    date: "02/24～03/18",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2019,
    filename: "2019/everest/6",
    place: "エベレスト",
    title: "6",
    date: "02/24～03/18",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2019,
    filename: "2019/everest/7",
    place: "エベレスト",
    title: "7",
    date: "02/24～03/18",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2019,
    filename: "2019/everest/8",
    place: "エベレスト",
    title: "8",
    date: "02/24～03/18",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2019,
    filename: "2019/everest/9",
    place: "エベレスト",
    title: "9",
    date: "02/24～03/18",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2019,
    filename: "2019/everest/10",
    place: "エベレスト",
    title: "10",
    date: "02/24～03/18",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2019,
    filename: "2019/everest/11",
    place: "エベレスト",
    title: "11",
    date: "02/24～03/18",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2019,
    filename: "2019/everest/12",
    place: "エベレスト",
    title: "12",
    date: "02/24～03/18",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2019,
    filename: "2019/everest/13",
    place: "エベレスト",
    title: "13",
    date: "02/24～03/18",
    activityType: "tabi",
    details: null,
  },
  // B8旅行
  {
    year: 2019,
    filename: "2019/B8/B8ryokou",
    place: "B8旅行",
    title: "目次",
    date: "09/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2019,
    filename: "2019/B8/member",
    place: "B8旅行",
    title: "メンバー",
    date: "09/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2019,
    filename: "2019/B8/1day",
    place: "B8旅行",
    title: "1日目",
    date: "09/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2019,
    filename: "2019/B8/2day",
    place: "B8旅行",
    title: "2日目",
    date: "09/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2019,
    filename: "2019/B8/3day",
    place: "B8旅行",
    title: "3日目",
    date: "09/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2019,
    filename: "2019/B8/4day",
    place: "B8旅行",
    title: "4日目",
    date: "09/??",
    activityType: "tabi",
    details: null,
  },
  // 北海道
  {
    year: 2019,
    filename: "2019/hokkaidoh/mokuji",
    place: "北海道",
    title: "目次",
    date: "08/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2019,
    filename: "2019/hokkaidoh/mokuji2",
    place: "北海道",
    title: "目次2",
    date: "08/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2019,
    filename: "2019/hokkaidoh/1",
    place: "北海道",
    title: "1",
    date: "08/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2019,
    filename: "2019/hokkaidoh/2",
    place: "北海道",
    title: "2",
    date: "08/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2019,
    filename: "2019/hokkaidoh/3",
    place: "北海道",
    title: "3",
    date: "08/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2019,
    filename: "2019/hokkaidoh/4",
    place: "北海道",
    title: "4",
    date: "08/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2019,
    filename: "2019/hokkaidoh/5",
    place: "北海道",
    title: "5",
    date: "08/??",
    activityType: "tabi",
    details: null,
  },
  // 尾瀬
  {
    year: 2019,
    filename: "2019/2019.oze/ooze2019",
    place: "燧ヶ岳",
    title: null,
    date: "08/25",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2019,
    filename: "2019/2019.oze.inoba/201909oze",
    place: "個人山行尾瀬",
    title: null,
    date: "09/14~16",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2019,
    filename: null,
    place: "B7旅行",
    title: null,
    date: "03/25~26",
    activityType: "tabi",
    details: null,
  },
  // 中期キャンプ
  {
    year: 2019,
    filename: "2019/2019.chuki-camp/2019chuki",
    place: "中期キャンプ",
    title: null,
    date: "09/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2019,
    filename: "other/2019.yurucam/2019.yurucam",
    place: "ゆるキャン△",
    title: null,
    date: "12/07～08",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2019,
    filename: "other/2019.hutakuti_rindo/1",
    place: "紅葉サイクリング（二口林道）",
    title: null,
    date: "11/02",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2019,
    filename: "other/2019haikyogw/haikyogw",
    place: "化女沼観光",
    title: null,
    date: "03/31",
    activityType: "tabi",
    details: null,
  },
  
  {
    year: 2019,
    filename: null,
    place: "追いコン",
    title: null,
    date: "02/10",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2019,
    filename: null,
    place: "どんと祭",
    title: null,
    date: "01/14",
    activityType: "tabi",
    details: null,
  },
];

const data2020Tabi: Omit<MountainRecord, "id">[] = [
  // 2020年のコロナ禍により旅行記録が少ない可能性がありますが、
  // 既存のファイルがあれば追加します
  
];
const data2021Tabi: Omit<MountainRecord, "id">[] = [
  {
    year: 2021,
    filename: "2021/0-1day",
    place: "C0旅行",
    title: "0-1日目",
    date: "09/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2021,
    filename: "2021/2day",
    place: "C0旅行",
    title: "2日目",
    date: "09/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2021,
    filename: "2021/3day",
    place: "C0旅行",
    title: "3日目",
    date: "09/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2021,
    filename: "2021/member",
    place: "C0旅行",
    title: "メンバー",
    date: "09/??",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2021,
    filename: "2021/asahi",
    place: "C0山行in朝日連峰",
    title: null,
    date: "09/28〜29",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2021,
    filename: "2021/oze",
    place: "C0中期山行in尾瀬",
    title: null,
    date: "09/09〜11",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2021,
    filename: "other/2021C0hokou/hokou",
    place: "C0歩行",
    title: null,
    date: "07/10",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2021,
    filename: null,
    place: "C0旅行in北海道",
    title: null,
    date: "09/17～22",
    activityType: "tabi",
    details: null,
  },
  
  
];

const data2022Tabi: Omit<MountainRecord, "id">[] = [
  {
    year: 2022,
    filename: "2022/azumabandai",
    place: "C0山行in吾妻小富士",
    title: null,
    date: "10/22",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2022,
    filename: "other/2022C0camp/camp",
    place: "C0キャンプin岩手",
    title: null,
    date: "05/04～05",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2022,
    filename: null,
    place: "C0旅行in新潟",
    title: null,
    date: "09/12～14",
    activityType: "tabi",
    details: null,
  },
  
];

const data2023Tabi: Omit<MountainRecord, "id">[] = [
  {
    year: 2023,
    filename: "2023/hayatine",
    place: "個人山行in早池峰山",
    title: null,
    date: "06/03",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2023,
    filename: "other/2023C0ryokou/ryokou",
    place: "C0旅行in栃木群馬",
    title: null,
    date: "03/13～15",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2023,
    filename: "other/2023C0kaigai/index",
    place: "C0旅行inインドネシア",
    title: "目次",
    date: "09/02～10",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2023,
    filename: "other/2023C0kaigai/9-2",
    place: "C0旅行inインドネシア",
    title: "9/2",
    date: "09/02～10",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2023,
    filename: "other/2023C0kaigai/9-3",
    place: "C0旅行inインドネシア",
    title: "9/3",
    date: "09/02～10",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2023,
    filename: "other/2023C0kaigai/9-4",
    place: "C0旅行inインドネシア",
    title: "9/4",
    date: "09/02～10",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2023,
    filename: "other/2023C0kaigai/9-5",
    place: "C0旅行inインドネシア",
    title: "9/5",
    date: "09/02～10",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2023,
    filename: "other/2023C0kaigai/9-6",
    place: "C0旅行inインドネシア",
    title: "9/6",
    date: "09/02～10",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2023,
    filename: "other/2023C0kaigai/9-7",
    place: "C0旅行inインドネシア",
    title: "9/7",
    date: "09/02～10",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2023,
    filename: "other/2023C0kaigai/9-8",
    place: "C0旅行inインドネシア",
    title: "9/8",
    date: "09/02～10",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2023,
    filename: "other/2023C0kaigai/9-9",
    place: "C0旅行inインドネシア",
    title: "9/9",
    date: "09/02～10",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2023,
    filename: "other/2023C0kaigai/9-10",
    place: "C0旅行inインドネシア",
    title: "9/10",
    date: "09/02～10",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2023,
    filename: "other/2023C0kaigai/9-extra",
    place: "C0旅行inインドネシア",
    title: "おまけ",
    date: "09/02～10",
    activityType: "tabi",
    details: null,
  },
  {
    year: 2023,
    filename: "other/2023C0kaigai/9-omake",
    place: "C0旅行inインドネシア",
    title: "おまけ2",
    date: "09/02～10",
    activityType: "tabi",
    details: null,
  },
  
];



// 他の年度も同様に data20xx を定義してください。
// 例：const data2024: Omit<MountainRecord, "id">[] = [ ... ];

//
// すべての年度のデータを結合
//


//
// すべての年度のデータを結合
//
const allData: Omit<MountainRecord, "id">[] = [
  ...dataTsuri,
  ...data2007Tabi,
  ...data2008Tabi,
  ...data2009Tabi,
  ...data2010Tabi,
  ...data2011Tabi,
  ...data2012Tabi,
  ...data2013Tabi,
  ...data2014Tabi,
  ...data2015Tabi,
  ...data2016Tabi,
  ...data2017Tabi,
  ...data2018Tabi,
  ...data2019Tabi,
  ...data2020Tabi,
  ...data2021Tabi,
  ...data2022Tabi,
  ...data2023Tabi,
];

// =====================================
// 画像ファイルを Supabase にアップロードしてパブリック URL を取得する
// =====================================
async function uploadImageToSupabase(localFilePath: string, year: number, folderName: string) {
  const fileName = path.basename(localFilePath);
  // バケット名は "images" なので、storagePath にはバケット内のパスのみを指定
  const storagePath = `${year}/${folderName}/${fileName}`;

  // ファイル読み込み
  const fileBuffer = fs.readFileSync(localFilePath);

  // アップロード
  const { data, error } = await supabase.storage
    .from("images")
    .upload(storagePath, fileBuffer, {
      contentType: "image/jpeg", // 必要に応じて拡張子で切り替え
      upsert: true,
    });
  if (error) {
    console.error(`❌ 画像アップロード失敗: ${localFilePath}`, error);
    return null;
  }

  // パブリック URL を返す（バケット名 "images" + data.path）
  return `${NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${data.path}`;
}

// =====================================
// ローカル Markdown / MDX ファイルを読み込み、
// - frontmatter 削除
// - import 行を解析し、画像をアップロード
// - <Image src={変数} /> をパブリック URL に置換
// - "import { Image } from 'astro:assets'" も削除
// - 最終的な content と images 配列を返す
// =====================================
async function loadLocalContent(baseFilename: string, activityType: string) {
  const CWD = process.cwd();

  // 優先順位で候補パスを列挙
  // 1) src/content/<activityType>/<base>.md(x)
  // 2) baseFilename の先頭セグメントを content 直下のルートとして扱う（例: other/imoni2016 → src/content/other/imoni2016.md）
  // 3) 最後のフォールバック: src/content/<base>.md(x)
  const buildCandidates = (base: string) => {
    const candidates: string[] = [];
    const baseDirActivity = path.join(CWD, "src", "content", activityType);
    candidates.push(path.join(baseDirActivity, `${base}.md`));
    candidates.push(path.join(baseDirActivity, `${base}.mdx`));

    if (base.includes("/")) {
      const [first, ...restParts] = base.split("/");
      const rest = restParts.join("/");
      if (first) {
        const altDir = path.join(CWD, "src", "content", first);
        if (rest) {
          candidates.push(path.join(altDir, `${rest}.md`));
          candidates.push(path.join(altDir, `${rest}.mdx`));
        } else {
          candidates.push(path.join(altDir, `index.md`));
          candidates.push(path.join(altDir, `index.mdx`));
        }
      }
    }

    const rootDir = path.join(CWD, "src", "content");
    candidates.push(path.join(rootDir, `${base}.md`));
    candidates.push(path.join(rootDir, `${base}.mdx`));
    return candidates;
  };

  const candidates = buildCandidates(baseFilename);

  let targetFile = "";
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      targetFile = p;
      break;
    }
  }

  if (!targetFile) {
    console.warn(
      `⚠️ ファイルが見つかりません: ${candidates.join(" / ")}`
    );
    return { content: "", images: [] };
  }

  const folderPath = path.dirname(targetFile);

  let raw = fs.readFileSync(targetFile, "utf-8");

  // frontmatter を削除
  raw = raw.replace(/^---[\s\S]*?---\s*/, "");

  // ================================
  // import 行を解析して、変数名 -> ローカル画像ファイルパス のマップを作る
  // ================================
  // 例: import IMGP1150 from './clip_image021.jpg'
  const importRegex = /import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/g;
  let match;
  const varToLocalPath: Record<string, string> = {};

  while ((match = importRegex.exec(raw)) !== null) {
    const varName = match[1];         // 例: IMGP1150
    const relativeImgPath = match[2]; // 例: './clip_image021.jpg'

    // ローカル画像ファイルの絶対パスを組み立て
    const localImgPath = path.join(folderPath, relativeImgPath.replace(/^\.\//, ""));
    varToLocalPath[varName] = localImgPath;
  }

  // 行ごとにフィルタリングして、`import ...` や `import { Image } from 'astro:assets'` を削除
  const lines = raw.split("\n").filter(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith("import ")) {
      return false; // すべての import 行を削除
    }
    // あるいは、特定の行だけ削除したい場合は、
    // if (trimmed.includes("import { Image } from 'astro:assets'")) return false;
    return true;
  });
  raw = lines.join("\n").trim();

  // ================================
  // Supabase に画像をアップロードして、変数名 -> パブリックURL に変換
  // ================================
  const varToPublicUrl: Record<string, string> = {};
  for (const [varName, localImgPath] of Object.entries(varToLocalPath)) {
    if (!fs.existsSync(localImgPath)) {
      console.warn(`⚠️ 画像ファイルが見つかりません: ${localImgPath}`);
      continue;
    }
    // フォルダ名には最後のディレクトリを使うなど、適宜
    const folderName = path.basename(path.dirname(localImgPath));
    // ファイル名から年度を推測
    const yearMatch = baseFilename.match(/^(\d{4})/);
    const year = yearMatch ? parseInt(yearMatch[1], 10) : new Date().getFullYear();

    const publicUrl = await uploadImageToSupabase(localImgPath, year, folderName);
    if (publicUrl) {
      varToPublicUrl[varName] = publicUrl;
    }
  }

  // ================================
  // <Image src={変数} alt="" /> を探し、パブリック URL に置換
  // ================================
  // 例: <Image src={IMGP1150} alt="" />
  const imageTagRegex = /<Image\s+([^>]*?)src=\{(\w+)\}([^>]*)>/g;
  const replacedContent = raw.replace(imageTagRegex, (full, before, varName, after) => {
    const url = varToPublicUrl[varName] || "";
    return `<Image ${before}src="${url}"${after}>`;
  });

  // ================================
  // 画像一覧を images[] に入れる (パブリック URL のみ)
  // ================================
  const images = Object.values(varToPublicUrl);

  return { content: replacedContent, images };
}

// =====================================
// ヘルパー関数: グループキー取得
// =====================================
function getGroupKey(record: Omit<MountainRecord, "id">): string {
  return record.place || record.title || "不明";
}

// =====================================
// フォルダをスキャンして自動的にレコードを作成
// =====================================
async function scanAndCreateRecords(activityType: string) {
  // allDataに既に登録されているfilenameを収集（重複を避けるため）
  const existingFilenames = new Set<string>();
  for (const record of allData) {
    if (record.filename && record.activityType === activityType) {
      existingFilenames.add(record.filename);
    }
  }

  const contentDir = path.join(process.cwd(), "src", "content", activityType);
  if (!fs.existsSync(contentDir)) {
    console.warn(`⚠️ ディレクトリが見つかりません: ${contentDir}`);
    return [];
  }

  const records: Omit<MountainRecord, "id">[] = [];
  
  // 年度フォルダをスキャン
  const yearFolders = fs.readdirSync(contentDir).filter(item => {
    const fullPath = path.join(contentDir, item);
    return fs.statSync(fullPath).isDirectory();
  });

  for (const yearFolder of yearFolders) {
    // 年度を抽出
    const yearMatch = yearFolder.match(/^(\d{4})/);
    const year = yearMatch ? parseInt(yearMatch[1], 10) : new Date().getFullYear();
    
    const yearPath = path.join(contentDir, yearFolder);
    
    // 年度フォルダ内のすべてのファイルとフォルダを取得
    const scanDir = (dir: string, basePath: string = "") => {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const relativePath = path.join(basePath, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          // サブフォルダをスキャン
          scanDir(fullPath, relativePath);
        } else if (item.endsWith(".md") || item.endsWith(".mdx")) {
          // index.md は除外
          if (item === "index.md" || item === "index.mdx") continue;
          
          // ファイル名から情報を抽出
          const fileNameWithoutExt = item.replace(/\.(md|mdx)$/, "");
          const filename = path.join(yearFolder, relativePath).replace(/\.(md|mdx)$/, "");
          
          // 既にallDataに存在するファイルはスキップ
          if (existingFilenames.has(filename)) {
            console.log(`⏭️ スキップ（allDataに登録済み）: ${filename}`);
            continue;
          }
          
          // placeはフォルダ名、titleはファイル名から推測
          const folderName = path.dirname(relativePath);
          const place = folderName === "." ? yearFolder : folderName;
          const title = fileNameWithoutExt;
          
          records.push({
            year,
            filename,
            place,
            title,
            date: `${year}`,
            activityType,
            details: null,
          });
        }
      }
    };
    
    scanDir(yearPath);
  }

  return records;
}

// otherフォルダ専用のスキャン関数（年度フォルダなしで直接ファイルを配置）
async function scanOtherFolder() {
  const contentDir = path.join(process.cwd(), "src", "content", "other");
  if (!fs.existsSync(contentDir)) {
    console.warn(`⚠️ ディレクトリが見つかりません: ${contentDir}`);
    return [];
  }

  // allDataに既に登録されているfilenameを収集（重複を避けるため）
  const existingFilenames = new Set<string>();
  for (const record of allData) {
    if (record.filename) {
      // "other/xxx" 形式のファイル名から "xxx" 部分を抽出
      const baseName = record.filename.startsWith("other/") 
        ? record.filename.replace("other/", "").split("/")[0]
        : record.filename;
      existingFilenames.add(baseName);
    }
  }

  const records: Omit<MountainRecord, "id">[] = [];
  
  // otherフォルダ内のすべてのファイルを直接スキャン
  const items = fs.readdirSync(contentDir);
  
  for (const item of items) {
    const fullPath = path.join(contentDir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isFile() && (item.endsWith(".md") || item.endsWith(".mdx"))) {
      // index.md は除外
      if (item === "index.md" || item === "index.mdx") continue;
      
      // ファイル名から情報を抽出
      const fileNameWithoutExt = item.replace(/\.(md|mdx)$/, "");
      
      // 既にallDataに存在するファイルはスキップ
      if (existingFilenames.has(fileNameWithoutExt)) {
        console.log(`⏭️ スキップ（既に登録済み）: ${fileNameWithoutExt}`);
        continue;
      }
      
      const filename = fileNameWithoutExt; // パスはファイル名のみ
      
      // ファイル名から年度を抽出（例: 2016ohsoji.mdx → 2016）
      // ファイル名の任意の位置にある4桁の年度を探す
      const yearMatch = fileNameWithoutExt.match(/(\d{4})/);
      const year = yearMatch ? parseInt(yearMatch[1], 10) : new Date().getFullYear();
      
      records.push({
        year,
        filename,
        place: fileNameWithoutExt,
        title: fileNameWithoutExt,
        date: `${year}`,
        activityType: "other", // otherフォルダの内容はotherとして扱う
        details: null,
      });
    }
  }

  return records;
}

// =====================================
// メイン処理
// =====================================
async function main() {
  console.log("🚀 明示的データ + 自動スキャン + Astro 画像置換のインポート開始");

  // tabi と other(tsuri) のデータを自動スキャンで追加
  console.log("\n📂 tabi フォルダをスキャン中...");
  const tabiRecords = await scanAndCreateRecords("tabi");
  console.log(`  ✅ ${tabiRecords.length} 件のファイルを検出`);
  
  console.log("\n📂 other フォルダ (activityType: tsuri) をスキャン中...");
  const tsuriRecords = await scanOtherFolder();
  console.log(`  ✅ ${tsuriRecords.length} 件のファイルを検出 (activityType: tsuri)`);

  // すべてのデータを結合
  const allRecords = [...allData, ...tabiRecords, ...tsuriRecords];
  console.log(`\n📊 総レコード数: ${allRecords.length} 件`);

  // (year, activityType, place/title) ごとにグループ化
  const groups = new Map<string, Omit<MountainRecord, "id">[]>();
  for (const record of allRecords) {
    const key = `${record.year}-${record.activityType}-${getGroupKey(record)}`;
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(record);
  }

  let createdRecords = 0;
  let updatedRecords = 0;
  let createdContents = 0;
  let updatedContents = 0;
  let totalContentItems = 0;
  const totalGroups = groups.size;

  for (const [, records] of groups.entries()) {
    const base = records[0];
    const groupPlace = getGroupKey(base);

    // Record 重複チェック
    const existingRecord = await prisma.record.findFirst({
      where: {
        year: base.year,
        activityType: base.activityType,
        place: groupPlace,
      },
    });

    let recordId: number;
    if (existingRecord) {
      // 既存のRecordを更新
      const updatedRecord = await prisma.record.update({
        where: { id: existingRecord.id },
        data: {
          date: base.date,
          place: groupPlace,
          details: base.details || existingRecord.details,
        },
      });
      recordId = updatedRecord.id;
      updatedRecords++;
      console.log(`♻️ Record 更新: ${groupPlace} (${base.year}年)`);
    } else {
      const newRecord = await prisma.record.create({
        data: {
          year: base.year,
          date: base.date,
          place: groupPlace,
          activityType: base.activityType,
          details: base.details,
        },
      });
      recordId = newRecord.id;
      createdRecords++;
      console.log(`✅ Record 作成: ${groupPlace} (${base.year}年)`);
    }

    // filename があるものを Content に登録
    for (const item of records) {
      if (!item.filename) continue;
      totalContentItems++;

      try {
        // "legacy/unavailable" の場合はユニークなfilenameを生成
        let uniqueFilename = item.filename;
        if (item.filename === "legacy/unavailable") {
          // 年度、場所、タイトルを組み合わせてユニークにする
          const suffix = `${item.year}_${item.place || 'unknown'}_${item.title || 'untitled'}`.replace(/[\/\s]/g, '_');
          uniqueFilename = `legacy/unavailable_${suffix}`;
        }

        // ファイル読み込み + 画像アップロード + Astro置換
        const { content, images } = await loadLocalContent(item.filename, base.activityType);

        // filenameでユニーク検索（recordIdに関係なく）
        const existingContent = await prisma.content.findFirst({
          where: {
            filename: uniqueFilename,
          },
        });

        if (existingContent) {
          // 既存のContentを更新（recordIdも更新して正しいRecordに紐付ける）
          await prisma.content.update({
            where: { id: existingContent.id },
            data: {
              recordId,
              title: item.title ?? existingContent.title,
              content: content || existingContent.content,
              images: images.length ? images : (existingContent.images as any),
            },
          });
          updatedContents++;
          console.log(`♻️ Content 更新: ${uniqueFilename}`);
        } else {
          // 新規作成
          await prisma.content.create({
            data: {
              recordId,
              title: item.title,
              filename: uniqueFilename,
              content,
              images,
            },
          });
          createdContents++;
          console.log(`✅ Content 作成: ${uniqueFilename}`);
        }
      } catch (error) {
        console.error(`❌ エラー: ${item.filename}`, error);
        // エラーが発生しても次の処理を続ける
        continue;
      }
    }
  }

  console.log("===========================================");
  console.log(`✅ 総グループ数（Record）: ${totalGroups} 件`);
  console.log(`✅ 新規作成された Record: ${createdRecords} 件`);
  console.log(`♻️ 更新された Record: ${updatedRecords} 件`);
  console.log(`✅ 総 Content 件数: ${totalContentItems} 件`);
  console.log(`✅ 新規作成された Content: ${createdContents} 件`);
  console.log(`♻️ 更新された Content: ${updatedContents} 件`);
  console.log("🚀 インポート処理が完了しました！");

  await prisma.$disconnect();
}

main().catch(console.error);