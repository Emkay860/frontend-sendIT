class App {
  async init() {
    try {
      // Check if session storage contains "user role"
      if (sessionStorage.getItem("role") !== "admin") {
        location.replace("signup.html");
      } else {
        this.getAllOrders();
        this.render();
      }
    } catch (err) {
      console.log(err);
    }
  }

  status = ["Cancelled", "Pending", "Delivered"];
  alert_msg = localStorage.getItem("message");

  render() {
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

  getAllOrders() {
    console.log("i am fetching ...");
    const url = `https://sheltered-atoll-75425.herokuapp.com/api/v1/parcels/`;

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

  displayOrders(
    {
      price,
      pickup_location,
      recipient_name,
      recipient_phone,
      destination,
      _id,
      description,
      order_status,
    },
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
        ${recipient_name}
      </div>
      <div class="table-body-cell">
        ${recipient_phone}
      </div>
      <div class="table-body-cell">
        ${destination}
      </div>
      <div class="table-body-cell">
        ${description}
      </div>
      <div class="table-body-cell">
        &#8358; ${price}
      </div>
      
      <div class="table-body-cell">
      ${
        order_status === 1
          ? `<a href="update_order.html?id=${_id}"> Update parcel Location </a>`
          : ""
      }
      </div>
      <div class="table-body-cell">
      ${
        order_status === 1
          ? `<button name="btn-update-order" id="btn-update-order"
          class="btn btn-success"> Deliver parcel
      </button>`
          : this.status[order_status]
      }
      </div>
      `;

    // Check if the parcel delivery status is pending
    if (order_status === 1) {
      // when the <button> update status link is clicked
      el.querySelector("#btn-update-order").addEventListener(
        "click",
        (event) => {
          event.preventDefault();
          this.updateDeliveryStatus(_id);
        }
      );
    }

    return el;
  }

  updateDeliveryStatus(parcelId) {
    console.log(parcelId);
    const user_id = localStorage.getItem("identifier");
    const token = localStorage.getItem("key");
    const url = `https://sheltered-atoll-75425.herokuapp.com/api/v1/parcels/${parcelId}/status`;

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let data = {
      orderStatus: 2,
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
        localStorage.setItem("message", "Parcel status changed to Delivered!");
        location.reload("admin_panel.html");
        console.log(data);
      });
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
