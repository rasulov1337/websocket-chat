# Launch

## Client

```sh
yarn # Installs deps
yarn dev
```

## Server

### Docker

```sh
cd server
docker build -t ws-server .  # Build
docker run -p 8005:8005 -p 8010:8010 ws-server  # Run
```

### Native

```sh
yarn  # Installs deps
yarn start
```
