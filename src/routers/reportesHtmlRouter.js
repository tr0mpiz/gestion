import express from "express";
import fs from "fs";
import path from "path";
import { isUser } from "../middleware/Helper.js";
import { __dirname, con, ejecutarConsulta } from "../utils.js";
import { socketServer } from "../app.js"; // Importa el objeto io desde app.js


//import { agendaService } from "../services/agenda.services.js";
//import { agendaModel } from "../DAO/models/agenda.model.js";

export const reportesHtmlRouter = express.Router();




reportesHtmlRouter.get("/ejercicios", isUser, async (req, res) => {
    try {
        const results = await ejecutarConsulta('select * from ejercicios WHERE activado = 1');
        
        return res.status(200).render("ejercicios", { ejercicios: results,isUser:req.session.usuario });
    }  catch (error) {
        console.error(error);
        return res.status(404).json({msg:"fallo"});
      }

   
});



reportesHtmlRouter.get("/", isUser, async (req, res) => {
    
    // console.log("entro a admin");
    // try {

    //     const tareas = await ejecutarConsulta("SELECT *,DATE_FORMAT(fechadecreacion, '%d/%m/%Y %H:%i:%s') AS fechadecreacion,DATE_FORMAT(fechadecumplimiento, '%d/%m/%Y %H:%i:%s') AS fechadecumplimiento FROM tareas where estado = 1");
    //     const productos = await ejecutarConsulta('SELECT * FROM productos where baja = 0');
    //     const clientes = await ejecutarConsulta('SELECT * FROM clientes');
    //     const operadores = await ejecutarConsulta('SELECT * FROM usuarios');
    //     return res.status(200).render("socios", {tareas: tareas, isUser:req.session.usuario,productos:productos,clientes:clientes,operadores:operadores});

    // }  catch (error) {
    //     console.error(error);
    //     return res.status(404).json({msg:"fallo"});
    //   }

    try {
        const tareas = await ejecutarConsulta("SELECT *,DATE_FORMAT(fechadecreacion, '%d/%m/%y %H:%i') AS fechadecreacion,DATE_FORMAT(fechadecumplimiento, '%d/%m/%y %H:%i') AS fechadecumplimiento FROM tareas");

        const tareasModificadas = await Promise.all(
            tareas.map(async (tarea) => {
                tarea.clientes = await ejecutarConsulta(
                `SELECT DISTINCT razonsocial FROM tareas_detalles a, clientes b WHERE a.estado NOT IN (-1) AND a.idcliente = b.id AND a.idtarea = ${tarea.id}`
                );
                tarea.clientes = tarea.clientes.map((row) => row.razonsocial);
                tarea.clientes = tarea.clientes.join("- ");
                return tarea;
            })
        );
        
        //console.log(tareasModificadas)
        const productos = await ejecutarConsulta('SELECT * FROM productos where baja = 0');
        const clientes = await ejecutarConsulta('SELECT * FROM clientes');
        const operadores = await ejecutarConsulta('SELECT * FROM usuarios');
        return res.status(200).render("reportes", {tareas: tareas, isUser:req.session.usuario,productos:productos,clientes:clientes,operadores:operadores});
    } catch (error) {
        console.error(error);
        return res.status(404).json({msg:"fallo"});
    }
});

reportesHtmlRouter.get("/siguiente", isUser, async (req, res) => {
    
    try {
        
        //console.log(results);
        
        return res.status(200).render("proximo", { isUser:req.session.usuario});
    }  catch (error) {
        console.error(error);
        return res.status(404).json({msg:"fallo"});
      }

   
});

