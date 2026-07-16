// 15. Write a function that splits a string into an array of words based on spaces. (0.5 Grade)
// • Input: "The quick brown fox"
// • Output: ["The", "quick", "brown", "fox"]

function splitStr(str) {
	let arr = [];
	let word = "";
	for (let i = 0; i < str.length; i++) {
		if (str[i] === " ") {
			arr.push(word);
			word = "";
		} else {
			word += str[i];
		}
	}
	arr.push(word);
	return arr;
}
const str = "The quick brown fox";
let arr1 = str.split(" ");
let arr2 = splitStr(str);

console.log("arr1", arr1);
console.log("arr2", arr2);
