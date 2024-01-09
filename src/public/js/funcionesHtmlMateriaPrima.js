document.getElementById("modalagregaejercicioForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Evita que se envíe el formulario de forma tradicional

   
    let id = document.getElementById("id").value;
    let nombre = document.getElementById("nombre").value;
    let idmateriaprima = document.getElementById("nombre").text;
    let descripcion = document.getElementById("descripcion").value;
    let cantidad = document.getElementById("cantidad").value;
    let proveedor =document.getElementById("proveedor").value;
    

    let formData = { id, nombre, descripcion,cantidad,proveedor,idmateriaprima };
    console.log("FormData", formData);
    let url = '/materiaprima/alta';
    $.ajax({
        url: url,
        type: "POST",
        data: formData,
        success: function (response) {
            //
            showBootstrapToast("Notificacion","Se actualizo correctamente el Producto la pagina se actualizara en 2 segundos",3000,"bg-success");
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


    



let ejerciciosModal = document.getElementById('modalagregaejercicio')
ejerciciosModal.addEventListener('show.bs.modal', function (event) {
  // Button that triggered the modal
  let button = event.relatedTarget
  // Extract info from data-bs-* attributes

  let id = button.getAttribute('data-bs-id')
  let inputid = ejerciciosModal.querySelector('#id')
  inputid.value = id
  let nombre = button.getAttribute('data-bs-nombre')
  let inputnombre = ejerciciosModal.querySelector('#nombre')
  inputnombre.value = nombre


  
  let descripcion = button.getAttribute('data-bs-descripcion')
  let inputdescripcion = ejerciciosModal.querySelector('#descripcion')
  inputdescripcion.value = descripcion

  let cantidad = button.getAttribute('data-bs-cantidad')
  let inputcantidad = ejerciciosModal.querySelector('#cantidad')
  inputcantidad.value = cantidad

  let proveedor = button.getAttribute('data-bs-proveedor')
  let inputproveedor = ejerciciosModal.querySelector('#proveedor')
  inputproveedor.value = proveedor
  
  


})