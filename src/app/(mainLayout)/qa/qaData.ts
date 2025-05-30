export type QaCategory = "登山編" | "釣り編" | "旅行編" | "その他編";

export type QaItem = {
  question: string;
  answer: string;
};

export const qaData: Record<QaCategory, QaItem[]> = {
    "登山編": [
      {
        question: "なんで山に登るの？",
        answer: "「そこに山があるから」(ジョージ・マロリー)\n\n...というのは決まり文句ですね。\n\n大自然を肌で感じることの感動とか、自分の足で登頂したという達成感とかでしょうか。\n\n自親会には、「そんなに山は好きじゃない」っていう人も数人います。\n\n活動は登山だけではないですから、そんな人も大歓迎ですよ。",
      },
      {
        question: "山なんて登ったことないよ…",
        answer: "そんなものですよ。\n\n経験者より未経験者のほうが圧倒的に多いです。\n\nせっかく大学生になったんだから、興味を持ったことにどんどんチャレンジしましょう！\n\n新歓の時期に体験登山を実施してますから、まずは登ってみるといいと思います。",
      },
      {
        question: "体力に自信が無いんだけど…",
        answer: "文化部出身の女の子も体力テスト学年ビリもいるから大丈夫。\n\n最初は小学生でも登るようなとこに行きます。\n\n意外とすぐに体力は付きますよ- ",
      },
      {
        question: "道具を持ってないんですが…",
        answer: "貸し出せるものもありますが数に限りがございます。\n\n頻繁に登るぞ！という新入生は先輩が付き添ってみんなで専門店に買いにいきますよ。\n\nなので初期費用が8万~てとこでしょうか。\n\n雨具や寝袋は基本的に買っていただくようにしています。",
      },
      {
        question: "山に行くまでの流れは？",
        answer: "基本月に2回（二週に一回）登ります。\n\n登山のある週の月曜日に地図あわせ（1時間強）、水曜日にチェック（2時間弱）があります。\n\nそして金曜日に最終チェックを行います。\n\nその回の山に行く人は原則必ず参加しなければなりません。\n\n地図合わせではコースの確認と役割分担をします。\n\nチェックではベテランの上級生を交えて安全に登山できそうか話し合います。\n\n最終チェックは当日の天気の情報をシェアしたり、メンバーの体調を確認します。",
      },
      {
        question: "長期登山とはどんなもんですか？",
        answer: "普段は一泊二日で東北の山々を登りますが、夏休みには二泊三日で南北アルプスの山に登ります。\n\n自親会のメインイベントです。\n\n長期登山の前には訓練登山という、その名の通り長期に向けての訓練の意味合いの登山をします。\n\n男子29キロ、女子27キロ背負って歩くのでハードです。\n\n訓練登山を乗り越えた人だけが長期に行く資格が得られます。\n\n長期の場合、滞在が長い分地図あわせ・チェックもいつもより時間がかかります。\n\n行くまでの負担はありますがやはり長期が一番楽しいです!（登った人の意見）",
      },
      {
        question: "後半セメスターも登りますか？",
        answer: "10月に秋山登山(紅葉狩り)にいくのが最後です\n\n冬山は行きません。\n\nなので冬の間は活動は芋煮会やスキー合宿で盛り上がります!(個人的にスキーや旅行に行く人が増えるのもこの時期です) \n\n部室も麻雀・ゲーム・漫画・雑談しに来る人が多いので年中変わらずにぎやかですよ",
      },
      {
        question: "兼部はできますか？",
        answer: "活動自体が参加自由なので余裕です。\n\n自親会に重きを置いてない人もいますし、関わり方は本人次第です。\n\nただ半年に一回3000円の部費は掛かります。\n\n兼部例をあげると、FTE・とんペディア・川内テニス・大学祭スタッフ・野鳥の会・TUCC・オリエンテーリング etc… （2025年最新版）\n\nあ、あと中途入部もできますよ。気軽に部室までどうぞー。",
        },
    ],
    "釣り編": [
      {
        question: "釣りもやるサークルなんですか？",
        answer: "個人活動でやってます。\n\n全体としての活動のメインは登山です。\n\n個人的に釣りをやりたいという人も応援しています。\n\n興味がある人を誘って行く、という感じです。\n\n全体としての釣り活動は、近年開催されていません... ",
      },
      {
        question: "釣りだけやりたいんですが…",
        answer: "あらゆる活動は自由参加です。\n\nが、基本的には山がメインのサークルです。\n\nできるだけ山に登った上で釣りにも行って欲しいですね。",
      },
      {
        question: "道具が無いんですが、大丈夫ですか？",
        answer: "実家から離れてきている部員も多いので基本的に部室にある釣具を使っています。\n\nエサ代だけは釣りに行くメンバーで払っています。\n\n興味が湧いたら、一緒に釣り行きましょう！",
      },
      {
        question: "釣り経験者はいますか？",
        answer: "年によって変わりますが、基本的に経験者がいることが多いです。\n\n初心者でも気兼ねなく釣りに行くことができる環境が整っていますよ! ",
      },
      {
        question: "釣り合宿はないんですか？",
        answer: "昔はやってたみたいです... \n\n宮城県の網地島・田代島や、新潟県新潟市などに行っていたようですが、自親会に入ってあなたが復活させてください。\n\nいまでも10人くらいで釣りに行くことはありますよ。",
      },
    ],
    
    "旅行編": [
      {
        question: "よく旅行に行くんですか？",
        answer: "みんな旅行が大好きです！\n\n夏・春休みは長期旅行のグループがいくつかできます。\n\n春休みは山に行けないので、旅行がメインみたいな状態です。",
      },
      {
        question: "どこに行くんですか？",
        answer: "国内から海外まで、どこでも行きます。\n\n国内は屋久島とか、北海道とかに行ってる人が多いです。\n\n海外は東南アジアとか、ヨーロッパとかが多いかな。",
      },
      {
        question: "移動手段は？",
        answer: "自転車、原付、バイク、レンタカー、電車、飛行機…\n\n企画によって、いろいろです。\n\nバイクや原付でツーリングに出かける人もいます。",
      },
      {
        question: "お金が掛かるんじゃないの？",
        answer: "テントや車中泊で寝れば、かなり安くなります。\n\n宿泊費を削れば、一日3000円くらいで行動できます！\n\n移動はレンタカーを割り勘するなどします。",
      },
    ],

    "その他編": [
      {
        question: "全ての活動に参加しないと居づらかったりしますか？",
        answer: "そういうわけではありませんよ。\n\n部室にしかこない人・山にしか行かない人・飲み会にしかこない人 etc...いろいろな人がいます。\n\n全ての企画に参加している人はあまりいないです。",
      },
      {
        question: "お金はどれくらいかかりますか？",
        answer: "部費は半年つき3000円です。\n\nこれとどれだけ企画に参加するかで変わります。\n\n飲み会は飲み屋ではなく宅飲みが多いのでとても安上がりです。",
      },
      {
        question: "勉強との両立はできますか？",
        answer: "テストシーズンは活動しないので大丈夫ですよ。\n\nたとえ企画があったとしても、学友会と違い参加自由ですし、7月の登山は天候不良で中止になることが多いです（笑",
      },
      {
        question: "バイトできますか？",
        answer: "8割はしてるんではないでしょうか。\n\n土日にシフトをいれなければ大丈夫ですよ。",
      },
      {
        question: "冬は何をしてるんですか？",
        answer: "冬山はしませんし、釣り・ツーリングは寒いのであまり行く人がいません。\n\n部室でぬくぬくとしている人が多いです。\n\n休日はスキー・スノボーによく行きます。\n\nテストが終わり、授業がなくなったら平日にも行ったりしますね。\n\n大学で道具の貸出しをしているので、そこで借りる人が多いです。",
      },
      {
        question: "お酒が飲めないんですけど大丈夫ですか？",
        answer: "大丈夫です! \n\n飲み会にいって飲まなくてもいい雰囲気ができているのが自親会のいいところだと思います。\n\n基本的に各学年で集まって飲むことが多いですが、セメスターの終わりや忘年会で年に４回くらい自親会全体で飲み会が行なわれています。",
      },
      {
        question: "平日は何をしてるんですか？",
        answer: "部室でだべってる、ゲームしてる、授業が無いので釣りや放課後韓国旅行etc...\n\n登山がある週は道具チェックや話合いをしてます。\n\nまた、月曜日は部会があります。",
      },
      {
        question: "なんで自親会の部室は他のサークルの二倍の広さなんですか？",
        answer: "部員が相当数いた時代の名残という噂。\n\n広い・ゲーム・テレビ・暖房冷房器具あり・調理器具一式あるetc...\n\n21時以降の部室利用は(一応)禁止されていますが、居心地が良すぎて帰れない人が多いです。",
      },
      {
        question: "いつできたサークルなんですか？",
        answer: "1965年4月1日にできたサークルとなっています。このホームページは開設60周年となった2025年にリニューアルしたものです。",
      },
      {
        question: "結局、なにがしたいんですか？",
        answer: "（作成中）",
      },
    ],
  };
  