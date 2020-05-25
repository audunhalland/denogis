import { Client } from "https://deno.land/x/postgres/mod.ts";

async function recreateTables(client: Client) {
  const meh = await client.query("DROP TABLE IF EXISTS test;");
  console.log("meh: ", meh);
  console.log("migration done");
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
    console.log("yo");
    await recreateTables(client);
  } finally {
    await client.end();
  }
}

main();
