// 13. Write a function to find the largest number in an array. (0.5 Grade)
// • Input Example: [1, 3, 7, 2, 4]
// • Output Example: 7

function findLargest(nums) {
	let max = -1e9;
	for (let i = 0; i < nums.length; ++i) {
		if (nums[i] > max) {
			max = nums[i];
		}
	}
	return max;
}

let input = [1, 3, 7, 2000, 30];
console.log(findLargest(input));
