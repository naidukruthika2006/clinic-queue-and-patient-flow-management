import { getDoctors, getDoctorSlots, bookAppointment } from "./queue.js";

const doctors = getDoctors();
const doctorSelect = document.getElementById("doctorSelect");
const doctorDetails = document.getElementById("doctorDetails");
const slotList = document.getElementById("slotList");
const bookBtn = document.getElementById("bookBtn");
const params = new URLSearchParams(window.location.search);
const initialDoctorId = params.get("doctorId");

function getSelectedDoctor() {
  return doctors.find((doctor) => String(doctor.id) === String(doctorSelect.value)) || doctors[0] || null;
}

function renderDoctors() {
  doctorSelect.innerHTML = "";
  doctors.forEach((doctor) => {
    const option = document.createElement("option");
    option.value = doctor.id;
    option.textContent = `${doctor.name} • ${doctor.specialization}`;
    doctorSelect.appendChild(option);
  });

  if (initialDoctorId && doctors.some((doctor) => String(doctor.id) === initialDoctorId)) {
    doctorSelect.value = initialDoctorId;
  } else if (doctors[0]) {
    doctorSelect.value = doctors[0].id;
  }

  renderDoctorDetails();
  renderSlots();
}

function renderDoctorDetails() {
  const selectedDoctor = getSelectedDoctor();
  if (!selectedDoctor) {
    doctorDetails.innerHTML = "";
    return;
  }

  const availabilityLabel = selectedDoctor.availableToday ? "Available today" : "Unavailable today";
  const remainingSlots = (selectedDoctor.totalSlots || 0) - (selectedDoctor.bookedSlots || 0);

  doctorDetails.innerHTML = `
    <div style="display:flex; gap:12px; align-items:center; margin-bottom:8px;">
      <img src="${selectedDoctor.profileImage}" alt="${selectedDoctor.name}" style="width:62px;height:62px;border-radius:50%;object-fit:cover;" />
      <div>
        <strong>${selectedDoctor.name}</strong><br>
        <span class="muted">${selectedDoctor.designation} • ${selectedDoctor.department}</span>
      </div>
    </div>
    <div class="muted">${selectedDoctor.qualification} • ${selectedDoctor.experience} years</div>
    <div class="muted">Consultation Fee: ₹${selectedDoctor.consultationFee}</div>
    <div class="muted">${availabilityLabel} • ${remainingSlots} slots left</div>
  `;
}

function renderSlots() {
  const selectedDoctor = getSelectedDoctor();
  const slots = getDoctorSlots(selectedDoctor?.id);
  slotList.innerHTML = "";
  slots.forEach((slot) => {
    const available = slot.availableSlots > 0;
    const statusLabel = available ? (slot.availableSlots <= 2 ? "Almost Full" : "Available") : "Fully Booked";
    const statusColor = available ? (slot.availableSlots <= 2 ? "#b8860b" : "#28a745") : "#dc3545";
    const row = document.createElement("div");
    row.className = "slot";
    row.innerHTML = `
      <label style="display:flex; justify-content:space-between; align-items:center; gap:10px; cursor:pointer;">
        <span><strong>${slot.slotTime}</strong><br><span class="muted">${slot.availableSlots} / ${slot.totalSlots} remaining</span></span>
        <span style="color:${statusColor}; font-weight:700;">${statusLabel}</span>
      </label>
      <input type="radio" name="slot" value="${slot.slotTime}" ${slot.availableSlots > 0 ? "" : "disabled"} style="margin-top:8px;" />
    `;
    slotList.appendChild(row);
  });
}

bookBtn.addEventListener("click", () => {
  const doctorId = doctorSelect.value;
  const name = document.getElementById("patientName").value.trim();
  const phone = document.getElementById("patientPhone").value.trim();
  const selectedSlot = document.querySelector('input[name="slot"]:checked')?.value || getDoctorSlots(doctorId)[0]?.slotTime;

  if (!doctorId || !name || !phone) {
    alert("Please enter patient details.");
    return;
  }

  if (!selectedSlot) {
    alert("Please pick an available slot.");
    return;
  }

  const appointment = {
    doctorId,
    doctorName: doctors.find((doctor) => String(doctor.id) === String(doctorId))?.name || "Doctor",
    patientName: name,
    phone,
    slotTime: selectedSlot,
    status: "Booked"
  };
  bookAppointment(appointment);
  alert("Appointment booked successfully.");
});

doctorSelect.addEventListener("change", () => {
  renderDoctorDetails();
  renderSlots();
});
renderDoctors();
