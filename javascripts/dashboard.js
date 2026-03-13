// ===================================================================
// 📁 /javascripts/dashboard.js - VERSION COMPLÈTE SANS ERREUR
// ===================================================================

import { 
    auth, 
    db,
    storage,
    onAuthStateChanged, 
    signOut,
    updateProfile,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    onSnapshot,
    collection,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    addDoc,
    serverTimestamp,
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from "./firebaseClient.js";
// ===================================================================
// 🎯 GLOBAL STATE
// ===================================================================

let currentUser = null;
let userData = null;
let isAdmin = false;
let notifications = [];
let chatMessages = [];
let unreadNotifications = 0;
let unreadMessages = 0;
let unsubscribeTimeline = null; 

// ===================================================================
// 📊 DEFAULT DATA
// ===================================================================

const defaultSteps = [
    { id: 'design', title: 'Design UI/UX', description: 'Création de la maquette et du design visuel', status: 'todo', date: null },
    { id: 'mockup', title: 'Maquette', description: 'Validation du prototype interactif', status: 'todo', date: null },
    { id: 'development', title: 'Développement', description: 'Développement du site web', status: 'todo', date: null },
    { id: 'seo', title: 'SEO', description: 'Optimisation pour les moteurs de recherche', status: 'todo', date: null },
    { id: 'launch', title: 'Mise en ligne', description: 'Déploiement et mise en production', status: 'todo', date: null }
];

const availableFormations = [
    { id: 'html', title: 'HTML', icon: '📄', totalModules: 10, description: 'Apprenez les bases du HTML' },
    { id: 'css', title: 'CSS', icon: '🎨', totalModules: 12, description: 'Maîtrisez le design CSS' },
    { id: 'javascript', title: 'JavaScript', icon: '⚡', totalModules: 15, description: 'Programmation JavaScript' },
    { id: 'webdev', title: 'Web Development Complet', icon: '🚀', totalModules: 40, description: 'Formation complète développement web' }
];

const availableBadges = [
    { id: 'first-step', title: 'Premier Pas', icon: '👶', description: 'Première étape validée', xp: 10 },
    { id: 'half-done', title: 'Mi-Parcours', icon: '🎯', description: '50% du projet complété', xp: 50 },
    { id: 'almost-there', title: 'Presque là', icon: '🔥', description: '75% du projet complété', xp: 75 },
    { id: 'completed', title: 'Projet Terminé', icon: '🏆', description: 'Projet 100% complété', xp: 100 },
    { id: 'first-formation', title: 'Étudiant', icon: '📚', description: 'Première formation commencée', xp: 20 },
    { id: 'formation-master', title: 'Maître', icon: '🎓', description: 'Formation complétée', xp: 100 },
    { id: 'early-adopter', title: 'Early Adopter', icon: '⭐', description: 'Parmi les premiers clients', xp: 50 },
    { id: 'referrer', title: 'Ambassadeur', icon: '🎁', description: 'Premier parrainage réussi', xp: 30 }
];

// ===================================================================
// 🎨 DOM ELEMENTS
// ===================================================================

const loading = document.getElementById('loading');
const mainContent = document.getElementById('mainContent');
const toggleSidebarBtn = document.getElementById("toggleSidebar");
const sidebar = document.querySelector(".sidebar");
const topbarPhoto = document.getElementById('topbarPhoto');
const topbarName = document.getElementById('topbarName');
const profilePhoto = document.getElementById('profilePhoto');
const photoInput = document.getElementById('photoInput');
const photoContainer = document.querySelector('.profile-photo-container');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const projectName = document.getElementById('projectName');
const globalProgress = document.getElementById('globalProgress');
const progressFill = document.getElementById('progressFill');
const stepsContainer = document.getElementById('stepsContainer');
const formationsContainer = document.getElementById('formationsContainer');
const adminBadge = document.getElementById('adminBadge');
const logoutBtn = document.getElementById('logoutBtn');
const themeToggle = document.getElementById('themeToggle');
const notificationsBtn = document.getElementById('notificationsBtn');
const notificationsPanel = document.getElementById('notificationsPanel');
const closeNotifications = document.getElementById('closeNotifications');
const notificationsList = document.getElementById('notificationsList');
const recentNotifsList = document.getElementById('recentNotifsList');
const chatTrigger = document.getElementById('chatTrigger');
const chatWindow = document.getElementById('chatWindow');
const closeChat = document.getElementById('closeChat');
const chatMessages_el = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatBadge = document.getElementById('chatBadge');
const editProfileBtn = document.getElementById('editProfileBtn');
const editProfileModal = document.getElementById('editProfileModal');
const timelineContainer = document.getElementById('timelineContainer');
const documentsContainer = document.getElementById('documentsContainer');
const roadmapContainer = document.getElementById('roadmapContainer');
const badgesContainer = document.getElementById('badgesContainer');
const referralCode = document.getElementById('referralCode');
const copyReferralCode = document.getElementById('copyReferralCode');
const timelineLoader = document.getElementById('timelineLoader');
const timelineError = document.getElementById('timelineError');
const timelineErrorMessage = document.getElementById('timelineErrorMessage');
const timelineRetry = document.getElementById('timelineRetry');
const timelineEmpty = document.getElementById('timelineEmpty');

// Stats elements
const statLevel = document.getElementById('statLevel');
const statPoints = document.getElementById('statPoints');
const statBadges = document.getElementById('statBadges');
const statDaysElapsed = document.getElementById('statDaysElapsed');
const statDaysRemaining = document.getElementById('statDaysRemaining');
const statStepsCompleted = document.getElementById('statStepsCompleted');
const statFormationsProgress = document.getElementById('statFormationsProgress');
const userLevelDisplay = document.getElementById('userLevelDisplay');
const levelProgressFill = document.getElementById('levelProgressFill');
const currentXP = document.getElementById('currentXP');
const nextLevelXP = document.getElementById('nextLevelXP');
const referralCount = document.getElementById('referralCount');
const referralEarnings = document.getElementById('referralEarnings');

// ===================================================================
// 🔐 AUTHENTICATION
// ===================================================================

onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("✅ User connecté:", user.email);
        currentUser = user;
        await loadUserData(user.uid);
        initializeDashboard();
        hideLoading();
    } else {
        console.log("❌ User non connecté, redirection...");
        window.location.href = './login.html';
    }
});

// ===================================================================
// 📊 LOAD USER DATA
// ===================================================================

async function loadUserData(userId) {
    try {
        console.log("📊 Chargement données user:", userId);
        
        const userDocRef = doc(db, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            userData = userDocSnap.data();
            console.log("✅ Données user chargées:", userData);
        } else {
            console.log("📝 Création nouveau document user...");
            
            const now = new Date();
            const initialTimeline = [{
                title: 'Compte créé',
                description: 'Bienvenue sur votre dashboard !',
                status: 'done',
                date: now.toISOString(),
                timestamp: now.getTime()
            }];
            
            userData = {
                name: currentUser.displayName || currentUser.email.split('@')[0],
                email: currentUser.email,
                photoURL: currentUser.photoURL || null,
                projectName: 'Nouveau projet',
                projectDescription: '',
                projectStartDate: now,
                projectEndDate: null,
                siteUrl: '',
                steps: defaultSteps,
                formations: [],
                documents: [],
                timeline: initialTimeline,
                level: 1,
                xp: 0,
                earnedBadges: [],
                referralCode: generateReferralCode(),
                referrals: [],
                createdAt: now
            };
            
            await setDoc(userDocRef, userData);
            console.log("✅ Document user créé avec timeline initiale");
        }

        // Initialize missing fields
        if (!userData.level) userData.level = 1;
        if (!userData.xp) userData.xp = 0;
        if (!userData.earnedBadges) userData.earnedBadges = [];
        if (!userData.referralCode) {
            userData.referralCode = generateReferralCode();
            await updateDoc(userDocRef, { referralCode: userData.referralCode });
        }
        if (!userData.referrals) userData.referrals = [];
        if (!userData.timeline) userData.timeline = [];
        if (!userData.documents) userData.documents = [];
        if (!userData.projectStartDate) userData.projectStartDate = new Date();
        if (!userData.steps || userData.steps.length === 0) {
            userData.steps = defaultSteps;
            await updateDoc(userDocRef, { steps: defaultSteps });
        }
        if (!userData.siteUrl) userData.siteUrl = '';

    } catch (error) {
        console.error('❌ Error loading user data:', error);
        alert('Erreur lors du chargement des données. Vérifiez la console (F12)');
    }
}

