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
    tokenValue VARCHAR(512) NOT NULL,
    idUser INT NOT NULL,
    expirationDate DATE NOT NULL,
    expired BOOLEAN NOT NULL,
    FOREIGN KEY (idUser) REFERENCES Users(idUser)
);

CREATE TABLE DiaryDays(
    idDay INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    idUser INT NOT NULL,
    dayDate DATE NOT NULL,
    dayTitle VARCHAR(255) NOT NULL,
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


INSERT INTO diarydays(idUser,dayDate,dayTitle,dayDescription) VALUES
(2,"2022-11-26","Ciekawy dzień","Brak opisu na razie"),
(2,"2022-11-27","!Ciekawy! !dzień!","!Brak! !opisu! !na! !razie!"),
(2,"2023-01-03","hejka","!Brak! !opisu! !na! !razie!");

INSERT INTO records(hour,title,recordDescription,idDay,recordNotification) VALUES
("09.00","Wstawaj",NULL,1, 0),
("12.30","Sniadanko",NULL,1, 0),
("13.00","Do sklepu",NULL,1, 0),
("13.30","valorant time",NULL,1, 0),
("23.00","Wyłącz Valo","Taki żart graj dalej",1, 0),
("06.00","Wstawaj",NULL,2, 0),
("06.02","Ząbki umyj",NULL,2, 0),
("07.00","Do szkółki wariaciku",NULL,2, 0);

INSERT INTO records(hour,title,recordDescription,idDay,recordNotification) VALUES
("16.00","Przerwa na toalete",NULL,1, 0);
