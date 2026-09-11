import {
  getLoggedInUser,
  clearLoggedInUser,
  getQueueForDoctor,
  updatePatientStatus,
  getQueueState,
  getDoctorById,
  getAppointments
} from "./queue.js";

const user = getLoggedInUser();
if (!user || user.role !== "doctor") {
  location.href = "index.html";
}

const myName = user.name;
document.getElementById("docNameDisplay").innerText = "Logged in as: " + myName;

const doctorProfile = getDoctorById(user.doctorId || user.id);
const profilePanel = document.getElementById("doctorProfile");
if (profilePanel) {
  profilePanel.innerHTML = doctorProfile ? `
    <img src="${doctorProfile.profileImage}" alt="${doctorProfile.name}" />
    <div>
      <h3 style="margin:0 0 4px;">${doctorProfile.name}</h3>
      <div class="muted">${doctorProfile.designation} • ${doctorProfile.department}</div>
      <div class="muted">${doctorProfile.qualification} • ${doctorProfile.experience} years</div>
      <div class="pill">₹${doctorProfile.consultationFee}</div>
      <div class="pill">${doctorProfile.availableToday ? "Available Today" : "Unavailable"}</div>
    </div>
  ` : "<p>Doctor profile unavailable.</p>";
}

let currentAppointmentId = null;
const doctorReports = [
  { patientName: "Asha Verma", type: "Lab Report", date: "Past Visit", detail: "CBC and glucose report available; follow-up review required before next consult.", status: "Required", requiredFor: "Next review" },
  { patientName: "Nikhil Rao", type: "Prescription History", date: "Previous Visit", detail: "Medication adherence record and dose change summary from the last visit.", status: "Required", requiredFor: "Refill check" },
  { patientName: "Maya Sen", type: "Imaging Summary", date: "Past Visit", detail: "Previous scan report needed to confirm rehabilitation progress.", status: "Required", requiredFor: "Treatment plan" }
];

function renderDoctorView() {
  const allPatients = getQueueState().patients;
  const waitingPatients = allPatients.filter((patient) => patient.doctor === myName && patient.status === "waiting");
  const completedPatients = allPatients.filter((patient) => patient.doctor === myName && patient.status === "completed");
  document.getElementById("waitingCount").innerText = waitingPatients.length;
  document.getElementById("todayVisits").innerText = Math.min(12, waitingPatients.length + completedPatients.length);
  document.getElementById("completedCount").innerText = completedPatients.length;

  const currentPatient = currentAppointmentId ? allPatients.find((patient) => patient.id === currentAppointmentId) : null;
  if (currentPatient) {
    document.getElementById("currentPatientName").innerText = currentPatient.patientName;
    document.getElementById("currentTokenDisplay").innerText = "Token #" + currentPatient.tokenNumber;
  } else {
    document.getElementById("currentPatientName").innerText = "None";
    document.getElementById("currentTokenDisplay").innerText = "";
  }

  renderAppointments();
  renderUpcomingConsultations();
  renderHistory();
  renderAnalytics();
  renderReports();
}

function renderAppointments() {
  const appointments = getAppointments().slice(0, 4);
  const container = document.getElementById("appointmentList");
  if (!container) return;
  container.innerHTML = appointments.length ? appointments.map((appointment) => `
    <div class="list-item">
      <strong>${appointment.patientName || "Patient"}</strong>
      <div class="muted">${appointment.slotTime || "Time TBD"}</div>
      <div class="muted">Doctor: ${appointment.doctorName || myName}</div>
      <div class="pill">${appointment.status || "Booked"}</div>
    </div>
  `).join("") : "<p class="muted">No appointments yet.</p>";
}