reportesHtmlRouter.get("/tareas",  isUser,async (req, res) => {
    let idtarea=req.query.idtarea;
    if(!idtarea)
    {

        try {
            const tareasModificadas = await ejecutarConsulta(`SELECT produccion,estacionado,terminado,facturado,entregado,c.nombre as producto,cantidad,idoperario, idcliente , razonsocial ,a.id as idtarea FROM tareas_detalles a, tareas b, productos c, clientes d where a.estado NOT IN (-1)  AND a.idtarea = b.id AND a.producto = c.id  AND a.idcliente = d.id;`);
            return res.status(200).json(tareasModificadas);
            
        }  catch (error) {
            console.error(error);
            return res.status(404).json({msg:"fallo"});
            }
    }
    else{
 
       try {
            //hace el query para detalles de la tarea
            const tareas = await ejecutarConsulta(`SELECT produccion,estacionado,terminado,facturado,entregado,c.nombre as producto,cantidad,idoperario, idcliente , razonsocial ,a.id as idtarea FROM tareas_detalles a, tareas b, productos c, clientes d where a.estado NOT IN (-1) AND idtarea =   ${idtarea} AND a.idtarea = b.id AND a.producto = c.id  AND a.idcliente = d.id;`);
            console.log(`SELECT estacionado,terminado,facturado,entregado,c.descripcion as producto,cantidad,idoperario, idcliente , razonsocial ,a.id as idtarea FROM tareas_detalles a, tareas b, productos c, clientes d where a.estado NOT IN (-1) AND idtarea =   ${idtarea} AND a.idtarea = b.id AND a.producto = c.id  AND a.idcliente = d.id;`);
                
            return res.status(200).json(tareas);
       }  catch (error) {
           console.error(error);
           return res.status(404).json({msg:"fallo"});
         }
    }
   });

reportesHtmlRouter.get("/consulta",  isUser,async (req, res) => {
 let id=req.query.id;
    try {
       
        const results = await ejecutarConsulta("SELECT DATE_FORMAT(nacimiento_paciente, '%d/%m/%Y') AS fecha_formateada_nacimiento, paciente.* FROM socio WHERE id_paciente="+id);
         //
        
        return res.status(200).render("sociosalta", { paciente: results,modificar:false,isUser:req.session.usuario});
    }  catch (error) {
        console.error(error);
        return res.status(404).json({msg:"fallo"});
      }
    
});

