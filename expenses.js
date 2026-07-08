const role = localStorage.getItem("loginRole");

if (role !== "admin") {
    alert("Admin only page");
    window.location.href = "home.html";
}
const expenseForm = document.getElementById("expenseForm");
const expensesTotal = document.getElementById("expensesTotal");
const expenseList = document.getElementById("expenseList");

function getExpenses() {
    return JSON.parse(localStorage.getItem("totalExpenses")) || [];
}

function saveExpenses(expenses) {
    localStorage.setItem("totalExpenses", JSON.stringify(expenses));
}

function renderExpenses() {
    const expenses = getExpenses();

    const total = expenses.reduce((sum, expense) => {
        return sum + Number(expense.amount || 0);
    }, 0);

    expensesTotal.textContent = "₹" + total.toLocaleString("en-IN");

    if (expenses.length === 0) {
        expenseList.innerHTML = `
            <div class="empty-msg">
                No expenses added yet.
            </div>
        `;
        return;
    }

    expenseList.innerHTML = expenses.map((expense, index) => {
        return `
            <div class="expense-card">
                <h3>${index + 1}. ${expense.title}</h3>
                <p><strong>Amount:</strong> ₹${Number(expense.amount).toLocaleString("en-IN")}</p>
                <p><strong>Paid To:</strong> ${expense.paidTo}</p>
                <p><strong>Category:</strong> ${expense.category}</p>
                <p><strong>Note:</strong> ${expense.note || "No note"}</p>
                <p><strong>Date:</strong> ${expense.date}</p>
                <button class="delete-btn" onclick="deleteExpense(${index})">Delete</button>
            </div>
        `;
    }).join("");
}

function deleteExpense(index) {
    const expenses = getExpenses();

    if (confirm("Delete this expense?")) {
        expenses.splice(index, 1);
        saveExpenses(expenses);
        renderExpenses();
    }
}

expenseForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("expenseTitle").value.trim();
    const amount = Number(document.getElementById("expenseAmount").value.trim());
    const paidTo = document.getElementById("expensePaidTo").value.trim();
    const category = document.getElementById("expenseCategory").value.trim();
    const note = document.getElementById("expenseNote").value.trim();

    if (title === "") {
        alert("Please enter expense name");
        return;
    }

    if (!amount || amount <= 0) {
        alert("Please enter valid expense amount");
        return;
    }

    if (paidTo === "") {
        alert("Please enter paid to / shop name");
        return;
    }

    if (category === "") {
        alert("Please enter expense category");
        return;
    }

    const expense = {
        title: title,
        amount: amount,
        paidTo: paidTo,
        category: category,
        note: note,
        date: new Date().toLocaleString()
    };

    const expenses = getExpenses();
    expenses.push(expense);
    saveExpenses(expenses);

    alert("Expense added successfully");

    expenseForm.reset();
    renderExpenses();
});

renderExpenses();
