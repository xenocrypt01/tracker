const auth = firebase.auth();
const db = firebase.database();

auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById("auth").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
    document.getElementById("userEmail").textContent = user.email;
    loadLocation();
  } else {
    document.getElementById("auth").style.display = "block";
    document.getElementById("dashboard").style.display = "none";
  }
});

function register() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  auth.createUserWithEmailAndPassword(email, pass).catch(alert);
}

function login() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  auth.signInWithEmailAndPassword(email, pass).catch(alert);
}

function logout() {
  auth.signOut();
}

function saveLocation() {
  fetch("https://ipapi.co/json/")
    .then(res => res.json())
    .then(data => {
      const user = auth.currentUser;
      if (user) {
        db.ref("locations/" + user.uid).set({
          city: data.city,
          region: data.region,
          country: data.country_name,
          ip: data.ip,
          time: new Date().toLocaleString()
        });
        loadLocation();
      }
    });
}

function loadLocation() {
  const user = auth.currentUser;
  if (!user) return;
  db.ref("locations/" + user.uid).once("value").then(snapshot => {
    document.getElementById("locationData").textContent =
      JSON.stringify(snapshot.val(), null, 2) || "No data";
  });
}
