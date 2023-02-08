// Get send email btn
const sendEmailBtn = document.querySelector(".send-email-btn");

// Add event listener
sendEmailBtn.addEventListener("click", () => {
    sendEmail();
})

function sendEmail() {
	Email.send({
		SecureToken : "38409570-4dc0-4846-9923-ab69e941e08e",
		To : 'dmccaffrey01@gmail.com, dillonmccaffrey.ci@outlook.com',
		From : "dillonmccaffrey.ci@outlook.com",
		Subject : "Message from API",
		Body : "Thank you for looking at Dillon's website, hope you enjoyed playing the game"
	}).then(
	  message => alert("Email sent! Check your junk or spam inbox")
	);
}