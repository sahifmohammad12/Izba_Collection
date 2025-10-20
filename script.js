// Global variables
let products = [];
let currentFilter = 'all';
const ADMIN_PASSWORD = 'izba2025'; // Simple password for demo purposes

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    renderProducts();
    setupEventListeners();
    setupMobileMenu();
});

// Load products from localStorage
function loadProducts() {
    const savedProducts = localStorage.getItem('izbaProducts');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    } else {
        // Default products
        products = [
            {
                id: 1,
                name: "Professional Blazer",
                price: 1899,
                category: "clothing",
                description: "Tailored blazer in premium wool blend. Perfect for business meetings and professional events. Features structured shoulders and clean lines.",
                image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop"
            },
            {
                id: 2,
                name: "Classic Pearl Necklace",
                price: 899,
                category: "jewelry",
                description: "Sophisticated pearl necklace with 14k gold accents. Timeless piece that complements both professional and evening attire.",
                image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop"
            },
            {
                id: 3,
                name: "Executive Leather Handbag",
                price: 2499,
                category: "accessories",
                description: "Premium leather handbag with multiple compartments and laptop sleeve. Designed for the modern professional woman.",
                image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop"
            },
            {
                id: 4,
                name: "Cashmere Wrap",
                price: 1599,
                category: "accessories",
                description: "Luxurious cashmere wrap in neutral tones. Perfect for layering over business attire or evening wear.",
                image: "https://images.unsplash.com/photo-1583391733956-6c78276477e1?w=400&h=400&fit=crop"
            },
            {
                id: 5,
                name: "Silk Blouse",
                price: 1299,
                category: "clothing",
                description: "Elegant silk blouse with subtle detailing. Versatile piece that transitions seamlessly from office to evening events.",
                image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop"
            },
            {
                id: 6,
                name: "Diamond Stud Earrings",
                price: 1999,
                category: "jewelry",
                description: "Classic diamond stud earrings in 14k white gold. Understated elegance for any professional or social occasion.",
                image: "https://images.unsplash.com/photo-1535632066927-ab7c9f609a8b?w=400&h=400&fit=crop"
            }
        ];
        saveProducts();
    }
}

// Save products to localStorage
function saveProducts() {
    localStorage.setItem('izbaProducts', JSON.stringify(products));
}

// Setup event listeners
function setupEventListeners() {
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Update current filter
            currentFilter = this.dataset.category;
            // Re-render products
            renderProducts();
        });
    });

    // Admin login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const password = document.getElementById('adminPassword').value;
            if (password === ADMIN_PASSWORD) {
                document.getElementById('adminAuth').style.display = 'none';
                document.getElementById('adminPanel').style.display = 'block';
                document.getElementById('adminPassword').value = '';
            } else {
                alert('Incorrect password. Please try again.');
            }
        });
    }

    // Product form
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addProduct();
        });
    }

    // Image upload functionality
    const imageFileInput = document.getElementById('productImageFile');
    const imagePreview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    const removeImageBtn = document.getElementById('removeImage');
    const imageUrlInput = document.getElementById('productImageUrl');

    console.log('Image upload elements:', {
        imageFileInput,
        imagePreview,
        previewImg,
        removeImageBtn,
        imageUrlInput
    });

    if (imageFileInput) {
        console.log('Setting up file input listener');
        imageFileInput.addEventListener('change', function(e) {
            console.log('File input changed');
            const file = e.target.files[0];
            if (file) {
                console.log('File selected:', file.name);
                // Clear URL input when file is selected
                if (imageUrlInput) imageUrlInput.value = '';
                
                // Show preview
                const reader = new FileReader();
                reader.onload = function(e) {
                    console.log('File read successfully');
                    previewImg.src = e.target.result;
                    imagePreview.style.display = 'flex';
                };
                reader.readAsDataURL(file);
            }
        });
    } else {
        console.log('Image file input not found!');
    }

    if (removeImageBtn) {
        removeImageBtn.addEventListener('click', function() {
            imageFileInput.value = '';
            imagePreview.style.display = 'none';
            previewImg.src = '';
        });
    }

    // Clear file input when URL is entered
    if (imageUrlInput) {
        imageUrlInput.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                imageFileInput.value = '';
                imagePreview.style.display = 'none';
                previewImg.src = '';
            }
        });
    }

    // Contact form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Create FormData
            const formData = new FormData(this);
            
            // Submit to Formspree
            fetch('https://formspree.io/f/xpwnqkqv', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    alert('Thank you for your message! We will get back to you soon.');
                    this.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            })
            .catch(error => {
                alert('Sorry, there was an error sending your message. Please try again or contact us directly at sahifmohammad12@gmail.com');
            })
            .finally(() => {
                // Reset button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        });
    }
}

