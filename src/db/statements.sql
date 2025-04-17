CREATE TABLE dilemmata(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    content TEXT
);
INSERT INTO dilemmata( name,content)
VALUES ('Angela', 'Test1');

UPDATE dilemmata
SET name = 'Angela'
WHERE name = 'Christoph';

DELETE from dilemmata
WHERE name='name'

SELECT * FROM dilemmata