-- on met nos requêtes dans une transaction afin de ne pas pourir la BDD si jamais on a une erreur de syntaxe dans les requêtes

BEGIN;

-- D'abord, on supprime les tables si elles existent
DROP TABLE IF EXISTS list, "card", label, card_has_label;

-- table list

CREATE TABLE IF NOT EXISTS list (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

-- table card

CREATE TABLE IF NOT EXISTS "card" (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title TEXT NOT NULL UNIQUE,
    position INTEGER NOT NULL DEFAULT 0,
    color TEXT NOT NULL DEFAULT '#ffffff',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    -- avec ON DELETE CASCADE, on indique à postgres de "suivre le fil" des clés étrangères afin de supprimer toutes les cartes contenues dans une liste qu'on veut supprimer
    list_id INTEGER NOT NULL REFERENCES list(id) ON DELETE CASCADE
);

-- table label

CREATE TABLE IF NOT EXISTS label (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    color TEXT NOT NULL DEFAULT '#ffffff',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

-- table card_has_tag

CREATE TABLE IF NOT EXISTS card_has_label (
    card_id INTEGER NOT NULL REFERENCES "card"(id) ON DELETE CASCADE,
    label_id INTEGER NOT NULL REFERENCES label(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (card_id, label_id)
);

-- seeding

INSERT INTO list("name") VALUES
('A découvrir'),
('Programmation'),
('Courses à faire');

INSERT INTO "card"(title, list_id) VALUES
('Docker', 1),
('React', 1),
('Canvas en HTML', 1),
('Fonctions récursives', 2),
('TypeScript', 2),
('Cubes de jambon', 3),
('Crême fraîche', 3),
('Fromage rapé', 3);

INSERT INTO label("name") VALUES
('Urgentissime'),
('Urgent mais pas trop'),
('Langages de prog'),
('Frameworks'),
('Gastronomie');

INSERT INTO card_has_label(card_id, label_id) VALUES
(1, 4),
(1, 2),
(2, 4),
(3, 1),
(5, 3),
(5, 1),
(6, 5),
(6, 2),
(7, 5),
(7, 2),
(8, 5),
(8, 2);


COMMIT;