function renderUpcomingConsultations() {
  const appointments = getAppointments().filter((appointment) => appointment.status !== "Completed" && appointment.status !== "Cancelled").slice(0, 3);
  const container = document.getElementById("upcomingList");
  if (!container) return;
  container.innerHTML = appointments.length ? appointments.map((appointment) => `
    <div class="list-item">
      <strong>${appointment.patientName || "Patient"}</strong>
      <div class="muted">${appointment.slotTime || "Time TBD"}</div>
      <div class="muted">Reason: ${appointment.reason || "Routine follow-up"}</div>
      <div class="pill">${appointment.status || "Scheduled"}</div>
    </div>
  `).join("") : "<p class=\"muted\">No upcoming consultations yet.</p>";
}

function renderHistory() {
  const patients = getQueueState().patients.filter((patient) => patient.doctor === myName && patient.status === "completed");
  const container = document.getElementById("historyList");
  if (!container) return;
  container.innerHTML = patients.length ? patients.map((patient) => `
    <div class="list-item">
      <strong>${patient.patientName}</strong>
      <div class="muted">Completed consultation • Token #${patient.tokenNumber}</div>
      <div class="muted">Details: ${patient.notes || "Follow-up plan shared with patient and pharmacy."}</div>
    </div>
  `).join("") : "<p class=\"muted\">No completed consultations yet.</p>";
}

function renderReports() {
  const container = document.getElementById("reportsList");
  if (!container) return;
  container.innerHTML = doctorReports.map((report) => `
    <div class="list-item">
      <strong>${report.patientName}</strong>
      <div class="muted">${report.type} • ${report.date}</div>
      <div class="muted">${report.detail}</div>
      <div class="muted">Required for: ${report.requiredFor}</div>
      <div class="pill">${report.status}</div>
    </div>
  `).join("");
}

function renderAnalytics() {
  const patients = getQueueState().patients.filter((patient) => patient.doctor === myName);
  const container = document.getElementById("analyticsSummary");
  if (!container) return;
  const score = Math.min(98, 72 + patients.length * 4);
  container.innerHTML = `
    <div class="list-item">
      <strong>Health Score</strong>
      <div>${score}%</div>
      <div class="muted">Risk Level: ${score > 85 ? "Low" : score > 70 ? "Moderate" : "High"}</div>
    </div>
    <div class="list-item">
      <strong>Current Load</strong>
      <div>${patients.length} active patient records</div>
    </div>
  `;
}

function callNext() {
  const waitingPatients = getQueueState().patients
    .filter((patient) => patient.doctor === myName && patient.status === "waiting")
    .sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      return a.createdAt - b.createdAt;
    });

  if (waitingPatients.length === 0) {
    alert("No more patients waiting for you.");
    return;
  }

  const nextPatient = waitingPatients[0];
  currentAppointmentId = nextPatient.id;
  updatePatientStatus(nextPatient.id, "calling");
  document.getElementById("consultStatus").innerText = "Calling...";
  renderDoctorView();
}

function startConsultation() {
  if (!currentAppointmentId) {
    alert("Please call a patient first!");
    return;
  }

  updatePatientStatus(currentAppointmentId, "consulting");
  document.getElementById("consultStatus").innerText = "In Progress";
  renderDoctorView();
}

function endConsultation() {
  if (!currentAppointmentId) return;

  updatePatientStatus(currentAppointmentId, "completed");
  currentAppointmentId = null;
  document.getElementById("consultStatus").innerText = "Idle";
  renderDoctorView();
}

function sendPrescription() {
  const medicine = document.getElementById("prescriptionMedicine").value;
  const note = document.getElementById("prescriptionNote").value.trim();
  if (!medicine) {
    alert("Select a medicine first.");
    return;
  }

  alert(`Prescription sent for ${medicine}${note ? ` - ${note}` : ""}. Pharmacy has been notified.`);
}

function logout() {
  clearLoggedInUser();
  location.href = "index.html";
}

window.callNext = callNext;
window.startConsultation = startConsultation;
window.endConsultation = endConsultation;
window.sendPrescription = sendPrescription;
window.logout = logout;

renderDoctorView();
setInterval(renderDoctorView, 1000);