import express from "express";


import session from "express-session";
import { produccionHtmlRouter } from "./routers/produccionHtmlRouter.js";
import { productosHtmlRouter } from "./routers/productosHtmlRouter.js";
import { tareasHtmlRouter } from "./routers/sociosHtmlRouter.js";
import { loginHtmlRouter } from "./routers/loginHtmlRouter.js";
import handlebars from "express-handlebars";
import path from "path";
import { con, __dirname,upload, user } from "./utils.js";
import http from 'http';
import { Server } from 'socket.io';
import webSocket from "./routers/webSocket.js";





//import webSocket from "./routers/webSocket.js";

// import { producto } from "./../DAO/ProductManager.js";

const app = express();
// const server = http.createServer(app);
// const io = new SocketIO(server);

const port = 8080;
const usuario=con.user;

const httpServer = app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`);
});

const socketServer = new Server(httpServer);

export { socketServer };
webSocket(socketServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configura Handlebars
const hbs = handlebars.create({
  // Opciones de Handlebars
});

// Define el helper "compare"
hbs.handlebars.registerHelper("compare", function (a, b, options) {
  if (a === b) {
      return options.fn(this);
  }
  return options.inverse(this);
});

// Asigna el motor de plantillas
app.engine("handlebars", hbs.engine);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

// app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
  secret: 'UOCRAPRESENTE', // Cambia esto por una cadena secreta más segura
  resave: false,
  saveUninitialized: true
}));
//Rutas: API REST CON JSON
// app.use("/api/products", productRouter);
// app.use("/api/carts", cartRouter);
//Rutas: HTML RENDER SERVER SIDE
app.use("/produccion", produccionHtmlRouter);
app.use("/productos", productosHtmlRouter);
app.use("/socios", tareasHtmlRouter);
app.use("/login", loginHtmlRouter);


//Rutas: SOCKETS
// app.use("/realtimeproducts", SocketRouter);
// Inicialización del socket.io



app.get("/*", async (req, res) => {
    return res.status(404).json({ status: "error", msg: "no encontrado", data: {} });
});

