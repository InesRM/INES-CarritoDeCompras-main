document.addEventListener("DOMContentLoaded", () => {
  console.log("Inicio");

  const elements = {
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
  }

  function showAlert(message, type = "success") {
    const alert = document.createElement("div");
    alert.className = `alert alert-${type} mt-3`;
    alert.textContent = message;
    elements.resultadoElement.appendChild(alert);
    setTimeout(() => alert.remove(), 2000);
  }

  function validateForm() {
    const name = document.getElementById("validationDefault01").value;
    const description = document.getElementById("validationDefault02").value;
    const price = document.getElementById("validationDefault03").value;
    const images = document.getElementById("validationDefault04").value;

    if (!name || !description || !price || !images) {
      showAlert("Por favor, rellena todos los campos.", "danger");
      return false;
    }
    if (isNaN(price)) {
      showAlert("El precio debe ser un número.", "danger");
      return false;
    }
    if (images.split(".").pop() !== "jpg") {
      showAlert("La imagen debe ser un archivo .jpg", "danger");
      return false;
    }
    return true;
  }

  function addRowToTable(name, description, price, images) {
    const newRow = document.createElement("tr");
    const newName = document.createElement("td");
    const newDescription = document.createElement("td");
    const newPrice = document.createElement("td");
    const newImage = document.createElement("td");
    const imageElement = document.createElement("img");

    newName.textContent = name;
    newDescription.textContent = description;
    newPrice.textContent = price;
    imageElement.src = images;
    imageElement.alt = name;
    imageElement.style.width = "100px"; // Adjust the size as needed
    newImage.appendChild(imageElement);

    newRow.append(newName, newDescription, newPrice, newImage);
    elements.resultsTableBody.appendChild(newRow);
  }

  elements.createButton.addEventListener("click", () => {
    if (validateForm()) {
      const name = document.getElementById("validationDefault01").value;
      const description = document.getElementById("validationDefault02").value;
      const price = document.getElementById("validationDefault03").value;
      const images = document.getElementById("validationDefault04").value;

      addRowToTable(name, description, price, images);
      showAlert("Producto creado correctamente.");
      clearForm();
    }
  });

  elements.resultsTableBody.addEventListener("click", (event) => {
    const clickedRow = event.target.closest("tr");
    if (!clickedRow) return;

    elements.resultsTableBody.querySelectorAll("tr").forEach((row) => row.classList.remove("selected"));
    clickedRow.classList.add("selected");

    const productData = {
      name: clickedRow.cells[0].textContent,
      description: clickedRow.cells[1].textContent,
      price: clickedRow.cells[2].textContent,
      images: clickedRow.cells[3].querySelector("img").src,
    };

    // Update form fields with selected row data
    document.getElementById("validationDefault01").value = productData.name;
    document.getElementById("validationDefault02").value = productData.description;
    document.getElementById("validationDefault03").value = productData.price;
    document.getElementById("validationDefault04").value = productData.images;

    elements.selectedFilmTextarea.value = JSON.stringify(productData, null, 4);
  });

  elements.randomButton.addEventListener("click", () => {
    fetch("../php/getRandomProduct.php")
      .then((response) => response.json())
      .then((product) => {
        document.getElementById("validationDefault01").value = product.name;
        document.getElementById("validationDefault02").value = product.description;
        document.getElementById("validationDefault03").value = product.price;
        document.getElementById("validationDefault04").value = product.images;
      })
      .catch((error) => console.error("Error al obtener la pelicula aleatoria", error));
  });

  function cargarCategorias() {
    elements.selectCategorias.innerHTML = '<option value="">Selecciona una Categoría</option>';

    fetch("../php/getCategories.php")
      .then((response) => response.json())
      .then((categories) => {
        categories.forEach((category) => {
          const option = document.createElement("option");
          option.textContent = category.title;
          option.value = category.title;
          elements.selectCategorias.appendChild(option);
        });
      })
      .catch((error) => console.error("Error al cargar las categorías", error));
  }

  if (elements.selectCategorias) {
    cargarCategorias();

    elements.selectCategorias.addEventListener("change", () => {
      const category = elements.selectCategorias.value;

      if (category) {
        fetch(`../php/getProductsByCat.php?category=${category}`)
          .then((response) => response.json())
          .then((products) => {
            elements.resultadoElement.innerHTML = "";
            products.forEach((product) => {
              const card = document.createElement("div");
              card.className = "card";
              card.innerHTML = `
                <img src="${product.images}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                  <h5 class="card-title">${product.name}</h5>
                  <p class="card-text">${product.description}</p>
                  <p class="card-text">${product.price} €</p>
                  <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal" data-product-name="${product.name}">Ver detalles</button>
                </div>
              `;
              elements.resultadoElement.appendChild(card);
            });
          })
          .catch((error) => console.error("Error al cargar los productos de la categoría", error));
      }
    });

    elements.resultadoElement.addEventListener("click", (event) => {
      if (event.target.classList.contains("btn-primary")) {
        const name = event.target.getAttribute("data-product-name");
        fetch(`../php/getProductsByName.php?name=${name}`)
          .then((response) => response.json())
          .then((product) => {
            elements.modalTitle.textContent = product.name;
            elements.modalBody.innerHTML = `
              <img src="${product.images}" class="card-img-top" alt="${product.name}">
              <h5 class="card-title">${product.name}</h5>
              <p class="card-text">${product.description}</p>
              <p class="card-text">${product.price} €</p>
            `;

            elements.btnFavoritos.dataset.productName = product.name;
            elements.btnFavoritos.dataset.productPrice = product.price;
            elements.btnFavoritos.dataset.productImages = product.images;
            elements.btnFavoritos.dataset.productDescription = product.description;
          })
          .catch((error) => console.error("Error al obtener el producto", error));
      }
    });

    elements.modalFooter.addEventListener("click", (event) => {
      if (event.target.id === "btnFavoritos") {
        const { productName: name, productPrice: price, productImages: images, productDescription: description } = event.target.dataset;

        let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
        if (!favoritos.some((producto) => producto.name === name)) {
          favoritos.push({ name, price, images, description });
          localStorage.setItem("favoritos", JSON.stringify(favoritos));
          showAlert("Producto agregado a favoritos", "success");
        } else {
          showAlert("Producto ya se encuentra en favoritos", "warning");
        }
      }
    });
  }

  if (elements.searchButton) {
    const searchInput = document.getElementById("search");

    elements.searchButton.addEventListener("click", () => {
      const searchTerm = searchInput.value;
      if (searchTerm) {
        fetch(`../php/searchProducts.php?name=${searchTerm}`)
          .then((response) => response.json())
          .then((products) => {
            elements.resultsTableBody.innerHTML = "";
            products.forEach((product) => {
              addRowToTable(product.name, product.description, product.price, product.images);
            });
          })
          .catch(() => {
            alert("Error al cargar los datos del producto.");
          });
      }
    });
  }

  elements.deleteButton.addEventListener("click", () => {
    const selectedRow = elements.resultsTableBody.querySelector("tr.selected");
    if (selectedRow) {
      selectedRow.remove();
      showAlert("Producto eliminado correctamente.");
    } else {
      showAlert("Por favor, selecciona un producto.", "danger");
    }
  });

  elements.sendButton.addEventListener("click", () => {
    const selectedRow = elements.resultsTableBody.querySelector("tr.selected");
    if (selectedRow) {
      const name = selectedRow.cells[0].textContent;
      const description = selectedRow.cells[1].textContent;
      const price = selectedRow.cells[2].textContent;
      const images = selectedRow.cells[3].querySelector("img").src;

      fetch("../php/saveProduct.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description, price, images }),
      })
        .then((response) => response.json())
        .then((data) => {
          showAlert("Producto guardado correctamente.");
          clearForm();
        })
        .catch((error) => console.error("Error al guardar el producto", error));
    } else {
      if (validateForm()) {
        const name = document.getElementById("validationDefault01").value;
        const description = document.getElementById("validationDefault02").value;
        const price = document.getElementById("validationDefault03").value;
        const images = document.getElementById("validationDefault04").value;

        fetch("../php/saveProduct.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, description, price, images }),
        })
          .then((response) => response.json())
          .then((data) => {
            showAlert("Producto guardado correctamente.");
            clearForm();
            addRowToTable(name, description, price, images);
          })
          .catch((error) => console.error("Error al guardar el producto", error));
      }
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
});
