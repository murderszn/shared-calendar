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

let currentDate = new Date();
let activeUser = 'Dad'; // Default user
const selections = {
  Dad: { request: [], avoid: [] },
  Mom: { request: [], avoid: [] },
};
let proposedCalendar = [];

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

// Update preferences
function updatePreferencesDisplay() {
  dadRequestedDatesElement.innerHTML = selections.Dad.request.join(', ') || 'None';
  dadAvoidedDatesElement.innerHTML = selections.Dad.avoid.join(', ') || 'None';
  momRequestedDatesElement.innerHTML = selections.Mom.request.join(', ') || 'None';
  momAvoidedDatesElement.innerHTML = selections.Mom.avoid.join(', ') || 'None';
}

// Generate proposed custody calendar
function generateProposedCalendar() {
  proposedDatesElement.innerHTML = '';
  proposedCalendar = [];
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = currentDate.toLocaleString('default', { month: 'short' }); // Abbreviated month name

  let dadDays = 0;
  let momDays = 0;
  let currentParent = 'Dad';
  let currentBlock = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const div = document.createElement('div');
    div.classList.add('proposed-date', currentParent.toLowerCase());

    // Create label (parent name)
    const label = document.createElement('span');
    label.className = 'label';
    label.textContent = currentParent;

    // Create day number and month
    const number = document.createElement('strong');
    number.className = 'number';
    number.textContent = `${day}\n${monthLabel}`; // Combine day and month

    div.appendChild(label);
    div.appendChild(number);

    const dadRequested = selections.Dad.request.includes(day);
    const momRequested = selections.Mom.request.includes(day);
    const dadAvoided = selections.Dad.avoid.includes(day);
    const momAvoided = selections.Mom.avoid.includes(day);

    if (dadRequested && momRequested) {
      label.textContent = 'Conflict';
      div.className = 'proposed-date conflict';
    } else if (dadRequested) {
      assignDayToParent(div, 'Dad', day);
    } else if (momRequested) {
      assignDayToParent(div, 'Mom', day);
    } else if (dadAvoided) {
      assignDayToParent(div, 'Mom', day);
    } else if (momAvoided) {
      assignDayToParent(div, 'Dad', day);
    } else {
      if (currentBlock >= 3 || (currentParent === 'Dad' && dadDays > momDays)) {
        currentParent = currentParent === 'Dad' ? 'Mom' : 'Dad';
        currentBlock = 0;
      }

      assignDayToParent(div, currentParent, day);
    }

    currentBlock++;
    proposedDatesElement.appendChild(div);
  }

  function assignDayToParent(div, parent, day) {
    div.className = `proposed-date ${parent.toLowerCase()}`;
    proposedCalendar.push({ day, parent });
  }
}

// Download as Excel
function downloadExcel() {
  const workbook = XLSX.utils.book_new();
  const sheetData = [['Date', 'Parent']];
  proposedCalendar.forEach(entry => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), entry.day);
    sheetData.push([date.toLocaleDateString(), entry.parent]);
  });

  const sheet = XLSX.utils.aoa_to_sheet(sheetData);
  XLSX.utils.book_append_sheet(workbook, sheet, 'Custody Calendar');
  XLSX.writeFile(workbook, 'Custody_Calendar.xlsx');
}

// Download as iCalendar
function downloadCalendar() {
  let icalData = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Custody Calendar//EN\n';

  proposedCalendar.forEach(entry => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), entry.day);
    const formattedDate = date.toISOString().split('T')[0].replace(/-/g, '');
    icalData += `BEGIN:VEVENT\nSUMMARY:${entry.parent}'s Day\nDTSTART;VALUE=DATE:${formattedDate}\nDTEND;VALUE=DATE:${formattedDate}\nEND:VEVENT\n`;
  });

  icalData += 'END:VCALENDAR';

  const blob = new Blob([icalData], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Custody_Calendar.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Event listeners
prevMonthButton.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

nextMonthButton.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

generateOutputButton.addEventListener('click', () => {
  updatePreferencesDisplay();
  generateProposedCalendar();
});

downloadExcelButton.addEventListener('click', downloadExcel);
downloadCalendarButton.addEventListener('click', downloadCalendar);

user1Button.addEventListener('click', () => switchUser('Dad'));
user2Button.addEventListener('click', () => switchUser('Mom'));

// Initial render
renderCalendar();
updatePreferencesDisplay();
