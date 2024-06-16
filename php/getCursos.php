<?php 
header('Content-Type: application/json');

$jsonFile = '../data/cursos.json';

// Get the content of the file

$jsonData = file_get_contents($jsonFile);

// Decode the JSON into an associative array

$data = json_decode($jsonData, true);

// Buscar si el parámetro nombre está presente en la URL

if (isset($_GET['nombre'])) {
    $nombre = $_GET['nombre'];

    // Filtrar los cursos por el nombre especificado filtrar mayúsculas y minúsculas por igual

    $resultados = array_filter($data['curso'], function($curso) use ($nombre) {
        return stripos($curso['nombre'], $nombre) !== false;
    });

    // Devolver los resultados

    if (empty($resultados)) {
        http_response_code(404);
        echo json_encode(['error' => 'Curso no encontrado'], JSON_PRETTY_PRINT);
    } else {
        echo json_encode(array_values($resultados), JSON_PRETTY_PRINT); // Reindexar el array
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Nombre no especificado'], JSON_PRETTY_PRINT);
} 