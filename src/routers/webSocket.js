import fs from "fs";
import { __dirname } from "../utils.js";


// webSocket.js
export default function webSocket(socketServer) {
    const io = socketServer;
  
    io.on('connection', (socket) => {

      console.log('Nuevo cliente conectado '+socket.id);
      
  
      // Manejo de desconexiones de clientes
      socket.on('disconnect', () => {
        console.log('Cliente desconectado');
      });

    });
  }
  


// socket.on("POST", async (data) => {
//     let obj = data.producto;
//     // console.log("obj", obj);
//     // let respuesta = await producto.addProduct(obj.title, obj.description, obj.price, obj.thumbnail, obj.code, obj.stock, obj.status, obj.category);
//     let respuesta = await Service.createOne(obj.title, obj.description, obj.price, obj.thumbnail, obj.code, obj.stock, obj.status, obj.category);
//     console.log("respuesta", respuesta);
//     // let productos = await producto.getProducts();
//     if (respuesta.state) {
//         let productoNew = await Service.getById(respuesta._id);
//         console.log("productoNew", productoNew);
//         socketServer.emit("response-post", {
//             msg: productoNew,
//         });
//         socket.emit("response-post-toast", {
//             msg: { msg: "success" },
//         });
//     } else {
//         socket.emit("response-post-error", {
//             msg: { status: "error", msg: `el producto no se pudo crear`, data: {} },
//         });
//     }
// });

// socket.on("DELETE", async (data) => {
//     let id = data.producto;
//     console.log("delete id ", id);

//     let respuesta = await producto.deleteProduct(id);

//     if (respuesta.state) {
//         socketServer.emit("response-delete", {
//             msg: id,
//         });
//         socket.emit("response-delete-toast", {
//             msg: { msg: "success" },
//         });
//     } else {
//         socket.emit("response-delete-error", {
//             msg: { status: "error", msg: `No Existe un producto con ID: ${id}`, data: {} },
//         });
//     }
// });
