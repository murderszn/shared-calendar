Shared Planning Calendar Application
Overview
The Shared Planning Calendar is a web-based application designed to help divorced or separated parents collaboratively manage custody schedules. Users can toggle between two roles, "Dad" and "Mom," to input their preferences for requested or avoided days, generate a proposed custody schedule, and download the schedule in Excel or iCalendar formats.

Features
Interactive Calendar: Select days as Requested or Avoided for each parent.
Proposed Schedule Generation: Automatically generates a proposed custody calendar, balancing preferences.
Toggle Schedule Ownership: Easily switch custody ownership for any day in the proposed schedule.
Download Options: Export the schedule as:
Excel (.xlsx) for spreadsheets.
iCalendar (.ics) for calendar applications (Google Calendar, Outlook, etc.).
Mobile and Desktop Compatibility: Fully responsive for use on both desktops and smartphones.
Technologies Used
HTML/CSS: Structure and styling of the user interface.
JavaScript: Core functionality and interactivity.
XLSX.js: For generating Excel downloads.
Blob API: For creating and downloading iCalendar files.
Installation and Setup
Prerequisites
A modern web browser (Chrome, Firefox, Safari, or Edge).
An internet connection to load external libraries.
How to Use
Clone or download the repository:
bash
Copy code
git clone https://github.com/your-repo/shared-planning-calendar.git
Open the index.html file in your preferred browser.
Usage Guide
Calendar Interaction
Toggle Active User:

Click "Dad" or "Mom" to switch the active user.
The selected user’s preferences will be displayed and updated.
Add Preferences:

Click on a day to:
Mark it as Requested (green).
Mark it as Avoided (red).
Click again to remove any selection.
Generate Proposed Schedule:

Click "Generate Output" to create a proposed schedule.
The proposed schedule balances requested and avoided days between parents.
Edit Proposed Schedule:

In the "Proposed Schedule" section, click on any day to toggle custody ownership between "Dad" and "Mom."
Downloading the Schedule
Excel File:
Click "Download as Excel" to export the proposed schedule as a spreadsheet.
The Excel file includes a Date column and a Parent column indicating custody ownership.
iCalendar File:
Click "Download for Google/Outlook" to download an .ics file.
The file can be imported into calendar applications.
Folder Structure
bash
Copy code
/shared-planning-calendar
├── index.html      # Main HTML file
├── styles.css      # Styling for the application
├── script.js       # JavaScript functionality
└── README.md       # Documentation
Known Issues and Limitations
Mobile Toggling: On some mobile devices, touch events may require additional adjustments.
Conflicts in Preferences: When both parents request the same day, it is marked as "Conflict" in the proposed schedule.
Manual Updates: Users must manually toggle days in the proposed schedule to resolve conflicts.
Future Improvements
Add support for custom user roles beyond "Dad" and "Mom."
Enable synchronization with Google Calendar or Outlook via API.
Provide more advanced conflict resolution tools for overlapping preferences.
Support recurring events (e.g., "Every Monday").
License
This project is licensed under the MIT License.

Contributing
Contributions are welcome! To contribute:

Fork the repository.
Create a feature branch (git checkout -b feature-name).
Commit your changes and push to the branch.
Submit a pull request.
Support
For questions or issues, please create an issue in the repository or contact your-email@example.com.