reportesHtmlRouter.get("/modificar", isUser, async (req, res) => {
    let id=req.query.id;

       try {
          
           let query = `SELECT DATE_FORMAT(nacimiento_paciente, '%Y-%m-%d') AS fecha_formateada_nacimiento, paciente.* FROM socio`;
           if (id) {
               query = query + ` WHERE id_paciente=${id}`;
           }else{
              if (req.query.dni) {
                  query = query + ` WHERE dni_paciente=${req.query.dni}`;
              }
           }
           const paciente = await ejecutarConsulta(query);
            
    
            const queryCitasConDni_paciente = `Select a.*,b.*,c.*,d.*,DATE_FORMAT(fecha_cita,'%d-%m-%Y') AS fecha, DATE_FORMAT(fecha_cita,'%H:%i') AS hora FROM agenda a,estados b, agenda_estados c,paciente d WHERE a.id_agenda = c.id_agenda AND   c.id_estado = b.id_estado AND   a.id_paciente = d.id_paciente AND dni_paciente = ${req.query.dni} ORDER BY fecha,hora DESC`;
                //ejecuta el query
             //ahora traeme la cantidad de citas pactadas y que hayan estado en sala de espera
            const pactadas = await ejecutarConsulta(`SELECT COUNT(*) AS pactadas FROM agenda a, agenda_estados b WHERE a.id_agenda = b.id_agenda AND b.id_estado = 2 AND a.id_paciente = ${paciente[0].id_paciente}`);
            //ahora busca la cita mas actual y dame la fecha de la proxima cita
            const proximacita = await ejecutarConsulta(`SELECT DATE_FORMAT(proxima_cita,'%d-%m-%Y') AS proxima_cita FROM agenda WHERE id_paciente = ${paciente[0].id_paciente} ORDER BY proxima_cita DESC LIMIT 1`);
             console.log("proximacita",proximacita);
             console.log("pactadas",pactadas);  
            const citas = await ejecutarConsulta(queryCitasConDni_paciente);
            console.log("citas",citas);
            // crea una constante que tenga los archivos de la carpeta storage/req.query.dni y que sean .png
            const rutaCarpetaArchivos = path.join(__dirname, `/public/storage/${req.query.dni}`);
            //crea la carpeta si no existe
            console.log(__dirname)
            if (!fs.existsSync(rutaCarpetaArchivos)) {
                fs.mkdirSync(rutaCarpetaArchivos);
            }
            //lee los archivos de la carpeta que sean.p[ng ] y guarda en files con clave = url y valor = nombre del archivo
            const files = fs.readdirSync(rutaCarpetaArchivos).filter(file => path.extname(file) === '.png').map(file => {
                return {
                    dni: req.query.dni,
                    nombre: file
                }
            });

            
            console.log("files",files);
            console.log("rutaCarpetaArchivos",rutaCarpetaArchivos);
            
            //
           
           return res.status(200).render("sociosalta", { paciente,modificar:true,files,rutaCarpetaArchivos,isUser:req.session.usuario,citas,pactadas,proximacita});
       }  catch (error) {
           console.error(error);
           return res.status(404).json({msg:"fallo"});
         }
       
   });

   reportesHtmlRouter.post("/alta", async (req, res) => {
    try {
      // Obtener los valores del formulario
        
        //aca crea la constante fechadecreacion que es la fecha de hoy formateada para mariadb
        const fechadecreacion = new Date().toISOString().slice(0, 19).replace('T', ' ');
        let {
            id,
        } = req.body;
        // Realizar la inserción o actualización según el valor de 'id'
        if (id > 0) {
            let {
                operadoralta,
                fechadecumplimiento
            } = req.body;
            fechadecumplimiento = new Date(fechadecumplimiento).toISOString().slice(0, 19).replace('T', ' ');
            const updateQuery = `UPDATE tareas SET acumplirpor  = ${operadoralta},fechadecreacion = "${fechadecreacion}",fechadecumplimiento = "${fechadecumplimiento}"  WHERE id = ${id}`;
            console.log(updateQuery);
            await ejecutarConsulta(updateQuery);
        } else {
            const insertQuery = `INSERT INTO tareas (id,ordenadopor,acumplirpor,fechadecreacion,fechadecumplimiento,estado) VALUES (0,0,0,"${fechadecreacion}","${fechadecreacion}",1)`;
            console.log(insertQuery);
            await ejecutarConsulta(insertQuery);
        }
        //ejecutar una funcion que actualiza la tabla con id dataTable y que actualice la tabla
        const results = await ejecutarConsulta('select * from tareas WHERE estado = 1');
        return res.status(200).render("socios", { tareas: results });

    } catch (error) {
      console.error(error);
      return res.status(404).json({ msg: "fallo" });
    }
  });


  reportesHtmlRouter.post("/altaeje", isUser, async (req, res) => {
    let obj = req.body;
    console.log("obj", obj);

    const {
        nombre,
        tecnica,
        link,
        id
      } = req.body;
    try {
        if(id>0)
        {
            const updateEjercicio = await ejecutarConsulta(`UPDATE ejercicios SET nombre="${nombre}",url= "${link}",tecnica="${tecnica}" WHERE id = ${id}`);
            
        }else{
            const insertEjercicio = await ejecutarConsulta(`INSERT INTO ejercicios (id,nombre,url,tecnica,activado) VALUES (0,"${nombre}","${link}","${tecnica}",1)`);
            
        }
        const results = await ejecutarConsulta('select * from ejercicios WHERE activado = 1');
        return res.status(200).render("ejercicios", { ejercicios: results,isUser:req.session.usuario });
    }  catch (error) {
        console.error(error);
        return res.status(404).json({msg:"fallo"});
      }

   
});


