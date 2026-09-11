import { seedMedicines, addMedicineEntry, updateMedicineStock, addOrUpdateCart, removeCartItem, placeOrderFromCart } from "./medicineLogic.js";

const STORAGE_KEY = "smartClinicQueueState";
const USERS_KEY = "smartClinicUsers";
const CURRENT_USER_KEY = "loggedInUser";
const MEDICINES_KEY = "smartClinicMedicines";
const CART_KEY = "smartClinicCart";
const ORDERS_KEY = "smartClinicOrders";
const HELP_TICKETS_KEY = "smartClinicHelpTickets";
const APPOINTMENTS_KEY = "smartClinicAppointments";
const DOCTORS_KEY = "smartClinicDoctors";

const DEFAULT_APPOINTMENTS = [
  { id: "appt-1", patientName: "Asha Verma", doctorId: 1, doctorName: "Dr. Rahul Sharma", slotTime: "09:00 AM - 10:00 AM", status: "Confirmed" },
  { id: "appt-2", patientName: "Nikhil Rao", doctorId: 2, doctorName: "Dr. Priya Reddy", slotTime: "10:00 AM - 11:00 AM", status: "Confirmed" },
  { id: "appt-3", patientName: "Maya Sen", doctorId: 5, doctorName: "Dr. Meena Rao", slotTime: "11:00 AM - 12:00 PM", status: "Pending" }
];

const DEFAULT_HELP_TICKETS = [
  { id: 101, name: "Riya", issue: "Need help booking a follow-up appointment", status: "Open" },
  { id: 102, name: "Karthik", issue: "Need prescription refill update", status: "Resolved" }
];

const DEFAULT_ORDERS = [
  { id: "order-1001", patientName: "Asha Verma", username: "asha", paymentStatus: "Paid", status: "Ordered" },
  { id: "order-1002", patientName: "Nikhil Rao", username: "nikhil", paymentStatus: "Paid", status: "Delivered" }
];

