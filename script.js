// 1. Initialize EmailJS
(function() {
    emailjs.init("RTU7SSVbU01bPLdH8"); // Replace with your Public Key
})();

// 2. State Management
let cart = [];
let total = 0;

// 3. UI Functions
function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    sidebar.style.right = (sidebar.style.right === '0px') ? '-350px' : '0px';
}

function openModal(id) {
    document.getElementById(id).style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

function closeModals() {
    document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
    document.getElementById('overlay').style.display = 'none';
}

// 4. Cart Logic
function addToCart(name, price) {
    cart.push({name, price});
    total += price;
    updateUI();
    // Automatically open cart when item is added
    if(document.getElementById('cart-sidebar').style.right !== '0px') toggleCart();
}

function updateUI() {
    document.getElementById('cart-count').innerText = cart.length;
    document.getElementById('cart-total').innerText = total.toFixed(2);
    const list = document.getElementById('cart-content');
    
    if(cart.length > 0) {
        list.innerHTML = cart.map(item => `
            <div style="background:#222; padding:10px; margin-bottom:10px; border-radius:8px; display:flex; justify-content:space-between;">
                <span>${item.name}</span>
                <span>$${item.price}</span>
            </div>
        `).join('');
    }
}

function checkout() {
    if(cart.length === 0) return alert("Your stash is empty!");
    alert("Redirecting to secure payment portal...");
}

// 5. Account Creation & Email Handling
document.getElementById('network-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const serviceID = 'service_4oy8ywj'; // Replace with yours
    const templateID = 'template_7k4nxsd'; // Replace with yours

    emailjs.sendForm(serviceID, templateID, this)
        .then(() => {
            alert('Welcome to The Stoner Network! Check your inbox for your welcome kit.');
            closeModals();
        }, (err) => {
            alert('Error connecting to the network: ' + JSON.stringify(err));
        });
});
