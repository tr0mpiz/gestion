
const modalRutinas = document.getElementById("tareasModal");
modalRutinas.addEventListener("show.bs.modal", function (event) {
  const button = event.relatedTarget; // Botón que abrió el modal
  const id = button.getAttribute("data-idtarea");
  //busca el select que tenga el id idtarea y selecciona el option que tenga el value del dni
  const selectId = modalRutinas.querySelector("#idtarea");
  selectOptionByValue(selectId, id);
  //que simule el change para que se carguen los ejercicios
  selectId.dispatchEvent(new Event('change'));
  // Muestra el id en la consola
  console.log(id); 
  // Función para seleccionar la opción en un select por su valor
  function selectOptionByValue(select, value) {
    for (let i = 0; i < select.options.length; i++) {
      if (select.options[i].value === value) {
        select.options[i].selected = true;
        break;
      }
    }
  }

});



const asignarVencimiento = () => {
  const inputIngreso = document.getElementById('fecha_ingreso');
  const inputVencimiento = document.getElementById('fecha_vencimiento');
  // pone el valor de inputFechaCita en inputIngreso pero sumale un año
  inputVencimiento.value = moment(inputIngreso.value).add(1, 'months').format('YYYY-MM-DD');
}

  const modalAgregarSocio = document.getElementById("modalagregasocio");

  modalAgregarSocio.addEventListener("show.bs.modal", function (event) {
    const button = event.relatedTarget; // Botón que abrió el modal

    // Obtener los valores de los atributos data
    
    const id = button.getAttribute("data-id");
    const operadoralta = button.getAttribute("data-acumplirpor");
    const fechadecreacion = button.getAttribute("data-fechadecreacion");
    const fechadecumplimiento = button.getAttribute("data-fechadecumplimiento");
 
    // Asignar valores a los campos de entrada en el modal
    const inputId = modalAgregarSocio.querySelector("#id");
    const inputOperadoralta = modalAgregarSocio.querySelector("#operadoralta");
    const inputFechadecreacion = modalAgregarSocio.querySelector("#fechadecreacion");
    const inputFechadecumplimiento = modalAgregarSocio.querySelector("#fechadecumplimiento");
    
    
    // Asignar valores a los campos de entrada en el modal
    inputId.value = id;
    inputFechadecreacion.value = fechadecreacion;
    inputFechadecumplimiento.value = fechadecumplimiento;

    if(operadoralta == null){
      inputOperadoralta.value = -3;
    }
    selectOptionByValue(inputOperadoralta, operadoralta);

    if(fechadecreacion == null){
      inputFechadecreacion.value = moment().format('YYYY-MM-DD');
    }else{
      inputFechadecreacion.value = formatDateToInputFormat(fechadecreacion);
    }
    //si la fecha de ingreso es null que le ponga la fecha de hoy
    if(fechadecumplimiento == null){
      inputFechadecumplimiento.value = moment().format('YYYY-MM-DD');
    }else{

      inputFechadecumplimiento.value = formatDateToInputFormat(fechadecumplimiento);
    }
   
    

// Función para formatear fechas en el formato YYYY-MM-DD
      function formatDateToInputFormat(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      }
      // Función para seleccionar la opción en un select por su valor
      function selectOptionByValue(select, value) {
        for (let i = 0; i < select.options.length; i++) {
          if (select.options[i].value === value) {
            select.options[i].selected = true;
            break;
          }
        }
      }
});

function eliminaItemActualizaTarea(id){
  let url = '/socios/eliminaItemTarea?id=' + id;
  
  $.ajax({
      url: url,
      type: 'POST',
      success: function (data) {
          console.log(data);
          showBootstrapToast("Notificacion","Se elimino correctamente el producto se actualizara la pagina",2000,"bg-success");
          
          actualizaVistaEjercicios();
          setTimeout(function() {
            location.reload();
            }, 2000); // 2000 milisegundos = 2 segundo
      },
      error: function (data) {
          console.log(data);
          showBootstrapToast("Error","No se pudo eliminar el producto",1000,"bg-danger");
      }
  });
}

