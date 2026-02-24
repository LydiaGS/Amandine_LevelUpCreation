// ===================================================================
// 📁 /javascripts/dashboard/main.js - CORE DASHBOARD
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
} from "../firebaseClient.js";

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
const sidebar = document.querySelector('.sidebar');
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
const toggleSidebarBtn = document.getElementById('toggleSidebar');
const themeToggle = document.getElementById('themeToggle');
const notificationsBtn = document.getElementById('notificationsBtn');
const notificationsPanel = document.getElementById('notificationsPanel');
const closeNotifications = document.getElementById('closeNotifications');
const notificationsList = document.getElementById('notificationsList');
const recentNotifsList = document.getElementById('recentNotifsList');
const notifBadge = document.getElementById('notifBadge');
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
            userData = {
                name: currentUser.displayName || currentUser.email.split('@')[0],
                email: currentUser.email,
                photoURL: currentUser.photoURL || null,
                projectName: 'Nouveau projet',
                projectDescription: '',
                projectStartDate: new Date(),
                projectEndDate: null,
                steps: defaultSteps,
                formations: [],
                documents: [],
                timeline: [],
                level: 1,
                xp: 0,
                earnedBadges: [],
                referralCode: generateReferralCode(),
                referrals: [],
                createdAt: new Date()
            };
            
            await setDoc(userDocRef, userData);
            console.log("✅ Document user créé");
            
            // Add welcome notification
            await addNotification('Bienvenue sur votre dashboard ! 🎉', 'success');
        }

        // Initialize missing fields
        if (!userData.level) userData.level = 1;
        if (!userData.xp) userData.xp = 0;
        if (!userData.earnedBadges) userData.earnedBadges = [];
        if (!userData.referralCode) userData.referralCode = generateReferralCode();
        if (!userData.referrals) userData.referrals = [];
        if (!userData.timeline) userData.timeline = [];
        if (!userData.documents) userData.documents = [];
        if (!userData.projectStartDate) userData.projectStartDate = new Date();

    } catch (error) {
        console.error('❌ Error loading user data:', error);
        alert('Erreur lors du chargement. Vérifiez la console (F12)');
    }
}

// ===================================================================
// 🎨 INITIALIZE DASHBOARD
// ===================================================================

function initializeDashboard() {
    // Display profile
    displayProfile();
    
    // Render all sections
    renderSteps();
    renderFormations();
    renderTimeline();
    renderDocuments();
    renderRoadmap();
    renderBadges();
    renderNotifications();
    
    // Calculate stats
    calculateGlobalProgress();
    calculateStats();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load notifications and chat
    loadNotifications();
    loadChatMessages();
}

// ===================================================================
// 👤 DISPLAY PROFILE
// ===================================================================

function displayProfile() {
    // Profile photo
    const photoURL = userData.photoURL || 
        `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=df437c&color=fff&size=200`;
    
    profilePhoto.src = photoURL;
    topbarPhoto.src = photoURL;
    
    // User info
    userName.textContent = userData.name || 'Utilisateur';
    topbarName.textContent = userData.name?.split(' ')[0] || 'User';
    userEmail.textContent = userData.email || currentUser.email;
    projectName.textContent = `Projet: ${userData.projectName || 'Non défini'}`;
    
    // Stats
    statLevel.textContent = userData.level || 1;
    statPoints.textContent = userData.xp || 0;
    statBadges.textContent = userData.earnedBadges?.length || 0;
    userLevelDisplay.textContent = userData.level || 1;
    currentXP.textContent = userData.xp || 0;
    
    // Calculate next level XP
    const nextLevel = (userData.level || 1) + 1;
    const xpNeeded = nextLevel * 100;
    nextLevelXP.textContent = xpNeeded;
    
    const xpProgress = ((userData.xp || 0) / xpNeeded) * 100;
    levelProgressFill.style.width = `${xpProgress}%`;
    
    // Referral
    referralCode.value = userData.referralCode || 'LOADING...';
    referralCount.textContent = userData.referrals?.length || 0;
    referralEarnings.textContent = (userData.referrals?.length || 0) * 10;
}

// ===================================================================
// 📋 RENDER STEPS
// ===================================================================

