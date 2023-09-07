document.getElementById("paciente-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Evita que se envíe el formulario de forma tradicional

    let title = document.getElementById("form-product-title").value;
    let description = document.getElementById("form-product-description").value;
    let price = document.getElementById("form-product-price").value;
    let thumbnail = document.getElementById("form-product-thumbnail").files[0];
    let code = document.getElementById("form-product-code").value;
    let stock = document.getElementById("form-product-stock").value;
    let status = document.getElementById("form-product-status").value;
    let category = document.getElementById("form-product-category").value;

    console.log("click");

    let formData = new FormData(this);
    console.log("FormData", formData);

    $.ajax({
        url: "../upload",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            console.log(response.file);
            // alert("¡Formulario enviado con éxito!");
            toast("La imagen se cargo con exito!!", "success", "bottom-right");
            let obj = { title, description, price, thumbnail: response.file, code, stock, status, category };
            console.log("obj", obj);
            socket.emit("POST", {
                producto: obj,
            });
            // Manejar la respuesta del servidor
        },
        error: function (error) {
            console.log(error);
            toast("Hubo un error al cargar la imagen!!", "error", "bottom-right");
            // Manejar errores de la solicitud
        },
    });
});

const borrarProducto = (id) => {
    socket.emit("DELETE", {
        producto: id,
    });
};

const addCarritoLive = (pid) => {
    const session = recuperarDatosDelSessionStorage();
    if (session.cartId) {
        socket.emit("PUT", {
            cid: session.cartId,
            pid,
        });
    }
};
