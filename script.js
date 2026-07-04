const flowerStream = document.querySelector(".flower-stream");

const flowers = ["🌸", "🌺", "🌼", "💮"];

function createFlower() {
    const flower = document.createElement("div");
    flower.classList.add("flower");

    flower.innerHTML = flowers[Math.floor(Math.random() * flowers.length)];

    flower.style.left = Math.random() * 70 + 15 + "%";
    flower.style.fontSize = Math.random() * 10 + 16 + "px";
    flower.style.animationDuration = Math.random() * 2 + 3 + "s";

    flowerStream.appendChild(flower);

    setTimeout(() => {
        flower.remove();
    }, 5500);
}

setInterval(createFlower, 700);
