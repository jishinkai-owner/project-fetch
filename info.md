# 旧ホームページから新ホームページへのリダイレクト設定 

## 概要

旧ホームページ（https://jishinkaihp.web.fc2.com/）から新ホームページ（https://jishinkai.club/）へのリダイレクト機能を実装したい。 


### テスト用URL

以下のURLでリダイレクトが正常に動作してほしい

1. **山行記録 (実際のデータ)**: `http://localhost:3002/yama/2007/Choukai/2007.10tyoukai`
   - リダイレクト先: `http://localhost:3002/record/yama/1582?year=2007`
   

### 期待される動作

1. 旧URL形式(`https://jishinkaihp.web.fc2.com/yama/[filename]`)でアクセス
2. Contentテーブルからfilenameとidを、Recordテーブルからyearを検索
3. 見つかった場合：新URL形式にリダイレクト（`/record/yama/[id]?year=YYYY`）
4. 見つからない場合：一般的な記録一覧ページにリダイレクト（`/record/yama?year=YYYY`）


## ログ出力

リダイレクト処理では以下のログが出力されます：

```text
Legacy redirect: /yama/2022/filename -> /record/yama/1997?year=2022
Redirecting to: https://jishinkai.club/record/yama/1997?year=2022
```

## 注意事項

1. filenameは`Content`テーブルの`filename`カラムと完全一致する必要があります
2. CSVデータの`filename`カラムの値が`2022/2022.10.adatarayama.Tamaki/2022.10.adatarayama.Tamaki`の形式の場合、URL部分は`/yama/2022/2022.10.adatarayama.Tamaki/2022.10.adatarayama.Tamaki`となります
3. データベースに該当するレコードが存在しない場合は、年度フィルタ付きの一覧ページにフォールバックします

## 旧ホームページ側の実装要件

### 実装概要

旧ホームページ（<https://jishinkaihp.web.fc2.com/>）で、すべてのページアクセスを新ホームページ（<https://jishinkai.club/>）にリダイレクトする仕組みを実装する必要があります。

### 実装すべきリダイレクトパターン

#### 1. 山行記録の個別ページ

- **旧URL**: `https://jishinkaihp.web.fc2.com/yama/[year]/[filename]`
- **新URL**: `https://jishinkai.club/yama/[year]/[filename]`
- **例**: `https://jishinkaihp.web.fc2.com/yama/2007/Choukai/2007.10tyoukai` → `https://jishinkai.club/yama/2007/Choukai/2007.10tyoukai`

#### 2. 山行記録トップページ

- **旧URL**: `https://jishinkaihp.web.fc2.com/yama/`
- **新URL**: `https://jishinkai.club/yama`

#### 3. その他の固定ページ

- **QAページ**: `https://jishinkaihp.web.fc2.com/qa/` → `https://jishinkai.club/qa`
- **メンバーページ**: `https://jishinkaihp.web.fc2.com/member/` → `https://jishinkai.club/member`
- **新歓ページ**: `https://jishinkaihp.web.fc2.com/other/shinkan2025` → `https://jishinkai.club/other/shinkan2025`

#### 4. その他すべて

- **旧URL**: `https://jishinkaihp.web.fc2.com/*`
- **新URL**: `https://jishinkai.club/*` （パス構造を保持）

### 実装方法（推奨）

#### オプション1: .htaccessを使用（Apache）

```apache
RewriteEngine On
RewriteCond %{HTTP_HOST} ^jishinkaihp\.web\.fc2\.com$ [NC]
RewriteRule ^(.*)$ https://jishinkai.club/$1 [R=301,L]
```

#### オプション2: JavaScriptを使用

各HTMLページの`<head>`セクションに以下を追加：

```html
<script>
if (window.location.hostname === 'jishinkaihp.web.fc2.com') {
    const newUrl = 'https://jishinkai.club' + window.location.pathname + window.location.search;
    window.location.replace(newUrl);
}
</script>
```

#### オプション3: HTMLのmeta refreshを使用

```html
<meta http-equiv="refresh" content="0; url=https://jishinkai.club/">
```

### 旧ホームページの具体的な変更作業

#### FC2ホームページの場合

1. **ファイルマネージャーにアクセス**
   - FC2ホームページの管理画面にログイン
   - 「ファイルマネージャー」を開く

2. **index.htmlを編集**
   - トップページ（`index.html`）を開く
   - `<head>`タグ内に以下のコードを追加：

