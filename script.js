// ===== DATA MANAGEMENT =====
let currentUser = null;

// Initialize sample data
function initializeSampleData() {
    if (!localStorage.getItem('patients')) {
        const patients = [
            { id: 'P001', name: 'John Doe', email: 'john@example.com', phone: '5551234567', dob: '1985-03-15', bloodType: 'O+', gender: 'Male' },
            { id: 'P002', name: 'Sarah Wilson', email: 'sarah@example.com', phone: '5559876543', dob: '1990-07-22', bloodType: 'A+', gender: 'Female' },
            { id: 'P003', name: 'Michael Chen', email: 'michael@example.com', phone: '5555555555', dob: '1980-11-10', bloodType: 'B+', gender: 'Male' }
        ];
        localStorage.setItem('patients', JSON.stringify(patients));
    }

    if (!localStorage.getItem('appointments')) {
        const appointments = [
            { id: 'A001', patientId: 'P001', doctorId: 'D001', date: '2025-06-20', time: '10:00', status: 'confirmed', reason: 'Regular checkup' },
            { id: 'A002', patientId: 'P002', doctorId: 'D002', date: '2025-06-21', time: '14:00', status: 'pending', reason: 'Eye examination' },
            { id: 'A003', patientId: 'P003', doctorId: 'D001', date: '2025-06-19', time: '11:30', status: 'confirmed', reason: 'Blood test' }
        ];
        localStorage.setItem('appointments', JSON.stringify(appointments));
    }

    if (!localStorage.getItem('staff')) {
        const staff = [
            { id: 'D001', name: 'Dr. Rajesh Patel', role: 'doctor', department: 'General Medicine', email: 'rajesh@hospital.com', phone: '5551111111' },
            { id: 'D002', name: 'Dr. Emily Garcia', role: 'doctor', department: 'Ophthalmology', email: 'emily@hospital.com', phone: '5552222222' },
            { id: 'N001', name: 'Jane Smith', role: 'nurse', department: 'General Medicine', email: 'jane@hospital.com', phone: '5553333333' }
        ];
        localStorage.setItem('staff', JSON.stringify(staff));
    }

    if (!localStorage.getItem('departments')) {
        const departments = [
            { id: 'D01', name: 'General Medicine', head: 'Dr. Rajesh Patel', staffCount: 8 },
            { id: 'D02', name: 'Ophthalmology', head: 'Dr. Emily Garcia', staffCount: 5 },
            { id: 'D03', name: 'Pediatrics', head: 'Dr. James Wilson', staffCount: 6 }
        ];
        localStorage.setItem('departments', JSON.stringify(departments));
    }

    if (!localStorage.getItem('medicalRecords')) {
        const records = [
            { id: 'R001', patientId: 'P001', doctorId: 'D001', date: '2025-06-10', diagnosis: 'Hypertension', prescription: 'Lisinopril 10mg daily', notes: 'Patient responding well to treatment' },
            { id: 'R002', patientId: 'P002', doctorId: 'D002', date: '2025-06-12', diagnosis: 'Myopia', prescription: 'Glasses recommended', notes: 'Vision improved' }
        ];
        localStorage.setItem('medicalRecords', JSON.stringify(records));
    }

    if (!localStorage.getItem('billing')) {
        const billing = [
            { id: 'B001', patientId: 'P001', amount: 150, date: '2025-06-10', description: 'Consultation', status: 'paid' },
            { id: 'B002', patientId: 'P002', amount: 300, date: '2025-06-12', description: 'Eye examination', status: 'pending' }
        ];
        localStorage.setItem('billing', JSON.stringify(billing));
    }

    if (!localStorage.getItem('inventory')) {
        const inventory = [
            { id: 'INV001', name: 'Aspirin', category: 'medicine', quantity: 500, unitPrice: 0.50 },
            { id: 'INV002', name: 'Blood Pressure Monitor', category: 'equipment', quantity: 20, unitPrice: 45.00 },
            { id: 'INV003', name: 'Surgical Gloves', category: 'supplies', quantity: 2000, unitPrice: 0.05 }
        ];
        localStorage.setItem('inventory', JSON.stringify(inventory));
    }
}

