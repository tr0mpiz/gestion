let caja = document.getElementById("caja").addEventListener("change", function (event) {
    event.preventDefault(); // Evita que se envíe el formulario de forma tradicional
    let id = document.getElementById("caja").value;
    let texto = document.getElementById("caja").options[document.getElementById("caja").selectedIndex].text;
    //si el texto contiene CAJA B entonces selecciona en el select de tipomovimiento  el que contenga EFECTIVO y lo deshabilita
    if(texto.includes("CAJA B")){
        document.getElementById("tipomovimiento").value = 1;
        document.getElementById("tipomovimiento").disabled = true;
    }else{
        document.getElementById("tipomovimiento").disabled = false;
    }
    
});

document.getElementById("modalagregaejercicioForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Evita que se envíe el formulario de forma tradicional

   
    let id = document.getElementById("id").value;
    let nombre = document.getElementById("nombre").value;
   
    

    let formData = { id, nombre};
    console.log("FormData", formData);
    let url = '/proveedores/alta';
    $.ajax({
        url: url,
        type: "POST",
        data: formData,
        success: function (response) {
            //
            showBootstrapToast("Notificacion","Se actualizo correctamente el Proveedor",2000,"bg-success");
            setTimeout(function() {
                location.reload();
            }, 2000); // 2000 milisegundos = 2 segundo
            //cerra el modal
            $('#modalagregaejercicio').modal('hide');
            //desactiva el boton
  
        },
        error: function (error) {
            console.log(error)
            showBootstrapToast("Notificacion","Ocurrio un error al cargar el cambio ",3000,"bg-danger");
            // Manejar errores de la solicitud
        },
    });
});

function eliminarProductoAsociado(idproducto ,id, cantidad ) {
    let url = '/productos/eliminarproductoasociado?idproductoasociado='+id+'&idproducto='+idproducto+'&cantidad='+cantidad;
    $.ajax({
        url: url,
        type: "POST",
        success: function (response) {
            //
            showBootstrapToast("Notificacion","Se elimino correctamente el Producto",2000,"bg-success");
            
            $('#modalagregaejercicio').modal('hide');
            //desactiva el boton
  
        },
        error: function (error) {
            console.log(error)
            showBootstrapToast("Notificacion","Ocurrio un error al cargar el cambio ",3000,"bg-danger");
            // Manejar errores de la solicitud
        },
    });
}

//espera un click del id agregarCtacte
document.getElementById("agregarCtacte").addEventListener("click", function (event) {
    event.preventDefault(); // Evita que se envíe el formulario de forma tradicional
    let id = document.getElementById("id").value;
    let caja = document.getElementById("caja").value;
    let tipomovimiento = document.getElementById("tipomovimiento").value;
    let cuenta = document.getElementById("cuenta").value;
    let importe = document.getElementById("importe").value;
    let formData = { id, caja, tipomovimiento, cuenta, importe};
    console.log("FormData", formData);
    let url = '/proveedores/agregarCtacte';
    $.ajax({
        url: url,
        type: "GET",
        data: formData,
        success: function (response) {
            //
            showBootstrapToast("Notificacion","Se actualizo correctamente el insumo",2000,"bg-success");
            actualizaVistaCtaCte(id);
            //desactiva el boton
  
        },
        error: function (error) {
            console.log(error)
            showBootstrapToast("Notificacion","Ocurrio un error al cargar el cambio ",3000,"bg-danger");
            // Manejar errores de la solicitud
        },
    });
});

function actualizaVistaCtaCte(id){
    let url = '/proveedores/obtenerctacte?id='+id;
    $.ajax({
        url: url,
        type: "GET",
        success: function (response) {
            console.log(response);
            let html = "";
            // Verificar si 'response' es un arreglo y contiene elementos
            if (Array.isArray(response) && response.length > 0) {
                let ctacte = response;
                

                ctacte.forEach(movimiento => {
                    html += `<tr>
                                <td>${movimiento.tipomovimiento}</td>
                                <td>${movimiento.caja}</td>
                                <td>${movimiento.cuenta} - ${movimiento.numero}</td>
                                <td>${movimiento.importe}</td>
                                <td>${movimiento.fecha}</td>
                                <td class="text-center"><div data-bs-toggle="tooltip" data-bs-offset="0,4" data-bs-placement="top" data-bs-html="true" title="" data-bs-original-title="<i class='bx bx-trash bx-xs' ></i> <span>Eliminar movimiento</span>" onclick="eliminarMovimiento(${movimiento.id},${id})" class="btn btn-icon btn-outline-danger"><i class="bx bx-trash"></i></div></td>
                            </tr>`;
                });
                

                document.getElementById("tbodyproductosasociados").innerHTML = html;
            } else {
                
                if(html == ""){
                    html = `<tr>
                                <td colspan="3">No hay productos asociados</td>
                            </tr>`;
                }
                

                document.getElementById("tbodyproductosasociados").innerHTML = html;
            }

            // Cerrar el modal
            //$('#modalagregaejercicio').modal('hide');
        },
        error: function (xhr, status, error) {
            console.error("Error en la solicitud AJAX:", error);
        }
    });
}