```html
<script>
// 新サイトへのリダイレクト 
if (window.location.hostname === 'jishinkaihp.web.fc2.com') {
    const newUrl = 'https://jishinkai.club' + window.location.pathname + window.location.search;
    window.location.replace(newUrl);
}
</script>
```

3. **全ページに適用**
   - 山行記録ページ（`yama/`フォルダ内のHTMLファイル）
   - QAページ（`qa.html`など）
   - メンバーページ（`member.html`など）
   - その他すべてのHTMLファイル

#### 作業手順の詳細

1. **バックアップを取る**
   ```
   現在のサイトの全ファイルをダウンロードして保存
   ```

2. **共通ヘッダーファイルがある場合**
   ```
   header.html や common.js などの共通ファイルに
   リダイレクトコードを1回追加するだけで済む
   ```

3. **個別ファイルを編集する場合**
   ```
   各HTMLファイルの<head>セクションに
   上記JavaScriptコードを追加
   ```

#### ディレクトリ構造例

```
jishinkaihp.web.fc2.com/
├── index.html          ← リダイレクトコード追加
├── qa.html            ← リダイレクトコード追加
├── member.html        ← リダイレクトコード追加
├── yama/
│   ├── index.html     ← リダイレクトコード追加
│   ├── 2007/
│   │   └── Choukai/
│   │       └── 2007.10tyoukai.html ← リダイレクトコード追加
│   └── ...
├── other/
│   └── shinkan2025.html ← リダイレクトコード追加
└── ...
```

#### 自動化スクリプト（参考）

全ファイルを一括で更新する場合：

```bash
# 全HTMLファイルを検索して<head>タグの後にリダイレクトコードを挿入
find . -name "*.html" -exec sed -i '/<head>/a\
<script>\
if (window.location.hostname === "jishinkaihp.web.fc2.com") {\
    const newUrl = "https://jishinkai.club" + window.location.pathname + window.location.search;\
    window.location.replace(newUrl);\
}\
</script>' {} \;
```

### 作業指示テンプレート

**担当者への指示**：

1. FC2ホームページ管理画面にログインしてください
2. ファイルマネージャーを開いてください
3. 以下のJavaScriptコードを全ページの`<head>`タグ内に追加してください：

```html
<script>
if (window.location.hostname === 'jishinkaihp.web.fc2.com') {
    const newUrl = 'https://jishinkai.club' + window.location.pathname + window.location.search;
    window.location.replace(newUrl);
}
</script>
```

4. 最低限、以下のファイルには必ず追加してください：
   - `index.html`（トップページ）
   - `yama/index.html`（山行記録トップ）
   - よくアクセスされるページ

5. 可能であれば、サイト内のすべてのHTMLファイルに追加してください

### 新ホームページ側の対応状況

✅ **実装済み**: 以下のリダイレクト処理が新ホームページ側で動作中

- `/yama/[year]/[filename]` → `/record/yama/[contentId]?year=[year]`
- `/yama` → `/record/yama`
- `/tabi` → `/record/tabi`
- `/tsuri` → `/record/tsuri`
- `/other/shinkan2025` → `/shinkan`

### 実装ファイル一覧（新ホームページ側）

1. **middleware.ts** - レガシーURLパターンの検出
2. **src/app/api/legacy-redirect/route.ts** - データベース検索とリダイレクト先決定
3. **src/app/legacy-redirect/page.tsx** - クライアントサイドリダイレクト処理

### ログ出力例

新ホームページ側では以下のログが出力されます：

```text
Legacy redirect: /yama/2007/Choukai/2007.10tyoukai -> /record/yama/1582?year=2007
Direct redirect: /yama -> /record/yama
```

## 旧ホームページ側での具体的な作業手順

### FC2ホームページでの実装方法

FC2ホームページサービス（<https://jishinkaihp.web.fc2.com/>）では以下の手順でリダイレクトを実装します。

#### 手順1: FC2管理画面にログイン

1. FC2ホームページの管理画面にアクセス
2. ファイルマネージャーを開く

#### 手順2: 共通リダイレクトスクリプトの作成

新しいファイル `redirect.js` を作成し、以下の内容を記述：

```javascript
// redirect.js
(function() {
    if (window.location.hostname === 'jishinkaihp.web.fc2.com') {
        const currentPath = window.location.pathname;
        const currentSearch = window.location.search;
        const newUrl = 'https://jishinkai.club' + currentPath + currentSearch;
        
        // ログ出力（デバッグ用）
        console.log('Redirecting from:', window.location.href);
        console.log('Redirecting to:', newUrl);
        
        // 即座にリダイレクト
        window.location.replace(newUrl);
    }
})();
```

