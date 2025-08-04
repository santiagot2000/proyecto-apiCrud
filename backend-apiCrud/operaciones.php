<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");
$method = $_SERVER['REQUEST_METHOD'];
if($method == "OPTIONS") {
    die();
}

 include("conexion.php");

 // Conexión a la base de datos
try {
    $db = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Error de conexión a la base de datos: " . $e->getMessage());
}

// Función para verificar el inicio de sesión
function login($usuario, $contrasena) {
    global $db;
    try{
        $stmt = $db->prepare("SELECT * FROM roles WHERE usuario = :usuario AND contrasena = :contrasena");
        $stmt->bindParam(':usuario', $usuario);
        $stmt->bindParam(':contrasena', $contrasena);
        $stmt->execute();

        if ($stmt->rowCount() > 0 ) {
            //usuario encontrado
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            //echo json_encode($row);
            return $row;
        }

        return false;
    }catch( PDOExeption $e ){
        // Manejar errores de la base de datos
        die("Error al verificar el inicio de sesión: " . $e->getMessage());
    }
}

//funcion para crear productos en la base de datos
function getProducts($nombre, $descripcion, $precio, $stock, $imagen){
    global $db;
    $stmt = $db->prepare("INSERT INTO productos (nombre, descripcion, precio, stock, imagen) VALUES (:nombre, :descripcion, :precio, :stock, :imagen)");
    $stmt->bindParam(':nombre', $nombre);
    $stmt->bindParam(':descripcion', $descripcion);
    $stmt->bindParam(':precio', $precio);
    $stmt->bindParam(':stock', $stock);
    $stmt->bindParam(':imagen', $imagen);
    $stmt->execute();
    echo json_encode(array("message" => "Producto creado con exito"));
}

function updateProducts($id, $nombre, $descripcion, $precio, $stock, $imagen){
    global $db;
    $stmt = $db->prepare("UPDATE productos SET nombre = :nombre, descripcion = :descripcion, precio = :precio, stock = :stock, imagen = :imagen WHERE id = :id");
    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':nombre', $nombre);
    $stmt->bindParam(':descripcion', $descripcion);
    $stmt->bindParam(':precio', $precio);
    $stmt->bindParam(':stock', $stock);
    $stmt->bindParam(':imagen', $imagen);
    $stmt->execute();
    echo json_encode(array("message" => "Producto actualizado con exito"));
}

function deleteProduct($id){
    global $db;
    $stmt = $db->prepare("DELETE FROM productos WHERE id = :id");
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    echo json_encode(array("message" => "Producto eliminado con exito"));
}

// ========== CLIENTES ==========
function getClientes() {
    global $db;
    $stmt = $db->query("SELECT * FROM clientes");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function createCliente($nombre, $apellido, $email, $celular, $direccion, $direccion2, $descripcion) {
    global $db;
    $stmt = $db->prepare("INSERT INTO clientes (nombre, apellido, email, celular, direccion, direccion2, descripcion) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$nombre, $apellido, $email, $celular, $direccion, $direccion2, $descripcion]);
    echo json_encode(["message" => "Cliente creado con éxito"]);
}

function updateCliente($id, $nombre, $apellido, $email, $celular, $direccion, $direccion2, $descripcion) {
    global $db;
    $stmt = $db->prepare("UPDATE clientes SET nombre = ?, apellido = ?, email = ?, celular = ?, direccion = ?, direccion2 = ?, descripcion = ? WHERE id = ?");
    $stmt->execute([$nombre, $apellido, $email, $celular, $direccion, $direccion2, $descripcion, $id]);
    echo json_encode(["message" => "Cliente actualizado con éxito"]);
}

function deleteCliente($id) {
    global $db;
    $stmt = $db->prepare("DELETE FROM clientes WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(["message" => "Cliente eliminado con éxito"]);
}

// ========== PEDIDOS ==========

function getPedidos() {
    global $db;
    $stmt = $db->query("SELECT * FROM pedidos");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function createPedido($cliente_id, $fecha, $total, $estado) {
    global $db;
    $stmt = $db->prepare("INSERT INTO pedidos (cliente_id, fecha, total, estado) VALUES (?, ?, ?, ?)");
    $stmt->execute([$cliente_id, $fecha, $total, $estado]);
    echo json_encode(["message" => "Pedido creado con éxito"]);
}

function updatePedido($id, $cliente_id, $fecha, $total, $estado) {
    global $db;
    $stmt = $db->prepare("UPDATE pedidos SET cliente_id = ?, fecha = ?, total = ?, estado = ? WHERE id = ?");
    $stmt->execute([$cliente_id, $fecha, $total, $estado, $id]);
    echo json_encode(["message" => "Pedido actualizado con éxito"]);
}

function deletePedido($id) {
    global $db;
    $stmt = $db->prepare("DELETE FROM pedidos WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(["message" => "Pedido eliminado con éxito"]);
}