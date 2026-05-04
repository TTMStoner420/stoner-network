// ==========================================
// 1. CONFIGURATION & INITIALIZATION
// ==========================================

// Replace these with your Supabase credentials
const supabaseUrl = 'https://yqqobnyawdslddokdtgt.supabase.co';
const supabaseKey = 'sb_publishable_EbK5PFnq6MaIQg6PFEf5wQ_CgEdi1AJ';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Replace with your EmailJS Public Key
(function() {
    emailjs.init("RTU7SSVbU01bPLdH8");
})();

// ==========================================
// 2. AUTHENTICATION LOGIC (SIGN UP & LOGIN)
// ==========================================

// HANDLE SIGN UP
document.getElementById('network-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const email = this.email.value;
    const password = this.password.value; // Ensure you added this input to your HTML
    const username = this.username.value;

    // Create User in the Supabase Cloud
    const { data, error } = await _supabase.auth.signUp({
        email: email,
        password: password,
        options: { 
            data: { display_name: username } 
        }
    });

    if (error) {
        alert("Sign Up Error: " + error.message);
    } else {
        // Trigger the Welcome Email via EmailJS
        emailjs.sendForm('Service_4oy8ywj', 'Template_7k4nxsd', this);
        
        alert("Registration Successful! Welcome to the Network.");
        closeModals();
        checkUser(); // Refresh UI
    }
});

// HANDLE LOGIN
async function handleLogin(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    const password = event.target.querySelector('input[type="password"]').value;

    const { data, error } = await _supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        alert("Login failed: " + error.message);
    } else {
        alert("Logged in across the Network!");
        updateUserUI(data.user);
        closeModals();
    }
}

// PERSISTENCE: CHECK IF USER IS LOGGED IN ON LOAD
async function checkUser() {
    const { data: { user } } = await _supabase.auth.getUser();
    if (user) {
        updateUserUI(user);
    }
}

function updateUserUI(user) {
    const username = user.user_metadata.display_name || user.email;
    const joinBtn = document.querySelector('.join-link');
    
    // Change "Join Network" to "Hi, Username"
    joinBtn.innerText = `Hi, ${username}`;
    
    // Change click behavior to a Logout option
    joinBtn.onclick = async () => {
        if(confirm("Do you want to log out of the Network?")) {
            await _supabase.auth.signOut();
            window.location.reload(); // Refresh to reset UI
        }
    };
}

// ==========================================
// 3. UI & MODAL LOGIC
// ==========================================

function openModal() {
    document.getElementById('network-modal').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

function closeModals() {
    document.getElementById('network-modal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

function showTab(type) {
    const loginForm = document.getElementById('login-form-container');
    const signupForm = document.getElementById('signup-form-container');
    const loginBtn = document.getElementById('login-tab-btn');
    const signupBtn = document.getElementById('signup-tab-btn');

    if (type === 'login') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        loginBtn.classList.add('active');
        signupBtn.classList.remove('active');
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        signupBtn.classList.add('active');
        loginBtn.classList.remove('active');
    }
}

// ==========================================
// 4. SHOPPING CART LOGIC
// ==========================================

let cart = [];
let total = 0;

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    sidebar.style.right = (sidebar.style.right === '0px') ? '-350px' : '0px';
}

function addToCart(name, price) {
    cart.push({name, price});
    total += price;
    updateCartUI();
    
    // Open cart sidebar so user sees the item added
    if(document.getElementById('cart-sidebar').style.right !== '0px') {
        toggleCart();
    }
}

function updateCartUI() {
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
    alert("Redirecting to our secure 2026 payment portal...");
}

// Start everything when the page finishes loading
window.onload = checkUser;
