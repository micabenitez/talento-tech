const productsContainer = document.querySelector(".container");

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const products = await getProducts();
        mostrarProductos(products);
    } catch (error) {
        console.error(error);
    }
});

async function getProducts() {
    try {
        const response = await fetch("https://api-nodejs-tha8.onrender.com/items");
        const data = await response.json();
        return data.response;
    } catch (error) {
        throw new Error("Error al obtener los productos: " + error);
    }
}

function mostrarProductos(products) {  
    products.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.setAttribute("data-id", product._id);
        card.innerHTML = `
            <img src=${product.img_url} alt="">     
            <div class="info"> 
                <h5>${product.name}</h5>
                <span>$${product.precio}</span>            
            </div>       
            <button class="btn-add-cart">Agregar al carrito</button>
        `;
        productsContainer.appendChild(card);
        const productImage = card.querySelector('img');

        productImage.addEventListener("click", (e) => {
            localStorage.setItem("selectedProduct", JSON.stringify(product));
            e.stopPropagation();
            window.location.href = `productInfo.html?id=${product._id}`;
        });
    });
}

productsContainer.addEventListener("click", (event) => {
    event.preventDefault()
    if (event.target.classList.contains("btn-add-cart")) {
        const product = event.target.closest(".product-card");
        const productData = {
            id: product.dataset.id,
            name: product.querySelector("h5").textContent,
            precio: product.querySelector("span").textContent,
            img_url: product.querySelector("img").src,
            qty: 1
        };
        agregarAlCarrito(productData);
        actualizarCarrito();
    }
});
