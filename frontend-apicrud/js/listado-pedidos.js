// variables globales
const tablePedidos = document.querySelector("#table-pedidos tbody");
const searchInput = document.querySelector("#search-input");
const nameUser = document.querySelector("#nombre-usuario");
const btnLogout = document.querySelector("#btnLogout");

// función para poner el nombre del usuario
let getUser = () => {
    let user = JSON.parse(localStorage.getItem("userLogin"));
    if (user) nameUser.textContent = user.nombre;
};

// evento para logout
btnLogout.addEventListener("click", () => {
    localStorage.removeItem("userLogin");
    location.href = "login.html";
});

// buscar
searchInput.addEventListener("keyup", () => {
    searchPedidosTable();
});

// DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    getTableDataPedidos();
    getUser();
});

// obtener datos de la BD
let getTableDataPedidos = async () => {
    let url = "http://localhost/proyecto-apiCrud/backend-apiCrud/pedidos";
    try {
        let respuesta = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        if (respuesta.status === 204) {
            console.log("No hay pedidos en la BD");
        } else {
            let data = await respuesta.json();
            localStorage.setItem("pedidosTabla", JSON.stringify(data));
            renderPedidosTable(data);
        }
    } catch (error) {
        console.log(error);
    }
};

// renderizar tabla
let renderPedidosTable = (data) => {
    tablePedidos.innerHTML = "";
    data.forEach((pedido, i) => {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${i + 1}</td>
            <td>${pedido.cliente_nombre}</td>
            <td><span class="badge badge-${getBadgeColor(pedido.metodo_pago)}">${pedido.metodo_pago}</span></td>
            <td>$${pedido.descuento.toLocaleString()}</td>
            <td>$${pedido.aumento.toLocaleString()}</td>
            <td>${new Date(pedido.fecha).toLocaleString()}</td>
            <td><span class="badge badge-${getEstadoColor(pedido.estado)}">${pedido.estado}</span></td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editPedido(${i})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deletePedido(${i})">
                    <i class="fas fa-trash"></i>
                </button>
                <button class="btn btn-sm btn-info" onclick="verPedido(${i})">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        tablePedidos.appendChild(row);
    });
};

// editar pedido
let editPedido = (pos) => {
    let pedidos = JSON.parse(localStorage.getItem("pedidosTabla")) || [];
    let pedido = pedidos[pos];
    localStorage.setItem("pedidoEdit", JSON.stringify(pedido));
    localStorage.removeItem("pedidosTabla");
    location.href = "crear-pedido.html";
};