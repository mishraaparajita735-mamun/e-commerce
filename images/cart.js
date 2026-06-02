// Load cart when page opens
document.addEventListener('DOMContentLoaded', loadCart);

function loadCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartList = document.getElementById('cart-list');
    let emptyCartDiv = document.getElementById('empty-cart');
    let summarySection = document.getElementById('cart-summary-section');

    updateCartCount();

    if (cart.length === 0) {
        if (cartList) cartList.style.display = 'none';
        if (summarySection) summarySection.style.display = 'none';
        if (emptyCartDiv) emptyCartDiv.style.display = 'block';
        return;
    }

    if (cartList) cartList.style.display = 'block';
    if (summarySection) summarySection.style.display = 'block';
    if (emptyCartDiv) emptyCartDiv.style.display = 'none';

    cartList.innerHTML = '';
    let subtotal = 0;

    cart.forEach((item, index) => {
        subtotal += item.price * item.qty;
        cartList.innerHTML += `
            <div class="cart-item">
                <img class="item-img" src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <p><strong>${item.name}</strong></p>
                    <p style="color:#3B82F6;font-weight:600;">₹${item.price}</p>
                    <div style="margin-top: 10px;">
                        <span class="remove-text" onclick="removeItem(${index})">✕ Remove</span>
                    </div>
                </div>
                <div class="item-actions">
                    <button onclick="updateQty(${index}, -1)">-</button>
                    <span>${item.qty}</span>
                    <button onclick="updateQty(${index}, 1)">+</button>
                </div>
                <div><strong>₹${(item.price * item.qty).toLocaleString()}</strong></div>
            </div>
        `;
    });

    let delivery = subtotal > 500? 0 : 40;
    let tax = Math.round(subtotal * 0.18);
    let total = subtotal + delivery + tax;

    document.getElementById('subtotal').innerText = '₹' + subtotal.toLocaleString();
    document.getElementById('delivery').innerText = delivery === 0? 'FREE' : '₹' + delivery;
    document.getElementById('tax').innerText = '₹' + tax.toLocaleString();
    document.getElementById('total').innerText = '₹' + total.toLocaleString();
}

function updateQty(index, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart[index].qty += change;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

function checkout() {
    let total = document.getElementById('total').innerText;
    alert('Checkout feature coming soon! Total: ' + total);
}

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let count = cart.reduce((sum, item) => sum + item.qty, 0);
    let countElements = document.querySelectorAll('#cart-count');
    countElements.forEach(el => {
        el.innerText = count;
    });
}

// Ye function dusre pages se call karna products add karne ke liye
function addToCart(name, price, image) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let existing = cart.find(item => item.name === name);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({name: name, price: price, image: image, qty: 1});
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(name + ' added to cart!');
}

// Page load pe cart count update kar de
updateCartCount();