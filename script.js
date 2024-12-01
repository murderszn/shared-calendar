(function () {
  const datesElement = document.getElementById('dates');
  const monthYearElement = document.getElementById('monthYear');
  const prevMonthButton = document.getElementById('prevMonth');
  const nextMonthButton = document.getElementById('nextMonth');
  const generateOutputButton = document.getElementById('generateOutput');
  const dadRequestedDatesElement = document.getElementById('dadRequestedDates');
  const dadAvoidedDatesElement = document.getElementById('dadAvoidedDates');
  const momRequestedDatesElement = document.getElementById('momRequestedDates');
  const momAvoidedDatesElement = document.getElementById('momAvoidedDates');
  const proposedDatesElement = document.getElementById('proposedDates');
  const downloadExcelButton = document.getElementById('downloadExcel');
  const downloadCalendarButton = document.getElementById('downloadCalendar');
  const paywallModal = document.getElementById('paywallModal');
  const closeModalButton = document.getElementById('closeModal');
  const confirmPaymentButton = document.getElementById('confirmPayment');
  const btcQRImage = document.getElementById('btcQR');

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
      btcQRImage.src = './qrcode.svg';
      btcQRImage.alt = 'Bitcoin QR Code';
    }
  }

  // Switch active user
  function switchUser(user) {
    activeUser = user;
    renderCalendar();
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
    dadRequestedDatesElement.innerHTML = selections.Dad.request.join(', ') || 'None';
    dadAvoidedDatesElement.innerHTML = selections.Dad.avoid.join(', ') || 'None';
    momRequestedDatesElement.innerHTML = selections.Mom.request.join(', ') || 'None';
    momAvoidedDatesElement.innerHTML = selections.Mom.avoid.join(', ') || 'None';
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

      if (selections.Dad.request.includes(day) && !selections.Mom.request.includes(day)) {
        assignedParent = 'Dad';
      } else if (selections.Mom.request.includes(day) && !selections.Dad.request.includes(day)) {
        assignedParent = 'Mom';
      } else if (selections.Dad.avoid.includes(day) && !selections.Mom.avoid.includes(day)) {
        assignedParent = 'Mom';
      } else if (selections.Mom.avoid.includes(day) && !selections.Dad.avoid.includes(day)) {
        assignedParent = 'Dad';
      } else {
        if (lastAssignedParent === null || consecutiveDays >= 3) {
          assignedParent = lastAssignedParent === 'Dad' ? 'Mom' : 'Dad';
        } else {
          assignedParent = lastAssignedParent;
        }
      }

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
  }

  // Toggle individual day assignment in the proposed schedule
  function toggleDayAssignment(day, element) {
    const dayData = proposedCalendar.find(entry => entry.day === day);
    if (dayData) {
      dayData.parent = dayData.parent === 'Dad' ? 'Mom' : 'Dad';
      element.className = `proposed-date ${dayData.parent.toLowerCase()}`;
      element.textContent = `${dayData.month} ${day}: ${dayData.parent}`;
    }
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

  document.getElementById('user1Button').addEventListener('click', () => switchUser('Dad'));
  document.getElementById('user2Button').addEventListener('click', () => switchUser('Mom'));

  // Initial Render
  setLocalBTCQRCode();
  renderCalendar();
  updatePreferencesDisplay();
})();
