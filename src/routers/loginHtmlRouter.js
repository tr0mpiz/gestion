import express from "express";
import { con, upload } from "../utils.js";
import fs from "fs";
import { __dirname, __filename,ejecutarConsulta } from "../utils.js";

//import { agendaService } from "../services/agenda.services.js";
//import { agendaModel } from "../DAO/models/agenda.model.js";

export const loginHtmlRouter = express.Router();

//const Service = new agendaService();

loginHtmlRouter.get("/", async (req, res) => {
    try {
        console.log("entro a login");
        return res.status(200).render("login");
    }  catch (error) {
        console.error(error);
        return res.status(404).json({msg:"fallo"});
      }

   
});

loginHtmlRouter.get("/alta", async (req, res) => {
        return res.status(200).render("usuarioalta");
});

loginHtmlRouter.get("/logout", async (req, res) => {
    req.session.usuario = null;
    req.session.id_usuario = null;
    req.session.nombre = null;
    req.session.apellido = null;
    req.session.permisos = null;
    req.session.info = null;
    req.session.img = null;
    req.session.destroy();
    return res.redirect("/login");

});


loginHtmlRouter.post('/', async (req, res) => {
    const { usuario, password } = req.body;

    const sqlSelectUser = `SELECT * FROM usuarios WHERE usuario = '${usuario}'`;
    //const sqlSelectSocio = `SELECT * FROM socios WHERE email = '${email}' AND estado_id = 1`;

    try {
        const userResults = await ejecutarConsulta(sqlSelectUser);
        //const socioResults = await ejecutarConsulta(sqlSelectSocio);
        //console.log(socioResults)
        if (userResults.length == 0 ) {
            return res.status(200).render("login", { status: "error", msg: `No se encuentra ningún Usuario con el Email` });
        }

        
        if (userResults && userResults.length > 0) {
            const user = userResults[0]; // Obtiene el primer resultado
        
            req.session.id_usuario = user.id;
            req.session.nombre = user.nombre;
            req.session.apellido = user.apellido;
            req.session.permisos = user.permisos;
            return res.redirect("/socios");
        } else {
            return res.status(200).render("login", { status: "error", msg: `Email o contraseña incorrectos para Usuario.`});
        }
        
        

       

    } catch (error) {
        console.error('Error al pedir el usuario: ', error);
        return res.status(500).send('Error de servidor.'+error);
    }
});

  

loginHtmlRouter.delete("/:pid", async (req, res) => {
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

loginHtmlRouter.put("/:pid", async (req, res) => {
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