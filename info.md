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

## トラブルシューティング

### リダイレクトが動作しない場合

1. `Content`テーブルのfilenameの認識が正しいか確認
2. `Record`テーブルとの関連付けが正しいか確認
3. サーバーログでエラーメッセージを確認