// Get all data helper functions
const getData = (key) => JSON.parse(localStorage.getItem(key) || '[]');
const setData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// ===== LOGIN & AUTHENTICATION =====
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('userRole').value;

    // Simple authentication
    const validCredentials = {
        patient: { username: 'john_doe', password: 'pass123' },
        receptionist: { username: 'jane_smith', password: 'pass123' },
        doctor: { username: 'dr_patel', password: 'pass123' },
        admin: { username: 'admin', password: 'admin123' }
    };

    if (!role) {
        alert('Please select a role');
        return;
    }

    const credentials = validCredentials[role];
    if (credentials && credentials.username === username && credentials.password === password) {
        currentUser = { username, role, id: role === 'patient' ? 'P001' : (role === 'doctor' ? 'D001' : username) };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showPage(role);
        loadDashboardData(role);
    } else {
        alert('Invalid credentials. Please try again.');
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showPage('login');
    document.getElementById('loginForm').reset();
}

// ===== PAGE NAVIGATION =====
function showPage(pageName) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    
    const pageMap = {
        patient: 'patientDashboard',
        receptionist: 'receptionistDashboard',
        doctor: 'doctorDashboard',
        admin: 'adminDashboard',
        login: 'loginPage'
    };

    const pageId = pageMap[pageName];
    if (pageId) {
        document.getElementById(pageId).classList.add('active');
    }
}

// ===== DASHBOARD DATA LOADING =====
function loadDashboardData(role) {
    initializeSampleData();
    
    switch(role) {
        case 'patient':
            loadPatientDashboard();
            break;
        case 'receptionist':
            loadReceptionistDashboard();
            break;
        case 'doctor':
            loadDoctorDashboard();
            break;
        case 'admin':
            loadAdminDashboard();
            break;
    }
}

// ===== PATIENT DASHBOARD =====
function loadPatientDashboard() {
    const patientName = document.getElementById('patientName');
    const patientId = document.getElementById('patientId');
    const patients = getData('patients');
    const patient = patients.find(p => p.id === currentUser.id);

    if (patient) {
        patientName.textContent = patient.name;
        patientId.textContent = `ID: ${patient.id}`;
    }

    displayPatientAppointments();
    displayPatientRecords();
    displayPatientBilling();
    populateDoctorSelect();
}

function switchPatientView(view) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    
    const sections = {
        appointments: 'appointmentsSection',
        records: 'recordsSection',
        billing: 'billingSection'
    };

    if (sections[view]) {
        document.getElementById(sections[view]).classList.add('active');
    }
}

function displayPatientAppointments() {
    const appointments = getData('appointments').filter(a => a.patientId === currentUser.id);
    const staff = getData('staff');
    const container = document.getElementById('patientAppointmentsList');
    
    if (appointments.length === 0) {
        container.innerHTML = '<p class="no-data">No appointments scheduled.</p>';
        return;
    }

    container.innerHTML = appointments.map(apt => {
        const doctor = staff.find(s => s.id === apt.doctorId);
        return `
            <div class="appointment-card">
                <h3>${doctor ? doctor.name : 'Unknown Doctor'}</h3>
                <p><strong>Date:</strong> ${formatDate(apt.date)} at ${apt.time}</p>
                <p><strong>Reason:</strong> ${apt.reason}</p>
                <p><strong>Status:</strong> <span class="appointment-status status-${apt.status}">${apt.status.toUpperCase()}</span></p>
                ${apt.status === 'confirmed' ? `<button class="btn btn-small btn-danger" onclick="cancelAppointment('${apt.id}')">Cancel</button>` : ''}
            </div>
        `;
    }).join('');
}