// Setup mobile menu
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Render products based on current filter
function renderProducts() {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;

    let filteredProducts = products;
    if (currentFilter !== 'all') {
        filteredProducts = products.filter(product => product.category === currentFilter);
    }

    if (filteredProducts.length === 0) {
        productGrid.innerHTML = '<div class="no-products"><h3>No products found in this category.</h3></div>';
        return;
    }

    productGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="product-image" onclick="openImageModal('${product.image}', '${product.name}', ${product.price})">
                ${product.image ? `<img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div style="display: none; width: 100%; height: 100%; align-items: center; justify-content: center; color: white; font-size: 3rem;">
                    <i class="fas fa-image"></i>
                </div>` : `<i class="fas fa-image"></i>`}
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">₹${product.price}</p>
                <p class="product-description">${product.description}</p>
                <span class="product-category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</span>
            </div>
        </div>
    `).join('');
}

// Add new product
function addProduct() {
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const category = document.getElementById('productCategory').value;
    const description = document.getElementById('productDescription').value;
    const imageFile = document.getElementById('productImageFile').files[0];
    const imageUrl = document.getElementById('productImageUrl').value;

    if (!name || !price || !category || !description) {
        alert('Please fill in all required fields.');
        return;
    }

    if (!imageFile && !imageUrl) {
        alert('Please either upload an image file or provide an image URL.');
        return;
    }

    let imageSource = '';
    
    if (imageFile) {
        // Convert file to base64 data URL
        const reader = new FileReader();
        reader.onload = function(e) {
            imageSource = e.target.result;
            addProductWithImage(name, price, category, description, imageSource);
        };
        reader.readAsDataURL(imageFile);
    } else {
        // Use URL
        imageSource = imageUrl;
        addProductWithImage(name, price, category, description, imageSource);
    }
}

// Helper function to add product with image
function addProductWithImage(name, price, category, description, imageSource) {
    const newProduct = {
        id: Date.now(), // Simple ID generation
        name: name,
        price: price,
        category: category,
        description: description,
        image: imageSource
    };

    products.push(newProduct);
    saveProducts();
    renderProducts();
    renderAdminProducts();
    
    // Reset form
    document.getElementById('productForm').reset();
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('previewImg').src = '';
    
    alert('Product added successfully!');
}

// Delete product
function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(product => product.id !== id);
        saveProducts();
        renderProducts();
        renderAdminProducts();
        alert('Product deleted successfully!');
    }
}

// Render admin products list
function renderAdminProducts() {
    const adminProductList = document.getElementById('adminProductList');
    if (!adminProductList) return;

    if (products.length === 0) {
        adminProductList.innerHTML = '<p>No products added yet.</p>';
        return;
    }

    adminProductList.innerHTML = products.map(product => `
        <div class="admin-product-item">
            <div class="admin-product-info">
                <h5>${product.name}</h5>
                <p><strong>Price:</strong> ₹${product.price}</p>
                <p><strong>Category:</strong> ${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
                <p><strong>Description:</strong> ${product.description.substring(0, 50)}${product.description.length > 50 ? '...' : ''}</p>
            </div>
            <button class="delete-btn" onclick="deleteProduct(${product.id})">Delete</button>
        </div>
    `).join('');
}

// Toggle admin panel
function toggleAdminPanel() {
    const modal = document.getElementById('adminModal');
    if (modal) {
        modal.style.display = 'block';
        // Reset admin panel state
        document.getElementById('adminAuth').style.display = 'block';
        document.getElementById('adminPanel').style.display = 'none';
        document.getElementById('adminPassword').value = '';
        // Load admin products
        renderAdminProducts();
    }
}

// Close admin panel
function closeAdminPanel() {
    const modal = document.getElementById('adminModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Image Modal Functions
function openImageModal(imageSrc, productName, productPrice) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalProductName = document.getElementById('modalProductName');
    const modalProductPrice = document.getElementById('modalProductPrice');
    
    modalImage.src = imageSrc;
    modalProductName.textContent = productName;
    modalProductPrice.textContent = `₹${productPrice}`;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// Close modal when clicking outside the image
function closeImageModalOnClick(event) {
    const modal = document.getElementById('imageModal');
    if (event.target === modal) {
        closeImageModal();
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const adminModal = document.getElementById('adminModal');
    const imageModal = document.getElementById('imageModal');
    
    if (event.target === adminModal) {
        closeAdminPanel();
    }
    
    if (event.target === imageModal) {
        closeImageModal();
    }
});

// Image modal event listeners
document.addEventListener('DOMContentLoaded', function() {
    const closeImageModalBtn = document.getElementById('closeImageModal');
    if (closeImageModalBtn) {
        closeImageModalBtn.addEventListener('click', closeImageModal);
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const imageModal = document.getElementById('imageModal');
            if (imageModal && imageModal.style.display === 'block') {
                closeImageModal();
            }
        }
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to navbar
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 182, 193, 0.95)';
        navbar.style.backdropFilter = 'blur(25px)';
        navbar.style.webkitBackdropFilter = 'blur(25px)';
        navbar.style.borderBottom = '1px solid rgba(255, 192, 203, 0.4)';
        navbar.style.boxShadow = '0 8px 32px rgba(255, 182, 193, 0.4)';
    } else {
        navbar.style.background = 'rgba(255, 182, 193, 0.9)';
        navbar.style.backdropFilter = 'blur(15px)';
        navbar.style.webkitBackdropFilter = 'blur(15px)';
        navbar.style.borderBottom = '1px solid rgba(255, 192, 203, 0.3)';
        navbar.style.boxShadow = '0 4px 20px rgba(255, 182, 193, 0.3)';
    }
});

// Add loading animation
function showLoading() {
    const productGrid = document.getElementById('productGrid');
    if (productGrid) {
        productGrid.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading products...</div>';
    }
}

// Add some sample products if none exist
if (products.length === 0) {
    loadProducts();
    saveProducts();
}
