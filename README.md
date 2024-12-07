# 自然に親しむ会

東北大学のアウトドアサークルです。

ホームページ: [https://jishinkaihp.web.fc2.com/](https://jishinkaihp.web.fc2.com/)

[![X (formerly Twitter) Follow](https://img.shields.io/twitter/follow/jishinkai)](https://x.com/intent/follow?screen_name=jishinkai)


[![GitHub repo size](https://img.shields.io/github/repo-size/jishinkai/jishinkaihp)](https://github.com/jishinkai/jishinkaihp/)
[![GitHub top language](https://img.shields.io/github/languages/top/jishinkai/jishinkaihp)](https://github.com/jishinkai/jishinkaihp/)
[![GitHub package.json prod dependency version](https://img.shields.io/github/package-json/dependency-version/jishinkai/jishinkaihp/astro)](./package.json)

[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/jishinkai/jishinkaihp/fc2.yml)](https://github.com/jishinkai/jishinkaihp/actions/workflows/fc2.yml)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fjishinkaihp.web.fc2.com%2F)](https://jishinkaihp.web.fc2.com/)

## このページについて

公式ホームページのソースコードを管理するリポジトリです。

このリポジトリのmainブランチに行われた変更は、自動的にfc2に反映されます。

## 部員の方へ

記録の提出は、(メディア係が対応可能な場合)このリポジトリへのプルリクでも構いません。

## メディア係の方へ

### ホームページをいじるための準備

#### 用意が必要なもの

- git
- Node.js
- VSCode(推奨、他のエディタを使いたければそちらでも可)
- GitHubのアカウント

#### インストール方法(インストール済みなら飛ばしてOK)

##### Git

Windows

1. 「ターミナル」を開く
2. wingetを未インストールの場合、Microsoft Storeで[アプリ インストーラー](https://www.microsoft.com/p/app-installer/9nblggh4nns1#activetab=pivot:overviewtab)をインストール
3. 以下のコマンドを実行: `winget install --id Git.Git -e --source winget`

macOS

1. 「ターミナル」を開く
2. Homebrewを未インストールの場合、[このサイト](https://brew.sh/ja/)に従ってインストール
3. 以下のコマンドを実行: `brew install git`

インストールできたら、ターミナルを再起動して`git --version`するとインストールしたバージョンが見れるはず。

うまく行ってたら、最後に以下のコマンドを実行して設定をちょいといじる: `git config --global core.autoCRLF input`

##### Node.js

公式ホームページの手順に従ってインストール:
[https://nodejs.org/en/download/package-manager](https://nodejs.org/en/download/package-manager)


##### VSCode

以下のコマンドでインストール

Windows: `winget install vscode`

macOS: `brew install --cask visual-studio-code`

#### Githubのアカウントについて

[Github](https://github.com/signup)でアカウントを作る。もう持ってればそれでOK。

先代のメディア係に、メンバーに追加してもらう。

(先代のメディア係へ: [このページ](https://github.com/orgs/jishinkai/people)で追加できます。権限はOwnerにしてください。)

#### ソースコードをPCにコピー

1. ソースコードとかを置くためのフォルダを作る。
2. フォルダの中で右クリックして「ターミナルを開く」
3. コマンドを実行: `git clone https://github.com/jishinkai/jishinkaihp.git`
4. リポジトリの中に移動: `cd jishinkaihp`
5. 自分の名前を設定(公開されるので本名は非推奨): `git config user.name <名前>`
6. メールアドレスを設定(基本的にはgithubアカウントのアドレスがいいと思う): `git config user.email <メールアドレス>`
7. コンテンツ編集用のブランチに移動: `git checkout content`
8. 必要なパッケージをインストール: `npm i`

#### エディタで開く

コピーしてきたファイルの中に[`自親会.code-workspace`](./自親会.code-workspace)というファイルがあるので開くと、VSCodeが立ち上がるはず。

これまでターミナルでコマンドを実行していたが、これからはVSCodeの中で実行できるのでこっちでやろう。このサイトがシンプルでわかりやすい: [https://www.javadrive.jp/vscode/terminal/index1.html](https://www.javadrive.jp/vscode/terminal/index1.html)

#### ファイル構成のざっくりした説明

```text
jishinkaihp/
├── .github/ (自動でfc2に反映したりするGithub Actionsのスクリプトなど。)
├── dist/ (`npm run build`をすると自動生成される。出来上がったwebサイトの出力先。)
├── integrations/
│   └── sitemap.ts (サイトマップを自動生成するスクリプト。)
├── patches/ (Astroの気に入らない挙動を無理やり修正するためのパッチ。)
├── public/ 
│   │(このフォルダに置いたファイルはそのまま公開される。)
│   │(最適化とかもされないので最低限しか置かないのが吉)
│   ├── favicon.ico (ブラウザのタブのところに表示されるアイコン。)
│   ├── ogp.png (SNSでリンクを貼ったときに表示される画像。)
│   └── robots.txt (Googleとかに「検索結果に表示していいよ」と言うためのファイル)
├── src/
│   ├── assets/ (画像とかちょっとしたスクリプトとか)
│   ├── components/ (使い回すパーツを定義するファイルの置き場所)
│   │   └── member.astro (部員紹介のパーツの定義)
│   ├── content/ (【重要】山行記録とかが置かれる場所。)
│   │   ├── other/ (「その他」のコンテンツ)
│   │   ├── tabi/ (「旅行記」のコンテンツ)
│   │   ├── tsuri/ (「釣果記録」のコンテンツ)
│   │   ├── yama/ (「山行記録」のコンテンツ)
│   │   └── config.ts (ファイルのタイトルとかの型の定義。)
│   ├── layouts/ (ページレイアウトの定義。)
│   │   ├── BaseLayout.astro (一番低層レイヤーのレイアウト。サイト名とか配色の定義とか)
│   │   └── MainLayout.astro (トップページ以外のレイアウト。BaseLayoutの上に構築。)
│   └── pages/ (公開されるページの定義。)
│        ├── link/ (「リンク」っていうページの定義。以前のHPにあったから作ったけど意味は不明)
│        ├── member/ (「部員紹介」)
│        │   ├── index.mdx (部員紹介のページの内容。)
│        │   └── legend.mdx (現役以外の人たち)
│        ├── other/ (「その他」)
│        │   ├── [...slug].astro (/src/content/other のファイルからページを生成)
│        │   └── index.md (その他のページのトップ)
│        ├── qa/ (「よくある質問」)
│        ├── tabi/ (「旅行記」)
│        │   ├── [...slug].astro (/src/content/tabi のファイルからページを生成)
│        │   └── index.md (旅行記のページのトップ)
│        ├── tsuri/ (「釣果記録」)
│        │   ├── [...slug].astro (/src/content/tsuri のファイルからページを生成)
│        │   └── index.md (釣果記録のページのトップ)
│        ├── yama/ (「山行記録」)
│        │   ├── [...slug].astro (/src/content/yama のファイルからページを生成)
│        │   └── index.md (山行記録のページのトップ)
│        └── index.astro (HPのトップページ)
├── README.md (このファイル。いろんな解説。)
└── package.json (必要なパッケージとか定義したコマンドとか。)
```

#### 山行記録とかを追加する方法

山行記録の場合で解説します。

1. `/src/content/yama`の中の適切なフォルダに、追加したいファイルを置く。ファイル形式は`.astro`,`.md`,`.mdx`のいずれか。
2. `/src/pages/yama/index.md`に、追加したファイルへのリンクを追加する。
3. コマンドで変更内容を選択: `git add .`
4. 変更内容をgitに記録: `git commit -m "新歓_NAOYAの山行記録を追加"` (コメントは何を追加したかわかりやすいように書いておく)
5. Githubに変更記録を送信: `git push` (はじめてのときは`git push -u origin content`)
6. [Github](https://github.com/jishinkai/jishinkaihp/pulls)でプルリクエストを作成する。
   1. 「Compare & pull request」というボタンがあればクリック
   2. なければ「New pull request」をクリックして、compareの方を`content`にする。
   3. 「Create pull request」をクリック
   4. エラーがないかのチェックが走るので暫く待つ。
   5. 「Merge pull request」が押せるようになったら、クリック。
   6. 「Confirm merge」をクリック。
7. しばらく待つと、fc2に反映される。

#### うまくいかない場合

- インストールが上手くできない
  - バージョンが新しくなったせいとかかもしれないので、インターネットで最新のインストール方法を調べて見てください。エラーメッセージで調べてみても色々わかると思います。
- プルリクエストを作ったが、Mergeボタンが押せない
  - [Actionsタブ](https://github.com/jishinkai/jishinkaihp/actions)を見て、失敗したときのエラーメッセージを見てみてください。ビルドに失敗しているようなら、エラーメッセージに原因が書いてあると思います。
- Confirm mergeまでできたが、fc2に反映されない
  - [Actionsタブ](https://github.com/jishinkai/jishinkaihp/actions)で進捗状況が見れます。Deploy to FC2で失敗しているようなら、再試行ボタンを押してみてください。
- Deploy to FC2は成功しているが、ホームページを見ても反映されてない
  - ブラウザのキャッシュが残ってるかもしれないです。Shiftを押しながら再読込すると反映されると思います。


## コマンド

| コマンド                  | 内容                                             |
| :------------------------ | :----------------------------------------------- |
| `npm i`                   | 必要なパッケージをインストール                   |
| `npm run dev`             | webサイトを手元で動かしてみる                    |
| `npm run build`           | fc2に反映するためのファイルを生成                |
| `npm run deploy`          | 生成したファイルを手元からfc2に反映(非推奨)      |
| `npm run astro ...`       | Astroのコマンドを実行 `astro add`, `astro check` |

## 関連ドキュメント

Astro:  [https://docs.astro.build](https://docs.astro.build)
