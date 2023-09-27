

document.getElementById("modalagregaejercicioForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Evita que se envíe el formulario de forma tradicional

   
    let id = document.getElementById("id").value;
    let tipomovimiento = document.getElementById("tipomovimiento").value;
    let cantidad = document.getElementById("cantidad").value;
    let idtarea = document.getElementById("idtarea").value;
    let producto = document.getElementById("producto").value;

    //crea una variable con la fecha y hora de hoy para mysql
    let fecha = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let formData = { id, tipomovimiento, cantidad, fecha, idtarea, producto };
    console.log(formData);
    console.log("FormData", formData);
    //que corte la ejecucion
    let url = '/stock/alta';
    $.ajax({
        url: url,
        type: "POST",
        data: formData,
        success: function (response) {
            //
            showBootstrapToast("Notificacion","Se actualizo correctamente el Stock",2000,"bg-success");
            setTimeout(function() {
                location.reload();
            }, 2000); // 2000 milisegundos = 2 segundo
            //cerra el modal
            $('#modalagregaejercicio').modal('hide');
            //desactiva el boton
  
        },
        error: function (error) {
            console.log(error)
            showBootstrapToast("Notificacion","Ocurrio un error al cargar el Stock ",3000,"bg-danger");
            // Manejar errores de la solicitud
        },
    });
});

let ejerciciosModal = document.getElementById('modalagregaejercicio')
ejerciciosModal.addEventListener('show.bs.modal', function (event) {
  // Button that triggered the modal
  let button = event.relatedTarget
  // Extract info from data-bs-* attributes
    console.log(button)
  let id = button.getAttribute('data-bs-id')
  let inputid = ejerciciosModal.querySelector('#id')
  inputid.value = id
  let movimiento = button.getAttribute('data-bs-movimiento')
  let inputmovimiento = ejerciciosModal.querySelector('#tipomovimiento')
  inputmovimiento.value = movimiento
  
 

})