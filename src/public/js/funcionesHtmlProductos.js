document.getElementById("modalagregaejercicioForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Evita que se envíe el formulario de forma tradicional

   
    let id = document.getElementById("id").value;
    let nombre = document.getElementById("nombre").value;
    let alto = document.getElementById("alto").value;
    let ancho = document.getElementById("ancho").value;
    let peso = document.getElementById("peso").value;
    let descripcion = document.getElementById("descripcion").value;
    let sku = document.getElementById("sku").value;
    

    let formData = { id, nombre, alto, ancho, peso, descripcion, sku };
    console.log("FormData", formData);
    let url = '/productos/alta';
    $.ajax({
        url: url,
        type: "POST",
        data: formData,
        success: function (response) {
            //
            showBootstrapToast("Notificacion","Se actualizo correctamente el Producto",2000,"bg-success");
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

//espera un click del id agregarInsumo
document.getElementById("agregarInsumo").addEventListener("click", function (event) {
    event.preventDefault(); // Evita que se envíe el formulario de forma tradicional
    let idproducto = document.getElementById("id").value;
    let idinsumo = document.getElementById("productoinsumo").value;
    let cantidad = document.getElementById("cantidadinsumo").value;
    let formData = { idproducto, idinsumo, cantidad };
    console.log("FormData", formData);
    let url = '/productos/agregarinsumo';
    $.ajax({
        url: url,
        type: "POST",
        data: formData,
        success: function (response) {
            //
            showBootstrapToast("Notificacion","Se actualizo correctamente el insumo",2000,"bg-success");
            
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

  let sku = button.getAttribute('data-bs-sku')
  let inputsku = ejerciciosModal.querySelector('#sku')
  inputsku.value = sku

  
  let descripcion = button.getAttribute('data-bs-descripcion')
  let inputdescripcion = ejerciciosModal.querySelector('#descripcion')
  inputdescripcion.value = descripcion

  let alto = button.getAttribute('data-bs-alto')
  let inputalto = ejerciciosModal.querySelector('#alto')
  inputalto.value = alto

  let ancho = button.getAttribute('data-bs-ancho')
  let inputancho = ejerciciosModal.querySelector('#ancho')
  inputancho.value = ancho

  let peso = button.getAttribute('data-bs-peso')
  let inputpeso = ejerciciosModal.querySelector('#peso')
  inputpeso.value = peso
 //hace una peticion para traer los productos asociados al producto con el id
 let url = '/productos/obtenerproductosasociados?id='+id;


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
                             <td>${producto.nombre}</td>
                             <td>${producto.cantidad}</td>
                             <td class="text-center"><div data-bs-toggle="tooltip" data-bs-offset="0,4" data-bs-placement="top" data-bs-html="true" title="" data-bs-original-title="<i class='bx bx-trash bx-xs' ></i> <span>Eliminar producto</span>" onclick="eliminarProductoAsociado(${producto.id},${id},${producto.cantidad})" class="btn btn-icon btn-outline-danger"><i class="bx bx-trash"></i></div></td>
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
         $('#modalagregaejercicio').modal('hide');
     },
     error: function (xhr, status, error) {
         console.error("Error en la solicitud AJAX:", error);
     }
 });
  

 

})