/* Flower shower */
const flowerStream = document.querySelector(".flower-stream");

const flowers = ["🌸", "🌺", "🌼"];

function createFlower() {
    const flower = document.createElement("div");
    flower.classList.add("flower");

    flower.innerHTML = flowers[Math.floor(Math.random() * flowers.length)];

    flower.style.left = Math.random() * 80 + 10 + "%";
    flower.style.fontSize = Math.random() * 7 + 15 + "px";
    flower.style.animationDuration = Math.random() * 1.5 + 3.5 + "s";

    flowerStream.appendChild(flower);

    setTimeout(() => {
        flower.remove();
    }, 5500);
}

setInterval(createFlower, 800);


/* Login flow */
const mobileInput = document.getElementById("mobileInput");
const passwordBox = document.getElementById("passwordBox");
const passwordInput = document.getElementById("passwordInput");
const loginForm = document.getElementById("loginForm");

/* Only numbers allowed */
mobileInput.addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9]/g, "");

    if (this.value.length === 10) {
        passwordBox.classList.add("show");

        setTimeout(() => {
            passwordInput.focus();
        }, 100);
    } else {
        passwordBox.classList.remove("show");
    }
});

/* Done button */
/* Done button */
loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (mobileInput.value.length !== 10) {
        alert("Please enter 10 digit mobile number");
        return;
    }

    if (passwordInput.value.trim() === "") {
        alert("Please enter password");
        return;
    }

    alert("Login Done");

    /* After alert, reset page to normal first view */
    mobileInput.value = "";
    passwordInput.value = "";
    passwordBox.classList.remove("show");

    setTimeout(() => {
        mobileInput.focus();
    }, 100);
});
