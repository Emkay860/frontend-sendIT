class App {
  async init() {
    try {
      const token = localStorage.getItem("key");
      // Check if token/key and user_id is undefined or lessthan 10
      if (
        typeof token === "undefined" ||
        token < 10 ||
        this.user_id === "undefined"
      ) {
        location.replace("signup.html");
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
    this.editOrder(parcelId);
    this.cancelOrder(parcelId);
    this.getOrderById(parcelId);
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

  editOrder(parcelId) {
    document
      .getElementById("edit-order-form")
      .addEventListener("submit", (e) => {
        e.preventDefault();
        // Get modify button from DOM
        const btn = document.getElementById("btn-edit-order");
        // Set btn innerHTML to loading image on click
        btn.innerHTML = `<img src="img/loading.gif"/>`;

        const destination = document.getElementById("destination").value;
        // Try to get price by distence from d two point from google maps
        const price = 45;
        const url = `https://sheltered-atoll-75425.herokuapp.com/api/v1/parcels/${parcelId}/destination`;

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        let data = {
          destination: destination,
          price: price,
        };

        fetch(url, {
          method: "PATCH",
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
            document.getElementById("edit-order-form").reset();
            location.assign("/dashboard.html");
            console.log(data);
          });
      });
  }

  cancelOrder(parcelId) {
    document
      .getElementById("btn-cancel-order")
      .addEventListener("click", (e) => {
        e.preventDefault();

        // Get modify button from DOM
        const btn = document.getElementById("btn-cancel-order");
        // Set btn innerHTML to loading image on click
        btn.innerHTML = `<img src="img/loading.gif"/>`;

        const url = `https://sheltered-atoll-75425.herokuapp.com/api/v1/parcels/${parcelId}/cancel`;

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        fetch(url, {
          method: "PATCH",
          cache: "no-cache",
          headers: {
            "Content-Type": "application/json",
          },
          redirect: "follow",
        })
          .then((response) => response.json())
          .then((data) => {
            location.replace("/dashboard.html");
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
