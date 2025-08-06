// variables globales del formulario
const d = document;
let nombreInput = d.querySelector('#nombre-cliente');
let apellidoInput = d.querySelector('#apellido-cliente');
let emailInput = d.querySelector('#email-cliente');
let celularInput = d.querySelector('#celular-cliente');
let direccionInput = d.querySelector('#direccion-cliente');
let direccion2Input = d.querySelector('#direccion2-cliente');
let descripcionInput = d.querySelector('#descripcion-cliente');
let btnCreate = d.querySelector('.btn-create');
let btnUpdate = d.querySelector('.btn-update');
let nameUser = d.querySelector("#nombre-usuario");
let btnLogout = d.querySelector("#btnLogout");

let clienteUpdate = null;

// función para poner el nombre del usuario
let getUser = () => {
    let user = JSON.parse(localStorage.getItem("userLogin"));
    if (user && nameUser) nameUser.textContent = user.nombre;
};

// evento para logout
btnLogout.addEventListener("click", () => {
    localStorage.removeItem("userLogin");
    location.href = "login.html";
});

// evento al botón crear
btnCreate.addEventListener('click', () => {
    let data = getDataCliente();
    if (data) sendDataCliente(data);
});

// evento al DOMContentLoaded
d.addEventListener("DOMContentLoaded", () => {
    getUser();
    clienteUpdate = JSON.parse(localStorage.getItem("clienteEdit"));
    if (clienteUpdate) {
        updateDataCliente();
    }
});


// obtener datos del formulario
let getDataCliente = () => {
    if (
        nombreInput.value &&
        apellidoInput.value &&
        emailInput.value &&
        celularInput.value &&
        direccionInput.value
    ) {
        let cliente = {
            nombre: nombreInput.value,
            apellido: apellidoInput.value,
            email: emailInput.value,
            celular: celularInput.value,
            direccion: direccionInput.value,
            direccion2: direccion2Input.value || "",
            descripcion: descripcionInput.value || ""
        };

        nombreInput.value = "";
        apellidoInput.value = "";
        emailInput.value = "";
        celularInput.value = "";
        direccionInput.value = "";
        direccion2Input.value = "";
        descripcionInput.value = "";

        return cliente;
    } else {
        alert("Todos los campos obligatorios deben estar completos.");
    }
};

// enviar datos al servidor
let sendDataCliente = async (data) => {
    let url = "http://localhost/proyecto-apiCrud/backend-apiCrud/clientes";
    try {
        let respuesta = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        if (respuesta.status === 406) {
            alert("Los datos enviados no son admitidos");
        } else {
            let mensaje = await respuesta.json();
            alert(mensaje.message);
            location.href = "listado-clientes.html";
        }
    } catch (error) {
        console.log(error);
    }
};

// cargar datos para editar
let updateDataCliente = () => {
    nombreInput.value = clienteUpdate.nombre;
    apellidoInput.value = clienteUpdate.apellido;
    emailInput.value = clienteUpdate.email;
    celularInput.value = clienteUpdate.celular;
    direccionInput.value = clienteUpdate.direccion;
    direccion2Input.value = clienteUpdate.direccion2;
    descripcionInput.value = clienteUpdate.descripcion;
    let cliente;
    btnCreate.classList.toggle("d-none");
    btnUpdate.classList.toggle("d-none");

    btnUpdate.addEventListener("click", () => {
        cliente = {
            id: clienteUpdate.id,
            nombre: nombreInput.value,
            apellido: apellidoInput.value,
            email: emailInput.value,
            celular: celularInput.value,
            direccion: direccionInput.value,
            direccion2: direccion2Input.value,
            descripcion: descripcionInput.value
        };

        localStorage.removeItem("clienteEdit");
        sendUpdateCliente(cliente);
    });
};

// enviar actualización
let sendUpdateCliente = async (cliente) => {
    let url = "http://localhost/proyecto-apiCrud/backend-apiCrud/clientes";
    try {
        let respuesta = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cliente)
        });
        if (respuesta.status === 406) {
            alert("Los datos enviados no son admitidos");
        } else {
            let mensaje = await respuesta.json();
            alert(mensaje.message);
            location.href = "listado-clientes.html";
        }
    } catch (error) {
        console.log(error);
    }
};