// ===================================================================
// 🎨 INITIALIZE DASHBOARD
// ===================================================================

function initializeDashboard() {
    console.log('🚀 Initialisation dashboard...');
    
    displayProfile();
    renderSteps();
    renderFormations();
    loadTimelineRealtime(); 
    renderDocuments();
    renderRoadmap();
    renderBadges();
    renderNotifications();
    calculateGlobalProgress();
    calculateStats();
    setupEventListeners();
    loadNotifications();
    loadChatMessages();
    renderProjectInfo(); 
    renderValidationItems(); 
    setupPreview();
    
    // Vérification après initialisation
    setTimeout(verifyTimelineSetup, 1000);
    
}
// ===================================================================
// 📅 TIMELINE - SYSTÈME COMPLET
// ===================================================================

// Configuration des statuts
const STATUS_CONFIG = {
    'done': {
        icon: '✅',
        label: 'Terminé',
        color: '#10b981'
    },
    'in-progress': {
        icon: '⚡',
        label: 'En cours',
        color: '#f59e0b'
    },
    'todo': {
        icon: '📌',
        label: 'À faire',
        color: '#6b7280'
    }
};

// ===================================================================
// 🔄 CHARGEMENT TEMPS RÉEL
// ===================================================================

function loadTimelineRealtime() {
    console.log('📊 [TIMELINE] Initialisation...');
    
    // Vérifier l'utilisateur
    if (!currentUser) {
        console.error('❌ [TIMELINE] Utilisateur non connecté');
        showTimelineError('Vous devez être connecté');
        return;
    }

    console.log('✅ [TIMELINE] User ID:', currentUser.uid);
    showTimelineLoader();

    // Nettoyer l'ancien listener
    if (unsubscribeTimeline) {
        console.log('🧹 [TIMELINE] Nettoyage ancien listener');
        unsubscribeTimeline();
        unsubscribeTimeline = null;
    }

    // Référence Firestore
    const userRef = doc(db, 'users', currentUser.uid);

    // 🔥 Écoute en temps réel
    unsubscribeTimeline = onSnapshot(
        userRef,
        
        // ✅ Succès
        (docSnapshot) => {
            console.log('📥 [TIMELINE] Snapshot reçu');
            hideTimelineLoader();
            
            try {
                // Vérifier l'existence du document
                if (!docSnapshot.exists()) {
                    console.warn('⚠️ [TIMELINE] Document inexistant');
                    showTimelineEmpty();
                    return;
                }

                // Récupérer les données
                const data = docSnapshot.data();
                const timeline = data.timeline || [];

                console.log('📊 [TIMELINE] Événements trouvés:', timeline.length);

                // Afficher selon le contenu
                if (timeline.length === 0) {
                    showTimelineEmpty();
                } else {
                    renderTimelineRealtime(timeline);
                }
                
            } catch (err) {
                console.error('❌ [TIMELINE] Erreur traitement:', err);
                showTimelineError('Erreur lors du traitement des données');
            }
        },
        
        // ❌ Erreur
        (error) => {
            console.error('❌ [TIMELINE] Erreur Firestore:', error);
            console.error('Code:', error.code);
            console.error('Message:', error.message);
            
            hideTimelineLoader();
            
            // Messages d'erreur personnalisés
            let errorMsg = 'Une erreur est survenue';
            
            switch (error.code) {
                case 'permission-denied':
                    errorMsg = '🔒 Permissions insuffisantes';
                    console.error('💡 Vérifiez les règles Firestore');
                    break;
                    
                case 'unavailable':
                    errorMsg = '📡 Service indisponible';
                    break;
                    
                case 'unauthenticated':
                    errorMsg = '🔑 Session expirée';
                    setTimeout(() => {
                        window.location.href = './login.html';
                    }, 2000);
                    break;
                    
                case 'not-found':
                    errorMsg = '📭 Document non trouvé';
                    break;
                    
                default:
                    errorMsg = error.message;
            }
            
            showTimelineError(errorMsg);
        }
    );

    console.log('✅ [TIMELINE] Listener activé');
}

// ===================================================================
// 🎨 RENDU DE LA TIMELINE
// ===================================================================

function renderTimelineRealtime(timelineData) {
    console.log('🎨 [TIMELINE] Rendu de', timelineData.length, 'événements');
    
    // Vérifier le container
    if (!timelineContainer) {
        console.error('❌ [TIMELINE] Container non trouvé');
        return;
    }

    // Trier par date (plus récent en premier)
    const sortedTimeline = [...timelineData].sort((a, b) => {
        // Priorité au timestamp
        if (a.timestamp && b.timestamp) {
            return b.timestamp - a.timestamp;
        }
        
        // Fallback sur les dates
        const dateA = parseTimelineDate(a.date);
        const dateB = parseTimelineDate(b.date);
        return dateB.getTime() - dateA.getTime();
    });

    console.log('✅ [TIMELINE] Tri effectué');

    // Générer le HTML
    const timelineHTML = sortedTimeline.map((item, index) => {
        const status = item.status || 'todo';
        const config = STATUS_CONFIG[status] || STATUS_CONFIG['todo'];
        const formattedDate = formatTimelineDate(item.date);
        const title = escapeHtml(item.title || item.message || 'Événement');
        const description = item.description ? escapeHtml(item.description) : '';
        
        // Log pour debug
        if (index < 3) {
            console.log(`📝 [TIMELINE] Item ${index}:`, {
                title: item.title,
                date: item.date,
                formatted: formattedDate
            });
        }
        
        return `
            <div class="timeline-item animate-fade-in" 
                 style="animation-delay: ${index * 0.05}s"
                 data-status="${status}"
                 data-index="${index}">
                
                <div class="timeline-dot status-${status}" 
                     title="${config.label}"
                     style="background: ${config.color}">
                    <span class="timeline-dot-icon">${config.icon}</span>
                </div>
                
                <div class="timeline-content">
                    <div class="timeline-header">
                        <span class="timeline-status-badge status-${status}">
                            ${config.icon} ${config.label}
                        </span>
                        <span class="timeline-date" title="${item.date || 'Date inconnue'}">
                            ${formattedDate}
                        </span>
                    </div>
                    
                    <h3 class="timeline-title">${title}</h3>
                    
                    ${description ? 
                        `<p class="timeline-description">${description}</p>` 
                        : ''}
                </div>
            </div>
        `;
    }).join('');

    // Injecter le HTML
    timelineContainer.innerHTML = timelineHTML;
    timelineContainer.style.display = 'block';
    
    // Masquer les états vides/erreur
    if (timelineEmpty) timelineEmpty.style.display = 'none';
    if (timelineError) timelineError.style.display = 'none';
    
    console.log('✅ [TIMELINE] Rendu terminé');
}

// ===================================================================
// 🛠️ UTILITAIRES D'AFFICHAGE
// ===================================================================

function showTimelineLoader() {
    console.log('⏳ [TIMELINE] Affichage loader');
    if (timelineLoader) timelineLoader.style.display = 'flex';
    if (timelineContainer) timelineContainer.style.display = 'none';
    if (timelineError) timelineError.style.display = 'none';
    if (timelineEmpty) timelineEmpty.style.display = 'none';
}

function hideTimelineLoader() {
    console.log('✅ [TIMELINE] Masquage loader');
    if (timelineLoader) timelineLoader.style.display = 'none';
}

function showTimelineError(message) {
    console.log('❌ [TIMELINE] Affichage erreur:', message);
    if (timelineError) {
        timelineError.style.display = 'block';
        if (timelineErrorMessage) {
            timelineErrorMessage.textContent = message;
        }
    }
    if (timelineContainer) timelineContainer.style.display = 'none';
    if (timelineEmpty) timelineEmpty.style.display = 'none';
}

function showTimelineEmpty() {
    console.log('ℹ️ [TIMELINE] Affichage état vide');
    if (timelineEmpty) timelineEmpty.style.display = 'block';
    if (timelineContainer) timelineContainer.style.display = 'none';
    if (timelineError) timelineError.style.display = 'none';
}

// ===================================================================
// 📅 PARSING DE DATE ROBUSTE
// ===================================================================

