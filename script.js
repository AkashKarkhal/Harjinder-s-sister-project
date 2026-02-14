const ACCESS_KEY = '--fYYeUvTOj6vUwBvdfpfWsvYFjzErJgTyBc-cbIVM0'; 

let products = [];
let cart = [];

// Curated collection with targeted search queries for Unsplash
const hairAccessories = [
    { id: 1, name: "Marble Matte Claw Clip", price: 299, cat: "Claws", query: "hair claw clip", stock: 50 },
    { id: 2, name: "Silk Satin Scrunchie", price: 150, cat: "Scrunchies", query: "silk scrunchie", stock: 50 },
    { id: 3, name: "Pearl Velvet Headband", price: 599, cat: "Bands", query: "hair headband", stock: 50 },
    { id: 4, name: "Gold Floral Hair Pin", price: 250, cat: "Pins", query: "hair pin", stock: 50 },
    { id: 5, name: "Large Acetate Hair Claw", price: 350, cat: "Claws", query: "claw clip hair", stock: 50 },
    { id: 6, name: "Crystal Star Pin Set", price: 180, cat: "Pins", query: "crystal hair pin", stock: 50 },
    { id: 7, name: "Boho Knitted Headband", price: 420, cat: "Bands", query: "knitted headband", stock: 50 },
    { id: 8, name: "Velvet Ribbon Bow", price: 220, cat: "Pins", query: "hair ribbon bow", stock: 50 }
];

async function initializeStore() {
    // Dynamically fetch real images from Unsplash
    products = await Promise.all(hairAccessories.map(async (item) => {
        try {
            const res = await fetch(`https://api.unsplash.com/search/photos?query=${item.query}&client_id=${ACCESS_KEY}&per_page=1`);
            const data = await res.json();
            return { ...item, img: data.results[0]?.urls?.regular || "https://via.placeholder.com/500" };
        } catch (e) {
            return { ...item, img: "https://via.placeholder.com/500" };
        }
    }));
    
    renderProducts(products);
    document.getElementById('itemCount').innerText = `${products.length} Luxury Pieces Found`;
}

function renderProducts(data) {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = data.map(p => `
        <div class="product-card">
            <span class="stock-tag">${p.stock} In Stock</span>
            <div class="img-container"><img src="${p.img}" loading="lazy"></div>
            <div class="card-info">
                <span style="color:#ff85a2; font-size:0.7rem; font-weight:700">${p.cat.toUpperCase()}</span>
                <h3 style="font-family:'Playfair Display'; margin:10px 0; font-size:1.3rem">${p.name}</h3>
                <p class="card-price">₹${p.price}</p>
                <div style="display:flex; gap:10px; margin-top:20px">
                    <button class="pay-button" style="margin:0; flex:2; padding:12px;" onclick="buyNow(${p.id})">Buy Now</button>
                    <button style="flex:1; background:#fff0f3; color:#ff4d6d; border-radius:12px;" onclick="addToCart(${p.id})"><i class="fas fa-plus"></i></button>
                </div>
            </div>
        </div>
    `).join('');
}

// Cart Management
function addToCart(id) {
    const item = products.find(i => i.id === id);
    if(item.stock > 0) {
        cart.push({...item, cartId: Date.now()});
        item.stock--; 
        updateCartUI();
        renderProducts(products);
        document.getElementById('cartSidebar').classList.add('active');
    } else {
        alert("Sorry, this item is out of stock!");
    }
}

function buyNow(id) {
    cart = [];
    addToCart(id);
}

function deleteItem(cartId, originalId) {
    cart = cart.filter(item => item.cartId !== cartId);
    const original = products.find(i => i.id === originalId);
    original.stock++; 
    updateCartUI();
    renderProducts(products);
}

function updateCartUI() {
    document.getElementById('cartCount').innerText = cart.length;
    let total = 0;
    document.getElementById('cartItemsList').innerHTML = cart.map(item => {
        total += item.price;
        return `
            <div style="display:flex; align-items:center; gap:15px; margin-bottom:15px; background:#fff0f3; padding:10px; border-radius:15px">
                <img src="${item.img}" style="width:50px; height:50px; border-radius:8px; object-fit:cover">
                <div style="flex:1">
                    <p style="font-weight:700; font-size:0.85rem">${item.name}</p>
                    <p style="font-weight:700; color:#ff4d6d">₹${item.price}</p>
                </div>
                <i class="fas fa-trash-alt" style="color:#ff4d6d; cursor:pointer" onclick="deleteItem(${item.cartId}, ${item.id})"></i>
            </div>`;
    }).join('');
    document.getElementById('cartTotal').innerText = `₹${total}`;
}

// Search & Filter
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

// Toggle UI
document.getElementById('openCart').onclick = () => document.getElementById('cartSidebar').classList.add('active');
document.getElementById('closeCart').onclick = () => document.getElementById('cartSidebar').classList.remove('active');
document.getElementById('filterBtn').onclick = () => document.getElementById('filterModal').style.display = 'flex';
document.getElementById('closeFilter').onclick = () => document.getElementById('filterModal').style.display = 'none';
document.getElementById('priceRange').oninput = (e) => document.getElementById('priceVal').innerText = e.target.value;

document.getElementById('payNowBtn').onclick = () => {
    if(cart.length === 0) return;
    document.getElementById('finalPaid').innerText = document.getElementById('cartTotal').innerText;
    document.getElementById('successOverlay').style.display = 'flex';
};

initializeStore();