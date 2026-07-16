// 14. Write a function that takes an object and returns an array containing only its keys. (0.5 Grade)
// • Input Example: name: "John", age: 30}
// • Output Example: ["name", "age"]

let getKeys = (obj) => Object.keys(obj);

const user = {
	name: "John",
	age: 19,
};

console.log(getKeys(user));