#### 手順3: 各HTMLページの修正

各HTMLファイル（index.html, yama/, tabi/, tsuri/, qa/, member/ など）の `<head>` セクションに以下を追加：

```html
<!-- リダイレクト用スクリプト -->
<script src="/redirect.js"></script>
<noscript>
    <meta http-equiv="refresh" content="0; url=https://jishinkai.club/">
</noscript>
```

#### 手順4: トップページ用の特別対応

`index.html` には追加で以下のmeta refreshも設定：

```html
<meta http-equiv="refresh" content="0; url=https://jishinkai.club/">
```

### 実装すべき主要ファイル一覧

以下のファイルを修正する必要があります：

#### 必須ファイル

- `index.html` - トップページ
- `yama/index.html` - 山行記録トップ
- `tabi/index.html` - 旅行記録トップ（存在する場合）
- `tsuri/index.html` - 釣行記録トップ（存在する場合）
- `qa/index.html` - QAページ
- `member/index.html` - メンバーページ
- `other/shinkan2025.html` - 新歓ページ

#### 個別記録ファイル

- `yama/` フォルダ内のすべてのHTMLファイル
- その他の活動記録関連のHTMLファイル

### 作業担当者向けの指示テンプレート

以下のテキストを作業担当者に送付してください：

---

#### 旧ホームページリダイレクト設定作業指示

- **作業概要**: 旧ホームページ（<https://jishinkaihp.web.fc2.com/>）から新ホームページ（<https://jishinkai.club/>）への自動リダイレクトを設定

- **作業期限**: [期限を記入]

**手順**:

1. **FC2ホームページ管理画面にログイン**
   - URL: <https://homepage.fc2.com/>
   - ファイルマネージャーを開く

2. **リダイレクトスクリプトファイルの作成**
   - 新しいファイル `redirect.js` を作成
   - 内容: [上記のJavaScriptコードを貼り付け]

3. **各HTMLファイルの修正**
   - 以下のファイルの `<head>` セクションに追加:

     ```html
     <script src="/redirect.js"></script>
     <noscript>
         <meta http-equiv="refresh" content="0; url=https://jishinkai.club/">
     </noscript>
     ```

   **対象ファイル**:
   - index.html
   - yama/index.html
   - qa/index.html
   - member/index.html
   - その他すべてのHTMLファイル

4. **動作確認**
   - 各ページにアクセスして新ホームページにリダイレクトされることを確認
   - ブラウザの開発者ツールでエラーがないか確認

**注意事項**:

- ファイル編集前は必ずバックアップを作成
- 問題が発生した場合は即座に連絡
- リダイレクト後の新ホームページで正常に表示されることも確認

**連絡先**: [担当者の連絡先を記入]

---

### 代替案: .htaccessファイルでの一括対応

FC2がApacheサーバーで.htaccessをサポートしている場合、ルートディレクトリに `.htaccess` ファイルを作成：

```apache
RewriteEngine On
RewriteCond %{HTTP_HOST} ^jishinkaihp\.web\.fc2\.com$ [NC]
RewriteRule ^(.*)$ https://jishinkai.club/$1 [R=301,L]
```

**注意**: FC2ホームページサービスで.htaccessが利用可能かは事前確認が必要です。

### 作業完了後の確認事項

1. **リダイレクト動作確認**
   - <https://jishinkaihp.web.fc2.com/> → <https://jishinkai.club/>
   - <https://jishinkaihp.web.fc2.com/yama/> → <https://jishinkai.club/yama>（新ホームページ側で /record/yama にリダイレクト）
   - 個別記録ページも適切にリダイレクトされるか

2. **SEO対策確認**
   - 301リダイレクトが設定されているか
   - 検索エンジンが新URLを認識するか

3. **エラーログ確認**
   - FC2管理画面でアクセスログやエラーログを確認

## トラブルシューティング

### 旧ホームページ側

1. **リダイレクトが動作しない場合**
   - JavaScriptが正しく読み込まれているか確認
   - ブラウザの開発者ツールでエラーを確認
   - FC2のファイルパスが正しいか確認

2. **一部のページでリダイレクトしない場合**
   - 該当HTMLファイルにスクリプトが追加されているか確認
   - ファイルパスが正しいか確認

### 新ホームページ側

1. **リダイレクトが動作しない場合**
   - `Content`テーブルのfilenameの認識が正しいか確認
   - `Record`テーブルとの関連付けが正しいか確認
   - サーバーログでエラーメッセージを確認
