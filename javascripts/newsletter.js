// Configuration Firebase
const firebaseConfig = {
  apiKey: "VOTRE_API_KEY",
  authDomain: "VOTRE_PROJECT_ID.firebaseapp.com",
  projectId: "VOTRE_PROJECT_ID",
  storageBucket: "VOTRE_PROJECT_ID.appspot.com",
  messagingSenderId: "VOTRE_MESSAGING_SENDER_ID",
  appId: "VOTRE_APP_ID"
};

// Initialiser Firebase seulement si ce n'est pas déjà fait
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

// ===================================================================
// 📰 GESTION DE LA NEWSLETTER
// ===================================================================

document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (!newsletterForm) {
        console.warn('Formulaire newsletter non trouvé');
        return;
    }
    
    newsletterForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value.trim().toLowerCase();
        const submitBtn = this.querySelector('button[type="submit"]');
        
        // Validation de l'email
        if (!isValidEmail(email)) {
            showNewsletterMessage('Veuillez entrer une adresse email valide.', 'error');
            return;
        }
        
        // Animation du bouton
        const originalText = submitBtn.textContent;
        const originalBg = submitBtn.style.backgroundColor;
        submitBtn.textContent = 'Inscription en cours...';
        submitBtn.disabled = true;
        submitBtn.style.cursor = 'wait';
        
        try {
            // Vérifier si l'email existe déjà
            const emailQuery = await db.collection('newsletter')
                .where('email', '==', email)
                .limit(1)
                .get();
            
            if (!emailQuery.empty) {
                // Email déjà inscrit
                const existingDoc = emailQuery.docs[0].data();
                
                if (existingDoc.status === 'active') {
                    showNewsletterMessage('Vous êtes déjà inscrit à notre newsletter ! 📧', 'info');
                } else if (existingDoc.status === 'unsubscribed') {
                    // Réactiver l'abonnement
                    await emailQuery.docs[0].ref.update({
                        status: 'active',
                        resubscribedAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                    
                    showNewsletterMessage('Bienvenue à nouveau dans la Level Up News ! 🎉', 'success');
                    submitBtn.textContent = '✓ Réinscrit !';
                    submitBtn.style.backgroundColor = '#4CAF50';
                }
                
                emailInput.value = '';
                
            } else {
                // Nouvelle inscription
                await db.collection('newsletter').add({
                    email: email,
                    subscribedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    status: 'active',
                    source: 'footer',
                    userAgent: navigator.userAgent,
                    language: navigator.language || 'fr',
                    referrer: document.referrer || 'direct'
                });
                
                // Succès
                submitBtn.textContent = '✓ Inscrit !';
                submitBtn.style.backgroundColor = '#4CAF50';
                emailInput.value = '';
                
                showNewsletterMessage('Bienvenue dans la Level Up News ! 🚀 Merci de votre confiance.', 'success');
                
                // Analytics (si Google Analytics est configuré)
                trackNewsletterSubscription(email);
                
                // Notification admin (optionnel - nécessite une function)
                notifyAdminNewSubscriber(email);
            }
            
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
            
            let errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
            
            // Messages d'erreur personnalisés
            if (error.code === 'permission-denied') {
                errorMessage = 'Erreur de permission. Contactez le support.';
            } else if (error.code === 'unavailable') {
                errorMessage = 'Service temporairement indisponible. Réessayez dans quelques instants.';
            } else if (error.code === 'failed-precondition') {
                errorMessage = 'Erreur de configuration. Contactez l\'administrateur.';
            }
            
            showNewsletterMessage(errorMessage, 'error');
            submitBtn.textContent = originalText;
            submitBtn.style.backgroundColor = originalBg;
        } finally {
            // Réinitialiser le bouton après 3 secondes
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.cursor = 'pointer';
                submitBtn.style.backgroundColor = originalBg;
            }, 3000);
        }
    });
});

// ===================================================================
// 🛠️ FONCTIONS UTILITAIRES
// ===================================================================

/**
 * Valide le format d'un email
 */
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email) && email.length <= 100;
}

/**
 * Affiche un message de retour utilisateur
 */
