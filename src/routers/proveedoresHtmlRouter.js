import express from "express";
import { con, upload } from "../utils.js";
import { isUser } from "../middleware/Helper.js";
import fs from "fs";
import { __dirname, __filename,ejecutarConsulta } from "../utils.js";
import e from "express";
import { socketServer } from "../app.js"; // Importa el objeto io desde app.js

//import { agendaService } from "../services/agenda.services.js";
//import { agendaModel } from "../DAO/models/agenda.model.js";

export const proveedoresHtmlRouter = express.Router();




proveedoresHtmlRouter.get("/eliminaProveedor", isUser,async (req, res) => {
    let id=req.query.id;
    if(id){
        try {
            const results = await ejecutarConsulta("UPDATE proveedores set baja = 0 WHERE id="+id);   
            return res.status(200).json(results);
        }  catch (error) {
            console.error(error);
            return res.status(404).json({msg:"fallo",error:error});
            
          }
    }
    

   
});

proveedoresHtmlRouter.post("/eliminarproductoasociado", isUser,async (req, res) => {
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

proveedoresHtmlRouter.get("/", isUser,async (req, res) => {
    let id=req.query.id;
    if(id){
        try {
            const results = await ejecutarConsulta("Select * from proveedores WHERE  id = "+id);          
            return res.status(200).json(results);
        }  catch (error) {
            console.error(error);
            return res.status(404).json({msg:"fallo",error:error});
          }
    }else{
        try {
            
            //con el req.session.id_usuario obtengo los ejercicios que le corresponden a ese usuario de la tabla rutinas cuando el id_usuario es igual al id del usuario logueado y n_activado es igual a 1
            const proveedores = await ejecutarConsulta("Select * from proveedores WHERE baja = 1");
            const cuentas = await ejecutarConsulta("Select * from cuentas ");
            const cajas = await ejecutarConsulta("Select * from cajas ");
            const tipomovimiento = await ejecutarConsulta("Select * from tipomovimiento ");
            return res.status(200).render("proveedores", { cuentas,proveedores,cajas,tipomovimiento ,isUser:req.session.usuario,info:req.session.info});
        }  catch (error) {
            console.error(error);
            return res.status(404).json({msg:"fallo",error:error});
          }
    }
    

   
});

proveedoresHtmlRouter.get("/obtenerctacte", isUser,async (req, res) => {
    let id=req.query.id;
    if(id){
        try {
            const productos = await ejecutarConsulta("SELECT a.razonsocial, b.nombre as tipomovimiento, c.nombre as caja, d.nombre as cuenta, d.numero as numero, e.importe, e.id, DATE_FORMAT(e.fecha, '%d-%m-%Y') AS fecha FROM proveedores a, tipomovimiento b, cajas c, cuentas d, ctacte_proveedores e WHERE a.id=e.proveedor AND b.id=e.tipomovimiento AND c.id=e.caja AND d.id=e.cuenta AND e.proveedor="+id);

            console.log("productos",productos);
            return res.status(200).json(productos);
        }  catch (error) {
            console.error(error);
            return res.status(404).json({msg:"fallo",error:error});
          }
    }
    

   
});
proveedoresHtmlRouter.get("/agregarCtacte", isUser,async (req, res) => {

    
    
    let caja=req.query.caja;
    let tipomovimiento=req.query.tipomovimiento;
    let cuenta=req.query.cuenta;
    let importe=req.query.importe;
    let idproveedor=req.query.id;

    
    if(idproveedor){
        try {
            const productos = await ejecutarConsulta("INSERT INTO ctacte_proveedores (id, tipomovimiento, caja,cuenta,proveedor,importe,fecha ) VALUES (0,"+tipomovimiento+","+caja+","+cuenta+","+idproveedor+","+importe+",NOW())");
            return res.status(200).json(productos);
        }  catch (error) {
            console.error(error);
            return res.status(404).json({msg:"fallo",error:error});
            }
    }
});








proveedoresHtmlRouter.delete("/eliminar", async (req, res) => {
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
  

// proveedoresHtmlRouter.get("/:pid", async (req, res) => {
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



proveedoresHtmlRouter.post('/alta',async (req, res) => {
    // console.log(req)
    let obj = req.body;
   // console.log("hola")
    //console.log("ksajhdkjahsd",obj)
    //console.log("obj", JSON.parse(JSON.stringify(obj)));

    const {
        id,nombre
  } = req.body;
    console.log("obj",obj);
    
    console.log("id",id);
    console.log("nombre",nombre);

 let precio = 0;

    if( id == 0 ){

        
        try {
            
            const sqlProductos = `INSERT INTO proveedores (id, razonsocial,baja)  VALUES ('0','${nombre}',1)`;
            console.log("sqlProductos",sqlProductos);
            const insertsqlProductos = await ejecutarConsulta(sqlProductos);

            const productos = await ejecutarConsulta("Select * from proveedores ");   
            socketServer.emit('mensaje', 'Se agrego un proveedor nuevo');       
            return res.status(200).json(productos);
            
           
          } catch (error) {
            console.error('Error al guardar el producto: ', error);
           
          }
         
        
    }else{
        
          let sqUpdateProductos = `UPDATE proveedores SET  razonsocial='${nombre}' WHERE id=${id}`;
          let insertsqlProductos = await ejecutarConsulta(sqUpdateProductos);
          socketServer.emit('mensaje', 'Se actualizo el proveedor');
           
       
            
            //console.log("sqlAgendaUpdate", sqlAgendaUpdate);
        
    }
    
    //socketServer.emit('mensaje', 'Se agrego una cita nueva');
    return res.redirect("/proveedores");

   

    
  });
  
