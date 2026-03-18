// ========== INITIALISATION ==========
let produitsIphone = [];
let produitsSamsung = [];
let produitsAccessoires = [];
let tousProduits = [];
let filtresActifs = {
    categorie: 'all',
    recherche: '',
    tri: 'default'
};

// ========== CHARGER LES PRODUITS ==========
function chargerProduits() {
    if (typeof getProduitsIphone !== 'undefined') {
        produitsIphone = getProduitsIphone();
    }
    if (typeof getProduitsSamsung !== 'undefined') {
        produitsSamsung = getProduitsSamsung();
    }
    if (typeof getProduitsAccessoires !== 'undefined') {
        produitsAccessoires = getProduitsAccessoires();
    }
    
    tousProduits = [...produitsIphone, ...produitsSamsung, ...produitsAccessoires];
    afficherProduits();
    mettreAJourCompteurProduits();
    
    console.log('✅ Site chargé avec succès!');
    console.log('📦 Produits chargés:', tousProduits.length);
}

// ========== AFFICHER LES PRODUITS ==========
function afficherProduits() {
    const aucunProduit = document.getElementById('aucunProduit');
    const categories = ['iphone', 'samsung', 'accessoires'];
    let produitsAffiches = 0;
    
    // Afficher chaque catégorie
    produitsAffiches += afficherCategorieIphone();
    produitsAffiches += afficherCategorieSamsung();
    produitsAffiches += afficherCategorieAccessoires();
    
    // Afficher ou masquer le message "aucun produit"
    if (aucunProduit) {
        aucunProduit.style.display = produitsAffiches === 0 ? 'block' : 'none';
    }
    
    // Mettre à jour le compteur
    mettreAJourCompteurProduits(produitsAffiches);
}

function afficherCategorieIphone() {
    const grid = document.getElementById('iphoneGrid');
    const categorie = document.getElementById('iphoneCategorie');
    
    if (!grid) return 0;
    
    // Appliquer les filtres
    let produits = appliquerFiltres(produitsIphone);
    
    if (produits.length === 0) {
        categorie.style.display = 'none';
        return 0;
    }
    
    categorie.style.display = 'block';
    grid.innerHTML = produits.map(produit => creerCarteProduit(produit)).join('');
    return produits.length;
}

function afficherCategorieSamsung() {
    const grid = document.getElementById('samsungGrid');
    const categorie = document.getElementById('samsungCategorie');
    
    if (!grid) return 0;
    
    let produits = appliquerFiltres(produitsSamsung);
    
    if (produits.length === 0) {
        categorie.style.display = 'none';
        return 0;
    }
    
    categorie.style.display = 'block';
    grid.innerHTML = produits.map(produit => creerCarteProduit(produit)).join('');
    return produits.length;
}

function afficherCategorieAccessoires() {
    const grid = document.getElementById('accessoiresGrid');
    const categorie = document.getElementById('accessoiresCategorie');
    
    if (!grid) return 0;
    
    let produits = appliquerFiltres(produitsAccessoires);
    
    if (produits.length === 0) {
        categorie.style.display = 'none';
        return 0;
    }
    
    categorie.style.display = 'block';
    grid.innerHTML = produits.map(produit => creerCarteProduit(produit)).join('');
    return produits.length;
}

// ========== APPLIQUER LES FILTRES ==========
function appliquerFiltres(produits) {
    let resultats = [...produits];
    
    // Filtrer par catégorie (si une catégorie spécifique est sélectionnée)
    if (filtresActifs.categorie !== 'all') {
        // Cette fonction est appelée par catégorie, donc on vérifie si la catégorie correspond
        const categorieMap = {
            'iphone': 'iPhone',
            'samsung': 'Samsung',
            'accessoires': 'Accessoires'
        };
        
        // On ne filtre pas ici car on est déjà dans une catégorie spécifique
        // Le filtrage par catégorie est géré au niveau de l'affichage
    }
    
    // Filtrer par recherche
    if (filtresActifs.recherche) {
        const rechercheLower = filtresActifs.recherche.toLowerCase();
        resultats = resultats.filter(p => 
            p.nom.toLowerCase().includes(rechercheLower) ||
            p.description.toLowerCase().includes(rechercheLower) ||
            (p.specs && Object.values(p.specs).some(val => 
                String(val).toLowerCase().includes(rechercheLower)
            ))
        );
    }
    
    // Trier
    if (filtresActifs.tri === 'price-asc') {
        resultats.sort((a, b) => a.prix - b.prix);
    } else if (filtresActifs.tri === 'price-desc') {
        resultats.sort((a, b) => b.prix - a.prix);
    } else if (filtresActifs.tri === 'rating') {
        resultats.sort((a, b) => b.note - a.note);
    }
    
    return resultats;
}

// ========== METTRE À JOUR LE COMPTEUR ==========
function mettreAJourCompteurProduits(nbAffiches) {
    const compteur = document.getElementById('produitsCount');
    if (compteur) {
        const total = tousProduits.length;
        const affiches = nbAffiches || calculerProduitsAffiches();
        compteur.innerHTML = `${affiches} produit${affiches > 1 ? 's' : ''} sur ${total}`;
    }
}

function calculerProduitsAffiches() {
    let total = 0;
    total += appliquerFiltres(produitsIphone).length;
    total += appliquerFiltres(produitsSamsung).length;
    total += appliquerFiltres(produitsAccessoires).length;
    return total;
}

