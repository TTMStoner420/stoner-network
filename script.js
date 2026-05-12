// --- CONFIGURATION ---
const supabaseUrl = 'YOUR_URL';
const supabaseKey = 'YOUR_KEY';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

(function() { emailjs.init("YOUR_EMAILJS_KEY"); })();

// --- AUTH LOGIC ---
document.getElementById('network-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const { data, error } = await _supabase.auth.signUp({
        email: this.email.value,
        password: this.password.value,
        options: { data: { display_name: this.username.value } }
    });
    if (error) alert(error.message);
    else { 
        emailjs.sendForm('SERVICE_ID', 'TEMPLATE_ID', this); 
        alert("Account created! Check your email for verification."); 
        closeModals(); 
    }
});

async function handleLogin(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('input[type="password"]').value;
    const { data, error } = await _supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else { 
        updateUserUI(data.user); 
        closeModals(); 
    }
}

async function handleLogout() {
    await _supabase.auth.signOut();
    window.location.reload();
}

// --- UI UPDATES ---
function updateUserUI(user) {
    const username = user.user_metadata.display_name || user.email;
    const joinBtn = document.querySelector('.join-link');
    const dropdown = document.getElementById('user-dropdown');

    joinBtn.innerText = `Hi, ${username}`;
    joinBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropdown.classList.toggle('show');
    };
}

// --- CART LOGIC ---
let cart = [];
let total = 0;

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const currentRight = sidebar.style.right;
    sidebar.style.right = (currentRight === '0px') ? '-350px' : '0px';
}

function addToCart(name, price) {
    cart.push({name, price});
    total += price;
    updateCartUI();
    
    // Auto-open cart when adding item
    document.getElementById('cart-sidebar').style.right = '0px';
}

function updateCartUI() {
    document.getElementById('cart-count').innerText = cart.length;
    document.getElementById('cart-total').innerText = total.toFixed(2);
    const content = document.getElementById('cart-content');
    
    if(cart.length === 0) {
        content.innerHTML = '<p>Your stash is empty.</p>';
    } else {
        content.innerHTML = cart.map(item => `
            <div style="display:flex; justify-content:space-between; margin-bottom:10px; background:#222; padding:10px; border-radius:5px;">
                <span>${item.name}</span>
                <span>$${item.price}</span>
            </div>
        `).join('');
    }
}

function checkout() {
    if(cart.length === 0) return alert("Add some items first!");
    alert("Checkout portal opening...");
}

// --- GENERAL HELPERS ---
async function checkUser() {
    const { data: { user } } = await _supabase.auth.getUser();
    if (user) updateUserUI(user);
}

function openModal() {
    document.getElementById('network-modal').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

function closeModals() {
    document.getElementById('network-modal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

function showTab(type) {
    document.getElementById('login-form-container').style.display = (type === 'login' ? 'block' : 'none');
    document.getElementById('signup-form-container').style.display = (type === 'signup' ? 'block' : 'none');
}

// Global click listener to close dropdowns
window.addEventListener('click', function(e) {
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown && !e.target.matches('.join-link')) {
        dropdown.classList.remove('show');
    }
});

window.onload = checkUser;
