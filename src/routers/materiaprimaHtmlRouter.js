import express from "express";
import { con, upload } from "../utils.js";
import { isUser } from "../middleware/Helper.js";
import fs from "fs";
import { __dirname, __filename,ejecutarConsulta } from "../utils.js";
import e from "express";
import { socketServer } from "../app.js"; // Importa el objeto io desde app.js

//import { agendaService } from "../services/agenda.services.js";
//import { agendaModel } from "../DAO/models/agenda.model.js";

export const materiaprimaHtmlRouter = express.Router();






materiaprimaHtmlRouter.get("/eliminaItemInsumo", isUser,async (req, res) => {
    let id=req.query.id;
    if(id){
        try {
            const results = await ejecutarConsulta("UPDATE materiaprima set baja = 1 WHERE id="+id);   
            return res.status(200).json(results);
        }  catch (error) {
            console.error(error);
            return res.status(404).json({msg:"fallo",error:error});
            
          }
    }
    

   
});

materiaprimaHtmlRouter.post("/eliminarproductoasociado", isUser,async (req, res) => {
    let idproducto=req.query.idproducto;
    let idproductoasociado=req.query.idproductoasociado;
    let cantidad=req.query.cantidad;
    if(idproducto){
        try {
            const sql = `UPDATE producto_asociado set baja = 1 WHERE idproducto=${idproductoasociado} AND id=${idproducto} AND cantidad=${cantidad}`;
            console.log(sql);
            const results = await ejecutarConsulta(sql);
            console.log(results);

            return res.status(200).json(results);
        }  catch (error) {
            console.error(error);
            return res.status(404).json({msg:"fallo",error:error});
            
          }
    }
    

   
});

materiaprimaHtmlRouter.get("/", isUser,async (req, res) => {
    let id=req.query.id;
    if(id){
        try {
            const results = await ejecutarConsulta("Select * from materiaprima WHERE baja=0 AND id = "+id);          
            return res.status(200).json(results);
        }  catch (error) {
            console.error(error);
            return res.status(404).json({msg:"fallo",error:error});
          }
    }else{
        try {
            
            //con el req.session.id_usuario obtengo los ejercicios que le corresponden a ese usuario de la tabla rutinas cuando el id_usuario es igual al id del usuario logueado y n_activado es igual a 1
            const insumos = await ejecutarConsulta("Select * from materiaprima a, materiaprima_insumos b WHERE b.id = a.idinsumo AND a.baja=0 ");
            const materiaprima = await ejecutarConsulta("SELECT * from materiaprima_insumos")
            const movimientosmateriaprima = await ejecutarConsulta("SELECT a.cantidad,DATE_FORMAT(a.fecha, '%d/%m/%Y %H:%i') AS fecha_formateada,b.nombre,c.proveedor FROM materiaprima_stock a,materiaprima_insumos b,materiaprima c WHERE c.id = a.idmateriaprima  AND b.id =c.idinsumo;")
            
            return res.status(200).render("materiaprima", { movimientosmateriaprima,materiaprima,insumos: insumos ,isUser:req.session.usuario,info:req.session.info});
        }  catch (error) {
            console.error(error);
            return res.status(404).json({msg:"fallo",error:error});
          }
    }
    

   
});

materiaprimaHtmlRouter.get("/obtenerproductosasociados", isUser,async (req, res) => {
    let id=req.query.id;
    if(id){
        try {
            const productos = await ejecutarConsulta("SELECT * FROM producto_asociado a, productos b WHERE idproducto="+id+" AND a.id=b.id AND a.baja=0");      
            return res.status(200).json(productos);
        }  catch (error) {
            console.error(error);
            return res.status(404).json({msg:"fallo",error:error});
          }
    }
    

   
});
materiaprimaHtmlRouter.post("/agregarinsumo", isUser,async (req, res) => {
    let idinsumo=req.body.idinsumo;
    let idproducto=req.body.idproducto;
    let cantidad=req.body.cantidad;
    if(idinsumo){
        try {
            const productos = await ejecutarConsulta("INSERT INTO producto_asociado (id,idproducto , cantidad,baja) VALUES ("+idinsumo+","+idproducto+","+cantidad+",0)");
            return res.status(200).json(productos);
        }  catch (error) {
            console.error(error);
            return res.status(404).json({msg:"fallo",error:error});
            }
    }
});










materiaprimaHtmlRouter.post('/alta',async (req, res) => {
    // console.log(req)
    let obj = req.body;
   // console.log("hola")
    //console.log("ksajhdkjahsd",obj)
    //console.log("obj", JSON.parse(JSON.stringify(obj)));

    const {
        id,nombre,descripcion,cantidad,proveedor,materiaprima_stock
  } = req.body;
    console.log("obj",obj);
    
    console.log("id",id);
    console.log("nombre",nombre);


    if( id == 0 ){

        
        try {
            
            const sqlProductos = `INSERT INTO materiaprima (id,idinsumo,cantidad,proveedor,descripcion,baja) VALUES (0,${nombre},${cantidad},${proveedor},'${descripcion}',0)`;
           
            console.log("sqlProductos",sqlProductos);
            const insertsqlProductos = await ejecutarConsulta(sqlProductos);
            let idmateriaprima = await ejecutarConsulta(`SELECT * from materiaprima WHERE idinsumo = ${nombre} AND proveedor = ${proveedor}`);
            
            console.log("Materiaprima",idmateriaprima);
            const insertlog = await ejecutarConsulta(`INSERT INTO materiaprima_stock (idmateriaprima, cantidad, operador, fecha) VALUES (${idmateriaprima[0].id}, ${cantidad}, 1, CURRENT_TIMESTAMP)`);
            const productos = await ejecutarConsulta("Select * from materiaprima WHERE baja=0 ");   
            socketServer.emit('mensaje', 'Se agrego un insumo nuevo');       
            return res.status(200).json(productos);
            
           
          } catch (error) {
            console.error('Error al guardar el producto: ', error);
           
          }
         
        
    }else{
        
          let sqUpdateProductos = `UPDATE materiaprima SET proveedor='${proveedor}',descripcion='${descripcion}',cantidad=${cantidad},proveedor =${proveedor} , nombre ='${nombre}' WHERE id=${id}`;
          let insertsqlProductos = await ejecutarConsulta(sqUpdateProductos);
          socketServer.emit('mensaje', 'Se actualizo el insumo '+nombre);
           
       
            
            //console.log("sqlAgendaUpdate", sqlAgendaUpdate);
        
    }
    
    //socketServer.emit('mensaje', 'Se agrego una cita nueva');
    return res.redirect("/insumos/");

   

    
  });