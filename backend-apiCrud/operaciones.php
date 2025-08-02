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