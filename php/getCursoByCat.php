<?php
header('Content-Type: application/json');

// Leer el archivo JSON
$dataJson = file_get_contents('../data/cursos.json');
$data = json_decode($dataJson, true);

// Verificar si la categoría está especificada
if (isset($_GET['cat'])) {  // Cambiado de 'category' a 'cat'
    $categoryName = $_GET['cat'];  // Cambiado de 'category' a 'cat'

    // Crear un diccionario para mapear nombres de categorías a IDs
    $categoryMap = [];
    foreach ($data['categorias'] as $category) {
        $categoryMap[$category['nombre']] = $category['id'];
    }

    // Encontrar el ID de la categoría solicitada
    $categoryId = isset($categoryMap[$categoryName]) ? $categoryMap[$categoryName] : null;

    if ($categoryId === null) {
        http_response_code(404);
        echo json_encode(['error' => 'Categoría no encontrada'], JSON_PRETTY_PRINT);
        exit;
    }

    // Filtrar las películas por la categoría seleccionada
    $resultados = array_filter($data['curso'], function($curso) use ($categoryId) {
        return $curso['categoria'] === $categoryId;
    });

    // Devolver los resultados
    if (empty($resultados)) {
        http_response_code(404);
        echo json_encode(['error' => 'Cursos no encontrados para esta categoría'], JSON_PRETTY_PRINT);
    } else {
        echo json_encode(array_values($resultados), JSON_PRETTY_PRINT); // Reindexar el array
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Categoría no especificada'], JSON_PRETTY_PRINT);
}
