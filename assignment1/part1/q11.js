// 11.Write a function that accepts multiple parameters (two or more) and returns their sum. (0.5 Grade)
// • Input Example: 1, 2, 3, 4, 5
// • Output Example: 15

function sum(...nums) {
	let sum = 0;
	for (let i = 0; i < nums.length; ++i) {
		sum += nums[i];
	}
	return sum;
}

console.log(sum(1, 2, 3, 4, 5));
