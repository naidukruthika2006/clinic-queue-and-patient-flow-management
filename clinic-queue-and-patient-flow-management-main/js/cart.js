import { getLoggedInUser, getCartItems, getMedicineCatalog, removeFromCart, placeOrder, clearCart } from "./queue.js";

const user = getLoggedInUser();
if (!user || user.role !== "patient") {
  location.href = "index.html";
}

const cartTableBody = document.getElementById("cartTableBody");
const totalAmountLabel = document.getElementById("totalAmount");
const patientNameInput = document.getElementById("patientName");
const addressInput = document.getElementById("address");
const phoneInput = document.getElementById("phone");
const paymentMethodSelect = document.getElementById("paymentMethod");
const prescriptionFileInput = document.getElementById("prescriptionFile");
const placeOrderBtn = document.getElementById("placeOrderBtn");

function renderCart() {
  const cartItems = getCartItems();
  const medicines = getMedicineCatalog();
  cartTableBody.innerHTML = "";

  if (cartItems.length === 0) {
    cartTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#6c757d;">Your cart is empty.</td></tr>';
    totalAmountLabel.innerText = "₹0";
    return;
  }

  let total = 0;
  cartItems.forEach((item) => {
    const medicine = medicines.find((entry) => entry.id === item.medicineId);
    if (!medicine) return;
    const subtotal = medicine.price * item.quantity;
    total += subtotal;
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${medicine.name}</td>
      <td>${item.quantity}</td>
      <td>₹${medicine.price}</td>
      <td>₹${subtotal}</td>
      <td><button class="secondary" data-remove-id="${medicine.id}">Remove</button></td>
    `;
    cartTableBody.appendChild(row);
  });

  totalAmountLabel.innerText = `₹${total}`;
}

cartTableBody.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-remove-id]");
  if (!button) return;
  const medicineId = button.getAttribute("data-remove-id");
  removeFromCart(medicineId);
  renderCart();
});

placeOrderBtn.addEventListener("click", () => {
  const cartItems = getCartItems();
  if (cartItems.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  const patientName = patientNameInput.value.trim();
  const address = addressInput.value.trim();
  const phone = phoneInput.value.trim();
  if (!patientName || !address || !phone) {
    alert("Please fill patient details before placing the order.");
    return;
  }

  const prescriptionFile = prescriptionFileInput.files[0] ? prescriptionFileInput.files[0].name : "";
  placeOrder({
    id: `order-${Date.now()}`,
    patientName,
    username: user.username,
    paymentMethod: paymentMethodSelect.value,
    address,
    phone,
    prescriptionFile
  });
  alert("Order placed successfully.");
  clearCart();
  renderCart();
});

renderCart();
