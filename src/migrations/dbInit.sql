/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS customers (
  id int PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL,
  address VARCHAR(255) NOT NULL,
  address_2 VARCHAR(255),
  province VARCHAR(50) NOT NULL,
  city VARCHAR(50) NOT NULL,
  phone VARCHAR(13) NOT NULL,
  postalCode int NOT NULL,
  active BOOLEAN NOT NULL
);