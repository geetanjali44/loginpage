const usersList = document.getElementById("usersList");

async function checkAdmin() {
    const { data: userData, error: userError } = await supabaseClient.auth.getUser();

    if (userError || !userData.user) {
        alert("Please login as admin first");
        window.location.href = "index.html";
        return false;
    }

    const { data: profile, error } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", userData.user.id)
        .single();

    if (error || !profile) {
        alert("Admin profile not found");
        window.location.href = "index.html";
        return false;
    }

    if (profile.role !== "admin" || profile.status !== "approved") {
        alert("Admin only page");
        window.location.href = "home.html";
        return false;
    }

    localStorage.setItem("loginRole", "admin");
    localStorage.setItem("userMobile", profile.mobile || "");

    return true;
}

async function loadUsers() {
    const isAdmin = await checkAdmin();

    if (!isAdmin) return;

    usersList.innerHTML = `<div class="empty">Loading users...</div>`;

   const { data, error } = await supabaseClient
    .from("profiles")
    .select("id, name, mobile, role, status, created_at")
    .order("created_at", { ascending: false });
    console.log("Admin approval data:", data);
console.log("Admin approval error:", error);

    if (error) {
        usersList.innerHTML = `<div class="empty">Error loading users</div>`;
        console.log(error);
        return;
    }

    if (!data || data.length === 0) {
        usersList.innerHTML = `<div class="empty">No users found</div>`;
        return;
    }

    usersList.innerHTML = data.map(function (user) {
        return `
            <div class="user-card">
                <h3>${user.name || "User"}</h3>

                <p><strong>Mobile:</strong> +91 ${user.mobile || "-"}</p>

                <p>
                    <strong>Status:</strong>
                    <span class="status ${user.status}">
                        ${user.status}
                    </span>
                </p>

                <p><strong>Created:</strong> ${new Date(user.created_at).toLocaleString()}</p>

                <div class="btn-row">
                    <button class="approve-btn" onclick="updateStatus('${user.id}', 'approved')">
                        Approve
                    </button>

                    <button class="reject-btn" onclick="updateStatus('${user.id}', 'rejected')">
                        Reject
                    </button>

                    <button class="pending-btn" onclick="updateStatus('${user.id}', 'pending')">
                        Pending
                    </button>
                </div>
            </div>
        `;
    }).join("");
}

async function updateStatus(userId, status) {
    const updateData = {
        status: status
    };

    if (status === "approved") {
        updateData.approved_at = new Date().toISOString();
    } else {
        updateData.approved_at = null;
    }

    const { error } = await supabaseClient
        .from("profiles")
        .update(updateData)
        .eq("id", userId);

    if (error) {
        alert(error.message);
        console.log(error);
        return;
    }

    alert("User status changed to " + status);

    loadUsers();
}

loadUsers();
