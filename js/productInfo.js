const productDetailsContainer = document.querySelector(".product-info");
const product = JSON.parse(localStorage.getItem("selectedProduct"));

function mostrarProductDetails() {
    const productDetails = document.createElement('div');
    productDetails.className = "product-details-container";
    productDetails.innerHTML = `
        <div class="product-img">
            <img src=${product.img_url} alt="">
        </div>
        <div class="product-details">
            <h2>${product.name}</h2>
            <p>${product.descripcion}</p>
            <span>$${product.precio}</span>
            <button class="btn-add-cart">Agregar al carrito</button>
        </div>        
    `;
    productDetailsContainer.appendChild(productDetails)
      
    productDetailsContainer.querySelector(".btn-add-cart").addEventListener("click", (e) => {
        e.preventDefault();
    
        const productData = {
            id: product._id,
            name: product.name,
            precio: "$" + product.precio,
            img_url: product.img_url,
            qty: 1
        };
        agregarAlCarrito(productData);
        actualizarCarrito();
    })
}

mostrarProductDetails();
