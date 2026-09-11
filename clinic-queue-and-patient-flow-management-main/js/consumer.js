import { getMedicineCatalog, getOrders } from "./queue.js";

const consumerSearch = document.getElementById("consumerSearch");
const consumerResults = document.getElementById("consumerResults");
const consumerOrders = document.getElementById("consumerOrders");

function renderConsumers() {
  const medicines = getMedicineCatalog();
  const query = consumerSearch.value.trim().toLowerCase();
  const filtered = medicines.filter((medicine) => !query || `${medicine.name} ${medicine.category}`.toLowerCase().includes(query));
  consumerResults.innerHTML = filtered.slice(0, 5).map((medicine) => `<div style="padding:10px;border:1px solid #e0e6ed;border-radius:8px;margin-bottom:8px;"><strong>${medicine.name}</strong><br><span style="color:#6c757d;">${medicine.category} • ₹${medicine.price}</span></div>`).join("");

  const orders = getOrders();
  consumerOrders.innerHTML = orders.slice(0, 5).map((order) => `<tr><td>${order.id}</td><td>${order.status}</td><td>${order.paymentStatus}</td></tr>`).join("");
}

consumerSearch.addEventListener("input", renderConsumers);
renderConsumers();
