const role = localStorage.getItem("loginRole");

if (!role) {
    window.location.href = "index.html";
}

/* Only admin can open All Donations page */
if (role !== "admin") {
    alert("Admin only page");
    window.location.href = "home.html";
}

/* Tabs */
const chavithiTab = document.getElementById("chavithiTab");
const santarpanaTab = document.getElementById("santarpanaTab");

const chavithiSection = document.getElementById("chavithiSection");
const santarpanaSection = document.getElementById("santarpanaSection");

/* Lists */
const chavithiDonationList = document.getElementById("chavithiDonationList");
const santarpanaDonationList = document.getElementById("santarpanaDonationList");

/* Totals */
const chavithiTotalAmount = document.getElementById("chavithiTotalAmount");
const santarpanaTotalAmount = document.getElementById("santarpanaTotalAmount");
const grandTotalAmount = document.getElementById("grandTotalAmount");

/* PDF */
const downloadAllDonationsPdfBtn = document.getElementById("downloadAllDonationsPdfBtn");

function getData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function formatAmount(amount) {
    return "₹" + Number(amount || 0).toLocaleString("en-IN");
}

function getTotal(data) {
    return data.reduce(function (sum, item) {
        return sum + Number(item.amount || 0);
    }, 0);
}

function renderSummary() {
    const chavithiDonations = getData("chavithiDonations");
    const santarpanaDonations = getData("santarpanaDonations");

    const chavithiTotal = getTotal(chavithiDonations);
    const santarpanaTotal = getTotal(santarpanaDonations);
    const grandTotal = chavithiTotal + santarpanaTotal;

    chavithiTotalAmount.textContent = formatAmount(chavithiTotal);
    santarpanaTotalAmount.textContent = formatAmount(santarpanaTotal);
    grandTotalAmount.textContent = formatAmount(grandTotal);
}

function donationCard(donation, index, type) {
    return `
        <div class="donation-card" id="${type}Card${index}">
            <h3>${index + 1}. ${donation.name || "No Name"}</h3>

            <p><strong>Amount:</strong> ${formatAmount(donation.amount)}</p>
            <p><strong>Payment Mode:</strong> ${donation.paymentMode || "Not added"}</p>

            ${
                donation.transactionId
                ? `<p><strong>Transaction ID:</strong> ${donation.transactionId}</p>`
                : ""
            }

            <p><strong>Mobile:</strong> ${donation.mobile || "Not added"}</p>
            <p><strong>Location:</strong> ${donation.location || "Not added"}</p>
            <p><strong>Address:</strong> ${donation.address || "Not added"}</p>
            <p><strong>Date:</strong> ${donation.date || "Not added"}</p>

            <div class="action-buttons">
                <button class="edit-btn" onclick="editDonation('${type}', ${index})">
                    Edit
                </button>

                <button class="delete-btn" onclick="deleteDonation('${type}', ${index})">
                    Delete
                </button>
            </div>
        </div>
    `;
}

function renderChavithiDonations() {
    const chavithiDonations = getData("chavithiDonations");

    if (chavithiDonations.length === 0) {
        chavithiDonationList.innerHTML = `
            <div class="empty-msg">
                No Chavithi donations added yet.
            </div>
        `;
        return;
    }

    chavithiDonationList.innerHTML = chavithiDonations.map(function (donation, index) {
        return donationCard(donation, index, "chavithi");
    }).join("");
}

function renderSantarpanaDonations() {
    const santarpanaDonations = getData("santarpanaDonations");

    if (santarpanaDonations.length === 0) {
        santarpanaDonationList.innerHTML = `
            <div class="empty-msg">
                No Santarpana donations added yet.
            </div>
        `;
        return;
    }

    santarpanaDonationList.innerHTML = santarpanaDonations.map(function (donation, index) {
        return donationCard(donation, index, "santarpana");
    }).join("");
}

function getStorageKey(type) {
    return type === "chavithi" ? "chavithiDonations" : "santarpanaDonations";
}

