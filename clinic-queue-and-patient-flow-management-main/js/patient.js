import { getLoggedInUser, clearLoggedInUser, getDoctors } from "./queue.js";

const user = getLoggedInUser();
if (!user || user.role !== "patient") {
  location.href = "index.html";
}

function renderDoctorCards() {
  const container = document.getElementById("doctorCards");
  if (!container) return;

  const doctors = getDoctors();
  container.innerHTML = doctors.map((doctor) => `
    <div class="doctor-card">
      <img src="${doctor.profileImage}" alt="${doctor.name}" />
      <div class="doctor-info">
        <h4>${doctor.name}</h4>
        <p class="muted">${doctor.designation} • ${doctor.department}</p>
        <p><strong>Qualification:</strong> ${doctor.qualification}</p>
        <p><strong>Experience:</strong> ${doctor.experience} years</p>
        <p><strong>Fee:</strong> ₹${doctor.consultationFee}</p>
        <p><strong>Rating:</strong> ${doctor.rating} / 5</p>
        <p><strong>Availability:</strong> ${doctor.availableToday ? "Available Today" : "Unavailable Today"}</p>
        <p><strong>Slots Left:</strong> ${Math.max(0, (doctor.totalSlots || 0) - (doctor.bookedSlots || 0))}</p>
        <a class="book-btn" href="appointments.html?doctorId=${doctor.id}">Book Appointment</a>
      </div>
    </div>
  `).join("");
}

window.logout = () => {
  clearLoggedInUser();
  location.href = "index.html";
};

renderDoctorCards();
