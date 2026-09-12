CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(255) NOT NULL,
    active BOOLEAN NOT NULL,
    created_at TIMESTAMP
);

CREATE INDEX idx_user_username ON users (username);
CREATE INDEX idx_user_email ON users (email);

CREATE TABLE transactions (
    id BIGSERIAL PRIMARY KEY,
    amount DECIMAL(19, 2) NOT NULL,
    type VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    created_by BIGINT NOT NULL REFERENCES users (id),
    created_at TIMESTAMP,
    notes VARCHAR(255),
    deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_tx_type ON transactions (type);
CREATE INDEX idx_tx_category ON transactions (category);
CREATE INDEX idx_tx_date ON transactions (date);
CREATE INDEX idx_tx_created_by ON transactions (created_by);
CREATE INDEX idx_tx_deleted ON transactions (deleted);

CREATE TABLE budgets (
    id BIGSERIAL PRIMARY KEY,
    category VARCHAR(255) NOT NULL,
    amount_limit DECIMAL(19, 2) NOT NULL,
    user_id BIGINT NOT NULL REFERENCES users (id),
    created_at TIMESTAMP,
    UNIQUE (user_id, category)
);
