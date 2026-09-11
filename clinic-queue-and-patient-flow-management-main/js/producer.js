import { getMedicineCatalog, addMedicine, updateMedicineQuantity } from "./queue.js";

const stockTableBody = document.getElementById("stockTableBody");

function renderStock() {
  const medicines = getMedicineCatalog();
  stockTableBody.innerHTML = "";
  medicines.slice(0, 8).forEach((medicine) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${medicine.name}</td><td>${medicine.quantity}</td><td>₹${medicine.price}</td><td>${medicine.availability ? "Available" : "Pending"}</td>`;
    stockTableBody.appendChild(row);
  });
}

document.getElementById("addMedicineBtn").addEventListener("click", () => {
  const medicine = {
    name: document.getElementById("name").value.trim(),
    category: document.getElementById("category").value.trim(),
    manufacturer: document.getElementById("manufacturer").value.trim(),
    batchNumber: document.getElementById("batch").value.trim(),
    manufactureDate: document.getElementById("manufactureDate").value,
    expiryDate: document.getElementById("expiryDate").value,
    quantity: document.getElementById("quantity").value,
    price: document.getElementById("price").value,
    prescriptionRequired: false,
    availability: true,
    description: "Producer added stock"
  };
  if (!medicine.name || !medicine.category || !medicine.manufacturer) {
    alert("Please fill the required medicine details.");
    return;
  }
  addMedicine(medicine);
  alert("Medicine batch added successfully.");
  renderStock();
});

renderStock();
