import express from "express";
import { con, upload } from "../utils.js";
import { isUser } from "../middleware/Helper.js";
import fs from "fs";
import { __dirname, __filename,ejecutarConsulta } from "../utils.js";
import e from "express";
import { socketServer } from "../app.js"; // Importa el objeto io desde app.js

//import { agendaService } from "../services/agenda.services.js";
//import { agendaModel } from "../DAO/models/agenda.model.js";

export const formulacionesHtmlRouter = express.Router();



formulacionesHtmlRouter.get("/stockmateria", isUser,async (req, res) => {
    let id=req.query.id;
    try {
        const results = await ejecutarConsulta("Select b.nombre,a.* from materiaprima a, materiaprima_insumos b  WHERE a.idinsumo = b.id AND a.baja=0 AND a.id = "+id);          
        return res.status(200).json(results);
    }  catch (error) {
        console.error(error);
        return res.status(404).json({msg:"fallo",error:error});
        }
    
});


formulacionesHtmlRouter.get("/eliminaFormulacion", isUser,async (req, res) => {
    let id=req.query.id;
    if(id){
        try {
            const results = await ejecutarConsulta("UPDATE formulas set estado = 1 WHERE id="+id);   
            return res.status(200).json(results);
        }  catch (error) {
            console.error(error);
            return res.status(404).json({msg:"fallo",error:error});
            
          }
    }
    

   
});

formulacionesHtmlRouter.post("/eliminarproductoasociado", isUser,async (req, res) => {
    let id=req.query.id;
    if(id){
        try {
            const sql = `UPDATE formulas_detalles set estado = 1 WHERE id=${id}`;
            //update materia prima , buscala con el id  de formulasdetalles e
            const buscainfor = await ejecutarConsulta(`SELECT * FROM formulas_detalles WHERE id =${id}`);
            console.log(`SELECT * FROM formulas_detalles WHERE id =${id}`)
            const updatemateriaprima  = await ejecutarConsulta("UPDATE materiaprima SET cantidad = cantidad + "+buscainfor[0].cantidad+" WHERE id = "+buscainfor[0].insumo);
            let devuelvestock = buscainfor[0].insumo
            console.log("UPDATE materiaprima SET cantidad = cantidad + "+buscainfor[0].cantidad+" WHERE id = "+buscainfor[0].insumo)
            const insertlog = await ejecutarConsulta("INSERT INTO materiaprima_stock (idmateriaprima, cantidad, operador, fecha) VALUES ("+devuelvestock+", "+buscainfor[0].cantidad+", 1, CURRENT_TIMESTAMP)")
            console.log("INSERT INTO materiaprima_stock (idmateriaprima, cantidad, operador, fecha) VALUES ("+devuelvestock+", "+buscainfor[0].cantidad+", 1, CURRENT_TIMESTAMP)");
            const results = await ejecutarConsulta(sql);
            console.log(results);

            return res.status(200).json(results);
        }  catch (error) {
            console.error(error);
            return res.status(404).json({msg:"fallo",error:error});
            
          }
    }
    

   
});

formulacionesHtmlRouter.get("/", isUser,async (req, res) => {
    let id=req.query.id;
    if(id){
        try {
            const results = await ejecutarConsulta("Select *,DATE_FORMAT(fechadecreacion, '%d/%m/%Y %H:%i') AS fechadecreacion_formateada from formulas WHERE estado=0 AND id = "+id);          
            return res.status(200).json(results);
        }  catch (error) {
            console.error(error);
            return res.status(404).json({msg:"fallo",error:error});
          }
    }else{
        try {
            
            //con el req.session.id_usuario obtengo los ejercicios que le corresponden a ese usuario de la tabla rutinas cuando el id_usuario es igual al id del usuario logueado y n_activado es igual a 1
            const productos = await ejecutarConsulta("Select *,DATE_FORMAT(fechadecreacion, '%d/%m/%Y %H:%i') AS fechadecreacion_formateada from formulas WHERE estado=0 ");
            const insumos = await ejecutarConsulta("Select b.nombre,a.proveedor,a.id from materiaprima a,materiaprima_insumos b WHERE b.id = a.idinsumo AND a.baja=0 ");

            return res.status(200).render("formulaciones", { insumos,productos ,isUser:req.session.usuario,info:req.session.info});
        }  catch (error) {
            console.error(error);
            return res.status(404).json({msg:"fallo",error:error});
          }
    }
    

   
});

