-- Script SQL pour créer un compte administrateur
-- Remplacez les valeurs selon vos besoins

-- Le mot de passe sera "admin123" (vous devrez le hasher avec BCrypt)
-- Hash BCrypt de "admin123": $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

INSERT INTO users (first_name, last_name, email, password, role)
VALUES (
    'Admin',                    -- Prénom
    'RimUber',                  -- Nom
    'admin@rimubr.com',        -- Email
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',  -- Mot de passe hashé (admin123)
    'ADMIN'                     -- Rôle
);

-- Vérifier que l'utilisateur a été créé
SELECT * FROM users WHERE role = 'ADMIN';
