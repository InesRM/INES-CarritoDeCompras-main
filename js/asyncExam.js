document.addEventListener("DOMContentLoaded", () => {
  // Elementos del HTML
  const elements = {
    mensajes: document.getElementById("mensajes"),
    createButton: document.getElementById("create"),
    resultsTableBody: document.querySelector("#results tbody"),
    selectedFilmTextarea: document.getElementById("selected-productos"),
    deleteButton: document.getElementById("delete"),
    randomButton: document.getElementById("random"),
    searchButton: document.getElementById("button-addon2"),
    sendButton: document.getElementById("send"),
    resultadoElement: document.querySelector("#resultado"),
    btnFavoritos: document.getElementById("btnFavoritos"),
    modalTitle: document.querySelector(".modal-title"),
    modalBody: document.querySelector(".modal-body"),
    modalFooter: document.querySelector(".modal-footer"),
    selectCategorias: document.querySelector("#categorias"),
    tablaCarrito: document.querySelector("#lista-carrito tbody"),
    botonVaciarCarrito: document.getElementById("vaciar-carrito"),
    btnAgregaraCarrito: document.getElementById("btnAgregaraCarrito"),
  };

  function clearForm() {
    document.getElementById("validationDefault01").value = "";
    document.getElementById("validationDefault02").value = "";
    document.getElementById("validationDefault03").value = "";
    document.getElementById("validationDefault04").value = "";
    document.getElementById("validationDefault05").value = "";
    document.getElementById("validationDefault06").value = "";
  }

  function cerrarModal() {
    const modal = document.getElementById("modal");
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
  }

  function showAlert(message, type = "success") {
    const alert = document.createElement("div");
    alert.className = `alert alert-${type} mt-3`;
    alert.textContent = message;
    elements.mensajes.appendChild(alert);
    setTimeout(() => alert.remove(), 4000);
  }

  function validateForm() {
    const nombre = document.getElementById("validationDefault01").value;
    const descripcion = document.getElementById("validationDefault02").value;
    const categoria = document.getElementById("validationDefault03").value
    
    const precio = parseFloat(
      document.getElementById("validationDefault04").value
    );
    const valoracion = document.getElementById("validationDefault05").value
  
    const imagen = document.getElementById("validationDefault06").value;

    if (
      !nombre ||
      !descripcion ||
      !categoria ||
      !precio ||
      !valoracion ||
      !imagen
    ) {
      showAlert("Por favor, rellena todos los campos.", "danger");
      return false;
    }

    if (isNaN(precio) || isNaN(categoria) || isNaN(valoracion)) {
      showAlert(
        "El precio, la categoría y la valoración deben ser números.",
        "danger"
      );
      return false;
    }

    if (
      imagen.split(".").pop() !== "jpg" &&
      imagen.split(".").pop() !== "png" &&
      imagen.split(".").pop() !== "jpeg"
    ) {
      showAlert("La imagen debe ser un archivo .jpg o .png, jpeg", "danger");
      return false;
    }
    return true;
  }

  function addRowToTable(
    nombre,
    descripcion,
    categoria,
    precio,
    valoracion,
    imagen
  ) {
    const newRow = document.createElement("tr");
    const newNombre = document.createElement("td");
    const newDescripcion = document.createElement("td");
    const newCategoria = document.createElement("td");
    const newPrecio = document.createElement("td");
    const newValoracion = document.createElement("td");
    const newImage = document.createElement("td");
    const imageElement = document.createElement("img");

    newNombre.textContent = nombre;
    newDescripcion.textContent = descripcion;
    newCategoria.textContent = categoria;
    newPrecio.textContent = precio;
    newValoracion.textContent = valoracion;
    imageElement.src = "../img/" + imagen;
    imageElement.alt = nombre;
    imageElement.style.width = "100px"; // Ajustar el tamaño según sea necesario
    newImage.appendChild(imageElement);

    newRow.append(
      newNombre,
      newDescripcion,
      newCategoria,
      newPrecio,
      newValoracion,
      newImage
    );
    elements.resultsTableBody.appendChild(newRow);
  }

  if (elements.searchButton) {
    const searchInput = document.getElementById("search");

    elements.searchButton.addEventListener("click", async () => {
      const searchValue = searchInput.value;

      if (!searchValue) {
        alert("Introduce el nombre del curso a buscar");
        return;
      }

      try {
        const response = await fetch(
          `../php/getCursos.php?nombre=${searchValue}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("Response data:", data); // Log de la respuesta completa

        const cursos = Array.isArray(data) ? data : [data];
        console.log("Cursos:", cursos); // Log de la propiedad curso

        elements.selectedFilmTextarea.innerHTML = "";
        elements.resultsTableBody.innerHTML = "";

        if (cursos.length === 0) {
          elements.selectedFilmTextarea.textContent =
            "No se encontraron cursos.";
        } else {
          document.getElementById("categorias").style.display = "none";
          document.getElementById("selectCat").style.display = "none";

          const tabla = document.getElementById("results");
          tabla.style.display = "block";
          elements.selectedFilmTextarea.textContent = JSON.stringify(
            cursos.length > 1 ? cursos : cursos[0],
            null,
            4
          );

          cursos.forEach((curso) => {
            addRowToTable(
              curso.nombre,
              curso.descripcion,
              curso.categoria,
              curso.precio,
              curso.valoracion,
              curso.imagen
            );
          });
        }
      } catch (error) {
        console.error("Error fetching the data:", error); // Log del error
        showAlert("Error al cargar los datos del curso.");
      }
    });
  }
  //Promesa para cargar las categorías
  async function cargarCategorias() {
    elements.selectCategorias.textContent = ""; // Limpiar opciones previas
    elements.selectCategorias.insertAdjacentHTML(
      "beforeend",
      "<option value=''>Selecciona una categoría</option>"
    );
    try {
      const response = await fetch("../php/getCategories.php");
      const categories = await response.json();
      console.log("Categorías:", categories); // Log de las categorías
      categories.forEach((category) => {
        const optionHTML = `<option value="${category.nombre}">${category.nombre}</option>`;
        elements.selectCategorias.insertAdjacentHTML("beforeend", optionHTML);
      });
    } catch (error) {
      console.error("Error al cargar las clasificaciones de géneros", error);
    }
  }

  //Cargar los hijos de la categoría seleccionada

  if (elements.selectCategorias) {
    cargarCategorias();
    elements.selectCategorias.addEventListener("change", async () => {
      const category = elements.selectCategorias.value;

      if (category) {
        try {
          const response = await fetch(
            `../php/getCursoByCat.php?cat=${category}`
          );
          const cursos = await response.json();
          elements.resultadoElement.innerHTML = "";
          cursos.forEach((curso) => {
            const card = document.createElement("div");
            card.classList.add("col-md-4", "mb-3");
            card.className = "card";
            card.innerHTML = `
                <img src="../img/${curso.imagen}" class="card-img-top" alt="${curso.nombre}">
                <div class="card-body">
                  <h5 class="card-title">${curso.nombre}</h5>
                  <p class="card-text">${curso.descripcion}</p>
                  <p class="card-text">${curso.categoria}</p>
                   <p class="card-text">${curso.precio}</p>
                  <p class="card-text">Valoracion: ${curso.valoracion} €</p>
                  <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal" data-curso-name="${curso.nombre}">Ver detalles</button>
                </div>
              `;
            elements.resultadoElement.appendChild(card);
          });
        } catch (error) {
          console.error("Error al cargar los cursos de la categoría", error);
        }
      }
    });
  }

  //Mostrar los detalles de la película en el modal
  //Mostrar los detalles del curso en el modal
  elements.resultadoElement.addEventListener("click", async (event) => {
    if (event.target.classList.contains("btn-primary")) {
      const name = event.target.getAttribute("data-curso-name");
      console.log("Nombre del curso:", name); // Log del nombre del curso (película)
      try {
        const response = await fetch(`../php/getCursos.php?nombre=${name}`);
        const cursoArray = await response.json();
        console.log("Curso Array:", cursoArray); // Log del array de curso

        if (cursoArray.length > 0) {
          const curso = cursoArray[0]; //el servidor devuelve un array con un solo elemento hay que extraerlo
          console.log("Curso:", curso); // Log del curso

          // Verificación adicional del contenido del curso
          if (
            curso &&
            curso.nombre &&
            curso.imagen &&
            curso.descripcion &&
            curso.precio &&
            curso.valoracion &&
            curso.categoria
          ) {
            elements.modalTitle.textContent = curso.nombre;
            elements.modalBody.innerHTML = `
            <img src="../img/${curso.imagen}" class="card-img-top" alt="${curso.nombre}">
            <h5 class="card-title">${curso.nombre}</h5>
            <p class="card-text">${curso.precio}€</p>
          `;

            elements.btnFavoritos.dataset.cursoNombre = curso.nombre;
            elements.btnFavoritos.dataset.cursoDescripcion = curso.descripcion;
            elements.btnFavoritos.dataset.cursoCategoria = curso.categoria;
            elements.btnFavoritos.dataset.cursoPrecio = curso.precio;
            elements.btnFavoritos.dataset.cursoValoracion = curso.valoracion;
            elements.btnFavoritos.dataset.cursoImagen = curso.imagen;
          } else {
            console.error("Datos del curso incompletos", curso);
          }
        } else {
          console.error("No se encontraron cursos con el nombre proporcionado");
        }
      } catch (error) {
        console.error("Error al obtener el producto", error);
      }
    }
  });

  //Añadir a favoritos
  elements.modalFooter.addEventListener("click", (event) => {
    if (event.target.id === "btnFavoritos") {
      const {
        cursoNombre: nombre,
        cursoDescripcion: descripcion,
        cursoCategoria: categoria,
        cursoPrecio: precio,
        cursoValoracion: valoracion,
        cursoImagen: imagen,
      } = event.target.dataset;

      let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
      if (!favoritos.some((curso) => curso.nombre === nombre)) {
        favoritos.push({
          nombre,
          descripcion,
          categoria,
          precio,
          valoracion,
          imagen,
        });
        localStorage.setItem("favoritos", JSON.stringify(favoritos));
        alert("Agregado a favoritos correctamente");
        showAlert("Producto agregado a favoritos correctamente bis");
        cerrarModal();
      } else {
        alert("Producto ya se encuentra en favoritos", "warning");
      }
    }
  });

  //crear una nuevo curso
  elements.createButton.addEventListener("click", () => {
    if (validateForm()) {
      const nombre = document.getElementById("validationDefault01").value;
      const descripcion = document.getElementById("validationDefault02").value;
      const categoria = document.getElementById("validationDefault03").value;
      const precio = document.getElementById("validationDefault04").value;
      const valoracion = document.getElementById("validationDefault05").value;
      const imagen = document.getElementById("validationDefault06").value;
      //precio, valoración y categoría son números

    
      addRowToTable(nombre, descripcion, categoria, precio, valoracion, imagen);
      showAlert("curso creada correctamente.");
      clearForm();
    }
  });

  //Elemento seleccionado
  elements.resultsTableBody.addEventListener("click", (event) => {
    const clickedRow = event.target.closest("tr");
    if (!clickedRow) return;

    elements.resultsTableBody
      .querySelectorAll("tr")
      .forEach((row) => row.classList.remove("selected"));
    clickedRow.classList.add("selected");

    const productData = {
      nombre: clickedRow.cells[0].textContent,
      descripcion: clickedRow.cells[1].textContent,
      categoria: clickedRow.cells[2].textContent,
      precio: clickedRow.cells[3].textContent,
      valoracion: clickedRow.cells[4].textContent,
      images: clickedRow.cells[5].querySelector("img").src,
    };
    elements.selectedFilmTextarea.value = JSON.stringify(productData, null, 4);
  });

  //Elementos random
  elements.randomButton.addEventListener("click", async () => {
    try {
      clearForm();
      const response = await fetch("../php/getRandom.php");
      const curso = await response.json();
      document.getElementById("validationDefault01").value = curso.nombre;
      document.getElementById("validationDefault02").value = curso.descripcion;
      document.getElementById("validationDefault03").value = curso.categoria;
      document.getElementById("validationDefault04").value = curso.precio;
      document.getElementById("validationDefault05").value = curso.valoracion;
      document.getElementById("validationDefault06").value = curso.imagen;
    } catch (error) {
      console.error("Error al obtener la curso aleatoria", error);
    }
  });

  elements.sendButton.addEventListener("click", async () => {
    const selectedRow = elements.resultsTableBody.querySelector("tr.selected");
    const fullImagePath = selectedRow.cells[5].querySelector("img").src;
    const imageName = fullImagePath.split("/").pop(); // Extrae solo el nombre de la imagen
    if (selectedRow) {
      const productData = {
        nombre: selectedRow.cells[0].textContent,
        descripcion: selectedRow.cells[1].textContent,
        categoria:parseInt( selectedRow.cells[2].textContent, 10),
        precio: parseFloat(selectedRow.cells[3].textContent),
        valoracion: parseInt(selectedRow.cells[4].textContent),
        imagen: imageName,
      };

      try {
        const response = await fetch("../php/saveCurso.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        });
        const data = await response.json();
        showAlert("Producto enviado correctamente.", "success");
      } catch {
        showAlert("Error al enviar el producto vs catch.", "danger");
      }
    } else {
      showAlert("Por favor, selecciona un producto.", "danger");
    }
  });

  const formulario = document.getElementById("addProductos");
  const formularioProducto = document.getElementById("formularioProducto");
  const boton = document.getElementById("añadirProducto");

  boton.addEventListener("click", () => {
    document.getElementById("categorias").style.display = "none";
    document.getElementById("selectCat").style.display = "none";
    formulario.style.display = "block";
    formularioProducto.style.display = "block";
  });

  elements.deleteButton.addEventListener("click", () => {
    const selectedRow = elements.resultsTableBody.querySelector("tr.selected");
    if (selectedRow) {
      selectedRow.remove();
      showAlert("Producto eliminado correctamente.");
    } else {
      showAlert("Por favor, selecciona un producto.", "danger");
    }
  });

  //Añadir al carrito

  elements.btnAgregaraCarrito.addEventListener("click", (event) => {
    //los añadimos desde el modal, no desde la tabla
    const nombre = elements.modalTitle.textContent;
    console.log("Nombre del curso:", nombre);
    const precio = elements.modalBody.querySelector("p").textContent;
    const imagen = elements.modalBody.querySelector("img").src;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${nombre}</td>
      <td>${precio}</td>
      <td><img src="${imagen}" width="50"></td>
      <td>
        <button class="btn btn-danger btn-remove">X</button>
      </td>
      <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#modal" data-curso-name="${nombre}">Pagar</button>
    `;
    elements.tablaCarrito.appendChild(row);
    alert("Producto añadido al carrito correctamente.");
    cerrarModal();
  });

  elements.tablaCarrito.addEventListener("click", (event) => {
    if (event.target.classList.contains("btn-remove")) {
      event.target.closest("tr").remove();
      showAlert("Producto eliminado del carrito correctamente.");
    }
  });

  //Vaciar carrito
  elements.botonVaciarCarrito.addEventListener("click", () => {
    elements.tablaCarrito.innerHTML = "";
  });

  
});