function parseTimelineDate(date) {
    try {
        let dateObj = null;
        
        // 1. Firestore Timestamp
        if (date && typeof date.toDate === 'function') {
            dateObj = date.toDate();
            if (!isNaN(dateObj.getTime())) {
                return dateObj;
            }
        }
        
        // 2. Timestamp numérique (millisecondes)
        if (typeof date === 'number' && date > 0) {
            dateObj = new Date(date);
            if (!isNaN(dateObj.getTime())) {
                return dateObj;
            }
        }
        
        // 3. String (ISO ou autre format)
        if (typeof date === 'string' && date.trim() !== '') {
            // Essai direct
            dateObj = new Date(date);
            if (!isNaN(dateObj.getTime())) {
                return dateObj;
            }
            
            // Fallback : parsing manuel pour ISO
            const isoMatch = date.match(/^(\d{4})-(\d{2})-(\d{2})/);
            if (isoMatch) {
                const [, year, month, day] = isoMatch;
                dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                if (!isNaN(dateObj.getTime())) {
                    return dateObj;
                }
            }
        }
        
        // 4. Objet Date
        if (date instanceof Date && !isNaN(date.getTime())) {
            return date;
        }
        
        // Si tout échoue
        console.warn('⚠️ [TIMELINE] Date invalide:', date);
        return new Date(0); // Epoch
        
    } catch (error) {
        console.error('❌ [TIMELINE] Erreur parsing:', error);
        return new Date(0);
    }
}

// ===================================================================
// 🎨 FORMATAGE DE DATE ROBUSTE
// ===================================================================

function formatTimelineDate(date) {
    try {
        const dateObj = parseTimelineDate(date);
        
        // Vérifier validité
        if (!dateObj || isNaN(dateObj.getTime()) || dateObj.getTime() === 0) {
            return 'Date inconnue';
        }

        const now = new Date();
        const diffMs = now - dateObj;
        const diffSecs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffSecs / 60);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        // Temps relatif récent
        if (diffSecs < 10) return 'À l\'instant';
        if (diffSecs < 60) return `Il y a ${diffSecs}s`;
        if (diffMins < 60) return `Il y a ${diffMins} min`;
        if (diffHours < 24) return `Il y a ${diffHours}h`;
        if (diffDays < 7) return `Il y a ${diffDays}j`;

        // Date formatée (avec fallback manuel)
        try {
            const options = {
                day: 'numeric',
                month: 'long'
            };
            
            if (dateObj.getFullYear() !== now.getFullYear()) {
                options.year = 'numeric';
            }
            
            return dateObj.toLocaleDateString('fr-FR', options);
            
        } catch (e) {
            // Fallback manuel si toLocaleDateString échoue (Safari mobile)
            return formatDateManual(dateObj);
        }
        
    } catch (error) {
        console.error('❌ [TIMELINE] Erreur formatage:', error);
        return 'Date invalide';
    }
}

// Formatage manuel (fallback)
function formatDateManual(date) {
    const months = [
        'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
        'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
    ];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const currentYear = new Date().getFullYear();
    
    if (year === currentYear) {
        return `${day} ${month}`;
    }
    return `${day} ${month} ${year}`;
}

// ===================================================================
// 🔐 ÉCHAPPEMENT HTML
// ===================================================================

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===================================================================
// ➕ AJOUTER UN ÉVÉNEMENT
// ===================================================================

async function addTimelineEvent(title, description = '', status = 'todo') {
    console.log('➕ [TIMELINE] Ajout événement:', title);
    
    // Vérifications
    if (!currentUser) {
        console.error('❌ [TIMELINE] User non connecté');
        return;
    }

    if (!userData) {
        console.error('❌ [TIMELINE] userData non défini');
        return;
    }

    // Initialiser timeline si besoin
    if (!userData.timeline) {
        userData.timeline = [];
    }
    
    // Créer l'événement
    const now = new Date();
    const newEvent = {
        title: title,
        description: description,
        status: status,
        date: now.toISOString(), // Format ISO
        timestamp: now.getTime()  // Timestamp numérique
    };
    
    console.log('📝 [TIMELINE] Nouvel événement:', newEvent);
    
    // Ajouter au début (plus récent)
    userData.timeline.unshift(newEvent);
    
    // Limiter à 50 événements
    if (userData.timeline.length > 50) {
        userData.timeline = userData.timeline.slice(0, 50);
        console.log('🗑️ [TIMELINE] Nettoyage: gardé 50 événements');
    }
    
    // Sauvegarder dans Firestore
    try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userDocRef, {
            timeline: userData.timeline
        });
        console.log('✅ [TIMELINE] Sauvegardé:', title);
    } catch (error) {
        console.error('❌ [TIMELINE] Erreur sauvegarde:', error);
        throw error;
    }
}

// ===================================================================
// 🔄 BOUTON RETRY
// ===================================================================

if (timelineRetry) {
    timelineRetry.addEventListener('click', () => {
        console.log('🔄 [TIMELINE] Retry demandé');
        loadTimelineRealtime();
    });
    console.log('✅ [TIMELINE] Bouton retry configuré');
}

// ===================================================================
// 🧹 NETTOYAGE
// ===================================================================

function cleanupTimeline() {
    if (unsubscribeTimeline) {
        console.log('🧹 [TIMELINE] Nettoyage listener');
        unsubscribeTimeline();
        unsubscribeTimeline = null;
    }
}

// Nettoyage automatique
window.addEventListener('beforeunload', cleanupTimeline);

// ===================================================================
// 🔍 DEBUG ET DIAGNOSTIC
// ===================================================================

function verifyTimelineSetup() {
    console.group('🔍 [TIMELINE] DIAGNOSTIC');
    
    const checks = {
        'User connecté': !!currentUser,
        'User ID': currentUser?.uid || 'N/A',
        'UserData chargé': !!userData,
        'Timeline existe': !!userData?.timeline,
        'Timeline array': Array.isArray(userData?.timeline),
        'Timeline length': userData?.timeline?.length || 0,
        'Container trouvé': !!timelineContainer,
        'Loader trouvé': !!timelineLoader,
        'Empty trouvé': !!timelineEmpty,
        'Error trouvé': !!timelineError,
        'Retry trouvé': !!timelineRetry,
        'Listener actif': !!unsubscribeTimeline
    };
    
    console.table(checks);
    
    if (userData?.timeline && userData.timeline.length > 0) {
        console.group('📊 Événements timeline');
        userData.timeline.slice(0, 5).forEach((event, i) => {
            console.log(`Event ${i}:`, {
                title: event.title,
                date: event.date,
                timestamp: event.timestamp,
                status: event.status,
                parsed: parseTimelineDate(event.date),
                formatted: formatTimelineDate(event.date)
            });
        });
        console.groupEnd();
    }
    
    console.groupEnd();
}

// Fonction de nettoyage timeline
function cleanTimelineData() {
    console.log('🧹 [TIMELINE] Nettoyage des données');
    
    if (!userData || !userData.timeline) {
        console.error('❌ Pas de timeline à nettoyer');
        return;
    }
    
    userData.timeline = userData.timeline.map(event => {
        const cleaned = { ...event };
        
        // Ajouter timestamp si manquant
        if (!cleaned.timestamp) {
            const parsed = parseTimelineDate(cleaned.date);
            cleaned.timestamp = parsed.getTime();
        }
        
        // Normaliser date en ISO
        if (!cleaned.date || typeof cleaned.date !== 'string') {
            cleaned.date = new Date(cleaned.timestamp).toISOString();
        }
        
        // Assurer status
        if (!cleaned.status) {
            cleaned.status = 'todo';
        }
        
        return cleaned;
    });
    
    // Sauvegarder
    const userDocRef = doc(db, 'users', currentUser.uid);
    return updateDoc(userDocRef, {
        timeline: userData.timeline
    }).then(() => {
        console.log('✅ Timeline nettoyée et sauvegardée');
    });
}

// Exposer globalement pour debug
window.debugTimeline = verifyTimelineSetup;
window.cleanTimelineData = cleanTimelineData;


// ===================================================================
// 👤 DISPLAY PROFILE
// ===================================================================

