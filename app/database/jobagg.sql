-- CREATE DATABASE
CREATE DATABASE IF NOT EXISTS jobagg;

-- USE DATABASE
USE jobagg;

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    password_hash TEXT NOT NULL,
    role ENUM('admin', 'client', 'entreprise') DEFAULT 'client',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- JOB OFFERS TABLE
CREATE TABLE IF NOT EXISTS job_offers (
    offer_id INT AUTO_INCREMENT PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT,
    job_type VARCHAR(50),        -- ex : 'CDI', 'CDD', 'Internship',...
    work_type VARCHAR(50),       -- ex : 'On-site', 'Remote', 'Hybrid'
    published_at TIMESTAMP,
    about TEXT,
    requirements TEXT,
    salary FLOAT,
    source_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_offer (title(255), company(255), published_at)

);

-- SKILLS TABLE
CREATE TABLE IF NOT EXISTS skills (
    skill_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- USER SKILLS
CREATE TABLE IF NOT EXISTS user_skills (
    user_id INT,
    skill_id INT,
    PRIMARY KEY (user_id, skill_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE
);

-- JOB OFFER SKILLS
CREATE TABLE IF NOT EXISTS job_offer_skills (
    offer_id INT,
    skill_id INT,
    PRIMARY KEY (offer_id, skill_id),
    FOREIGN KEY (offer_id) REFERENCES job_offers(offer_id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE
);

-- JOB VIEWS TABLE
CREATE TABLE IF NOT EXISTS job_views (
    view_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    offer_id INT,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, offer_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (offer_id) REFERENCES job_offers(offer_id) ON DELETE CASCADE
);

-- JOB LIKES TABLE
CREATE TABLE IF NOT EXISTS job_likes (
    like_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    offer_id INT,
    liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, offer_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (offer_id) REFERENCES job_offers(offer_id) ON DELETE CASCADE
);