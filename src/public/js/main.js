const peticionAjax = (url, method, reload, confirma) => {
  return new Promise((resolve, reject) => {
    if (confirma === 'true') {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, realizar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (!result.isConfirmed) {
          return reject('Acción cancelada por el usuario');
        }

        realizarPeticion();
      });
    } else {
      realizarPeticion();
    }

    function realizarPeticion() {
      $.ajax({
        type: method,
        url: url,
        // data: formData,
        success: function (response) {
          if (reload === 'true') {
            console.log(reload);
            window.location.reload();
            console.log('Recarga la página');
          } else {
            console.log(reload);
            console.log('NO recargar la página');
            resolve(response);
          }
        },
        error: function (xhr, status, error) {
          console.log(error);
          toast('¡Ha ocurrido un error!', 'error', 'bottom-right');
          reject(error);
        },
      });
    }
  });
};


function setActiveClass() {
    // Obtener la URL actual
    var currentUrl = window.location.href;
    var path = new URL(currentUrl).pathname;
    
    // Obtener todos los elementos <a> dentro de la clase "menu-sub"
    var menuSubLinks = document.querySelectorAll('.menu-sub a');

    // Iterar sobre los elementos y agregar la clase "active" al elemento con href="/agenda/alta" y su elemento <li> padre
    for (var i = 0; i < menuSubLinks.length; i++) {
    var link = menuSubLinks[i];
    if (link.getAttribute('href') === path) {
        link.classList.add('active');
        link.closest('li').classList.add('active');
        link.closest('li').closest('ul').parentNode.classList.add('open');
        
    }
    }
    
  }

setActiveClass();

function ring(sonido){
    var audio = new Audio("../sonidos/"+sonido);
    audio.play();
}

function showBootstrapToast(title, message, duration, type) {
  // Crear el elemento del toast
  
  const toast = document.createElement("div");
  toast.classList.add("toast", "show", type);
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("aria-atomic", "true");

  // Contenido del toast
  toast.innerHTML = `
  
    <div class="toast-header">
      <i class="bx bx-bell me-2"></i>
      <div class="me-auto fw-semibold">${title}</div>
      <small>Ahora</small>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body">${message}</div>
    
  `;

  // Agregar el toast al contenedor
  const toastContainer = document.getElementById("toastContainer");
  toastContainer.appendChild(toast);

  

  // Crear la instancia del toast con Bootstrap
  const bsToast = new bootstrap.Toast(toast, {
    autohide: true,
    delay: duration
  });

  // Mostrar el toast
  bsToast.show();

  // Eliminar el toast del DOM después de que se oculte
  bsToast._element.addEventListener("hidden.bs.toast", function () {
    toastContainer.removeChild(toast);
  });
}


//si la url contiene paciente/siguiente que renderize cada 5 segundos
// if (window.location.href.includes("paciente/siguiente")) {
//   // Establecer conexión con el servidor mediante socket.io
//   console.log("conectado");
//   alert("conectado");
//   const socket = io();

//   // Escucha el evento 'agregarFila' para agregar una nueva fila a la tabla HTML
//   // Escucha el evento 'agregarFila' para agregar una nueva fila a la tabla HTML
//   socket.on('agregarFila', (fila) => {
//     const tableBody = document.querySelector('#myTable tbody');
//     const newRow = document.createElement('tr');
//     newRow.id = `paciente-${fila.id}`;
//     newRow.classList.add(fila.id % 2 === 0 ? 'even' : 'odd');

//     // Columna 1
//     const column1 = document.createElement('td');
//     column1.classList.add('sorting_1');
//     column1.textContent = fila.fecha;
//     newRow.appendChild(column1);

//     // Columna 2
//     const column2 = document.createElement('td');
//     column2.textContent = fila.nombre;
//     newRow.appendChild(column2);

//     // Columna 3
//     const column3 = document.createElement('td');
//     column3.textContent = fila.comentario;
//     newRow.appendChild(column3);

