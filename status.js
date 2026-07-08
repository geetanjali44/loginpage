const statusTitle = document.getElementById("statusTitle");
const statusText = document.getElementById("statusText");
const mobileText = document.getElementById("mobileText");
const loader = document.getElementById("loader");
const logoutBtn = document.getElementById("logoutBtn");

let currentUser = null;
let statusChannel = null;

async function logoutUser() {
    if (statusChannel) {
        await supabaseClient.removeChannel(statusChannel);
    }

    await supabaseClient.auth.signOut();

    localStorage.removeItem("loginRole");
    localStorage.removeItem("userMobile");

    window.location.href = "index.html";
}

logoutBtn.addEventListener("click", logoutUser);

async function loadUserStatus() {
    const { data: userData, error: userError } = await supabaseClient.auth.getUser();

    if (userError || !userData.user) {
        window.location.href = "index.html";
        return;
    }

    currentUser = userData.user;

    const { data: profile, error: profileError } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .single();

    if (profileError || !profile) {
        statusTitle.textContent = "Error";
        statusText.textContent = "Unable to load your account status. Please login again.";
        loader.style.display = "none";
        return;
    }

    localStorage.setItem("loginRole", "user");
    localStorage.setItem("userMobile", profile.mobile || "");

    showStatus(profile);

    listenForStatusChange(currentUser.id);
}

function showStatus(profile) {
    const status = profile.status;

    mobileText.textContent = profile.mobile ? "Mobile: +91 " + profile.mobile : "";

    if (status === "approved") {
        statusTitle.textContent = "Approved";
        statusTitle.className = "approved";
        statusText.textContent = "Your account is approved. Redirecting to home page...";
        loader.style.display = "none";

        localStorage.setItem("loginRole", "user");
        localStorage.setItem("userMobile", profile.mobile || "");

        setTimeout(function () {
            window.location.href = "home.html";
        }, 1000);

        return;
    }

    if (status === "rejected") {
        statusTitle.textContent = "Rejected";
        statusTitle.className = "rejected";
        statusText.textContent = "Your account request was rejected by admin. Please contact admin.";
        loader.style.display = "none";
        return;
    }

    statusTitle.textContent = "Approval Pending";
    statusTitle.className = "";
    statusText.textContent = "Your login request is pending. Please wait until admin approves your account.";
    loader.style.display = "block";
}

function listenForStatusChange(userId) {
    statusChannel = supabaseClient
        .channel("user-status-" + userId)
        .on(
            "postgres_changes",
            {
                event: "UPDATE",
                schema: "public",
                table: "profiles",
                filter: "id=eq." + userId
            },
            function (payload) {
                showStatus(payload.new);
            }
        )
        .subscribe();
}

loadUserStatus();
