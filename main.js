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
      const firstname = document.getElementById("firstname").value;
      const lastname = document.getElementById("lastname").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const url =
        "https://sheltered-atoll-75425.herokuapp.com/api/v1/auth/signup";

      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      let data = {
        firstname: firstname,
        lastname: lastname,
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
          // Call reset function to clear signup form
          document.getElementById("signup-form").reset();
          // Display alert on signup
          let el = document.getElementById("alert-div");
          // Remove all element in <div id="alert-div"/>
          while (el.firstChild) {
            el.removeChild(el.firstChild); // empty the <div id="alert-div" />
          }
          // Append new alert to the div and set alert type
          el.appendChild(this.displayAlert(data, "alert-success"));

          console.log(data);
        });
    });
  }

  login() {
    document.getElementById("login-form").addEventListener("submit", (e) => {
      e.preventDefault();

      // Get modify button from DOM
      const btn = document.getElementById("btn-login");
      // Set btn innerHTML to loading image on click
      btn.innerHTML = `<img src="img/loading.gif"/>`;

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
            sessionStorage.setItem("role", data.role);
            location.replace("frontend-sendIT/admin_panel.html");
          } else {
            location.replace("frontend-sendIT/dashboard.html");
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
    // // when the 'x' delete link is clicked
    // el.querySelector('a').addEventListener('click', (event) => {
    //   event.preventDefault()
    //   this.deleteMeal(id)
    //   el.remove()
    // })
    return el;
  }
}

let app = new App();
app.init();
