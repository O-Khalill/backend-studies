CREATE DATABASE store;


CREATE TABLE products (

    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL


);
CREATE TABLE suppliers(

    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    contact_number varchar(20) NOT NULL

);

ALTER TABLE products ADD COLUMN supplier_id INT;

ALTER TABLE products
ADD CONSTRAINT fk_supplier_id
FOREIGN KEY (supplier_id) REFERENCES suppliers(id);


USE store;
CREATE TABLE sales(

    id int AUTO_INCREMENT PRIMARY KEY,
    name varchar(50) NOT NULL,
    quantity int NOT NULL,
    date DATE NOT NULL

);


ALTER TABLE sales MODIFY COLUMN date DATE DEFAULT (CURRENT_DATE);


ALTER TABLE sales ADD COLUMN product_id INT;

ALTER TABLE sales
ADD CONSTRAINT fk_product_id
FOREIGN KEY (product_id) REFERENCES products(id);



ALTER TABLE sales DROP COLUMN name;



-- 14. Create store_manager user and grant SELECT, INSERT, UPDATE on all tables (0.5 Grade)
CREATE USER 'store_manager'@'localhost' IDENTIFIED BY 'man1234';

GRANT SELECT, INSERT, UPDATE ON store.* TO 'store_manager'@'localhost';




-- 15. Revoke UPDATE permission from store_manager (0.5 Grade)
REVOKE UPDATE ON store.* FROM 'store_manager'@'localhost';




-- 16. Grant DELETE permission to store_manager, only on the sales table (0.5 Grade)
GRANT DELETE ON store.sales TO 'store_manager'@'localhost';

