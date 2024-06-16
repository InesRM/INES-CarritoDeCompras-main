<?php
if (!file_exists('../data/cursos.json')) {
    $file = fopen('../data/cursos.json', 'w');
    fclose($file);
}

// Obtener los productos actuales
$cursos = file_get_contents('../data/cursos.json');
$cursos = json_decode($cursos, true);

// Asegurarse de que las claves existen en el array
if (!isset($cursos['curso'])) {
    $cursos['curso'] = [];
}

// Obtener los datos del producto
$curso = json_decode(file_get_contents('php://input'), true);

// Verificar si el curso ya existe basado en el nombre del curso (puedes ajustar esto según tus necesidades)
$cursoExistente = false;
foreach ($cursos['curso'] as $existingCurso) {
    if ($existingCurso['nombre'] === $curso['nombre']) {
        $cursoExistente = true;
        break;
    }
}

if (!$cursoExistente) {
    // Agregar el producto al array de cursos
    $cursos['curso'][] = $curso;

    // Guardar el array en el archivo
    file_put_contents('../data/cursos.json', json_encode($cursos, JSON_PRETTY_PRINT));

    echo json_encode($cursos, JSON_PRETTY_PRINT);

    // Guardar un archivo de texto con el nombre del producto añadido también
    $nombre = $curso['nombre'];
    $archivo = fopen('../data/cursos.txt', 'a');
    fwrite($archivo, $nombre . " " . "Descripcion: " . " " . $curso['descripcion'] . " " . "precio: " . $curso['precio'] . "\n");
    fclose($archivo);
} else {
    echo json_encode(["message" => "El curso ya existe"]);
}
?>
