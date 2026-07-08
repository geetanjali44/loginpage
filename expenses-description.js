const role = localStorage.getItem("loginRole");

if (!role) {
    window.location.href = "index.html";
}

const expensesDescriptionList = document.getElementById("expensesDescriptionList");
const descriptionTotal = document.getElementById("descriptionTotal");

function getExpenses() {
    return JSON.parse(localStorage.getItem("totalExpenses")) || [];
}

function saveExpenses(expenses) {
    localStorage.setItem("totalExpenses", JSON.stringify(expenses));
}

function showExpensesDescription() {
    const expenses = getExpenses();

    const total = expenses.reduce(function (sum, expense) {
        return sum + Number(expense.amount || 0);
    }, 0);

    descriptionTotal.textContent = "₹" + total.toLocaleString("en-IN");

    if (expenses.length === 0) {
        expensesDescriptionList.innerHTML = `
            <div class="empty-msg">
                No expenses added yet.
            </div>
        `;
        return;
    }

    expensesDescriptionList.innerHTML = expenses.map(function (expense, index) {
        let adminButtons = "";

        if (role === "admin") {
            adminButtons = `
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editExpense(${index})">Edit</button>
                    <button class="delete-btn" onclick="deleteExpense(${index})">Delete</button>
                </div>
            `;
        }

        return `
            <div class="expense-card" id="expenseCard${index}">
                <h3>${index + 1}. ${expense.title}</h3>
                <p><strong>Amount:</strong> ₹${Number(expense.amount || 0).toLocaleString("en-IN")}</p>
                <p><strong>Paid To:</strong> ${expense.paidTo || "Not added"}</p>
                <p><strong>Category:</strong> ${expense.category || "Not added"}</p>
                <p><strong>Description:</strong> ${expense.note || "No description"}</p>
                <p><strong>Date:</strong> ${expense.date || "Not added"}</p>

                ${adminButtons}
            </div>
        `;
    }).join("");
}

function deleteExpense(index) {
    if (role !== "admin") {
        alert("Only admin can delete expenses");
        return;
    }

    const expenses = getExpenses();

    if (confirm("Delete this expense?")) {
        expenses.splice(index, 1);
        saveExpenses(expenses);
        showExpensesDescription();
    }
}

function editExpense(index) {
    if (role !== "admin") {
        alert("Only admin can edit expenses");
        return;
    }

    const expenses = getExpenses();
    const expense = expenses[index];

    const card = document.getElementById("expenseCard" + index);

    card.innerHTML = `
        <h3>Edit Expense</h3>

        <div class="edit-box">
            <input type="text" id="editTitle${index}" value="${expense.title || ""}" placeholder="Expense Title">

            <input type="number" id="editAmount${index}" value="${expense.amount || ""}" placeholder="Amount">

            <input type="text" id="editPaidTo${index}" value="${expense.paidTo || ""}" placeholder="Paid To">

            <input type="text" id="editCategory${index}" value="${expense.category || ""}" placeholder="Category">

            <textarea id="editNote${index}" placeholder="Description">${expense.note || ""}</textarea>

            <div class="action-buttons">
                <button class="save-btn" onclick="saveEditedExpense(${index})">Save</button>
                <button class="cancel-btn" onclick="showExpensesDescription()">Cancel</button>
            </div>
        </div>
    `;
}

function saveEditedExpense(index) {
    if (role !== "admin") {
        alert("Only admin can save changes");
        return;
    }

    const expenses = getExpenses();

    const title = document.getElementById("editTitle" + index).value.trim();
    const amount = Number(document.getElementById("editAmount" + index).value.trim());
    const paidTo = document.getElementById("editPaidTo" + index).value.trim();
    const category = document.getElementById("editCategory" + index).value.trim();
    const note = document.getElementById("editNote" + index).value.trim();

    if (title === "") {
        alert("Please enter expense title");
        return;
    }

    if (!amount || amount <= 0) {
        alert("Please enter valid amount");
        return;
    }

    if (paidTo === "") {
        alert("Please enter paid to");
        return;
    }

    if (category === "") {
        alert("Please enter category");
        return;
    }

    expenses[index] = {
        ...expenses[index],
        title: title,
        amount: amount,
        paidTo: paidTo,
        category: category,
        note: note,
        editedDate: new Date().toLocaleString()
    };

    saveExpenses(expenses);

    alert("Expense updated successfully");

    showExpensesDescription();
}

showExpensesDescription();
