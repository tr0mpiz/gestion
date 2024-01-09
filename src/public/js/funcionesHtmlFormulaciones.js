
document.getElementById('productoinsumo').addEventListener('change', function() {
    // Acciones a realizar cuando cambia el valor
    let id = this.value;
    let url = '/formulaciones/stockmateria?id='+id;
    $.ajax({
        url: url,
        type: "GET",
        success: function (response) {
            //
            
            let elemento = document.getElementById('disponibleinsumo');
            // Asignar un valor al elemento
            elemento.value = response[0].cantidad;
            if(response[0].cantidad==0)
            {
                $('#agregarInsumo').hide();
            }else{
                $('#agregarInsumo').show();
            }
            //desactiva el boton
  
        },
        error: function (error) {
            console.log(error)
            showBootstrapToast("Notificacion","Ocurrio un error en la consulta de materiprima ",3000,"bg-danger");
            // Manejar errores de la solicitud
        },
    });

    // Puedes agregar más lógica aquí según tus necesidades
  });

document.getElementById("modalagregaejercicioForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Evita que se envíe el formulario de forma tradicional

   
    let id = document.getElementById("id").value;
   
    let comentario = document.getElementById("comentario").value;
    

    let formData = { id, comentario };
    console.log("FormData", formData);
    let url = '/formulaciones/alta';
    $.ajax({
        url: url,
        type: "POST",
        data: formData,
        success: function (response) {
            //
            
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

function eliminarProductoAsociado(id ) {
    let url = '/formulaciones/eliminarproductoasociado?id='+id;
    $.ajax({
        url: url,
        type: "POST",
        success: function (response) {
            //
            showBootstrapToast("Notificacion","Se elimino correctamente la materia prima",2000,"bg-success");
            
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

//espera un click del id agregarInsumo
document.getElementById("agregarInsumo").addEventListener("click", function (event) {
    event.preventDefault(); // Evita que se envíe el formulario de forma tradicional
    let idproducto = document.getElementById("id").value;
    let idinsumo = document.getElementById("productoinsumo").value;
    let cantidad = document.getElementById("cantidadinsumo").value;
    let formData = { idproducto, idinsumo, cantidad };
    console.log("FormData", formData);
    let url = '/formulaciones/agregarinsumo';
    $.ajax({
        url: url,
        type: "POST",
        data: formData,
        success: function (response) {
            //
            showBootstrapToast("Notificacion","Se actualizo correctamente la materia prima",2000,"bg-success");
            
            $('#modalagregaejercicio').modal('hide');
            $('#modalagregaejercicio').modal('show');
            //desactiva el boton
  
        },
        error: function (error) {
            console.log(error)
            showBootstrapToast("Notificacion","Ocurrio un error al cargar el cambio ",3000,"bg-danger");
            // Manejar errores de la solicitud
        },
    });
});

    



let ejerciciosModal = document.getElementById('modalagregaejercicio')
ejerciciosModal.addEventListener('show.bs.modal', function (event) {
  // Button that triggered the modal
  let productoinsumo = document.getElementById('productoinsumo');
    // Establece el valor predeterminado a -3
  productoinsumo.value = '-3';
  let button = event.relatedTarget
  // Extract info from data-bs-* attributes

  let id = button.getAttribute('data-bs-id')
  let inputid = ejerciciosModal.querySelector('#id')
  inputid.value = id

  
  let disponibleinsumo = ejerciciosModal.querySelector('#disponibleinsumo')
  disponibleinsumo.value = 0;

  let cantidadinsumo = ejerciciosModal.querySelector('#cantidadinsumo')
  cantidadinsumo.value = 0;
  

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

 
  
  let comentario = button.getAttribute('data-bs-comentario')
  let inputcomentario = ejerciciosModal.querySelector('#comentario')
  inputcomentario.value = comentario

 //hace una peticion para traer los productos asociados al producto con el id
 let url = '/formulaciones/obtenerproductosasociados?id='+id;


 $.ajax({
     url: url,
     type: "GET",
     success: function (response) {
         console.log(response);
         let html = "";
         // Verificar si 'response' es un arreglo y contiene elementos
         if (Array.isArray(response) && response.length > 0) {
             let productos = response;
             
 
             productos.forEach(producto => {
                 html += `<tr>
                             <td>${producto.fechadecreacion_formateada}</td>
                             <td>${producto.nombre}</td>
                             <td>${producto.proveedor}</td>
                             <td>${producto.cantidadreal}</td>
                             <td class="text-center"><div data-bs-toggle="tooltip" data-bs-offset="0,4" data-bs-placement="top" data-bs-html="true" title="" data-bs-original-title="<i class='bx bx-trash bx-xs' ></i> <span>Eliminar producto</span>" onclick="eliminarProductoAsociado(${producto.idformula})" class="btn btn-icon btn-outline-danger"><i class="bx bx-trash"></i></div></td>
                         </tr>`;
             });
             

 
             document.getElementById("tbodyproductosasociados").innerHTML = html;
         } else {
             
             if(html == ""){
                 html = `<tr>
                             <td colspan="4">No hay productos asociados</td>
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