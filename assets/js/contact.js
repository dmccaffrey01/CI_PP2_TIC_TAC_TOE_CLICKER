/*jshint esversion: 6 */

// Get send email btn
const sendEmailBtn = document.querySelector(".send-email-btn");

// Get name input
const nameInput = document.querySelector(".contact-name-input");

// Get email input
const emailInput = document.querySelector(".contact-email-input");

// Get message input
const messageInput = document.querySelector(".contact-message-input");

// Add event listener
messageInput.addEventListener("focus", () => {
	// Check for placeholder text
	if (messageInput.value == "Leave a message for Dillon...") {
		messageInput.value = "";
	}
});

// Add event listener
sendEmailBtn.addEventListener("click", () => {
	sendEmail();
});

/**
 * Send email
 */
function sendEmail() {
	// Get name
	let name = nameInput.value;

	// Get email
	let email = emailInput.value;

	// Get message
	let message = messageInput.value;

	// Check if empty
	if (name == "" || email == "") {
		dispalyAlert("Please fill in your name and email", "OK", () => {return;});
		return false;
	}
	
	// Send email to recipiant
	Email.send({
		SecureToken : "38409570-4dc0-4846-9923-ab69e941e08e",
		To : `${email}`,
		From : "dillonmccaffrey.ci@outlook.com",
		Subject : "Message from API",
		Body : `Thank you, ${name} for looking at Dillon's website, hope you enjoyed playing the game and quiz. Your message was ${message}`
	}).then(
	  
	);

	// Send email to Dillon
	Email.send({
		SecureToken : "38409570-4dc0-4846-9923-ab69e941e08e",
		To : 'dmccaffrey01@gmail.com',
		From : "dillonmccaffrey.ci@outlook.com",
		Subject : "Message from API",
		Body : `${name} sent you a message. There message is: ${message}`
	}).then(
	  message => dispalyAlert(`Email sent to ${email}! Check your junk or spam inbox. And your message was sent to Dillon, Thank you ${name}`, "OK", () => {return;})
	);
	
	resetForm();
}

/**
 * Reset the form values
 */
function resetForm() {
	nameInput.value = "";
	emailInput.value = "";
	messageInput.value = "Leave a message for Dillon...";
}

/**
 * Display alert message
 */
function dispalyAlert(message, btn1, btn1Function, btn2, btn2Function) {
	// Define vars
	let alertSection = document.querySelector(".alert-section");
	let alertText = document.querySelector(".alert-text");
	let alertBtn1 = document.querySelector(".alert-btn1");
	let alertBtn2 = document.querySelector(".alert-btn2");
	
	// Check if 2 buttons
	if (arguments.length <= 4) {
		alertBtn2.classList.add("remove");
	} else {
		// Set btn 2
		alertBtn2.innerText = btn2;

		// Call function when clicked
		alertBtn2.addEventListener("click", () => {
			btn2Function();
			
			// Close alert
			alertSection.classList.remove("active");
		});
	}

	// Set text
	alertText.innerText = message;

	// Set btn 1
	alertBtn1.innerText = btn1;

	// Display section
	alertSection.classList.add("active");

	// Call function when clicked
	alertBtn1.addEventListener("click", () => {
		btn1Function();

		// Close alert
		alertSection.classList.remove("active");
	});
}