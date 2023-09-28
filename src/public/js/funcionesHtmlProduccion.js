$(document).ready(function () {


  $('input[type="checkbox"]').on('click', function () {
    const checkbox = this;
    const id = $(checkbox).data('id');
    const estado = checkbox.checked ? 1 : 0;
    const campo = $(checkbox).data('campo');

    if (estado == 1 && campo == 'terminado') {
        // El estado es "terminado", solicita los kilos y la selección
        Swal.fire({
            title: 'Registro Terminado',
            html:
                '<input type="number" id="kilos" class="swal2-input" placeholder="Kilos">' +
                '<select id="extrusoraRebobinadora" class="swal2-select form-select">' +
                '<option value="1">EXTRUSORA</option>' +
                '<option value="2">REBOBINADORA</option>' +
                '</select>',
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const kilos = $('#kilos').val();
                const maquina = $('#extrusoraRebobinadora').val();

                // Realiza la solicitud AJAX al servidor con los datos recopilados
                $.ajax({
                    url: '/produccion/cambiaestado?id=' + id + '&estado=' + estado + '&campo=' + campo + '&kilos=' + kilos + '&maquina=' + maquina,
                    method: 'POST',
                    success: function (response) {
                        // Maneja la respuesta del servidor, si es necesario
                        console.log(response);
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        // Maneja errores si es necesario
                        console.log(textStatus);
                    }
                });
            }
        }).then((result) => {
            if (!result.isConfirmed) {
                // El usuario canceló la acción, restaura el estado del checkbox
                checkbox.checked = !checkbox.checked;
            }
        });
    } else {
        // El estado no es "terminado", pregunta al usuario si está seguro
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, confirmar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // El usuario confirmó la acción, realiza la solicitud AJAX al servidor
                $.ajax({
                    url: '/produccion/cambiaestado?id=' + id + '&estado=' + estado + '&campo=' + campo,
                    method: 'POST',
                    success: function (response) {
                        // Maneja la respuesta del servidor, si es necesario
                        console.log(response);
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        // Maneja errores si es necesario
                        console.log(textStatus);
                    }
                });
            } else {
                // El usuario canceló la acción, restaura el estado del checkbox
                checkbox.checked = !checkbox.checked;
            }
        });
    }
});



  
  
  
      
      

    

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
          generatePDF(id);
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
