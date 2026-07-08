* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: emoji;
}

html, body {
    width: 100%;
    height: 100%;
    overflow: hidden;
}

/* Main body */
body {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

/* Blurred background Ganesh image */
body::before {
    content: "";
    position: fixed;
    inset: 0;
    background:
        linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.45)),
        url("images/ganesh1.webp");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    filter: blur(4px);
    transform: scale(1.1);
    z-index: -2;
}

/* Light overlay */
body::after {
    content: "";
    position: fixed;
    inset: 0;
    background: rgba(252, 7, 7, 0.167);
    z-index: -1;
}

/* Main content */
.main-box {
    width: 90%;
    max-width: 350px;
    text-align: center;
    z-index: 5;
}

/* Ganesh image area */
.ganesh-zone {
    width: 250px;
    height: 250px;
    margin: 0 auto 30px;
    position: relative;
    overflow: visible;
}

/* Bigger round Ganesh image */
/* Bigger round Ganesh image */
.ganesh-round {
    width: 250px;
    height: 250px;
    margin: 0 auto;
    border-radius: 50%;
    overflow: hidden;
    position: relative;
    z-index: 2;
    border: 4px solid #eea507a8;
    box-shadow: 0 8px 28px rgb(230, 215, 6);

    /* nice background when full image fits */
    background: radial-gradient(circle, #fff7d6 0%, #f0ede4e1 55%, #b45309 100%);
}

.ganesh-round img {
    width: 100%;
    height: 100%;
    object-fit: contain;   /* full photo visible inside circle */
    border-radius: 50%;
    padding: 8px;          /* small gap inside circle */
}

/* Flowers fall only on Ganesh image */
.flower-stream {
    position: absolute;
    top: -20px;
    left: 40%;
    transform: translateX(-50%);
    width: 330px;
    height: 430px;
    overflow: visible;
    pointer-events: none;
    z-index: 5;
}

/* Flowers */
.flower {
    position: absolute;
    top: 0;
    font-size: 18px;
    animation: flowerFall linear forwards;
    z-index: 5;
}

/* Flower dropping to Ganesh */
@keyframes flowerFall {
    0% {
        transform: translateY(0) rotate(0deg);
        opacity: 1;
    }

    80% {
        opacity: 1;
    }

    100% {
        transform: translateY(250px) rotate(360deg);
        opacity: 0;
    }
}

/* Login details without card */
.login-details h2 {
    font-size: 30px;
    color: #fff;
    margin-bottom: 6px;
    text-shadow: 0 3px 8px rgba(0,0,0,0.5);
}

.login-details p {
    font-size: 15px;
    color: #fff3c4;
    margin-bottom: 22px;
}

/* Inputs */
.login-details input {
    width: 100%;
    height: 50px;
    margin-bottom: 14px;
    border: none;
    outline: none;
    border-radius: 14px;
    padding: 0 16px;
    font-size: 15px;
    background: rgba(255, 255, 255, 0.493);
    box-shadow: 0 5px 14px rgba(232, 11, 11, 0.347);
}

.login-details input:focus {
    border: 2px solid #facc15;
}

/* Login button */
.login-details button {
    width: 100%;
    height: 50px;
    border: none;
    border-radius: 15px;
    background: linear-gradient(135deg, #f59f0ba5, #b4530996);
    color: white;
    font-size: 17px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 8px 20px rgba(244, 5, 5, 0.399);
}

.login-details button:active {
    transform: scale(0.97);
}

/* Mobile view */
@media (max-width: 480px) {
    .main-box {
        width: 86%;
    }

    .ganesh-zone {
        width: 230px;
        height: 230px;
        margin-bottom: 28px;
    }
 .ganesh-round {
        width: 230px;
        height: 230px;
    }

    .ganesh-round img {
        object-fit: contain;
        padding: 8px;
    }

    .flower-stream {
        top: -40px;
        left: 40%;
        width: 145px;
        height: 400px;
    }

    @keyframes flowerFall {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }

        80% {
            opacity: 1;
        }

        100% {
            transform: translateY(235px) rotate(360deg);
            opacity: 0;
        }
    }

    .login-details h2 {
        font-size: 27px;
    }

    .login-details p {
        font-size: 14px;
    }

    .login-details input {
        height: 48px;
        font-size: 14px;
    }

    .login-details button {
        height: 48px;
        font-size: 16px;
    }
}
/* Mouse images touching exact top side corners */
/* Mouse images touching exact top side corners */
.mouse-corner {
    position: fixed;
    top:-10px;
    width: 190px;        /* increased size */
    height: auto;
    object-fit: contain;
    z-index: 50;
    pointer-events: none;
}

/* Left mouse touch left corner */
.mouse-left {
    left: -35px;
}

/* Right mouse touch right corner */
.mouse-right {
    right: -35px;
}

/* Mobile view */
@media (max-width: 480px) {
    .mouse-corner {
        width: 120px;    /* increased mobile size */
        top: -10px;
    }

    .mouse-left {
        left: -25px;
    }

    .mouse-right {
        right: -25px;
    }
}
/* Moving text behind mouse */
/* Moving text only between mouse images */
.top-scroll-text {
    position: fixed;
    top: 55px;
    left: 150px;          /* space for left mouse */
    right: 150px;         /* space for right mouse */
    height: 45px;
    overflow: hidden;
    z-index: 30;
    pointer-events: none;
}



/* Scroll animation */
@keyframes scrollText {
    0% {
        transform: translateX(0);
    }

    100% {
        transform: translateX(-100%);
    }
}

/* Mouse always above */
.mouse-corner {
    z-index: 50;
}

/* Mouse should stay above text */
.mouse-corner {
    z-index: 50;
}

/* Mobile view */
@media (max-width: 480px) {
    .top-scroll-text {
        top: 38px;
        left: 80px;       /* space for left mouse */
        right: 80px;      /* space for right mouse */
        height: 35px;
    }

    .scroll-track {
        font-size: 15px;
        animation-duration: 8s;
    }
}
/* Bottom scroll text like top scroller */
.bottom-scroll-text {
    position: fixed;
    bottom: 10px;   /* increase this to move up */
    left: 0;
    width: 100%;
    height: 95px;
    overflow: hidden;
    z-index: 30;
    pointer-events: none;
}

/* Moving text */
.bottom-scroll-track {
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    gap: 14px;
    padding-left: 100%;
    font-family: 'Cinzel Decorative', serif;
    font-size: 24px;
    font-weight: 900;
    color: #ffcc00;
    text-shadow: 0 3px 8px rgba(0,0,0,0.8);
    animation: bottomScrollText 12s linear infinite;
}

/* Bottom image like mouse style */
.bottom-scroll-img {
    width: 85px;           /* increase image size here */
    height: auto;
    object-fit: contain;
    flex-shrink: 0;
    filter: drop-shadow(0 5px 12px rgba(0,0,0,0.45));
}

/* Right to left animation */
@keyframes bottomScrollText {
    0% {
        transform: translateX(0);
    }

    100% {
        transform: translateX(-100%);
    }
}

/* Mobile view */
@media (max-width: 480px) {
    .bottom-scroll-text {
        bottom: 20px;   /* move little bit up in mobile */
        height: 65px;
    }


    .bottom-scroll-track {
        font-size: 15px;
        gap: 10px;
        animation-duration: 10s;
    }

    .bottom-scroll-img {
        width: 55px;       /* mobile image size */
        height: auto;
    }
}
/* Input with mouse at right top corner */
.input-with-mouse {
    width: 100%;
    position: relative;
    margin-bottom: 14px;
}

/* Input inside wrapper */
.input-with-mouse input {
    width: 100%;
    height: 50px;
    margin-bottom: 0;
    padding-right: 70px;
}

/* Mouse image on right top corner of input */
.input-corner-mouse {
    position: absolute;
    right: -12px;
    top: -42px;
    width: 75px;
    height: auto;
    object-fit: contain;
    z-index: 10;
    filter: drop-shadow(0 5px 10px rgba(0,0,0,0.45));
    pointer-events: none;
}

/* Mobile */
@media (max-width: 480px) {
    .input-with-mouse input {
        height: 48px;
        padding-right: 62px;
    }

    .input-corner-mouse {
        width: 65px;
        right: -8px;
        top: -49px;
    }
}
/* Top committee text */
.top-fixed-text {
    position: fixed;
    top: 18px;
    left: 180px;
    right: 180px;
    text-align: center;
    z-index: 30;
    pointer-events: none;
    white-space: nowrap;
}

.happy-text {
    display: block;
    font-family: 'Great Vibes', cursive;
    font-size: 48px;
    font-weight: 400;
    line-height: 0.9;
    color: #ffffff;
    text-shadow: 0 4px 14px rgba(0,0,0,0.85);
}

.festival-text {
    display: block;
    margin-top: 8px;
    font-family: 'Great Vibes', cursive;
    font-size: 20px;
    font-weight: 400;
    letter-spacing: 1px;
    color: white;
    text-shadow: 0 4px 12px rgba(0,0,0,0.9);
}

/* Mobile */
@media (max-width: 480px) {
    .top-fixed-text {
        top: 30px;
        left: 70px;
        right: 85px;
    }

    .happy-text {
        font-size: 36px;
        line-height: 0.9;
    }

    .festival-text {
        font-size: 36px;
        margin-top: 5px;
        letter-spacing: 0.5px;
    }
}
/* Hide password first */
.password-box {
    display: none;
}

/* Show password after 10 digit mobile */
.password-box.show {
    display: block;
}

/* Mobile input with mouse */
/* Mobile input with +91 */
.mobile-input-box {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.682);
    box-shadow: 0 5px 14px rgba(232, 192, 11, 0.677);
    overflow: hidden;
}

.country-code {
    height: 100%;
    padding: 0 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #5a2d00;
    font-size: 15px;
    font-weight: 700;
    border-right: 1px solid rgba(90, 45, 0, 0.25);
    background: rgba(255, 204, 0, 0.18);
}

.mobile-input-box input {
    flex: 1;
    height: 100%;
    border: none;
    outline: none;
    background: transparent;
    padding: 0 70px 0 14px;
    font-size: 15px;
    color: #111;
    box-shadow: none;
    margin-bottom: 0;
}

/* Mobile */
@media (max-width: 480px) {
    .mobile-input-box {
        height: 48px;
    }

    .country-code {
        font-size: 14px;
        padding: 0 12px;
    }

    .mobile-input-box input {
        font-size: 14px;
        padding-right: 62px;
    }
}
