
let confirmationResult, currentUserRole = "";

function initVTOP() {
  firebase.initializeApp(firebaseConfig);
  document.body.addEventListener("mousemove", resetTimer);
  document.body.addEventListener("keydown", resetTimer);
}

function sendOTP() {
  const phone = document.getElementById("phoneNumber").value.trim();
  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', { size: 'normal' });
  firebase.auth().signInWithPhoneNumber(phone, window.recaptchaVerifier)
    .then(result => { confirmationResult = result; document.getElementById("otpBox").style.display = "block"; })
    .catch(error => alert("Error: " + error.message));
}

function verifyOTP() {
  const code = document.getElementById("otp").value.trim();
  confirmationResult.confirm(code).then(result => {
    const user = result.user;
    showDashboard(user.phoneNumber);
  }).catch(error => alert("Invalid OTP: " + error.message));
}

function logout() {
  firebase.auth().signOut().then(() => location.reload());
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

function resetTimer() {
  // Reset idle timeout logic
}

function showDashboard(phone) {
  db.collection("students").doc(phone).get().then(doc => {
    if (doc.exists) {
      const data = doc.data();
      currentUserRole = data.role;
      document.getElementById("loginPage").style.display = "none";
      document.getElementById("mainUI").style.display = "block";
      document.querySelector(".sidebar ul").innerHTML = `
        <li onclick="loadPage('profile')">Profile</li>
        <li onclick="loadPage('grades')">Grades</li>
        <li onclick="loadPage('notifications')">Notifications</li>
        ${currentUserRole === 'admin' ? '<li onclick="loadPage(\'adminTools\')">Admin Tools</li>' : ''}
      `;
    }
  });
}
