CREATE TABLE users
(
    user_id int PRIMARY KEY,
    username varchar(50) UNIQUE NOT NULL,
    pass varchar(255) NOT NULL,
    nickname varchar(50) NOT NULL
);

CREATE TABLE blogs
(
    id SERIAL PRIMARY KEY,
    user_id int REFERENCES users (user_id),
    title varchar(100) NOT NULL,
    description text,
    content text,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);