reportesHtmlRouter.delete("/:pid", async (req, res) => {
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

reportesHtmlRouter.post("/eliminaItemTarea", isUser,async (req, res) => {
    let id=req.query.id;
       try {
             //crea un query para obtener los datos del paciente y la fecha de la cita formateada DD/MM/YYYY y hora HH:MM
             const updateejercicio = await ejecutarConsulta(`UPDATE tareas_detalles SET estado = -1 WHERE id= ${id}`);
             console.log(`UPDATE tareas_detalles SET estado = -1 WHERE id= ${id}`);
           return res.status(200).json({msg:"ok"})
       }  catch (error) {
           console.error(error);
           return res.status(404).json({msg:"fallo"});
         }
       
   });
   reportesHtmlRouter.post("/completaejerruti", isUser,async (req, res) => {
    let id=req.query.id;
       try {
             //crea el query para ver que estado tiene primero si tiene 0 le pones 1 si tiene 1 le pones 0
            const updateejercicio = await ejecutarConsulta(`UPDATE rutinas SET n_completado = CASE WHEN n_completado = 0 THEN 1 ELSE 0 END WHERE id_rutina= ${id}`);
        
           return res.status(200).json({msg:"ok"})
       }  catch (error) {
           console.error(error);
           return res.status(404).json({msg:"fallo"});
         }
       
   });
   reportesHtmlRouter.post("/altaItemRutina", isUser,async (req, res) => {
    // obtene la informacion del body de la peticion y crea un insert a la tabla de rutinas
    let obj = req.body;
    console.log("obj", obj);
    const {
        idtarea,
        cliente,
        producto,
        cantidad,
        operador,
        } = req.body;
    console.log("obj", obj);

    try {
        //dame la fecha de hoy diames ano hora minutos segundo para mysql
        const fecha = new Date().toISOString().slice(0, 19).replace('T', ' ');
        //inserta en la tabla rutinas los datos del objeto

        const insertEjercicio = await ejecutarConsulta(`INSERT INTO tareas_detalles(id, idtarea, producto, cantidad, estado, fechadecreacion, fechadecumplimiento, idoperario, kilogramoscumplidos,idcliente,estacionado,terminado,facturado,entregado,produccion) VALUES ('0','${idtarea}','${producto}','${cantidad}','1','${fecha}','${fecha}','${operador}','0','${cliente}',0,0,0,0,0)`);

        return res.status(200).json({msg:"ok"});
        // const results = await ejecutarConsulta('select * from rutinas WHERE n_activado = 1');
        // return res.status(200).render("rutinas", { rutinas: results,isUser:req.session.usuario });
    }  catch (error) {
        console.error(error);
        return res.status(404).json({msg:"fallo"});
      }

    
       
   });



reportesHtmlRouter.get("/eliminatarea", isUser,async (req, res) => {
    let id=req.query.id;
         try {
                //crea un query que updatee el estado del socio a 0
                //crea la constante fecha de cumplimiento que es la fecha de hoy formateada para mariadb
                const fechadecumplimiento = new Date().toISOString().slice(0, 19).replace('T', ' ');

                const updatesocio = await ejecutarConsulta(`UPDATE tareas SET estado = 0 AND fechadecumplimiento = "${fechadecumplimiento}" WHERE id= ${id}`);
                const tareas = await ejecutarConsulta("SELECT *,DATE_FORMAT(fechadecreacion, '%d/%m/%y %H:%i') AS fechadecreacion,DATE_FORMAT(fechadecumplimiento, '%d/%m/%y %H:%i') AS fechadecumplimiento FROM tareas");

                const tareasModificadas = await Promise.all(
                    tareas.map(async (tarea) => {
                        tarea.clientes = await ejecutarConsulta(
                        `SELECT razonsocial FROM tareas_detalles a, clientes b WHERE a.estado NOT IN (-1) AND a.idcliente = b.id AND a.idtarea = ${tarea.id}`
                        );
                        tarea.clientes = tarea.clientes.map((row) => row.razonsocial);
                        tarea.clientes = tarea.clientes.join("- ");
                        return tarea;
                    })
                );
                
                //console.log(tareasModificadas)
                const productos = await ejecutarConsulta('SELECT * FROM productos where baja = 0');
                const clientes = await ejecutarConsulta('SELECT * FROM clientes');
                const operadores = await ejecutarConsulta('SELECT * FROM usuarios');
                return res.status(200).render("socios", {tareas: tareas, isUser:req.session.usuario,productos:productos,clientes:clientes,operadores:operadores});
            }  catch (error) {
                console.error(error);
                return res.status(404).json({msg:"fallo"});
                }

        });

reportesHtmlRouter.put("/:pid", async (req, res) => {
    let obj = req.body;
    console.log("obj", obj);
    console.log("PUT");
    const {
        
      } = req.body;
    
    // let pid = req.params.pid;
    // let obj = req.body;
    // let agenda = await Service.updateOne(pid, obj.agenda);
    // if (agenda) {
    //     let agenda = await Service.getAll();
    //     agenda = JSON.parse(JSON.stringify(agenda));
    //     return res.status(200).render("home", { agendaos: agenda });
    // } else {
    //     return res.status(404).json({ status: "error", msg: `No Existe un agendao con ID: ${pid}`, data: {} });
    // }
});