function displayProfile() {
    const photoURL = userData.photoURL || 
        `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=df437c&color=fff&size=200`;
    
    if (profilePhoto) profilePhoto.src = photoURL;
    if (topbarPhoto) topbarPhoto.src = photoURL;
    
    if (userName) userName.textContent = userData.name || 'Utilisateur';
    if (topbarName) topbarName.textContent = userData.name?.split(' ')[0] || 'User';
    if (userEmail) userEmail.textContent = userData.email || currentUser.email;
    if (projectName) projectName.textContent = `Projet: ${userData.projectName || 'Non défini'}`;
    
    if (statLevel) statLevel.textContent = userData.level || 1;
    if (statPoints) statPoints.textContent = userData.xp || 0;
    if (statBadges) statBadges.textContent = userData.earnedBadges?.length || 0;
    if (userLevelDisplay) userLevelDisplay.textContent = userData.level || 1;
    if (currentXP) currentXP.textContent = userData.xp || 0;
    
    const nextLevel = (userData.level || 1) + 1;
    const xpNeeded = nextLevel * 100;
    if (nextLevelXP) nextLevelXP.textContent = xpNeeded;
    
    const xpProgress = ((userData.xp || 0) / xpNeeded) * 100;
    if (levelProgressFill) levelProgressFill.style.width = `${xpProgress}%`;
    
    if (referralCode) referralCode.value = userData.referralCode || 'LOADING...';
    if (referralCount) referralCount.textContent = userData.referrals?.length || 0;
    if (referralEarnings) referralEarnings.textContent = (userData.referrals?.length || 0) * 10;
}

// ===================================================================
// 📋 RENDER STEPS
// ===================================================================

function renderSteps() {
    if (!stepsContainer) return;
    
    stepsContainer.innerHTML = '';

    userData.steps.forEach((step, index) => {
        const stepCard = document.createElement('div');
        stepCard.className = `step-card ${step.status}`;
        
        const statusClass = step.status === 'done' ? 'status-done' : 
                           step.status === 'in-progress' ? 'status-in-progress' : 
                           'status-todo';
        
        const statusText = step.status === 'done' ? 'Terminé' : 
                          step.status === 'in-progress' ? 'En cours' : 
                          'À faire';

        stepCard.innerHTML = `
            <div class="step-header">
                <h4 class="step-title">${step.title}</h4>
                <span class="step-status ${statusClass}">${statusText}</span>
            </div>
            <p class="step-description">${step.description}</p>
            ${step.status === 'done' && step.date ? `<p class="step-date" style="font-size: 12px; color: var(--muted2); margin-top: 10px;">Complété le ${formatDate(step.date)}</p>` : ''}
            <div class="admin-controls ${isAdmin ? 'visible' : ''}" id="admin-${step.id}">
                <button class="btn-admin" onclick="updateStepStatus('${step.id}', 'todo')">À faire</button>
                <button class="btn-admin" onclick="updateStepStatus('${step.id}', 'in-progress')">En cours</button>
                <button class="btn-admin" onclick="updateStepStatus('${step.id}', 'done')">Terminé</button>
            </div>
        `;

        stepsContainer.appendChild(stepCard);
        setTimeout(() => stepCard.classList.add('fade-in'), index * 100);
    });
}

// ===================================================================
// ✏️ UPDATE STEP STATUS
// ===================================================================

window.updateStepStatus = async function(stepId, newStatus) {
    if (!isAdmin) {
        console.warn('⚠️ Accès admin requis');
        return;
    }
    
    try {
        const stepIndex = userData.steps.findIndex(s => s.id === stepId);
        
        if (stepIndex === -1) {
            console.error('❌ Step non trouvé:', stepId);
            return;
        }

        const oldStatus = userData.steps[stepIndex].status;
        userData.steps[stepIndex].status = newStatus;
        
        if (newStatus === 'done') {
            userData.steps[stepIndex].date = new Date().toISOString();
            
            await addTimelineEvent(
                userData.steps[stepIndex].title,
                `Étape "${userData.steps[stepIndex].title}" terminée`,
                'done'
            );
            
            await addNotification(
                `Étape "${userData.steps[stepIndex].title}" complétée ! 🎉`, 
                'success'
            );
            
            await addXP(20, `Étape "${userData.steps[stepIndex].title}" terminée`);
            await checkAndAwardBadges();
            
        } else if (newStatus === 'in-progress' && oldStatus !== 'in-progress') {
            await addTimelineEvent(
                userData.steps[stepIndex].title,
                `Étape "${userData.steps[stepIndex].title}" en cours`,
                'in-progress'
            );
        }
        
        const userDocRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userDocRef, { 
            steps: userData.steps
        });

        renderSteps();
        calculateGlobalProgress();
        calculateStats();
        
        console.log("✅ Step mis à jour:", stepId, oldStatus, "→", newStatus);
        
    } catch (error) {
        console.error('❌ Error updating step:', error);
        alert(`Erreur: ${error.message}`);
    }
};

// ===================================================================
// 📊 CALCULATE PROGRESS
// ===================================================================

function calculateGlobalProgress() {
    const totalSteps = userData.steps.length;
    const completedSteps = userData.steps.filter(s => s.status === 'done').length;
    const inProgressSteps = userData.steps.filter(s => s.status === 'in-progress').length;

    const progress = ((completedSteps + (inProgressSteps * 0.5)) / totalSteps) * 100;
    const roundedProgress = Math.round(progress);

    if (globalProgress) globalProgress.textContent = `${roundedProgress}%`;
    if (progressFill) progressFill.style.width = `${roundedProgress}%`;
    if (statStepsCompleted) statStepsCompleted.textContent = `${completedSteps}/${totalSteps}`;
}

// ===================================================================
// 📊 CALCULATE STATS
// ===================================================================

function calculateStats() {
    if (!statDaysElapsed) return;
    
    const startDate = userData.projectStartDate?.toDate ? 
        userData.projectStartDate.toDate() : 
        new Date(userData.projectStartDate);
    const today = new Date();
    const daysElapsed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    statDaysElapsed.textContent = daysElapsed;
    
    if (userData.projectEndDate && statDaysRemaining) {
        const endDate = userData.projectEndDate.toDate ? 
            userData.projectEndDate.toDate() : 
            new Date(userData.projectEndDate);
        const daysRemaining = Math.floor((endDate - today) / (1000 * 60 * 60 * 24));
        statDaysRemaining.textContent = daysRemaining > 0 ? daysRemaining : '0';
    } else if (statDaysRemaining) {
        statDaysRemaining.textContent = '-';
    }
    
    if (userData.formations && userData.formations.length > 0 && statFormationsProgress) {
        const totalModules = userData.formations.reduce((acc, f) => {
            const formation = availableFormations.find(af => af.id === f.id);
            return acc + (formation?.totalModules || 0);
        }, 0);
        
        const completedModules = userData.formations.reduce((acc, f) => 
            acc + (f.completedModules || 0), 0);
        
        const formationProgress = totalModules > 0 ? 
            Math.round((completedModules / totalModules) * 100) : 0;
        statFormationsProgress.textContent = `${formationProgress}%`;
    } else if (statFormationsProgress) {
        statFormationsProgress.textContent = '0%';
    }
}

// ===================================================================
// 🎓 RENDER FORMATIONS
// ===================================================================

function renderFormations() {
    if (!formationsContainer) return;
    
    formationsContainer.innerHTML = '';

    const userFormations = userData.formations || [];

    if (userFormations.length === 0) {
        formationsContainer.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-state-icon">📚</div>
                <p>Aucune formation active pour le moment</p>
            </div>
        `;
        return;
    }

    userFormations.forEach((formation, index) => {
        const formationInfo = availableFormations.find(f => f.id === formation.id);
        if (!formationInfo) return;

        const progress = (formation.completedModules / formationInfo.totalModules) * 100;
        const isCompleted = formation.completedModules === formationInfo.totalModules;

        const formationCard = document.createElement('div');
        formationCard.className = 'formation-card';
        formationCard.innerHTML = `
            <div class="formation-icon">${formationInfo.icon}</div>
            <h4 class="formation-title">${formationInfo.title}</h4>
            <p class="formation-modules">${formation.completedModules} / ${formationInfo.totalModules} modules complétés</p>
            <div class="formation-progress">
                <div class="formation-progress-label">
                    <span>Progression</span>
                    <span>${Math.round(progress)}%</span>
                </div>
                <div class="formation-progress-bar">
                    <div class="formation-progress-fill" style="width: ${progress}%"></div>
                </div>
            </div>
            <button class="btn-formation ${isCompleted ? 'disabled' : ''}" onclick="viewFormation('${formation.id}')">
                ${isCompleted ? '✓ Formation terminée' : 'Voir les cours'}
            </button>
        `;

        formationsContainer.appendChild(formationCard);
        setTimeout(() => formationCard.classList.add('fade-in'), index * 100);
    });
}

window.viewFormation = function(formationId) {
    alert(`Redirection vers formation: ${formationId}\n(Page formation.html à créer)`);
};

// ===================================================================
// 📁 RENDER DOCUMENTS
// ===================================================================

function renderDocuments() {
    if (!documentsContainer) return;
    
    documentsContainer.innerHTML = '';
    
    const documents = userData.documents || [];
    
    if (documents.length === 0) {
        documentsContainer.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-state-icon">📁</div>
                <p>Aucun document disponible</p>
            </div>
        `;
        return;
    }
    
    documents.forEach(doc => {
        const docCard = document.createElement('div');
        docCard.className = 'document-card';
        
        const icon = getFileIcon(doc.type);
        const size = formatFileSize(doc.size);
        
        docCard.innerHTML = `
            <div class="document-icon">${icon}</div>
            <div class="document-info">
                <div class="document-name">${doc.name}</div>
                <div class="document-size">${size}</div>
            </div>
            <div class="document-actions">
                <button class="btn-icon-small" onclick="downloadDocument('${doc.url}')" title="Télécharger">⬇️</button>
            </div>
        `;
        
        documentsContainer.appendChild(docCard);
    });
}

