# denogis
A toy app exploring PostGIS and Deno

### Bring up the test database:

```
$ docker-compose up
```

### Run the application

```
$ deno run --unstable --allow-net=localhost:6543 --allow-read=./kommuner.json src/index.ts
```
