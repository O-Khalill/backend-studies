/*10.Write a function that destructures an object to extract values and returns a formatted string. (0.5 Grade)
• Input Example: const person = {name: 'John', age: 25}
• Output Example: 'John is 25 years old' */
const person = {
	name: "John",
	age: 25,
};

function introduce({ name, age }) {
	console.log(`${name} is ${age} years old`);
}

introduce(person);
