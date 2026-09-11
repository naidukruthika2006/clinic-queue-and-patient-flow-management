import { getMedicineCatalog, updateMedicineQuantity } from "./queue.js";

const wholesalerTable = document.getElementById("wholesalerTable");

function renderWholesaler() {
  const medicines = getMedicineCatalog();
  wholesalerTable.innerHTML = "";
  medicines.slice(0, 8).forEach((medicine) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${medicine.name}</td><td>${medicine.category}</td><td>${medicine.quantity}</td><td>${medicine.availability ? "Available" : "Low Stock"}</td><td><button data-id="${medicine.id}">Send to Retailer</button></td>`;
    wholesalerTable.appendChild(row);
  });
}

wholesalerTable.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-id]");
  if (!button) return;
  const medicineId = button.getAttribute("data-id");
  updateMedicineQuantity(medicineId, 10);
  alert("Stock forwarded to retailer.");
  renderWholesaler();
});

renderWholesaler();
