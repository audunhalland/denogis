import { Client } from "https://deno.land/x/postgres/mod.ts";

// https://spatialreference.org/ref/epsg/4326/
// The projection also used in GeoJSON
const SRID = "4326";

interface Geometry {
  type: "Polygon";
  coordinates: Array<Array<[number, number]>>;
}

async function recreateTables(client: Client) {
  await client.query("DROP TABLE IF EXISTS test;");
  await client.query(`
  CREATE TABLE test (
    id Text,
    polygon geometry(POLYGON, ${SRID})
  )
  `);
  console.log("migration done");
}

function singlePolygon(coords: Array<[number, number]>): Geometry {
  return {
    type: "Polygon",
    coordinates: [coords],
  };
}

function geometryToWKT(geometry: Geometry): string {
  const fmt = geometry.coordinates.map(
    (polygons) => `(${polygons.map((coord) => coord.join(" ")).join(",")})`,
  ).join(",");
  return `SRID=${SRID};POLYGON(${fmt})`;
}

async function populate(client: Client) {
  const geometry = singlePolygon([[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]);
  await client.query(
    "INSERT INTO test (id, polygon) VALUES ($1, $2)",
    "test",
    geometryToWKT(geometry),
  );
}

async function main() {
  const client = new Client({
    hostname: "localhost",
    user: "denogis",
    password: "denogis",
    database: "denogis",
    port: 6543,
  });
  await client.connect();
  try {
    await recreateTables(client);
    await populate(client);
  } finally {
    await client.end();
  }
}

main();
