class App {
  async init() {
    try {
      const token = localStorage.getItem("key");
      if (
        typeof token === "undefined" ||
        token < 10 ||
        this.user_id === "undefined"
      ) {
        location.replace("signup.html");
      }

      this.getUserOrders(this.user_id);
      this.render();
    } catch (err) {
      console.log(err);
    }
  }

  status = ["Cancelled", "Pending", "Delivered"];
  user_id = localStorage.getItem("identifier");
  alert_msg = localStorage.getItem("message");

  render() {
    this.createNewOrder(this.user_id);
    if (this.alert_msg) {
      // Display alert on signup
      let el = document.getElementById("alert-div");
      // Remove all element in <div id="alert-div"/>
      while (el.firstChild) {
        el.removeChild(el.firstChild); // empty the <div id="alert-div" />
      }
      // Append new alert to the div and set alert type
      el.appendChild(this.displayAlert(this.alert_msg, "alert-success"));
    }
  }

  getUserOrders(user_id) {
    console.log("i am fetching ...");
    const url = `https://sheltered-atoll-75425.herokuapp.com/api/v1/parcels/${user_id}/parcels`;

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    fetch(url, {
      method: "GET",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data !== null) {
          // Create new fragment to batch DOM render
          let fragment = document.createDocumentFragment();
          // Iterate through the data list and append each order to the fragment
          for (let i = 0; i < data.length; i++) {
            let count = i + 1;
            fragment.appendChild(this.displayOrders(data[i], count));
          }

          let el = document.getElementById("table-body");
          // Remove all existing children/fragment from the <div id="table-body" /> DOM element
          while (el.firstChild) {
            el.removeChild(el.firstChild); // empty the <div id="table-body" />
          }
          // Add the new fragment to the DOM
          el.appendChild(fragment);
        }
      });
  }

  createNewOrder(user_id) {
    document.getElementById("order-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const pickup_location = document.getElementById("pickup_location").value;
      const destination = document.getElementById("destination").value;
      const recipient_name = document.getElementById("recipient-name").value;
      const recipient_phone = document.getElementById("recipient-phone").value;
      const description = document.getElementById("description").value;
      // Try to get price by distence from d two point from google maps
      const price = 45;
      const url = "https://sheltered-atoll-75425.herokuapp.com/api/v1/parcels";

      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      let data = {
        pickupLocation: pickup_location,
        destination: destination,
        recipient_name: recipient_name,
        recipient_phone: recipient_phone,
        description: description,
        price: price,
        userId: user_id,
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
          // Call to "getUserOrders" method to re-render DOM elements
          this.getUserOrders(user_id);

          // Call reset function to clear signup form
          document.getElementById("order-form").reset();
          location.reload("dashboard.html");
          localStorage.setItem("message", "New Parcel Order Created!");
          console.log(data);
        });
    });
  }

  displayOrders(
    { price, pickup_location, destination, _id, order_status },
    count
  ) {
    let el = document.createElement("div");
    el.className = "table-row";
    el.innerHTML = `
      <div class="table-body-cell">
         ${count}
      </div>
      <div class="table-body-cell">
        ${pickup_location}
      </div>
      <div class="table-body-cell">
        ${destination}
      </div>
      <div class="table-body-cell">
        &#8358; ${price}
      </div>
      
      <div class="table-body-cell">
      ${
        order_status === 1
          ? `<a href="edit_order.html?id=${_id}"> Edit / Cancel Order </a>`
          : this.status[order_status]
      }
      </div>
      `;

    return el;
  }

  displayAlert(message, type) {
    let el = document.createElement("div");
    el.className = `alert ${type}`;
    el.innerHTML = `
    <span class="closebtn" onclick="this.parentElement.style.display='none'; localStorage.removeItem('message');">&times;</span> 
    <strong>${message}</strong> 
      `;

    return el;
  }
}
let app = new App();
app.init();
