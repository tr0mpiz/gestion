$(document).ready(function () {
//cuando se cambia un select que busque las tareasde ese producto y de ese cliente
$('select').on('change', function() {
    const producto = $('#productofilter option:selected').val();
    const cliente = $('#clientefilter option:selected').val();

    let url = '/produccion/buscatareas?producto=' + producto + '&cliente=' + cliente;

    // Realiza la solicitud AJAX con los valores seleccionados
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            // Limpia el contenido del contenedor de acordeones
            $('#accordionTareas').empty();
            console.log(data);
            // Itera sobre los datos y crea los acordeones
            data.forEach(function(tarea) {
                
                let accordionItem = $('<div class="accordion-item card mb-1"></div>');
                let accordionHeader = $('<h2 class="accordion-header" id="tareatitle-' + tarea.idtarea + '"></h2>');
                let accordionButton = $('<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#tarea-' + tarea.idtarea + tarea.id + '" aria-expanded="false" aria-controls="tarea-' + tarea.idtarea + tarea.id + '"></button>');
                accordionButton.text('TAREA ' + tarea.idtarea  + ' - CLIENTES: ' + tarea.razonsocial);

                accordionButton.appendTo(accordionHeader);
                accordionHeader.appendTo(accordionItem);

                let accordionCollapse = $('<div class="accordion-collapse collapse" id="tarea-' + tarea.idtarea + tarea.id + '" aria-labelledby="tareatitle-' + tarea.idtarea + tarea.id + '" data-bs-parent="#accordionTareas"></div>');
                let accordionBody = $('<div class="accordion-body"></div>');

                // Muestra información de la tarea
                accordionBody.append('<p><b>Producto:</b> ' + tarea.nombre_producto + '</p>');
                accordionBody.append('<p><b>Cantidad:</b> ' + tarea.cantidad + ' UNIDADES</p>');
                accordionBody.append('<p><b>Último movimiento:</b> ' + tarea.fechadecumplimiento + '</p>');
                accordionBody.append('<p><b>Estados:</b> ' + tarea.estado + '</p>');

                // Agrega la lista de checkboxes
                let checkboxList = $('<ul class="list-group"></ul>');

                // Función para crear un elemento de checkbox
                function createCheckbox(id, campo, label, checked, disabled) {
                    let listItem = $('<li class="list-group-item pl-5"></li>');
                    let checkbox = $('<input id="' + id + '" class="form-check-input pl-2" data-campo="' + campo + '" data-id="' + tarea.id + '" type="checkbox" ' + (checked ? 'checked' : '') + (disabled ? 'disabled' : '') + ' aria-label="...">');
                    listItem.append(checkbox);
                    listItem.append(label);
                    return listItem;
                }

                // Agregar los checkboxes con sus propiedades correspondientes
                checkboxList.append(createCheckbox('produccion-' + tarea.id, 'produccion', 'Produccion', tarea.produccion, false));
                checkboxList.append(createCheckbox('estacionado-' + tarea.id, 'estacionado', 'Estacionado', tarea.estacionado, false));
                checkboxList.append(createCheckbox('terminado-' + tarea.id, 'terminado', 'Terminado', tarea.terminado, false));
                checkboxList.append(createCheckbox('facturado-' + tarea.id, 'facturado', 'Facturado', tarea.facturado, false));
                checkboxList.append(createCheckbox('entregado-' + tarea.id, 'entregado', 'Entregado', tarea.entregado, false));

                checkboxList.appendTo(accordionBody);
                accordionBody.appendTo(accordionCollapse);
                accordionCollapse.appendTo(accordionItem);

                accordionItem.appendTo('#accordionTareas');
                $('input[type="checkbox"]').on('click', function () {
                    const checkbox = this;
                    const id = $(checkbox).data('id');
                    const estado = checkbox.checked ? 1 : 0;
                    const campo = $(checkbox).data('campo');
                    const pwd = '072511';
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
                                //desactiva el checkboc que tiene el id del registro 
                                $('#estacionado-' + id).prop('disabled', true);
                
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
                
                        //Ahora si el estado es 1 que muestre un swal para que ingrese la contraseña es igual a 072511  y si es correcta que cambie el estado.
                        if (estado == 0 ) {
                            Swal.fire({
                                title: 'Ingrese la contraseña',
                                input: 'password',
                                inputAttributes: {
                                    autocapitalize: 'off'
                                },
                                showCancelButton: true,
                                confirmButtonText: 'Confirmar',
                                cancelButtonText: 'Cancelar',
                                showLoaderOnConfirm: true,
                                preConfirm: (login) => {
                                    $('#estacionado-' + id).prop('disabled', false);
                                    if (login == pwd) {
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
                                        Swal.showValidationMessage(
                                            'Contraseña incorrecta'
                                        )
                                    }
                                },
                                allowOutsideClick: () => !Swal.isLoading()
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
                       
                    }
                });
            });
        },
        error: function(xhr, textStatus, errorThrown) {
            // Manejar errores aquí
        }
    });
});




  $('input[type="checkbox"]').on('click', function () {
    const checkbox = this;
    const id = $(checkbox).data('id');
    const estado = checkbox.checked ? 1 : 0;
    const campo = $(checkbox).data('campo');
    const pwd = '072511';
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
                //desactiva el checkboc que tiene el id del registro 
                $('#estacionado-' + id).prop('disabled', true);

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

        //Ahora si el estado es 1 que muestre un swal para que ingrese la contraseña es igual a 072511  y si es correcta que cambie el estado.
        if (estado == 0 ) {
            Swal.fire({
                title: 'Ingrese la contraseña',
                input: 'password',
                inputAttributes: {
                    autocapitalize: 'off'
                },
                showCancelButton: true,
                confirmButtonText: 'Confirmar',
                cancelButtonText: 'Cancelar',
                showLoaderOnConfirm: true,
                preConfirm: (login) => {
                    $('#estacionado-' + id).prop('disabled', false);
                    if (login == pwd) {
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
                        Swal.showValidationMessage(
                            'Contraseña incorrecta'
                        )
                    }
                },
                allowOutsideClick: () => !Swal.isLoading()
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
