CREATE DATABASE MiniMemoryZone;
USE MiniMemoryZone;

CREATE TABLE User (
    userId INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    fullName VARCHAR(255) NOT NULL, 
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    hashedPass VARCHAR(255) NOT NULL
);

CREATE TABLE `Order` (
    orderId INT PRIMARY KEY AUTO_INCREMENT,
    status ENUM('pending', 'processing', 'shipping', 'completed', 'cancelled') NOT NULL,
    userId INT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    customerName VARCHAR(255) NOT NULL,
    customerPhone VARCHAR(10) NOT NULL,
    customerAddress VARCHAR(255) NOT NULL,
    totalProduct INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES User(userId) ON DELETE CASCADE
);


CREATE TABLE Product (
    productId INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    imageURL VARCHAR(255),
    price DECIMAL(10, 2) NOT NULL,
    stockQuantity INT NOT NULL
);

CREATE TABLE includes (
    quantity INT NOT NULL CHECK (quantity > 0),
    price DECIMAL(10, 2) NOT NULL,
    orderId INT NOT NULL,
    productId INT NOT NULL,
    PRIMARY KEY (orderId, productId),
    FOREIGN KEY (orderId) REFERENCES `Order`(orderId),
    FOREIGN KEY (productId) REFERENCES Product(productId)
);

CREATE TABLE Cart (
    cartId INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL UNIQUE,
    FOREIGN KEY (userId) REFERENCES User(userId)
);

CREATE TABLE CartItem (
    cartItemId INT PRIMARY KEY AUTO_INCREMENT,
    quantity INT NOT NULL,
    cartId INT NOT NULL,
    productId INT NOT NULL,
    FOREIGN KEY (cartId) REFERENCES Cart(cartId),
    FOREIGN KEY (productId) REFERENCES Product(productId),
    UNIQUE (cartId, productId) --tránh thêm vào bị trùng sản phẩm
);
