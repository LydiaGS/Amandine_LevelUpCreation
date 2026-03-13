
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
serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-analytics.js";


// CONFIG FIREBASE
const firebaseConfig = {
apiKey: "AIzaSyDFdsNM9gOgVqDa_hMviIViEyJrMghETGg",
authDomain: "amandinelevelupcreation.firebaseapp.com",
projectId: "amandinelevelupcreation",
storageBucket: "amandinelevelupcreation.firebasestorage.app",
messagingSenderId: "782512340926",
appId: "1:782512340926:web:17d388181b2d9492fe83ef",
measurementId: "G-6H3EZ3K9L0"
};


// INITIALISER FIREBASE
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);


// VARIABLES
let notificationsData = [];

const badgeCount = document.getElementById("badgeCount");
const notificationsList = document.getElementById("notificationsList");
const notificationsPanel = document.getElementById("notificationsPanel");
const notificationForm = document.getElementById("notificationForm");
const historyGrid = document.getElementById("historyGrid");
const toast = document.getElementById("toast");


// ICÔNES
const icons = {
info:"ℹ️",
success:"✅",
warning:"⚠️",
formation:"🎓",
service:"🛠️",
promotion:"🎉"
};


// OUVRIR / FERMER PANEL
const notifBtn = document.getElementById("notificationsBadge");
const closeBtn = document.getElementById("closeNotifications");

if(notifBtn){
notifBtn.addEventListener("click",()=>{
notificationsPanel.classList.toggle("active");
});
}

if(closeBtn){
closeBtn.addEventListener("click",()=>{
notificationsPanel.classList.remove("active");
});
}


// TOAST MESSAGE
function showToast(message,duration=3000){

if(!toast) return;

toast.textContent = message;
toast.style.display="block";

setTimeout(()=>{
toast.style.display="none";
},duration);

}


// FORMAT DATE
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


// AFFICHER NOTIFICATIONS
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


// MARQUER COMME LU
window.markAsRead = async function(id){

try{

await updateDoc(doc(db,"notifications",id),{
read:true
});

showToast("Notification marquée comme lue");

}catch(error){

console.error(error);
showToast("Erreur");

}

}


// HISTORIQUE
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


// LISTENER FIREBASE TEMPS RÉEL
const q = query(
collection(db,"notifications"),
orderBy("timestamp","desc"),
limit(50)
);

onSnapshot(q,(snapshot)=>{

notificationsData = snapshot.docs.map(doc=>({

id:doc.id,
...doc.data(),
read:doc.data().read || false

}));

renderNotifications();
renderHistory();

},(error)=>{

console.error(error);
showToast("Erreur Firebase");

});


// ENVOYER NOTIFICATION
if(notificationForm){

notificationForm.addEventListener("submit",async(e)=>{

e.preventDefault();

const title = document.getElementById("notifTitle").value;
const message = document.getElementById("notifMessage").value;
const type = document.getElementById("notifType").value;
const userId = document.getElementById("notifUserId").value.trim();

const submitBtn = notificationForm.querySelector("button");
submitBtn.disabled=true;

try{

await addDoc(collection(db,"notifications"),{

title,
message,
type,
userId,
timestamp:serverTimestamp(),
read:false,
createdAt:new Date().toISOString()

});

notificationForm.reset();
showToast("Notification envoyée");

}catch(error){

console.error(error);
showToast("Erreur envoi");

}

submitBtn.disabled=false;

});

}
onAuthStateChanged(auth,(user)=>{

if(!user){
window.location.href = "login.html";
return;
}

if(user.uid !== "kYC7IKIezxdEZnUyHsddLLs0cDr2"){

alert("Accès refusé");
window.location.href = "dashboard.html";

}

});
console.log("✅ Admin notifications chargé");
