// ======================================================
// FIREBASE IMPORTS
// ======================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";

import {
getFirestore,
collection,
query,
orderBy,
limit,
onSnapshot,
addDoc,
updateDoc,
doc,
getDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

import {
getAuth,
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-analytics.js";


// ======================================================
// FIREBASE CONFIG
// ======================================================

const firebaseConfig = {
apiKey: "AIzaSyDFdsNM9gOgVqDa_hMviIViEyJrMghETGg",
authDomain: "amandinelevelupcreation.firebaseapp.com",
projectId: "amandinelevelupcreation",
storageBucket: "amandinelevelupcreation.firebasestorage.app",
messagingSenderId: "782512340926",
appId: "1:782512340926:web:17d388181b2d9492fe83ef",
measurementId: "G-6H3EZ3K9L0"
};


// ======================================================
// INITIALISATION FIREBASE
// ======================================================

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);


// ======================================================
// VARIABLES
// ======================================================

let notificationsData = [];

const badgeCount = document.getElementById("badgeCount");
const notificationsList = document.getElementById("notificationsList");
const notificationsPanel = document.getElementById("notificationsPanel");
const notificationForm = document.getElementById("notificationForm");
const historyGrid = document.getElementById("historyGrid");
const toast = document.getElementById("toast");


// ======================================================
// ICONES
// ======================================================

const icons = {
info:"ℹ️",
success:"✅",
warning:"⚠️",
formation:"🎓",
service:"🛠️",
promotion:"🎉"
};


// ======================================================
// TOAST
// ======================================================

function showToast(message,duration=3000){

if(!toast) return;

toast.textContent = message;
toast.style.display="block";

setTimeout(()=>{
toast.style.display="none";
},duration);

}


// ======================================================
// FORMAT DATE
// ======================================================

function formatTime(timestamp){

if(!timestamp) return "";

const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);

const now = new Date();
const diff = now - date;

const minutes = Math.floor(diff/60000);
const hours = Math.floor(diff/3600000);
const days = Math.floor(diff/86400000);

if(minutes < 1) return "à l'instant";
if(minutes < 60) return `il y a ${minutes}m`;
if(hours < 24) return `il y a ${hours}h`;
if(days < 7) return `il y a ${days}j`;

return date.toLocaleDateString("fr-FR");

}


// ======================================================
// FIREBASE LISTENER NOTIFICATIONS
// ======================================================

const q = query(
collection(db,"notifications"),
orderBy("timestamp","desc"),
limit(50)
);

onSnapshot(q,(snapshot)=>{

notificationsData = snapshot.docs.map(docSnap=>({

id:docSnap.id,
...docSnap.data(),
read:docSnap.data().read || false

}));

renderNotifications();
renderHistory();

});


// ======================================================
// RENDER NOTIFICATIONS
// ======================================================

function renderNotifications(){

if(!notificationsList) return;

const unread = notificationsData.filter(n=>!n.read).slice(0,5);

if(unread.length === 0){

notificationsList.innerHTML = `
<div class="notifications-empty">
Aucune nouvelle notification
</div>
`;

if(badgeCount) badgeCount.classList.add("hidden");
return;

}

if(badgeCount){
badgeCount.textContent = unread.length;
badgeCount.classList.remove("hidden");
}

notificationsList.innerHTML = unread.map(notif=>`

<div class="notification-item unread">

<div class="notification-icon">
${icons[notif.type] || "📢"}
</div>

<div class="notification-content">

<div class="notification-title">
${notif.title}
</div>

<div class="notification-message">
${notif.message}
</div>

<div class="notification-time">
${formatTime(notif.timestamp)}
</div>

</div>

<button onclick="markAsRead('${notif.id}')">
Lire
</button>

</div>

`).join("");

}


// ======================================================
// MARQUER COMME LU
// ======================================================

window.markAsRead = async function(id){

await updateDoc(doc(db,"notifications",id),{
read:true
});

showToast("Notification marquée comme lue");

}


// ======================================================
// HISTORIQUE
// ======================================================

function renderHistory(){

if(!historyGrid) return;

if(notificationsData.length === 0){

historyGrid.innerHTML = `
<div class="notifications-empty">
Aucune notification
</div>
`;

return;

}

historyGrid.innerHTML = notificationsData.map(notif=>`

<div class="history-card ${notif.read ? "read":""}">

<div class="history-card-icon">
${icons[notif.type] || "📢"}
</div>

<div class="history-card-title">
${notif.title}
</div>

<div class="history-card-message">
${notif.message}
</div>

<div class="history-card-time">
${formatTime(notif.timestamp)}
</div>

</div>

`).join("");

}


// ======================================================
// SÉCURITÉ ADMIN
// ======================================================

onAuthStateChanged(auth,(user)=>{

if(!user){
window.location.href="login.html";
return;
}

if(user.uid !== "kYC7IKIezxdEZnUyHsddLLs0cDr2"){
alert("Accès refusé");
window.location.href="dashboard.html";
}

});


// ======================================================
// UPDATE PROJET CLIENT
// ======================================================

const btn = document.getElementById("updateProjectBtn");

if(btn){

btn.addEventListener("click",async()=>{

const userId = document.getElementById("clientUid").value;

const step1 = document.getElementById("step1").value;
const step2 = document.getElementById("step2").value;
const step3 = document.getElementById("step3").value;
const step4 = document.getElementById("step4").value;
const step5 = document.getElementById("step5").value;

const userRef = doc(db,"users",userId);
const snap = await getDoc(userRef);

if(!snap.exists()){
console.log("user introuvable");
return;
}

const data = snap.data();
const steps = data.steps || [];

steps.forEach(step=>{

if(step.id==="design") step.status=step1;
if(step.id==="mockup") step.status=step2;
if(step.id==="development") step.status=step3;
if(step.id==="seo") step.status=step4;
if(step.id==="launch") step.status=step5;

});

await updateDoc(userRef,{steps});

console.log("Projet mis à jour");

});

}


// ======================================================
// UPDATE STEP RAPIDE
// ======================================================

window.updateClientStep = async function(userId,stepId,newStatus){

const userRef = doc(db,"users",userId);

const snap = await getDoc(userRef);

if(!snap.exists()){
console.log("user introuvable");
return;
}

const data = snap.data();
const steps = data.steps || [];

const index = steps.findIndex(s=>s.id===stepId);

if(index===-1){
console.log("step introuvable");
return;
}

steps[index].status=newStatus;

await updateDoc(userRef,{steps});

console.log("step mise à jour");

}