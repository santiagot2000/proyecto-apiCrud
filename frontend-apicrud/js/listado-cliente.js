// variables globales
const tableClientes = document.querySelector("#table-clientes tbody");
const searchInput = document.querySelector("#search-input");
const nameUser = document.querySelector("#nombre-usuario");
const btnLogout = document.querySelector("#btnLogout");


// función para poner nombre de usuario
let getUser = () => {
    let user = JSON.parse(localStorage.getItem("userLogin"));
    if (user) nameUser.textContent = user.nombre;
};

// logout
btnLogout.addEventListener("click", () => {
    localStorage.removeItem("userLogin");
    location.href = "login.html";
});

// buscar
searchInput.addEventListener("keyup", () => {
    searchClientesTable();
});

// DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    getTableDataClientes();
    getUser();
});

// obtener datos de la BD
let getTableDataClientes = async () => {
    let url = "http://localhost/proyecto-apiCrud/backend-apiCrud/clientes";
    try {
        let respuesta = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        if (respuesta.status === 204) {
            console.log("No hay clientes en la BD");
        } else {
            let data = await respuesta.json();
            localStorage.setItem("clientesTabla", JSON.stringify(data));
            renderClientesTable(data);
        }
    } catch (error) {
        console.log(error);
    }
};

// renderizar tabla
let renderClientesTable = (data) => {
    tableClientes.innerHTML = "";
    data.forEach((cliente, i) => {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${i + 1}</td>
            <td>${cliente.nombre}</td>
            <td>${cliente.apellido}</td>
            <td>${cliente.email}</td>
            <td>${cliente.celular}</td>
            <td>${cliente.direccion}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editCliente(${i})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteCliente(${i})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableClientes.appendChild(row);
    });
};

// editar cliente
let editCliente = (pos) => {
    let clientes = JSON.parse(localStorage.getItem("clientesTabla")) || [];
    let cliente = clientes[pos];
    localStorage.setItem("clienteEdit", JSON.stringify(cliente));
    localStorage.removeItem("clientesTabla");
    location.href = "crear-cliente.html";
};

// eliminar cliente
let deleteCliente = async (pos) => {
    let clientes = JSON.parse(localStorage.getItem("clientesTabla")) || [];
    let cliente = clientes[pos];
    let confirmar = confirm(`¿Deseas eliminar a ${cliente.nombre} ${cliente.apellido}?`);
    if (confirmar) {
        let id = { id: cliente.id };
        try {
            let respuesta = await fetch("http://localhost/proyecto-apiCrud/backend-apiCrud/clientes", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(id)
            });
            if (respuesta.status === 406) {
                alert("El ID no fue admitido");
            } else {
                let mensaje = await respuesta.json();
                alert(mensaje.message);
                location.href = "listado-clientes.html";
            }
        } catch (error) {
            console.log(error);
        }
    }
};

// buscar en la tabla
let searchClientesTable = () => {
    let clientes = JSON.parse(localStorage.getItem("clientesTabla")) || [];
    let texto = searchInput.value.toLowerCase();
    let filtrados = clientes.filter(c =>
        c.nombre.toLowerCase().includes(texto) ||
        c.apellido.toLowerCase().includes(texto) ||
        c.email.toLowerCase().includes(texto)
    );
    renderClientesTable(filtrados);
};
