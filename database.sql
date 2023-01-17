DROP DATABASE if EXISTS planner;
CREATE DATABASE planner;
use planner;

CREATE TABLE users(
    idUser INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(30) NOT NULL,
    passwordHash BINARY(64) NOT NULL
);

CREATE TABLE tokens(
    idToken INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    tokenValue VARCHAR(512) NOT NULL,
    idUser INT NOT NULL,
    expirationDate DATE NOT NULL,
    expired BOOLEAN NOT NULL,
    FOREIGN KEY (idUser) REFERENCES users(idUser)
);

CREATE TABLE diarydays(
    idDay INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    idUser INT NOT NULL,
    dayDate DATE NOT NULL,
    dayTitle VARCHAR(255) NOT NULL,
    dayDescription TEXT,
    FOREIGN KEY (idUser) REFERENCES users(idUser)
);

CREATE TABLE icons(
    idIcon int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    idUser INT NOT NULL,
    iconName TEXT NOT NULL,
    public BOOLEAN NOT NULL,
    checked BOOLEAN NOT NULL,
    icon TEXT NOT NULL,
    deleted BOOLEAN NOT NULL,
    FOREIGN KEY (idUser) REFERENCES users(idUser)
);

CREATE TABLE favourites(
    idUser INT NOT NULL,
    idIcon INT NOT NULL,
    FOREIGN KEY (idUser) REFERENCES users(idUser),
    FOREIGN KEY (idIcon) REFERENCES icons(idIcon)
);

CREATE TABLE recordsets(
    idSet INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    idUser INT NOT NULL,
    title TEXT NOT NULL,
    setsDescription TEXT,
    hour VARCHAR(5) NOT NULL,
    idIcon INT NOT NULL,
    FOREIGN KEY (idUser) REFERENCES users(idUser),
    FOREIGN KEY (idIcon) REFERENCES icons(idIcon)
);

CREATE TABLE records(
    idRecord INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    hour VARCHAR(5) NOT NULL,
    title VARCHAR(255) NOT NULL,
    recordDescription TEXT,
    idIcon INT,
    idDay INT NOT NULL,
    recordNotification BOOLEAN NOT NULL,
    FOREIGN KEY (idIcon) REFERENCES icons(idIcon),
    FOREIGN KEY (idDay) REFERENCES diarydays(idDay)
);

CREATE TABLE places(
    idPlace INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    country VARCHAR(255) NOT NULL,
    placeName TEXT NOT NULL
);

CREATE TABLE diarydaysplaces(
    idDay INT NOT NULL,
    idPlace INT NOT NULL,
    FOREIGN KEY (idDay) REFERENCES diarydays(idDay),
    FOREIGN KEY (idPlace) REFERENCES places(idPlace)
);

CREATE TABLE twitch(
    idSession INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    idDay INT NOT NULL,
    link VARCHAR(255) NOT NULL,
    sessionTime TIME NOT NULL,
    FOREIGN KEY (idDay) REFERENCES diarydays(idDay)
);


CREATE TABLE daysyoutube(
    idDaysYoutube INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    idDay INT NOT NULL,
    link VARCHAR(255) NOT NULL,
    FOREIGN KEY (idDay) REFERENCES diarydays(idDay)
);


INSERT INTO users (users.username, users.passwordHash) VALUES ("Testowy username", SHA2('Maria',256));
INSERT INTO users (users.username, users.passwordHash) VALUES ("admin", SHA2('admin',256));


INSERT INTO diarydays(idUser,dayDate,dayTitle,dayDescription) VALUES
(2,"2022-11-26","Ciekawy dzień","Brak opisu na razie"),
(2,"2022-11-27","!Ciekawy! !dzień!","!Brak! !opisu! !na! !razie!"),
(2,"2023-01-03","hejka","!Brak! !opisu! !na! !razie!");

INSERT INTO records(hour,title,recordDescription,idDay,recordNotification) VALUES
("09.00","Pobudka",NULL,1, 0),
("12.30","Wtań z łóżka",NULL,1, 0),
("13.00","śniadanie",NULL,1, 0),
("13.30","Idź do sklepu",NULL,1, 0),
("23.00","Idź spać","żart graj na kompie dalej",1, 0),
("06.00","Pobudka",NULL,2, 0),
("06.02","Zjedz śniadanie",NULL,2, 0),
("07.00","Idź do szkoły",NULL,2, 0);

INSERT INTO records(hour,title,recordDescription,idDay,recordNotification) VALUES
("16.00","Powrót do domu",NULL,1, 0);
