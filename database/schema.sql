-- Run this file in MySQL first to create the database and table
-- Command line: mysql -u root -p < schema.sql

CREATE DATABASE IF NOT EXISTS testing_app_db;
USE testing_app_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notes for testers:
-- - email has a UNIQUE constraint -> duplicate email signups should fail (TC_REG_002)
-- - password_hash stores a bcrypt hash, NEVER plain text (check this in TC_REG_001)
