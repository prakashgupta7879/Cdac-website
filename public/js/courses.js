// Javascript for About-Courses Page

// function1
function faqFunction1() {
  document.getElementById("faqDropdown1").classList.toggle("show");
}

window.onclick = function (event) {
  if (!event.target.matches('.dropdown-faq')) {
    var dropdowns = document.getElementsByClassName("faq-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

// function2
function faqFunction2() {
  document.getElementById("faqDropdown2").classList.toggle("show");
}

window.onclick = function (event) {
  if (!event.target.matches('.dropdown-faq')) {
    var dropdowns = document.getElementsByClassName("faq-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

// function3
function faqFunction3() {
  document.getElementById("faqDropdown3").classList.toggle("show");
}

window.onclick = function (event) {
  if (!event.target.matches('.dropdown-faq')) {
    var dropdowns = document.getElementsByClassName("faq-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

