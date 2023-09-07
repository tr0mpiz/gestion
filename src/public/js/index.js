//FRONT
const socket = io();

// socket.on("msg_back_to_front", (data) => {
//     console.log(data);
// });

socket.on("mensaje", (data) => {
    
    showBootstrapToast("Ahora", data, 6000, "bg-info");

    
});


socket.on("agregarFila", (data) => {

    let paciente = data;

    //solo mostra el toast si la pagina es paciente/siguiente
    if (window.location.href.includes("paciente/siguiente")) {
        showBootstrapToast("Ahora", "El  Paciente "+paciente[0].nombre_paciente+" "+paciente[0].apellido_paciente+" esta esperando ser atendido.", 6500, "bg-info");
        ring("sonido.mp3")
    }
    
    console.log("paciente", paciente);

    let cantidadsala = document.getElementById("cantidadsala").textContent;
    //sumale 1
    cantidadsala = parseInt(cantidadsala) + 1;
    //guarda el valor en el input
    document.getElementById("cantidadsala").textContent = cantidadsala;

    
    let lista = document.getElementById("table-proximo");
    //elimina el td que tiene el class="dataTables_empty"
    let td = document.getElementsByClassName("dataTables_empty")[0]
    if (td) {
        td.remove();
    }
    lista.innerHTML += `<tr id="product-${paciente[0].id_agenda}" >
                            <td>${paciente[0].fecha_cita}</td>
                            <td>${paciente[0].nombre_paciente}</td>
                            <td>${paciente[0].apellido_paciente}</td>
                            <td>${paciente[0].dni_paciente}</td>
                            <td>${paciente[0].contacto_paciente}</td>
                            <td><span class="badge bg-white text-primary">EN SALA</span></td>
                            <td>
                            <div class="btn-group btn-group-horizontal">
                                
                                <a data-bs-toggle="tooltip" data-bs-offset="0,4" data-bs-placement="top" data-bs-html="true" title="" data-bs-original-title="<i class='bi ib-wrench-adjustable' ></i> <span>Enviar a Taller</span>"  href="#"  class="btn btn-icon btn-outline-success ml-1" onclick="peticionAjax('/agenda/entaller?id=${paciente[0].id_agenda}','GET','true','false')"><i class="bi bi-wrench-adjustable"></i> </a>
                                <a data-bs-toggle="tooltip" data-bs-offset="0,4" data-bs-placement="top" data-bs-html="true" title="" data-bs-original-title="<i class='bx bx-pencil bx-xs' ></i> <span>Modifica Paciente</span>" href="/paciente/modificar?dni=${paciente[0].dni_paciente}" class="btn btn-icon btn-outline-warning ml-1"><i class="bi bi-pencil-fill"></i></a>
                            </div>
                            </td>
                        </tr>`;
});

function recuperarDatosDelSessionStorage() {
    var usuario = sessionStorage.getItem("usuario");
    var cartId = sessionStorage.getItem("cartId");

    if (!usuario || !cartId) {
        toast("No se encuantra logeado", "error", "bottom-right");
        return false;
    } else {
        return { usuario, cartId };
    }
}
