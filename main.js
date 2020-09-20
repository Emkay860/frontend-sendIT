class App {
  init() {
    this.render();
  }
  render() {
    this.signup();
    this.login();
  }

  signup() {
    document.getElementById("signup-form").addEventListener("submit", (e) => {
      e.preventDefault();

      // Display loading image
      this.displayLoading("btn-signup", `<img src="img/loading.gif"/>`);

      const firstname = document.getElementById("firstname").value;
      const lastname = document.getElementById("lastname").value;
      const email = document.getElementById("email").value;
      const phone_number = document.getElementById("phone-number").value;
      const password = document.getElementById("password").value;
      const url =
        "https://sheltered-atoll-75425.herokuapp.com/api/v1/auth/signup";

      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      let data = {
        firstname: firstname,
        lastname: lastname,
        email: email,
        phone_number: phone_number,
        password: password,
      };

      fetch(url, {
        method: "POST",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          // Display alert on signup
          let el = document.getElementById("alert-div");
          // Remove all element in <div id="alert-div"/>
          while (el.firstChild) {
            el.removeChild(el.firstChild); // empty the <div id="alert-div" />
          }
          if (data.hasOwnProperty("error")) {
            // Append new alert to the div and set alert type
            el.appendChild(this.displayAlert(data.error, "alert-danger"));
          } else {
            // Append new alert to the div and set alert type
            el.appendChild(this.displayAlert(data, "alert-success"));

            // Set email and password field for login page
            document.getElementById("login-email").value = email;
            document.getElementById("login-password").value = password;

            // Simulate button click to activate login form event listener
            document.getElementById("btn-login").click();
          }

          // Call reset function to clear signup form
          document.getElementById("signup-form").reset();
          console.log(data);
        });
    });
  }

  login() {
    document.getElementById("login-form").addEventListener("submit", (e) => {
      e.preventDefault();

      this.displayLoading("btn-login", `<img src="img/loading.gif"/>`);

      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;
      const url =
        "https://sheltered-atoll-75425.herokuapp.com/api/v1/auth/login";

      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      let data = {
        email: email,
        password: password,
      };

      fetch(url, {
        method: "POST",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          // Save user token and id into localstorage
          localStorage.setItem("identifier", data.user_id);
          localStorage.setItem("key", data.token);
          // Call reset function to reset login form
          document.getElementById("login-form").reset();
          if (data.role === "admin") {
            // Set session and redirect admin to seperate dashboard
            sessionStorage.setItem("role", data.role);
            location.replace("admin_panel.html");
          } else if (data.role === "user") {
            // Reirect user to dashboard
            location.replace("dashboard.html");
          } else {
            // Display alert on login
            let el = document.getElementById("alert-div");
            // Remove all element in <div id="alert-div"/>
            while (el.firstChild) {
              el.removeChild(el.firstChild); // empty the <div id="alert-div" />
            }
            // Append new alert to the div and set alert type
            el.appendChild(this.displayAlert(data, "alert-danger"));

            this.displayLoading("btn-login", "Login");
          }
          console.log(data);
        });
    });
  }

  displayAlert(message, type) {
    let el = document.createElement("div");
    el.className = `alert ${type}`;
    el.innerHTML = `
    <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span> 
    <strong>${message}</strong> 
      `;

    return el;
  }

  displayLoading(btnId, value) {
    // Get modify Login button from DOM
    const btn = document.getElementById(btnId);
    // Set btn innerHTML to loading image on click
    btn.innerHTML = value;
  }
}

let app = new App();
app.init();
