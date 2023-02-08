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
})

// Add event listener
sendEmailBtn.addEventListener("click", () => {
	sendEmail();
})

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

	// Send email to recipiant
	Email.send({
		SecureToken : "38409570-4dc0-4846-9923-ab69e941e08e",
		To : `${email}`,
		From : "dillonmccaffrey.ci@outlook.com",
		Subject : "Message from API",
		Body : `Thank you, ${name} for looking at Dillon's website, hope you enjoyed playing the game and quiz. Your message was ${message}`
	}).then(
	  message => alert(`Email sent to ${email}! Check your junk or spam inbox`)
	);

	// Send email to Dillon
	Email.send({
		SecureToken : "38409570-4dc0-4846-9923-ab69e941e08e",
		To : 'dmccaffrey01@gmail.com',
		From : "dillonmccaffrey.ci@outlook.com",
		Subject : "Message from API",
		Body : `${name} sent you a message. There message is: ${message}`
	}).then(
	  message => alert(`Message sent to Dillon, Thank you ${name}`)
	);
}