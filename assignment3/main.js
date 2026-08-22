// Part1: Node Internals (3 Grades):
// 1. What is the Node.js Event Loop? (0.5 Grade)

//The Event Loop is what allows node to perform non blocking i/o operations, through concurrency
//

//
// 2. What is Libuv and What Role Does It Play in Node.js? (0.5 Grade)
// Libuv is a C library that nodeJS uses to implement async operations and event driven programming and gives it a thread Pool
//
// 3. How Does Node.js Handle Asynchronous Operations Under the Hood? (0.5 Grade)
// NodeJS handles Asynchronous operations by delegating the tasks to Libuv then sends them back to the main thread when done.
//
// 4. What is the Difference Between the Call Stack, Event Queue, and Event Loop in Node.js? (0.5 Grade)
// Call stack is where javascript code executes one thing at a time, using Last in First out order
// Event queue is where the callbacks wait when their async operation is completed and the call stack is free to run them
// Event loop  is what checks if the call stack is empty and then checks the queues and decides which queue the tasks go
//
// 5. What is the Node.js Thread Pool and How to Set the Thread Pool Size? (0.5 Grade)
// NodeJS's thread pool are the threads managed by libuv which is used to run async operations.
// The thread pool is set by using the environment variable UV_THREADPOOL_SIZE
//
// 6. How Does Node.js Handle Blocking and Non-Blocking Code Execution? (0.5 Grade)
// Blocking code is run synchronously which completely blocks the thread until done,
//  non blocking code allows other code to be executed while it is being prcocessed by libuv or the operating system kernel

import mysql from "mysql2/promise";
import express from "express";
const server = express();
const port = 3001;
server.use(express.json());

const pool = mysql.createPool({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "omar1234",
	database: "store",
	waitForConnections: true,
});

const bootStrap = async () => {
	try {
		await pool.query("select 1 + 1 as result");
		console.log("DB CONNECTED");
		server.listen(port, () => {
			console.log("Server running properly");
		});
	} catch (e) {
		console.log(e);
		console.log("DB connection went wrong");
	}
};

bootStrap();

// 2. Create REST API endpoints to perform CRUD operations for the Products table: (2.5 Grade)
// ● Create a product.
// ● Retrieve all products.
// ● Retrieve a product by ID.
// ● Update a product.
// ● Delete a product.

// products
//
//get all
server.get("/products", async (req, res) => {
	try {
		const [products] = await pool.query("SELECT * FROM products");
		if (products.length == 0) {
			return res.status(404).json({ message: "No products" });
		}
		res.json(products);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "Something went wrong" });
	}
});
//get by id
server.get("/products/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const [product] = await pool.query("SELECT * FROM products WHERE id = ?", [
			id,
		]);

		if (product.length == 0) {
			return res.status(404).json({ message: "Product not found" });
		}
		res.json(product[0]);
	} catch (err) {
		console.log("Something went wrong");
		res.status(500).json({ message: "something went wrong" });
	}
});
//post product
server.post("/products", async (req, res) => {
	try {
		const { name, price, quantity } = req.body;

		if (!name || !price || !quantity) {
			return res.status(400).json({ message: "can't insert empty product" });
		}
		const [result] = await pool.query(
			"INSERT INTO products(name,price,quantity) VALUES(?,?,?)",
			[name, price, quantity],
		);
		res.status(200).json({
			id: result.insertId,
			name,
			price,
			quantity,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "Something went wrong" });
	}
});
//update product

server.patch("/products/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const [products] = await pool.query(
			"SELECT * FROM products WHERE id = ? ",
			[id],
		);

		if (products.length == 0) {
			return res.status(404).json({ message: "Product does not exist" });
		}
		const name = req.body.name ?? products[0].name;
		const quantity = req.body.quantity ?? products[0].quantity;
		const price = req.body.price ?? products[0].quantity;

		await pool.query("UPDATE products SET name = ?, quantity = ?, price = ? ", [
			name,
			quantity,
			price,
		]);
	} catch (err) {
		console.log("err");
		res.status(404).json({ Message: "Product not found" });
	}
});

//delete product
server.delete("/products/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const [products] = await pool.query(
			"SELECT * FROM products WHERE id = ? ",
			[id],
		);

		if (products.length == 0) {
			return res.status(404).json({ message: "Product does not exist" });
		}
		await pool.query("DELETE FROM products WHERE id = ? ", [id]);

		res.status(200).json({ message: "item deleted successfully" });
	} catch (err) {
		console.log(err);
		res.status(404).json({ Message: "Product not found" });
	}
});
//==================================================================================================//
// 3. Create REST API endpoints to perform CRUD operations for the Suppliers table: (2 Grade)
// ● Create a supplier.
// ● Retrieve all suppliers.
// ● Update supplier information.
// ● Delete a supplier.
//
//
//
server.get("/suppliers/", async (req, res) => {
	try {
		const [suppliers] = await pool.query("SELECT * FROM suppliers");
		if (suppliers.length == 0) {
			return res.status(404).json({ message: "No suppliers" });
		}
		res.json(suppliers);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "Something went wrong" });
	}
});

//post supplier
server.post("/suppliers", async (req, res) => {
	try {
		const { name, contact_number } = req.body;

		if (!name || !contact_number) {
			return res.status(400).json({ message: "can't insert empty product" });
		}
		const [result] = await pool.query(
			"INSERT INTO suppliers(name,contact_number) VALUES(?,?)",
			[name, contact_number],
		);
		res.status(200).json({
			id: result.insertId,
			name,
			contact_number,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "Something went wrong" });
	}
});
//update supplier

server.patch("/suppliers/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const [products] = await pool.query(
			"SELECT * FROM suppliers WHERE id = ? ",
			[id],
		);

		if (supplier.length == 0) {
			return res.status(404).json({ message: "supplier does not exist" });
		}
		const name = req.body.name ?? products[0].name;
		const quantity = req.body.contact_number ?? products[0].quantity;

		await pool.query("UPDATE suppliers SET name = ?, contact_number = ?", [
			name,
			contact_number,
		]);
	} catch (err) {
		console.log("err");
		res.status(404).json({ Message: "supplier not found" });
	}
});

//delete product
server.delete("/suppliers/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const [suppliers] = await pool.query(
			"SELECT * FROM suppliers WHERE id = ? ",
			[id],
		);

		if (suppliers.length == 0) {
			return res.status(404).json({ message: "supplier does not exist" });
		}
		await pool.query("DELETE FROM suppliers WHERE id = ? ", [id]);
		res.status(200).json({ message: "Deleted supplier successfully" });
	} catch (err) {
		console.log("err");
		res.status(404).json({ Message: "supplier not found" });
	}
});
// //4. Create REST API endpoints to manage Sales : (1.5 Grade)
// ● Record a sale.
// ● Retrieve all sales.
// ● Retrieve sales for a specific product.
//
//
// Retrieve all sales.
server.get("/sales/", async (req, res) => {
	try {
		const [sales] = await pool.query("SELECT * FROM sales");
		if (sales.length == 0) {
			res.status(404).json({ message: "No sales" });
		}
		res.json(sales);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "Something went wrong" });
	}
});

// ● Retrieve sales for a specific product.
server.get("/sales/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const [sales] = await pool.query("SELECT * FROM sales WHERE id = ?", [id]);
		if (sales.length == 0) {
			return res.status(404).json({ message: "No sales" });
		}
		res.json(sales[0]);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "Something went wrong" });
	}
});

server.post("/sales", async (req, res) => {
	try {
		const { quantity, product_id } = req.body || {};

		if (!product_id || !quantity) {
			return res.status(400).json({ message: "Missing required fields" });
		}

		const [result] = await pool.query(
			"INSERT INTO sales (product_id, quantity) VALUES (?, ?)",
			[product_id, quantity],
		);

		res.status(200).json({
			id: result.insertId,
			product_id,
			quantity,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "Something went wrong" });
	}
});

//==================================================================================================//
// 5. Database modification endpoints (2 Grade)

// Add a Category
server.post("/products/add-category-column", async (req, res) => {
	try {
		await pool.query("ALTER TABLE products ADD COLUMN category VARCHAR(50)");
		res.status(200).json({ message: "Category column added successfully" });
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "Something went wrong" });
	}
});

// Remove Category
server.delete("/products/remove-category-column", async (req, res) => {
	try {
		await pool.query("ALTER TABLE products DROP COLUMN category");
		res.status(200).json({ message: "Category column removed successfully" });
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "Something went wrong" });
	}
});

// Change ContactNumber
server.patch("/suppliers/modify-contact-number-column", async (req, res) => {
	try {
		await pool.query(
			"ALTER TABLE suppliers MODIFY COLUMN contact_number VARCHAR(15)",
		);
		res
			.status(200)
			.json({ message: "contact_number column changed to VARCHAR(15)" });
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "Something went wrong" });
	}
});

// Add  NOT NULL
server.patch("/products/modify-name-not-null", async (req, res) => {
	try {
		await pool.query(
			"ALTER TABLE products MODIFY COLUMN name VARCHAR(50) NOT NULL",
		);
		res
			.status(200)
			.json({ message: "NOT NULL constraint added to name column" });
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "Something went wrong" });
	}
});