window.downloadDocument = function(url) {
    window.open(url, '_blank');
};

// ===================================================================
// 📧 REQUEST DOCUMENT
// ===================================================================

const requestDocumentBtn = document.getElementById('requestDocumentBtn');
const requestDocumentModal = document.getElementById('requestDocumentModal');
const closeRequestDocModal = document.getElementById('closeRequestDocModal');
const requestDocumentForm = document.getElementById('requestDocumentForm');
const submitDocRequest = document.getElementById('submitDocRequest');
const docRequestSuccess = document.getElementById('docRequestSuccess');

if (requestDocumentBtn) {
    requestDocumentBtn.addEventListener('click', () => {
        if (requestDocumentModal) {
            requestDocumentModal.classList.add('open');
        }
    });
}

if (closeRequestDocModal) {
    closeRequestDocModal.addEventListener('click', () => {
        if (requestDocumentModal) {
            requestDocumentModal.classList.remove('open');
        }
    });
}

if (requestDocumentForm) {
    requestDocumentForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const docType = document.getElementById('docType')?.value;
        const docMessage = document.getElementById('docMessage')?.value.trim();
        const docUrgent = document.getElementById('docUrgent')?.checked;

        if (!docType) {
            alert('⚠️ Sélectionne un type de document');
            return;
        }

        if (submitDocRequest) {
            submitDocRequest.disabled = true;
            submitDocRequest.textContent = '📤 Envoi en cours...';
        }

        try {
            const requestsRef = collection(db, 'documentRequests');
            await addDoc(requestsRef, {
                userId: currentUser.uid,
                userName: userData.name,
                userEmail: userData.email,
                projectName: userData.projectName,
                docType,
                message: docMessage || '',
                urgent: docUrgent || false,
                status: 'pending',
                createdAt: serverTimestamp(),
                completedAt: null
            });

            console.log('✅ Demande de document envoyée');

            await addNotification('📧 Ta demande de document a été envoyée !', 'info');
            await addTimelineEvent(
                'Demande de document',
                `${getDocTypeLabel(docType)}`,
                'in-progress'
            );

            if (docRequestSuccess) {
                docRequestSuccess.style.display = 'block';
            }

            requestDocumentForm.reset();

            setTimeout(() => {
                if (requestDocumentModal) {
                    requestDocumentModal.classList.remove('open');
                }
                if (docRequestSuccess) {
                    docRequestSuccess.style.display = 'none';
                }
            }, 2000);

        } catch (error) {
            console.error('❌ Erreur lors de l\'envoi de la demande:', error);
            alert('❌ Erreur lors de l\'envoi. Réessaye.');
        }

        if (submitDocRequest) {
            submitDocRequest.disabled = false;
            submitDocRequest.textContent = '📤 Envoyer la demande';
        }
    });
}

function getDocTypeLabel(type) {
    const labels = {
        'maquette': '🎨 Maquette / Design',
        'logo': '🖼️ Logo',
        'brief': '📋 Brief',
        'facture': '🧾 Facture',
        'contrat': '📄 Contrat',
        'formation': '🎓 Formation',
        'autre': '📦 Autre'
    };
    return labels[type] || type;
}

// ===================================================================
// 🗓️ RENDER ROADMAP
// ===================================================================

function renderRoadmap() {
    if (!roadmapContainer) return;
    
    roadmapContainer.innerHTML = '';
    
    const steps = userData.steps || [];
    
    steps.forEach((step, index) => {
        const stepEl = document.createElement('div');
        
        let stepClass = 'roadmap-step upcoming';
        if (step.status === 'done') stepClass = 'roadmap-step completed';
        if (step.status === 'in-progress') stepClass = 'roadmap-step current';
        
        stepEl.className = stepClass;
        
        const date = step.date ? formatDate(step.date) : 'À venir';
        
        stepEl.innerHTML = `
            <span class="step-date">${date}</span>
            <p>${step.title}</p>
        `;
        
        roadmapContainer.appendChild(stepEl);
    });
}

// ===================================================================
// 🎮 RENDER BADGES
// ===================================================================

function renderBadges() {
    if (!badgesContainer) return;
    
    badgesContainer.innerHTML = '';
    
    availableBadges.forEach(badge => {
        const earned = userData.earnedBadges?.includes(badge.id);
        
        const badgeCard = document.createElement('div');
        badgeCard.className = `badge-card ${earned ? 'earned' : 'locked'}`;
        
        badgeCard.innerHTML = `
            <div class="badge-icon">${badge.icon}</div>
            <div class="badge-name">${badge.title}</div>
            <p style="font-size: 12px; color: var(--muted2); margin-top: 5px;">${badge.description}</p>
            <p style="font-size: 12px; color: var(--accent2); margin-top: 5px;">${earned ? '✓ Débloqué' : `🔒 ${badge.xp} XP`}</p>
        `;
        
        badgesContainer.appendChild(badgeCard);
    });
}

// ===================================================================
// 🔔 NOTIFICATIONS
// ===================================================================

async function loadNotifications() {
    try {
        const notifRef = collection(db, 'notifications');
        const q = query(
            notifRef, 
            where('userId', '==', currentUser.uid), 
            orderBy('createdAt', 'desc'), 
            limit(10)
        );
        const snapshot = await getDocs(q);
        
        notifications = [];
        snapshot.forEach(doc => {
            notifications.push({ id: doc.id, ...doc.data() });
        });
        
        renderNotifications();
    } catch (error) {
        console.log('ℹ️ Notifications collection not found (normal for new users)');
    }
}

function renderNotifications() {
    if (notificationsList) {
        notificationsList.innerHTML = '';
        
        if (notifications.length === 0) {
            notificationsList.innerHTML = '<p style="text-align: center; color: var(--muted); padding: 20px;">Aucune notification</p>';
        } else {
            notifications.forEach(notif => {
                const notifEl = document.createElement('div');
                notifEl.className = `notification-item ${notif.read ? '' : 'new'} ${notif.type || ''}`;
                
                const time = notif.createdAt?.toDate ? 
                    formatTimeAgo(notif.createdAt.toDate()) : 'À l\'instant';
                
                notifEl.innerHTML = `
                    <p>${notif.message}</p>
                    <span class="notification-time">${time}</span>
                `;
                
                notifEl.addEventListener('click', () => markNotificationAsRead(notif.id));
                
                notificationsList.appendChild(notifEl);
            });
        }
    }
    
    if (recentNotifsList) {
        recentNotifsList.innerHTML = '';
        
        const recent = notifications.slice(0, 3);
        
        if (recent.length === 0) {
            recentNotifsList.innerHTML = '<p style="text-align: center; color: var(--muted); padding: 20px;">Aucune notification récente</p>';
        } else {
            recent.forEach(notif => {
                const notifEl = document.createElement('div');
                notifEl.className = 'notification-item';
                notifEl.innerHTML = `<p>${notif.message}</p>`;
                recentNotifsList.appendChild(notifEl);
            });
        }
    }
    
    unreadNotifications = notifications.filter(n => !n.read).length;
    if (notifBadge) {
        notifBadge.textContent = unreadNotifications;
        notifBadge.style.display = unreadNotifications > 0 ? 'block' : 'none';
    }
}

