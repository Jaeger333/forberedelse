CREATE TABLE IF NOT EXISTS fag_user2 (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idFag INTEGER NOT NULL,
    idUser INTEGER NOT NULL,
    FOREIGN KEY (idFag) REFERENCES fag(id),
    FOREIGN KEY (idUser) REFERENCES user(id)
);

DROP TABLE fag_user2

INSERT INTO fag_user2 (id, idFag, idUser)
SELECT id, idFag, idUser FROM fag_user;

DROP TABLE fag_user

ALTER TABLE fag_user2 RENAME TO fag_user;
