const role = localStorage.getItem("loginRole");

if (!role) {
    window.location.href = "index.html";
}

const donationList = document.getElementById("donationList");
const detailsTotalAmount = document.getElementById("detailsTotalAmount");

function getSantarpanaDonations() {
    return JSON.parse(localStorage.getItem("santarpanaDonations")) || [];
}

function saveSantarpanaDonations(donations) {
    localStorage.setItem("santarpanaDonations", JSON.stringify(donations));
}

function renderSantarpanaDetails() {
    const donations = getSantarpanaDonations();

    const totalAmount = donations.reduce(function (sum, donation) {
        return sum + Number(donation.amount || 0);
    }, 0);

    detailsTotalAmount.textContent = "₹" + totalAmount.toLocaleString("en-IN");

    if (donations.length === 0) {
        donationList.innerHTML = `
            <div class="empty-msg">
                No Santarpana donations added yet.
            </div>
        `;
        return;
    }

    donationList.innerHTML = donations.map(function (donation, index) {
        let deleteButton = "";

        if (role === "admin") {
            deleteButton = `
                <button class="delete-btn" onclick="deleteSantarpanaDonation(${index})">
                    Delete
                </button>
            `;
        }

      return `
    <div class="donation-card">
        <h3>${index + 1}. ${donation.name}</h3>
        <p><strong>Amount:</strong> ₹${Number(donation.amount || 0).toLocaleString("en-IN")}</p>
        <p><strong>Payment Mode:</strong> ${donation.paymentMode || "Not added"}</p>

        ${
            donation.transactionId
            ? `<p><strong>Transaction ID:</strong> ${donation.transactionId}</p>`
            : ""
        }

        <p><strong>Mobile:</strong> ${donation.mobile}</p>
        <p><strong>Location:</strong> ${donation.location}</p>
        <p><strong>Address:</strong> ${donation.address}</p>
        <p><strong>Date:</strong> ${donation.date}</p>

        ${deleteButton}
    </div>
`;
    }).join("");
}

function deleteSantarpanaDonation(index) {
    if (role !== "admin") {
        alert("Only admin can delete");
        return;
    }

    const donations = getSantarpanaDonations();

    if (confirm("Delete this Santarpana donation?")) {
        donations.splice(index, 1);
        saveSantarpanaDonations(donations);
        renderSantarpanaDetails();
    }
}

renderSantarpanaDetails();
