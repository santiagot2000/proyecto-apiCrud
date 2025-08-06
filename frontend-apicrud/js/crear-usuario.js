// variables globales del formulario
const d = document;
let nombreInput = d.querySelector('#nombre-usuario');
let apellidoInput = d.querySelector('#apellido-usuario');
let emailInput = d.querySelector('#email-usuario');
let rolInput = d.querySelector('#rol-usuario');
let btnCreate = d.querySelector('.btn-create');
let btnUpdate = d.querySelector('.btn-update');
let btnLogout = d.querySelector("#btnLogout");

let usuarioUpdate = null;

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
    let data = getDataUsuario();
    if (data) sendDataUsuario(data);
});

// evento al DOMContentLoaded
d.addEventListener("DOMContentLoaded", () => {
    getUser();
    const url = new URLSearchParams(window.location.search);
    const id = url.get("id");
    if (id) {
        usuarioUpdate = JSON.parse(localStorage.getItem("usuarioEdit"));
        if (usuarioUpdate && usuarioUpdate.id == id) {
            updateDataUsuario();
        }
    }
});

// obtener datos del formulario
let getDataUsuario = () => {
    if (
        nombreInput.value &&
        apellidoInput.value &&
        emailInput.value &&
        rolInput.value
    ) {
        let usuario = {
            nombre: nombreInput.value,
            apellido: apellidoInput.value,
            email: emailInput.value,
            rol: rolInput.value
        };

        nombreInput.value = "";
        apellidoInput.value = "";
        emailInput.value = "";
        rolInput.value = "";

        return usuario;
    } else {
        alert("Todos los campos obligatorios deben estar completos.");
    }
};

// enviar datos al servidor
let sendDataUsuario = async (data) => {
    let url = "http://localhost/proyecto-apiCrud/backend-apiCrud/usuarios";
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
            location.href = "listado-usuarios.html";
        }
    } catch (error) {
        console.log(error);
    }
};

// cargar datos para editar
let updateDataUsuario = () => {
    nombreInput.value = usuarioUpdate.nombre;
    apellidoInput.value = usuarioUpdate.apellido;
    emailInput.value = usuarioUpdate.email;
    rolInput.value = usuarioUpdate.rol;

    btnCreate.classList.toggle("d-none");
    btnUpdate.classList.toggle("d-none");

    btnUpdate.addEventListener("click", () => {
        let usuario = {
            id: usuarioUpdate.id,
            nombre: nombreInput.value,
            apellido: apellidoInput.value,
            email: emailInput.value,
            rol: rolInput.value
        };

        localStorage.removeItem("usuarioEdit");
        sendUpdateUsuario(usuario);
    });
};

// enviar actualización de usuario
let sendUpdateUsuario = async (usuario) => {
    let url = "http://localhost/proyecto-apiCrud/backend-apiCrud/usuarios";
    try {
        let respuesta = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(usuario)
        });
        if (respuesta.status === 406) {
            alert("Los datos enviados no son admitidos");
        } else {
            let mensaje = await respuesta.json();
            alert(mensaje.message);
            location.href = "listado-usuarios.html";
        }
    } catch (error) {
        console.log(error);
    }
};