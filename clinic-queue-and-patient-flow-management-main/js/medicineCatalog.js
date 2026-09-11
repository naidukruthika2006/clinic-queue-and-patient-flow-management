import { getLoggedInUser } from "./queue.js";
import { getMedicineCatalog, addToCart, getCartItems, getMedicineById } from "./queue.js";

const user = getLoggedInUser();
if (!user || user.role !== "patient") {
  location.href = "index.html";
}

const searchBox = document.getElementById("searchBox");
const categoryFilter = document.getElementById("categoryFilter");
const availabilityFilter = document.getElementById("availabilityFilter");
const brandFilter = document.getElementById("brandFilter");
const tableBody = document.getElementById("medicineTableBody");
const summaryContainer = document.getElementById("catalogSummary");

function getFilteredMedicines() {
  const medicines = getMedicineCatalog();
  const query = searchBox.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const availability = availabilityFilter.value;
  const brand = brandFilter.value;

  return medicines.filter((medicine) => {
    const text = `${medicine.name} ${medicine.category} ${medicine.manufacturer} ${medicine.description}`.toLowerCase();
    const matchesQuery = !query || text.includes(query);
    const matchesCategory = !category || medicine.category === category;
    const matchesAvailability = !availability || (availability === "available" ? medicine.quantity > 0 : medicine.quantity === 0);
    const matchesBrand = !brand || medicine.brand === brand;
    return matchesQuery && matchesCategory && matchesAvailability && matchesBrand;
  });
}

function renderSummary(medicines) {
  if (!summaryContainer) return;
  const totalMedicines = medicines.length;
  const available = medicines.filter((medicine) => medicine.quantity > 0).length;
  const lowStock = medicines.filter((medicine) => medicine.quantity > 0 && medicine.quantity < 40).length;
  const outOfStock = medicines.filter((medicine) => medicine.quantity === 0).length;
  const estimatedValue = medicines.reduce((total, medicine) => total + (medicine.quantity * medicine.price), 0);

  summaryContainer.innerHTML = `
    <div class="summary-card"><strong>${totalMedicines}</strong><span>Total SKUs</span></div>
    <div class="summary-card"><strong>${available}</strong><span>Available</span></div>
    <div class="summary-card"><strong>${lowStock}</strong><span>Low Stock</span></div>
    <div class="summary-card"><strong>₹${estimatedValue}</strong><span>Inventory Value</span></div>
  `;
}

function renderMedicines() {
  const medicines = getFilteredMedicines();
  renderSummary(medicines);
  tableBody.innerHTML = "";

  if (medicines.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#6c757d;">No medicines match the current filters.</td></tr>';
    return;
  }

  medicines.forEach((medicine) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <strong>${medicine.name}</strong><br>
        <span class="muted">${medicine.manufacturer}</span>
      </td>
      <td>${medicine.category}</td>
      <td>${medicine.quantity}</td>
      <td>₹${medicine.price}</td>
      <td>${medicine.quantity > 0 ? '<span class="pill">Available</span>' : '<span class="pill out">Out of Stock</span>'}</td>
      <td class="actions">
        <button data-id="${medicine.id}">Add to Cart</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

tableBody.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-id]");
  if (!button) return;
  const medicineId = button.getAttribute("data-id");
  addToCart(medicineId, 1);
  alert("Medicine added to cart.");
  renderMedicines();
});

[searchBox, categoryFilter, availabilityFilter, brandFilter].forEach((field) => {
  field.addEventListener("input", renderMedicines);
  field.addEventListener("change", renderMedicines);
});

renderMedicines();
