document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".container");

  const showSignup = document.getElementById("showSignup");
  const showLogin = document.getElementById("showLogin");

  const bottomSignup = document.getElementById("bottomSignup");
  const bottomLogin = document.getElementById("bottomLogin");

  showSignup.addEventListener("click", (e) => {
    e.preventDefault();
    container.classList.add("active");
  });

  showLogin.addEventListener("click", (e) => {
    e.preventDefault();
    container.classList.remove("active");
  });


  bottomSignup.addEventListener("click", () => {
    container.classList.add("active");
  });

  bottomLogin.addEventListener("click", () => {
    container.classList.remove("active");
  });
});