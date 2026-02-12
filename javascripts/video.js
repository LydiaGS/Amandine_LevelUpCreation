const modal = document.querySelector("#modal");
const modalBody = document.querySelector("#modalBody");

function openModal(html) {
  modalBody.innerHTML = html;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeModal() {
  // stop la vidéo quand on ferme
  modalBody.innerHTML = "";
  modal.hidden = true;
  document.body.style.overflow = "";
}

document.querySelectorAll("[data-open]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const video = btn.dataset.video;

    if (video) {
      openModal(`
        <video controls autoplay muted playsinline style="width:100%;border-radius:16px">
          <source src="${video}" type="video/mp4">
          Ton navigateur ne supporte pas la vidéo.
        </video>
      `);
    }
  });
});

document.querySelectorAll("[data-close]").forEach((el) => {
  el.addEventListener("click", closeModal);
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.hidden) closeModal();
});