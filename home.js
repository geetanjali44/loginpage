/* LOGIN ROLE CHECK */
const loginRole = localStorage.getItem("loginRole");

if (!loginRole) {
    window.location.href = "index.html";
}
const pdfOpenBtn = document.getElementById("pdfOpenBtn");

if (pdfOpenBtn) {
    if (loginRole === "admin") {
        pdfOpenBtn.innerHTML = " Upload PDFs";
    } else {
        pdfOpenBtn.innerHTML = " Uploaded PDFs";
    }
}
/* ADMIN LINK SHOW / HIDE */
document.body.classList.remove("admin");

if (loginRole === "admin") {
    document.body.classList.add("admin");
} else {
    document.body.classList.remove("admin");
}

/* MENU BAR WORKING CODE */
const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");
const sideMenu = document.getElementById("sideMenu");
const menuOverlay = document.getElementById("menuOverlay");

if (menuBtn && sideMenu && menuOverlay) {
    menuBtn.addEventListener("click", function () {
        sideMenu.classList.add("show");
        menuOverlay.classList.add("show");
    });
}

if (closeBtn && sideMenu && menuOverlay) {
    closeBtn.addEventListener("click", function () {
        sideMenu.classList.remove("show");
        menuOverlay.classList.remove("show");
    });
}

if (menuOverlay && sideMenu) {
    menuOverlay.addEventListener("click", function () {
        sideMenu.classList.remove("show");
        menuOverlay.classList.remove("show");
    });
}

/* SUMMARY DETAILS */
const chavithiDonationBox = document.getElementById("chavithiDonation");
const santarpanaDonationBox = document.getElementById("santarpanaDonation");
const totalExpensesBox = document.getElementById("totalExpenses");
const remainingBalanceBox = document.getElementById("remainingBalance");

function getData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function getTotalFromStorage(key) {
    const data = getData(key);

    return data.reduce(function (sum, item) {
        return sum + Number(item.amount || 0);
    }, 0);
}

function showSummary() {
    const chavithiTotal = getTotalFromStorage("chavithiDonations");
    const santarpanaTotal = getTotalFromStorage("santarpanaDonations");
    const expensesTotal = getTotalFromStorage("totalExpenses");

    const totalDonations = chavithiTotal + santarpanaTotal;
    const remainingBalance = totalDonations - expensesTotal;

    if (chavithiDonationBox) {
        chavithiDonationBox.textContent = "₹" + chavithiTotal.toLocaleString("en-IN");
    }

    if (santarpanaDonationBox) {
        santarpanaDonationBox.textContent = "₹" + santarpanaTotal.toLocaleString("en-IN");
    }

    if (totalExpensesBox) {
        totalExpensesBox.textContent = "₹" + expensesTotal.toLocaleString("en-IN");
    }

    if (remainingBalanceBox) {
        remainingBalanceBox.textContent = "₹" + remainingBalance.toLocaleString("en-IN");
    }
}

showSummary();
/* SUPABASE EVENT GALLERY */
const openGalleryBtn = document.getElementById("openGalleryBtn");
const closeGalleryBtn = document.getElementById("closeGalleryBtn");
const galleryPopup = document.getElementById("galleryPopup");
const galleryUploadInput = document.getElementById("galleryUploadInput");
const galleryGrid = document.getElementById("galleryGrid");

async function getCurrentUser() {
    const { data } = await supabaseClient.auth.getUser();
    return data.user;
}

async function loadGalleryPhotos() {
    if (!galleryGrid) return;

    galleryGrid.innerHTML = `<div class="gallery-empty">Loading photos...</div>`;

    const { data, error } = await supabaseClient
        .from("event_gallery")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.log(error);
        galleryGrid.innerHTML = `<div class="gallery-empty">Error loading photos</div>`;
        return;
    }

    if (!data || data.length === 0) {
        galleryGrid.innerHTML = `<div class="gallery-empty">No photos uploaded yet.</div>`;
        return;
    }

    galleryGrid.innerHTML = data.map(function (photo) {
        const deleteBtn = loginRole === "admin"
            ? `<button class="gallery-delete" onclick="deleteGalleryPhoto('${photo.id}', '${photo.file_path}')">×</button>`
            : "";

      return `
    <div class="gallery-card">
        <img src="${photo.file_url}" alt="Event Photo" onclick="openBigPhoto('${photo.file_url}')">
        ${deleteBtn}
    </div>
`;
    }).join("");
}