const DEFAULT_DOCTORS = [
  { id: 1, name: "Dr. Rahul Sharma", fullName: "Dr. Rahul Sharma", email: "rahul@smartclinic.com", username: "rahul@smartclinic.com", password: "doctor123", specialization: "Cardiology", designation: "Senior Cardiologist", qualification: "MBBS, MD", experience: 18, consultationFee: 600, department: "Cardiology", languages: ["English", "Hindi"], hospitalName: "Smart Clinic", availableToday: true, rating: 4.8, totalSlots: 10, bookedSlots: 4, profileImage: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80", slots: [{ slotTime: "09:00 AM - 10:00 AM", totalSlots: 10, bookedSlots: 4, availableSlots: 6 }, { slotTime: "10:00 AM - 11:00 AM", totalSlots: 10, bookedSlots: 8, availableSlots: 2 }, { slotTime: "11:00 AM - 12:00 PM", totalSlots: 10, bookedSlots: 10, availableSlots: 0 }] },
  { id: 2, name: "Dr. Priya Reddy", fullName: "Dr. Priya Reddy", email: "priya@smartclinic.com", username: "priya@smartclinic.com", password: "doctor123", specialization: "General Medicine", designation: "Consultant Physician", qualification: "MBBS, MD", experience: 12, consultationFee: 500, department: "General Medicine", languages: ["English", "Tamil"], hospitalName: "Smart Clinic", availableToday: true, rating: 4.7, totalSlots: 10, bookedSlots: 3, profileImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80", slots: [{ slotTime: "09:00 AM - 10:00 AM", totalSlots: 10, bookedSlots: 3, availableSlots: 7 }, { slotTime: "10:00 AM - 11:00 AM", totalSlots: 10, bookedSlots: 5, availableSlots: 5 }, { slotTime: "11:00 AM - 12:00 PM", totalSlots: 10, bookedSlots: 2, availableSlots: 8 }] },
  { id: 3, name: "Dr. Arjun Kumar", fullName: "Dr. Arjun Kumar", email: "arjun@smartclinic.com", username: "arjun@smartclinic.com", password: "doctor123", specialization: "Orthopedics", designation: "Orthopedic Surgeon", qualification: "MBBS, MS", experience: 15, consultationFee: 700, department: "Orthopedics", languages: ["English", "Hindi"], hospitalName: "Smart Clinic", availableToday: true, rating: 4.9, totalSlots: 10, bookedSlots: 5, profileImage: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80", slots: [{ slotTime: "09:00 AM - 10:00 AM", totalSlots: 10, bookedSlots: 5, availableSlots: 5 }, { slotTime: "10:00 AM - 11:00 AM", totalSlots: 10, bookedSlots: 6, availableSlots: 4 }, { slotTime: "11:00 AM - 12:00 PM", totalSlots: 10, bookedSlots: 1, availableSlots: 9 }] },
  { id: 4, name: "Dr. Sneha Patel", fullName: "Dr. Sneha Patel", email: "sneha@smartclinic.com", username: "sneha@smartclinic.com", password: "doctor123", specialization: "Dermatology", designation: "Dermatologist", qualification: "MBBS, MD", experience: 10, consultationFee: 550, department: "Dermatology", languages: ["English", "Marathi"], hospitalName: "Smart Clinic", availableToday: true, rating: 4.6, totalSlots: 10, bookedSlots: 2, profileImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80", slots: [{ slotTime: "09:00 AM - 10:00 AM", totalSlots: 10, bookedSlots: 2, availableSlots: 8 }, { slotTime: "10:00 AM - 11:00 AM", totalSlots: 10, bookedSlots: 4, availableSlots: 6 }, { slotTime: "11:00 AM - 12:00 PM", totalSlots: 10, bookedSlots: 1, availableSlots: 9 }] },
  { id: 5, name: "Dr. Meena Rao", fullName: "Dr. Meena Rao", email: "meena@smartclinic.com", username: "meena@smartclinic.com", password: "doctor123", specialization: "Pediatrics", designation: "Pediatrician", qualification: "MBBS, MD", experience: 14, consultationFee: 480, department: "Pediatrics", languages: ["English", "Hindi"], hospitalName: "Smart Clinic", availableToday: true, rating: 4.7, totalSlots: 10, bookedSlots: 3, profileImage: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&q=80", slots: [{ slotTime: "09:00 AM - 10:00 AM", totalSlots: 10, bookedSlots: 3, availableSlots: 7 }, { slotTime: "10:00 AM - 11:00 AM", totalSlots: 10, bookedSlots: 2, availableSlots: 8 }, { slotTime: "11:00 AM - 12:00 PM", totalSlots: 10, bookedSlots: 4, availableSlots: 6 }] },
  { id: 6, name: "Dr. Vinay Gupta", fullName: "Dr. Vinay Gupta", email: "vinay@smartclinic.com", username: "vinay@smartclinic.com", password: "doctor123", specialization: "Neurology", designation: "Neurologist", qualification: "MBBS, DM", experience: 16, consultationFee: 650, department: "Neurology", languages: ["English", "Hindi"], hospitalName: "Smart Clinic", availableToday: true, rating: 4.8, totalSlots: 10, bookedSlots: 5, profileImage: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=400&q=80", slots: [{ slotTime: "09:00 AM - 10:00 AM", totalSlots: 10, bookedSlots: 5, availableSlots: 5 }, { slotTime: "10:00 AM - 11:00 AM", totalSlots: 10, bookedSlots: 3, availableSlots: 7 }, { slotTime: "11:00 AM - 12:00 PM", totalSlots: 10, bookedSlots: 6, availableSlots: 4 }] },
  { id: 7, name: "Dr. Kiran Rao", fullName: "Dr. Kiran Rao", email: "kiran@smartclinic.com", username: "kiran@smartclinic.com", password: "doctor123", specialization: "ENT", designation: "ENT Specialist", qualification: "MBBS, MS", experience: 11, consultationFee: 520, department: "ENT", languages: ["English", "Kannada"], hospitalName: "Smart Clinic", availableToday: true, rating: 4.5, totalSlots: 10, bookedSlots: 2, profileImage: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?auto=format&fit=crop&w=400&q=80", slots: [{ slotTime: "09:00 AM - 10:00 AM", totalSlots: 10, bookedSlots: 2, availableSlots: 8 }, { slotTime: "10:00 AM - 11:00 AM", totalSlots: 10, bookedSlots: 1, availableSlots: 9 }, { slotTime: "11:00 AM - 12:00 PM", totalSlots: 10, bookedSlots: 3, availableSlots: 7 }] },
  { id: 8, name: "Dr. Anjali Sharma", fullName: "Dr. Anjali Sharma", email: "anjali@smartclinic.com", username: "anjali@smartclinic.com", password: "doctor123", specialization: "Gynecology", designation: "Gynecologist", qualification: "MBBS, MS", experience: 13, consultationFee: 580, department: "Gynecology", languages: ["English", "Hindi"], hospitalName: "Smart Clinic", availableToday: true, rating: 4.7, totalSlots: 10, bookedSlots: 4, profileImage: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&q=80", slots: [{ slotTime: "09:00 AM - 10:00 AM", totalSlots: 10, bookedSlots: 4, availableSlots: 6 }, { slotTime: "10:00 AM - 11:00 AM", totalSlots: 10, bookedSlots: 2, availableSlots: 8 }, { slotTime: "11:00 AM - 12:00 PM", totalSlots: 10, bookedSlots: 5, availableSlots: 5 }] },
  { id: 9, name: "Dr. Ramesh Kumar", fullName: "Dr. Ramesh Kumar", email: "ramesh@smartclinic.com", username: "ramesh@smartclinic.com", password: "doctor123", specialization: "Ophthalmology", designation: "Ophthalmologist", qualification: "MBBS, MS", experience: 17, consultationFee: 620, department: "Ophthalmology", languages: ["English", "Telugu"], hospitalName: "Smart Clinic", availableToday: true, rating: 4.8, totalSlots: 10, bookedSlots: 3, profileImage: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=400&q=80", slots: [{ slotTime: "09:00 AM - 10:00 AM", totalSlots: 10, bookedSlots: 3, availableSlots: 7 }, { slotTime: "10:00 AM - 11:00 AM", totalSlots: 10, bookedSlots: 4, availableSlots: 6 }, { slotTime: "11:00 AM - 12:00 PM", totalSlots: 10, bookedSlots: 2, availableSlots: 8 }] },
  { id: 10, name: "Dr. Deepika Singh", fullName: "Dr. Deepika Singh", email: "deepika@smartclinic.com", username: "deepika@smartclinic.com", password: "doctor123", specialization: "Dentistry", designation: "Dentist", qualification: "BDS", experience: 9, consultationFee: 450, department: "Dentistry", languages: ["English", "Hindi"], hospitalName: "Smart Clinic", availableToday: true, rating: 4.6, totalSlots: 10, bookedSlots: 1, profileImage: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?auto=format&fit=crop&w=400&q=80", slots: [{ slotTime: "09:00 AM - 10:00 AM", totalSlots: 10, bookedSlots: 1, availableSlots: 9 }, { slotTime: "10:00 AM - 11:00 AM", totalSlots: 10, bookedSlots: 2, availableSlots: 8 }, { slotTime: "11:00 AM - 12:00 PM", totalSlots: 10, bookedSlots: 3, availableSlots: 7 }] }
];
export const DOCTOR_NAMES = DEFAULT_DOCTORS.map((doctor) => doctor.name);

function getStorage() {
  return typeof window !== "undefined" ? window.sessionStorage : null;
}

function readState() {
  const storage = getStorage();
  if (!storage) {
    return { patients: [], nextToken: 1 };
  }

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) {
      return { patients: [], nextToken: 1 };
    }

    const parsed = JSON.parse(raw);
    return {
      patients: Array.isArray(parsed.patients) ? parsed.patients : [],
      nextToken: typeof parsed.nextToken === "number" ? parsed.nextToken : 1
    };
  } catch (error) {
    console.warn("Queue state could not be read.", error);
    return { patients: [], nextToken: 1 };
  }
}

function writeState(state) {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function readUsers() {
  const storage = getStorage();
  if (!storage) return [];

  try {
    const raw = storage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.warn("User data could not be read.", error);
    return [];
  }
}

function writeUsers(users) {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(USERS_KEY, JSON.stringify(users));
}

function readMedicines() {
  const storage = getStorage();
  if (!storage) return seedMedicines;

  try {
    const raw = storage.getItem(MEDICINES_KEY);
    if (!raw) {
      storage.setItem(MEDICINES_KEY, JSON.stringify(seedMedicines));
      return seedMedicines;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : seedMedicines;
  } catch (error) {
    console.warn("Medicine catalog could not be read.", error);
    return seedMedicines;
  }
}

function writeMedicines(medicines) {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(MEDICINES_KEY, JSON.stringify(medicines));
}

function readCart() {
  const storage = getStorage();
  if (!storage) return [];

  try {
    const raw = storage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.warn("Cart data could not be read.", error);
    return [];
  }
}

function writeCart(cartItems) {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(CART_KEY, JSON.stringify(cartItems));
}

function readOrders() {
  const storage = getStorage();
  if (!storage) return DEFAULT_ORDERS;

  try {
    const raw = storage.getItem(ORDERS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_ORDERS;
  } catch (error) {
    console.warn("Orders could not be read.", error);
    return DEFAULT_ORDERS;
  }
}

function writeOrders(orders) {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

function readHelpTickets() {
  const storage = getStorage();
  if (!storage) return DEFAULT_HELP_TICKETS;

  try {
    const raw = storage.getItem(HELP_TICKETS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_HELP_TICKETS;
  } catch (error) {
    console.warn("Help tickets could not be read.", error);
    return DEFAULT_HELP_TICKETS;
  }
}

function writeHelpTickets(tickets) {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(HELP_TICKETS_KEY, JSON.stringify(tickets));
}

function readAppointments() {
  const storage = getStorage();
  if (!storage) return DEFAULT_APPOINTMENTS;

  try {
    const raw = storage.getItem(APPOINTMENTS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_APPOINTMENTS;
  } catch (error) {
    console.warn("Appointments could not be read.", error);
    return DEFAULT_APPOINTMENTS;
  }
}

function writeAppointments(appointments) {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
}

function readDoctors() {
  const storage = getStorage();
  if (!storage) return DEFAULT_DOCTORS;

  try {
    const raw = storage.getItem(DOCTORS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    const baseDoctors = Array.isArray(parsed) ? parsed : [];
    const mergedDoctors = DEFAULT_DOCTORS.map((defaultDoctor) => {
      const existingDoctor = baseDoctors.find((doctor) => String(doctor.id) === String(defaultDoctor.id));
      return existingDoctor ? { ...defaultDoctor, ...existingDoctor } : defaultDoctor;
    });

    const extraDoctors = baseDoctors.filter((doctor) => !DEFAULT_DOCTORS.some((defaultDoctor) => String(defaultDoctor.id) === String(doctor.id)));
    const updatedDoctors = [...mergedDoctors, ...extraDoctors];
    storage.setItem(DOCTORS_KEY, JSON.stringify(updatedDoctors));
    return updatedDoctors;
  } catch (error) {
    console.warn("Doctor data could not be read.", error);
    return DEFAULT_DOCTORS;
  }
}

function writeDoctors(doctors) {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(DOCTORS_KEY, JSON.stringify(doctors));
}

export function getAllUsers() {
  return readUsers();
}

export function userExists(username) {
  return getAllUsers().some((user) => user.username.toLowerCase() === username.toLowerCase());
}

export function saveUser(user) {
  const users = getAllUsers();
  users.push(user);
  writeUsers(users);
  return user;
}

export function authenticateUser(username, password) {
  const normalizedUsername = String(username || "").toLowerCase().trim();
  const user = getAllUsers().find((entry) => entry.username.toLowerCase() === normalizedUsername && entry.password === password);
  if (user) return user;

  const doctor = getDoctors().find((entry) => {
    const candidates = [entry.username, entry.email, entry.fullName, entry.name].filter(Boolean).map((value) => String(value).toLowerCase());
    return candidates.includes(normalizedUsername);
  });

  if (doctor && String(doctor.password) === String(password)) {
    return {
      id: doctor.id,
      name: doctor.fullName || doctor.name,
      username: doctor.email || doctor.username,
      role: "doctor",
      doctorId: doctor.id,
      doctor
    };
  }

  return null;
}

export function saveLoggedInUser(user) {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function getLoggedInUser() {
  const storage = getStorage();
  if (!storage) return null;

  try {
    const raw = storage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn("Logged-in user could not be read.", error);
    return null;
  }
}

export function clearLoggedInUser() {
  const storage = getStorage();
  if (!storage) return;
  storage.removeItem(CURRENT_USER_KEY);
}

export function getQueueState() {
  const state = readState();
  return {
    patients: state.patients
      .filter((patient) => patient.status !== "completed")
      .sort((a, b) => {
        if (a.priority !== b.priority) return a.priority - b.priority;
        return a.createdAt - b.createdAt;
      }),
    nextToken: state.nextToken
  };
}

export function getQueueForDoctor(doctor) {
  return getQueueState().patients.filter((patient) => patient.doctor === doctor);
}

export function registerPatient({ patientName, doctor, username, type = "walk-in", isEmergency = false, createdBy = "staff", doctorId = null }) {
  const state = readState();
  const patient = {
    id: `patient-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    patientName,
    doctor,
    doctorId,
    username,
    type,
    isEmergency,
    status: "waiting",
    tokenNumber: state.nextToken,
    priority: isEmergency ? 1 : 2,
    createdAt: Date.now(),
    createdBy
  };

  state.patients.push(patient);
  state.nextToken += 1;
  writeState(state);
  return patient;
}

export function getPatientById(id) {
  return getQueueState().patients.find((patient) => patient.id === id) || null;
}

export function getPatientForUsername(username) {
  return getQueueState().patients.find((patient) => patient.username === username) || null;
}

export function updatePatientStatus(id, status) {
  const state = readState();
  const patient = state.patients.find((item) => item.id === id);
  if (!patient) return null;

  patient.status = status;
  writeState(state);
  return patient;
}

export function cancelPatient(id) {
  const state = readState();
  state.patients = state.patients.filter((patient) => patient.id !== id);
  writeState(state);
  return true;
}

export function getEstimatedWaitMinutes(patient) {
  if (!patient) return 0;

  const doctorQueue = getQueueForDoctor(patient.doctor);
  const position = doctorQueue.findIndex((item) => item.id === patient.id) + 1;
  const averageMinutes = 10;
  return Math.max(0, (position - 1) * averageMinutes);
}

export function getMedicineCatalog() {
  return readMedicines();
}

export function getDoctorNames() {
  return getDoctors().map((doctor) => doctor.name);
}

export function getDoctors() {
  return readDoctors();
}

export function getDoctorById(doctorId) {
  return getDoctors().find((doctor) => String(doctor.id) === String(doctorId)) || null;
}

export function getDoctorByName(name) {
  const normalizedName = String(name || "").trim().toLowerCase();
  return getDoctors().find((doctor) => doctor.name.toLowerCase() === normalizedName) || null;
}

export function getDoctorSlots(doctorId) {
  const doctor = getDoctorById(doctorId);
  if (!doctor || !Array.isArray(doctor.slots)) {
    return [];
  }
  return doctor.slots.map((slot) => ({ ...slot, doctorId }));
}

export function getMedicineById(id) {
  return getMedicineCatalog().find((medicine) => medicine.id === id) || null;
}

export function addMedicine(medicine) {
  const updatedMedicines = addMedicineEntry(getMedicineCatalog(), medicine);
  writeMedicines(updatedMedicines);
  return updatedMedicines[0];
}

export function updateMedicineQuantity(medicineId, delta) {
  const updatedMedicines = updateMedicineStock(getMedicineCatalog(), medicineId, delta);
  writeMedicines(updatedMedicines);
  return updatedMedicines;
}

export function getCartItems() {
  return readCart();
}

export function addToCart(medicineId, quantity = 1) {
  const updatedCart = addOrUpdateCart(readCart(), medicineId, quantity);
  writeCart(updatedCart);
  return updatedCart;
}

export function removeFromCart(medicineId) {
  const updatedCart = removeCartItem(readCart(), medicineId);
  writeCart(updatedCart);
  return updatedCart;
}

export function clearCart() {
  writeCart([]);
  return [];
}

export function getOrders() {
  return readOrders();
}

export function placeOrder(orderData) {
  const cartItems = readCart();
  const medicines = readMedicines();
  const result = placeOrderFromCart(cartItems, medicines, orderData);
  const nextOrders = [result.order, ...readOrders()];
  writeOrders(nextOrders);
  writeMedicines(result.updatedMedicines);
  writeCart([]);
  return result.order;
}

export function getHelpReply(message) {
  const value = String(message || "").toLowerCase();
  if (value.includes("appointment")) {
    return "You can book an appointment from the Appointments section.";
  }
  if (value.includes("medicine") || value.includes("pharmacy")) {
    return "Search medicines in the Pharmacy section and add them to your cart.";
  }
  if (value.includes("payment")) {
    return "Payments can be made using UPI, Debit/Credit Card, or Cash.";
  }
  if (value.includes("report")) {
    return "Your medical reports are available under Medical Records.";
  }
  if (value.includes("emergency")) {
    return "Please contact the emergency desk at +91-9876543210.";
  }
  return "Thank you for contacting Smart Clinic Help Desk. Our support team will assist you shortly.";
}

export function submitHelpTicket(ticket) {
  const tickets = readHelpTickets();
  const nextTickets = [{ id: Date.now(), ...ticket }, ...tickets];
  writeHelpTickets(nextTickets);
  return nextTickets[0];
}

export function getAppointments() {
  return readAppointments();
}

export function bookAppointment(appointment) {
  const appointments = readAppointments();
  const nextAppointments = [{ id: Date.now(), ...appointment }, ...appointments];
  writeAppointments(nextAppointments);

  const doctors = readDoctors();
  const doctor = doctors.find((item) => String(item.id) === String(appointment.doctorId));
  if (doctor) {
    doctor.bookedSlots = Number(doctor.bookedSlots || 0) + 1;
    doctor.availableToday = doctor.bookedSlots < doctor.totalSlots;
    doctor.slots = doctor.slots.map((slot) => {
      if (slot.slotTime === appointment.slotTime && slot.availableSlots > 0) {
        return {
          ...slot,
          bookedSlots: Number(slot.bookedSlots || 0) + 1,
          availableSlots: Math.max(0, Number(slot.availableSlots || 0) - 1)
        };
      }
      return slot;
    });
    writeDoctors(doctors);
  }

  return nextAppointments[0];
}
