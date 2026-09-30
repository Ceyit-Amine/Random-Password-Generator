const btn = document.querySelector(".btn");
const input = document.querySelector(".input");
const copyTxt = document.querySelector(".fa-copy");
const alert_container = document.querySelector(".alert_container");
const lengthnum = document.querySelector(".Length");
const lengthValue = document.querySelector(".length-value");
const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = themeToggle.querySelector("i");
const strengthBars = document.querySelector(".strength-bars");
const strengthText = document.querySelector(".strength-text");

// Checkbox values
const symbols = document.querySelector(".symbols");
const numbers = document.querySelector(".numbers");
const lowercase = document.querySelector(".lowercase");
const uppercase = document.querySelector(".uppercase");
const checkboxes = [symbols, numbers, lowercase, uppercase];

// ---------- Theme: dark from 7 PM to 7 AM ----------
function setTheme(theme, remember = true) {
  if (theme === "dark") {
    document.body.setAttribute("data-theme", "dark");
    themeIcon.classList.replace("fa-moon", "fa-sun");
  } else {
    document.body.removeAttribute("data-theme");
    themeIcon.classList.replace("fa-sun", "fa-moon");
  }
  if (remember) localStorage.setItem("theme", theme);
}

function autoTheme() {
  const hour = new Date().getHours();
  return hour >= 19 || hour < 7 ? "dark" : "light";
}

// Follow the clock, unless the user picked a theme manually
const savedTheme = localStorage.getItem("theme");
setTheme(savedTheme || autoTheme(), false);

// Re-check the clock every minute so it flips at 7 AM / 7 PM
setInterval(() => {
  if (!localStorage.getItem("theme")) setTheme(autoTheme(), false);
}, 60000);

themeToggle.addEventListener("click", function () {
  const isDark = document.body.getAttribute("data-theme") === "dark";
  setTheme(isDark ? "light" : "dark");
});

// ---------- Length slider ----------
lengthnum.addEventListener("input", function () {
  lengthValue.innerText = lengthnum.value;
  updateStrength();
});

// ---------- Strength meter ----------
function updateStrength() {
  const typesSelected = checkboxes.filter((el) => el.checked).length;
  const len = Number(lengthnum.value);
  let level = 0;

  if (typesSelected > 0) {
    level = typesSelected;
    if (len >= 12) level++;
    if (len >= 16) level++;
    level = Math.min(level, 4);
  }

  strengthBars.className =
    "strength-bars" + (level > 0 ? ` level-${level}` : "");
  strengthText.innerText = ["—", "Weak", "Medium", "Strong", "Very strong"][
    level
  ];
}

checkboxes.forEach((el) => el.addEventListener("change", updateStrength));
updateStrength();

btn.addEventListener("click", function () {
  genPass();
});

// Random Random Char
function generateRandomChar(min, max) {
  const limit = max - min - 1;
  return String.fromCharCode(Math.floor(Math.random() * limit) + min);
}

// capital values
function capitalValue() {
  return generateRandomChar(65, 90);
}

// lower values
function smallValue() {
  return generateRandomChar(97, 122);
}

// numbers
function numbersValues() {
  return generateRandomChar(48, 57);
}

//symbols
function symbolsValues() {
  const symbols = "~!@#$%^&*()_+{}|:<>?";
  return symbols[Math.floor(Math.random() * symbols.length)];
}

const functionArray = [
  {
    element: numbers,
    fun: numbersValues,
  },

  {
    element: uppercase,
    fun: capitalValue,
  },

  {
    element: lowercase,
    fun: smallValue,
  },

  {
    element: symbols,
    fun: symbolsValues,
  },
];

// Generate Password
function genPass() {
  let password = "";
  const limit = lengthnum.value;

  const funArray = functionArray.filter(({ element }) => element.checked);

  if (limit >= 6) {
    if (
      symbols.checked ||
      numbers.checked ||
      lowercase.checked ||
      uppercase.checked
    ) {
      for (let i = 0; i < limit; i++) {
        const index = Math.floor(Math.random() * funArray.length);
        const letters = funArray[index].fun();
        password += letters;
        input.value = password;
        alert_container.innerText = password + " Copied ";
      }
    } else {
      displayMessage(alert_container, "active");
      alert_container.innerHTML = "Please select at least one checkbox";
    }
  } else {
    displayMessage(alert_container, "active");
    alert_container.innerHTML = "Please Enter at least 6 characters";
  }
}

// generate even on btn copy
copyTxt.addEventListener("click", function () {
  copyPassword();
  displayMessage(alert_container, "active");
});

// copy function
function copyPassword() {
  input.select();
  input.setSelectionRange(0, 1000);
  navigator.clipboard.writeText(input.value);
}

// display message
function displayMessage(Message, ClassName) {
  Message.classList.add(ClassName);
  setTimeout(() => {
    Message.classList.remove("active");
  }, 5000);
}
