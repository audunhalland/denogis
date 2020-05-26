import { readJson } from "https://deno.land/std/fs/mod.ts";
import { Client } from "https://deno.land/x/postgres/mod.ts";
import * as GeoJSON from "./geojson.ts";

// https://spatialreference.org/ref/epsg/4326/
// This projection is also "compatible" with GeoJSON - albeit we here use a flat projection instead of spherical projection
const SRID = "4326";

async function recreateTables(client: Client) {
  await client.query("DROP TABLE IF EXISTS test;");
  await client.query(`
  CREATE TABLE test (
    id text PRIMARY KEY,
    polygon geometry(POLYGON, ${SRID})
  )
  `);
  console.log("migration done");
}

interface MunicipalityProps {
  navn: {
    navn: string;
  };
  kommunenummer: string;
}

type Municipalities = GeoJSON.FeatureCollection<MunicipalityProps>;

async function readMunicipalities(): Promise<Municipalities> {
  const geo = await readJson("./kommuner.json");
  return geo as Municipalities;
}

function geometryToWKT(geometry: GeoJSON.Geometry): string {
  switch (geometry.type) {
    case "Polygon": {
      const fmt = geometry.coordinates.map(
        (polygons) => `(${polygons.map((coord) => coord.join(" ")).join(",")})`,
      ).join(",");
      return `SRID=${SRID};POLYGON(${fmt})`;
    }
  }
}

async function populate(client: Client) {
  const municipalities = await readMunicipalities();

  for (const feature of municipalities.features) {
    const id = feature.properties.kommunenummer;

    if (feature.geometry) {
      await client.query(
        "INSERT INTO test (id, polygon) VALUES ($1, $2)",
        id,
        geometryToWKT(feature.geometry),
      );
    }
  }

  console.log(
    `successfully imported ${municipalities.features.length} municipalities`,
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
