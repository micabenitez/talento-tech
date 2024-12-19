const btnAddCart = document.querySelectorAll('.btn-add-cart');
const btnCarrito = document.querySelector('.btn-cart');
const cartContent = document.querySelector('.carrito-content');
const btnVaciar = document.querySelector('#vaciar-carrito');
const cartBody = document.querySelector('#cart-body');
const totalCompra = document.querySelector('#precio-total');
const cartCounter = document.querySelector('.cont-products');
const btnCerrarCarrito = document.querySelector('#cart-close');
const container = document.querySelector(".container-index");
const btnComprar = document.querySelector('.btn-comprar');
const carritoVacio = document.createElement("div");
carritoVacio.className = "carrito-vacio";
carritoVacio.innerHTML = `<p>No hay productos en el carrito</p>`;

btnCerrarCarrito.addEventListener('click', () => {
    cartContent.classList.add('carrito-closed');
})

btnComprar.addEventListener('click', () => {
    window.location.href = 'pages/pago.html';
})

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
localStorage.setItem('carrito', JSON.stringify(carrito));

// VACIAR CARRITO
btnVaciar.addEventListener('click', () => {
    cartBody.innerHTML = '';
    cartBody.appendChild(carritoVacio);
    carrito = [];
    total = 0;
    localStorage.removeItem('carrito');
    totalCompra.textContent = '$'+ total.toFixed(2);
    cartCounter.textContent = 0; 
})

// CERRAR CARRITO
btnCarrito.addEventListener('click', () => {
    cartContent.classList.toggle('carrito-closed');
    
    if (carrito.length === 0) {
        cartBody.appendChild(carritoVacio);
    }
})

container.addEventListener('click', (event) => {
    if (event.target.classList.contains('btn-add-cart')) {
        const btn = event.target;
        const productCard = btn.closest('.product-card');
   
        const imageUrl = productCard.querySelector('img').src; 
        const url = new URL(imageUrl);
        const path = url.pathname; 

        const product = {
            id: productCard.getAttribute('data-id'),
            name: productCard.querySelector('h5').textContent,
            precio: productCard.querySelector('span').textContent,
            img_url: path,
            qty: 1
        };
        agregarAlCarrito(product);
        actualizarCarrito();
    }
});
function agregarAlCarrito(productData) {
    const existe = carrito.some(product => product.name === productData.name);
    if (existe) {
        const product = carrito.find(product => product.name === productData.name);
        product.qty++;
        cartCounter.textContent = JSON.parse(localStorage.getItem('carrito')).length + 1;
        mostrarModal();
        return;
    } else {
        carrito = [...carrito, productData];
    }
    localStorage.setItem('carrito', JSON.stringify(carrito)); 
    contadorCarrito();
    mostrarModal();
    
}
function mostrarModal(){
    const modal = document.createElement("div");
    modal.className = "modal-producto-agregado";
    modal.textContent = "¡Producto agregado al carrito!";
    btnCarrito.appendChild(modal);
    setTimeout(() => {
        modal.remove();
    }, 2000);    
}

function actualizarCarrito() {
    if (carrito.length === 0) {
        cartBody.appendChild(carritoVacio);
        return;
    }

    cartBody.innerHTML = '';
    total = 0;

    carrito.forEach(product => {
        const card = document.createElement("div");
        card.className = "cart-card"
        card.setAttribute("data-id", product.id);
        card.innerHTML = `
            <img src=${product.img_url} alt="">
            <div class="p-info">
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
        total += parseInt(product.precio.slice(1)) * parseInt(product.qty); 
        totalCompra.textContent = `$${total.toFixed(2)}`;
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
    totalCompra.textContent = `$${total.toFixed(2)}`;
    contadorCarrito()
}

function contadorCarrito() {
    cartCounter.textContent = JSON.parse(localStorage.getItem('carrito')).length;
}
contadorCarrito();
actualizarCarrito();