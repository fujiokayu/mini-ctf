# Mini CTF 2025

小規模（10〜20名）、非同期開催のWeb CTFを最小構成のCTFd + Dockerで実現するプロジェクトです。

## 概要

- **参加者規模**: 10-20名
- **開催期間**: 1-2週間
- **問題数**: Web問題5問
- **プラットフォーム**: CTFd 3.7.3 + Docker Compose
- **技術構成**: nginx + CTFd + MariaDB + Redis

## 動作環境・前提条件

- Docker & Docker Compose
- ポート80が利用可能
- 4GB以上のメモリ推奨

## クイックスタート

### 1. リポジトリクローン・環境設定

```bash
git clone <repository-url>
cd mini-ctf

# 環境変数を設定
cp .env.example .env
```

### 2. サービス起動

```bash
# 全サービスを起動
docker compose up -d

# 起動確認
docker compose ps
```

### 3. CTF環境アクセス・初期設定

1. ブラウザで http://localhost にアクセス
2. 初回セットアップウィザードを実行：
   - **イベント名**: Mini CTF 2025
   - **説明**: 小規模（10〜20名）、非同期開催のWeb CTF
   - **モード**: ユーザーモード
   - 管理者アカウントを設定
3. セットアップ完了後、管理画面で問題を追加

### 4. 管理者ログイン

- **管理画面**: http://localhost/admin
- セットアップ時に設定した管理者アカウントでログイン

## システム構成

```yaml
services:
  nginx:     # リバースプロキシ (ポート80)
  ctfd:      # CTFプラットフォーム (内部ポート8000)
  db:        # MariaDB 10.11
  cache:     # Redis 4
```

### 技術詳細

- **Web サーバー**: nginx (stable)
- **アプリケーション**: CTFd 3.7.3
- **データベース**: MariaDB 10.11
- **キャッシュ**: Redis 4
- **ネットワーク**: 内部ネットワーク + 外部アクセス用

## ディレクトリ構成

```
mini-ctf/
├── docker-compose.yml          # メイン構成ファイル
├── .env.example               # 環境変数テンプレート
├── .env                       # 実際の環境変数（要作成）
├── nginx/
│   └── http.conf              # nginx設定
├── challenges/                # CTF問題（テンプレート）
│   ├── web-challenge-1/       # Web問題1サンプル
│   ├── web-challenge-2/       # Web問題2（未実装）
│   ├── web-challenge-3/       # Web問題3（未実装）
│   ├── web-challenge-4/       # Web問題4（未実装）
│   └── web-challenge-5/       # Web問題5（未実装）
└── README.md
```

## 管理・運用

### ログ確認

```bash
# 全サービスのログ
docker compose logs

# 特定サービスのログ
docker compose logs ctfd
docker compose logs nginx
docker compose logs db
docker compose logs cache
```

### データベース操作

```bash
# MariaDBコンテナに接続
docker compose exec db mysql -u ctfd -pctfd ctfd

# データベースバックアップ
docker compose exec db mysqldump -u ctfd -pctfd ctfd > backup.sql

# バックアップ復元
docker compose exec -i db mysql -u ctfd -pctfd ctfd < backup.sql
```

### サービス管理

```bash
# サービス停止
docker compose down

# データも含めて完全削除
docker compose down -v

# サービス再起動
docker compose restart ctfd

# ログのリアルタイム監視
docker compose logs -f
```

## セキュリティ設定

- **認証**: CTFd標準認証
- **レート制限**: nginx レベルで実装可能
- **データベース**: 内部ネットワークのみアクセス
- **ファイルアップロード**: CTFd標準制限
- **セキュリティヘッダー**: nginx で設定済み

## トラブルシューティング

### よくある問題と解決方法

#### 1. コンテナが起動しない

```bash
# コンテナ状態確認
docker compose ps

# 詳細ログ確認
docker compose logs [service-name]

# 一度停止して再起動
docker compose down
docker compose up -d
```

#### 2. データベース接続エラー

```bash
# MariaDBコンテナの状態確認
docker compose logs db

# 環境変数確認
cat .env

# データベース接続テスト
docker compose exec ctfd nc -zv db 3306
```

#### 3. Redis接続エラー

```bash
# Redisログ確認
docker compose logs cache

# Redis接続テスト
docker compose exec ctfd nc -zv cache 6379

# 既存Redisデータクリア（必要な場合）
docker compose down -v
docker compose up -d
```

#### 4. ポート競合

```bash
# ポート80使用状況確認
lsof -i :80

# 他のサービスを停止するか、docker-compose.ymlのポート変更
```

#### 5. 初期設定でエラー

- ブラウザのキャッシュをクリア
- プライベートブラウジングモードで再試行
- コンテナログでエラー詳細を確認

### デバッグコマンド

```bash
# 全サービス状態確認
docker compose ps -a

# ネットワーク確認
docker network ls
docker compose exec ctfd ping db

# リソース使用量確認
docker stats

# コンテナ内でのデバッグ
docker compose exec ctfd /bin/bash
docker compose exec db /bin/bash
```

## チャレンジ作成

現在、`challenges/web-challenge-1/` にサンプル問題があります。

### 基本的な問題作成手順

1. `challenges/` ディレクトリに新しい問題フォルダを作成
2. `Dockerfile` でコンテナ環境を定義
3. 問題ファイルを配置
4. `docker-compose.yml` に新しいサービスを追加（必要な場合）
5. CTFd管理画面で問題を登録

詳細は [Challenge開発ガイド](./challenges/README.md) を参照。

## 開発・カスタマイズ

### 設定変更

- **CTFd設定**: 管理画面 > Config
- **nginx設定**: `nginx/http.conf`
- **環境変数**: `.env`

### 拡張

- 問題数追加: `challenges/` ディレクトリに追加
- 外部サービス連携: `docker-compose.yml` で定義
- カスタムテーマ: CTFd のテーマ機能を使用

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。

---

## 補足情報

- **テスト済み環境**: macOS (Docker Desktop)
- **CTFdバージョン**: 3.7.3
- **動作確認**: 2025年7月実施
- **参考**: [CTFd公式ドキュメント](https://docs.ctfd.io/)