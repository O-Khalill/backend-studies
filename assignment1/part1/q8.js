/*8. Write a function that checks if a number is divisible by 3 and 5. (0.5 Grade)
• Input Example: 15
• Output Example: “Divisible by both”*/
let number = 15;
function divCheck(num) {
	if (num % 3 == 0 && num % 5 == 0) {
		console.log(`${num} is disvisible by 3 and 5`);
	}
}

divCheck(15);