function displayPatientRecords() {
    const records = getData('medicalRecords').filter(r => r.patientId === currentUser.id);
    const staff = getData('staff');
    const container = document.getElementById('patientRecordsList');
    
    if (records.length === 0) {
        container.innerHTML = '<p class="no-data">No medical records available.</p>';
        return;
    }

    container.innerHTML = records.map(record => {
        const doctor = staff.find(s => s.id === record.doctorId);
        return `
            <div class="record-card">
                <h3>Medical Record - ${formatDate(record.date)}</h3>
                <p><strong>Doctor:</strong> ${doctor ? doctor.name : 'Unknown'}</p>
                <p><strong>Diagnosis:</strong> ${record.diagnosis}</p>
                <p><strong>Prescription:</strong> ${record.prescription}</p>
                <p><strong>Notes:</strong> ${record.notes}</p>
            </div>
        `;
    }).join('');
}

function displayPatientBilling() {
    const billing = getData('billing').filter(b => b.patientId === currentUser.id);
    const container = document.getElementById('patientBillingList');
    
    if (billing.length === 0) {
        container.innerHTML = '<p class="no-data">No billing records.</p>';
        return;
    }

    let totalAmount = 0;
    const html = billing.map(bill => {
        totalAmount += bill.amount;
        return `
            <div class="billing-card">
                <p><strong>Description:</strong> ${bill.description}</p>
                <p><strong>Date:</strong> ${formatDate(bill.date)}</p>
                <p><strong>Amount:</strong> $${bill.amount.toFixed(2)}</p>
                <p><strong>Status:</strong> <span class="appointment-status status-${bill.status}">${bill.status.toUpperCase()}</span></p>
            </div>
        `;
    }).join('');

    container.innerHTML = html + `
        <div class="billing-card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-left-color: white;">
            <h3 style="color: white;">Total Amount: $${totalAmount.toFixed(2)}</h3>
        </div>
    `;
}

function populateDoctorSelect() {
    const staff = getData('staff').filter(s => s.role === 'doctor');
    const selects = ['appointmentDoctor', 'createAppointmentDoctor'];
    
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            select.innerHTML = staff.map(doctor => 
                `<option value="${doctor.id}">${doctor.name}</option>`
            ).join('');
        }
    });
}

function bookAppointment(event) {
    event.preventDefault();
    const doctorId = document.getElementById('appointmentDoctor').value;
    const date = document.getElementById('appointmentDate').value;
    const time = document.getElementById('appointmentTime').value;
    const reason = document.getElementById('appointmentReason').value;

    const appointments = getData('appointments');
    const newAppointment = {
        id: 'A' + String(appointments.length + 1).padStart(3, '0'),
        patientId: currentUser.id,
        doctorId,
        date,
        time,
        status: 'pending',
        reason
    };

    appointments.push(newAppointment);
    setData('appointments', appointments);
    
    alert('Appointment booked successfully!');
    closeModal('bookAppointmentModal');
    displayPatientAppointments();
}

function cancelAppointment(appointmentId) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
        const appointments = getData('appointments');
        const index = appointments.findIndex(a => a.id === appointmentId);
        if (index > -1) {
            appointments[index].status = 'cancelled';
            setData('appointments', appointments);
            displayPatientAppointments();
            alert('Appointment cancelled.');
        }
    }
}

// ===== RECEPTIONIST DASHBOARD =====
function loadReceptionistDashboard() {
    displayAllAppointments();
    displayAllPatients();
    displayDoctorSchedule();
    populatePatientSelect();
    populateDoctorSelectForReceptionist();
}

function switchReceptionistView(view) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    
    const sections = {
        appointments: 'appointmentsManagementSection',
        patients: 'patientsManagementSection',
        schedule: 'scheduleSection'
    };

    if (sections[view]) {
        document.getElementById(sections[view]).classList.add('active');
    }
}