formulacionesHtmlRouter.get("/obtenerproductosasociados", isUser,async (req, res) => {
    let id=req.query.id;
    if(id){
        try {
            const productos = await ejecutarConsulta("SELECT c.nombre,b.proveedor,a.id as idformula,DATE_FORMAT(fechadecreacion, '%d/%m/%Y %H:%i') AS fechadecreacion_formateada,a.cantidad AS cantidadreal FROM formulas_detalles a, materiaprima b,materiaprima_insumos c WHERE c.id = b.idinsumo AND idformula="+id+" AND a.insumo=b.id AND a.estado=0");
            //console.log(productos);      
            console.log("SELECT * FROM formulas_detalles a, materiaprima b WHERE idformula="+id+" AND a.insumo=b.id AND a.estado=0")
            return res.status(200).json(productos);
        }  catch (error) {
            console.error(error);
            return res.status(404).json({msg:"fallo",error:error});
          }
    }
    

   
});
formulacionesHtmlRouter.post("/agregarinsumo", isUser,async (req, res) => {
    let idinsumo=req.body.idinsumo;
    let idproducto=req.body.idproducto;
    let cantidad=req.body.cantidad;
    
    if(idinsumo){
        try {
            
            let fechaYHoraActual = new Date();
            const fechaYHoraSQL = fechaYHoraActual.toISOString().slice(0, 19).replace('T', ' ');

            const productos = await ejecutarConsulta("INSERT INTO formulas_detalles (id, idformula, insumo, cantidad, estado, fechadecreacion, idoperario) VALUES (0,"+idproducto+","+idinsumo+","+cantidad+",0,CURRENT_TIMESTAMP,0) ");
            const insertmateriaprima  = await ejecutarConsulta("UPDATE materiaprima SET cantidad = cantidad - "+cantidad+" WHERE id = "+idinsumo);
            const insertlog = await ejecutarConsulta("INSERT INTO materiaprima_stock (idmateriaprima, cantidad, operador, fecha) VALUES ("+idinsumo+", "+cantidad*-1+", 1, CURRENT_TIMESTAMP)")
            return res.status(200).json(productos);
        }  catch (error) {
            console.error(error);
            return res.status(404).json({msg:"fallo",error:error});
            }
    }
});








formulacionesHtmlRouter.delete("/eliminar", async (req, res) => {
    let id=req.query.id;
       try {
           const insertagendaestados = await ejecutarConsulta(`INSERT INTO agenda_estados (id_agenda, id_estado, observacion) VALUES (${id}, 6, 'Cancelada por el paciente')`);
           
           const agenda = await ejecutarConsulta("SELECT c.*, a.*, b.*, DATE_FORMAT(nacimiento_paciente,'%d/%m/%Y') AS fecha_formateada, e.descripcion FROM agenda a, paciente b, agenda_estados c, estados e WHERE a.id_paciente=b.id_paciente AND a.id_agenda=c.id_agenda AND c.id_estado=e.id_estado AND a.id_agenda NOT IN (SELECT id_agenda FROM agenda_estados WHERE id_estado IN (2,3,5,6));");
            
           return res.status(200).render("workout", { agenda: agenda });
       }  catch (error) {
           console.error(error);
           return res.status(404).json({msg:"fallo"});
         }
       
   });
  

// formulacionesHtmlRouter.get("/:pid", async (req, res) => {
//     let pid = req.params.pid;
//     let agenda = await Service.getById(pid);
//     // let agenda = await Service.getAll();
//     // agenda = agenda.filter((x) => x._id == pid);
//     agenda = JSON.parse(JSON.stringify(agenda));
//     if (agenda.length == 0) {
//         return res.status(404).json({ status: "error", msg: `No se encuentra ningun agendao con el id: ${pid}`, data: agenda });
//     } else {
//         console.log(agenda);
//         return res.status(200).render("home", { agendaos: agenda });
//     }
// });



formulacionesHtmlRouter.post('/alta',async (req, res) => {
    // console.log(req)
    let obj = req.body;
   // console.log("hola")
    //console.log("ksajhdkjahsd",obj)
    //console.log("obj", JSON.parse(JSON.stringify(obj)));

    const {
        id,comentario
  } = req.body;
    

 

    if( id == 0 ){

        
        try {
            
            const sqlProductos = `INSERT INTO formulas(id, operador, comentario, fechadecreacion, estado) VALUES ('0','0','${comentario}',CURRENT_TIMESTAMP,'0') `;
            console.log("sqlProductos",sqlProductos);
            const insertsqlProductos = await ejecutarConsulta(sqlProductos);

            const productos = await ejecutarConsulta("Select * from formulas WHERE estado=0 ");   
            socketServer.emit('mensaje', 'Se agrego una nueva formula');       
            return res.status(200).json(productos);
            
           
          } catch (error) {
            console.error('Error al guardar el producto: ', error);
           
          }
         
        
    }else{
        
          let sqUpdateProductos = `UPDATE formulas SET  comentario='${comentario}' WHERE id=${id}`;
          console.log(sqUpdateProductos)
          
          let insertsqlProductos = await ejecutarConsulta(sqUpdateProductos);

          socketServer.emit('mensaje', 'Se actualizo la formula');
          return res.redirect("/formulaciones");
           
       
            
            //console.log("sqlAgendaUpdate", sqlAgendaUpdate);
        
    }
    
    //socketServer.emit('mensaje', 'Se agrego una cita nueva');
    return res.redirect("/agenda/calendario");

   

    
  });
  