//     // Columna 4
//     const column4 = document.createElement('td');
//     column4.textContent = fila.dni;
//     newRow.appendChild(column4);

//     // Columna 5
//     const column5 = document.createElement('td');
//     column5.textContent = fila.telefono;
//     newRow.appendChild(column5);

//     // Columna 6
//     const column6 = document.createElement('td');
//     column6.setAttribute('data-bs-toggle', 'tooltip');
//     column6.setAttribute('data-bs-offset', '0,4');
//     column6.setAttribute('data-bs-placement', 'top');
//     column6.setAttribute('data-bs-html', 'true');
//     column6.setAttribute('title', `<span>${fila.tooltip}</span>`);
//     column6.innerHTML = `<span class="badge bg-white text-primary">${fila.estado}</span>`;
//     newRow.appendChild(column6);

//     // Columna 7
//     const column7 = document.createElement('td');
//     const btnGroup = document.createElement('div');
//     btnGroup.classList.add('btn-group', 'btn-group-horizontal');

//     const consultarBtn = document.createElement('a');
//     consultarBtn.setAttribute('data-bs-toggle', 'tooltip');
//     consultarBtn.setAttribute('data-bs-offset', '0,4');
//     consultarBtn.setAttribute('data-bs-placement', 'top');
//     consultarBtn.setAttribute('data-bs-html', 'true');
//     consultarBtn.setAttribute('title', `<i class='bi bi-eye-fill'></i> <span>Consultar Paciente</span>`);
//     consultarBtn.href = `/paciente/consulta?id=${fila.id}`;
//     consultarBtn.classList.add('btn', 'btn-icon', 'btn-outline-primary', 'm-1');
//     consultarBtn.innerHTML = `<i class="bi bi-eye-fill"></i>`;
//     btnGroup.appendChild(consultarBtn);

//     const enviarTallerBtn = document.createElement('a');
//     enviarTallerBtn.setAttribute('data-bs-toggle', 'tooltip');
//     enviarTallerBtn.setAttribute('data-bs-offset', '0,4');
//     enviarTallerBtn.setAttribute('data-bs-placement', 'top');
//     enviarTallerBtn.setAttribute('data-bs-html', 'true');
//     enviarTallerBtn.setAttribute('title', `<i class='bi ib-wrench-adjustable'></i> <span>Enviar a Taller</span>`);
//     enviarTallerBtn.classList.add('btn', 'btn-icon', 'btn-outline-success', 'm-1');
//     enviarTallerBtn.addEventListener('click', () => {
//       peticionAjax(`/agenda/entaller?id=${fila.id}`, 'GET', 'true');
//     });
//     enviarTallerBtn.innerHTML = `<i class="bi bi-wrench-adjustable"></i>`;
//     btnGroup.appendChild(enviarTallerBtn);

//     const modificarBtn = document.createElement('a');
//     modificarBtn.setAttribute('data-bs-toggle', 'tooltip');
//     modificarBtn.setAttribute('data-bs-offset', '0,4');
//     modificarBtn.setAttribute('data-bs-placement', 'top');
//     modificarBtn.setAttribute('data-bs-html', 'true');
//     modificarBtn.setAttribute('title', `<i class='bx bx-pencil bx-xs'></i> <span>Modifica Paciente</span>`);
//     modificarBtn.href = `/paciente/modificar?dni=${fila.dni}`;
//     modificarBtn.classList.add('btn', 'btn-icon', 'btn-outline-warning', 'm-1');
//     modificarBtn.innerHTML = `<i class="bi bi-pencil-fill"></i>`;
//     btnGroup.appendChild(modificarBtn);

//     column7.appendChild(btnGroup);
//     newRow.appendChild(column7);

//     // Agrega la nueva fila al tbody de la tabla
//     tableBody.appendChild(newRow);
//   });

// }