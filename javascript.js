document.addEventListener("DOMContentLoaded", () => {
    const expenseForm = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense_list");
    const totalAmount = document.getElementById("total-amount");

    let expenses = [];

    const ctx = document.getElementById("bar").getContext("2d");
    let expenseChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: [],
            datasets: [{
                label: "Amount Spent Per Day ($)",
                data: [],
                backgroundColor: "rgba(255, 0, 119, 0.5)",
                borderColor: "rgb(9, 250, 250)",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: { y: { beginAtZero: true } }
        }
    });

    expenseForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("expense-name").value; 
        const amount = parseFloat(document.getElementById("amount").value);
        const date = document.getElementById("date").value;

        if (!name || isNaN(amount) || amount <= 0 || !date) {
            alert("Please provide valid values for expense name, amount, and date.");
            return;
        }

        const expense = {
            id: Date.now(), 
            name,
            amount,
            date
        };

        expenses.push(expense);
        expenseForm.reset();
        
        displayExpenses();
        updateTotalAmount();
        updateChart();
    });

    function displayExpenses() {
        expenseList.innerHTML = "";

        expenses.forEach(expense => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${expense.name}</td>
                <td>$${expense.amount.toFixed(2)}</td>
                <td>${expense.date}</td>
                <td>
                    <button class="delete-btn" data-id="${expense.id}">Delete</button>
                </td>
            `;

            expenseList.appendChild(row);
        });
    }

    function updateTotalAmount() {
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        totalAmount.textContent = total.toFixed(2);
    }

    function updateChart() {
        const expenseByDate = {};

        expenses.forEach(expense => {
            if (!expenseByDate[expense.date]) {
                expenseByDate[expense.date] = 0;
            }
            expenseByDate[expense.date] += expense.amount;
        });

        expenseChart.data.labels = Object.keys(expenseByDate);
        expenseChart.data.datasets[0].data = Object.values(expenseByDate);
        expenseChart.update();
    }

    expenseList.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-btn")) {
            const expenseId = parseInt(e.target.dataset.id);
            expenses = expenses.filter(expense => expense.id !== expenseId);

            displayExpenses();
            updateTotalAmount();
            updateChart();
        }
    });
});
