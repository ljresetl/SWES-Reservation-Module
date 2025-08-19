1. General Settings

The document uses HTML5 DOCTYPE and language en.

Uses the Raleway font from Google Fonts.

Includes Bootstrap 5.3 for styling and layout.

The custom.js script is included at the bottom with defer (executes after DOM loads).

2. Header

Sticky header (sticky-top) with light background and bottom border.

Displays the title SWES Reservation Module.

Contains a navbar with tabs linking to page sections:

Create Reservation

Equipment & History

Calendar

Send Email

3. Main Content

Section 1: Create Reservation

Form for creating a reservation:

Employee ID (text, required)

Equipment selection (Boots, Vest, Helmet)

Reservation Date (date)

Reserve button

Section 2: Equipment & History

Filters:

Search by ID or equipment

Equipment type selection

Date range (from – to)

Status (Returned, Pending, Overdue)

Search button to apply filters

Table to display reservations:

Columns: ID, Equipment, Status, Reservation Date, Return Date

Dynamic message No data available if no data

Table wrapped in a block with max-height: 300px; overflow-y: auto for scrolling

Section 3: Calendar

Calendar with month navigation:

Previous/Next month buttons

Current month display

Table with weekdays (Sun–Sat) and tbody #calendarBody for dynamic filling

Section 4: Send Email

Form to send email:

Your Email

Subject

Message

Send button

Feedback block emailFeedback for success messages

4. Footer

Dark background, light text

Centered text with copyright: © 2025 Vitalii Baranov

5. Additional Elements

<div id="loader" class="loader"></div> – likely for loading indicator

custom.js handles:

Adding reservations to the table

Filtering equipment

Building the calendar

Sending email

Interacting with forms and buttons

Conclusion

This HTML page is an equipment reservation module:

Users can create reservations, view history, filter data, track the calendar, and send messages.

Uses Bootstrap for responsiveness and style.

Dynamic features (tables, calendar, email) are implemented via external JS (custom.js).

JS:
This code implements a fully functional booking management module:

Adding new bookings.

Storing data in localStorage.

Filtering and searching.

Display in a table with statuses and buttons.

Automatic tracking of overdue bookings.

Calendar with highlighted booking dates.

Email submission form.

Navigation tabs and loader.
