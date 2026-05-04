// Replace with your actual credentials
const supabaseUrl = 'https://yqqobnyawdslddokdtgt.supabase.co';
const supabaseKey = 'sb_publishable_EbK5PFnq6MaIQg6PFEf5wQ_CgEdi1AJ';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

(function() {
    emailjs.init("RTU7SSVbU01bPLdH8");
})();

// AUTH LOGIC
document.getElementById('network-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const email = this.email.value;
    const password = this.password.value;
    const username = this.username.value;

    const { data, error } = await _supabase.auth.signUp({
        email: email,
        password: password,
        options: { data: { display_name: username } }
    });

    if (error) {
        alert(error.message);
    } else {
        emailjs.sendForm('Service_4oy8ywj', 'Template_7k4nxsd', this);
        alert("Registration Successful!");
        closeModals();
    }
});

async function handleLogin(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    const password = event.target.querySelector('input[type="password"]').value;

    const { data, error } = await _supabase.auth.signInWithPassword({ email, password });

    if (error) {
        alert(error.message);
    } else {
        updateUserUI(data.user);
        closeModals();
    }
}

async function handleLogout() {
    await _supabase.auth.signOut();
    window.location.reload();
}

// UI UPDATES
function updateUserUI(user) {
    const username = user.user_metadata.display_name || user.email;
    const joinBtn = document.querySelector('.join-link');
    const dropdown = document.getElementById('user-dropdown');

    joinBtn.innerText = `Hi, ${username}`;
    joinBtn.onclick = (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('show');
    };
}

async function checkUser() {
    const { data: { user } } = await _supabase.auth.getUser();
    if (user) updateUserUI(user);
}

// Close dropdown on click away
window.onclick = function(event) {
    if (!event.target.matches('.join-link')) {
        const dd = document.getElementById('user-dropdown');
        if (dd && dd.classList.contains('show')) dd.classList.remove('show');
    }
}

// MODAL & CART HELPER FUNCTIONS
function openModal() {
    document.getElementById('network-modal').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

function closeModals() {
    document.getElementById('network-modal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

function showTab(type) {
    document.getElementById('login-form-container').style.display = type === 'login' ? 'block' : 'none';
    document.getElementById('signup-form-container').style.display = type === 'signup' ? 'block' : 'none';
}

let cart = [];
let total = 0;

function toggleCart() {
    const s = document.getElementById('cart-sidebar');
    s.style.right = (s.style.right === '0px') ? '-350px' : '0px';
}

function addToCart(name, price) {
    cart.push({name, price});
    total += price;
    updateCartUI();
}

function updateCartUI() {
    document.getElementById('cart-count').innerText = cart.length;
    document.getElementById('cart-total').innerText = total.toFixed(2);
    document.getElementById('cart-content').innerHTML = cart.map(i => `<p>${i.name} - $${i.price}</p>`).join('');
}

window.onload = checkUser;
