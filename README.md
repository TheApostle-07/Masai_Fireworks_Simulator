
# Fireworks Display Project 🎆

An interactive, festive-themed project featuring a fireworks display, contact form, custom thank-you page, and error handling.
---
## Features

	•	Interactive Fireworks Display: Users can click on the canvas to trigger custom fireworks animations.
	•	Themed Pages: A festive theme with sparkling messages and background effects.
	•	Contact Form: A user-friendly form for sending messages, with submissions logged to a Google Sheet.
	•	Custom Thank-You Page: Acknowledges form submissions with a redirect countdown.

## Project Structure
```
.
├── index.html             # Home page with fireworks display
├── contact.html           # Contact form page
├── thankyou.html          # Thank you page after form submission
├── error.html             # Error page for submission failures
├── access-denied.html     # Access denied page for unauthorized access
├── assets                 # Assets folder containing CSS, JavaScript, images, and sounds
│   ├── css                # CSS folder for stylesheets
│   │   ├── style.css      # Shared styles across pages
│   │   ├── contact.css    # Styles specific to the contact page
│   │   └── home.css       # Styles specific to the home page
│   ├── js                 # JavaScript folder for scripts
│   │   ├── common.js      # Script to load shared header dynamically
│   │   └── fireworks.js   # Fireworks display logic
│   ├── images             # Images folder for visuals
│   │   └── rufus.png      # Profile image for the contact page
│   └── sounds             # Sounds folder for audio effects
│       ├── launch.mp3     # Firework launch sound
│       └── explosion.mp3  # Firework explosion sound
└── README.md              # Project documentation
```
## Setup Instructions

1. **Cloning and Setting Up**

Clone the repository:
```
git clone https://github.com/ThaApostle-07/Masai_Fireworks_Simulator.git
cd Masai_Fireworks_Simulator
```
2. **Customize Google Sheets Integration**

	•	Create a Google Sheet to store form submissions and set up Google Apps Script:
	1.	In your Google Sheet, go to Extensions > Apps Script and paste the provided script.
	2.	Deploy as a Web App and set access to Anyone with the link. Save the Web App URL.
	3.	Replace "YOUR_GOOGLE_APPS_SCRIPT_URL" in contact.html with the Web App URL.

3. **Local Development**

Open the index.html file in your preferred web browser to view the fireworks display.

## Scripts

**Fireworks Display Logic (fireworks.js)**

The fireworks.js script controls:

	•	Canvas Rendering: Dynamically resizes the canvas and displays fireworks on user clicks.
	•	Fireworks Effects: Different styles of fireworks, with randomized explosions and sparkling messages.
	•	Audio Effects: Plays launch and explosion sounds for added realism.

**Form Submission Handling (contact.html)**

	•	Data Submission to Google Sheets: Sends contact form data to Google Sheets via Google Apps Script.
	•	Session Storage Check: Ensures the thank-you page is accessible only after a valid form submission.
	•	Redirect with Countdown: Displays a countdown on the thank-you page and redirects to the homepage.

Smooth Redirection on Thank-You Page (thankyou.html)

**On the thank-you page:**

	•	Displays a success message with a countdown.
	•	Smoothly redirects back to the homepage.


**Home Page**

	•	Features interactive fireworks display with custom animations and audio effects.

**Contact Page**

	•	Themed background, contact information, and form submission to Google Sheets.

**Thank-You Page**

	•	Confirms successful submission with countdown and redirect to home page.

**Unauthorized Access Handling**

	•	Pages like thankyou.html and error.html verify session flags before allowing access.
	•	Unauthorized access attempts redirect users to access-denied.html.

**Future Enhancements**

	•	Adding more fireworks animation styles.
	•	Dynamic form validation and error handling.
	•	Expanding Google Sheets integration for additional data insights.

## License

This project is open-source.

Feel free to reach out if you have any questions or contributions! Enjoy the fireworks! 🎉

