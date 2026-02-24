// ===================================================================
// 📁 /javascripts/dashboard.js - VERSION AVEC UPLOAD PHOTO
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
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from "./firebaseClient.js";

// DOM Elements
const loading = document.getElementById('loading');
const mainContent = document.getElementById('mainContent');
const logoutBtn = document.getElementById('logoutBtn');
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

// Default steps
const defaultSteps = [
    { id: 'design', title: 'Design UI/UX', description: 'Création de la maquette et du design visuel', status: 'todo' },
    { id: 'mockup', title: 'Maquette', description: 'Validation du prototype interactif', status: 'todo' },
    { id: 'development', title: 'Développement', description: 'Développement du site web', status: 'todo' },
    { id: 'seo', title: 'SEO', description: 'Optimisation pour les moteurs de recherche', status: 'todo' },
    { id: 'launch', title: 'Mise en ligne', description: 'Déploiement et mise en production', status: 'todo' }
];

// Available formations
const availableFormations = [
    { id: 'html', title: 'HTML', icon: '📄', totalModules: 10 },
    { id: 'css', title: 'CSS', icon: '🎨', totalModules: 12 },
    { id: 'javascript', title: 'JavaScript', icon: '⚡', totalModules: 15 },
    { id: 'webdev', title: 'Web Development Complet', icon: '🚀', totalModules: 40 }
];

let currentUser = null;
let userData = null;
let isAdmin = false;

// ===================================================================
// 🔐 AUTHENTIFICATION
// ===================================================================

onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("✅ User connecté:", user.email);
        currentUser = user;
        await loadUserData(user.uid);
        hideLoading();
    } else {
        console.log("❌ User non connecté, redirection...");
        window.location.href = './login.html';
    }
});

// ===================================================================
// 📊 CHARGEMENT DONNÉES UTILISATEUR
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
                steps: defaultSteps,
                formations: [],
                createdAt: new Date()
            };
            
            await setDoc(userDocRef, userData);
            console.log("✅ Document user créé");
        }

        // Load photo
        displayProfilePhoto();

        // Display info
        userName.textContent = userData.name || 'Utilisateur';
        userEmail.textContent = userData.email || currentUser.email;
        projectName.textContent = `Projet: ${userData.projectName || 'Non défini'}`;

        // Initialize steps if empty
        if (!userData.steps || userData.steps.length === 0) {
            userData.steps = defaultSteps;
            await updateDoc(userDocRef, { steps: defaultSteps });
        }

        renderSteps();
        calculateGlobalProgress();
        renderFormations();

    } catch (error) {
        console.error('❌ Error loading user data:', error);
        alert('Erreur lors du chargement. Vérifiez la console (F12)');
    }
}

// ===================================================================
// 📸 AFFICHAGE PHOTO DE PROFIL
// ===================================================================

function displayProfilePhoto() {
    if (userData.photoURL) {
        profilePhoto.src = userData.photoURL;
    } else {
        profilePhoto.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=df437c&color=fff&size=200`;
    }
}

// ===================================================================
// 📤 UPLOAD PHOTO DE PROFIL
// ===================================================================

photoInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    // Vérifications
    if (!file.type.startsWith('image/')) {
        alert('⚠️ Veuillez sélectionner une image');
        return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB max
        alert('⚠️ L\'image ne doit pas dépasser 5MB');
        return;
    }

    try {
        // Afficher loading
        photoContainer.classList.add('uploading');
        console.log('📤 Upload en cours...');

        // Supprimer ancienne photo si existe
        if (userData.photoURL && userData.photoURL.includes('firebasestorage')) {
            try {
                const oldPhotoRef = ref(storage, `profile-photos/${currentUser.uid}/avatar.jpg`);
                await deleteObject(oldPhotoRef);
                console.log('🗑️ Ancienne photo supprimée');
            } catch (err) {
                console.log('ℹ️ Pas d\'ancienne photo à supprimer');
            }
        }

        // Upload nouvelle photo
        const storageRef = ref(storage, `profile-photos/${currentUser.uid}/avatar.jpg`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        console.log('✅ Photo uploadée:', downloadURL);

        // Mettre à jour Firestore
        const userDocRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userDocRef, { photoURL: downloadURL });

        // Mettre à jour Auth profile
        await updateProfile(currentUser, { photoURL: downloadURL });

        // Mettre à jour état local
        userData.photoURL = downloadURL;
        profilePhoto.src = downloadURL;

        // Animation de succès
        photoContainer.classList.remove('uploading');
        profilePhoto.classList.add('uploaded');
        
        setTimeout(() => {
            profilePhoto.classList.remove('uploaded');
        }, 600);

        console.log('✅ Photo de profil mise à jour avec succès !');

    } catch (error) {
        console.error('❌ Erreur upload photo:', error);
        alert('❌ Erreur lors de l\'upload. Réessayez.');
        photoContainer.classList.remove('uploading');
    }

    // Reset input
    photoInput.value = '';
});

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
// ✏️ UPDATE STEP STATUS (Admin)
// ===================================================================

window.updateStepStatus = async function(stepId, newStatus) {
    if (!isAdmin) return;
    
    try {
        const stepIndex = userData.steps.findIndex(s => s.id === stepId);
        if (stepIndex !== -1) {
            userData.steps[stepIndex].status = newStatus;
            
            const userDocRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userDocRef, { steps: userData.steps });

            renderSteps();
            calculateGlobalProgress();
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
    window.location.href = `./formation.html?id=${formationId}`;
};

// ===================================================================
// 🚪 LOGOUT
// ===================================================================

logoutBtn.addEventListener('click', async () => {
    try {
        await signOut(auth);
        console.log("✅ Déconnecté");
        window.location.href = './login.html';
    } catch (error) {
        console.error('❌ Error signing out:', error);
    }
});

function hideLoading() {
    loading.classList.add('hidden');
    mainContent.style.display = 'block';
    setTimeout(() => loading.style.display = 'none', 500);
    console.log("✅ Dashboard chargé");
}

// ===================================================================
// 🔧 ADMIN MODE (Ctrl+Shift+A)
// ===================================================================

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