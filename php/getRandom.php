<?php 

try {
    // Leer el archivo JSON
    $cursosData = json_decode(file_get_contents('../data/cursos.json'), true);

    // Obtener la lista de películas (asegurándonos de usar la clave correcta)
    $cursos = $cursosData['curso'];

    // Seleccionar una película aleatoria
    $curso = $cursos[rand(0, count($cursos) - 1)];

    // Devolver la película en formato JSON
    echo json_encode($curso);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>