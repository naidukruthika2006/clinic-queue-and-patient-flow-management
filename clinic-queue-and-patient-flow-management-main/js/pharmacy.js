import { getMedicineCatalog, getOrders } from "./queue.js";

const summaryCards = document.getElementById("summaryCards");
const stockTableBody = document.getElementById("stockTableBody");
const ordersTableBody = document.getElementById("ordersTableBody");

function renderDashboard() {
  const medicines = getMedicineCatalog();
  const orders = getOrders();
  const totalStock = medicines.reduce((sum, medicine) => sum + Number(medicine.quantity || 0), 0);
  const lowStockCount = medicines.filter((medicine) => medicine.quantity > 0 && medicine.quantity < 40).length;
  const outOfStockCount = medicines.filter((medicine) => medicine.quantity === 0).length;
  const pendingOrders = orders.filter((order) => order.status !== "Delivered").length;

  summaryCards.innerHTML = `
    <div class="summary-card"><strong>${totalStock}</strong><span>Total Units</span></div>
    <div class="summary-card"><strong>${lowStockCount}</strong><span>Low Stock Items</span></div>
    <div class="summary-card"><strong>${outOfStockCount}</strong><span>Out of Stock</span></div>
    <div class="summary-card"><strong>${pendingOrders}</strong><span>Pending Orders</span></div>
  `;

  stockTableBody.innerHTML = medicines.slice(0, 8).map((medicine) => `
    <tr>
      <td>${medicine.name}</td>
      <td>${medicine.category}</td>
      <td>${medicine.quantity}</td>
      <td>${medicine.quantity === 0 ? '<span class="pill warn">Out of Stock</span>' : medicine.quantity < 40 ? '<span class="pill warn">Low Stock</span>' : '<span class="pill">Available</span>'}</td>
    </tr>
  `).join("");

  ordersTableBody.innerHTML = orders.slice(0, 6).map((order) => `
    <tr>
      <td>${order.id}</td>
      <td>${order.patientName || order.username || "Patient"}</td>
      <td>${order.status || "Pending"}</td>
      <td>${order.prescriptionFile ? order.prescriptionFile : "—"}</td>
    </tr>
  `).join("");
}

renderDashboard();