async function addNotification(message, type = 'info') {
    try {
        const notifRef = collection(db, 'notifications');
        await addDoc(notifRef, {
            userId: currentUser.uid,
            message,
            type,
            read: false,
            createdAt: serverTimestamp()
        });
        
        await loadNotifications();
    } catch (error) {
        console.error('Error adding notification:', error);
    }
}

async function markNotificationAsRead(notifId) {
    try {
        const notifRef = doc(db, 'notifications', notifId);
        await updateDoc(notifRef, { read: true });
        await loadNotifications();
    } catch (error) {
        console.error('Error marking notification as read:', error);
    }
}

// ===================================================================
// 💬 CHAT
// ===================================================================

async function loadChatMessages() {
    try {
        const chatRef = collection(db, 'chats');
        const q = query(
            chatRef, 
            where('userId', '==', currentUser.uid), 
            orderBy('createdAt', 'asc')
        );
        const snapshot = await getDocs(q);
        
        chatMessages = [];
        snapshot.forEach(doc => {
            chatMessages.push({ id: doc.id, ...doc.data() });
        });
        
        renderChatMessages();
    } catch (error) {
        console.log('ℹ️ Chat collection not found (normal for new users)');
    }
}

function renderChatMessages() {
    if (!chatMessages_el) return;
    
    chatMessages_el.innerHTML = '';
    
    if (chatMessages.length === 0) {
        chatMessages_el.innerHTML = `
            <div class="chat-message admin">
                <p>👋 Bonjour ! Comment puis-je vous aider ?</p>
            </div>
        `;
    } else {
        chatMessages.forEach(msg => {
            const msgEl = document.createElement('div');
            msgEl.className = `chat-message ${msg.from}`;
            msgEl.innerHTML = `<p>${msg.message}</p>`;
            chatMessages_el.appendChild(msgEl);
        });
    }
    
    chatMessages_el.scrollTop = chatMessages_el.scrollHeight;
    
    unreadMessages = chatMessages.filter(m => m.from === 'admin' && !m.read).length;
    if (chatBadge) {
        chatBadge.textContent = unreadMessages;
        chatBadge.style.display = unreadMessages > 0 ? 'block' : 'none';
    }
}

async function sendChatMessage() {
    const message = chatInput?.value.trim();
    if (!message) return;
    
    try {
        const chatRef = collection(db, 'chats');
        await addDoc(chatRef, {
            userId: currentUser.uid,
            from: 'user',
            message,
            read: false,
            createdAt: serverTimestamp()
        });
        
        chatInput.value = '';
        await loadChatMessages();
        
        setTimeout(async () => {
            await addDoc(chatRef, {
                userId: currentUser.uid,
                from: 'admin',
                message: 'Merci pour votre message ! Nous vous répondons dans les plus brefs délais. 😊',
                read: false,
                createdAt: serverTimestamp()
            });
            await loadChatMessages();
        }, 2000);
        
    } catch (error) {
        console.error('Error sending message:', error);
        alert('Erreur lors de l\'envoi du message');
    }
}

// ===================================================================
// 📸 PHOTO UPLOAD
// ===================================================================

if (photoInput) {
    photoInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('⚠️ Veuillez sélectionner une image');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('⚠️ L\'image ne doit pas dépasser 5MB');
            return;
        }

        try {
            photoContainer.classList.add('uploading');
            console.log('📤 Upload en cours...');

            if (userData.photoURL && userData.photoURL.includes('firebasestorage')) {
                try {
                    const oldPhotoRef = ref(storage, `profile-photos/${currentUser.uid}/avatar.jpg`);
                    await deleteObject(oldPhotoRef);
                    console.log('🗑️ Ancienne photo supprimée');
                } catch (err) {
                    console.log('ℹ️ Pas d\'ancienne photo à supprimer');
                }
            }

            const storageRef = ref(storage, `profile-photos/${currentUser.uid}/avatar.jpg`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            console.log('✅ Photo uploadée:', downloadURL);

            const userDocRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userDocRef, { photoURL: downloadURL });

            await updateProfile(currentUser, { photoURL: downloadURL });

            userData.photoURL = downloadURL;
            if (profilePhoto) profilePhoto.src = downloadURL;
            if (topbarPhoto) topbarPhoto.src = downloadURL;

            photoContainer.classList.remove('uploading');
            if (profilePhoto) profilePhoto.classList.add('uploaded');
            
            setTimeout(() => {
                if (profilePhoto) profilePhoto.classList.remove('uploaded');
            }, 600);
            
            await addTimelineEvent('Photo de profil mise à jour', '', 'done');
            await addNotification('Photo de profil mise à jour avec succès ! 📸', 'success');

            console.log('✅ Photo de profil mise à jour !');

        } catch (error) {
            console.error('❌ Erreur upload photo:', error);
            alert('❌ Erreur lors de l\'upload. Réessayez.');
            photoContainer.classList.remove('uploading');
        }

        photoInput.value = '';
    });
}

// ===================================================================
// ✏️ EDIT PROFILE
// ===================================================================

if (editProfileBtn) {
    editProfileBtn.addEventListener('click', () => {
        const editName = document.getElementById('editName');
        const editProjectName = document.getElementById('editProjectName');
        const editProjectDescription = document.getElementById('editProjectDescription');
        
        if (editName) editName.value = userData.name || '';
        if (editProjectName) editProjectName.value = userData.projectName || '';
        if (editProjectDescription) editProjectDescription.value = userData.projectDescription || '';
        
        if (editProfileModal) editProfileModal.classList.add('open');
    });
}

document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('open'));
    });
});
// =======================================================
// PROFIL MODAL
// =======================================================

const closeProfileModal = document.getElementById("closeProfileModal");
if(editProfileBtn){
editProfileBtn.addEventListener("click",()=>{
editProfileModal.classList.add("open");
});
}

if(closeProfileModal){
closeProfileModal.addEventListener("click",()=>{
editProfileModal.classList.remove("open");
});
}
const editProfileForm = document.getElementById('editProfileForm');
if (editProfileForm) {
    editProfileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const newName = document.getElementById('editName')?.value.trim();
        const newProjectName = document.getElementById('editProjectName')?.value.trim();
        const newProjectDescription = document.getElementById('editProjectDescription')?.value.trim();
        
        try {
            const userDocRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userDocRef, {
                name: newName,
                projectName: newProjectName,
                projectDescription: newProjectDescription
            });
            
            userData.name = newName;
            userData.projectName = newProjectName;
            userData.projectDescription = newProjectDescription;
            
            displayProfile();
            if (editProfileModal) editProfileModal.classList.remove('open');
            
            await addTimelineEvent('Profil mis à jour', '', 'done');
            await addNotification('Profil mis à jour avec succès ! ✅', 'success');
            
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Erreur lors de la mise à jour');
        }
    });
}
window.addEventListener("click",(e)=>{
if(e.target === editProfileModal){
editProfileModal.classList.remove("open");
}
});
// ===================================================================
// 🎮 GAMIFICATION
// ===================================================================

async function addXP(amount, reason) {
    userData.xp = (userData.xp || 0) + amount;
    
    const newLevel = Math.floor(userData.xp / 100) + 1;
    if (newLevel > (userData.level || 1)) {
        userData.level = newLevel;
        await addNotification(`🎉 Level Up ! Vous êtes maintenant niveau ${newLevel} !`, 'success');
        await addTimelineEvent(`Passage niveau ${newLevel}`, '', 'done');
    }
    
    const userDocRef = doc(db, 'users', currentUser.uid);
    await updateDoc(userDocRef, {
        xp: userData.xp,
        level: userData.level
    });
    
    displayProfile();
    
    console.log(`✅ +${amount} XP : ${reason}`);
}

async function checkAndAwardBadges() {
    const completedSteps = userData.steps.filter(s => s.status === 'done').length;
    const totalSteps = userData.steps.length;
    const progressPercent = (completedSteps / totalSteps) * 100;
    
    const badgesToAward = [];
    
    if (completedSteps >= 1 && !userData.earnedBadges.includes('first-step')) {
        badgesToAward.push('first-step');
    }
    
    if (progressPercent >= 50 && !userData.earnedBadges.includes('half-done')) {
        badgesToAward.push('half-done');
    }
    
    if (progressPercent >= 75 && !userData.earnedBadges.includes('almost-there')) {
        badgesToAward.push('almost-there');
    }
    
    if (progressPercent === 100 && !userData.earnedBadges.includes('completed')) {
        badgesToAward.push('completed');
    }
    
    for (const badgeId of badgesToAward) {
        const badge = availableBadges.find(b => b.id === badgeId);
        if (badge) {
            userData.earnedBadges.push(badgeId);
            await addXP(badge.xp, `Badge "${badge.title}" débloqué`);
            await addNotification(`🏆 Badge débloqué : ${badge.title} ! +${badge.xp} XP`, 'success');
            await addTimelineEvent(`Badge "${badge.title}" débloqué`, '', 'done');
        }
    }
    
    if (badgesToAward.length > 0) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userDocRef, {
            earnedBadges: userData.earnedBadges
        });
        
        renderBadges();
    }
}

