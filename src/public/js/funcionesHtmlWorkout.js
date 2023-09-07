!function() {
    const t = document.querySelector("#youTubeModal")
      , e = t.querySelector("iframe");
    t.addEventListener("hidden.bs.modal", function() {
        e.setAttribute("src", "")
    });
    {
        const o = [].slice.call(document.querySelectorAll('[data-bs-toggle="modal"]'));
        o.map(function(t) {
            t.onclick = function() {
                const t = this.getAttribute("data-bs-target")
                  , e = this.getAttribute("data-theVideo")
                  , o = e + "?autoplay=1"
                  , c = document.querySelector(t + " iframe");
                c && c.setAttribute("src", o)
            }
        })
    }
}();

function startTimer(exerciseId) {
    const synth = window.speechSynthesis;
    let seconds = 60; // Cambia este valor al tiempo deseado en segundos
    let timerDisplay = document.getElementById(`timer-display-${exerciseId}`);
    let repeticiones = document.getElementById(`repeticiones-${exerciseId}`);
    let series = document.getElementById(`series-${exerciseId}`);
    //let descanso = document.getElementById(`descanso-${exerciseId}`);
    let ejercicio = document.getElementById(`ejercicio-${exerciseId}`);
    //let peso = document.getElementById(`peso-${exerciseId}`);
    ejercicio = ejercicio.innerHTML;
    repeticiones = repeticiones.innerHTML;
    series = series.innerHTML;
    //descanso = descanso.innerHTML;
    //peso = peso.innerHTML;

    console.log(ejercicio);
    console.log(repeticiones);
    console.log(series);
    //console.log(descanso);
    //console.log(peso);


    // Reproduce el sonido al inicio del temporizador
    const startSilbato = new Audio('sonidos/silbato.mp3');
    
    const inicio = new SpeechSynthesisUtterance('El reloj empezara a correr cuando suene el silbato.');
    synth.speak(inicio);
    console.log("Aca");
    //esdperar que termine de hablar para empezar el timer no con un timeout con algo mas preciso que de alguna manera sepa que termino de hablar
    setTimeout(function(){ 
        startSilbato.play();
        const countdown = setInterval(function () {
            timerDisplay.textContent = `${Math.floor(seconds / 60)}:${seconds % 60 < 10 ? '0' : ''}${seconds % 60}`;
            seconds--;
        
            if (seconds < 0) {
              clearInterval(countdown);
              timerDisplay.textContent = 'Tiempo agotado';
        
              // Reproduce el sonido al final del temporizador
              // Genera audio a partir de texto usando TTS
              const utterance = new SpeechSynthesisUtterance('¡Tiempo agotado.   ¡Bien hecho!.');
              utterance.rate = 1; 
              synth.speak(utterance);
              startSilbato.play();
              
        
              
            }
          }, 1000);
    
    
    
    }, 5000);
  
   

  }
  
  


function actualizaEstado(id){
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
