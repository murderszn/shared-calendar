# Shared Planning Calendar Application

## Overview
The **Shared Planning Calendar** is a web-based application designed to help divorced or separated parents collaboratively manage custody schedules. Users can toggle between two roles, "Dad" and "Mom," to input their preferences for requested or avoided days, generate a proposed custody schedule, and download the schedule in Excel or iCalendar formats.

---

## Features
- **Interactive Calendar**: Select days as `Requested` or `Avoided` for each parent.
- **Proposed Schedule Generation**: Automatically generates a proposed custody calendar, balancing preferences.
- **Toggle Schedule Ownership**: Easily switch custody ownership for any day in the proposed schedule.
- **Download Options**: Export the schedule as:
  - **Excel** (`.xlsx`) for spreadsheets.
  - **iCalendar** (`.ics`) for calendar applications (Google Calendar, Outlook, etc.).
- **Mobile and Desktop Compatibility**: Fully responsive for use on both desktops and smartphones.

---

## Technologies Used
- **HTML/CSS**: Structure and styling of the user interface.
- **JavaScript**: Core functionality and interactivity.
- **[XLSX.js](https://github.com/SheetJS/sheetjs)**: For generating Excel downloads.
- **Blob API**: For creating and downloading iCalendar files.

---

## Installation and Setup

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, or Edge).
- An internet connection to load external libraries.

### How to Use
1. Clone or download the repository:
   ```bash
   git clone https://github.com/your-repo/shared-planning-calendar.git