// ===================================================================
// 📊 SECTION PROJECT - FUNCTIONS
// ===================================================================

function renderProjectInfo() {
    console.log('📊 Render Project Info...');
    
    if (!userData) {
        console.log('⚠️ userData non disponible');
        return;
    }

    const projectInfoName = document.getElementById('projectInfoName');
    const projectInfoDescription = document.getElementById('projectInfoDescription');
    const projectStartDate = document.getElementById('projectStartDate');
    const projectDuration = document.getElementById('projectDuration');
    const projectProgressBar = document.getElementById('projectProgressBar');
    const projectProgressText = document.getElementById('projectProgressText');

    if (projectInfoName) {
        projectInfoName.textContent = userData.projectName || 'Mon projet';
    }

    if (projectInfoDescription) {
        projectInfoDescription.textContent = userData.projectDescription || 'Description non définie';
    }

    if (projectStartDate) {
        const startDate = userData.projectStartDate?.toDate ? 
            userData.projectStartDate.toDate() : 
            new Date(userData.projectStartDate);
        projectStartDate.textContent = formatDate(startDate);
    }

    if (projectDuration) {
        const start = userData.projectStartDate?.toDate ? 
            userData.projectStartDate.toDate() : 
            new Date(userData.projectStartDate);
        const end = userData.projectEndDate?.toDate ? 
            userData.projectEndDate.toDate() : 
            null;

        if (end) {
            const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            projectDuration.textContent = `${duration} jours`;
        } else {
            projectDuration.textContent = 'Non définie';
        }
    }

    const totalSteps = userData.steps?.length || 0;
    const completedSteps = userData.steps?.filter(s => s.status === 'done').length || 0;
    const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

    if (projectProgressBar) {
        projectProgressBar.style.width = `${progress}%`;
    }

    if (projectProgressText) {
        projectProgressText.textContent = `${progress}%`;
    }
    
    console.log('✅ Project Info rendu');
}

function renderValidationItems() {
    console.log('📋 Render Validation Items...');
    
    const validationItems = document.getElementById('validationItems');
    
    if (!validationItems) {
        console.log('⚠️ validationItems element non trouvé');
        return;
    }
    
    if (!userData) {
        console.log('⚠️ userData non disponible');
        return;
    }

    const validations = [];

    if (userData.steps) {
        userData.steps.forEach(step => {
            if (step.status === 'in-progress' && step.requiresValidation) {
                validations.push({
                    id: step.id,
                    title: `Valider : ${step.title}`,
                    description: step.validationMessage || 'Cette étape nécessite votre validation',
                    icon: '✅',
                    type: 'step'
                });
            }
        });
    }

    if (validations.length === 0) {
        validationItems.innerHTML = `
            <div class="validation-empty">
                <div class="validation-empty-icon">✅</div>
                <p>Aucune validation en attente</p>
                <small>Toutes les étapes sont à jour !</small>
            </div>
        `;
        console.log('✅ Aucune validation');
        return;
    }

    validationItems.innerHTML = validations.map(item => `
        <div class="validation-item" data-id="${item.id}" data-type="${item.type}">
            <div class="validation-icon">${item.icon}</div>
            <div class="validation-content">
                <h4 class="validation-title">${item.title}</h4>
                <p class="validation-description">${item.description}</p>
            </div>
            <div class="validation-actions">
                <button class="btn-validate" onclick="validateItem('${item.id}', '${item.type}')">
                    ✓ Valider
                </button>
                <button class="btn-reject" onclick="rejectItem('${item.id}', '${item.type}')">
                    ✗ Refuser
                </button>
            </div>
        </div>
    `).join('');
    
    console.log('✅ Validations rendues:', validations.length);
}

window.validateItem = async function(itemId, itemType) {
    try {
        console.log(`Validating ${itemType}:`, itemId);

        if (itemType === 'step') {
            const stepIndex = userData.steps.findIndex(s => s.id === itemId);
            if (stepIndex !== -1) {
                userData.steps[stepIndex].requiresValidation = false;
                userData.steps[stepIndex].validated = true;
                userData.steps[stepIndex].validatedAt = new Date().toISOString();
            }
        }

        const userDocRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userDocRef, {
            steps: userData.steps
        });

        await addNotification(`✅ Élément validé avec succès !`, 'success');

        renderValidationItems();
        renderSteps();

    } catch (error) {
        console.error('Error validating item:', error);
        alert('Erreur lors de la validation');
    }
};

window.rejectItem = async function(itemId, itemType) {
    const reason = prompt('Raison du refus (optionnel) :');
    
    try {
        console.log(`Rejecting ${itemType}:`, itemId, reason);
        await addNotification(`❌ Élément refusé`, 'info');
        renderValidationItems();
    } catch (error) {
        console.error('Error rejecting item:', error);
        alert('Erreur lors du refus');
    }
};

function setupPreview() {
    console.log('🔧 Setup Preview...');
    
    const sitePreview = document.getElementById('sitePreview');
    const previewOverlay = document.getElementById('previewOverlay');
    const previewUrlBar = document.getElementById('previewUrlBar');
    const previewUrl = document.getElementById('previewUrl');
    const copyPreviewUrl = document.getElementById('copyPreviewUrl');
    const openPreviewNew = document.getElementById('openPreviewNew');
    const refreshPreview = document.getElementById('refreshPreview');

    console.log('📊 Elements Preview:', {
        sitePreview: !!sitePreview,
        previewOverlay: !!previewOverlay,
        previewUrlBar: !!previewUrlBar,
        siteUrl: userData?.siteUrl
    });

    if (userData && userData.siteUrl && userData.siteUrl.trim() !== '') {
        
        console.log('✅ URL du site trouvée:', userData.siteUrl);
        
        if (sitePreview) {
            sitePreview.src = userData.siteUrl;
            console.log('✅ Iframe src défini');
        }
        
        if (previewOverlay) {
            previewOverlay.style.display = 'none';
            console.log('✅ Overlay masqué');
        }
        
        if (previewUrlBar) {
            previewUrlBar.style.display = 'flex';
            console.log('✅ URL bar affichée');
        }
        
        if (previewUrl) {
            previewUrl.value = userData.siteUrl;
        }
        
        console.log('✅ Preview configuré avec succès');
        
    } else {
        console.log('ℹ️ Aucune URL de site définie');
        
        if (previewOverlay) {
            previewOverlay.style.display = 'flex';
        }
        
        if (previewUrlBar) {
            previewUrlBar.style.display = 'none';
        }
    }

    const deviceButtons = document.querySelectorAll('.preview-device-btn');
    
    if (deviceButtons.length > 0) {
        deviceButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                deviceButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const device = btn.dataset.device;
                const wrapper = document.getElementById('previewFrameWrapper');
                
                if (wrapper) {
                    wrapper.className = `preview-frame-wrapper ${device}`;
                    console.log('📱 Device changé:', device);
                }
            });
        });
        console.log('✅ Device switcher configuré');
    }

    if (copyPreviewUrl && previewUrl) {
        copyPreviewUrl.addEventListener('click', () => {
            previewUrl.select();
            document.execCommand('copy');
            
            copyPreviewUrl.textContent = '✅';
            setTimeout(() => {
                copyPreviewUrl.textContent = '📋';
            }, 2000);
            
            console.log('📋 URL copiée');
        });
        console.log('✅ Copy URL configuré');
    }

    if (openPreviewNew) {
        openPreviewNew.addEventListener('click', () => {
            if (userData && userData.siteUrl) {
                window.open(userData.siteUrl, '_blank');
                console.log('🔗 Site ouvert dans nouvel onglet');
            }
        });
        console.log('✅ Open new tab configuré');
    }

    if (refreshPreview) {
        refreshPreview.addEventListener('click', () => {
            if (sitePreview && userData && userData.siteUrl) {
                sitePreview.src = userData.siteUrl + '?t=' + new Date().getTime();
                console.log('🔄 Preview rafraîchi');
            }
        });
        console.log('✅ Refresh configuré');
    }
}

