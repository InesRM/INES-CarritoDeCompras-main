<?php 
header('Content-Type: application/json');

try{

    $data = json_decode(file_get_contents('../data/cursos.json'), true);

   if (isset($_GET['categoria'])) {
        $categoria = $_GET['categoria'];
        $categorias = array_filter($data['categorias'], function($cat) use ($categoria){
            return $cat['nombre'] === $categoria;
        });
    } else {
        $categorias = $data['categorias'];
    }
    

    echo json_encode($categorias, JSON_PRETTY_PRINT);


}catch(Exception $e){
    echo json_encode(array(
        'error' => $e->getMessage()
    ));
}