function renderSteps() {
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
    if (!isAdmin) return;
    
    try {
        const stepIndex = userData.steps.findIndex(s => s.id === stepId);
        if (stepIndex !== -1) {
            const oldStatus = userData.steps[stepIndex].status;
            userData.steps[stepIndex].status = newStatus;
            
            if (newStatus === 'done') {
                userData.steps[stepIndex].date = new Date().toISOString();
                
                // Add to timeline
                await addTimelineEvent(`✅ Étape "${userData.steps[stepIndex].title}" terminée`);
                
                // Add notification
                await addNotification(`Étape "${userData.steps[stepIndex].title}" complétée ! 🎉`, 'success');
                
                // Award XP
                await addXP(20, `Étape "${userData.steps[stepIndex].title}" terminée`);
                
                // Check for badges
                await checkAndAwardBadges();
            }
            
            const userDocRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userDocRef, { 
                steps: userData.steps,
                timeline: userData.timeline
            });

            renderSteps();
            calculateGlobalProgress();
            calculateStats();
            renderTimeline();
            
            console.log("✅ Step mis à jour:", stepId, "→", newStatus);
        }
    } catch (error) {
        console.error('❌ Error updating step:', error);
        alert('Erreur lors de la mise à jour');
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

    globalProgress.textContent = `${roundedProgress}%`;
    progressFill.style.width = `${roundedProgress}%`;
    
    statStepsCompleted.textContent = `${completedSteps}/${totalSteps}`;
}

// ===================================================================
// 📊 CALCULATE STATS
// ===================================================================

function calculateStats() {
    // Days elapsed
    const startDate = userData.projectStartDate?.toDate ? userData.projectStartDate.toDate() : new Date(userData.projectStartDate);
    const today = new Date();
    const daysElapsed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    statDaysElapsed.textContent = daysElapsed;
    
    // Days remaining
    if (userData.projectEndDate) {
        const endDate = userData.projectEndDate.toDate ? userData.projectEndDate.toDate() : new Date(userData.projectEndDate);
        const daysRemaining = Math.floor((endDate - today) / (1000 * 60 * 60 * 24));
        statDaysRemaining.textContent = daysRemaining > 0 ? daysRemaining : '0';
    } else {
        statDaysRemaining.textContent = '-';
    }
    
    // Formations progress
    if (userData.formations && userData.formations.length > 0) {
        const totalModules = userData.formations.reduce((acc, f) => {
            const formation = availableFormations.find(af => af.id === f.id);
            return acc + (formation?.totalModules || 0);
        }, 0);
        
        const completedModules = userData.formations.reduce((acc, f) => acc + (f.completedModules || 0), 0);
        
        const formationProgress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
        statFormationsProgress.textContent = `${formationProgress}%`;
    } else {
        statFormationsProgress.textContent = '0%';
    }
}

// ===================================================================
// 🎓 RENDER FORMATIONS
// ===================================================================

function renderFormations() {
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
    // window.location.href = `./formation.html?id=${formationId}`;
};

// ===================================================================
// 📅 RENDER TIMELINE
// ===================================================================

