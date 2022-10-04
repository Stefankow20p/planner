DROP DATABASE if EXISTS planner;
CREATE DATABASE planner;
use planner

CREATE TABLE Users(
    idUser INT NOT NULL AUTO_INRCEMENT PRIMARY KEY,
    username VARCHAR(30) NOT NULL,
    passwordHash BINARY(32) NOT NULL
);

CREATE TABLE Tokens(
    idToken INT NOT NULL AUTO_INRCEMENT PRIMARY KEY,
    tokenValue INT NOT NULL,
    idUser INT NOT NULL,
    expirationDate DATE NOT NULL,
    expired BOOLEAN NOT NULL,
    FOREIGN KEY (idUser) REFERENCES Users(idUser)
);

CREATE TABLE Days(
    idDay INT NOT NULL AUTO_INRCEMENT PRIMARY KEY,
    idUser INT NOT NULL,
    dayDate DATE NOT NULL,
    title STR NOT NULL,

);