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
  const user1Button = document.getElementById('user1Button');
  const user2Button = document.getElementById('user2Button');
  const proposedDatesElement = document.getElementById('proposedDates');
  const downloadExcelButton = document.getElementById('downloadExcel');
  const downloadCalendarButton = document.getElementById('downloadCalendar');

  // Paywall Modal Elements
  const paywallModal = document.getElementById('paywallModal');
  const closeModalButton = document.getElementById('closeModal');
  const confirmPaymentButton = document.getElementById('confirmPayment');
  const btcQRImage = document.getElementById('btcQR');
  const btcAddress = 'bc1qp7atyd9v5ddxqyl09wpzz6dp2wq78hny3tz6jj';

  let currentDate = new Date();
  let activeUser = 'Dad'; // Default user
  const selections = {
    Dad: { request: [], avoid: [] },
    Mom: { request: [], avoid: [] },
  };
  let proposedCalendar = [];
  let paymentConfirmed = false; // Tracks if payment has been confirmed

  // Set the QR Code from local file
  function setLocalBTCQRCode() {
    if (btcQRImage) {
      btcQRImage.src = './qrcode.svg';
      btcQRImage.alt = 'Bitcoin QR Code';
    }
  }

  // Switch active user
  function switchUser(user) {
    activeUser = user;
    user1Button.classList.toggle('active', user === 'Dad');
    user2Button.classList.toggle('active', user === 'Mom');
    renderCalendar();
  }

  // Render the calendar
  function renderCalendar() {
    datesElement.innerHTML = '';
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    monthYearElement.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;

    // Add empty days for alignment
    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('div');
      empty.classList.add('empty');
      datesElement.appendChild(empty);
    }

    // Add actual days
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

  // Paywall functionality
  function showModal() {
    paywallModal.style.display = 'block';
    paywallModal.setAttribute('aria-hidden', 'false');
    closeModalButton.focus();
  }

  function closeModal() {
    paywallModal.style.display = 'none';
    paywallModal.setAttribute('aria-hidden', 'true');
  }

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
    alert('Thank you for your support!');
    generateProposedCalendar();
  });

  // Event Listeners
  prevMonthButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });

  nextMonthButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });

  user1Button.addEventListener('click', () => switchUser('Dad'));
  user2Button.addEventListener('click', () => switchUser('Mom'));

  // Initial Render
  setLocalBTCQRCode();
  renderCalendar();
  updatePreferencesDisplay();
})();
