# プロジェクト基本情報

- 小規模（10〜20名）、非同期開催の Web‑CTF を最小構成の CTFd＋Docker で実現する
- CTF 開催期間は 1〜2 週間
- 参加者は 10〜20 名を想定
- ５問程度の Web CTF 問題を用意する

# スコープ

| 含む                           | 含まない                          |
|--------------------------------|-----------------------------------|
| Web カテゴリ 5 問               | SSO 連携・メール配信              |
| CTFd 標準認証 (ID/PW)          | 専用の脆弱性報奨金・バグ対応窓口   |
| Docker Compose による環境構築   | 大規模 (>50 名) 負荷対策           |

# 機能要件

| ID  | 機能                   | 詳細                                                         |
|-----|------------------------|--------------------------------------------------------------|
| F‑1 | ユーザー登録／認証     | CTFd 標準フォーム。登録コード `REGISTRATION_CODE` で制限     |
| F‑2 | チャレンジ管理         | Web5題。タイトル・説明・添付ファイル・ヒント(減点付き)       |
| F‑3 | フラグ提出／採点       | 静的 `CTF{...}` / Duplicate は無効                          |
| F‑4 | スコアリング           | `500‑50*(solve数‑1)` で最小 50 pt                            |
| F‑5 | ランキング             | リアルタイム、同点時は先着順                                 |
| F‑6 | 管理 UI               | ユーザ／チャレンジ CRUD、得点調整、統計 CSV                  |
| F‑7 | 監査ログ               | 失敗提出・管理操作・ログイン履歴を JSON で 30 日保存         |

# 非機能要件

| 区分       | 目標                                      |
|------------|-------------------------------------------|
| 可用性     | 動けば良い                          |
| 性能       | 同時 10 ユーザで応答 < 300 ms              |
| セキュリティ| 主にインフラレイヤーで担保。アプリ層は OWASP TOP 10 の脆弱性に対応する |
| 運用性     | アプリケーションログからコンテストの状況を復元できるようにする|
| 拡張性     | 問題数×2 までは無停止でコンテナ追加可能   |

# システム構成

```yaml
# docker-compose.yml（抜粋）
version: "3.9"
services:
  nginx:
    image: nginx:1.27-alpine
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - ./certs:/etc/nginx/certs:ro
    ports:
      - "443:443"
    depends_on: [ctfd]

  ctfd:
    image: ctfd/ctfd:latest-3
    environment:
      - SECRET_KEY=${SECRET_KEY}
      - REGISTRATION_CODE=in-house-ctf-2025
      - DATABASE_URL=postgresql://ctfd:${POSTGRES_PW}@db/ctfd
      - CTFD_RATELIMITING=true
    volumes:
      - ctfd-data:/var/lib/ctfd

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_PASSWORD=${POSTGRES_PW}
    volumes:
      - pg-data:/var/lib/postgresql/data

volumes:
  ctfd-data:
  pg-data:
