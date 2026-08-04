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

// 11 Write a function that creates a folder synchronously.(0.5 Grade).

// import fs from "node:fs";

// const create = () => {
// 	fs.writeFileSync("omar.txt", "Hello world");
// 	console.log("Success");
// };
// create();

// 12 Create an event emitter that listens for a "start" event and logs a welcome message.(0.5 Grade)

// import EventEmitter from "node:events";

// const startListener = new EventEmitter();

// startListener.on("start", () => {
// 	console.log("Welcome!");
// });

// startListener.emit("start");
//
// 13. Emit a custom "login" event with a username parameter.(0.5 Grade)
//
//
// import EventEmitter from "node:events";

// const newEvent = new EventEmitter();

// newEvent.on("login", (name) => {
// 	console.log(`User logged in : ${name}`);
// });

// newEvent.emit("login", "ahmed");
//
//
//14 Read a file synchronously and log its contents.(0.5 Grade)

// import path from "node:path";
// import fs from "node:fs";

// const file = path.resolve("omar.txt");

// fs.readFile(file, { encoding: "utf-8" }, (err, data) => {
// 	if (err) console.log(err);
// 	console.log(data);
// });

// 15 Write asynchronously to a file.(0.5 Grade)
//
// import path from "node:path";
// import fs from "node:fs/promises";

// const file = path.resolve("main.js");
// const write = async (file) => {
// 	try {
// 		await fs.writeFile(file, "asnc save");
// 	} catch (err) {
// 		console.log(err);
// 	}
// };

//16 Check if a directory exists. (0.5 Grade)
//
// import fs from "node:fs";

// const dir = "/home/apples";
// if (fs.existsSync(dir)) {
// 	console.log("exists");
// } else {
// 	console.log("doesn't exist");
// }
//
// 17 Write a function that returns the OS platform and CPU architecture. (0.5 Grade)
//
// import os from "node:os";

// const metaData = () => {
// 	return { arch: os.arch(), name: os.type() };
// };

// console.log(metaData());

// 18 Use a readable stream to read a file in chunks and log each chunk. (0.5 Grade)
//
// //
// import path from "node:path";
// import fs from "node:fs";

// const file = path.resolve("omar.txt");
// const read = fs.createReadStream(file, {
// 	encoding: "utf-8",
// 	highWaterMark: 10,
// });

// read.on("data", (chunk) => {
// 	console.log(`read chunk : ${chunk} successfully `);
// });
// read.on("end", () => {
// 	console.log(`finished reading ${file} successfully `);
// });

// read.on("error", (err) => {
// 	console.log(err);
// });

// 19. Use readable and writable streams to copy content from one file to another. (0.5 Grade)

// import path from "node:path";
// import fs from "node:fs";

// const file1 = path.resolve("omar.txt");
// const file2 = path.resolve("omarNew.txt");

// const read = fs.createReadStream(file1, {
// 	encoding: "utf-8",
// 	highWaterMark: 10,
// });
// const write = fs.createWriteStream(file2, {
// 	flags: "a",
// 	encoding: "utf-8",
// 	highWaterMark: 10,
// });

// read.pipe(write);
// read.on("error", (err) => {
// 	console.log(err);
// });
// write.on("error", (err) => {
// 	console.log(err);
// });
// write.on("finish", () => {
// 	console.log("streamed file successfully");
// });

// 20. Create a pipeline that reads a file, compresses it, and writes it to another file. (0.5 Grade)

// import path from "node:path";
// import fs from "node:fs";
// import zlib from "node:zlib";
// import { pipeline } from "node:stream/promises";

// const file1 = path.resolve("omar.txt");
// const file2 = path.resolve("omarNew.txt.gz");

// const compress = async (file1, file2) => {
// 	try {
// 		await pipeline(
// 			fs.createReadStream(file1),
// 			zlib.createGzip(),
// 			fs.createWriteStream(file2),
// 		);
// 		console.log("file compressed");
// 		console.log("Reading from:", file1);
// 		console.log("Writing to:", file2);
// 	} catch (err) {
// 		console.log(err);
// 	}
// };

// compress(file1, file2);
