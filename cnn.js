import express from "express";
//const bodyParse = require('body-parser');
//const cors = require('cors');
import passport from "passport";
import { loginRouter } from "./routes/microsoft.js";
import "./middlewares/microsoft.js";

const port = 3000;

const app = express();

//Hola mundo en el servidor de bienvenida 
app.get('/', (req, res) => {
  res.send(`Hola mundo es una API de Login`);
});

app.use(passport.initialize());

app.use("/auth", loginRouter);


  app.listen(port, () => {
      console.log(`Escuchando en el puerto: http://localhost:${port}`);
  });