const editProjectInfoBtn = document.getElementById('editProjectInfoBtn');
const editProjectModal = document.getElementById('editProjectModal');
const closeEditProjectModal = document.getElementById('closeEditProjectModal');
const editProjectForm = document.getElementById('editProjectForm');

if (editProjectInfoBtn) {
    editProjectInfoBtn.addEventListener('click', () => {
        const editProjectName = document.getElementById('editProjectName');
        const editProjectDesc = document.getElementById('editProjectDesc');
        const editProjectUrl = document.getElementById('editProjectUrl');

        if (editProjectName) editProjectName.value = userData.projectName || '';
        if (editProjectDesc) editProjectDesc.value = userData.projectDescription || '';
        if (editProjectUrl) editProjectUrl.value = userData.siteUrl || '';

        if (editProjectModal) editProjectModal.classList.add('open');
    });
}

if (closeEditProjectModal) {
    closeEditProjectModal.addEventListener('click', () => {
        if (editProjectModal) editProjectModal.classList.remove('open');
    });
}

if (editProjectForm) {
    editProjectForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const newName = document.getElementById('editProjectName')?.value.trim();
        const newDesc = document.getElementById('editProjectDesc')?.value.trim();
        const newUrl = document.getElementById('editProjectUrl')?.value.trim();

        try {
            const userDocRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userDocRef, {
                projectName: newName,
                projectDescription: newDesc,
                siteUrl: newUrl
            });

            userData.projectName = newName;
            userData.projectDescription = newDesc;
            userData.siteUrl = newUrl;

            renderProjectInfo();
            setupPreview();

            if (editProjectModal) editProjectModal.classList.remove('open');

            await addTimelineEvent('Informations projet mises à jour', '', 'done');
            await addNotification('Projet mis à jour avec succès ! ✅', 'success');

        } catch (error) {
            console.error('Error updating project:', error);
            alert('Erreur lors de la mise à jour');
        }
    });
}

// ===================================================================
// 🛠️ UTILITY FUNCTIONS
// ===================================================================

function generateReferralCode() {
    const name = (currentUser.displayName || currentUser.email)
        .toUpperCase()
        .replace(/[^A-Z]/g, '')
        .slice(0, 4);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${name}${random}`;
}

function formatDate(date) {
    if (!date) return 'N/A';
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
    });
}

function formatTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'À l\'instant';
    if (seconds < 3600) return `Il y a ${Math.floor(seconds / 60)} min`;
    if (seconds < 86400) return `Il y a ${Math.floor(seconds / 3600)} h`;
    return `Il y a ${Math.floor(seconds / 86400)} j`;
}

function getFileIcon(type) {
    if (type?.includes('pdf')) return '📄';
    if (type?.includes('image')) return '🖼️';
    if (type?.includes('video')) return '🎥';
    if (type?.includes('zip')) return '📦';
    return '📁';
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
}

// ===================================================================
// 🎯 EVENT LISTENERS
// ===================================================================

function setupEventListeners() {
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await signOut(auth);
                console.log("✅ Déconnecté");
                window.location.href = './login.html';
            } catch (error) {
                console.error('❌ Error signing out:', error);
            }
        });
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            themeToggle.textContent = document.body.classList.contains('light-theme') ? '☀️' : '🌙';
            localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
        });
        
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            themeToggle.textContent = '☀️';
        }
    }
    
    if (notificationsBtn && notificationsPanel) {
        notificationsBtn.addEventListener('click', () => {
            notificationsPanel.classList.toggle('open');
        });
    }
    
    if (closeNotifications && notificationsPanel) {
        closeNotifications.addEventListener('click', () => {
            notificationsPanel.classList.remove('open');
        });
    }
    
    if (chatTrigger && chatWindow) {
        chatTrigger.addEventListener('click', () => {
            chatWindow.classList.toggle('hidden');
        });
    }
    
    if (closeChat && chatWindow) {
        closeChat.addEventListener('click', () => {
            chatWindow.classList.add('hidden');
        });
    }
    
    if (chatSend) {
        chatSend.addEventListener('click', sendChatMessage);
    }
    
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }
    
    if (copyReferralCode && referralCode) {
        copyReferralCode.addEventListener('click', () => {
            referralCode.select();
            document.execCommand('copy');
            copyReferralCode.textContent = '✅ Copié';
            setTimeout(() => {
                copyReferralCode.textContent = '📋 Copier';
            }, 2000);
        });
    }
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            const sectionId = item.dataset.section;
            document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
            const targetSection = document.getElementById(`section-${sectionId}`);
            if (targetSection) targetSection.classList.add('active');
            
            const pageTitle = document.getElementById('pageTitle');
            const navLabel = item.querySelector('.nav-label');
            if (pageTitle && navLabel) {
                pageTitle.textContent = navLabel.textContent;
            }
            
            if (window.innerWidth < 1024 && sidebar) {
                sidebar.classList.remove('open');
            }
        });
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'A') {
            isAdmin = !isAdmin;
            console.log('🔧 Admin mode:', isAdmin ? 'ON ✅' : 'OFF ❌');
            
            if (adminBadge) {
                if (isAdmin) {
                    adminBadge.classList.add('visible');
                } else {
                    adminBadge.classList.remove('visible');
                }
            }
            
            renderSteps();
        }
    });
}

// ===================================================================
// 🚀 HIDE LOADING
// ===================================================================

function hideLoading() {
    if (loading) loading.classList.add('hidden');
    if (mainContent) mainContent.style.display = 'flex';
    setTimeout(() => {
        if (loading) loading.style.display = 'none';
    }, 500);
    console.log("✅ Dashboard chargé");
}

// ===================================================================
// 📊 AUTO-REFRESH
// ===================================================================

setInterval(() => {
    loadNotifications();
    loadChatMessages();
}, 30000);
// ELEMENTS
// ===== ELEMENTS DOM =====
const notifBtn = document.getElementById("notifBtn");
const notifPanel = document.getElementById("notifications");
const notifList = document.getElementById("notifList");
let notifBadge = document.getElementById("notifBadge");


// ===== OUVRIR / FERMER PANNEAU =====
if (notifBtn && notifPanel) {
  notifBtn.addEventListener("click", () => {
    notifPanel.classList.toggle("open");
  });
}

// =======================================================
// AUTH USER
// =======================================================

onAuthStateChanged(auth,(user)=>{

if(!user) return;

console.log("User connecté :", user.uid);

// =======================================================
// QUERY NOTIFICATIONS
// =======================================================

const q = query(
collection(db,"notifications"),
orderBy("timestamp","desc")
);
// =======================================================
// ECOUTE TEMPS REEL FIREBASE
// =======================================================

onSnapshot(q,(snapshot)=>{

if(!notifList) return;

notifList.innerHTML="";

let unreadCount = 0;

snapshot.forEach((docSnap)=>{

const data = docSnap.data();

// afficher seulement si notif pour cet utilisateur ou broadcast
if(data.broadcast || data.userId === user.uid){

if(!data.read) unreadCount++;

notifList.innerHTML += `
<div class="notif">

<h4>${data.title || ""}</h4>

<p>${data.message || ""}</p>

${data.documentUrl ? `
<a href="${data.documentUrl}" target="_blank" class="notif-doc">
📄 Télécharger le document
</a>
` : ""}

${data.link ? `
<a href="${data.link}" class="notif-action">
${data.buttonText || "Voir"}
</a>
` : ""}

${
!data.read
? `<button onclick="markNotifRead('${docSnap.id}')">
Marquer comme lu
</button>`
: `<span style="color:gray">Lu</span>`
}

</div>
`;

}

});


// =======================================================
// BADGE ROUGE
// =======================================================

if(notifBadge){

if(unreadCount > 0){

notifBadge.style.display="block";
notifBadge.textContent = unreadCount;

}else{

notifBadge.style.display="none";

}

}

});

});


// =======================================================
// MARQUER NOTIFICATION LUE
// =======================================================

window.markNotifRead = async function(id){

try{

await updateDoc(
doc(db,"notifications",id),
{ read:true }
);

}catch(error){

console.error("Erreur lecture notification :",error);

}

};