function actualizaEstadoEstadoEjer(id){
  let url = '/socios/completaejerruti?id=' + id;
  
  $.ajax({
      url: url,
      type: 'POST',
      success: function (data) {
          console.log(data);
          showBootstrapToast("Notificacion","Se actualizo correctamente el ejercicio se actualizara la pagina",2000,"bg-success");
          actualizaVistaEjercicios();
          setTimeout(function() {
            location.reload();
            }, 2000); // 2000 milisegundos = 2 segundo
      },
      error: function (data) {
          console.log(data);
          showBootstrapToast("Error","No sepudo actalizar el ejercicio",1000,"bg-danger");
      }
  });
}


document.getElementById("agregarItemTareaForm").addEventListener("submit", function (event) {
  event.preventDefault(); // Evita que se envíe el formulario de forma tradicional

  // Crea un FormData con los datos del formulario pasado como parámetro
  const formData = new FormData(event.target);
  // Crea un objeto con los datos del formulario
  const data = Object.fromEntries(formData);
  // Convierte el objeto en una cadena de texto
  const json = JSON.stringify(data);
  // Muestra el objeto que se enviará al servidor
  console.log(json);
  // Envía el formulario
  let url = 'socios/altaItemRutina';
  $.ajax({
      url: url,
      type: 'POST',
      data: json,
      contentType: 'application/json',
      success: function (data) {
          console.log(data);
          showBootstrapToast("Notificacion","Se actualizo correctamente la tarea se actualizara la pagina",2000,"bg-success");
          // setTimeout(function() {
          //     location.reload();
          // }, 1000); // 1000 milisegundos = 1 segundo
          // //cerra el modal
          actualizaVistaEjercicios();
          setTimeout(function() {
            location.reload();
            }, 2000); // 2000 milisegundos = 2 segundo
          $('#modalagregasocio').modal('hide');
          //alert('Socio creado correctamente');
          //location.reload();
      },
      error: function (error) {
        console.log(data);
          showBootstrapToast("Notificacion","Error al actualizar la tarea",2000,"bg-danger");
          // setTimeout(function() {
          //     location.reload();
          // }, 1000); // 1000 milisegundos = 1 segundo
          //cerra el modal
          $('#modalagregasocio').modal('hide');
      }
  });
});

//crea una funcion para simular el change del select
function actualizaVistaEjercicios() {
  let selectTarea = modalRutinas.querySelector("#idtarea");
  selectTarea.dispatchEvent(new Event('change'));
}


document.getElementById("addSocio").addEventListener("submit", function (event) {
  event.preventDefault(); // Evita que se envíe el formulario de forma tradicional

  // Crea un FormData con los datos del formulario pasado como parámetro
  const formData = new FormData(event.target);
  // Crea un objeto con los datos del formulario
  const data = Object.fromEntries(formData);
  // Convierte el objeto en una cadena de texto
  const json = JSON.stringify(data);
  // Muestra el objeto que se enviará al servidor
  console.log(json);
  // Envía el formulario
  let url = '/socios/alta';
  $.ajax({
      url: url,
      type: 'POST',
      data: json,
      contentType: 'application/json',
      success: function (data) {
          console.log(data);
          showBootstrapToast("Notificacion","Se actualizo correctamente la tarea",2000,"bg-success");
          
          //cerra el modal
          $('#modalagregasocio').modal('hide');
          //actualizaVistaTareas();
          //alert('Socio creado correctamente');
          // que espere 2 segundos antes de hacer el reload
          setTimeout(function() {
          location.reload();
          }, 2000); // 2000 milisegundos = 2 segundo
      },
      error: function (error) {
        console.log(data);
          showBootstrapToast("Notificacion","Error al actualizar la tarea",2000,"bg-danger");
          setTimeout(function() {
              location.reload();
          }, 1000); // 1000 milisegundos = 1 segundo
          //cerra el modal
          $('#modalagregasocio').modal('hide');
      }
  });
});




