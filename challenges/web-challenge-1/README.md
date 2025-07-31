# GraphQL-pocalypse

**カテゴリ**: Web  
**難易度**: Medium-Hard  
**ポイント**: 450点  

## 問題概要

GraphQLエンドポイントが提供されているWebアプリケーションに潜む脆弱性を発見し、管理者の機密情報を取得してください。

## アクセス情報

- **エンドポイント**: http://localhost/challenge1/graphql
- **認証**: `X-Auth-Token: tester` ヘッダーを追加

## 学習目標

- GraphQLのイントロスペクション機能
- GraphQLにおける認可の脆弱性（IDOR）
- GraphQLクエリの構造と攻撃手法

## ヒント

1. **Introspection調査**: GraphQLスキーマの構造を把握する（-50 points）
2. **権限昇格**: 他のユーザーの情報にアクセスする方法を考える（-100 points）

## フラグ形式

`CTF{...}`

## 技術詳細

- **Apollo Server 5.0**
- **TypeScript + Node.js**
- **Prisma + SQLite**
- **意図的な脆弱性**: 
  - イントロスペクションの露出
  - IDOR (Insecure Direct Object Reference)
  - 不適切な認可制御
