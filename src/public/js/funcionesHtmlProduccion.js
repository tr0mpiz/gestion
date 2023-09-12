$(document).ready(function () {
    // Cuando se muestra el modal
    $('#cerrarPallet').on('show.bs.modal', function (event) {
      const button = $(event.relatedTarget); // Botón que disparó el modal
      const producto = button.data('producto');
      const cantidad = button.data('cantidad');
      const cliente = button.data('cliente');
      const estado = button.data('estado');
      const id = button.data('id');
    
      // Actualiza los valores de los campos en el formulario del modal
      $('#producto').val(producto);
      $('#cantidad').val(cantidad);
      $('#cliente').val(cliente);
     //estado es un select busca el valor que tiene y lo selecciona
      $('#estado option[value="'+estado+'"]').attr("selected",true);
      $('#idModal').val(id);
    
    });
  
    // Cuando se hace clic en el botón "Cerrar Pallet" dentro del modal
    $('#cambiarEstadoPalletonclick').on('click', function() {
      const producto = $('#producto').val();
      const cantidad = $('#cantidad').val();
      const estadoSeleccionado = $('#estado').val();
      const id = $('#idModal').val();
      let url = '/produccion/cambiaestado?id=' + id+'&estado='+estadoSeleccionado;
      $.ajax({
        url: url,
        type: 'POST', // o 'POST' u otro método HTTP según tu necesidad
        dataType: 'json', // o 'html', 'xml', etc., dependiendo de la respuesta esperada
        success: function(data) {
          // Manejar la respuesta exitosa aquí
          //actualiza el estado en la tarjeta
          //actualiza la pagina
            location.reload();
        },
        error: function(xhr, textStatus, errorThrown) {
          // Manejar errores aquí
        }
      });
      
      // Realiza la lógica para cerrar el pallet, cambiar el estado y trabajar con producto y cantidad aquí
      // Puedes usar las variables producto, cantidad y estadoSeleccionado para obtener los valores de los campos
      // Luego, cierra el modal
      $('#cerrarPallet').modal('hide');
    });
  });
  
  


function cambiarEstadoPallet(id){
    let url = '/socios/completaejerruti?id=' + id;
    
    $.ajax({
        url: url,
        type: 'POST',
        success: function (data) {
            console.log(data);
            //showBootstrapToast("Notificacion","Se actualizo el estado del ejercicio",1000,"bg-success");
            
            // Agregar clases de deshabilitado a los elementos
            const card = document.querySelector(`.rutina-${id}`);
            const button = card.querySelector('.botonActualizaEstado');
            //valida que no tenga la clase
            if(card.classList.contains('disabled-card')){
                //sacale la clase
                card.classList.remove('disabled-card');
                //le cambie el texto al boton
                button.innerHTML = 'Termine 🎉';
                //le cambie el color al boton
                button.classList.remove('btn-secondary');
                button.classList.add('btn-success');
            }else{
                //agregale la clase
                card.classList.add('disabled-card');
                //le cambie el texto al boton
                
                button.innerHTML = 'Retomar 💪';
                //le cambie el color al boton
                button.classList.remove('btn-success');
                button.classList.add('btn-secondary');
            }

            

            
        },
        error: function (data) {
            console.log(data);
            showBootstrapToast("Error","No se pudo eliminar el ejercicio",1000,"bg-danger");
        }
    });
}
