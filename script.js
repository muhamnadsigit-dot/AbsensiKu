const employees = [
  { id: 1, name: "Andi Saputra", role: "Staff", progress: 80 },
  { id: 2, name: "Siti Rahma", role: "Supervisor", progress: 65 },
  { id: 3, name: "Budi Pratama", role: "Staff", progress: 92 },
  { id: 4, name: "Dewi Lestari", role: "Manager", progress: 75 }
];

let attendance = [
  { id: 1, employeeId: 1, time: "07:55", status: "Hadir" },
  { id: 2, employeeId: 2, time: "08:16", status: "Terlambat" },
  { id: 3, employeeId: 3, time: "07:48", status: "Hadir" },
  { id: 4, employeeId: 4, time: "08:02", status: "Hadir" }
];

const schedules = [
  ["Andi Saputra", "08:00 - 17:00"],
  ["Siti Rahma", "08:00 - 17:00"],
  ["Budi Pratama", "08:00 - 17:00"],
  ["Dewi Lestari", "08:30 - 17:30"]
];

const $ = (id) => document.getElementById(id);

function getEmployee(id) {
  return employees.find(e => e.id === id);
}

function statusClass(status) {
  return "badge-" + status.toLowerCase();
}

function render() {
  $("currentDate").textContent = new Intl.DateTimeFormat("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  }).format(new Date());

  $("totalEmployees").textContent = employees.length;
  $("presentToday").textContent = attendance.filter(a => a.status === "Hadir").length;
  $("lateToday").textContent = attendance.filter(a => a.status === "Terlambat").length;

  const avg = employees.length
    ? Math.round(employees.reduce((sum, e) => sum + e.progress, 0) / employees.length)
    : 0;
  $("avgProgress").textContent = avg + "%";

  $("attendanceTable").innerHTML = attendance.map(a => {
    const employee = getEmployee(a.employeeId);
    return `
      <tr>
        <td><strong>${employee?.name ?? "Tidak diketahui"}</strong></td>
        <td>${employee?.role ?? "-"}</td>
        <td>${a.time}</td>
        <td><span class="badge ${statusClass(a.status)}">${a.status}</span></td>
        <td><button class="action-btn" onclick="deleteAttendance(${a.id})">Hapus</button></td>
      </tr>
    `;
  }).join("");

  $("scheduleList").innerHTML = schedules.map(s => `
    <div class="schedule-item">
      <strong>${s[0]}</strong>
      <span>${s[1]}</span>
    </div>
  `).join("");

  $("employeeList").innerHTML = employees.map(e => `
    <div class="employee-item">
      <strong>${e.name}</strong>
      <small>${e.role} • Progres ${e.progress}%</small>
    </div>
  `).join("");

  $("progressList").innerHTML = employees.map(e => `
    <div class="progress-item">
      <div class="progress-title">
        <span>${e.name}</span>
        <strong>${e.progress}%</strong>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width:${e.progress}%"></div>
      </div>
    </div>
  `).join("");

  $("attendanceEmployee").innerHTML = employees.map(e =>
    `<option value="${e.id}">${e.name}</option>`
  ).join("");
}

function openModal(id) {
  $(id).classList.remove("hidden");
}

function closeModal(id) {
  $(id).classList.add("hidden");
}

$("addAttendanceBtn").addEventListener("click", () => {
  $("attendanceTime").value = new Date().toTimeString().slice(0, 5);
  openModal("attendanceModal");
});

$("addEmployeeBtn").addEventListener("click", () => {
  $("employeeName").value = "";
  $("employeeRole").value = "";
  $("employeeProgress").value = 0;
  openModal("employeeModal");
});

document.querySelectorAll("[data-close]").forEach(btn => {
  btn.addEventListener("click", () => closeModal(btn.dataset.close));
});

document.querySelectorAll(".modal").forEach(modal => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal(modal.id);
  });
});

$("saveAttendanceBtn").addEventListener("click", () => {
  const employeeId = Number($("attendanceEmployee").value);
  const time = $("attendanceTime").value;
  const status = $("attendanceStatus").value;

  if (!time) {
    alert("Silakan isi jam masuk.");
    return;
  }

  const existing = attendance.find(a => a.employeeId === employeeId);
  if (existing) {
    existing.time = time;
    existing.status = status;
  } else {
    attendance.push({
      id: Date.now(),
      employeeId,
      time,
      status
    });
  }

  closeModal("attendanceModal");
  render();
});

$("saveEmployeeBtn").addEventListener("click", () => {
  const name = $("employeeName").value.trim();
  const role = $("employeeRole").value.trim();
  const progress = Number($("employeeProgress").value);

  if (!name || !role) {
    alert("Nama dan jabatan wajib diisi.");
    return;
  }

  employees.push({
    id: Date.now(),
    name,
    role,
    progress: Math.max(0, Math.min(100, progress))
  });

  closeModal("employeeModal");
  render();
});

function deleteAttendance(id) {
  attendance = attendance.filter(a => a.id !== id);
  render();
}

render();