function editDonation(type, index) {
    const key = getStorageKey(type);
    const donations = getData(key);
    const donation = donations[index];

    const card = document.getElementById(type + "Card" + index);

    card.innerHTML = `
        <h3>Edit ${type === "chavithi" ? "Chavithi" : "Santarpana"} Donation</h3>

        <div class="edit-box">
            <input type="text" id="editName${type}${index}" value="${donation.name || ""}" placeholder="Full Name">

            <input type="tel" id="editMobile${type}${index}" value="${donation.mobile || ""}" placeholder="Mobile Number" maxlength="10">

            <input type="number" id="editAmount${type}${index}" value="${donation.amount || ""}" placeholder="Donation Amount">

            <select id="editPaymentMode${type}${index}" onchange="toggleEditTransaction('${type}', ${index})">
                <option value="">Select Payment Mode</option>
                <option value="PhonePe" ${donation.paymentMode === "PhonePe" ? "selected" : ""}>PhonePe</option>
                <option value="Google Pay" ${donation.paymentMode === "Google Pay" ? "selected" : ""}>Google Pay</option>
                <option value="Paytm" ${donation.paymentMode === "Paytm" ? "selected" : ""}>Paytm</option>
                <option value="Cash" ${donation.paymentMode === "Cash" ? "selected" : ""}>Cash</option>
                <option value="Bank Transfer" ${donation.paymentMode === "Bank Transfer" ? "selected" : ""}>Bank Transfer</option>
                <option value="Other" ${donation.paymentMode === "Other" ? "selected" : ""}>Other</option>
            </select>

            <input 
                type="text" 
                id="editTransaction${type}${index}" 
                value="${donation.transactionId || ""}" 
                placeholder="Transaction ID / UTR Number"
                style="${donation.paymentMode === "Cash" ? "display:none;" : "display:block;"}"
            >

            <input type="text" id="editLocation${type}${index}" value="${donation.location || ""}" placeholder="Location / Area">

            <textarea id="editAddress${type}${index}" placeholder="Full Address">${donation.address || ""}</textarea>

            <div class="action-buttons">
                <button class="save-btn" onclick="saveEditedDonation('${type}', ${index})">
                    Save
                </button>

                <button class="cancel-btn" onclick="renderAll()">
                    Cancel
                </button>
            </div>
        </div>
    `;
}

function toggleEditTransaction(type, index) {
    const paymentMode = document.getElementById("editPaymentMode" + type + index);
    const transactionInput = document.getElementById("editTransaction" + type + index);

    if (paymentMode.value === "Cash") {
        transactionInput.style.display = "none";
        transactionInput.value = "";
    } else {
        transactionInput.style.display = "block";
    }
}

function saveEditedDonation(type, index) {
    const key = getStorageKey(type);
    const donations = getData(key);

    const name = document.getElementById("editName" + type + index).value.trim();
    const mobile = document.getElementById("editMobile" + type + index).value.trim();
    const amount = Number(document.getElementById("editAmount" + type + index).value.trim());
    const paymentMode = document.getElementById("editPaymentMode" + type + index).value.trim();
    const transactionId = document.getElementById("editTransaction" + type + index).value.trim();
    const location = document.getElementById("editLocation" + type + index).value.trim();
    const address = document.getElementById("editAddress" + type + index).value.trim();

    if (name === "") {
        alert("Please enter name");
        return;
    }

    if (mobile.length !== 10) {
        alert("Please enter 10 digit mobile number");
        return;
    }

    if (!amount || amount <= 0) {
        alert("Please enter valid amount");
        return;
    }

    if (paymentMode === "") {
        alert("Please select payment mode");
        return;
    }

    if (paymentMode !== "Cash" && transactionId === "") {
        alert("Please enter Transaction ID / UTR Number");
        return;
    }

    if (location === "") {
        alert("Please enter location");
        return;
    }

    if (address === "") {
        alert("Please enter address");
        return;
    }

    donations[index] = {
        ...donations[index],
        name: name,
        mobile: mobile,
        amount: amount,
        paymentMode: paymentMode,
        transactionId: paymentMode === "Cash" ? "" : transactionId,
        location: location,
        address: address,
        editedDate: new Date().toLocaleString()
    };

    saveData(key, donations);

    alert("Donation updated successfully");

    renderAll();
}

