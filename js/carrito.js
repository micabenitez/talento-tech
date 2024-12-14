const btnAddCart = document.querySelectorAll('.btn-add-cart');
const btnCarrito = document.querySelector('.btn-cart');
const cartContent = document.querySelector('.carrito-content');
const btnVaciar = document.querySelector('#vaciar-carrito');
const cartBody = document.querySelector('#cart-body');
const totalCompra = document.querySelector('#total');
const cartCounter = document.querySelector('.cont-products');

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
localStorage.setItem('carrito', JSON.stringify(carrito));

const carritoVacio = document.createElement("div");
carritoVacio.className = "carrito-vacio";
carritoVacio.innerHTML = `<p>No hay productos en el carrito</p>`;

btnVaciar.addEventListener('click', () => {
    cartBody.innerHTML = '';
    cartBody.appendChild(carritoVacio);
    carrito = [];
    localStorage.removeItem('carrito');
    totalCompra.textContent = 0;
    cartCounter.textContent = 0; 
})

btnCarrito.addEventListener('click', () => {
    cartContent.classList.toggle('carrito-closed');
    
    if (carrito.length === 0) {
        cartBody.appendChild(carritoVacio);
    }
})

btnAddCart.forEach(btn => {
    btn.addEventListener('click', () => {
        const product = JSON.parse(btn.dataset.product);
        agregarAlCarrito(product);
        actualizarCarrito();
    })
})

function agregarAlCarrito(productData) {
    const existe = carrito.some(product => product.name === productData.name);
    if (existe) {
        const product = carrito.find(product => product.name === productData.name);
        product.qty++;
        return;
    } else {
        carrito = [...carrito, productData];
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function actualizarCarrito() {
    const totalElement = document.getElementById("#total");

    if (carrito.length === 0) {
        cartBody.appendChild(carritoVacio);
        return;
    }

    cartBody.innerHTML = ''; // limpiar la lista actual
    total = 0;

    carrito.forEach(product => {
        const card = document.createElement("div");
        card.className = "cart-card"
        card.setAttribute("data-id", product.id);
        card.innerHTML = `
            <img src=${product.img_url} alt="">
            <div class="info">
                <h5>${product.name}</h5>
                <span>${product.precio}</span>
            </div>
            <div class="qty">
                <input type="number" value=${product.qty} min="1">
            </div>
            <button class="btn-delete-item"><i class="fa-solid fa-trash-can" style="color: #000000;"></i> </button>
        `;

        const deleteButton = card.querySelector(".btn-delete-item");
        deleteButton.addEventListener("click", (event) => {
            event.preventDefault();
            const productId = card.getAttribute("data-id");
            eliminarProducto(productId); 
            actualizarCarrito();         
            card.remove();
        });

        cartBody.appendChild(card);
        total += parseInt(product.precio.slice(1) * parseInt(product.qty)); 
        totalCompra.textContent = total.toFixed(2);
        cartCounter.textContent = carrito.length;
    })
}

function eliminarProducto(id) {
    const product = carrito.find(product => product.id === id);
    if (product.qty > 1) {
        product.qty--;
    }else {
        carrito = carrito.filter(product => product.id !== id);
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }
    total -= parseInt(product.precio.slice(1));
    totalCompra.textContent = total.toFixed(2);
    contadorCarrito()
}

function contadorCarrito() {
    cartCounter.textContent = JSON.parse(localStorage.getItem('carrito')).length;
}
contadorCarrito();
actualizarCarrito();