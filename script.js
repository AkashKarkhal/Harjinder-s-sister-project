let products = [];
let cart = [];

// 100% MANUAL LOCAL COLLECTION - Pointing to your local 'images/' folder
// Make sure your filenames in the images folder match these exactly (e.g., claw1.png)
const manualAccessories = [
    // CLAWS (9 items)
    { id: 1, name: "Marble Matte Claw Clip", price: 299, cat: "Claws", stock: 50, img: "images/claw1.jpeg" },
    { id: 2, name: "Large Acetate Claw", price: 350, cat: "Claws", stock: 50, img: "images/claw2.jpeg" },
    { id: 3, name: "Golden Metal Clutch", price: 499, cat: "Claws", stock: 50, img: "images/claw3.jpeg" },
    { id: 4, name: "Floral Resin Claw", price: 250, cat: "Claws", stock: 50, img: "images/claw4.jpeg" },
    { id: 5, name: "Minimalist Square Claw", price: 199, cat: "Claws", stock: 50, img: "images/claw5.jpeg" },
    { id: 6, name: "Pearl Encrusted Claw", price: 550, cat: "Claws", stock: 50, img: "images/claw6.jpeg" },
    { id: 7, name: "Tortoise Shell Claw", price: 320, cat: "Claws", stock: 50, img: "images/claw7.jpeg" },
    { id: 8, name: "Butterfly Wing Clip", price: 280, cat: "Claws", stock: 50, img: "images/claw8.jpeg" },
    { id: 9, name: "Mini Pastel Claws Set", price: 150, cat: "Claws", stock: 50, img: "images/claw9.jpeg" },

    // PINS (8 items)
    { id: 10, name: "Gold Floral Hair Pin", price: 250, cat: "Pins", stock: 50, img: "images/pin1.jpeg" },
    { id: 11, name: "Crystal Star Pin Set", price: 180, cat: "Pins", stock: 50, img: "images/pin2.jpeg" },
    { id: 12, name: "Vintage Emerald Bobby", price: 299, cat: "Pins", stock: 50, img: "images/pin3.jpeg" },
    { id: 13, name: "Pearl Bobby Pin Duo", price: 120, cat: "Pins", stock: 50, img: "images/pin4.jpeg" },
    { id: 14, name: "Bridal Crystal Comb", price: 899, cat: "Pins", stock: 50, img: "images/pin5.jpeg" },
    { id: 15, name: "Silver Leaf Pins", price: 350, cat: "Pins", stock: 50, img: "images/pin6.jpeg" },
    { id: 16, name: "Rhinestone Side Pin", price: 450, cat: "Pins", stock: 50, img: "images/pin7.jpeg" },
    { id: 17, name: "Geometric Gold Slide", price: 210, cat: "Pins", stock: 50, img: "images/pin8.jpeg" },

    // SCRUNCHIES (8 items)
    { id: 18, name: "Silk Satin Rubber Band", price: 150, cat: "Scrunchies", stock: 50, img: "images/band1.jpeg" },
    { id: 19, name: "Velvet Ribbon Rubber Band", price: 220, cat: "Scrunchies", stock: 50, img: "images/band2.jpeg" },
    { id: 20, name: "Organza Glow Rubber Band", price: 180, cat: "Scrunchies", stock: 50, img: "images/band3.jpeg" },
    { id: 21, name: "Floral Print Rubber Band", price: 130, cat: "Scrunchies", stock: 50, img: "images/band4.jpeg" },
    { id: 22, name: "Oversized Linen Rubber Band", price: 290, cat: "Scrunchies", stock: 50, img: "images/band5.jpeg" },
    { id: 23, name: "Glitter Party Rubber Band", price: 199, cat: "Scrunchies", stock: 50, img: "images/band6.jpeg" },
    { id: 24, name: "Polka Dot Rubber Band", price: 140, cat: "Scrunchies", stock: 50, img: "images/band7.jpeg" },
    { id: 25, name: "Solid Pastel Rubber Band", price: 99, cat: "Scrunchies", stock: 50, img: "images/band8.jpeg" }
];

function initializeStore() {
    products = [...manualAccessories]; 
    renderProducts(products);
    document.getElementById('itemCount').innerText = `${products.length} Items Total`;
}

function renderProducts(data) {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = data.map(p => `
        <div class="product-card">
            <span class="stock-tag">${p.stock} In Stock</span>
            <div class="img-container">
                <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/300?text=Image+Missing'">
            </div>
            <div class="card-info">
                <span style="color:#ff85a2; font-size:0.7rem; font-weight:700">${p.cat.toUpperCase()}</span>
                <h3 style="font-family:'Playfair Display'; margin:10px 0; font-size:1.1rem">${p.name}</h3>
                <p class="card-price">₹${p.price}</p>
                <div style="display:flex; gap:10px; margin-top:20px">
                    <button class="pay-button" style="margin:0; flex:2; padding:12px;" onclick="buyNow(${p.id})">Buy Now</button>
                    <button style="flex:1; background:#fff0f3; color:#ff4d6d; border-radius:12px;" onclick="addToCart(${p.id})"><i class="fas fa-plus"></i></button>
                </div>
            </div>
        </div>
    `).join('');
}

// Cart Logic
function addToCart(id) {
    const item = products.find(i => i.id === id);
    if(item.stock > 0) {
        cart.push({...item, cartId: Date.now()});
        item.stock--; 
        updateCartUI();
        renderProducts(products); // Refresh stock labels
        document.getElementById('cartSidebar').classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        alert("Sorry, this item is out of stock!");
    }
}

function buyNow(id) {
    cart = []; // Clear current cart for exclusive purchase
    addToCart(id);
}

function deleteItem(cartId, originalId) {
    cart = cart.filter(item => item.cartId !== cartId);
    const original = products.find(i => i.id === originalId);
    original.stock++; // Restore stock count
    updateCartUI();
    renderProducts(products);
}

function updateCartUI() {
    document.getElementById('cartCount').innerText = cart.length;
    let total = 0;
    document.getElementById('cartItemsList').innerHTML = cart.map(item => {
        total += item.price;
        return `
            <div class="cart-item" style="display:flex; align-items:center; gap:15px; margin-bottom:15px; background:#fff0f3; padding:10px; border-radius:15px">
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

// Filter and Search functionality
document.getElementById('searchBar').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(term));
    renderProducts(filtered);
});

document.querySelectorAll('.tag').forEach(tag => {
    tag.onclick = () => {
        document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
    };
});

document.getElementById('applyFilter').onclick = () => {
    const max = parseFloat(document.getElementById('priceRange').value);
    const activeTag = document.querySelector('.tag.active');
    const cat = activeTag ? activeTag.dataset.cat : 'all';
    
    const filtered = products.filter(p => (cat === 'all' || p.cat === cat) && p.price <= max);
    renderProducts(filtered);
    document.getElementById('filterModal').style.display = 'none';
};

// UI Triggers
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
};

initializeStore();