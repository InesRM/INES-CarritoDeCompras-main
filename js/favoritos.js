window.addEventListener("load", function () {

  function cargarFavoritos() {
    const favoritosElement = document.querySelector("#favoritos");
    if (favoritosElement) {
      const favoritos = JSON.parse(localStorage.getItem("favoritos")) || []; //Si no hay nada en el localstorage, se crea un array vacío
      favoritos.forEach((curso) => {
        if (curso) {
          const card = document.createElement("div");
          card.classList.add("card");
          card.innerHTML = `
          <div class="card" style="width: 38rem;">
            <img src="../img/${curso.imagen}" class="card-img-top" alt="${curso.nombre}">
          <div class="card-body">
                <h5 class="card-title">${curso.nombre}</h5>
                <p class="card-text">${curso.descripcion}</p>
                <p class="card-text">${curso.categoria}</p>
                <p class="card-text">${curso.precio}</p>
                <p class="card-text">${curso.valoracion} €</p>
                 <button class="btn btn-danger" data-curso-nombre="${curso.nombre}">Eliminar favorito</button>
        </div>
    </div>
    `;
          favoritosElement.appendChild(card);
        }
      });
    }
  }
  cargarFavoritos();

    function eliminarFavorito(nombre) {
        const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
        const nuevoArray = favoritos.filter((curso) => curso.nombre !== nombre);
        localStorage.setItem("favoritos", JSON.stringify(nuevoArray));
        location.reload();
    }

    document.addEventListener("click", (event) => {
        if (event.target.tagName === "BUTTON") {
            const nombre = event.target.getAttribute("data-curso-nombre");
            eliminarFavorito(nombre);
        }
    });
});
