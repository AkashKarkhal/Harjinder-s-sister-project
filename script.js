let products = [];
let cart = [];

// Fetch Data
async function fetchLuxProducts() {
    try {
        const res = await fetch('https://makeup-api.herokuapp.com/api/v1/products.json?product_type=eyebrow');
        const data = await res.json();
        
        products = data.slice(0, 16).map((p, index) => ({
            id: p.id,
            name: p.name,
            price: parseFloat(p.price) || (15.99 + index),
            image: p.api_featured_image,
            category: index % 3 === 0 ? 'Clips' : (index % 3 === 1 ? 'Bands' : 'Pins')
        }));
        
        displayProducts(products);
        document.getElementById('itemCount').innerText = `${products.length} Items Found`;
    } catch (e) {
        document.getElementById('productGrid').innerHTML = "Our vault is temporarily closed.";
    }
}

function displayProducts(items) {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = items.map(p => `
        <div class="product-card">
            <div class="img-container"><img src="${p.image}" loading="lazy"></div>
            <div class="card-info">
                <span class="badge" style="color:var(--gold); font-weight:700; font-size:0.7rem;">${p.category.toUpperCase()}</span>
                <h3 style="margin: 8px 0; font-size: 1.1rem; font-weight: 500;">${p.name.substring(0, 25)}</h3>
                <p style="font-size: 1.2rem; color: var(--dark); font-weight: 700;">$${p.price.toFixed(2)}</p>
                <div style="display:flex; gap:10px; margin-top:15px">
                    <button class="btn-buy" onclick="buyNow(${p.id})">Buy Now</button>
                    <button class="btn-add" onclick="addToCart(${p.id})"><i class="fas fa-plus"></i></button>
                </div>
            </div>
        </div>
    `).join('');
}

// Cart Logic
function addToCart(id) {
    const p = products.find(prod => prod.id === id);
    cart.push({ ...p, cartId: Date.now() });
    updateCart();
    document.getElementById('cartSidebar').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function buyNow(id) {
    cart = [];
    addToCart(id);
}

function deleteItem(cartId) {
    cart = cart.filter(item => item.cartId !== cartId);
    updateCart();
}

function updateCart() {
    document.getElementById('cartCount').innerText = cart.length;
    let total = 0;
    document.getElementById('cartItemsList').innerHTML = cart.map(item => {
        total += item.price;
        return `
            <div style="display:flex; align-items:center; gap:15px; margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:15px">
                <img src="${item.image}" style="width:60px; height:60px; border-radius:8px">
                <div style="flex:1">
                    <p style="font-weight:600; font-size:0.9rem">${item.name.substring(0,18)}...</p>
                    <p class="gold-text">$${item.price.toFixed(2)}</p>
                </div>
                <i class="fas fa-trash-can" style="color:#ff7675; cursor:pointer" onclick="deleteItem(${item.cartId})"></i>
            </div>
        `;
    }).join('');
    document.getElementById('cartTotal').innerText = `$${total.toFixed(2)}`;
}

// UI Handlers
document.getElementById('searchBar').addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase();
    displayProducts(products.filter(p => p.name.toLowerCase().includes(val)));
});

document.querySelectorAll('.tag').forEach(tag => {
    tag.onclick = () => {
        document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
    };
});

document.getElementById('applyFilter').onclick = () => {
    const max = document.getElementById('priceRange').value;
    const cat = document.querySelector('.tag.active').dataset.cat;
    const filtered = products.filter(p => (cat === 'all' || p.category === cat) && p.price <= max);
    displayProducts(filtered);
    document.getElementById('currentCategory').innerText = cat === 'all' ? 'All Accessories' : cat;
    document.getElementById('filterModal').style.display = 'none';
};

document.getElementById('openCart').onclick = () => { document.getElementById('cartSidebar').classList.add('active'); document.body.style.overflow = 'hidden'; };
document.getElementById('closeCart').onclick = () => { document.getElementById('cartSidebar').classList.remove('active'); document.body.style.overflow = 'auto'; };
document.getElementById('filterBtn').onclick = () => document.getElementById('filterModal').style.display = 'flex';
document.getElementById('closeFilter').onclick = () => document.getElementById('filterModal').style.display = 'none';
document.getElementById('priceRange').oninput = (e) => document.getElementById('priceVal').innerText = e.target.value;

document.getElementById('payNowBtn').onclick = () => {
    if(cart.length === 0) return;
    document.getElementById('finalPaid').innerText = document.getElementById('cartTotal').innerText;
    document.getElementById('successOverlay').style.display = 'flex';
};

fetchLuxProducts();