function deleteDonation(type, index) {
    const key = getStorageKey(type);
    const donations = getData(key);

    if (confirm("Delete this donation?")) {
        donations.splice(index, 1);
        saveData(key, donations);
        renderAll();
    }
}

function renderAll() {
    renderSummary();
    renderChavithiDonations();
    renderSantarpanaDonations();
}

/* Tab switching */
if (chavithiTab) {
    chavithiTab.addEventListener("click", function () {
        chavithiTab.classList.add("active");
        santarpanaTab.classList.remove("active");

        chavithiSection.classList.remove("hide");
        santarpanaSection.classList.add("hide");
    });
}

if (santarpanaTab) {
    santarpanaTab.addEventListener("click", function () {
        santarpanaTab.classList.add("active");
        chavithiTab.classList.remove("active");

        santarpanaSection.classList.remove("hide");
        chavithiSection.classList.add("hide");
    });
}

/* Download PDF */
  /* Download PDF - With summary table and table names */
if (downloadAllDonationsPdfBtn) {
    downloadAllDonationsPdfBtn.addEventListener("click", function () {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF("p", "mm", "a4");

        const chavithiDonations = getData("chavithiDonations");
        const santarpanaDonations = getData("santarpanaDonations");
        const expenses = getData("totalExpenses");

        const chavithiTotal = getTotal(chavithiDonations);
        const santarpanaTotal = getTotal(santarpanaDonations);
        const expensesTotal = getTotal(expenses);
        const totalDonations = chavithiTotal + santarpanaTotal;
        const remainingBalance = totalDonations - expensesTotal;

        function money(value) {
            return "Rs. " + Number(value || 0).toLocaleString("en-IN");
        }

        function safe(value) {
            return value ? String(value) : "-";
        }

        function addTableTitle(title, y) {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.setTextColor(91, 22, 0);
            doc.text(title, 14, y);
            doc.setTextColor(0, 0, 0);
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("Sri Varasidhi Vinayaka Utsav Committee", 105, 15, { align: "center" });

        doc.setFontSize(14);
        doc.text("All Donations and Expenses Report", 105, 24, { align: "center" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text("Generated Date: " + new Date().toLocaleString(), 105, 32, { align: "center" });

        /* Summary table title */
        addTableTitle("Summary", 42);

        /* Summary Table */
        doc.autoTable({
            startY: 46,
            head: [["Particulars", "Amount"]],
            body: [
                ["Chavithi Donations", money(chavithiTotal)],
                ["Santarpana Donations", money(santarpanaTotal)],
                ["Total Donations", money(totalDonations)],
                ["Total Expenses", money(expensesTotal)],
                ["Remaining Balance", money(remainingBalance)]
            ],
            theme: "grid",
            styles: {
                fontSize: 10,
                cellPadding: 3,
                overflow: "linebreak"
            },
            headStyles: {
                fillColor: [91, 22, 0],
                textColor: [255, 255, 255]
            },
            columnStyles: {
                0: { cellWidth: 95 },
                1: { cellWidth: 80 }
            }
        });

        let nextY = doc.lastAutoTable.finalY + 12;

        /* Chavithi table title */
        addTableTitle("Chavithi Donation Details", nextY);

        /* Chavithi Donations Table */
        doc.autoTable({
            startY: nextY + 4,
            head: [["S.No", "Name", "Mobile", "Amount", "Payment", "Txn ID", "Location", "Date"]],
            body: chavithiDonations.length
                ? chavithiDonations.map(function (d, index) {
                    return [
                        index + 1,
                        safe(d.name),
                        safe(d.mobile),
                        money(d.amount),
                        safe(d.paymentMode),
                        safe(d.transactionId),
                        safe(d.location),
                        safe(d.date)
                    ];
                })
                : [["-", "No Chavithi donations added", "-", "-", "-", "-", "-", "-"]],
            theme: "grid",
            styles: {
                fontSize: 8,
                cellPadding: 2,
                overflow: "linebreak"
            },
            headStyles: {
                fillColor: [180, 83, 9],
                textColor: [255, 255, 255]
            },
            columnStyles: {
                0: { cellWidth: 10 },
                1: { cellWidth: 28 },
                2: { cellWidth: 22 },
                3: { cellWidth: 22 },
                4: { cellWidth: 22 },
                5: { cellWidth: 25 },
                6: { cellWidth: 28 },
                7: { cellWidth: 32 }
            }
        });

        nextY = doc.lastAutoTable.finalY + 12;

        if (nextY > 260) {
            doc.addPage();
            nextY = 20;
        }

        /* Santarpana table title */
        addTableTitle("Santarpana Donation Details", nextY);

        /* Santarpana Donations Table */
        doc.autoTable({
            startY: nextY + 4,
            head: [["S.No", "Name", "Mobile", "Amount", "Payment", "Txn ID", "Location", "Date"]],
            body: santarpanaDonations.length
                ? santarpanaDonations.map(function (d, index) {
                    return [
                        index + 1,
                        safe(d.name),
                        safe(d.mobile),
                        money(d.amount),
                        safe(d.paymentMode),
                        safe(d.transactionId),
                        safe(d.location),
                        safe(d.date)
                    ];
                })
                : [["-", "No Santarpana donations added", "-", "-", "-", "-", "-", "-"]],
            theme: "grid",
            styles: {
                fontSize: 8,
                cellPadding: 2,
                overflow: "linebreak"
            },
            headStyles: {
                fillColor: [180, 83, 9],
                textColor: [255, 255, 255]
            },
            columnStyles: {
                0: { cellWidth: 10 },
                1: { cellWidth: 28 },
                2: { cellWidth: 22 },
                3: { cellWidth: 22 },
                4: { cellWidth: 22 },
                5: { cellWidth: 25 },
                6: { cellWidth: 28 },
                7: { cellWidth: 32 }
            }
        });

        nextY = doc.lastAutoTable.finalY + 12;

        if (nextY > 260) {
            doc.addPage();
            nextY = 20;
        }

        /* Expenses table title */
        addTableTitle("Expenses Details", nextY);

        /* Expenses Table */
        doc.autoTable({
            startY: nextY + 4,
            head: [["S.No", "Title", "Amount", "Paid To", "Category", "Description", "Date"]],
            body: expenses.length
                ? expenses.map(function (e, index) {
                    return [
                        index + 1,
                        safe(e.title),
                        money(e.amount),
                        safe(e.paidTo),
                        safe(e.category),
                        safe(e.note),
                        safe(e.date)
                    ];
                })
                : [["-", "No expenses added", "-", "-", "-", "-", "-"]],
            theme: "grid",
            styles: {
                fontSize: 8,
                cellPadding: 2,
                overflow: "linebreak"
            },
            headStyles: {
                fillColor: [153, 27, 27],
                textColor: [255, 255, 255]
            },
            columnStyles: {
                0: { cellWidth: 10 },
                1: { cellWidth: 30 },
                2: { cellWidth: 22 },
                3: { cellWidth: 28 },
                4: { cellWidth: 28 },
                5: { cellWidth: 45 },
                6: { cellWidth: 28 }
            }
        });

        /* Page numbers */
        const pageCount = doc.internal.getNumberOfPages();

        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(9);
            doc.setTextColor(0, 0, 0);
            doc.text("Page " + i + " of " + pageCount, 105, 290, { align: "center" });
        }

        doc.save("all-donations-report.pdf");
    });
}
renderAll();
