// Variables globales
const tableUsuarios = document.querySelector("#table-usuarios tbody");
const searchInput = document.querySelector("#search-input");
const btnLogout = document.querySelector("#btnLogout");

// Función para poner el nombre del usuario
let getUser = () => {
    let user = JSON.parse(localStorage.getItem("userLogin"));
    if (user) nameUser.textContent = user.nombre;
};

// Logout
btnLogout.addEventListener("click", () => {
    localStorage.removeItem("userLogin");
    location.href = "login.html";
});

// Buscar usuarios
searchInput.addEventListener("keyup", () => {
    searchUsuariosTable();
});

// Evento al cargar el documento
document.addEventListener("DOMContentLoaded", () => {
    getTableDataUsuarios();
    getUser();
});

// Obtener datos de la BD
let getTableDataUsuarios = async () => {
    let url = "http://localhost/proyecto-apiCrud/backend-apiCrud/usuarios";
    try {
        let respuesta = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        if (respuesta.status === 204) {
            console.log("No hay usuarios en la BD");
        } else {
            let data = await respuesta.json();
            localStorage.setItem("usuariosTabla", JSON.stringify(data));
            renderUsuariosTable(data);
        }
    } catch (error) {
        console.log(error);
    }
};

// Renderizar tabla
let renderUsuariosTable = (data) => {
    tableUsuarios.innerHTML = "";
    data.forEach((usuario, i) => {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${i + 1}</td>
            <td>${usuario.nombre}</td>
            <td>${usuario.email}</td>
            <td>${usuario.rol}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editUsuario(${i})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteUsuario(${i})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableUsuarios.appendChild(row);
    });
};

// Editar usuario
let editUsuario = (pos) => {
    let usuarios = JSON.parse(localStorage.getItem("usuariosTabla")) || [];
    let usuario = usuarios[pos];
    localStorage.setItem("usuarioEdit", JSON.stringify(usuario));
    localStorage.removeItem("usuariosTabla");
    location.href = "crear-usuario.html";
};

// Eliminar usuario
let deleteUsuario = async (pos) => {
    let usuarios = JSON.parse(localStorage.getItem("usuariosTabla")) || [];
    let usuario = usuarios[pos];
    let confirmar = confirm(`¿Deseas eliminar a ${usuario.nombre} ${usuario.apellido}?`);
    if (confirmar) {
        let id = { id: usuario.id };
        try {
            let respuesta = await fetch("http://localhost/proyecto-apiCrud/backend-apiCrud/usuarios", {
                method: "DELETE",
                headers: { "-Type": "application/json" },
                body: JSON.stringify(id)
            });
            if (respuesta.status === 406) {
                alert("El ID no fue admitido");
            } else {
                let mensaje = await respuesta.json();
                alert(mensaje.message);
                location.href = "listado-usuarios.html";
            }
        } catch (error) {
            console.log(error);
        }
    }
};

// Buscar en la tabla
let searchUsuariosTable = () => {
    let usuarios = JSON.parse(localStorage.getItem("usuariosTabla")) || [];
    let texto = searchInput.value.toLowerCase();
    let filtrados = usuarios.filter(c =>
        c.nombre.toLowerCase().includes(texto) ||
        c.apellido.toLowerCase().includes(texto) ||
        c.email.toLowerCase().includes(texto)
    );
    renderUsuariosTable(filtrados);
};