let ejerciciosModal = document.getElementById('modalagregaejercicio')
ejerciciosModal.addEventListener('show.bs.modal', function (event) {
  // Button that triggered the modal
  let button = event.relatedTarget
  // Extract info from data-bs-* attributes

  let id = button.getAttribute('data-bs-id')
  let inputid = ejerciciosModal.querySelector('#id')
  inputid.value = id
  console.log(id);

    if(id==null){
        //si es null es porque es un alta entonces oculta todos los elementos que tengan este class asociados
        let elementos = document.getElementsByClassName("asociados");
        for (let i = 0; i < elementos.length; i++) {
            elementos[i].style.display = "none";
        }
    }else{
        //si es null es porque es un alta entonces oculta todos los elementos que tengan este class asociados
        let elementos = document.getElementsByClassName("asociados");
        for (let i = 0; i < elementos.length; i++) {
            elementos[i].style.display = "block";
        }
    }

  let nombre = button.getAttribute('data-bs-nombre')
  let inputnombre = ejerciciosModal.querySelector('#nombre')
  inputnombre.value = nombre

 //hace una peticion para traer los productos asociados al producto con el id
 let url = '/proveedores/obtenerctacte?id='+id;


 $.ajax({
     url: url,
     type: "GET",
     success: function (response) {
         console.log(response);
         let html = "";
         let debe = 0;
         let haber = 0;
         let saldo = 0;
         // Verificar si 'response' es un arreglo y contiene elementos
         if (Array.isArray(response) && response.length > 0) {
            let ctacte = response;
            

            ctacte.forEach(movimiento => {
                //que sume los importes negativos y positivos
                if(movimiento.importe < 0){
                    debe += movimiento.importe;
                }else
                {
                    haber += movimiento.importe;
                }
                saldo = saldo+movimiento.importe;
                
                html += `<tr>
                            <td>${movimiento.tipomovimiento}</td>
                            <td>${movimiento.caja}</td>
                            <td>${movimiento.cuenta} - ${movimiento.numero}</td>
                            <td>${movimiento.importe}</td>
                            <td>${movimiento.fecha}</td>
                            <td class="text-center"><div data-bs-toggle="tooltip" data-bs-offset="0,4" data-bs-placement="top" data-bs-html="true" title="" data-bs-original-title="<i class='bx bx-trash bx-xs' ></i> <span>Eliminar movimiento</span>" onclick="eliminarMovimiento(${movimiento.id},${id})" class="btn btn-icon btn-outline-danger"><i class="bx bx-trash"></i></div></td>
                        </tr>`;
            });

            let debeElement = document.getElementById("debe");
            debeElement.textContent = debe;
            let haberElement = document.getElementById("pagos");
            haberElement.textContent = haber;
            
            let saldoElement = document.getElementById("saldo");
            saldoElement.textContent = saldo;
            //pone el texto en rojo si es negativo y verde si es positivo
            if(saldo < 0){
                saldoElement.style.color = "red";
            }else{
                saldoElement.style.color = "green";
            }


            

            document.getElementById("tbodyproductosasociados").innerHTML = html;
        } else {
             
             if(html == ""){
                 html = `<tr>
                             <td colspan="3">No hay movimientos</td>
                         </tr>`;
             }
             
 
             document.getElementById("tbodyproductosasociados").innerHTML = html;
         }
 
         // Cerrar el modal
         $('#modalagregaejercicio').modal('hide');
     },
     error: function (xhr, status, error) {
         console.error("Error en la solicitud AJAX:", error);
     }
 });
  

 

})