function actualizaVistaTareas() {
  url = '/socios/tareas';
  $.ajax({
      url: url,
      method: 'GET',
      success: function (data) {
         const dataTable = $('#dataTable').DataTable();
          dataTable.clear().draw();
          console.log(data)
          // Agregar cada fila de ejercicio a la tabla
        
          console.log(data)
          alert("asdasd")
          data.forEach(tarea => {
            let idtarea = tarea.id; // Asumiendo que tienes un atributo "id_rutina" en el objeto "ejercicio"
            
            let botonAgregar = `<button class=" btn btn-icon btn-outline-success ml-1" data-idtarea="${tarea.id}" data-bs-toggle="modal" data-bs-target="#tareasModal"><i class="bx bx-clipboard"></i></button> <button data-bs-toggle="tooltip" data-bs-offset="0,4" data-bs-placement="top" data-bs-html="true" title="" data-bs-original-title="<i class='bx bx-trash bx-xs' ></i> <span>Dar de baja a la tarea ${tarea.id}</span>" onclick="peticionAjax('/socios/eliminatarea?id={{this.id}}','GET','true','true')" class="btn btn-icon btn-outline-danger ml-1"><i class="bx bx-trash"></i></button>`;
            
            dataTable.row.add([
              tarea.id,
              tarea.clientes,
              tarea.fechadecreacion,
              botonAgregar
              // Agrega más celdas según tus necesidades
            ]).draw(false); // Dibuja la fila sin refrescar la tabla
          });
          $('[data-bs-toggle="tooltip"]').tooltip();
      },
      error: function (error) {
          console.log(error);
        }
  });

      
           
        

}
//crea una funcion para que cuando el campo idtarea cambie se ejecute la funcion peticonAjax con el metodo get
const idtarea = document.getElementById('idtarea');
if(idtarea){

idtarea.addEventListener('change', async () =>{
  
    const id = idtarea.value;
    const url = `/socios/tareas?idtarea=${id}`;
    const method = 'GET';
    const ejercicios = await peticionAjax(url, method);
    
    
    
    const dataTable = $('#dataTableTareas').DataTable();
    dataTable.clear().draw();

    // Agregar cada fila de ejercicio a la tabla
    console.log(ejercicios);
    ejercicios.forEach(ejercicio => {
      
      webSocket.emit('alerta', ejercicio);
      alert("asdasd")
      console.log(ejercicio);
      let iditemtarea = ejercicio.idtarea;
      let opcionesHtml = `
        <ul class="list-group">
          <li class="list-group-item pl-4">
            <input id="estacionado-${iditemtarea}" class="form-check-input pl-2" data-campo="estacionado" data-id="${iditemtarea}" type="checkbox" ${ejercicio.estacionado == 1 ? 'checked' : ''} aria-label="...">
            Estacionado
          </li>
          <li class="list-group-item pl-4">
            <input id="terminado-${iditemtarea}" class="form-check-input pl-2" data-campo="terminado" data-id="${iditemtarea}" type="checkbox" ${ejercicio.terminado == 1 ? 'checked' : ''} aria-label="...">
            Terminado
          </li>
          <li class="list-group-item pl-4">
            <input id="facturado-${iditemtarea}" class="form-check-input pl-2" data-campo="facturado" data-id="${iditemtarea}" type="checkbox" ${ejercicio.facturado == 1 ? 'checked' : ''} aria-label="...">
            Facturado
          </li>
          <li class="list-group-item pl-4">
            <input id="entregado-${iditemtarea}" class="form-check-input pl-2" data-campo="entregado" data-id="${iditemtarea}" type="checkbox" ${ejercicio.entregado == 1 ? 'checked' : ''} aria-label="...">
            Entregado
          </li>
        </ul>
      `;
    
      dataTable.row.add([
        ejercicio.razonsocial,
        ejercicio.producto,
        ejercicio.cantidad,
        ejercicio.idoperario,
        opcionesHtml
      ]).draw(false);
    });
    
    // ...
    
    
    $('[data-bs-toggle="tooltip"]').tooltip();
  


          
    
    });

}

