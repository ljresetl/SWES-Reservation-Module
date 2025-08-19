let bookings = [
  { employeeID: "222", gear: "Boots", status: "Pending", date: "2025-08-12", returnDate: "" },
  { employeeID: "222", gear: "Vest", status: "Pending", date: "2025-08-21", returnDate: "" },
  { employeeID: "222", gear: "Helmet", status: "Pending", date: "2025-08-29", returnDate: "" }
];

// --- Converts "dd.mm.yyyy" to "yyyy-mm-dd"; leaves ISO as-is ---
function normalizeDate(value) {
  if (!value) return "";
  const m = value.match(/^(\d{2})\.(\d{2})\.(\d{4})$/); // dd.mm.yyyy
  if (m) {
    const [, dd, mm, yyyy] = m;
    return `${yyyy}-${mm}-${dd}`;
  }
  return value; // assume already yyyy-mm-dd (from <input type="date">)
}

// --- After DOM is loaded ---
document.addEventListener("DOMContentLoaded", () => {

  /* ----------------- EMAIL FORM ----------------- */
  const emailForm = document.getElementById("emailForm");
  const feedback = document.getElementById("emailFeedback");

  if (emailForm) {
    emailForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const userEmail = document.getElementById("recipientEmail").value;
      const subject = document.getElementById("emailSubject").value;
      const message = document.getElementById("emailMessage").value;

      try {
        const response = await fetch("/api/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: "info@company.com",
            subject,
            message: `From: ${userEmail}\n\n${message}`,
          }),
        });

        if (response.ok) {
          feedback.innerHTML =
            '<div class="alert alert-success">✅ Your message has been sent successfully!</div>';
          emailForm.reset();
          setTimeout(() => (feedback.innerHTML = ""), 5000);
        } else {
          feedback.innerHTML =
            '<div class="alert alert-danger">❌ An error occurred while sending</div>';
        }
      } catch (err) {
        feedback.innerHTML =
          '<div class="alert alert-danger">⚠️ No connection to the server</div>';
      }
    });
  }

  /* ----------------- BOOKINGS + CALENDAR ----------------- */
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "block"; // show spinner

  setTimeout(() => {
    if (loader) loader.style.display = "none"; // hide spinner after loading

    const tbody = document.querySelector("#equipmentTable tbody");
    const noDataMessage = document.querySelector("#noDataMessage");
    const bookingDateInput = document.querySelector("#bookingDate");
    const today = new Date().toISOString().split("T")[0];
    if (bookingDateInput) bookingDateInput.setAttribute("min", today);

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    // --- Load from localStorage ---
    if (localStorage.getItem("bookings")) {
      bookings = JSON.parse(localStorage.getItem("bookings"));
    }

    function saveToStorage() {
      localStorage.setItem("bookings", JSON.stringify(bookings));
    }

    // --- Check for overdue ---
    function checkOverdue() {
      const now = new Date();
      let changed = false;
      bookings.forEach(b => {
        if (b.status === "Pending") {
          const bookingDate = new Date(b.date);
          const overdueDate = new Date(bookingDate);
          overdueDate.setDate(overdueDate.getDate() + 3);
          if (now > overdueDate) {
            b.status = "Overdue";
            changed = true;
          }
        }
      });
      if (changed) saveToStorage();
    }

    // --- Update table ---
    function updateTable(data) {
      if (!tbody) return;
      tbody.innerHTML = "";
      checkOverdue();

      if (data.length === 0) {
        if (noDataMessage) noDataMessage.style.display = "block";
        return;
      } else {
        if (noDataMessage) noDataMessage.style.display = "none";
      }

      data.forEach((b) => {
        const tr = document.createElement("tr");
        const statusBtn = document.createElement("button");

        if (b.status === "Pending") {
          statusBtn.textContent = "With employee";
          statusBtn.className = "btn btn-sm btn-danger";
          statusBtn.addEventListener("click", () => {
            const confirmReturn = confirm(`Do you want to mark the item "${b.gear}" as returned?`);
            if (confirmReturn) {
              b.status = "Returned";
              b.returnDate = new Date().toISOString().split("T")[0];
              saveToStorage();
              updateTable(bookings);
            }
          });
        } else if (b.status === "Returned") {
          statusBtn.textContent = "Returned";
          statusBtn.className = "btn btn-sm btn-success";
          statusBtn.disabled = true;
        } else if (b.status === "Overdue") {
          statusBtn.textContent = "Overdue";
          statusBtn.className = "btn btn-sm btn-secondary";
          statusBtn.disabled = true;
        } else {
          statusBtn.textContent = b.status;
          statusBtn.className = "btn btn-sm btn-secondary";
        }

        tr.innerHTML = `
          <td>${b.employeeID}</td>
          <td>${b.gear}</td>
          <td></td>
          <td>${b.date}</td>
          <td>${b.returnDate || "-"}</td>
        `;
        tr.children[2].appendChild(statusBtn);
        tbody.appendChild(tr);
      });

      renderCalendar(currentMonth, currentYear);
    }

    // --- Add booking ---
    const reservationForm = document.querySelector("#reservation form");
    if (reservationForm) {
      reservationForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const employeeID = document.querySelector("#employeeID").value.trim();
        const gear = document.querySelector("#gearSelect").value;
        const date = bookingDateInput.value;
        const status = "Pending";

        if (!employeeID || !gear || !date) return;
        if (date < today) {
          alert("It is not possible to book a past date!");
          return;
        }

        bookings.push({ employeeID, gear, date, status, returnDate: "" });
        saveToStorage();
        updateTable(bookings);
        this.reset();
      });
    }

    // --- Filtering with date normalization ---
    function applyFilters() {
      const searchText = document.querySelector("#searchInput")?.value.trim().toLowerCase();
      const gearSelect = document.querySelector("#gearSelect")?.value;
      const statusSelect = document.querySelector("#statusSelect")?.value;

      // read raw values and normalize to ISO yyyy-mm-dd
      const rawFrom = document.querySelector("#dateFrom")?.value.trim();
      const rawTo   = document.querySelector("#dateTo")?.value.trim();
      const dateFrom = normalizeDate(rawFrom);
      const dateTo   = normalizeDate(rawTo);

      const filtered = bookings.filter(b => {
        let matchText = !searchText || b.employeeID.toLowerCase().includes(searchText) || b.gear.toLowerCase().includes(searchText);
        let matchGear = !gearSelect || b.gear === gearSelect;
        let matchStatus = !statusSelect || b.status === statusSelect;

        let matchDate = true;
        if (dateFrom && dateTo) matchDate = b.date >= dateFrom && b.date <= dateTo;
        else if (dateFrom)      matchDate = b.date >= dateFrom;
        else if (dateTo)        matchDate = b.date <= dateTo;

        return matchText && matchGear && matchStatus && matchDate;
      });

      updateTable(filtered);
    }

    const searchButton = document.querySelector("#searchButton");
    if (searchButton) {
      searchButton.addEventListener("click", e => {
        e.preventDefault();
        applyFilters();
      });
    }

    // --- Calendar ---
    function renderCalendar(month, year) {
      const calendarBody = document.getElementById("calendarBody");
      const currentMonthLabel = document.getElementById("currentMonth");
      if (!calendarBody || !currentMonthLabel) return;

      calendarBody.innerHTML = "";

      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      currentMonthLabel.textContent = `${year} - ${month + 1}`;

      let date = 1;
      for (let i = 0; i < 6; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < 7; j++) {
          const cell = document.createElement("td");
          if (i === 0 && j < firstDay) cell.textContent = "";
          else if (date > daysInMonth) cell.textContent = "";
          else {
            cell.textContent = date;
            const cellDateStr = `${year}-${String(month + 1).padStart(2,"0")}-${String(date).padStart(2,"0")}`;
            if (bookings.some(b => b.date === cellDateStr)) {
              cell.style.backgroundColor = "#ffcccc";
              cell.style.fontWeight = "bold";
            }
            if (cellDateStr < today) cell.style.color = "#aaa";
            date++;
          }
          row.appendChild(cell);
        }
        calendarBody.appendChild(row);
      }
    }

    document.getElementById("prevMonth")?.addEventListener("click", () => {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      renderCalendar(currentMonth, currentYear);
    });

    document.getElementById("nextMonth")?.addEventListener("click", () => {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      renderCalendar(currentMonth, currentYear);
    });

    // --- Initial render ---
    updateTable(bookings);

  }, 1000); // delay for spinner
});

// --- Nav tabs ---
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-tabs .nav-link");

  navLinks.forEach(link => {
    link.addEventListener("click", function () {
      navLinks.forEach(l => l.classList.remove("active"));
      this.classList.add("active");
    });
  });
});
