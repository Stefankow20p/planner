DROP DATABASE if EXISTS planner;
CREATE DATABASE planner;
use planner;

CREATE TABLE Users(
    idUser INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(30) NOT NULL,
    passwordHash BINARY(64) NOT NULL
);

CREATE TABLE Tokens(
    idToken INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    tokenValue VARCHAR(256) NOT NULL,
    idUser INT NOT NULL,
    expirationDate DATE NOT NULL,
    expired BOOLEAN NOT NULL,
    FOREIGN KEY (idUser) REFERENCES Users(idUser)
);

CREATE TABLE DiaryDays(
    idDay INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    idUser INT NOT NULL,
    dayDate DATE NOT NULL,
    title VARCHAR(255) NOT NULL,
    dayDescription TEXT,
    FOREIGN KEY (idUser) REFERENCES Users(idUser)
);

CREATE TABLE Icons(
    idIcon int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    idUser INT NOT NULL,
    iconName TEXT NOT NULL,
    public BOOLEAN NOT NULL,
    checked BOOLEAN NOT NULL,
    icon TEXT NOT NULL,
    deleted BOOLEAN NOT NULL,
    FOREIGN KEY (idUser) REFERENCES Users(idUser)
);

CREATE TABLE Favourites(
    idUser INT NOT NULL,
    idIcon INT NOT NULL,
    FOREIGN KEY (idUser) REFERENCES Users(idUser),
    FOREIGN KEY (idIcon) REFERENCES Icons(idIcon)
);

CREATE TABLE RecordSets(
    idSet INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    idUser INT NOT NULL,
    title TEXT NOT NULL,
    setsDescription TEXT,
    hour VARCHAR(5) NOT NULL,
    idIcon INT NOT NULL,
    FOREIGN KEY (idUser) REFERENCES Users(idUser),
    FOREIGN KEY (idIcon) REFERENCES Icons(idIcon)
);

CREATE TABLE Records(
    idRecord INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    hour VARCHAR(5) NOT NULL,
    title VARCHAR(255) NOT NULL,
    recordDescription TEXT,
    idIcon INT,
    idDay INT NOT NULL,
    recordNotification BOOLEAN NOT NULL,
    FOREIGN KEY (idIcon) REFERENCES Icons(idIcon),
    FOREIGN KEY (idDay) REFERENCES DiaryDays(idDay)
);

CREATE TABLE Places(
    idPlace INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    country VARCHAR(255) NOT NULL,
    placeName TEXT NOT NULL
);

CREATE TABLE DiaryDaysPlaces(
    idDay INT NOT NULL,
    idPlace INT NOT NULL,
    FOREIGN KEY (idDay) REFERENCES DiaryDays(idDay),
    FOREIGN KEY (idPlace) REFERENCES Places(idPlace)
);

CREATE TABLE Twitch(
    idSession INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    idDay INT NOT NULL,
    link VARCHAR(255) NOT NULL,
    sessionTime TIME NOT NULL,
    FOREIGN KEY (idDay) REFERENCES DiaryDays(idDay)
);

CREATE TABLE Youtube(
    idFilm INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    link VARCHAR(255) NOT NULL
);

CREATE TABLE DiaryDaysYoutube(
    idDay INT NOT NULL,
    idFilm INT NOT NULL,
    FOREIGN KEY (idDay) REFERENCES DiaryDays(idDay),
    FOREIGN KEY (idFilm) REFERENCES Youtube(idFilm)
);


INSERT INTO users (users.username, users.passwordHash) VALUES ("Testowy username", SHA2('Maria',256));
INSERT INTO users (users.username, users.passwordHash) VALUES ("admin", SHA2('admin',256));