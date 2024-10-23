# Gantt-Chart

React+TypeScriptプロジェクトの作成

初期ディレクトリ

```
web-react-rust
└ react
│     └ Dockerfile
└docker-compose.yml
```

```
cd react/
docker compose build --no-cache
docker compose run --rm react npm create vite@latest .

> y
> React
> TypeScript + SWC
```

```
  "scripts": {
    "dev": "vite --host",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
```

docker compose up -d
docker exec -it react sh
npm install
npm run build
npm run dev



psqlを使用したPostgreSQLへの接続

```
docker exec -it <コンテナ名> psql -U <DBユーザ名> -d <DB名>
```

例

```bash
$ docker ps
77c161ea03d8   postgres:16            "docker-entrypoint.s…"   10 seconds ago   Up 8 seconds   0.0.0.0:5432->5432/tcp, :::5432->5432/tcp   postgres
```

```yaml:docker-compose.yml
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
```

```bash
$ docker exec -it 77c161ea03d8 psql -U postgres -d postgres

# テーブル一覧
\dt
```
