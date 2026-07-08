const donateForm = document.getElementById("donateForm");
const personMobile = document.getElementById("personMobile");
const paymentMode = document.getElementById("paymentMode");
const transactionId = document.getElementById("transactionId");
const qrBox = document.getElementById("qrBox");

/* Hide scanner first */
qrBox.style.display = "none";

personMobile.addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9]/g, "");
});

/* Payment mode change */
paymentMode.addEventListener("change", function () {
    const selectedMode = this.value;

    if (
        selectedMode === "UPI"
    ) {
        qrBox.style.display = "block";
        transactionId.style.display = "block";
        transactionId.required = true;
    } else if (selectedMode === "Cash") {
        qrBox.style.display = "none";
        transactionId.style.display = "none";
        transactionId.value = "";
        transactionId.required = false;
    } else {
        qrBox.style.display = "none";
        transactionId.style.display = "block";
        transactionId.value = "";
        transactionId.required = false;
    }
});

donateForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("personName").value.trim();
    const mobile = personMobile.value.trim();
    const amount = Number(document.getElementById("donationAmount").value.trim());
    const selectedPaymentMode = paymentMode.value.trim();
    const enteredTransactionId = transactionId.value.trim();
    const location = document.getElementById("personLocation").value.trim();
    const address = document.getElementById("personAddress").value.trim();

    if (name === "") {
        alert("Please enter your name");
        return;
    }

    if (mobile.length !== 10) {
        alert("Please enter 10 digit mobile number");
        return;
    }

    if (!amount || amount <= 0) {
        alert("Please enter valid donation amount");
        return;
    }

    if (selectedPaymentMode === "") {
        alert("Please select payment mode");
        return;
    }

    if (selectedPaymentMode !== "Cash" && enteredTransactionId === "") {
        alert("Please enter Transaction ID / UTR Number");
        return;
    }

    if (location === "") {
        alert("Please enter your location");
        return;
    }

    if (address === "") {
        alert("Please enter your address");
        return;
    }

    const donation = {
        name: name,
        mobile: mobile,
        amount: amount,
        paymentMode: selectedPaymentMode,
        transactionId: selectedPaymentMode === "Cash" ? "" : enteredTransactionId,
        location: location,
        address: address,
        date: new Date().toLocaleString()
    };

    let donations = JSON.parse(localStorage.getItem("santarpanaDonations")) || [];

    donations.push(donation);

    localStorage.setItem("santarpanaDonations", JSON.stringify(donations));

    alert("Thank you! Your Santarpana donation details submitted 🙏");

    donateForm.reset();

    qrBox.style.display = "none";
    transactionId.style.display = "block";
    transactionId.required = false;

    window.location.href = "home.html";
});
