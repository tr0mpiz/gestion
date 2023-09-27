import express from "express";
import { con, upload } from "../utils.js";
import { isUser } from "../middleware/Helper.js";
import fs from "fs";
import { __dirname, __filename,ejecutarConsulta } from "../utils.js";
import e from "express";
import { socketServer } from "../app.js"; // Importa el objeto io desde app.js

//import { agendaService } from "../services/agenda.services.js";
//import { agendaModel } from "../DAO/models/agenda.model.js";

export const stockHtmlRouter = express.Router();

stockHtmlRouter.get("/recordatorios",isUser, async (req, res) => {
    try {
        //con el req.session.id_usuario obtengo la fecha_vencimiento DD /MM/ AAAA de la tabla socios cuando el id_usuario es igual al id del usuario logueado
        
       // const results = await ejecutarConsulta(`SELECT DATE_FORMAT(fecha_vencimiento,'%d/%m/%Y') AS fecha_vencimiento FROM socios WHERE id=${req.session.id_usuario}`);
        //console.log(results);
        //return res.status(200).json({results,subnick:req.session.subnick});
    } catch (error) {
        console.error(error);
        return res.status(404).json({msg:"fallo"});
        }
});



stockHtmlRouter.get("/ejercicios", isUser, async (req, res) => {
    let json=req.query.json;
    //console.log(json);
    if(json==1){
        
        const citas = await ejecutarConsulta("SELECT  CONCAT(nombre_paciente, ' ', apellido_paciente) AS title, a.comentario_cita AS description, DATE_FORMAT(fecha_cita,'%Y-%m-%d %H:%i:%s') AS start, DATE_FORMAT(fecha_fin_cita,'%Y-%m-%d %H:%i:%s') AS end ,color ,'#ffffff' AS textColor,a.id_agenda AS id   FROM agenda a, paciente b, agenda_estados c, estados e WHERE a.id_paciente=b.id_paciente AND a.id_agenda=c.id_agenda AND c.id_estado=e.id_estado AND a.id_agenda NOT IN (SELECT id_agenda FROM agenda_estados WHERE id_estado IN (6)) GROUP BY title, a.comentario_cita, DATE_FORMAT(fecha_cita,'%Y-%m-%d %H:%i:%s'),DATE_FORMAT(fecha_fin_cita,'%Y-%m-%d %H:%i:%s'),color, a.id_agenda;");
        
        //console.log(citas);
        return res.status(200).json(citas);
    }else{
        
        try {
            const results = await ejecutarConsulta("SELECT c.*, a.*, b.*, DATE_FORMAT(fecha_cita,'%Y-%m-%d %H:%i:%s') AS fecha_cita, e.descripcion FROM agenda a, paciente b, agenda_estados c, estados e WHERE a.id_paciente=b.id_paciente AND a.id_agenda=c.id_agenda AND c.id_estado=e.id_estado AND a.id_agenda NOT IN (SELECT id_agenda FROM agenda_estados WHERE id_estado IN (2,3,5,6));");
            const pactadas = await ejecutarConsulta("SELECT count(*) AS pactadas FROM agenda_estados WHERE id_estado = 1");
            const fechaCita = new Date();
            fechaCita.setDate(fechaCita.getDate() + 1);
            const fechaFormateada = fechaCita.toISOString().slice(0, 10);
            const maniana = await ejecutarConsulta(`SELECT count(*) as maniana FROM agenda WHERE DATE(fecha_cita) = '${fechaFormateada}' AND id_agenda NOT IN (SELECT id_agenda FROM agenda_estados WHERE id_estado IN (3,5,6))`);
            const hoy = await ejecutarConsulta(`SELECT count(*) as hoy FROM agenda WHERE DATE(fecha_cita) = CURDATE() AND id_agenda NOT IN (SELECT id_agenda FROM agenda_estados WHERE id_estado IN (3,5,6))`);
            let fecha = new Date();
            // formate la fecha en dd/mm/yyyy hh:mm:ss
            fecha = fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear() + " " + fecha.getHours() + ":" + fecha.getMinutes() ;
    
    
            return res.status(200).render("calendario", { pacientes: results ,fecha:fecha,maniana:maniana,pactadas:pactadas,hoy:hoy,isUser:req.session.usuario});
        }  catch (error) {
            console.error(error);
            return res.status(404).json({msg:"fallo"});
          }
    }
    

   
});


