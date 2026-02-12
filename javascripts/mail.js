

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("quoteForm");
  const successMsg = document.getElementById("successMsg");

  if (!form) return;


  const EMAILJS_PUBLIC_KEY = "uxZcJJCuE7h_IO835";
  const EMAILJS_SERVICE_ID = "service_bt9an7x";
  const EMAILJS_TEMPLATE_ID = "template_bjg7elq";


  if (window.emailjs?.init) {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  } else {
    console.error("EmailJS n'est pas chargé. Ajoute le script EmailJS dans ton HTML.");
    return;
  }

  const btn = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async (e) => {
    e.preventDefault();


    const oldText = btn?.textContent || "ENVOYER MA DEMANDE";
    if (btn) {
      btn.disabled = true;
      btn.textContent = "ENVOI EN COURS...";
    }
    if (successMsg) successMsg.hidden = true;


    const data = {
      prenom: (form.prenom?.value || "").trim(),
      nom: (form.nom?.value || "").trim(),
      tel: (form.tel?.value || "").trim(),
      email: (form.email?.value || "").trim(),
      projet: (form.projet?.value || "").trim(),
      page: window.location.href,
      date: new Date().toLocaleString("fr-BE"),
    };


    if (!data.prenom || !data.nom || !data.email || !data.projet) {
      alert("Merci de remplir les champs obligatoires.");
      if (btn) {
        btn.disabled = false;
        btn.textContent = oldText;
      }
      return;
    }

    try {

      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, data);


      form.reset();
      if (successMsg) {
        successMsg.hidden = false;
        setTimeout(() => (successMsg.hidden = true), 6000);
      }
    } catch (err) {
      console.error("EmailJS error:", err);
      alert("Oups, l’envoi a échoué. Réessaie dans quelques minutes.");
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = oldText;
      }
    }
  });
});
