const { Client } = require('pg');
const fs = require('fs');


const client = new Client ({
    host: "serverutnback.postgres.database.azure.com",
    user: "backutn",
    password: "$erver2023",
    database: "sistema_ventas",
    port: 5432,
    ssl: {
        ca: fs.readFileSync("DigiCertGlobalRootCA.crt (1).pem")
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

  module.exports = {client};