//==================================================================================================//
// 6. Seed initial data (1.5 Grade)

server.post("/p6", async (req, res) => {
	try {
		// a. Add supplier 'FreshFoods'
		const [supplierResult] = await pool.query(
			"INSERT INTO suppliers(name, contact_number) VALUES(?, ?)",
			["FreshFoods", "01001234567"],
		);
		const supplierId = supplierResult.insertId;

		// b. Insert products, all linked to FreshFoods via supplier_id
		const products = [
			{ name: "Milk", price: 15.0, quantity: 50 },
			{ name: "Bread", price: 10.0, quantity: 30 },
			{ name: "Eggs", price: 20.0, quantity: 40 },
		];

		const productIds = {};
		for (const product of products) {
			const [result] = await pool.query(
				"INSERT INTO products(name, price, quantity, supplier_id) VALUES(?, ?, ?, ?)",
				[product.name, product.price, product.quantity, supplierId],
			);
			productIds[product.name] = result.insertId;
		}

		// c. Record sale: 2 units of Milk on 2025-05-20
		const [saleResult] = await pool.query(
			"INSERT INTO sales(product_id, quantity, date) VALUES(?, ?, ?)",
			[productIds["Milk"], 2, "2025-05-20"],
		);

		res.status(200).json({
			message: "Seed data inserted successfully",
			supplier: { id: supplierId, name: "FreshFoods" },
			products: productIds,
			sale: {
				id: saleResult.insertId,
				product: "Milk",
				quantity: 2,
				date: "2025-05-20",
			},
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "Something went wrong" });
	}
});

//==================================================================================================//
// 7. Update the price of 'Bread' to 25.00 (0.5 Grade)
server.patch("/products/bread/price", async (req, res) => {
	try {
		const [result] = await pool.query(
			"UPDATE products SET price = ? WHERE name = ?",
			[25.0, "Bread"],
		);
		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "Bread not found" });
		}
		res.status(200).json({ message: "Bread price updated to 25.00" });
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "Something went wrong" });
	}
});

// 8. Delete the product 'Eggs' (0.5 Grade)
server.delete("/products/eggs", async (req, res) => {
	try {
		const [result] = await pool.query("DELETE FROM products WHERE name = ?", [
			"Eggs",
		]);
		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "Eggs not found" });
		}
		res.status(200).json({ message: "Eggs deleted successfully" });
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "Something went wrong" });
	}
});

// 9. Total quantity sold for each product (0.5 Grade)
server.get("/reports/quantity-sold-per-product", async (req, res) => {
	try {
		const [rows] = await pool.query(
			`SELECT p.id, p.name, COALESCE(SUM(s.quantity), 0) AS total_quantity_sold
			 FROM products p
			 LEFT JOIN sales s ON s.product_id = p.id
			 GROUP BY p.id, p.name`,
		);
		res.status(200).json(rows);
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "Something went wrong" });
	}
});

// 10. Product with the highest stock quantity (0.5 Grade)
server.get("/reports/highest-stock-product", async (req, res) => {
	try {
		const [rows] = await pool.query(
			"SELECT * FROM products ORDER BY quantity DESC LIMIT 1",
		);
		if (rows.length === 0) {
			return res.status(404).json({ message: "No products found" });
		}
		res.status(200).json(rows[0]);
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "Something went wrong" });
	}
});

// 11. Suppliers whose names start with 'F' (0.5 Grade)
server.get("/reports/suppliers-starting-with-f", async (req, res) => {
	try {
		const [rows] = await pool.query(
			"SELECT * FROM suppliers WHERE name LIKE 'F%'",
		);
		res.status(200).json(rows);
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "Something went wrong" });
	}
});

// 12. Products that have never been sold (0.5 Grade)
server.get("/reports/never-sold-products", async (req, res) => {
	try {
		const [rows] = await pool.query(
			`SELECT p.* FROM products p
			 LEFT JOIN sales s ON s.product_id = p.id
			 WHERE s.id IS NULL`,
		);
		res.status(200).json(rows);
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "Something went wrong" });
	}
});

// 13. All sales with product name, quantity sold, and sale date (0.5 Grade)
server.get("/reports/sales-details", async (req, res) => {
	try {
		const [rows] = await pool.query(
			`SELECT p.name AS product_name, s.quantity, s.date
			 FROM sales s
			 JOIN products p ON p.id = s.product_id`,
		);
		res.status(200).json(rows);
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "Something went wrong" });
	}
});
