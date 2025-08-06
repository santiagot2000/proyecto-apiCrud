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

let getUser = () => {
    let user = JSON.parse(localStorage.getItem("userLogin"));
    if (user && nameUser) nameUser.textContent = user.nombre;
};

btnLogout.addEventListener("click", () => {
    localStorage.removeItem("userLogin");
    location.href = "login.html";
});

btnCreate.addEventListener('click', () => {
    let data = getDataPedido();
    if (data) sendDataPedido(data);
});

d.addEventListener("DOMContentLoaded", () => {
    getUser();
    cargarClientes();
    const url = new URLSearchParams(window.location.search);
    const id = url.get("id");
    if (id) {
        pedidoUpdate = JSON.parse(localStorage.getItem("pedidoEdit"));
        if (pedidoUpdate && pedidoUpdate.id == id) {
            updateDataPedido();
        }
    }
});

function cargarClientes() {
    fetch("http://localhost:3000/clientes")  // Ajusta URL si es diferente
        .then(response => response.json())
        .then(data => {
            const clienteSelect = document.getElementById("cliente-select");
            data.forEach(cliente => {
                const option = document.createElement("option");
                option.value = cliente.id;
                option.textContent = `${cliente.nombre} ${cliente.apellido}`;
                clienteSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Error cargando clientes:", error);
        });
}

let getDataPedido = () => {
    if (
        clienteSelect.value &&
        metodoPago.value &&
        productos.length > 0
    ) {
        return {
            cliente_id: clienteSelect.value,
            fecha: new Date().toISOString().split('T')[0],
            total: total,
            estado: "Pendiente",
            productos: productos
        };
    } else {
        alert("Todos los campos obligatorios deben estar completos.");
        return null;
    }
};

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
        let mensaje = await respuesta.json();
        if (respuesta.status === 406) {
            alert("Los datos enviados no son admitidos");
        } else {
            alert(mensaje.message);
            location.href = "listado-pedidos.html";
        }
    } catch (error) {
        console.log(error);
    }
};

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
        let mensaje = await respuesta.json();
        if (respuesta.status === 406) {
            alert("Los datos enviados no son admitidos");
        } else {
            alert(mensaje.message);
            location.href = "listado-pedidos.html";
        }
    } catch (error) {
        console.log(error);
    }
};

// Agregar producto
btnAgregarProducto.addEventListener('click', () => {
    let productoId = productoSelect.value;
    let productoNombre = productoSelect.options[productoSelect.selectedIndex].text;
    let productoPrecio = productoSelect.options[productoSelect.selectedIndex].dataset.precio;
    let productoCantidad = cantidad.value;

    if (!productoId || !productoCantidad || productoCantidad <= 0) {
        alert("Selecciona un producto válido y una cantidad mayor a 0.");
        return;
    }

    let producto = {
        id: productoId,
        nombre: productoNombre,
        precio: parseFloat(productoPrecio),
        cantidad: parseInt(productoCantidad),
        subtotal: parseFloat(productoPrecio) * parseInt(productoCantidad)
    };

    productos.push(producto);
    total += producto.subtotal;

    renderProductosPedido();
    cantidad.value = '';
});

function eliminarProducto(index) {
    total -= productos[index].subtotal;
    productos.splice(index, 1);
    renderProductosPedido();
}

let renderProductosPedido = () => {
    productosPedido.innerHTML = '';
    productos.forEach((producto, index) => {
        let fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${producto.nombre}</td>
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

    totalPedido.textContent = "$" + total.toLocaleString();
};