function renderTimeline() {
    if (!timelineContainer) return;
    
    timelineContainer.innerHTML = '';
    
    const timeline = userData.timeline || [];
    
    if (timeline.length === 0) {
        timelineContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📅</div>
                <p>Aucun événement pour le moment</p>
            </div>
        `;
        return;
    }
    
    // Sort by date (most recent first)
    const sortedTimeline = [...timeline].sort((a, b) => {
        const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date);
        const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date);
        return dateB - dateA;
    });
    
    sortedTimeline.forEach((event, index) => {
        const timelineItem = document.createElement('div');
        timelineItem.className = `timeline-item ${event.type || ''}`;
        
        const eventDate = event.date?.toDate ? event.date.toDate() : new Date(event.date);
        
        timelineItem.innerHTML = `
            <span class="timeline-date">${formatDate(eventDate)}</span>
            <p>${event.message}</p>
        `;
        
        timelineContainer.appendChild(timelineItem);
    });
}

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
        const q = query(notifRef, where('userId', '==', currentUser.uid), orderBy('createdAt', 'desc'), limit(10));
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
    // Render in panel
    if (notificationsList) {
        notificationsList.innerHTML = '';
        
        if (notifications.length === 0) {
            notificationsList.innerHTML = '<p style="text-align: center; color: var(--muted); padding: 20px;">Aucune notification</p>';
        } else {
            notifications.forEach(notif => {
                const notifEl = document.createElement('div');
                notifEl.className = `notification-item ${notif.read ? '' : 'new'} ${notif.type || ''}`;
                
                const time = notif.createdAt?.toDate ? formatTimeAgo(notif.createdAt.toDate()) : 'À l\'instant';
                
                notifEl.innerHTML = `
                    <p>${notif.message}</p>
                    <span class="notification-time">${time}</span>
                `;
                
                notifEl.addEventListener('click', () => markNotificationAsRead(notif.id));
                
                notificationsList.appendChild(notifEl);
            });
        }
    }
    
    // Render recent in dashboard
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
    
    // Update badge
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
        const q = query(chatRef, where('userId', '==', currentUser.uid), orderBy('createdAt', 'asc'));
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
    
    // Scroll to bottom
    chatMessages_el.scrollTop = chatMessages_el.scrollHeight;
    
    // Update badge
    unreadMessages = chatMessages.filter(m => m.from === 'admin' && !m.read).length;
    if (chatBadge) {
        chatBadge.textContent = unreadMessages;
        chatBadge.style.display = unreadMessages > 0 ? 'block' : 'none';
    }
}

async function sendChatMessage() {
    const message = chatInput.value.trim();
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
        
        // Simulate admin response (in real app, this would be handled by admin)
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

            // Delete old photo if exists
            if (userData.photoURL && userData.photoURL.includes('firebasestorage')) {
                try {
                    const oldPhotoRef = ref(storage, `profile-photos/${currentUser.uid}/avatar.jpg`);
                    await deleteObject(oldPhotoRef);
                    console.log('🗑️ Ancienne photo supprimée');
                } catch (err) {
                    console.log('ℹ️ Pas d\'ancienne photo à supprimer');
                }
            }

            // Upload new photo
            const storageRef = ref(storage, `profile-photos/${currentUser.uid}/avatar.jpg`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            console.log('✅ Photo uploadée:', downloadURL);

            // Update Firestore
            const userDocRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userDocRef, { photoURL: downloadURL });

            // Update Auth profile
            await updateProfile(currentUser, { photoURL: downloadURL });

            // Update local state
            userData.photoURL = downloadURL;
            profilePhoto.src = downloadURL;
            topbarPhoto.src = downloadURL;

            // Success animation
            photoContainer.classList.remove('uploading');
            profilePhoto.classList.add('uploaded');
            
            setTimeout(() => {
                profilePhoto.classList.remove('uploaded');
            }, 600);
            
            // Add to timeline
            await addTimelineEvent('📸 Photo de profil mise à jour');
            
            // Add notification
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
        document.getElementById('editName').value = userData.name || '';
        document.getElementById('editProjectName').value = userData.projectName || '';
        document.getElementById('editProjectDescription').value = userData.projectDescription || '';
        editProfileModal.classList.add('open');
    });
}

document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('open'));
    });
});

document.getElementById('editProfileForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const newName = document.getElementById('editName').value.trim();
    const newProjectName = document.getElementById('editProjectName').value.trim();
    const newProjectDescription = document.getElementById('editProjectDescription').value.trim();
    
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
        editProfileModal.classList.remove('open');
        
        await addTimelineEvent('✏️ Profil mis à jour');
        await addNotification('Profil mis à jour avec succès ! ✅', 'success');
        
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('Erreur lors de la mise à jour');
    }
});

// ===================================================================
// 🎮 GAMIFICATION
// ===================================================================

async function addXP(amount, reason) {
    userData.xp = (userData.xp || 0) + amount;
    
    // Check level up
    const newLevel = Math.floor(userData.xp / 100) + 1;
    if (newLevel > (userData.level || 1)) {
        userData.level = newLevel;
        await addNotification(`🎉 Level Up ! Vous êtes maintenant niveau ${newLevel} !`, 'success');
        await addTimelineEvent(`🎉 Passage niveau ${newLevel}`);
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
    
    // First step
    if (completedSteps >= 1 && !userData.earnedBadges.includes('first-step')) {
        badgesToAward.push('first-step');
    }
    
    // 50% progress
    if (progressPercent >= 50 && !userData.earnedBadges.includes('half-done')) {
        badgesToAward.push('half-done');
    }
    
    // 75% progress
    if (progressPercent >= 75 && !userData.earnedBadges.includes('almost-there')) {
        badgesToAward.push('almost-there');
    }
    
    // 100% completed
    if (progressPercent === 100 && !userData.earnedBadges.includes('completed')) {
        badgesToAward.push('completed');
    }
    
    // Award badges
    for (const badgeId of badgesToAward) {
        const badge = availableBadges.find(b => b.id === badgeId);
        if (badge) {
            userData.earnedBadges.push(badgeId);
            await addXP(badge.xp, `Badge "${badge.title}" débloqué`);
            await addNotification(`🏆 Badge débloqué : ${badge.title} ! +${badge.xp} XP`, 'success');
            await addTimelineEvent(`🏆 Badge "${badge.title}" débloqué`);
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
// 📅 TIMELINE
// ===================================================================

async function addTimelineEvent(message, type = 'completed') {
    if (!userData.timeline) userData.timeline = [];
    
    userData.timeline.push({
        message,
        type,
        date: new Date().toISOString()
    });
    
    // Keep only last 50 events
    if (userData.timeline.length > 50) {
        userData.timeline = userData.timeline.slice(-50);
    }
    
    renderTimeline();
}

// ===================================================================
// 🛠️ UTILITY FUNCTIONS
// ===================================================================

function generateReferralCode() {
    const name = (currentUser.displayName || currentUser.email).toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${name}${random}`;
}

function formatDate(date) {
    if (!date) return 'N/A';
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
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
    // Logout
    logoutBtn?.addEventListener('click', async () => {
        try {
            await signOut(auth);
            console.log("✅ Déconnecté");
            window.location.href = './login.html';
        } catch (error) {
            console.error('❌ Error signing out:', error);
        }
    });
    
    // Toggle sidebar
    toggleSidebarBtn?.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });
    
    // Theme toggle
    themeToggle?.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        themeToggle.textContent = document.body.classList.contains('light-theme') ? '☀️' : '🌙';
        localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
    });
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeToggle.textContent = '☀️';
    }
    
    // Notifications
    notificationsBtn?.addEventListener('click', () => {
        notificationsPanel.classList.toggle('open');
    });
    
    closeNotifications?.addEventListener('click', () => {
        notificationsPanel.classList.remove('open');
    });
    
    // Chat
    chatTrigger?.addEventListener('click', () => {
        chatWindow.classList.toggle('hidden');
    });
    
    closeChat?.addEventListener('click', () => {
        chatWindow.classList.add('hidden');
    });
    
    chatSend?.addEventListener('click', sendChatMessage);
    
    chatInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
    
    // Referral code copy
    copyReferralCode?.addEventListener('click', () => {
        referralCode.select();
        document.execCommand('copy');
        copyReferralCode.textContent = '✅ Copié';
        setTimeout(() => {
            copyReferralCode.textContent = '📋 Copier';
        }, 2000);
    });
    
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Update active nav
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // Show section
            const sectionId = item.dataset.section;
            document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
            document.getElementById(`section-${sectionId}`)?.classList.add('active');
            
            // Update page title
            const pageTitle = document.getElementById('pageTitle');
            if (pageTitle) {
                pageTitle.textContent = item.querySelector('.nav-label').textContent;
            }
            
            // Close sidebar on mobile
            if (window.innerWidth < 1024) {
                sidebar.classList.remove('open');
            }
        });
    });
    
    // Admin mode
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'A') {
            isAdmin = !isAdmin;
            console.log('🔧 Admin mode:', isAdmin ? 'ON ✅' : 'OFF ❌');
            
            if (isAdmin) {
                adminBadge.classList.add('visible');
            } else {
                adminBadge.classList.remove('visible');
            }
            
            renderSteps();
        }
    });
}

// ===================================================================
// 🚀 HIDE LOADING
// ===================================================================

function hideLoading() {
    loading.classList.add('hidden');
    mainContent.style.display = 'flex';
    setTimeout(() => loading.style.display = 'none', 500);
    console.log("✅ Dashboard chargé");
}

// ===================================================================
// 📊 AUTO-REFRESH
// ===================================================================

// Refresh notifications every 30 seconds
setInterval(() => {
    loadNotifications();
    loadChatMessages();
}, 30000);

console.log("🚀 Dashboard initialized");