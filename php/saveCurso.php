<?php 
//Guardar los datos en ../data/cursos.json en el apartado de cursos
//Se debe guardar el nombre del curso, la descripción y el profesor


//Guardar productos en un archivo JSON

//Si no existe el archivo, lo crea

if (!file_exists('../data/cursos.json')) {
    $file = fopen('../data/cursos.json', 'w');
    fclose($file);
}

//Obtener los productos actuales
$cursos = file_get_contents('../data/cursos.json');
$cursos = json_decode($cursos, true);

//Obtener los datos del producto
$curso = json_decode(file_get_contents('php://input'), true);

//Agregar el producto al array si no existía previamente
if (!in_array($curso, $cursos)){
    $cursos[] = $curso;
}
else{
    echo "El curso ya existe";
}


//Guardar el array en el archivo
file_put_contents('../data/cursos.json', json_encode($cursos, JSON_PRETTY_PRINT));

echo json_encode($cursos, JSON_PRETTY_PRINT);

//Guardar un archivo de texto con el nombre del producto añadido también

$nombre = $curso['nombre'];
$archivo = fopen('../data/cursos.txt', 'a');
//Escribir el nombre, el director y la clasificación de la película
fwrite($archivo, $nombre . " ". "Descripcion: " ." ". $curso['descripcion'] ." ". "precio: " . $curso['precio'] . "\n");

fclose($archivo);