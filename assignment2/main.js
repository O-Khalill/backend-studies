// 1.Write a function that logs the current file path and directory.(0.5 Grade)
// import path from "node:path";

// function getFileAndDir() {
// 	const fileName = import.meta.url;
// 	const dir = path.dirname(fileName);
// 	console.log({ fileName, dir });
// }

// getFileAndDir();

// 2. Write a function that takes a file path and returns its file name.(0.5 Grade)

// import path from "node:path";

// const _file = "/user/files/report.pdf";

// function getFile(file) {
// 	const fileName = path.basename(file);
// 	return fileName;
// }

// console.log(getFile(_file));

// 3. Write a function that builds a path from an object (0.5 Grade)
// import path from "node:path";

// const obj = { dir: "/folder", name: "app", ext: ".js" };

// function buildPath(obj) {
// 	console.log(path.format(obj));
// }

// buildPath(obj);

//4. Write a function that returns the file extension from a given file path.(0.5 Grade)
// import path from "node:path";
// const _file = path.resolve("/user/files/report.pdf");
// function getFileExt(file) {
// 	return path.extname(file);
// }
// console.log(getFileExt(_file));

// 5. Write a function that parses a given path and returns its name and ext.(0.5 Grade)
// import path from "node:path";

// const pth = "/home/app/main.js";

// function parsePath(pth) {
// 	const { name, ext } = path.parse(pth);
// 	return { name, ext };
// }

// console.log(parsePath(pth));

//
// 6. Write a function that checks whether a given path is absolute.(0.5 Grade)

// import path from "node:path";

// const pth = "/home/app/main.js";

// const isAbs = (pth) => path.isAbsolute(pth);

// console.log(isAbs(pth));

//7. Write a function that joins multiple segments (0.5 Grade)
// import path from "node:path";

// const paths = ["src", "components", "apps"];

// function buildPath(...paths) {
// 	return path.join(...paths);
// }

// console.log(buildPath(...paths));

//8. Write a function that resolves a relative path to an absolute one.(0.5 Grade)
// import path from "node:path";
// const pth = "./index.js";
// const resolve = (pth) => path.resolve(pth);

// console.log(resolve(pth));

//9. Write a function that joins two paths.(0.5 Grade)

// import path from "node:path";

// const pth1 = "/folder1";
// const pth2 = "folder2/file.txt";

// const join = (path1, path2) => path.join(path1, path2);

// console.log(join(pth1, pth2));

//10. Write a function that deletes a file asynchronously.(0.5 Grade)
// import path from "node:path";
// import fs from "node:fs/promises";
// const file = path.resolve("file.txt");

// const remove = async (file) => {
// 	try {
// 		await fs.rm(file);
// 		console.log(`removed ${file} successfully`);
// 	} catch (err) {
// 		console.log(err);
// 	}
// };
// remove(file);

//11 Write a function that creates a folder synchronously.(0.5 Grade).

// import fs from "node:fs";

// const create = () => {
// 	fs.writeFileSync("omar.txt", "Hello world");
// };
// create();

// 12
Create an event emitter that listens for a "start" event and logs a welcome message.(0.5 Grade)
