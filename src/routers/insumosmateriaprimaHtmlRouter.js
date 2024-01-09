import express from "express";
import { con, upload } from "../utils.js";
import { isUser } from "../middleware/Helper.js";
import fs from "fs";
import { __dirname, __filename,ejecutarConsulta } from "../utils.js";
import e from "express";
import { socketServer } from "../app.js"; // Importa el objeto io desde app.js

//import { agendaService } from "../services/agenda.services.js";
//import { agendaModel } from "../DAO/models/agenda.model.js";

export const insumosmateriaprimaHtmlRouter = express.Router();






insumosmateriaprimaHtmlRouter.get("/eliminaItemInsumo", isUser,async (req, res) => {
    let id=req.query.id;
    if(id){
        try {
            const results = await ejecutarConsulta("UPDATE materiaprima_insumos set baja = 1 WHERE id="+id);   
            return res.status(200).json(results);
        }  catch (error) {
            console.error(error);
            return res.status(404).json({msg:"fallo",error:error});
            
          }
    }
    

   
});


insumosmateriaprimaHtmlRouter.get("/", isUser,async (req, res) => {
    let id=req.query.id;
    if(id){
        try {
            const results = await ejecutarConsulta("Select * from materiaprima_insumos WHERE baja=0 AND id = "+id);          
            return res.status(200).json(results);
        }  catch (error) {
            console.error(error);
            return res.status(404).json({msg:"fallo",error:error});
          }
    }else{
        try {
            
            //con el req.session.id_usuario obtengo los ejercicios que le corresponden a ese usuario de la tabla rutinas cuando el id_usuario es igual al id del usuario logueado y n_activado es igual a 1
            const insumos = await ejecutarConsulta("Select * from materiaprima_insumos WHERE baja=0 ");


            return res.status(200).render("insumosmateriaprima", { insumos: insumos ,isUser:req.session.usuario,info:req.session.info});
        }  catch (error) {
            console.error(error);
            return res.status(404).json({msg:"fallo",error:error});
          }
    }
    

   
});











insumosmateriaprimaHtmlRouter.post('/alta',async (req, res) => {
    // console.log(req)
    let obj = req.body;
   // console.log("hola")
    //console.log("ksajhdkjahsd",obj)
    //console.log("obj", JSON.parse(JSON.stringify(obj)));

    const {
        id,nombre,descripcion
  } = req.body;
    console.log("obj",obj);
    
    console.log("id",id);
    console.log("nombre",nombre);

 let precio = 0;

    if( id == 0 ){

        
        try {
            
            const sqlProductos = `INSERT INTO materiaprima_insumos (id,nombre,descripcion,baja) VALUES (0,'${nombre}','${descripcion}',0)`;
            console.log("sqlProductos",sqlProductos);
            const insertsqlProductos = await ejecutarConsulta(sqlProductos);

            const productos = await ejecutarConsulta("Select * from materiaprima_insumos WHERE baja=0 ");   
            socketServer.emit('mensaje', 'Se agrego un NUEVA  materia prima');       
            return res.status(200).json(productos);
            
           
          } catch (error) {
            console.error('Error al guardar el producto: ', error);
           
          }
         
        
    }else{
        
          let sqUpdateProductos = `UPDATE materiaprima_insumos SET nombre='${nombre}',descripcion='${descripcion}' WHERE id=${id}`;
          let insertsqlProductos = await ejecutarConsulta(sqUpdateProductos);
          socketServer.emit('mensaje', 'Se actualizo la materia prima '+nombre);
           
       
            
            //console.log("sqlAgendaUpdate", sqlAgendaUpdate);
        
    }
    
    //socketServer.emit('mensaje', 'Se agrego una cita nueva');
    return res.redirect("/insumosmate/");

   

    
  });
  
