import { getMedicineCatalog, updateMedicineQuantity } from "./queue.js";

const medicineSelect = document.getElementById("medicineSelect");
const retailerTable = document.getElementById("retailerTable");
const restockQty = document.getElementById("restockQty");

function renderRetailer() {
  const medicines = getMedicineCatalog();
  retailerTable.innerHTML = "";
  medicineSelect.innerHTML = "";
  medicines.forEach((medicine) => {
    const option = document.createElement("option");
    option.value = medicine.id;
    option.textContent = medicine.name;
    medicineSelect.appendChild(option);

    const row = document.createElement("tr");
    row.innerHTML = `<td>${medicine.name}</td><td>${medicine.quantity}</td><td>₹${medicine.price}</td><td>${medicine.availability ? "Available" : "Low Stock"}</td>`;
    retailerTable.appendChild(row);
  });
}

document.getElementById("restockBtn").addEventListener("click", () => {
  const quantity = Number(restockQty.value) || 0;
  if (!quantity) {
    alert("Enter a valid quantity.");
    return;
  }
  updateMedicineQuantity(medicineSelect.value, quantity);
  alert("Inventory updated successfully.");
  renderRetailer();
});

renderRetailer();
