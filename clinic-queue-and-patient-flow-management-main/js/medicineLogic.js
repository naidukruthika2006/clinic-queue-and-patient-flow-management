export const seedMedicines = [
  {
    id: "med-1",
    name: "Paracetamol",
    category: "Tablets",
    manufacturer: "Cipla",
    brand: "Cipla",
    batchNumber: "BCH001",
    manufactureDate: "2024-01-15",
    expiryDate: "2026-12-15",
    price: 25,
    quantity: 250,
    availability: true,
    description: "Fever and pain reliever",
    prescriptionRequired: false,
    uses: "Relieves fever and mild pain",
    dosage: "1-2 tablets every 6 hours",
    sideEffects: "Mild nausea, stomach upset",
    rating: 4.7
  },
  {
    id: "med-2",
    name: "Azithromycin",
    category: "Tablets",
    manufacturer: "Sun Pharma",
    brand: "Sun Pharma",
    batchNumber: "BCH002",
    manufactureDate: "2024-03-10",
    expiryDate: "2026-09-10",
    price: 120,
    quantity: 40,
    availability: true,
    description: "Antibiotic for bacterial infections",
    prescriptionRequired: true,
    uses: "Treats bacterial infections",
    dosage: "Take as prescribed by doctor",
    sideEffects: "Nausea, diarrhea",
    rating: 4.5
  },
  {
    id: "med-3",
    name: "Vitamin C",
    category: "Health Supplements",
    manufacturer: "GSK",
    brand: "GSK",
    batchNumber: "BCH003",
    manufactureDate: "2023-11-20",
    expiryDate: "2026-11-20",
    price: 90,
    quantity: 300,
    availability: true,
    description: "Immune support supplement",
    prescriptionRequired: false,
    uses: "Boosts immunity and antioxidant support",
    dosage: "1 tablet daily",
    sideEffects: "Mild stomach discomfort",
    rating: 4.3
  },
  {
    id: "med-4",
    name: "Insulin",
    category: "Injections",
    manufacturer: "Novo Nordisk",
    brand: "Novo Nordisk",
    batchNumber: "BCH004",
    manufactureDate: "2024-05-01",
    expiryDate: "2026-05-01",
    price: 450,
    quantity: 18,
    availability: true,
    description: "Diabetes management injection",
    prescriptionRequired: true,
    uses: "Controls blood sugar levels",
    dosage: "As prescribed by physician",
    sideEffects: "Low blood sugar, weight gain",
    rating: 4.8
  },
  {
    id: "med-5",
    name: "Betadine",
    category: "Ointments",
    manufacturer: "Piramal",
    brand: "Piramal",
    batchNumber: "BCH005",
    manufactureDate: "2024-02-14",
    expiryDate: "2026-08-14",
    price: 35,
    quantity: 0,
    availability: false,
    description: "Antiseptic ointment",
    prescriptionRequired: false,
    uses: "Prevents infection in wounds",
    dosage: "Apply on affected area",
    sideEffects: "Skin irritation",
    rating: 4.2
  },
  {
    id: "med-6",
    name: "Cofsils Syrup",
    category: "Syrups",
    manufacturer: "Abbott",
    brand: "Abbott",
    batchNumber: "BCH006",
    manufactureDate: "2024-06-05",
    expiryDate: "2026-10-05",
    price: 70,
    quantity: 80,
    availability: true,
    description: "Cough syrup for cold symptoms",
    prescriptionRequired: false,
    uses: "Relieves cough and throat irritation",
    dosage: "5 ml twice daily",
    sideEffects: "Drowsiness",
    rating: 4.1
  }
];

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

export function filterMedicines(medicines, filters = {}) {
  const query = normalizeText(filters.query);
  const category = normalizeText(filters.category);
  const availability = normalizeText(filters.availability);
  const brand = normalizeText(filters.brand);
  const maxPrice = Number(filters.maxPrice) || Infinity;

  return medicines.filter((medicine) => {
    const fields = `${medicine.name} ${medicine.category} ${medicine.manufacturer} ${medicine.description}`.toLowerCase();
    const matchesQuery = !query || fields.includes(query);
    const matchesCategory = !category || normalizeText(medicine.category) === category;
    const matchesBrand = !brand || fields.includes(brand);
    const matchesAvailability = !availability || availability === "all" || (availability === "available" ? medicine.quantity > 0 : medicine.quantity === 0);
    const matchesPrice = medicine.price <= maxPrice;
    return matchesQuery && matchesCategory && matchesBrand && matchesAvailability && matchesPrice;
  });
}

export function addMedicineEntry(medicines, medicine) {
  const next = [...medicines];
  const created = {
    id: medicine.id || `med-${Date.now()}`,
    name: medicine.name,
    category: medicine.category,
    manufacturer: medicine.manufacturer,
    brand: medicine.brand || medicine.manufacturer,
    batchNumber: medicine.batchNumber,
    manufactureDate: medicine.manufactureDate,
    expiryDate: medicine.expiryDate,
    price: Number(medicine.price) || 0,
    quantity: Number(medicine.quantity) || 0,
    availability: Number(medicine.quantity) > 0,
    description: medicine.description || "",
    prescriptionRequired: Boolean(medicine.prescriptionRequired),
    uses: medicine.uses || "",
    dosage: medicine.dosage || "",
    sideEffects: medicine.sideEffects || "",
    rating: Number(medicine.rating) || 4.0
  };
  next.unshift(created);
  return next;
}

export function updateMedicineStock(medicines, medicineId, delta) {
  return medicines.map((medicine) => {
    if (medicine.id !== medicineId) return medicine;
    const nextQuantity = Math.max(0, Number(medicine.quantity) + Number(delta));
    return {
      ...medicine,
      quantity: nextQuantity,
      availability: nextQuantity > 0
    };
  });
}

export function addOrUpdateCart(cartItems, medicineId, quantity) {
  const next = [...cartItems];
  const itemIndex = next.findIndex((item) => item.medicineId === medicineId);
  const amount = Math.max(1, Number(quantity) || 1);
  if (itemIndex >= 0) {
    next[itemIndex] = { ...next[itemIndex], quantity: next[itemIndex].quantity + amount };
  } else {
    next.push({ medicineId, quantity: amount });
  }
  return next;
}

export function removeCartItem(cartItems, medicineId) {
  return cartItems.filter((item) => item.medicineId !== medicineId);
}

export function placeOrderFromCart(cartItems, medicines, orderData) {
  const updatedMedicines = medicines.map((medicine) => {
    const cartItem = cartItems.find((item) => item.medicineId === medicine.id);
    if (!cartItem) return medicine;
    const nextQuantity = Math.max(0, Number(medicine.quantity) - Number(cartItem.quantity));
    return {
      ...medicine,
      quantity: nextQuantity,
      availability: nextQuantity > 0
    };
  });

  const order = {
    id: orderData.id || `order-${Date.now()}`,
    patientName: orderData.patientName,
    username: orderData.username,
    paymentMethod: orderData.paymentMethod,
    address: orderData.address,
    phone: orderData.phone,
    prescriptionFile: orderData.prescriptionFile || "",
    createdAt: new Date().toISOString(),
    status: "Ordered",
    paymentStatus: "Paid",
    items: cartItems.map((item) => ({ ...item }))
  };

  return { order, updatedMedicines };
}
