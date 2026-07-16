// 12. Write a function that returns a promise which resolves after 3 seconds with a 'Success' message. (0.5 Grade)
// • Output Example: “Success”

let delay = new Promise((resolve, reject) => {
	setTimeout(() => {
		resolve("Success");
	}, 3000);
});

delay.then((message) => console.log(message));
