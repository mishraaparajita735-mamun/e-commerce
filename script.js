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
                    <h3>${item.name}</h3>
                    <div class="item-price">₹${item.price.toLocaleString()}</div>
                    <div class="item-actions">
                        <button onclick="updateQty(${index}, -1)">-</button>
                        <span class="qty">${item.quantity}</span>
                        <button onclick="updateQty(${index}, 1)">+</button>
                        <span class="remove-text" onclick="removeItem(${index})">Remove</span>
                    </div>
                </div>
                <div class="item-price">₹${(item.price * item.quantity).toLocaleString()}</div>
            </div>
        `;
    });

    // Calculate totals
    let delivery = subtotal > 500 ? 0 : 40;
    let tax = Math.round(subtotal * 0.18);
    let total = subtotal + delivery + tax;

    // Update summary section
    if (document.getElementById('subtotal')) {
        document.getElementById('subtotal').innerText = '₹' + subtotal.toLocaleString();
    }
    if (document.getElementById('delivery')) {
        document.getElementById('delivery').innerText = delivery === 0 ? 'FREE' : '₹' + delivery;
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

// Checkout Page Functions
function loadCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const checkoutItems = document.getElementById('checkout-items');
    
    if (!checkoutItems) return;
    
    let subtotal = 0;
    checkoutItems.innerHTML = '';
    
    if (cart.length === 0) {
        checkoutItems.innerHTML = '<p style="color:#EF4444; text-align:center; padding:20px;">Your cart is empty! <a href="index.html">Shop now</a></p>';
        document.querySelector('.place-order-btn').disabled = true;
        document.querySelector('.place-order-btn').style.opacity = '0.5';
        document.querySelector('.place-order-btn').style.cursor = 'not-allowed';
        return;
    }
    
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        checkoutItems.innerHTML += `
            <div class="summary-row">
                <span>${item.name} x ${item.quantity}</span>
                <span>₹${(item.price * item.quantity).toLocaleString()}</span>
            </div>
        `;
    });
    
    const delivery = subtotal > 500 ? 0 : 40;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + delivery + tax;
    
    document.getElementById('checkout-subtotal').textContent = '₹' + subtotal.toLocaleString();
    document.getElementById('checkout-delivery').textContent = delivery === 0 ? 'FREE' : '₹' + delivery;
    document.getElementById('checkout-tax').textContent = '₹' + tax.toLocaleString();
    document.getElementById('checkout-total').textContent = '₹' + total.toLocaleString();
}

// Live Location Function
function getLocation() {
    const status = document.getElementById('location-status');
    
    if (!navigator.geolocation) {
        status.textContent = 'Browser me location support nahi hai';
        status.style.color = '#EF4444';
        return;
    }
    
    status.textContent = 'Location detect ho rahi hai...';
    status.style.color = '#6b7280';
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
                .then(res => res.json())
                .then(data => {
                    document.getElementById('street').value = data.address.road || data.address.neighbourhood || data.address.suburb || '';
                    document.getElementById('city').value = data.address.city || data.address.town || data.address.village || '';
                    document.getElementById('state').value = data.address.state || '';
                    document.getElementById('pincode').value = data.address.postcode || '';
                    status.textContent = '✓ Location mil gayi! Address bhar diya';
                    status.style.color = '#10B981';
                })
                .catch(() => {
                    status.textContent = 'Address nahi mila. Manually bhar de';
                    status.style.color = '#EF4444';
                });
        },
        (error) => {
            status.textContent = 'Permission deny kar di. Browser me Allow karo';
            status.style.color = '#EF4444';
        }
    );
}

// Place Order Function
function placeOrder() {
    const form = document.getElementById('checkoutForm');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        alert('Your cart is empty! Add some products first.');
        window.location.href = 'index.html';
        return;
    }
    
    if (!form.checkValidity()) {
        alert('Please fill all required fields correctly');
        form.reportValidity();
        return;
    }
    
    const name = document.getElementById('fullName').value;
    const mobile = document.getElementById('mobile').value;
    const payment = document.querySelector('input[name="payment"]:checked').value;
    
    // Calculate total again for confirmation
    let subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let delivery = subtotal > 500 ? 0 : 40;
    let tax = Math.round(subtotal * 0.18);
    let total = subtotal + delivery + tax;
    
    alert(`Thank you ${name}! \n\nOrder placed successfully! \nTotal Amount: ₹${total.toLocaleString()} \nPayment Method: ${payment} \nMobile: ${mobile}\n\nWe will deliver soon!`);
    
    localStorage.removeItem('cart');
    window.location.href = 'index.html';
}

// Hamburger Menu Toggle
function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('show');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    if (document.getElementById('cart-list')) {
        loadCart();
    }
    
    if (document.getElementById('checkout-items')) {
        loadCheckout();
    }
});