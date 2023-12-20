import pkg from 'pg';
const { Client } = pkg;
import fs from "fs";
/*
const client = new Client ({
  host: "localhost",
  user: "postgres",
  password: "erigust1009",
  database: "backutn",
  port: 5433
});*/

const client = new Client ({
    host: "serverutnback.postgres.database.azure.com",
    user: "backutn",
    password: "$erver2023",
    database: "back_utn_v1",
    port: 5432,
    ssl: {
        ca: fs.readFileSync("./database/DigiCertGlobalRootCA.crt (1).pem")
    }
});

// Conexión a la base de datos
client.connect()  
  .then(() => {
    console.log('Conexión exitosa a la bdd');
  })
  .catch(err => {
    console.error('Error al conectar a la bdd', err);
    client.end();
  });
  
export { client};
  