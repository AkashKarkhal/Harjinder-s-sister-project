let products = [];
let cart = [];

// Fetch Live Data from API
async function fetchItems() {
    try {
        const res = await fetch('https://makeup-api.herokuapp.com/api/v1/products.json?brand=nyx');
        const data = await res.json();
        
        products = data.slice(0, 16).map((p, index) => ({
            id: p.id,
            name: p.name,
            price: parseFloat(p.price) || 12.00,
            image: p.api_featured_image,
            cat: index % 3 === 0 ? 'Clips' : (index % 3 === 1 ? 'Bands' : 'Pins')
        }));
        
        renderProducts(products);
        document.getElementById('itemCount').innerText = `${products.length} Luxury Pieces`;
    } catch (e) {
        document.getElementById('productGrid').innerHTML = "Storefront is updating. Please refresh.";
    }
}

function renderProducts(data) {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = data.map(p => `
        <div class="product-card">
            <div class="img-container">
                <img src="${p.image}" onerror="this.src='https://via.placeholder.com/300?text=Premium+Accessory'" loading="lazy">
            </div>
            <div class="card-info" style="padding:20px; text-align:center;">
                <span style="color:#ff85a2; font-size:0.7rem; font-weight:700">${p.cat.toUpperCase()}</span>
                <h3 style="font-family:'Playfair Display'; margin:5px 0; font-size:1.1rem">${p.name}</h3>
                <p style="font-weight:700; color:#ff4d6d; font-size:1.2rem;">$${p.price.toFixed(2)}</p>
                <div style="display:flex; gap:10px; margin-top:15px">
                    <button style="background:#2d3436; color:#fff; padding:12px; border-radius:10px; flex:2; font-weight:600" onclick="buyNow(${p.id})">Buy Now</button>
                    <button style="background:#fff0f3; color:#ff4d6d; padding:12px; border-radius:10px; flex:1" onclick="addToCart(${p.id})"><i class="fas fa-plus"></i></button>
                </div>
            </div>
        </div>
    `).join('');
}

// Individual Delete Option in Cart
function deleteItem(cartId) {
    cart = cart.filter(item => item.cartId !== cartId);
    updateCartUI();
}

function addToCart(id) {
    const p = products.find(i => i.id === id);
    cart.push({...p, cartId: Date.now()});
    updateCartUI();
    document.getElementById('cartSidebar').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function buyNow(id) {
    cart = [];
    addToCart(id);
}

function updateCartUI() {
    document.getElementById('cartCount').innerText = cart.length;
    let total = 0;
    document.getElementById('cartItemsList').innerHTML = cart.map(item => {
        total += item.price;
        return `
            <div class="cart-item">
                <img src="${item.image}">
                <div style="flex:1">
                    <p style="font-weight:700; font-size:0.85rem">${item.name.substring(0,20)}...</p>
                    <p style="font-weight:700; color:#ff4d6d">$${item.price.toFixed(2)}</p>
                </div>
                <i class="fas fa-trash-alt del-icon" onclick="deleteItem(${item.cartId})"></i>
            </div>`;
    }).join('');
    document.getElementById('cartTotal').innerText = `$${total.toFixed(2)}`;
}

// Search & Filtering Logic
document.getElementById('searchBar').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    renderProducts(products.filter(p => p.name.toLowerCase().includes(term)));
});

document.querySelectorAll('.tag').forEach(tag => {
    tag.onclick = () => {
        document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
    };
});

document.getElementById('applyFilter').onclick = () => {
    const max = parseFloat(document.getElementById('priceRange').value);
    const cat = document.querySelector('.tag.active').dataset.cat;
    const filtered = products.filter(p => (cat === 'all' || p.cat === cat) && p.price <= max);
    renderProducts(filtered);
    document.getElementById('filterModal').style.display = 'none';
};

// UI Toggles
document.getElementById('openCart').onclick = () => { document.getElementById('cartSidebar').classList.add('active'); document.body.style.overflow = 'hidden'; };
document.getElementById('closeCart').onclick = () => { document.getElementById('cartSidebar').classList.remove('active'); document.body.style.overflow = 'auto'; };
document.getElementById('filterBtn').onclick = () => document.getElementById('filterModal').style.display = 'flex';
document.getElementById('closeFilter').onclick = () => document.getElementById('filterModal').style.display = 'none';
document.getElementById('priceRange').oninput = (e) => document.getElementById('priceVal').innerText = e.target.value;

document.getElementById('payNowBtn').onclick = () => {
    if(cart.length === 0) return;
    document.getElementById('finalPaid').innerText = document.getElementById('cartTotal').innerText;
    document.getElementById('cartSidebar').classList.remove('active');
    document.getElementById('successOverlay').style.display = 'flex';
    document.body.style.overflow = 'hidden';
};

fetchItems();