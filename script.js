// Initialize cart when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    if (document.getElementById('cart-list')) {
        loadCart();
    }
});

// Add to Cart - Works from any page
function addToCart(name, price, image) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name, 
            price: price, 
            image: image, 
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(name + ' added to cart!');
}

// Update cart count on cart icon
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    let cartCountElement = document.getElementById('cart-count');
    
    if (cartCountElement) {
        cartCountElement.innerText = totalCount;
    }
}

// Load cart items on cart.html page
function loadCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartList = document.getElementById('cart-list');
    let emptyCartDiv = document.getElementById('empty-cart');
    let summarySection = document.getElementById('cart-summary-section');

    if (!cartList) return;

    if (cart.length === 0) {
        cartList.style.display = 'none';
        if (summarySection) summarySection.style.display = 'none';
        if (emptyCartDiv) emptyCartDiv.style.display = 'block';
        return;
    }

    cartList.style.display = 'block';
    if (summarySection) summarySection.style.display = 'block';
    if (emptyCartDiv) emptyCartDiv.style.display = 'none';

    cartList.innerHTML = '';
    let subtotal = 0;

    cart.forEach((item, index) => {
        subtotal += item.price * item.quantity;
        cartList.innerHTML += `
            <div class="cart-item">
                <img class="item-img" src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <p><strong>${item.name}</strong></p>
                    <p style="color:#3B82F6;font-weight:600;">₹${item.price}</p>
                    <div style="margin-top: 10px;">
                        <span class="remove-text" onclick="removeItem(${index})" style="cursor:pointer;color:#EF4444;">✕ Remove</span>
                    </div>
                </div>
                <div class="item-actions">
                    <button onclick="updateQty(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQty(${index}, 1)">+</button>
                </div>
                <div><strong>₹${(item.price * item.quantity).toLocaleString()}</strong></div>
            </div>
        `;
    });

    // Calculate totals
    let delivery = subtotal > 500? 0 : 40;
    let tax = Math.round(subtotal * 0.18);
    let total = subtotal + delivery + tax;

    // Update summary section
    if (document.getElementById('subtotal')) {
        document.getElementById('subtotal').innerText = '₹' + subtotal.toLocaleString();
    }
    if (document.getElementById('delivery')) {
        document.getElementById('delivery').innerText = delivery === 0? 'FREE' : '₹' + delivery;
    }
    if (document.getElementById('tax')) {
        document.getElementById('tax').innerText = '₹' + tax.toLocaleString();
    }
    if (document.getElementById('total')) {
        document.getElementById('total').innerText = '₹' + total.toLocaleString();
    }
}

// Update item quantity in cart
function updateQty(index, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    updateCartCount();
}

// Remove item from cart
function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    updateCartCount();
}