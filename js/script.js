// Check if user is signedIn and token key is set
// window.addEventListener("load", function (event) {
//   if (typeof key === "undefined" || key === null || key < 10) {
//     // location.replace("signup.html");
//     // return;
//   }
// });

function toggleNavbar(event) {
  // Prevent default link behaviour
  event.preventDefault();

  // Get the navigation element
  var x = document.getElementById("myTopnav");

  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

function toggleSignup(event) {
  event.preventDefault();
  // Get the signup form
  let x = document.getElementById("signup-div");

  // Get the login form
  let y = document.getElementById("login-div");

  // Check if classname contains the hide class and hide form after 0.6secs delay if it does
  if (!x.className.includes("hide")) {
    x.className = x.className + " hide";
    setTimeout(function () {
      x.style.display = "none";
      y.className = y.className.replace("hide", "");
      y.style.display = "block";
    }, 600);
  } else if (!y.className.includes("hide")) {
    y.className = y.className + " hide";
    setTimeout(function () {
      y.style.display = "none";
      x.className = x.className.replace("hide", "");
      x.style.display = "block";
    }, 600);
  }
}

function toggleCreateOrderModal() {
  var modal = document.getElementById("create-order-modal");

  // Get the button that opens the modal
  var btn = document.getElementById("create-order-btn");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks the button, open the modal
  modal.style.display = "block";

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  };

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}
