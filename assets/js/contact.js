// Get send email btn
const sendEmailBtn = document.querySelector(".send-email-btn");

// Add event listener
sendEmailBtn.addEventListener("click", () => {
    sendEmail();
})

function sendEmail() {
	Email.send({
		SecureToken : "936da713-e86c-4992-b5e0-12090be9d7d8 ",
		To : 'dillonmccaffrey.ci@outlook.com',
		From : "dillonmccaffrey.ci@outlook.com",
		Subject : "This is the subject",
		Body : "And this is the body"
	}).then(
	  message => alert(message)
	);
}