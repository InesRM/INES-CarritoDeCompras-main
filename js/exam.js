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
  };

  function clearForm() {
    document.getElementById("validationDefault01").value = "";
    document.getElementById("validationDefault02").value = "";
    document.getElementById("validationDefault03").value = "";
    document.getElementById("validationDefault04").value = "";
    document.getElementById("validationDefault05").value = "";
    document.getElementById("validationDefault06").value = "";
  }

  function showAlert(message, type = "success") {
    const alert = document.createElement("div");
    alert.className = `alert alert-${type} mt-3`;
    alert.textContent = message;
    elements.mensajes.appendChild(alert);
    setTimeout(() => alert.remove(), 4000);
  }

  function validateForm() {
    const id = document.getElementById("validationDefault01").value;
    const nombre = document.getElementById("validationDefault02").value;
    const director = document.getElementById("validationDefault03").value;
    const clasificacion = document.getElementById("validationDefault04").value;
    const valoracion = document.getElementById("validationDefault05").value;
    const cartel = document.getElementById("validationDefault06").value;

    if (
      !id ||
      !nombre ||
      !director ||
      !clasificacion ||
      !valoracion ||
      !cartel
    ) {
      showAlert("Por favor, rellena todos los campos.", "danger");
      return false;
    }
    if (isNaN(clasificacion) || isNaN(valoracion)) {
      showAlert(
        "La clasificacion y la valoracion debe ser un número.",
        "danger"
      );
      return false;
    }
    if (cartel.split(".").pop() !== "jpg" && cartel.split(".").pop() !== "png" && cartel.split(".").pop() !== "jpeg"){
      showAlert("La imagen debe ser un archivo .jpg o .png, jpeg", "danger");
      return false;
    }
    return true;
  }

  function addRowToTable(
    id,
    nombre,
    director,
    clasificacion,
    valoracion,
    cartel
  ) {
    const newRow = document.createElement("tr");
    const newId = document.createElement("td");
    const newNombre = document.createElement("td");
    const newDirector = document.createElement("td");
    const newClasificacion = document.createElement("td");
    const newValoracion = document.createElement("td");
    const newImage = document.createElement("td");
    const imageElement = document.createElement("img");

    newId.textContent = id;
    newNombre.textContent = nombre;
    newDirector.textContent = director;
    newClasificacion.textContent = clasificacion;
    newValoracion.textContent = valoracion;
    imageElement.src = "../html/assets/img/" + cartel;
    imageElement.alt = nombre;
    imageElement.style.width = "100px"; // Ajustar el tamaño según sea necesario
    newImage.appendChild(imageElement);

    newRow.append(
      newId,
      newNombre,
      newDirector,
      newClasificacion,
      newValoracion,
      newImage
    );
    elements.resultsTableBody.appendChild(newRow);
  }

  if (elements.searchButton) {
    const searchInput = document.getElementById("search");

    elements.searchButton.addEventListener("click", () => {

      const searchValue = searchInput.value;

      if (!searchValue) {
        alert("Introduce el nombre de la película a buscar");
        return;
      }

      fetch(`../php/getPeliculas.php?nombre=${searchValue}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Response data:", data); // Log de la respuesta completa

          const peliculas = Array.isArray(data) ? data : [data];
          console.log("Peliculas:", peliculas); // Log de la propiedad pelicula

          elements.selectedFilmTextarea.innerHTML = "";
          elements.resultsTableBody.innerHTML = "";

          if (peliculas.length === 0) {
            elements.selectedFilmTextarea.textContent =
              "No se encontraron peliculas.";
          } else {
            document.getElementById("categorias").style.display = "none";
            document.getElementById("selectCat").style.display = "none";

            const tabla = document.getElementById("results");
            tabla.style.display = "block";
            elements.selectedFilmTextarea.textContent = JSON.stringify(
              peliculas,
              null,
              4
            );

            peliculas.forEach((pelicula) => {
              addRowToTable(
                pelicula.id,
                pelicula.nombre,
                pelicula.director,
                pelicula.clasificacion,
                pelicula.valoracion,
                pelicula.cartel
              );
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching the data:", error); // Log del error
          showAlert("Error al cargar los datos de la pelicula.");
        });
    });
  }

  function cargarCategorias() {
    elements.selectCategorias.textContent = ""; // Limpiar opciones previas
    elements.selectCategorias.insertAdjacentHTML(
      "beforeend",
      "<option value=''>Selecciona una categoría</option>"
    );
    fetch("../php/getCategories.php")
      .then((response) => response.json())
      .then((categories) => {
        console.log("Categorías:", categories); // Log de las categorías
        categories.forEach((category) => {
          const optionHTML = `<option value="${category.nombre}">${category.nombre}</option>`;
          elements.selectCategorias.insertAdjacentHTML("beforeend", optionHTML);
        });
      })
      .catch((error) =>
        console.error("Error al cargar las clasificaciones de géneros", error)
      );
  }

  if (elements.selectCategorias) {
    cargarCategorias();
    elements.selectCategorias.addEventListener("change", () => {
      const category = elements.selectCategorias.value;

      if (category) {
        fetch(`../php/getFilmByCat.php?cat=${category}`)
          .then((response) => response.json())
          .then((peliculas) => {
            elements.resultadoElement.innerHTML = "";
            peliculas.forEach((pelicula) => {
              const card = document.createElement("div");
              card.classList.add("col-md-4", "mb-3");
              card.className = "card";
              card.innerHTML = `
              <img src="../html/assets/img/${pelicula.cartel}" class="card-img-top" alt="${pelicula.nombre}">
              <div class="card-body">
                <h5 class="card-title">${pelicula.nombre}</h5>
                <p class="card-text">${pelicula.director}</p>
                <p class="card-text">${pelicula.valoracion} €</p>
                <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal" data-pelicula-name="${pelicula.nombre}">Ver detalles</button>
              </div>
            `;
              elements.resultadoElement.appendChild(card);
            });
          })
          .catch((error) =>
            console.error(
              "Error al cargar las películas de la categoría",
              error
            )
          );
      }
    });
  }

  //Mostrar los detalles de la película en el modal
  elements.resultadoElement.addEventListener("click", (event) => {
    if (event.target.classList.contains("btn-primary")) {
      const name = event.target.getAttribute("data-pelicula-name");
      fetch(`../php/getPeliculas.php?nombre=${name}`)
        .then((response) => response.json())
        .then((pelicula) => {
          elements.modalTitle.textContent = pelicula.nombre;
          elements.modalBody.innerHTML = `
          <img src="../html/assets/img/${pelicula.cartel}" class="card-img-top" alt="${pelicula.nombre}">
          <h5 class="card-title">${pelicula.nombre}</h5>
          <p class="card-text">${pelicula.director}</p>
          <p class="card-text">${pelicula.valoracion} €</p>
        `;

          elements.btnFavoritos.dataset.peliculaNombre = pelicula.nombre;
          elements.btnFavoritos.dataset.peliculaDirector = pelicula.director;
          elements.btnFavoritos.dataset.peliculaImagen = pelicula.cartel;
          elements.btnFavoritos.dataset.peliculaValoracion =
            pelicula.valoracion;
        })
        .catch((error) => console.error("Error al obtener el producto", error));
    }

    //Añadir a favoritos
    elements.modalFooter.addEventListener("click", (event) => {
      if (event.target.id === "btnFavoritos") {
        const {
          peliculaNombre: nombre,
          peliculaDirector: director,
          peliculaImagen: cartel,
          peliculaValoracion: valoracion,
        } = event.target.dataset;

        let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
        if (!favoritos.some((pelicula) => pelicula.nombre === nombre)) {
          favoritos.push({ nombre, director, cartel, valoracion });
          localStorage.setItem("favoritos", JSON.stringify(favoritos));
          alert("Agregado a favoritos correctamente");
          showAlert("Producto agregado a favoritos correctamente bis");
        } else {
          alert("Producto ya se encuentra en favoritos", "warning");
        }
      }
    });
  });

  //crear una nueva película

  elements.createButton.addEventListener("click", () => {
    if (validateForm()) {
      const id = document.getElementById("validationDefault01").value;
      const nombre = document.getElementById("validationDefault02").value;
      const director = document.getElementById("validationDefault03").value;
      const clasificacion = document.getElementById("validationDefault04").value;
      const valoracion = document.getElementById("validationDefault05").value;
      const cartel = document.getElementById("validationDefault06").value;

      addRowToTable(id, nombre, director, clasificacion, valoracion, cartel);
      showAlert("Pelicula creada correctamente.");
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
      id: clickedRow.cells[0].textContent,
      nombre: clickedRow.cells[1].textContent,
      director: clickedRow.cells[2].textContent,
      clasificacion: clickedRow.cells[3].textContent,
      valoracion: clickedRow.cells[4].textContent,
      images: clickedRow.cells[5].querySelector("img").src,
    };
    elements.selectedFilmTextarea.value = JSON.stringify(productData, null, 4);
  });

  //Elementos random

elements.randomButton.addEventListener("click", () => {
    fetch("../php/getRandomFilm.php")
      .then((response) => response.json())
      .then((pelicula) => {
        document.getElementById("validationDefault01").value = pelicula.id;
        document.getElementById("validationDefault02").value = pelicula.nombre;
        document.getElementById("validationDefault03").value = pelicula.director;
        document.getElementById("validationDefault04").value = pelicula.clasificacion;
        document.getElementById("validationDefault05").value = pelicula.valoracion;
        document.getElementById("validationDefault06").value = pelicula.cartel;
      })
      .catch((error) =>
        console.error("Error al obtener la pelicula aleatoria", error)
      );
  });
  elements.sendButton.addEventListener("click", () => {
    const selectedRow = elements.resultsTableBody.querySelector("tr.selected");
    if (selectedRow) {
      const productData = {
        id: selectedRow.cells[0].textContent,
        nombre: selectedRow.cells[1].textContent,
        director: selectedRow.cells[2].textContent,
        clasificacion: selectedRow.cells[3].textContent,
        valoracion: selectedRow.cells[4].textContent,
        cartel: selectedRow.cells[5].querySelector("img").src,

        // images: selectedRow.cells[3].querySelector("img").src,//ESTO GUARDA LA RUTA
      };

      fetch("../php/savePelicula.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })
        .then((response) => response.json())
        .then((data) => {
          showAlert("Producto enviado correctamente.", "success");
        })
        .catch(() => {
          showAlert("Error al enviar el producto vs catch.", "danger");
        });
    } else {
      showAlert("Por favor, selecciona un producto.", "danger");
    }
  });

  const formulario= document.getElementById("addProductos");
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

});

