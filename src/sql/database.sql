CREATE DATABASE vetserver;

USE vetserver;

CREATE TABLE tb_adm(
    id_user INT NOT NULL PRIMARY KEY,
    name VARCHAR(100),
    lastname VARCHAR(100),
    birth_date DATE,
    gender VARCHAR(50),
    position VARCHAR(50),
    user VARCHAR(50),
    cel CHAR(10),
    pass VARCHAR(255)
);

INSERT INTO tb_adm(id_user, name, lastname, birth_date, gender, position, user, cel, pass) VALUE('1017234253','laura alexandra','aristizabal angel','01/01/1996','Femenino','Administrador','laura','3153095554','123456');

CREATE TABLE tb_clients(
    id_client INT NOT NULL PRIMARY KEY,
    name_client VARCHAR(50),
    surname_client VARCHAR(50),
    second_surname_client VARCHAR(50),
    birth_date_client DATE,
    gender_client VARCHAR(50),
    email VARCHAR(50),
    address VARCHAR(50),
    tel CHAR(7),
    cel CHAR(10)
);

INSERT INTO tb_clients(id_client, name, surname, second_surname, birth_date, gender, email, address, tel, cel) VALUE('laura alexandra','aristizabal','angel','', 'Femenino','alexa.laaa@gmail.com','calle 55 # 45-85','2061067','3153095554');

CREATE TABLE tb_pets(
    id_pet INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    chip INT NOT NULL,
    name_pet VARCHAR(50),
    last_name_pet VARCHAR(50),
    birth_date_pet DATE,
    species CHAR(10),
    race VARCHAR(50),
    gender_pet VARCHAR(50),
    reproductive_status VARCHAR(50),
    deworming DATE,
    vaccination DATE,
    state_pet VARCHAR(20),
    id_client INT
);

INSERT INTO tb_pets(id_pet, chip, name, last_name, birth_date, species, race, gender, reproductive_status, deworming, vaccination, state) VALUE('123', '123789','mishka','aristizabal','' ,'' ,'' ,'', '', '', '', '');

CREATE TABLE tb_histories (
    id_clinical_histories INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    date_clinical_histories DATE,
    visit_pet VARCHAR(50),
    anamnesis VARCHAR(80),
    exam_details VARCHAR(200),
    diagnosis VARCHAR(200),
    diagnosis_plan VARCHAR(200),
);

SELECT * FROM 