const userName = document.getElementById("username");
const passWord = document.getElementById("password");

function login() {
  if (userName.value === "admin" && passWord.value === "admin123") {
    window.location.assign(`./home.html`);
  } else {
    window.alert("Wrong Credentials");
  }
}
