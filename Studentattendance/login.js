// ===============================
// login.js - Fully Updated & Fixed
// ===============================

// helper: add spinner
function showButtonLoading(btn){
  btn.classList.add('loading');
  if(!btn.querySelector('.spinner')){
    const sp = document.createElement('span');
    sp.className = 'spinner';
    btn.prepend(sp);
  }
}

// helper: remove spinner
function hideButtonLoading(btn){
  btn.classList.remove('loading');
  const sp = btn.querySelector('.spinner');
  if(sp) sp.remove();
}

const loginForm = document.getElementById('login-form');
const loginCard = document.getElementById('login-card');
const loginBtn = document.getElementById('login-btn');

loginForm.addEventListener('submit', async function(e){
  e.preventDefault();

  if(!loginForm.checkValidity()){
    loginForm.classList.add('was-validated');
    return;
  }

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  showButtonLoading(loginBtn);
  await new Promise(res => setTimeout(res, 600));

  // ---------------------------
  // ADMIN LOGIN
  // ---------------------------
  if(username === "admin" && password === "Password@123"){
      
    sessionStorage.setItem("sas_logged_in", "true");
    sessionStorage.setItem("sas_user", "admin");

    redirectSuccess();
    return;
  }

  // ---------------------------
  // USER LOGIN (Registered users)
  // ---------------------------
  let savedUser = localStorage.getItem("attendance_user_" + username);

  if(!savedUser){
    return triggerError("User not found. Please register first.");
  }

  savedUser = JSON.parse(savedUser);

  if(savedUser.password !== password){
    return triggerError("Wrong password!");
  }

  // SAVE LOGIN SESSION
  sessionStorage.setItem("sas_logged_in", "true");
  sessionStorage.setItem("sas_user", username);
  sessionStorage.setItem("sas_user_fullname", savedUser.fullname);

  redirectSuccess();
});

// ---------------------------------------
// SUCCESS REDIRECT (FINAL FIXED VERSION)
// ---------------------------------------
function redirectSuccess(){
  loginCard.classList.add('success');
  loginBtn.textContent = "Logging in...";

  setTimeout(() => {
    // BEST redirect method — no history problem
    window.location.replace("index.html");
  }, 500);
}

// ---------------------------------------
// ERROR HANDLING (FIXED)
// ---------------------------------------
function triggerError(msg){
  hideButtonLoading(loginBtn);
  loginBtn.textContent = "Login";

  alert(msg);

  loginCard.classList.remove('success');
  loginCard.classList.remove('shake');
  void loginCard.offsetWidth;
  loginCard.classList.add('shake');

  const u = document.getElementById('username');
  const p = document.getElementById('password');

  u.classList.add('is-invalid');
  p.classList.add('is-invalid');

  setTimeout(() => {
    u.classList.remove('is-invalid');
    p.classList.remove('is-invalid');
  }, 1500);
}
