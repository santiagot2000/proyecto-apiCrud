<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");
$method = $_SERVER['REQUEST_METHOD'];
if($method == "OPTIONS") {
    die();
}

require("operaciones.php");
$ruta = $_GET['url'] ?? '';
if ($ruta === 'login') {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        $usuario = $data['usuario'];
        $contrasena = $data['contrasena'];
        $userData = login($usuario, $contrasena);
        if ($userData) {
            http_response_code(200);
            echo json_encode($userData);
        } else {
            http_response_code(401);
            echo json_encode(array("message" => "Credenciales incorrectas"));
        }
    } else {
        http_response_code(405);
        echo json_encode(array("message" => "Método no permitido"));
    }
} else if ($ruta === 'productos') {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $stmt = $db->query("SELECT * FROM productos");
        $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($productos);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        $nombre = $data['nombre'];
        $descripcion = $data['descripcion'];
        $precio = $data['precio'];
        $stock = $data['stock'];
        $imagen = $data['imagen'];
        getProducts($nombre, $descripcion, $precio, $stock, $imagen);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $data['id'];
        $nombre = $data['nombre'];
        $descripcion = $data['descripcion'];
        $precio = $data['precio'];
        $stock = $data['stock'];
        $imagen = $data['imagen'];
        updateProducts($id, $nombre, $descripcion, $precio, $stock, $imagen);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $data['id'];
        deleteProduct($id);
    } else {
        http_response_code(405);
        echo json_encode(array("message" => "Método no permitido"));
    }
} else if ($ruta === 'clientes') {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $clientes = getClientes();
        echo json_encode($clientes);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        createCliente(
            $data['nombre'],
            $data['apellido'],
            $data['email'],
            $data['celular'],
            $data['direccion'],
            $data['direccion2'],
            $data['descripcion']
        );
    } elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        $data = json_decode(file_get_contents("php://input"), true);
        updateCliente(
            $data['id'],
            $data['nombre'],
            $data['apellido'],
            $data['email'],
            $data['celular'],
            $data['direccion'],
            $data['direccion2'],
            $data['descripcion']
        );
    } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $data = json_decode(file_get_contents("php://input"), true);
        deleteCliente($data['id']);
    } else {
        http_response_code(405);
        echo json_encode(array("message" => "Método no permitido"));
    }
}elseif ($ruta === 'pedidos') {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $pedidos = getPedidos();
        echo json_encode($pedidos);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        createPedido(
            $data['id_cliente'],
            $data['descuento'],
            $data['metodo_pago'],
            $data['aumento'],
            $data['productos']
        );
    } elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        $data = json_decode(file_get_contents("php://input"), true);
        updatePedido(
            $data['id'],
            $data['id_cliente'],
            $data['descuento'],
            $data['metodo_pago'],
            $data['aumento']
        );
    } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $data = json_decode(file_get_contents("php://input"), true);
        deletePedido($data['id']);
    } else {
        http_response_code(405);
        echo json_encode(array("message" => "Método no permitido"));
    }
} else if ($ruta === 'usuarios') {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $usuarios = getUsuarios();
        echo json_encode($usuarios);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        createUser($data['rol'], $data['usuario'], $data['contrasena']);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        $data = json_decode(file_get_contents("php://input"), true);
        updateUser(
            $data['id'],
            $data['rol'],
            $data['usuario'],
            $data['contrasena'] ?? null
        );
    } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $data = json_decode(file_get_contents("php://input"), true);
        deleteUser($data['id']);
    } else {
        http_response_code(405);
        echo json_encode(array("message" => "Método no permitido"));
    }
}else if ($ruta === 'detalle-pedido') {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $id_pedido = $_GET['id_pedido'] ?? null;
        if ($id_pedido !== null) {
            $detalles = getDetallePedidoPorId($id_pedido); // ✅ Función correcta
            echo json_encode($detalles);
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Falta el parámetro id_pedido"));
        }
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        createDetallePedido(
            $data['id_pedido'],
            $data['id_producto'],
            $data['precio'],
            $data['cantidad']
        );
    } elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        $data = json_decode(file_get_contents("php://input"), true);
        updateDetallePedido(
    $data['id'],
    $data['id_pedido'],
    $data['id_producto'],
    $data['cantidad'],
    $data['precio']
    );
    } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $data = json_decode(file_get_contents("php://input"), true);
        deleteDetallePedido($data['id']);
    } else {
        http_response_code(405);
        echo json_encode(array("message" => "Método no permitido"));
    }
}

?> 