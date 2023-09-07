document.getElementById("modalagregaejercicioForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Evita que se envíe el formulario de forma tradicional

    let nombre = document.getElementById("modalmodalagregaejercicioFirstName").value;
    let tecnica = document.getElementById("tecnica").value;
    let link = document.getElementById("link").value;
    let id = document.getElementById("id").value;


    let formData = { nombre: nombre,tecnica: tecnica, link: link,id:id }
    console.log("FormData", formData);
    let url = '/socios/altaeje';
    $.ajax({
        url: url,
        type: "POST",
        data: formData,
        success: function (response) {
            //
            showBootstrapToast("Notificacion","Se actualizo correctamente el ejercicio",1000,"bg-success");
            setTimeout(function() {
                location.reload();
            }, 1000); // 1000 milisegundos = 1 segundo
            //cerra el modal
            $('#modalagregaejercicio').modal('hide');
            //desactiva el boton
            document.getElementById("btnagregaejercicio").disabled = true;

            //socketServer.emit('mensaje', 'Se agrego una cita nueva');
            // Manejar la respuesta del servidor
  
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

  let url = button.getAttribute('data-bs-url')
  let inputUrl = ejerciciosModal.querySelector('#link')
  inputUrl.value = url


  let nombre = button.getAttribute('data-bs-nombre')
  let inputnombre = ejerciciosModal.querySelector('#modalmodalagregaejercicioFirstName')
  inputnombre.value = nombre

  let tecnica = button.getAttribute('data-bs-tecnica')
  let inputtecnica = ejerciciosModal.querySelector('#tecnica')
  inputtecnica.value = tecnica


})