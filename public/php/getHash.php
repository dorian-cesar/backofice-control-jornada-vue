<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

$user = "dorian";
$pasw = "123";

$mysqli = new mysqli('ls-3c0c538286def4da7f8273aa5531e0b6eee0990c.cylsiewx0zgx.us-east-1.rds.amazonaws.com', 'dbmasteruser', 'eF5D;6VzP$^7qDryBzDd,`+w(5e4*qI+', 'masgps');
if ($mysqli->connect_errno > 0) {
    die("Error en la conexión" . $mysqli->connect_error);
}

$consulta = "SELECT hash FROM masgps.hash WHERE user='$user' AND pasw='$pasw'";

$resultado = mysqli_query($mysqli, $consulta);

// Check if the query executed successfully
if ($resultado) {
    // Fetch the result
    $data = mysqli_fetch_assoc($resultado);
    
    // Check if any data was fetched
    if ($data) {
        // Output the data as JSON
        echo json_encode($data);
    } else {
        echo json_encode(array("error" => "No data found"));
    }
} else {
    echo json_encode(array("error" => "Query failed: " . mysqli_error($mysqli)));
}

// Close the connection
$mysqli->close();
?>
