DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS resource_comments CASCADE;
DROP TABLE IF EXISTS resource_rates CASCADE;
DROP TABLE IF EXISTS user_likes CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS resources CASCADE;

CREATE TABLE categories (
  id SERIAL PRIMARY KEY NOT NULL,
  topic VARCHAR(255) NOT NULL

);

CREATE TABLE resource_comments (
  id SERIAL PRIMARY KEY NOT NULL,
  resource_id INTEGER REFERENCES resources(id) ON DELETE CASCADE,
  owner_id INTEGER REFERENCES resources(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
);


CREATE TABLE resource_rates (
  id SERIAL PRIMARY KEY NOT NULL,
  resource_id INTEGER REFERENCES resources(id) ON DELETE CASCADE,
  owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  rating FLOAT NOT NULL
);

CREATE TABLE user_likes (
  id SERIAL PRIMARY KEY NOT NULL,
  resource_id INTEGER REFERENCES resources(id),
  owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  photo VARCHAR(255) NOT NULL
);

CREATE TABLE resources (
  id SERIAL PRIMARY KEY NOT NULL,
  owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  url VARCHAR(255) NOT NULL,
  description TEXT NOT NULL
);
