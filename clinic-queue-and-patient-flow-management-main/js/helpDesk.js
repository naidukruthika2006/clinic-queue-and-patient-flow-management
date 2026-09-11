import { getHelpReply, submitHelpTicket } from "./queue.js";

function createHelpDesk() {
  const button = document.createElement("button");
  button.id = "helpDeskButton";
  button.textContent = "❓ Help";
  button.style.position = "fixed";
  button.style.right = "20px";
  button.style.bottom = "20px";
  button.style.zIndex = "9999";
  button.style.padding = "12px 16px";
  button.style.border = "none";
  button.style.borderRadius = "999px";
  button.style.background = "#0a5ea5";
  button.style.color = "white";
  button.style.cursor = "pointer";
  button.style.boxShadow = "0 8px 20px rgba(0,0,0,0.2)";
  button.style.fontWeight = "700";

  const overlay = document.createElement("div");
  overlay.id = "helpDeskOverlay";
  overlay.style.display = "none";
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.background = "rgba(3, 22, 42, 0.55)";
  overlay.style.zIndex = "10000";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.padding = "16px";

  const panel = document.createElement("div");
  panel.style.width = "min(480px, 100%)";
  panel.style.maxHeight = "90vh";
  panel.style.overflowY = "auto";
  panel.style.background = "white";
  panel.style.borderRadius = "16px";
  panel.style.padding = "18px";
  panel.style.boxShadow = "0 20px 40px rgba(0,0,0,0.25)";

  panel.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
      <div>
        <h3 style="margin:0;color:#0a5ea5;">Smart Clinic Help Desk</h3>
        <div style="font-size:13px;color:#6c757d;">Live support • Emergency: +91-9876543210</div>
      </div>
      <button id="closeHelpDesk" style="border:none;background:#f1f5f9;padding:8px 10px;border-radius:8px;cursor:pointer;">✕</button>
    </div>

    <div id="chatMessages" style="margin-top:14px;padding:12px;background:#f8fbff;border-radius:12px;min-height:140px;">
      <div style="margin-bottom:8px;padding:8px 10px;border-radius:8px;background:#e8f3ff;color:#0a5ea5;">Hello! I can help with appointments, medicines, payments, reports, or emergencies.</div>
    </div>

    <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;">
      <button class="quick-answer" data-key="appointment">Appointment</button>
      <button class="quick-answer" data-key="medicine">Medicine</button>
      <button class="quick-answer" data-key="payment">Payment</button>
      <button class="quick-answer" data-key="emergency">Emergency</button>
    </div>

    <div style="margin-top:12px;display:flex;gap:8px;">
      <input id="helpInput" placeholder="Type your question..." style="flex:1;padding:10px;border:1px solid #ced4da;border-radius:8px;" />
      <button id="sendHelpBtn" style="padding:10px 12px;border:none;background:#0a5ea5;color:white;border-radius:8px;cursor:pointer;">Send</button>
    </div>

    <form id="helpTicketForm" style="margin-top:12px;border-top:1px solid #e9ecef;padding-top:12px;">
      <div style="font-size:13px;font-weight:700;color:#0a5ea5;margin-bottom:8px;">Raise a support ticket</div>
      <input id="ticketName" placeholder="Your name" required style="width:100%;padding:10px;margin-top:6px;border:1px solid #ced4da;border-radius:8px;" />
      <input id="ticketEmail" placeholder="Email" required style="width:100%;padding:10px;margin-top:8px;border:1px solid #ced4da;border-radius:8px;" />
      <textarea id="ticketIssue" placeholder="Describe your issue" required style="width:100%;padding:10px;margin-top:8px;border:1px solid #ced4da;border-radius:8px;min-height:70px;"></textarea>
      <button type="submit" style="width:100%;margin-top:8px;padding:10px;border:none;border-radius:8px;background:#14a0a0;color:white;cursor:pointer;font-weight:700;">Submit Ticket</button>
    </form>
  `;

  overlay.appendChild(panel);
  document.body.appendChild(button);
  document.body.appendChild(overlay);

  const toggle = () => {
    overlay.style.display = overlay.style.display === "flex" ? "none" : "flex";
  };

  button.addEventListener("click", toggle);
  document.getElementById("closeHelpDesk").addEventListener("click", toggle);

  document.querySelectorAll(".quick-answer").forEach((element) => {
    element.addEventListener("click", () => {
      const response = getHelpReply(element.getAttribute("data-key"));
      addMessage(response, "bot");
    });
  });

  const sendHelpBtn = document.getElementById("sendHelpBtn");
  const helpInput = document.getElementById("helpInput");
  const chatMessages = document.getElementById("chatMessages");

  const addMessage = (text, sender = "user") => {
    const row = document.createElement("div");
    row.style.marginBottom = "8px";
    row.style.padding = "8px 10px";
    row.style.borderRadius = "8px";
    row.style.background = sender === "user" ? "#eef6ff" : "#e8f5e9";
    row.style.color = "#222";
    row.textContent = text;
    chatMessages.appendChild(row);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  sendHelpBtn.addEventListener("click", () => {
    const value = helpInput.value.trim();
    if (!value) return;
    addMessage(value, "user");
    helpInput.value = "";
    setTimeout(() => {
      addMessage(getHelpReply(value), "bot");
    }, 350);
  });

  document.getElementById("helpTicketForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const ticket = {
      name: document.getElementById("ticketName").value.trim(),
      email: document.getElementById("ticketEmail").value.trim(),
      issue: document.getElementById("ticketIssue").value.trim(),
      status: "Open"
    };
    submitHelpTicket(ticket);
    addMessage(`Support ticket received for ${ticket.name}. We will contact you shortly.`, "bot");
    event.target.reset();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", createHelpDesk);
} else {
  createHelpDesk();
}