stockHtmlRouter.get("/eliminaItemProducto", isUser,async (req, res) => {
    let id=req.query.id;
    if(id){
        try {
            console.log("UPDATE stock set baja = 1 WHERE id="+id);
            const results = await ejecutarConsulta("UPDATE stock set baja = 1 WHERE id="+id);   
            return res.status(200).json(results);
        }  catch (error) {
            console.error(error);
            return res.status(404).json({msg:"fallo",error:error});
            
          }
    }
    

   
});
stockHtmlRouter.get("/", isUser,async (req, res) => {
    let id=req.query.id;
    if(id){
        try {
            const results = await ejecutarConsulta("Select a.*,b.descripcion from stock a, estados b WHERE baja=0 AND a.tipomovimiento = b.estado  AND id="+id);
            return res.status(200).json(results);
        }  catch (error) {
            console.error(error);
            return res.status(404).json({msg:"fallo",error:error});
          }
    }else{
        try {
            
            //con el req.session.id_usuario obtengo los ejercicios que le corresponden a ese usuario de la tabla rutinas cuando el id_usuario es igual al id del usuario logueado y n_activado es igual a 1
            const stock = await ejecutarConsulta("Select a.*,b.nombre,c.descripcion from stock a, productos b, estados c WHERE a.baja=0 AND a.tipomovimiento = c.estado AND a.idproducto=b.id ");    
            const estados = await ejecutarConsulta("Select * from estados");
            const productos = await ejecutarConsulta("Select * from productos WHERE baja=0 ");   

            return res.status(200).render("stock", { productos,stock ,estados ,isUser:req.session.usuario,info:req.session.info});
        }  catch (error) {
            console.error(error);
            return res.status(404).json({msg:"fallo",error:error});
          }
    }
    

   
});





stockHtmlRouter.post('/alta',async (req, res) => {
    // console.log(req)
    let obj = req.body;
   // console.log("hola")
    //console.log("ksajhdkjahsd",obj)
    //console.log("obj", JSON.parse(JSON.stringify(obj)));

    const {
        id,tipomovimiento,cantidad,idtarea,producto
  } = req.body;
  

    if( id == 0 ){
        try {
            let fecha = new Date().toISOString().slice(0, 19).replace('T', ' ');
            const sqlStock = `INSERT INTO stock (id, idproducto, cantidad, tipomovimiento, idtarea, fecha,baja) VALUES (NULL, '${producto}','${cantidad}','${tipomovimiento}','${idtarea}','${fecha}','0' );`;
            console.log("sqlStock",sqlStock);
            const insertsqlStock = await ejecutarConsulta(sqlStock);

            const stock = await ejecutarConsulta("Select * from stock Where baja=0");   
            socketServer.emit('mensaje', 'Se agrego un producto');       
            return res.status(200).json(stock);
            
           
          } catch (error) {
            console.error('Error al guardar el producto: ', error);
           
          }
    }else{
        
          let sqUpdateProductos = `UPDATE productos SET sku='${sku}', nombre='${nombre}', alto='${alto}', ancho='${ancho}', peso='${peso}', descripcion='${descripcion}' WHERE id=${id}`;
          let insertsqlProductos = await ejecutarConsulta(sqUpdateProductos);
          socketServer.emit('mensaje', 'Se actualizo el producto');
           
       
            
            //console.log("sqlAgendaUpdate", sqlAgendaUpdate);
        
    }
    
    //socketServer.emit('mensaje', 'Se agrego una cita nueva');
    return res.redirect("/stock");

   

    
  });
  

stockHtmlRouter.delete("/:pid", async (req, res) => {
    let pid = req.params.pid;
    let agenda = await Service.getById(pid);
    agenda = JSON.parse(JSON.stringify(agenda));
    const rutaArchivo = __dirname + "/public/pictures/" + agenda[0].thumbnail;
    let deleteagenda = await Service.deletedOne(pid);
    console.log(deleteagenda);
    if ((deleteagenda.deletedCount = 0)) {
        return res.status(404).json({ status: "error", msg: `No Existe un agendao con ID: ${pid}`, data: {} });
    } else {
        fs.unlink(rutaArchivo, (err) => {
            if (err) {
                console.error(err);
                res.status(500).send("No se pudo eliminar el archivo.");
            }
        });
        let allagendaos = await Service.getAll();
        allagendaos = JSON.parse(JSON.stringify(allagendaos));
        console.log("allagendaos", allagendaos);
        return res.status(200).render("home", { agendaos: allagendaos });
    }
});

stockHtmlRouter.put("/:pid", async (req, res) => {
    let pid = req.params.pid;
    let obj = req.body;
    let agenda = await Service.updateOne(pid, obj.agenda);
    if (agenda) {
        let agenda = await Service.getAll();
        agenda = JSON.parse(JSON.stringify(agenda));
        return res.status(200).render("home", { agendaos: agenda });
    } else {
        return res.status(404).json({ status: "error", msg: `No Existe un agendao con ID: ${pid}`, data: {} });
    }
});