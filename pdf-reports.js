const role = localStorage.getItem("loginRole");

if (!role) {
    window.location.href = "index.html";
}

if (role === "admin") {
    document.body.classList.add("admin");
}

const pdfUploadInput = document.getElementById("pdfUploadInput");
const pdfList = document.getElementById("pdfList");

async function getCurrentUser() {
    const { data } = await supabaseClient.auth.getUser();
    return data.user;
}

function formatFileSize(bytes) {
    if (!bytes) return "0 KB";

    const kb = bytes / 1024;

    if (kb < 1024) {
        return kb.toFixed(1) + " KB";
    }

    return (kb / 1024).toFixed(1) + " MB";
}

async function loadPdfs() {
    if (!pdfList) return;

    pdfList.innerHTML = `<div class="empty-msg">Loading PDFs...</div>`;

    const { data, error } = await supabaseClient
        .from("pdf_reports")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.log(error);
        pdfList.innerHTML = `<div class="empty-msg">Error loading PDFs</div>`;
        return;
    }

    if (!data || data.length === 0) {
        pdfList.innerHTML = `<div class="empty-msg">No PDFs uploaded yet.</div>`;
        return;
    }

    pdfList.innerHTML = data.map(function (pdf, index) {
        const deleteButton = role === "admin"
            ? `<button class="delete-btn" onclick="deletePdf('${pdf.id}', '${pdf.file_path}')">Delete</button>`
            : "";

        return `
            <div class="pdf-card">
                <h3>${index + 1}. ${pdf.file_name}</h3>
                <p>Uploaded: ${new Date(pdf.created_at).toLocaleString()}</p>
                <p>Size: ${formatFileSize(pdf.file_size)}</p>

                <div class="pdf-actions">
                    <a class="open-btn" href="${pdf.file_url}" target="_blank">Open</a>
                    <a class="download-btn" href="${pdf.file_url}" download="${pdf.file_name}">Download</a>
                    ${deleteButton}
                </div>
            </div>
        `;
    }).join("");
}

if (pdfUploadInput) {
    pdfUploadInput.addEventListener("change", async function () {
        if (role !== "admin") {
            alert("Only admin can upload PDFs");
            this.value = "";
            return;
        }

        const user = await getCurrentUser();

        if (!user) {
            alert("Admin Supabase login session missing. Logout and login again as admin.");
            this.value = "";
            return;
        }

        const file = this.files[0];

        if (!file) return;

        if (file.type !== "application/pdf") {
            alert("Please upload PDF file only");
            this.value = "";
            return;
        }

        const filePath = "reports/" + Date.now() + "-" + file.name.replace(/\s+/g, "-");

        const { error: uploadError } = await supabaseClient
            .storage
            .from("pdf-reports")
            .upload(filePath, file, {
                cacheControl: "3600",
                upsert: false
            });

        if (uploadError) {
            alert(uploadError.message);
            console.log(uploadError);
            this.value = "";
            return;
        }

        const { data: publicUrlData } = supabaseClient
            .storage
            .from("pdf-reports")
            .getPublicUrl(filePath);

        const { error: insertError } = await supabaseClient
            .from("pdf_reports")
            .insert({
                file_name: file.name,
                file_path: filePath,
                file_url: publicUrlData.publicUrl,
                file_size: file.size,
                uploaded_by: user.id
            });

        if (insertError) {
            alert(insertError.message);
            console.log(insertError);
            this.value = "";
            return;
        }

        alert("PDF uploaded successfully");

        this.value = "";
        loadPdfs();
    });
}

async function deletePdf(id, filePath) {
    if (role !== "admin") {
        alert("Only admin can delete PDFs");
        return;
    }

    if (!confirm("Delete this PDF?")) return;

    const { error: storageError } = await supabaseClient
        .storage
        .from("pdf-reports")
        .remove([filePath]);

    if (storageError) {
        alert(storageError.message);
        console.log(storageError);
        return;
    }

    const { error: dbError } = await supabaseClient
        .from("pdf_reports")
        .delete()
        .eq("id", id);

    if (dbError) {
        alert(dbError.message);
        console.log(dbError);
        return;
    }

    loadPdfs();
}

loadPdfs();
