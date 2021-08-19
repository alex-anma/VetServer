const bcryptjs = require("bcryptjs");
const connection = require("../../config/db");
const dateTransformer = require("../utils/date_transform");

module.exports = (app) => {
  app.get("/", (req, res) => {
    res.render("../views/index.ejs");
  });

  app.get("/login", (req, res) => {
    res.render("../views/login.ejs");
  });

  app.get("/inicio", (req, res) => {
    connection.query("SELECT * FROM tb_clients", (err, result) => {
      if (err) {
        res.send("Something went wrong : (" + err);
      } else {
        res.render("../views/inicio.ejs", {
          inventario: result,
          position: req.session.position,
        });
      }
    });
  });

  app.get("/delete/:id_client", (req, res) => {
    const id_client = req.params.id_client;
    connection.query(
      "DELETE FROM tb_clients WHERE id_client = ?",
      [id_client],
      (err, result) => {
        if (err) {
          res.send(err);
        } else {
          res.redirect("/inicio");
        }
      }
    );
  });

  app.get("/resumen_cliente/:id_client", (req, res) => {
    const id_client = req.params.id_client;
    connection.query(
      "SELECT * FROM tb_clients WHERE id_client = ?",
      [id_client],
      (err, result) => {
        if (err) {
          res.send(err);
        } else {
          const client = result[0];
          console.log(result);

          connection.query(
            "SELECT * FROM tb_pets WHERE id_client = ?",
            [id_client],
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                let pets = result;
                res.render("../views/resumen_cliente.ejs", {
                  cliente: client,
                  pets: pets,
                  position: req.session.position,
                });
              }
            }
          );
        }
      }
    );
  });

  app.get("/resumen_mascota/:id_pet", (req, res) => {
    /* const pets = req.params.id_clinical_histories
    connection.query("SELECT * FROM tb_pets WHERE id_pet", (err, result) => {
      [pets]
      if (err) {
        res.send(err)
      } else {
        const pets = result[0]
        res.render("../views/resumen_mascota.ejs", {
          pets: pets,
          position: req.session.position,
        });
      }
    }) */




    const id_pet = req.params.id_pet;
    connection.query(
      "SELECT * FROM tb_pets WHERE id_pet = ?",
      [id_pet],
      (err, result) => {
        if (err) {
          res.send(err);
        } else {
          const pets = result[0];
          console.log(result);

          connection.query(
            "SELECT * FROM tb_histories WHERE id_pet = ?",
            [id_pet],
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                let histories = result;
                res.render("../views/resumen_mascota.ejs", {
                  pets: pets,
                  histories: histories,
                  position: req.session.position,
                });
              }
            }
          );
        }
      }
    );
  });

  app.get("/mascotas", (req, res) => {
    connection.query(
      "SELECT * FROM tb_pets JOIN tb_clients ON tb_clients.id_client = tb_pets.id_client",
      (err, result) => {
        if (err) {
          res.send("Something went wrong : (" + err);
        } else {
          res.render("../views/mascotas.ejs", {
            inventario: result,
            position: req.session.position,
          });
        }
      }
    );
  });

  app.get("/form_usuario", (req, res) => {
    res.render("../views/form_usuario.ejs", {
      position: req.session.position,
    });
  });

  app.get("/form_cliente", (req, res) => {
    res.render("../views/form_cliente.ejs", {
      position: req.session.position,
    });
  });

  app.get("/form_mascota/:id_client", (req, res) => {
    res.render("../views/form_mascota.ejs", {
      position: req.session.position,
    });
  });

  app.get("/form_historial/:id_pet", (req, res) => {
    res.render("../views/form_historial.ejs", {
      position: req.session.position,
    });
  });

  app.get("/historial/:id_pet", (req, res) => {
    const histories = req.params.id_clinical_histories
    connection.query("SELECT * FROM tb_histories, tb_pets WHERE id_clinical_histories", (err, result) => {
      [histories]
      if (err) {
        res.send(err)
      } else {
        const histories = result[0]
        res.render("../views/historial.ejs", {
          histories: histories,
          position: req.session.position,
        });
      }
    })
  });

  //solicitudes POST en el registro de usuario
  app.post("/form_usuario", async (req, res) => {
    const {
      id_user,
      name,
      lastname,
      birth_date,
      gender,
      position,
      user,
      cel,
      pass,
    } = req.body;
    let passwordHaash = await bcryptjs.hash(pass, 8); // 8 son ciclos para encriptar
    connection.query(
      "INSERT INTO tb_adm SET ?",
      {
        id_user: id_user,
        name: name,
        lastname: lastname,
        birth_date: birth_date,
        gender: gender,
        position: position,
        user: user,
        cel: cel,
        pass: passwordHaash,
      },
      async (error, results) => {
        if (error) {
          console.log(error);
        } else {
          res.render("form_usuario", {
            position: req.session.position,
            alert: true,
            alertTitle: "Registrado",
            alertMessage: "Registro Exitoso",
            alertIcon: "success",
            showConfirmButton: false,
            timer: 1500,
            ruta: "inicio",
          });
        }
      }
    );
  });

  //solicitudes POST en el Login (autentificacion)
  app.post("/login", async (req, res) => {
    const { user, pass } = req.body;
    let passwordHaash = await bcryptjs.hash(pass, 8);
    if (user && pass) {
      connection.query(
        "SELECT * FROM tb_adm WHERE user = ?",
        [user],
        async (err, results) => {
          if (
            results.length === 0 ||
            !(await bcryptjs.compare(pass, results[0].pass))
          ) {
            // res.send('Usuario o contraseña incorrectas');
            res.render("login", {
              alert: true,
              alertTitle: "Error",
              alertMessage: "Usuario o contraseña incorrenta",
              alertIcon: "error",
              showConfirmButton: true,
              timer: false,
              ruta: "login",
            });
          } else {
            // res.send('Bienvenido');
            req.session.name = results[0].name;
            req.session.position = results[0].position;
            res.render("../views/login.ejs", {
              alert: true,
              alertTitle: "Conexión exitosa",
              alertMessage: "Login correcto",
              alertIcon: "success",
              showConfirmButton: false,
              timer: 1500,
              ruta: "inicio",
            });
          }
        }
      );
    } else {
      res.send("Por favor ingrese un usuario y/o contraseña");
    }
  });

  //logout
  app.get("/logout", (req, res) => {
    req.session.destroy(() => {
      res.redirect("/");
    });
  });

  //solicitud POST en el formulario clientes
  app.post("/form_cliente", async (req, res) => {
    const {
      id_client,
      name_client,
      surname_client,
      second_surname_client,
      birth_date_client,
      gender_client,
      email,
      address,
      tel,
      cel,
    } = req.body;
    connection.query(
      "INSERT INTO tb_clients SET ?",
      {
        id_client: id_client,
        name_client: name_client,
        surname_client: surname_client,
        second_surname_client: second_surname_client,
        birth_date_client: birth_date_client,
        gender_client: gender_client,
        email: email,
        address: address,
        tel: tel,
        cel: cel,
      },
      async (error, results) => {
        if (error) {
          console.log(error);
        } else {
          res.render("form_cliente", {
            position: req.session.position,
            alert: true,
            alertTitle: "Registrado",
            alertMessage: "Registro Exitoso",
            alertIcon: "success",
            showConfirmButton: false,
            timer: 1500,
            ruta: "inicio",
          });
        }
      }
    );
  });

  //solicitud POST en el formulario mascotas
  app.post("/form_mascota", async (req, res) => {
    const {
      id_pet,
      id_client,
      chip,
      name_pet,
      last_name_pet,
      birth_date_pet,
      species,
      race,
      gender_pet,
      reproductive_status,
      deworming,
      vaccination,
      state_pet,
    } = req.body;
    connection.query(
      "INSERT INTO tb_pets SET ?",
      {
        id_pet: id_pet,
        id_client: id_client,
        chip: chip,
        name_pet: name_pet,
        last_name_pet: last_name_pet,
        birth_date_pet: birth_date_pet,
        species: species,
        race: race,
        gender_pet: gender_pet,
        reproductive_status: reproductive_status,
        deworming: deworming,
        vaccination: vaccination,
        state_pet: state_pet,
      },
      async (error, results) => {
        if (error) {
          console.log(error);
        } else {
          res.render("form_mascota", {
            position: req.session.position,
            alert: true,
            alertTitle: "Registrado",
            alertMessage: "Registro Exitoso",
            alertIcon: "success",
            showConfirmButton: false,
            timer: 1500,
            ruta: "inicio",
          });
        }
      }
    );
  });

  app.post("/form_historial", async (req, res) => {
    const {
      id_clinical_histories,
      date_clinical_histories,
      visit_pet,
      anamnesis,
      previous_illnesses,
      recent_treatment,
      surgeries,
      diet_frequency,
      behaviour,
      weight,
      temperature,
      heart_rate,
      breathing_frequency,
      capillary_time,
      skin_fold,
      dehydration,
      tussive,
      pulse,
      mucous,
      body_condition,
      superficial_nodes,
      percussion_span,
      hydration,
      nutritional_status,
      superficial_nodes_special,
      attitude,
      observations_attitude,
      eyes,
      observations_eyes,
      ears,
      observations_ears,
      digestive_system,
      observations_system,
      cardiac_system,
      observations_cardiac,
      respiratory_system,
      observations_respiratory,
      urinary_system,
      observations_urinary,
      reproductive_system,
      observations_reproductive,
      musculoskeletal_system,
      observations_musculoskeletal,
      nervous_system,
      observations_nervous,
      skin_annex,
      observations_skin_annex,
      exam_details,
      presumptive_diagnoses,
      differential_diagnoses,
      diagnostic_plan,
      treatment,
      id_pet,
    } = req.body;
    connection.query(
      "INSERT INTO tb_histories SET ?",
      {
        id_clinical_histories: id_clinical_histories,
        date_clinical_histories: date_clinical_histories,
        visit_pet: visit_pet,
        anamnesis: anamnesis,
        previous_illnesses: previous_illnesses,
        recent_treatment: recent_treatment,
        surgeries: surgeries,
        diet_frequency: diet_frequency,
        behaviour: behaviour,
        weight: weight,
        temperature: temperature,
        heart_rate: heart_rate,
        breathing_frequency: breathing_frequency,
        capillary_time: capillary_time,
        skin_fold: skin_fold,
        dehydration: dehydration,
        tussive: tussive,
        pulse: pulse,
        mucous: mucous,
        body_condition: body_condition,
        superficial_nodes: superficial_nodes,
        percussion_span: percussion_span,
        hydration: hydration,
        nutritional_status: nutritional_status,
        superficial_nodes_special: superficial_nodes_special,
        attitude: attitude,
        observations_attitude: observations_attitude,
        eyes: eyes,
        observations_eyes: observations_eyes,
        ears: ears,
        observations_ears: observations_ears,
        digestive_system: digestive_system,
        observations_system: observations_system,
        cardiac_system: cardiac_system,
        observations_cardiac: observations_cardiac,
        respiratory_system: respiratory_system,
        observations_respiratory: observations_respiratory,
        urinary_system: urinary_system,
        observations_urinary: observations_urinary,
        reproductive_system: reproductive_system,
        observations_reproductive: observations_reproductive,
        musculoskeletal_system: musculoskeletal_system,
        observations_musculoskeletal: observations_musculoskeletal,
        nervous_system: nervous_system,
        observations_nervous: observations_nervous,
        skin_annex: skin_annex,
        observations_skin_annex: observations_skin_annex,
        exam_details: exam_details,
        presumptive_diagnoses: presumptive_diagnoses,
        differential_diagnoses: differential_diagnoses,
        diagnostic_plan: diagnostic_plan,
        treatment: treatment,
        id_pet,
      },
      async (error, results) => {
        if (error) {
          console.log(error);
        } else {
          res.render("form_historial", {
            position: req.session.position,
            alert: true,
            alertTitle: "Registrado",
            alertMessage: "Registro Exitoso",
            alertIcon: "success",
            showConfirmButton: false,
            timer: 1500,
            ruta: "inicio",
          });
        }
      }
    );
  });

  app.post("/inicio/:id_client", (req, res) => {
    const id_client = req.params.id_client;
    const {
      name_client,
      surname_client,
      second_surname_client,
      birth_date_client,
      gender_client,
      email,
      address,
      tel,
      cel,
    } = req.body;
    connection.query(
      "UPDATE tb_clients SET name_client = ?, surname_client = ?, second_surname_client = ?, birth_date_client = ?, gender_client = ?, email = ?, address = ?, tel = ?, cel = ? WHERE id_client = ?",
      [
        name_client,
        surname_client,
        second_surname_client,
        birth_date_client,
        gender_client,
        email,
        address,
        tel,
        cel,
        id_client,
      ],
      (err, result) => {
        if (err) {
          res.send(err);
        } else {
          res.redirect("/inicio");
        }
      }
    );
  });

  app.post("/mascotas/:id_pet", (req, res) => {
    const id_pet = req.params.id_pet;
    const {
      chip,
      name_pet,
      last_name_pet,
      birth_date_pet,
      species,
      race,
      gender_pet,
      reproductive_status,
      deworming,
      vaccination,
      state_pet,
    } = req.body;
    connection.query(
      "UPDATE tb_pets SET chip = ?, name_pet = ?, last_name_pet = ?, birth_date_pet = ?, species = ?, race = ?, gender_pet = ?, reproductive_status = ?, deworming = ?, vaccination = ?, state_pet = ? WHERE id_pet = ?",
      [
        chip,
        name_pet,
        last_name_pet,
        birth_date_pet,
        species,
        race,
        gender_pet,
        reproductive_status,
        deworming,
        vaccination,
        state_pet,
        id_pet,
      ],
      (err, result) => {
        if (err) {
          res.send(err);
        } else {
          res.redirect("/mascotas");
        }
      }
    );
  });
};

//-------------------------------------------------//----------------------------------------------------//