function displayAllAppointments() {
    const appointments = getData('appointments');
    const patients = getData('patients');
    const staff = getData('staff');
    const tbody = document.getElementById('appointmentsTable');
    
    tbody.innerHTML = appointments.map(apt => {
        const patient = patients.find(p => p.id === apt.patientId);
        const doctor = staff.find(s => s.id === apt.doctorId);
        return `
            <tr>
                <td>${apt.id}</td>
                <td>${patient ? patient.name : 'Unknown'}</td>
                <td>${doctor ? doctor.name : 'Unknown'}</td>
                <td>${formatDate(apt.date)} ${apt.time}</td>
                <td><span class="appointment-status status-${apt.status}">${apt.status}</span></td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-small btn-primary" onclick="confirmAppointmentReceptionist('${apt.id}')">Confirm</button>
                        <button class="btn btn-small btn-danger" onclick="deleteAppointmentReceptionist('${apt.id}')">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function displayAllPatients() {
    const patients = getData('patients');
    const tbody = document.getElementById('patientsTable');
    
    tbody.innerHTML = patients.map(patient => `
        <tr>
            <td>${patient.id}</td>
            <td>${patient.name}</td>
            <td>${patient.email}</td>
            <td>${patient.phone}</td>
            <td>${formatDate(patient.dob)}</td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-small btn-primary" onclick="editPatient('${patient.id}')">Edit</button>
                    <button class="btn btn-small btn-danger" onclick="deletePatient('${patient.id}')">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function displayDoctorSchedule() {
    const staff = getData('staff').filter(s => s.role === 'doctor');
    const container = document.getElementById('doctorSchedule');
    
    container.innerHTML = staff.map(doctor => `
        <div class="schedule-card">
            <h3>${doctor.name}</h3>
            <p><strong>Department:</strong> ${doctor.department}</p>
            <p><strong>Email:</strong> ${doctor.email}</p>
            <p><strong>Phone:</strong> ${doctor.phone}</p>
        </div>
    `).join('');
}

function populatePatientSelect() {
    const patients = getData('patients');
    const select = document.getElementById('createAppointmentPatient');
    select.innerHTML = patients.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
}

function populateDoctorSelectForReceptionist() {
    const staff = getData('staff').filter(s => s.role === 'doctor');
    const select = document.getElementById('createAppointmentDoctor');
    select.innerHTML = staff.map(doctor => `<option value="${doctor.id}">${doctor.name}</option>`).join('');
}

function createAppointment(event) {
    event.preventDefault();
    const patientId = document.getElementById('createAppointmentPatient').value;
    const doctorId = document.getElementById('createAppointmentDoctor').value;
    const date = document.getElementById('createAppointmentDate').value;
    const time = document.getElementById('createAppointmentTime').value;

    const appointments = getData('appointments');
    const newAppointment = {
        id: 'A' + String(appointments.length + 1).padStart(3, '0'),
        patientId,
        doctorId,
        date,
        time,
        status: 'confirmed',
        reason: 'Appointment'
    };

    appointments.push(newAppointment);
    setData('appointments', appointments);
    
    alert('Appointment created successfully!');
    closeModal('createAppointmentModal');
    displayAllAppointments();
}

function registerPatient(event) {
    event.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const phone = document.getElementById('regPhone').value;
    const dob = document.getElementById('regDOB').value;
    const bloodType = document.getElementById('regBloodType').value;

    const patients = getData('patients');
    const newPatient = {
        id: 'P' + String(patients.length + 1).padStart(3, '0'),
        name,
        email,
        phone,
        dob,
        bloodType,
        gender: 'Not specified'
    };

    patients.push(newPatient);
    setData('patients', patients);
    
    alert('Patient registered successfully!');
    closeModal('registerPatientModal');
    displayAllPatients();
    populatePatientSelect();
}

function confirmAppointmentReceptionist(appointmentId) {
    const appointments = getData('appointments');
    const index = appointments.findIndex(a => a.id === appointmentId);
    if (index > -1 && appointments[index].status !== 'confirmed') {
        appointments[index].status = 'confirmed';
        setData('appointments', appointments);
        displayAllAppointments();
        alert('Appointment confirmed!');
    }
}

function deleteAppointmentReceptionist(appointmentId) {
    if (confirm('Are you sure?')) {
        const appointments = getData('appointments');
        const index = appointments.findIndex(a => a.id === appointmentId);
        if (index > -1) {
            appointments.splice(index, 1);
            setData('appointments', appointments);
            displayAllAppointments();
            alert('Appointment deleted!');
        }
    }
}

function deletePatient(patientId) {
    if (confirm('Are you sure? This will delete all records for this patient.')) {
        const patients = getData('patients');
        const index = patients.findIndex(p => p.id === patientId);
        if (index > -1) {
            patients.splice(index, 1);
            setData('patients', patients);
            displayAllPatients();
            populatePatientSelect();
            alert('Patient deleted!');
        }
    }
}

function editPatient(patientId) {
    alert('Edit functionality can be extended with a modal form.');
}

// ===== DOCTOR DASHBOARD =====
function loadDoctorDashboard() {
    displayDoctorSchedule();
    displayDoctorPatients();
    displayMedicalRecords();
    populatePatientsForDoctor();
}

function switchDoctorView(view) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    
    const sections = {
        schedule: 'doctorScheduleSection',
        patients: 'doctorPatientsSection',
        records: 'doctorRecordsSection'
    };

    if (sections[view]) {
        document.getElementById(sections[view]).classList.add('active');
    }
}

function displayDoctorSchedule() {
    const appointments = getData('appointments').filter(a => a.doctorId === currentUser.id);
    const patients = getData('patients');
    const container = document.getElementById('mySchedule');
    
    if (appointments.length === 0) {
        container.innerHTML = '<p class="no-data">No scheduled appointments.</p>';
        return;
    }

    container.innerHTML = appointments.map(apt => {
        const patient = patients.find(p => p.id === apt.patientId);
        return `
            <div class="schedule-card">
                <h3>${patient ? patient.name : 'Unknown Patient'}</h3>
                <p><strong>Date & Time:</strong> ${formatDate(apt.date)} at ${apt.time}</p>
                <p><strong>Reason:</strong> ${apt.reason}</p>
                <p><strong>Status:</strong> <span class="appointment-status status-${apt.status}">${apt.status}</span></p>
            </div>
        `;
    }).join('');
}

function displayDoctorPatients() {
    const appointments = getData('appointments').filter(a => a.doctorId === currentUser.id);
    const patients = getData('patients');
    const tbody = document.getElementById('doctorPatientsTable');
    
    const uniquePatients = [...new Set(appointments.map(a => a.patientId))];
    
    tbody.innerHTML = uniquePatients.map(patientId => {
        const patient = patients.find(p => p.id === patientId);
        const lastApt = appointments.filter(a => a.patientId === patientId).pop();
        return `
            <tr>
                <td>${patientId}</td>
                <td>${patient ? patient.name : 'Unknown'}</td>
                <td>${lastApt ? formatDate(lastApt.date) : 'N/A'}</td>
                <td>
                    <button class="btn btn-small btn-primary" onclick="viewPatientDetails('${patientId}')">View</button>
                </td>
            </tr>
        `;
    }).join('');
}

function displayMedicalRecords() {
    const records = getData('medicalRecords').filter(r => r.doctorId === currentUser.id);
    const patients = getData('patients');
    const container = document.getElementById('doctorRecordsList');
    
    if (records.length === 0) {
        container.innerHTML = '<p class="no-data">No medical records created yet.</p>';
        return;
    }

    container.innerHTML = records.map(record => {
        const patient = patients.find(p => p.id === record.patientId);
        return `
            <div class="record-card">
                <h3>${patient ? patient.name : 'Unknown Patient'} - ${formatDate(record.date)}</h3>
                <p><strong>Diagnosis:</strong> ${record.diagnosis}</p>
                <p><strong>Prescription:</strong> ${record.prescription}</p>
                <p><strong>Notes:</strong> ${record.notes}</p>
            </div>
        `;
    }).join('');
}

function populatePatientsForDoctor() {
    const appointments = getData('appointments').filter(a => a.doctorId === currentUser.id);
    const patients = getData('patients');
    const select = document.getElementById('recordPatient');
    
    const uniquePatients = [...new Set(appointments.map(a => a.patientId))];
    select.innerHTML = uniquePatients.map(patientId => {
        const patient = patients.find(p => p.id === patientId);
        return `<option value="${patientId}">${patient ? patient.name : 'Unknown'}</option>`;
    }).join('');
}

function addMedicalRecord(event) {
    event.preventDefault();
    const patientId = document.getElementById('recordPatient').value;
    const diagnosis = document.getElementById('recordDiagnosis').value;
    const prescription = document.getElementById('recordPrescription').value;
    const notes = document.getElementById('recordNotes').value;

    const records = getData('medicalRecords');
    const newRecord = {
        id: 'R' + String(records.length + 1).padStart(3, '0'),
        patientId,
        doctorId: currentUser.id,
        date: new Date().toISOString().split('T')[0],
        diagnosis,
        prescription,
        notes
    };

    records.push(newRecord);
    setData('medicalRecords', records);
    
    alert('Medical record added successfully!');
    closeModal('addRecordModal');
    displayMedicalRecords();
}

function viewPatientDetails(patientId) {
    const patients = getData('patients');
    const patient = patients.find(p => p.id === patientId);
    
    if (patient) {
        alert(`Patient: ${patient.name}\nEmail: ${patient.email}\nPhone: ${patient.phone}\nDOB: ${patient.dob}\nBlood Type: ${patient.bloodType}`);
    }
}

// ===== ADMIN DASHBOARD =====
function loadAdminDashboard() {
    updateDashboardStats();
    displayStaffTable();
    displayDepartmentsTable();
    displayInventoryTable();
    updateReports();
    populateStaffForDepartment();
}

function switchAdminView(view) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    
    const sections = {
        overview: 'overviewSection',
        staff: 'staffSection',
        departments: 'departmentsSection',
        inventory: 'inventorySection',
        reports: 'reportsSection'
    };

    if (sections[view]) {
        document.getElementById(sections[view]).classList.add('active');
    }
}

function updateDashboardStats() {
    const patients = getData('patients');
    const staff = getData('staff');
    const appointments = getData('appointments');
    const billing = getData('billing');

    document.getElementById('totalPatients').textContent = patients.length;
    document.getElementById('totalDoctors').textContent = staff.filter(s => s.role === 'doctor').length;
    
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments.filter(a => a.date === today).length;
    document.getElementById('todayAppointments').textContent = todayAppointments;
    
    const pendingBills = billing.filter(b => b.status === 'pending').length;
    document.getElementById('pendingBills').textContent = pendingBills;
}

function displayStaffTable() {
    const staff = getData('staff');
    const tbody = document.getElementById('staffTable');
    
    tbody.innerHTML = staff.map(member => `
        <tr>
            <td>${member.id}</td>
            <td>${member.name}</td>
            <td>${member.role}</td>
            <td>${member.department}</td>
            <td>
                <button class="btn btn-small btn-danger" onclick="removeStaff('${member.id}')">Remove</button>
            </td>
        </tr>
    `).join('');
}

function displayDepartmentsTable() {
    const departments = getData('departments');
    const tbody = document.getElementById('departmentsTable');
    
    tbody.innerHTML = departments.map(dept => `
        <tr>
            <td>${dept.id}</td>
            <td>${dept.name}</td>
            <td>${dept.head}</td>
            <td>${dept.staffCount}</td>
            <td>
                <button class="btn btn-small btn-danger" onclick="removeDepartment('${dept.id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

function displayInventoryTable() {
    const inventory = getData('inventory');
    const tbody = document.getElementById('inventoryTable');
    
    tbody.innerHTML = inventory.map(item => `
        <tr>
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>${item.quantity}</td>
            <td>$${item.unitPrice.toFixed(2)}</td>
            <td>
                <button class="btn btn-small btn-primary" onclick="editInventoryItem('${item.id}')">Edit</button>
                <button class="btn btn-small btn-danger" onclick="removeInventoryItem('${item.id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

function updateReports() {
    const appointments = getData('appointments');
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const monthlyAdmissions = appointments.filter(a => new Date(a.date) >= monthStart).length;
    document.getElementById('monthlyAdmissions').textContent = monthlyAdmissions;
    document.getElementById('avgConsultation').textContent = '30';
    document.getElementById('satisfactionRate').textContent = '95';
}

function populateStaffForDepartment() {
    const staff = getData('staff').filter(s => s.role === 'doctor');
    const select = document.getElementById('deptHead');
    select.innerHTML = staff.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
}

function addStaff(event) {
    event.preventDefault();
    const name = document.getElementById('staffName').value;
    const role = document.getElementById('staffRole').value;
    const department = document.getElementById('staffDepartment').value;

    const staff = getData('staff');
    const newStaff = {
        id: (role === 'doctor' ? 'D' : 'S') + String(staff.length + 1).padStart(3, '0'),
        name,
        role,
        department,
        email: `${name.toLowerCase().replace(/\s/g, '.')}@hospital.com`,
        phone: '555' + String(Math.floor(Math.random() * 10000000)).padStart(7, '0')
    };

    staff.push(newStaff);
    setData('staff', staff);
    
    alert('Staff member added successfully!');
    closeModal('addStaffModal');
    displayStaffTable();
}

function addDepartment(event) {
    event.preventDefault();
    const name = document.getElementById('deptName').value;
    const head = document.getElementById('deptHead').value;

    const departments = getData('departments');
    const newDept = {
        id: 'D' + String(departments.length + 1).padStart(2, '0'),
        name,
        head,
        staffCount: 0
    };

    departments.push(newDept);
    setData('departments', departments);
    
    alert('Department added successfully!');
    closeModal('addDepartmentModal');
    displayDepartmentsTable();
}

function addInventoryItem(event) {
    event.preventDefault();
    const name = document.getElementById('itemName').value;
    const category = document.getElementById('itemCategory').value;
    const quantity = parseInt(document.getElementById('itemQuantity').value);
    const unitPrice = parseFloat(document.getElementById('itemUnitPrice').value);

    const inventory = getData('inventory');
    const newItem = {
        id: 'INV' + String(inventory.length + 1).padStart(3, '0'),
        name,
        category,
        quantity,
        unitPrice
    };

    inventory.push(newItem);
    setData('inventory', inventory);
    
    alert('Inventory item added successfully!');
    closeModal('addInventoryModal');
    displayInventoryTable();
}

function removeStaff(staffId) {
    if (confirm('Are you sure?')) {
        const staff = getData('staff');
        const index = staff.findIndex(s => s.id === staffId);
        if (index > -1) {
            staff.splice(index, 1);
            setData('staff', staff);
            displayStaffTable();
            alert('Staff member removed!');
        }
    }
}

function removeDepartment(deptId) {
    if (confirm('Are you sure?')) {
        const departments = getData('departments');
        const index = departments.findIndex(d => d.id === deptId);
        if (index > -1) {
            departments.splice(index, 1);
            setData('departments', departments);
            displayDepartmentsTable();
            alert('Department removed!');
        }
    }
}

function removeInventoryItem(itemId) {
    if (confirm('Are you sure?')) {
        const inventory = getData('inventory');
        const index = inventory.findIndex(i => i.id === itemId);
        if (index > -1) {
            inventory.splice(index, 1);
            setData('inventory', inventory);
            displayInventoryTable();
            alert('Item removed!');
        }
    }
}

function editInventoryItem(itemId) {
    alert('Edit functionality can be extended with a modal form.');
}

// ===== MODAL MANAGEMENT =====
function openBookAppointmentModal() {
    document.getElementById('bookAppointmentModal').classList.add('active');
}

function openCreateAppointmentModal() {
    document.getElementById('createAppointmentModal').classList.add('active');
}

function openRegisterPatientModal() {
    document.getElementById('registerPatientModal').classList.add('active');
}

function openAddRecordModal() {
    document.getElementById('addRecordModal').classList.add('active');
}

function openAddStaffModal() {
    document.getElementById('addStaffModal').classList.add('active');
}

function openAddDepartmentModal() {
    document.getElementById('addDepartmentModal').classList.add('active');
}

function openAddInventoryModal() {
    document.getElementById('addInventoryModal').classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
}

// ===== UTILITY FUNCTIONS =====
function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeSampleData();
    
    // Set minimum date for appointment booking
    const dateInput = document.getElementById('appointmentDate');
    const createDateInput = document.getElementById('createAppointmentDate');
    const today = new Date().toISOString().split('T')[0];
    
    if (dateInput) dateInput.min = today;
    if (createDateInput) createDateInput.min = today;
    
    // Set DOB max date to today
    const dobInput = document.getElementById('regDOB');
    if (dobInput) dobInput.max = today;
});
