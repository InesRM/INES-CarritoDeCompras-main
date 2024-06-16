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
      const categoria = parseInt(document.getElementById("validationDefault03").value);
      const precio = parseFloat(document.getElementById("validationDefault04").value);
      const valoracion = parseInt(document.getElementById("validationDefault05").value);
      const imagen = document.getElementById("validationDefault06").value;
  
      if (!nombre || !descripcion || !categoria || !precio || !valoracion || !imagen) {
        showAlert("Por favor, rellena todos los campos.", "danger");
        return false;
      }
  
      if (isNaN(precio) || isNaN(categoria) || isNaN(valoracion)) {
        showAlert("El precio, la categoría y la valoración deben ser números.", "danger");
        return false;
      }
  
      const validImageExtensions = ["jpg", "png", "jpeg"];
      const imageExtension = imagen.split(".").pop();
      if (!validImageExtensions.includes(imageExtension)) {
        showAlert("La imagen debe ser un archivo .jpg o .png, jpeg", "danger");
        return false;
      }
      return true;
    }
  
    function addRowToTable(nombre, descripcion, categoria, precio, valoracion, imagen) {
      const newRow = document.createElement("tr");
      newRow.innerHTML = `
        <td>${nombre}</td>
        <td>${descripcion}</td>
        <td>${categoria}</td>
        <td>${precio}</td>
        <td>${valoracion}</td>
        <td><img src="../img/${imagen}" alt="${nombre}" style="width: 100px;"></td>
      `;
      elements.resultsTableBody.appendChild(newRow);
    }
  
    async function fetchCursos(searchValue) {
      try {
        const response = await fetch(`../php/getCursos.php?nombre=${searchValue}`);
        if (!response.ok) throw new Error("Network response was not ok");
        return await response.json();
      } catch (error) {
        console.error("Error fetching the data:", error);
        showAlert("Error al cargar los datos del curso.");
      }
    }
  
    function populateTableWithCursos(cursos) {
      elements.resultsTableBody.innerHTML = "";
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
  
    function showModal(curso) {
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
  
      const modal = new bootstrap.Modal(document.getElementById("modal"));
      modal.show();
    }
  
    async function handleSearchButtonClick() {
      const searchInput = document.getElementById("search");
      const searchValue = searchInput.value;
  
      if (!searchValue) {
        alert("Introduce el nombre del curso a buscar");
        return;
      }
  
      const cursos = await fetchCursos(searchValue);
      if (cursos) {
        elements.selectedFilmTextarea.innerHTML = "";
        if (cursos.length === 0) {
          elements.selectedFilmTextarea.textContent = "No se encontraron cursos.";
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
          populateTableWithCursos(cursos);
        }
      }
    }
  
    if (elements.searchButton) {
      elements.searchButton.addEventListener("click", handleSearchButtonClick);
    }
  
    elements.resultadoElement.addEventListener("click", async (event) => {
      if (event.target.classList.contains("btn-primary")) {
        const name = event.target.getAttribute("data-curso-name");
        console.log("Nombre del curso:", name);
        const cursoArray = await fetchCursos(name);
        if (cursoArray && cursoArray.length > 0) {
          const curso = cursoArray[0];
          showModal(curso);
        } else {
          console.error("No se encontraron cursos con el nombre proporcionado");
        }
      }
    });
  
    // ... código restante para otras funcionalidades
  });
  