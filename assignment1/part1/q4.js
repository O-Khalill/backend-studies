/*4. Create an array of numbers and return only the even numbers using filter method. (0.5 Grade)
• Input Example: [1, 2, 3, 4, 5]
• Output Example: [2,4]*/
let numbers = [1, 2, 3, 4, 5];
let even = numbers.filter((num) => num % 2 == 0);
console.log(even);
