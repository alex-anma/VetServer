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
    id_client INT NOT NULL,
    FOREIGN KEY (id_client) REFERENCES tb_clients(id_client);
);

INSERT INTO tb_pets(id_pet, chip, name, last_name, birth_date, species, race, gender, reproductive_status, deworming, vaccination, state) VALUE('123', '123789','mishka','aristizabal','' ,'' ,'' ,'', '', '', '', '');

CREATE TABLE tb_histories (
    id_clinical_histories INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    date_clinical_histories DATE,
    visit_pet VARCHAR(50),
    anamnesis VARCHAR(80),
    previous_illnesses VARCHAR(250),
    recent_treatment VARCHAR(250),
    surgeries VARCHAR(250),
    diet_frequency  VARCHAR(250),
    behaviour VARCHAR(250),
    weight FLOAT,
    temperature FLOAT,
    heart_rate INT,
    breathing_frequency INT,
    capillary_time INT,
    skin_fold INT,
    dehydration INT,
    tussive VARCHAR(50),
    pulse VARCHAR(50),
    mucous VARCHAR(100),
    body_condition INT,
    superficial_nodes VARCHAR(20),
    percussion_span VARCHAR(50),
    hydration CHAR(10),
    nutritional_status CHAR(10),
    superficial_nodes_special CHAR(10),
    attitude CHAR(10),
    observations_attitude VARCHAR(250),
    eyes CHAR(10),
    observations_eyes VARCHAR(250),
    ears CHAR(10),
    observations_ears VARCHAR(250),
    digestive_system CHAR(10),
    observations_system VARCHAR(250),
    cardiac_system CHAR(10),
    observations_cardiac VARCHAR(250),
    respiratory_system CHAR(10),
    observations_respiratory VARCHAR(250),
    urinary_system CHAR(10),
    observations_urinary VARCHAR(250),
    reproductive_system CHAR(10),
    observations_reproductive VARCHAR(250),
    musculoskeletal_system CHAR(10),
    observations_musculoskeletal VARCHAR(250),
    nervous_system CHAR(10),
    observations_nervous VARCHAR(250),
    skin_annex CHAR(10),
    observations_skin_annex VARCHAR(250),
    exam_details CHAR(10),
    presumptive_diagnoses VARCHAR(250),
    differential_diagnoses CHAR(10),
    diagnostic_plan VARCHAR(250),
    treatment VARCHAR(250),
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_pet INT
    FOREIGN KEY (id_pet) REFERENCES tb_pets(id_pet);
);

/* Agregar claves foraneas */
ALTER TABLE tb_histories
ADD CONSTRAINT id_pet
FOREIGN KEY (id_pet) REFERENCES tb_pets(id_pet);