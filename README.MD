# Launch

```sh
docker compose up
```

# Individual Launch

### Docker

```sh
cd server
docker build -t ws-server .  # Build
docker run -p 8005:8005 -p 8010:8010 ws-server  # Run
```

### Native

#### Client

```sh
yarn # Installs deps
yarn dev
```

#### Server

```sh
yarn  # Installs deps
yarn start
```
