import express from "express";

export const SocketRouter = express.Router();



// SocketRouter.get("/", async (req, res) => {
//     let productos = await Service.getAll();
//     productos = JSON.parse(JSON.stringify(productos));
//     return res.render("realTimeProducts", { productos });
//     // return res.status(200).json({ status: "success", msg: `Se agrego el producto:${productos} al carrito`, data: productos });
// });

SocketRouter.get("/", async (req, res) => {
    
    return res.render("realTimeProducts");
});
