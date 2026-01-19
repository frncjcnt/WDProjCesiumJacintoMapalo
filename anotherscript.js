document.addEventListener("DOMContentLoaded", () => {

  // Get elements
  const container = document.querySelector(".container");
  const showSignup = document.getElementById("showSignup");
  const showLogin = document.getElementById("showLogin");
  const bottomSignup = document.getElementById("bottomSignup");
  const bottomLogin = document.getElementById("bottomLogin");

  // Function to show signup
  function openSignup() {
    container.classList.add("active");
  }

  // Function to show login
  function openLogin() {
    container.classList.remove("active");
  }

  // Add event listeners
  showSignup.addEventListener("click", (e) => {
    e.preventDefault();
    openSignup();
  });

  showLogin.addEventListener("click", (e) => {
    e.preventDefault();
    openLogin();
  });

  bottomSignup.addEventListener("click", openSignup);
  bottomLogin.addEventListener("click", openLogin);

});