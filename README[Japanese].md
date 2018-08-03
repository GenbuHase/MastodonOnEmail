# Mastodon on Email(MoE)
Eメールで楽しむMastodonライフ


## 言語
* [英語 | English](/README.md)


## 概要
MoEを使えば、Eメールだけでトゥートが出来るようになります。<br />
特にガラケーをお使いの方々にお勧めです。


## MoEの特徴
* 自由にインスタンスが追加可能
* トゥート公開範囲が変更可能
* CW等の機能も充実
* その他諸々...


## 動作環境
* [Google Apps Script](https://www.google.com/script/start/)


## 使用方法
お使いになる際には、以下の通りに従ってください。
1.	GASプロジェクトに全ファイルをコピーする
2.	トークンの設定をする([トークン設定](#トークン設定)をご参照下さい)
3.	`scheduleInit()`を実行
4.	起動完了です！！お楽しみ下さい！([フォーマット表](#フォーマット表) & [魔導書](#魔導書)をご参照下さい)


## トークン設定
1.	設定の[開発]内にある[アプリ]を開く(`https://{:instance}/settings/applications`)<br />
	![アプリケーション設定](assets/images/001.png)

2.	以下の設定でトークンを生成する<br />
	... アプリの名前: `Mastodon on Email`<br />
	... アプリのウェブサイト: `https://genbuhase.github.io/`<br />
	... アクセス権: `read, write, follow`<br />
	![トークン設定](assets/images/002.png)

3.	[ファイル]タブ内の[プロジェクトのプロパティ]を開く<br />
	![プロジェクトのプロパティ](assets/images/003.png)

4.	[ユーザープロパティ]タブにインスタンス及びトークン情報を追記<br />
	![ユーザープロパティ](assets/images/004.png)


## フォーマット表
フォーマットベースは`MoE@{:instance}`です。
> `{:instance}` ... アカウントのインスタンス

フォーマットの例は以下の通りです。
> `MoE:Toot` ... `MoE:Toot@{:instance}`を示す
> 
> `<1>` ... `MoE@{:instance}<1>`を示す
> 
> `MoE:Toot<1>` ... `MoE:Toot@{:instance}<1>`を示す

| 件名のフォーマット | 概要 |
|:----------|:----------|
| フォーマットベース | 本文の内容でトゥート |
| <`{:privacy}`> | 指定された公開範囲でトゥート |
|| `0` ... 公開 |
|| `1` ... 未収載 |
|| `2` ... 非公開 |
|| `3` ... ダイレクト |
|| `その他(public \| unlisted \| ...)` ... 指定された公開範囲 |
| MoE:Toot | `フォーマットベース`と同機能 |
| MoE:Toot<`{:privacy}`> | `<{:privacy}>`と同機能 |
| MoE:Notify | 直近15件のメンション通知を取得 |


## 魔導書
| 魔導のフォーマット | 概要 |
|:----------|:----------|
| [CW \| `{:CWContent}`] | CWを付けてトゥート |
| [`{:emojiCode}` \| `{:quantity}`] | `emojiCode`の絵文字を`quantity`個並べて置換 |


## 作者
* Mastodon
  * [ProgrammerGenboo@itabashi.0j0.jp](https://itabashi.0j0.jp/@ProgrammerGenboo)
  * [ProgrammerGenboo@knzk.me](https://knzk.me/@ProgrammerGenboo)
* [Genbu Hase(Github)](https://github.com/GenbuHase)


## ライセンス
[MIT License](/LICENSE)