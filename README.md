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
