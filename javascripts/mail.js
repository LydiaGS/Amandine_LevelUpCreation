 const form = document.getElementById("quoteForm");
  const successMsg = document.getElementById("successMsg");

  form.addEventListener("submit", function(e){
    e.preventDefault();

    emailjs.sendForm(
      "service_jjxz4c6",
      "template_k9i1f5v",
      this
    )
    .then(() => {
      successMsg.hidden = false;
      form.reset();
    })
    .catch((error) => {
      alert("Erreur lors de l'envoi. Merci de réessayer.");
      console.error("EmailJS error:", error);
    });
  });