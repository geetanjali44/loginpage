const role = localStorage.getItem("loginRole");

if (!role) {
    window.location.href = "index.html";
}

const chavithiDonationList = document.getElementById("chavithiDonationList");
const chavithiDetailsTotal = document.getElementById("chavithiDetailsTotal");

function getChavithiDonations() {
    return JSON.parse(localStorage.getItem("chavithiDonations")) || [];
}

function saveChavithiDonations(donations) {
    localStorage.setItem("chavithiDonations", JSON.stringify(donations));
}

function renderChavithiDetails() {
    const donations = getChavithiDonations();

    const total = donations.reduce(function (sum, donation) {
        return sum + Number(donation.amount || 0);
    }, 0);

    chavithiDetailsTotal.textContent = "₹" + total.toLocaleString("en-IN");

    if (donations.length === 0) {
        chavithiDonationList.innerHTML = `
            <div class="empty-msg">
                No Chavithi donations added yet.
            </div>
        `;
        return;
    }

    chavithiDonationList.innerHTML = donations.map(function (donation, index) {
        let deleteButton = "";

        if (role === "admin") {
            deleteButton = `
                <button class="delete-btn" onclick="deleteChavithiDonation(${index})">
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

function deleteChavithiDonation(index) {
    if (role !== "admin") {
        alert("Only admin can delete");
        return;
    }

    const donations = getChavithiDonations();

    if (confirm("Delete this Chavithi donation?")) {
        donations.splice(index, 1);
        saveChavithiDonations(donations);
        renderChavithiDetails();
    }
}

renderChavithiDetails();
