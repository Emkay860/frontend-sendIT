class App {
  async init() {
    // Check if session storage contains "user role"
    let user_role = sessionStorage.getItem("role");
    if (typeof user_role === "undefined" || user_role !== "admin") {
      location.replace("/signup.html");
    }

    try {
      const token = localStorage.getItem("key");
      // Check if token/key and user_id is undefined or lessthan 10
      if (
        typeof token === "undefined" ||
        token < 10 ||
        this.user_id === "undefined"
      ) {
        location.replace("/signup.html");
      }

      // Check if url contains unique id of the parcel before rendering
      if (typeof this.getUrlParams(location.href).id !== "undefined") {
        this.render();
      } else {
        // Redirect user back to dashboard
        location.replace("/dashboard.html");
      }
    } catch (err) {
      console.log(err);
    }
  }
  render() {
    console.log(this.getUrlParams(location.href));
    let parcelId = this.getUrlParams(location.href).id;
    this.updateOrderPresentLocation(parcelId);
  }

  getUrlParams(url) {
    let params = {};
    let parser = document.createElement("a");
    parser.href = url;
    let query = parser.search.substring(1);
    let vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
      let pair = vars[i].split("=");
      params[pair[0]] = decodeURIComponent(pair[1]);
    }
    return params;
  }

  updateOrderPresentLocation(parcelId) {
    document
      .getElementById("update-order-form")
      .addEventListener("submit", (e) => {
        e.preventDefault();
        // Get modify button from DOM
        const btn = document.getElementById("btn-update-order");
        // Set btn innerHTML to loading image on click
        btn.innerHTML = `<img src="img/loading.gif"/>`;
        const user_id = localStorage.getItem("identifier");
        const token = localStorage.getItem("key");
        const present_location = document.getElementById("present-location")
          .value;
        const url = `https://sheltered-atoll-75425.herokuapp.com/api/v1/parcels/${parcelId}/presentLocation`;

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        let data = {
          presentLocation: present_location,
          user_id: user_id,
        };

        fetch(url, {
          method: "PATCH",
          cache: "no-cache",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          redirect: "follow",
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then((data) => {
            // Call reset function to clear signup form
            document.getElementById("update-order-form").reset();
            location.assign("/admin_panel.html");
            console.log(data);
          });
      });
  }

  // Contemplating loading whether to load all orderdetails
  // And pre-populate the input fields
  getOrderById(parcelId) {}
}

let app = new App();
app.init();
