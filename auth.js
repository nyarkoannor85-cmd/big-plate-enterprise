// 1. SUPABASE CONNECTION
const supabaseUrl = 'https://udsp-saykab-rptwkyaxnp.supabase.co'; 
const supabaseKey = 'YOUR_NEW_KEY_HERE'; // Replace this with your actual Anon Key
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

let currentCart = [];
let menuData = [];

// 2. AUTHENTICATION
async function handleAuth() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('user-role').value;

    const { data, error } = await _supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        alert("Login Failed: " + error.message);
    } else {
        document.getElementById('auth-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
        
        if (role === 'Vendor') { // Capital 'V' to match your dropdown
            document.getElementById('vendor-section').style.display = 'block';
        }
        loadMenu();
    }
}

// 3. MENU LOGIC
async function loadMenu() {
    const { data, error } = await _supabase.from('menu').select('*');

    if (error  !data  data.length === 0) { // Fixed the "||" symbol
        menuData = [
            {id: 1, name: 'Assorted Jollof', price: 50, img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?auto=format&fit=crop&w=400&q=80'},
            {id: 2, name: 'Banku & Tilapia', price: 70, img: 'https://images.unsplash.com/photo-1599487488170-d11ec9c175f0?auto=format&fit=crop&w=400&q=80'}
        ];
    } else {
        menuData = data;
    }
    renderMenu(menuData);
}

function renderMenu(items) {
    const container = document.getElementById('menu-container');
    // Using backticks () for the HTML template below
    container.innerHTML = items.map(item => 
        <div class="food-card">
            <img src="${item.img || 'https://via.placeholder.com/150'}" alt="${item.name}">
            <h3>${item.name}</h3>
            <div class="food-price">GHS ${item.price}.00</div>
            <button class="btn" onclick="addToCart('${item.name}', ${item.price})">Add to Cart</button>
        </div>
    ).join('');
}

// 4. CART & WHATSAPP
function addToCart(name, price) {
    currentCart.push({name, price});
    updateCartUI();
}

function updateCartUI() {
    const cartDiv = document.getElementById('cart-items');
    let total = 0;
    cartDiv.innerHTML = currentCart.map((item) => {
        total += item.price;
        return <p>${item.name} - GHS ${item.price}</p>;
    }).join('');
    document.getElementById('cart-total').innerText = total;
}

function checkoutWhatsApp() {
    if(currentCart.length === 0) return alert("Cart is empty!");
    let message = "Hello Big Plate, I would like to order:%0A";
    currentCart.forEach(item => message += - ${item.name} (GHS ${item.price})%0A);
    message += %0ATotal: GHS ${document.getElementById('cart-total').innerText};
    window.open(https://wa.me/233500000000?text=${message}`); // Replace with your number
}

function filterMenu() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = menuData.filter(i => i.name.toLowerCase().includes(query));
    renderMenu(filtered);
}
