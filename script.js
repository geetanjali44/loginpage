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
const loginMessage = document.getElementById("loginMessage");

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

function makeEmailFromMobile(mobile) {
    return mobile + "@ganesh.local";
}

async function getProfile(userId) {
    const { data, error } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

    if (error) {
        console.log("Profile error:", error);
        return null;
    }

    return data;
}

/* Done button */
loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const mobile = mobileInput.value.trim();
    const password = passwordInput.value.trim();

    if (mobile.length !== 10) {
        alert("Please enter 10 digit mobile number");
        return;
    }

    if (password === "") {
        alert("Please enter password");
        return;
    }

    /*
        ADMIN LOGIN:
        Admin will directly open home.html.
        No pending page.
        No approval page.
    */
   if (password === "admin@123") {
    const email = makeEmailFromMobile(mobile);

    if (loginMessage) {
        loginMessage.textContent = "Admin checking...";
    }

    let { data: adminLoginData, error: adminLoginError } =
        await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

    if (adminLoginError) {
        const { data: adminSignUpData, error: adminSignUpError } =
            await supabaseClient.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        mobile: mobile,
                        name: "Admin"
                    }
                }
            });

        if (adminSignUpError) {
            alert(adminSignUpError.message);
            if (loginMessage) loginMessage.textContent = "";
            return;
        }

        alert("Admin account created. Now run admin update SQL in Supabase, then login again.");
        if (loginMessage) loginMessage.textContent = "";
        return;
    }

    localStorage.setItem("loginRole", "admin");
    localStorage.setItem("userMobile", mobile);

    if (loginMessage) {
        loginMessage.textContent = "Admin Login Successfully...";
    }

    setTimeout(function () {
        window.location.href = "home.html";
    }, 500);

    return;
}

    /*
        USER LOGIN:
        User will go through Supabase approval system.
    */
    if (password.length < 6) {
        alert("User password must be at least 6 characters");
        return;
    }

    const email = makeEmailFromMobile(mobile);

    if (loginMessage) {
        loginMessage.textContent = "Checking user account...";
    }

    const { data: signInData, error: signInError } =
        await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

    /*
        If user does not exist, create user request.
        Status will be pending in Supabase profiles table.
    */
    if (signInError) {
        if (loginMessage) {
            loginMessage.textContent = "Creating user approval request...";
        }

        const { data: signUpData, error: signUpError } =
            await supabaseClient.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        mobile: mobile,
                        name: mobile
                    }
                }
            });

        if (signUpError) {
            alert(signUpError.message);

            if (loginMessage) {
                loginMessage.textContent = "";
            }

            return;
        }

        localStorage.setItem("loginRole", "user");
        localStorage.setItem("userMobile", mobile);

        if (loginMessage) {
            loginMessage.textContent = "Request created. Waiting for admin approval...";
        }

        setTimeout(function () {
            window.location.href = "status.html";
        }, 800);

        return;
    }

    const user = signInData.user;
    const profile = await getProfile(user.id);

    if (!profile) {
        alert("Profile not found. Please contact admin.");

        if (loginMessage) {
            loginMessage.textContent = "";
        }

        return;
    }

    localStorage.setItem("loginRole", "user");
    localStorage.setItem("userMobile", profile.mobile || mobile);

    if (profile.status === "approved") {
        if (loginMessage) {
            loginMessage.textContent = "Approved. Redirecting...";
        }

        setTimeout(function () {
            window.location.href = "home.html";
        }, 700);

        return;
    }

    if (profile.status === "rejected") {
        if (loginMessage) {
            loginMessage.textContent = "Your request is rejected by admin.";
        }

        setTimeout(function () {
            window.location.href = "status.html";
        }, 800);

        return;
    }

    if (loginMessage) {
        loginMessage.textContent = "Your request is pending...";
    }

    setTimeout(function () {
        window.location.href = "status.html";
    }, 800);
});
