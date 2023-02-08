// Get send email btn
const sendEmailBtn = document.querySelector(".send-email-btn");

// Add event listener
sendEmailBtn.addEventListener("click", () => {
    sendEmail();
})

function sendEmail() {
	Email.send({
		SecureToken : "38409570-4dc0-4846-9923-ab69e941e08e",
		To : 'dillonmccaffrey.ci@outlook.com',
		From : "dillonmccaffrey.ci@outlook.com",
		Subject : "This is the subject",
		Body : "And this is the body"
	}).then(
	  message => alert(message)
	);
}