if (openGalleryBtn && galleryPopup) {
    openGalleryBtn.addEventListener("click", function () {
        galleryPopup.classList.add("show");
        loadGalleryPhotos();
    });
}

if (closeGalleryBtn && galleryPopup) {
    closeGalleryBtn.addEventListener("click", function () {
        galleryPopup.classList.remove("show");
    });
}

if (galleryPopup) {
    galleryPopup.addEventListener("click", function (e) {
        if (e.target === galleryPopup) {
            galleryPopup.classList.remove("show");
        }
    });
}

if (galleryUploadInput) {
    galleryUploadInput.addEventListener("change", async function () {
        if (loginRole !== "admin") {
            alert("Only admin can upload photos");
            this.value = "";
            return;
        }

        const user = await getCurrentUser();

        if (!user) {
            alert("Admin Supabase login session missing. Logout and login again as admin.");
            this.value = "";
            return;
        }

        const files = Array.from(this.files);

        for (const file of files) {
            if (!file.type.startsWith("image/")) {
                continue;
            }

            const fileExt = file.name.split(".").pop();
            const filePath = "gallery/" + Date.now() + "-" + Math.random().toString(36).slice(2) + "." + fileExt;

            const { error: uploadError } = await supabaseClient
                .storage
                .from("event-gallery")
                .upload(filePath, file, {
                    cacheControl: "3600",
                    upsert: false
                });

            if (uploadError) {
                alert(uploadError.message);
                console.log(uploadError);
                continue;
            }

            const { data: publicUrlData } = supabaseClient
                .storage
                .from("event-gallery")
                .getPublicUrl(filePath);

            const { error: insertError } = await supabaseClient
                .from("event_gallery")
                .insert({
                    file_name: file.name,
                    file_path: filePath,
                    file_url: publicUrlData.publicUrl,
                    uploaded_by: user.id
                });

            if (insertError) {
                alert(insertError.message);
                console.log(insertError);
            }
        }

        this.value = "";
        loadGalleryPhotos();
    });
}

async function deleteGalleryPhoto(id, filePath) {
    if (loginRole !== "admin") {
        alert("Only admin can delete photos");
        return;
    }

    if (!confirm("Delete this photo?")) return;

    const { error: storageError } = await supabaseClient
        .storage
        .from("event-gallery")
        .remove([filePath]);

    if (storageError) {
        alert(storageError.message);
        console.log(storageError);
        return;
    }

    const { error: dbError } = await supabaseClient
        .from("event_gallery")
        .delete()
        .eq("id", id);

    if (dbError) {
        alert(dbError.message);
        console.log(dbError);
        return;
    }

    loadGalleryPhotos();
}

/* LOGOUT */
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", async function (e) {
        e.preventDefault();

        localStorage.removeItem("loginRole");
        localStorage.removeItem("userMobile");

        if (typeof supabaseClient !== "undefined") {
            await supabaseClient.auth.signOut();
        }

        window.location.href = "index.html";
    });
}
/* BIG PHOTO VIEWER */
const photoViewer = document.getElementById("photoViewer");
const photoViewerImg = document.getElementById("photoViewerImg");
const photoViewerClose = document.getElementById("photoViewerClose");

function openBigPhoto(photoUrl) {
    if (!photoViewer || !photoViewerImg) return;

    photoViewerImg.src = photoUrl;
    photoViewer.classList.add("show");
}

function closeBigPhoto() {
    if (!photoViewer || !photoViewerImg) return;

    photoViewer.classList.remove("show");
    photoViewerImg.src = "";
}

if (photoViewerClose) {
    photoViewerClose.addEventListener("click", closeBigPhoto);
}

if (photoViewer) {
    photoViewer.addEventListener("click", function (e) {
        if (e.target === photoViewer) {
            closeBigPhoto();
        }
    });
}
