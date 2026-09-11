import {
  getLoggedInUser,
  clearLoggedInUser,
  registerPatient,
  getQueueState,
  getDoctors
} from "./queue.js";

const user = getLoggedInUser();
if (!user || user.role !== "staff") { location.href = "index.html"; }

function populateDoctorSelect() {
  const select = document.getElementById("doctorSelect");
  if (!select) return;

  select.innerHTML = '<option value="">-- Assign Doctor --</option>' + getDoctors()
    .map((doctor) => `<option value="${doctor.name}">${doctor.name} • ${doctor.department}</option>`)
    .join("");
}

function renderQueue() {
  const list = document.getElementById("queueList");
  const queue = getQueueState().patients;

  list.innerHTML = "";

  if (queue.length === 0) {
    list.innerHTML = "<p style='text-align:center; color:#999;'>Clinic queue is currently empty.</p>";
    return;
  }

  queue.forEach((patient) => {
    const div = document.createElement("div");
    div.className = `queue-item ${patient.isEmergency ? "emergency-row" : ""}`;
    div.innerHTML = `
      <div>
        <strong style="font-size:15px;">${patient.patientName}</strong>
        <div style="font-size:12px; color:#666;">
          Doc: ${patient.doctor} | Token: #${patient.tokenNumber}
        </div>
      </div>
      <div>
        <span class="status-tag ${patient.status}">${patient.status}</span>
        ${patient.isEmergency ? '<br><span style="color:red; font-size:10px; font-weight:bold;">🚨 HIGH PRIORITY</span>' : ""}
      </div>
    `;
    list.appendChild(div);
  });
}

function addPatient() {
  const name = document.getElementById("patientName").value.trim();
  const doctor = document.getElementById("doctorSelect").value;
  const isEmergency = document.getElementById("emergency").checked;

  if (!name || !doctor) {
    alert("Please enter patient name and assign a doctor.");
    return;
  }

  const patient = registerPatient({
    patientName: `${name} (Walk-in)`,
    doctor,
    username: "walk-in",
    type: "walk-in",
    isEmergency,
    createdBy: "staff"
  });

  alert(`Patient ${name} added as Token #${patient.tokenNumber}`);
  document.getElementById("patientName").value = "";
  document.getElementById("emergency").checked = false;
  renderQueue();
}

function logout() {
  clearLoggedInUser();
  location.href = "index.html";
}

window.addPatient = addPatient;
window.logout = logout;

populateDoctorSelect();
renderQueue();
setInterval(renderQueue, 1000);