// ========== RÉINITIALISER LES FILTRES ==========
function resetAllFilters() {
    filtresActifs = {
        categorie: 'all',
        recherche: '',
        tri: 'default'
    };
    
    // Réinitialiser les champs de formulaire
    if (searchInput) searchInput.value = '';
    if (categorySelect) categorySelect.value = 'all';
    if (sortSelect) sortSelect.value = 'default';
    
    afficherProduits();
}

// ========== CRÉER UNE CARTE PRODUIT ==========
function creerCarteProduit(produit) {
    const enStockClass = produit.en_stock ? '' : 'out-of-stock';
    const enStockTexte = produit.en_stock ? 'EN STOCK' : 'RUPTURE';
    
    return `
        <div class="produit-card ${enStockClass}" onclick="ouvrirModal(${produit.id})">
            <div class="produit-stock-badge">${enStockTexte}</div>
            <div class="produit-image">
                <img src="${produit.image}" alt="${produit.nom}" onerror="this.src='assets/placeholder.jpg'">
            </div>
            <h4>${produit.nom}</h4>
            <div class="produit-rating">
                <i class="fas fa-star"></i> ${produit.note} (${produit.avis} avis)
            </div>
            <p class="prix">${produit.prix}$</p>
            <p class="description">${produit.description}</p>
            <button class="btn btn-secondary" onclick="event.stopPropagation(); commanderProduit('${produit.nom}', ${produit.prix})">Commander</button>
        </div>
    `;
}

// ========== MODAL ==========
const modal = document.getElementById('productModal');
const closeBtn = document.querySelector('.close');

function ouvrirModal(produitId) {
    const produit = tousProduits.find(p => p.id === produitId);
    
    if (!produit) return;
    
    document.getElementById('modalImage').src = produit.image;
    document.getElementById('modalNom').textContent = produit.nom;
    document.getElementById('modalPrix').textContent = `${produit.prix}$`;
    document.getElementById('modalDescription').textContent = produit.description;
    
    // Afficher les specs
    const specsDiv = document.getElementById('modalSpecs');
    let specsHTML = '<div class="specs-list">';
    for (let [key, value] of Object.entries(produit.specs)) {
        specsHTML += `<p><strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${Array.isArray(value) ? value.join(', ') : value}</p>`;
    }
    specsHTML += '</div>';
    specsDiv.innerHTML = specsHTML;
    
    modal.style.display = 'block';
    
    // Ajouter l'événement pour le bouton commander du modal
    const modalCommanderBtn = document.querySelector('.modal-actions .btn-primary');
    if (modalCommanderBtn) {
        modalCommanderBtn.onclick = function() {
            commanderProduit(produit.nom, produit.prix);
        };
    }
}

if (closeBtn) {
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }
}

window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// ========== COMMANDE PRODUIT ==========
function commanderProduit(nom, prix) {
    alert(`✅ Produit: ${nom}\n💰 Prix: ${prix}$\n\n📱 iPhone Congo Store - Blanc & Vert\nMerci de votre intérêt! Contactez-nous pour finaliser votre commande.`);
}

// ========== ÉVÉNEMENTS FILTRES ==========
const searchInput = document.getElementById('searchInput');
const categorySelect = document.getElementById('categorySelect');
const sortSelect = document.getElementById('sortSelect');
const resetBtn = document.getElementById('resetFiltres');

// Debounce pour la recherche
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

if (searchInput) {
    searchInput.addEventListener('input', debounce(function(e) {
        filtresActifs.recherche = e.target.value;
        afficherProduits();
    }, 300));
}

if (categorySelect) {
    categorySelect.addEventListener('change', function(e) {
        filtresActifs.categorie = e.target.value;
        afficherProduits();
    });
}

if (sortSelect) {
    sortSelect.addEventListener('change', function(e) {
        filtresActifs.tri = e.target.value;
        afficherProduits();
    });
}

if (resetBtn) {
    resetBtn.addEventListener('click', resetAllFilters);
}

// ========== MENU MOBILE ==========
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', function() {
        const isExpanded = navLinks.style.display === 'flex';
        navLinks.style.display = isExpanded ? 'none' : 'flex';
        hamburger.setAttribute('aria-expanded', !isExpanded);
        
        if (!isExpanded) {
            navLinks.style.position = 'absolute';
            navLinks.style.top = '70px';
            navLinks.style.left = '0';
            navLinks.style.right = '0';
            navLinks.style.flexDirection = 'column';
            navLinks.style.background = 'var(--white)';
            navLinks.style.gap = '0';
            navLinks.style.zIndex = '99';
            navLinks.style.boxShadow = 'var(--shadow-md)';
            navLinks.style.padding = '20px';
            
            const links = navLinks.querySelectorAll('a');
            links.forEach(link => {
                link.style.color = 'var(--dark-color)';
                link.style.padding = '15px';
                link.style.borderBottom = '1px solid var(--border-color)';
            });
        }
    });
}

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function() {
        if (navLinks) navLinks.style.display = 'none';
    });
});

// ========== FORMULAIRE DE CONTACT ==========
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nom = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const tel = this.querySelector('input[type="tel"]').value;
        const sujet = this.querySelector('select').value;
        
        alert(`✅ Merci ${nom}!\n\n📧 Email: ${email}\n📞 Téléphone: ${tel}\n📝 Sujet: ${sujet}\n\nVotre message a été envoyé avec succès.\nNous vous répondrons dans les 24h.`);
        
        this.reset();
    });
}

// ========== INITIALISATION AU CHARGEMENT ==========
window.addEventListener('load', function() {
    chargerProduits();
    
    // Animation smooth scroll pour les ancres
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
    
    console.log('🍃 iPhone Congo Store - Version Blanc & Vert avec Filtres intégrés');
});