function showNewsletterMessage(message, type) {
    // Supprimer les anciens messages
    const existingMessage = document.querySelector('.newsletter-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Créer le nouveau message
    const messageDiv = document.createElement('div');
    messageDiv.className = `newsletter-message newsletter-message--${type}`;
    
    // Icônes selon le type
    const icons = {
        success: '✓',
        error: '⚠',
        info: 'ℹ',
        warning: '⚡'
    };
    
    messageDiv.innerHTML = `
        <span class="message-icon">${icons[type] || 'ℹ'}</span>
        <span class="message-text">${message}</span>
    `;
    
    // Insérer après le formulaire
    const form = document.getElementById('newsletterForm');
    form.parentNode.insertBefore(messageDiv, form.nextSibling);
    
    // Animation d'entrée
    setTimeout(() => {
        messageDiv.classList.add('show');
    }, 10);
    
    // Retrait automatique après 5 secondes
    setTimeout(() => {
        messageDiv.classList.add('fade-out');
        setTimeout(() => {
            messageDiv.remove();
        }, 300);
    }, 5000);
}

/**
 * Track l'inscription dans Google Analytics (si configuré)
 */
function trackNewsletterSubscription(email) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', 'newsletter_subscription', {
            'event_category': 'engagement',
            'event_label': 'footer_newsletter',
            'value': 1
        });
    }
    
    // Google Analytics Universal
    if (typeof ga !== 'undefined') {
        ga('send', 'event', 'Newsletter', 'Subscribe', 'Footer');
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Subscribe', {
            value: 0,
            currency: 'EUR',
            predicted_ltv: 0
        });
    }
    
    console.log('✅ Nouvelle inscription newsletter:', email);
}

/**
 * Notifie l'admin d'une nouvelle inscription (nécessite Firebase Functions)
 */
async function notifyAdminNewSubscriber(email) {
    try {
        // Cette partie nécessite une Cloud Function
        // Pour l'instant, on log simplement
        console.log('📧 Nouvel abonné à notifier:', email);
        
        // Si vous avez configuré Firebase Functions:
        /*
        await fetch('https://VOTRE_REGION-VOTRE_PROJECT_ID.cloudfunctions.net/notifyNewSubscriber', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email })
        });
        */
    } catch (error) {
        // Erreur silencieuse, ne pas impacter l'utilisateur
        console.warn('Impossible de notifier l\'admin:', error);
    }
}

// ===================================================================
// 🎨 ANIMATIONS ET INTERACTIONS SUPPLÉMENTAIRES
// ===================================================================

// Animation au focus de l'input email
document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.querySelector('#newsletterForm input[type="email"]');
    
    if (emailInput) {
        emailInput.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        emailInput.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    }
});

// Empêcher le spam (limitation de tentatives)
let subscriptionAttempts = 0;
const MAX_ATTEMPTS = 3;
const ATTEMPT_RESET_TIME = 60000; // 1 minute

function checkSubscriptionLimit() {
    if (subscriptionAttempts >= MAX_ATTEMPTS) {
        showNewsletterMessage('Trop de tentatives. Veuillez patienter 1 minute.', 'warning');
        return false;
    }
    
    subscriptionAttempts++;
    
    setTimeout(() => {
        subscriptionAttempts = Math.max(0, subscriptionAttempts - 1);
    }, ATTEMPT_RESET_TIME);
    
    return true;
}
// Animation d'entrée au scroll
document.addEventListener('DOMContentLoaded', function() {
    const newsletter = document.querySelector('.newsletter');
    
    if (newsletter) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'slideInUp 0.6s ease-out';
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(newsletter);
    }
});

// Effet de typing pour le placeholder
const emailInput = document.querySelector('#newsletterForm input[type="email"]');
if (emailInput) {
    const placeholders = [
        'ton@email.com',
        'hello@exemple.fr',
        'contact@startup.io'
    ];
    
    let currentPlaceholder = 0;
    
    setInterval(() => {
        if (!emailInput.value && document.activeElement !== emailInput) {
            currentPlaceholder = (currentPlaceholder + 1) % placeholders.length;
            emailInput.placeholder = placeholders[currentPlaceholder];
        }
    }, 3000);
}

// Effet de confetti au succès
function showConfetti() {
    const newsletter = document.querySelector('.newsletter');
    const colors = ['#4ade80', '#60a5fa', '#f87171', '#fbbf24', '#a78bfa'];
    
    for (let i = 0; i < 15; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '50%';
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '1000';
        confetti.style.animation = `confetti ${1 + Math.random()}s ease-out forwards`;
        
        newsletter.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 1500);
    }
}

// Appelez showConfetti() dans la fonction de succès
// Modifiez la partie succès dans newsletter.js :
/*
showNewsletterMessage('Bienvenue dans la Level Up News ! 🚀 Merci de votre confiance.', 'success');
showConfetti(); // Ajoutez cette ligne
*/