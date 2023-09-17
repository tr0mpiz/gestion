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
            showBootstrapToast("Notificacion","Ocurrio un error al cargar el ejercicio ",3000,"bg-danger");
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

  

 

})