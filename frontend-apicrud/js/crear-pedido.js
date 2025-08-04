// variables globales del formulario
const d = document;
let clienteSelect = d.querySelector('#cliente-select');
let metodoPago = d.querySelector('#metodo-pago');
let descuento = d.querySelector('#descuento');
let aumento = d.querySelector('#aumento');
let productoSelect = d.querySelector('#producto-select');
let cantidad = d.querySelector('#cantidad');
let btnAgregarProducto = d.querySelector('#btn-agregar-producto');
let productosPedido = d.querySelector('#productos-pedido');
let totalPedido = d.querySelector('#total-pedido');
let btnCreate = d.querySelector('.btn-create');
let btnUpdate = d.querySelector('.btn-update');
let nameUser = d.querySelector("#nombre-usuario");
let btnLogout = d.querySelector("#btnLogout");

let pedidoUpdate = null;
let productos = [];
let total = 0;

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
    let data = getDataPedido();
    if (data) sendDataPedido(data);
});

// evento al DOMContentLoaded
d.addEventListener("DOMContentLoaded", () => {
    getUser();
    const url = new URLSearchParams(window.location.search);
    const id = url.get("id");
    if (id) {
        pedidoUpdate = JSON.parse(localStorage.getItem("pedidoEdit"));
        if (pedidoUpdate && pedidoUpdate.id == id) {
            updateDataPedido();
        }
    }
});

// obtener datos del formulario
let getDataPedido = () => {
    if (
        clienteSelect.value &&
        metodoPago.value &&
        productos.length > 0
    ) {
        let pedido = {
            cliente_id: clienteSelect.value,
            fecha: new Date().toISOString().split('T')[0],
            total: total,
            estado: "Pendiente",
            productos: productos
        };

        return pedido;
    } else {
        alert("Todos los campos obligatorios deben estar completos.");
    }
};

// enviar datos al servidor
let sendDataPedido = async (data) => {
    let url = "http://localhost/proyecto-apiCrud/backend-apiCrud/pedidos";
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
            location.href = "listado-pedidos.html";
        }
    } catch (error) {
        console.log(error);
    }
};

// cargar datos para editar
let updateDataPedido = () => {
    clienteSelect.value = pedidoUpdate.cliente_id;
    metodoPago.value = pedidoUpdate.metodo_pago;
    descuento.value = pedidoUpdate.descuento;
    aumento.value = pedidoUpdate.aumento;

    btnCreate.classList.add("d-none");
    btnUpdate.classList.remove("d-none");

    btnUpdate.addEventListener("click", () => {
        let pedido = {
            id: pedidoUpdate.id,
            cliente_id: clienteSelect.value,
            fecha: new Date().toISOString().split('T')[0],
            total: total,
            estado: "Pendiente",
            productos: productos
        };

        localStorage.removeItem("pedidoEdit");
        sendUpdatePedido(pedido);
    });
};

// enviar actualización
let sendUpdatePedido = async (pedido) => {
    let url = "http://localhost/proyecto-apiCrud/backend-apiCrud/pedidos";
    try {
        let respuesta = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(pedido)
        });
        if (respuesta.status === 406) {
            alert("Los datos enviados no son admitidos");
        } else {
            let mensaje = await respuesta.json();
            alert(mensaje.message);
            location.href = "listado-pedidos.html";
        }
    } catch (error) {
        console.log(error);
    }
};

// agregar producto al pedido
btnAgregarProducto.addEventListener('click', () => {
    let productoId = productoSelect.value;
    let productoPrecio = productoSelect.options[productoSelect.selectedIndex].dataset.precio;
    let productoCantidad = cantidad.value;

    let producto = {
        id: productoId,
        precio: parseFloat(productoPrecio),
        cantidad: parseInt(productoCantidad),
        subtotal: parseFloat(productoPrecio) * parseInt(productoCantidad)
    };

    productos.push(producto);
    total += producto.subtotal;

    renderProductosPedido();
});

// renderizar productos del pedido
let renderProductosPedido = () => {
    productosPedido.innerHTML = '';
    productos.forEach((producto, index) => {
        let fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${productoSelect.options[productoSelect.selectedIndex].text}</td>
            <td>$${producto.precio.toLocaleString()}</td>
            <td>${producto.cantidad}</td>
            <td>$${producto.subtotal.toLocaleString()}</td>
            <td>
                <button type="button" class="btn btn-danger btn-sm" onclick="eliminarProducto(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        productosPedido.appendChild(fila);
    });

    totalPedido.textContent = total.toLocaleString();
};
