import express from "express";
import { con, upload } from "../utils.js";
import { isUser } from "../middleware/Helper.js";
import fs from "fs";
import { __dirname, __filename,ejecutarConsulta } from "../utils.js";
import e from "express";
import { socketServer } from "../app.js"; // Importa el objeto io desde app.js
import PDFDocument from 'pdfkit';
import path from "path";


//import { agendaService } from "../services/agenda.services.js";
//import { agendaModel } from "../DAO/models/agenda.model.js";

export const produccionHtmlRouter = express.Router();

produccionHtmlRouter.get("/recordatorios",isUser, async (req, res) => {
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



produccionHtmlRouter.get("/ejercicios", isUser, async (req, res) => {
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

produccionHtmlRouter.get("/", isUser,async (req, res) => {
    let id=req.query.id;
    if(id){
        try {
            const results = await ejecutarConsulta("Select * from productos"+id);          
            return res.status(200).json(results);
        }  catch (error) {
            console.error(error);
            return res.status(404).json({msg:"fallo",error:error});
          }
    }else{
        try {
            

            
            //con el req.session.id_usuario obtengo los ejercicios que le corresponden a ese usuario de la tabla rutinas cuando el id_usuario es igual al id del usuario logueado y n_activado es igual a 1
            const tareas = await ejecutarConsulta("SELECT *,DATE_FORMAT(fechadecreacion, '%d/%m/%y %H:%i') AS fechadecreacion,DATE_FORMAT(fechadecumplimiento, '%d/%m/%y %H:%i') AS fechadecumplimiento FROM tareas WHERE estado=1");
            
            const tareasModificadas = await Promise.all(
                tareas.map(async (tarea) => {
                  tarea.clientes = await ejecutarConsulta(
                    `SELECT DISTINCT razonsocial FROM tareas_detalles a, clientes b WHERE a.estado NOT IN (-1) AND a.idcliente = b.id AND a.idtarea = ${tarea.id} AND a.estado != -1`
                  );
                  
                    //si existe que busque el nombre del cliente y lo agregue a la tarea
                    //si no existe que busque el nombre del cliente y lo agregue a la tarea
                if(tarea.clientes.length > 0 ){
                    //primero que busque si existe un cliente con el id en tarea.clientes
                    tarea.clientes = tarea.clientes.map((row) => row.razonsocial);
                    tarea.clientes = tarea.clientes.join(" - ");
                }else{
                    tarea.clientes = "Sin tareas asignadas";
                }
                  
                  // Obtén todos los detalles de la tarea que incluyen el nombre del producto
                  tarea.detallesTarea = await ejecutarConsulta(
                    `SELECT a.*,DATE_FORMAT(fechadecumplimiento, '%d/%m/%y %H:%i') AS fechadecumplimiento, b.nombre AS nombre_producto ,c.razonsocial,d.descripcion AS nombre_estado
                     FROM tareas_detalles a, productos b,clientes c,estados d
                     WHERE a.idtarea = ${tarea.id}
                     AND a.estado != -1
                     AND a.producto = b.id
                     AND a.idcliente = c.id
                     AND a.estado = d.estado `
                  );
                  
                console.log(tarea.detallesTarea)
              
                  // Aquí puedes agregar cualquier otra información adicional que desees
              
                  return tarea;
                })
              );
            
              
              
              

            return res.status(200).render("produccion", { tareas: tareasModificadas ,isUser:req.session.usuario,info:req.session.info});
        }  catch (error) {
            console.error(error);
            return res.status(404).json({msg:"fallo",error:error});
          }
    }
    

   
});



produccionHtmlRouter.delete("/eliminar", async (req, res) => {
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
  

// produccionHtmlRouter.get("/:pid", async (req, res) => {
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

produccionHtmlRouter.post("/cambiaestado", async (req, res) => {
    let id=req.query.id;
    let estado=req.query.estado;
    let campo=req.query.campo;
    try {
      // Obtener los valores del formulario
        
        //aca crea la constante fechadecreacion que es la fecha de hoy formateada para mariadb
        let fechadecumplimiento = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        // Realizar la inserción o actualización según el valor de 'id'
        
        if (id > 0) {
            // Actualizar
            const updateQuery = `UPDATE tareas_detalles SET ${campo} = ${estado},fechadecumplimiento = "${fechadecumplimiento}"  WHERE id = ${id}`;
            console.log(updateQuery);
            await ejecutarConsulta(updateQuery);
            let estadonombre="pendiente";
            if(estado==1){
                estadonombre="Confirmada"
            }
            if(campo=="terminado" && estado==1){
                const selectStock = await ejecutarConsulta(`SELECT * FROM tareas_detalles WHERE id = ${id}`);
                let tarea = await selectStock[0];
                //creame una fecha de hot para myqsl
                let fechadecumplimiento = new Date().toISOString().slice(0, 19).replace('T', ' ');
                const sqlStock = `INSERT INTO stock (id, idproducto, cantidad, tipomovimiento, idtarea, fecha,baja) VALUES (NULL, ${tarea.producto}, ${tarea.cantidad}, '99', ${tarea.idtarea}, '${fechadecumplimiento}', '0')`;
                console.log("sqlStock",sqlStock);
                await ejecutarConsulta(sqlStock);
            }
            if(campo =="entregado" && estado==1){
                const selectStock = await ejecutarConsulta(`SELECT * FROM tareas_detalles WHERE id = ${id}`);
                let tarea = await selectStock[0];
                //creame una fecha de hot para myqsl
                let fechadecumplimiento = new Date().toISOString().slice(0, 19).replace('T', ' ');
                //como el estado es entregado tiene que hacer cantidad * -1 
                let cantidadBaja = tarea.cantidad * -1;

                const sqlStock = `INSERT INTO stock (id, idproducto, cantidad, tipomovimiento, idtarea, fecha,baja) VALUES (NULL, ${tarea.producto}, ${cantidadBaja}, '98', ${tarea.idtarea}, '${fechadecumplimiento}', '0')`;
                console.log("sqlStock",sqlStock);
                await ejecutarConsulta(sqlStock);
            }

            //trae todos los campos de la tarea con el id que se le pasa por parametro
            const tareas = await ejecutarConsulta(`SELECT * FROM tareas_detalles a, clientes b, productos c WHERE a.idcliente = b.id AND a.producto = c.id AND a.id = ${id}`);
            console.log("tareas",tareas);
            // Crear el PDF
            // Generar el PDF
            const pdf = new PDFDocument();
           
            // Agregar la información de la tarea al PDF
            if (tareas.length > 0) {
            const tarea = tareas[0]; // Supongamos que solo obtenemos un resultado
            //crea un archivo decente que sea como una tabla o archivo de facil entendimiento con los datos de la tarea y el cliente
            //setea la fuente y el tamaño de la letra
            pdf.fontSize(43);
            pdf.text(`Tarea º ${tarea.idtarea}`, {
                align: 'center'
              });
            pdf.moveDown();
            pdf.fontSize(28);
            //agregale un fondo que sea una imagen de fondo
            //que imprima la tarea y un salto de linea tipo br o n
            //imagend e fondo fullwidt
            pdf.image(path.join(__dirname, 'public', 'logo.png'), 200, 600, { width: 200 });
            //crea una variable fecha y hora dd/mm/a  HH:MM:SS
            const fecha = new Date().toLocaleDateString();
            const hora = new Date().toLocaleTimeString();

            //imprime la fecha y hora
            
            pdf.text(`${fecha} -  ${hora}`, {
                align: 'center'
            });
            //simula un salto de linea
           
            //simula un salto de linea
            pdf.moveDown();
            pdf.text(`Cliente  -  ${tarea.razonsocial}`, {
                align: 'center'
            });
            pdf.moveDown();
            pdf.text(`Producto  -  ${tarea.nombre}  Cantidad - ${tarea.cantidad}`, {
                align: 'center'
            });
            pdf.moveDown();
            pdf.text(``, {
                align: 'center'
            });
            pdf.moveDown();
            pdf.text(`Acción  -  ${campo}`, {
                align: 'center'
            });
            pdf.moveDown();
            pdf.text(`ESTADO  -  ${estadonombre}`, {
                align: 'center'
            });
            }

            

            // Guardar el PDF en el servidor
            const random = Math.floor(Math.random() * 1000);
            const pdfFileName = `tarea_${id}_${campo}_${estado}_${random}.pdf`;
            const pdfFilePath = __dirname + `/public/${pdfFileName}`;
            console.log(pdfFilePath);
            pdf.pipe(fs.createWriteStream(pdfFilePath));
            pdf.end();

            const pdfFileLink = `/produccion/descargar-pdf/${pdfFileName}`;
            const messageWithLink = `Cambio el estado ${campo} de la tarea con ID ${id} a ${estadonombre} <a href="${pdfFileLink}" target="_blank">Ver PDF</a>`;

            // Emitir el mensaje con el enlace al PDF a través del socket
            socketServer.emit('mensaje', messageWithLink);
            // Construye el mensaje con el enlace al PDF
            
        } 
    } catch (error) {
      console.error(error);
      return res.status(404).json({ msg: "fallo" });
    }
  });

  produccionHtmlRouter.get("/descargar-pdf/:pdfFileName", (req, res) => {

    const pdfFileName = req.params.pdfFileName;
    const pdfFilePath = __dirname + `/public/${pdfFileName}`;
  
    // Verifica que el archivo PDF exista antes de enviarlo
    if (fs.existsSync(pdfFilePath)) {
      res.sendFile(pdfFilePath);
    } else {
      res.status(404).json({ status: 'error', msg: 'Archivo no encontrado' });
    }
  });



produccionHtmlRouter.delete("/:pid", async (req, res) => {
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

produccionHtmlRouter.put("/:pid", async (req, res) => {
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