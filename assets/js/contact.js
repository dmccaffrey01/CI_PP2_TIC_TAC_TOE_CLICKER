// Get send email btn
const sendEmailBtn = document.querySelector(".send-email-btn");

// Add event listener
sendEmailBtn.addEventListener("click", () => {
    sendEmail();
})

function sendEmail() {
	Email.send({
		SecureToken : "C973D7AD-F097-4B95-91F4-40ABC5567812",
		To : 'them@website.com',
		From : "you@isp.com",
		Subject : "This is the subject",
		Body : "And this is the body"
	}).then(
	  message => alert(message)
	);
}