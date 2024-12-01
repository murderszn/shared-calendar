(function () {
  const datesElement = document.getElementById('dates');
  const monthYearElement = document.getElementById('monthYear');
  const prevMonthButton = document.getElementById('prevMonth');
  const nextMonthButton = document.getElementById('nextMonth');
  const generateOutputButton = document.getElementById('generateOutput');
  const dadRequestedDatesInlineElement = document.getElementById('dadRequestedDatesInline');
  const dadAvoidedDatesInlineElement = document.getElementById('dadAvoidedDatesInline');
  const momRequestedDatesInlineElement = document.getElementById('momRequestedDatesInline');
  const momAvoidedDatesInlineElement = document.getElementById('momAvoidedDatesInline');
  const proposedDatesElement = document.getElementById('proposedDates');
  const downloadExcelButton = document.getElementById('downloadExcel');
  const downloadCalendarButton = document.getElementById('downloadCalendar');
  const paywallModal = document.getElementById('paywallModal');
  const closeModalButton = document.getElementById('closeModal');
  const confirmPaymentButton = document.getElementById('confirmPayment');
  const btcQRImage = document.getElementById('btcQR');
  const dadDaysCountElement = document.getElementById('dadDaysCount');
  const momDaysCountElement = document.getElementById('momDaysCount');

  let currentDate = new Date();
  let activeUser = 'Dad';
  const selections = {
    Dad: { request: [], avoid: [] },
    Mom: { request: [], avoid: [] },
  };
  let proposedCalendar = [];
  let paymentConfirmed = false;

  // Set BTC QR code from local file
  function setLocalBTCQRCode() {
    if (btcQRImage) {
      btcQRImage.src = 'qrcode.svg';
      btcQRImage.alt = 'Bitcoin QR Code';
    }
  }

  // Switch active user
  function switchUser(user) {
    activeUser = user;
    renderCalendar();
    updatePreferencesDisplay();
    document.getElementById('user1Button').classList.toggle('active', user === 'Dad');
    document.getElementById('user2Button').classList.toggle('active', user === 'Mom');
  }

  // Render the calendar
  function renderCalendar() {
    datesElement.innerHTML = '';
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    monthYearElement.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;

    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('div');
      empty.classList.add('empty');
      datesElement.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayDiv = document.createElement('div');
      dayDiv.classList.add('date-container');
      dayDiv.textContent = day;

      const userSelection = selections[activeUser];

      if (userSelection.request.includes(day)) {
        dayDiv.classList.add('request');
      } else if (userSelection.avoid.includes(day)) {
        dayDiv.classList.add('avoid');
      }

      dayDiv.addEventListener('click', () => handleDayClick(day, dayDiv));
      datesElement.appendChild(dayDiv);
    }
  }

  // Handle day click to toggle selection
  function handleDayClick(day, element) {
    const userSelection = selections[activeUser];

    if (element.classList.contains('request')) {
      userSelection.request = userSelection.request.filter(d => d !== day);
      userSelection.avoid.push(day);
      element.classList.remove('request');
      element.classList.add('avoid');
    } else if (element.classList.contains('avoid')) {
      userSelection.avoid = userSelection.avoid.filter(d => d !== day);
      element.classList.remove('avoid');
    } else {
      userSelection.request.push(day);
      element.classList.add('request');
    }

    updatePreferencesDisplay();
  }

  // Update preferences display
  function updatePreferencesDisplay() {
    dadRequestedDatesInlineElement.textContent = selections.Dad.request.join(', ') || 'None';
    dadAvoidedDatesInlineElement.textContent = selections.Dad.avoid.join(', ') || 'None';
    momRequestedDatesInlineElement.textContent = selections.Mom.request.join(', ') || 'None';
    momAvoidedDatesInlineElement.textContent = selections.Mom.avoid.join(', ') || 'None';
  }

  // Generate optimized custody schedule
  function generateProposedCalendar() {
    proposedDatesElement.innerHTML = '';
    proposedCalendar = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthName = currentDate.toLocaleString('default', { month: 'long' });

    let lastAssignedParent = null;
    let consecutiveDays = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      let assignedParent = null;

      // Priority Assignment Logic
      if (selections.Dad.request.includes(day) && selections.Mom.request.includes(day)) {
        assignedParent = 'Conflict';
      } else if (selections.Dad.request.includes(day)) {
        assignedParent = 'Dad';
      } else if (selections.Mom.request.includes(day)) {
        assignedParent = 'Mom';
      } else if (selections.Dad.avoid.includes(day) && selections.Mom.avoid.includes(day)) {
        assignedParent = 'Conflict';
      } else if (selections.Dad.avoid.includes(day)) {
        assignedParent = 'Mom';
      } else if (selections.Mom.avoid.includes(day)) {
        assignedParent = 'Dad';
      } else {
        // Balance assignment based on previous parent and target consecutive days between 3 and 5
        if (lastAssignedParent === null) {
          assignedParent = 'Dad';
        } else if (consecutiveDays < 3) {
          assignedParent = lastAssignedParent;
        } else if (consecutiveDays >= 5) {
          assignedParent = lastAssignedParent === 'Dad' ? 'Mom' : 'Dad';
        } else {
          assignedParent = lastAssignedParent;
        }
      }

      // Update consecutive days count and last assigned parent
      if (assignedParent === lastAssignedParent) {
        consecutiveDays++;
      } else {
        lastAssignedParent = assignedParent;
        consecutiveDays = 1;
      }

      proposedCalendar.push({ day, month: monthName, parent: assignedParent });

      const div = document.createElement('div');
      div.classList.add('proposed-date', assignedParent.toLowerCase());
      div.textContent = `${monthName} ${day}: ${assignedParent}`;
      div.addEventListener('click', () => toggleDayAssignment(day, div));
      proposedDatesElement.appendChild(div);
    }

    updateDayCounts();
  }

  // Toggle individual day assignment in the proposed schedule
  function toggleDayAssignment(day, element) {
    const dayData = proposedCalendar.find(entry => entry.day === day);
    if (dayData && dayData.parent !== 'Conflict') {
      dayData.parent = dayData.parent === 'Dad' ? 'Mom' : 'Dad';
      element.className = `proposed-date ${dayData.parent.toLowerCase()}`;
      element.textContent = `${dayData.month} ${day}: ${dayData.parent}`;
      updateDayCounts();
    }
  }

  // Update the counters for days assigned to Dad and Mom
  function updateDayCounts() {
    const dadDaysCount = proposedCalendar.filter(entry => entry.parent === 'Dad').length;
    const momDaysCount = proposedCalendar.filter(entry => entry.parent === 'Mom').length;

    dadDaysCountElement.textContent = `Days with Dad: ${dadDaysCount}`;
    momDaysCountElement.textContent = `Days with Mom: ${momDaysCount}`;
  }

  // Export as Excel
  function downloadExcel() {
    const worksheetData = proposedCalendar.map(entry => ({
      Day: entry.day,
      Month: entry.month,
      AssignedTo: entry.parent,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Proposed Schedule');
    XLSX.writeFile(workbook, 'Proposed_Schedule.xlsx');
  }

  // Export as ICS for Google/Outlook
  function downloadICS() {
    let calendarData = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Shared Planning Calendar//EN\n";

    proposedCalendar.forEach(entry => {
      if (entry.parent !== 'Conflict') {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), entry.day);
        const formattedDate = formatDateForICS(date);
        const summary = `Custody Schedule - ${entry.parent}`;
        const description = `Scheduled time for ${entry.parent} on ${entry.month} ${entry.day}`;

        calendarData += `BEGIN:VEVENT\nSUMMARY:${summary}\nDTSTART;VALUE=DATE:${formattedDate}\nDTEND;VALUE=DATE:${formattedDate}\nDESCRIPTION:${description}\nEND:VEVENT\n`;
      }
    });

    calendarData += "END:VCALENDAR";

    const blob = new Blob([calendarData], { type: 'text/calendar' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = "custody_schedule.ics";
    link.click();
  }

  // Helper function to format date as required by ICS standard
  function formatDateForICS(date) {
    return date.toISOString().split('T')[0].replace(/-/g, '');
  }

  // Paywall functionality
  function showModal() {
    paywallModal.style.display = 'block';
  }

  function closeModal() {
    paywallModal.style.display = 'none';
  }

  // Event Listeners
  generateOutputButton.addEventListener('click', () => {
    if (!paymentConfirmed) {
      showModal();
    } else {
      generateProposedCalendar();
    }
  });

  closeModalButton.addEventListener('click', closeModal);
  confirmPaymentButton.addEventListener('click', () => {
    paymentConfirmed = true;
    closeModal();
    generateProposedCalendar();
  });

  prevMonthButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });

  nextMonthButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });

  downloadExcelButton.addEventListener('click', downloadExcel);
  downloadCalendarButton.addEventListener('click', downloadICS);

  document.getElementById('user1Button').addEventListener('click', () => switchUser('Dad'));
  document.getElementById('user2Button').addEventListener('click', () => switchUser('Mom'));

  // Initial Render
  setLocalBTCQRCode();
  renderCalendar();
  updatePreferencesDisplay();
})();
