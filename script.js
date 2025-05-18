let inputDate = document.getElementById("date");
let inputType = document.getElementById("type");
let inputDescription = document.getElementById("description");
let inputAmount = document.getElementById("amount");
let totalBalance = document.getElementById("totalBalance");
let totalIncome = document.getElementById("totalIncome");
let totalExpense = document.getElementById("totalExpense");
let filterOptions = document.querySelector(
  'input[name="filter"]:checked'
)?.value;

var transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let editTransactionId = null;

function add() {
  const date = inputDate.value;
  const type = inputType.value;
  const description = inputDescription.value;
  const amount = parseFloat(inputAmount.value);

  if (amount <= 0 || isNaN(amount)) {
    alert("Please enter a valid Amount!");
    return;
  }

  if (editTransactionId) {
    transactions = transactions.map((transaction) =>
      transaction.id === editTransactionId
        ? { ...transaction, date, type, description, amount }
        : transaction
    );
    editTransactionId = null;
  } else {
    const transaction = { id: Date.now(), date, type, description, amount };
    transactions.push(transaction);
  }

  updateTransaction();
  displayTransaction();
  updateTotal();

  inputDescription.value = "";
  inputAmount.value = "";
}

function displayTransaction(filter = "all") {
  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  let filterTransaction = transactions;

  if (filter === "income") {
    filterTransaction = transactions.filter(
      (transaction) => transaction.type === "income"
    );
  } else if (filter === "expense") {
    filterTransaction = transactions.filter(
      (transaction) => transaction.type === "expense"
    );
  }

  var tbody = document.getElementById("tbody");
  tbody.innerHTML = "";

  filterTransaction.forEach((transaction) => {
    var tr = document.createElement("tr");
    tr.setAttribute("class", "border-b border-gray-400 p-2 text-center mt-2 text-sm");

    var dateTd = document.createElement("td");
    dateTd.innerHTML = transaction.date; 
   
    tr.appendChild(dateTd);

    var typeTd = document.createElement("td");
    typeTd.innerHTML = transaction.type;
    
    tr.appendChild(typeTd);

    var descTd = document.createElement("td");
    descTd.innerHTML = transaction.description;

    tr.appendChild(descTd);

    var amountTd = document.createElement("td");
    amountTd.innerHTML = `₹${transaction.amount.toFixed(2)}`;

    tr.appendChild(amountTd);

    var editTd = document.createElement("td");
    var editButton = document.createElement("button");
    editButton.classList.add("block", "align-bottom");
    editButton.setAttribute("onclick", `editTransaction(${transaction.id})`);

    var editImg = document.createElement("img");
    editImg.src = "/edit.png";
    editImg.alt = "Edit";
    editButton.appendChild(editImg);
    editTd.appendChild(editButton);
    tr.appendChild(editTd);

    var delTd = document.createElement("td");
    var delButton = document.createElement("button");
    delButton.classList.add("block", "align-bottom");
    delButton.setAttribute("onclick", `deleteTransaction(${transaction.id})`);

    var delImg = document.createElement("img");
    delImg.src = "/delete.png";
    delImg.alt = "Delete";
    delButton.appendChild(delImg);
    delTd.appendChild(delButton);
    tr.appendChild(delTd);

    tbody.appendChild(tr);
  });
  updateTotal();
}

function updateTotal() {
  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

  let income = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + parseFloat(transaction.amount), 0);

  let expense = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + parseFloat(transaction.amount), 0);

  totalIncome.textContent = `₹${income.toFixed(2)}`;
  totalExpense.textContent = `₹ -${expense.toFixed(2)}`;
  totalBalance.textContent = `₹${(income - expense).toFixed(2)}`;
}

function deleteTransaction(id) {
  if (confirm("Are you sure to delete this transaction?")) {
    transactions = transactions.filter((transaction) => transaction.id !== id);
    updateTransaction();
    displayTransaction();
    updateTotal();
  }
}

function editTransaction(id) {
  let transaction = transactions.find((transaction) => transaction.id === id);
  if (transaction) {
    inputDate.value = transaction.date;
    inputType.value = transaction.type;
    inputDescription.value = transaction.description;
    inputAmount.value = transaction.amount;
    editTransactionId = transaction.id;
  }
}

function updateTransaction() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

document.querySelectorAll('input[name="filter"]').forEach((option) => {
  option.addEventListener("click", function () {
    displayTransaction(this.value);
  });
});

function reset() {
  document.getElementById("reset").addEventListener("click", function () {
    if (confirm("Are you sure?")) {
      localStorage.clear();
      location.reload();
    }
  });
}

displayTransaction();
updateTotal();

reset();
