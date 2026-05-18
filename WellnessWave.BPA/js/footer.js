/*
  js/footer.js
  -----------
  Small script to wire the footer's "Monthly Gentle Updates" link
  (the element with id `footer-signup-trigger`) to open the signup modal.

  Notes:
  - This file intentionally keeps behavior minimal: it simply shows
    the signup modal, relying on the modal's own script (`js/ui.js`)
    to manage form behavior and translations.
  - Uses optional chaining so the script is safe when the element is
    not present on a page.
*/
document
  .getElementById("footer-signup-trigger")
  ?.addEventListener("click", () => {
    document.getElementById("signupModal").removeAttribute("hidden");
    document.getElementById("signupModal").classList.add("show");
  });