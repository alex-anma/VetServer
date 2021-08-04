const bcryptjs = require("bcryptjs");
const connection = require("../../config/db");

module.exports = app => {
    app.get('/', (req,res) => {
        res.render('../views/index.ejs');
    })
  
    app.get('/login', (req,res) => {
        res.render('../views/login.ejs');
    })
    
    app.get('/inicio', (req,res) => {
        connection.query("SELECT * FROM tb_clients JOIN tb_pets ON tb_clients.id_client = tb_pets.id_client", (err, result) => {
            // console.log(result);
            if (err) {
                res.send("Something went wrong : (" + err);
            }else {
                res.render("../views/inicio.ejs", {
                    inventario: result,
                    position: req.session.position
                });
            }
        });
    })

    app.get("/delete/:id_client", (req,res) => {
        const id_client = req.params.id_client;
        connection.query("DELETE FROM tb_clients WHERE id_client = ?", [id_client], (err,result) => {
            if (err) {
                res.send(err);
            }else {
                res.redirect("/inicio");
            }
        })
    })

    app.get("/resumen_cliente/:id_client", (req,res) => {
        const id_client = req.params.id_client;
        connection.query("SELECT * FROM tb_clients WHERE id_client = ?", [id_client], (err,result) => {
            if (err) {
                res.send(err);
            }else {
                res.render("../views/resumen_cliente.ejs", {
                    inventario: result,
                    position: req.session.position
                });
            }
        })
    })
    
    app.get('/mascotas', (req,res) => {
        connection.query("SELECT * FROM tb_pets JOIN tb_clients ON tb_clients.id_client = tb_pets.id_client", (err, result) => {
            // console.log(result);
            if (err) {
                res.send("Something went wrong : (" + err);
            }else {
                res.render("../views/mascotas.ejs", {
                    inventario: result,
                    position: req.session.position
                });
            }
        });
    })

    app.get('/form_usuario', (req,res) => {
        res.render('../views/form_usuario.ejs', {
            position: req.session.position
        });
    })

    app.get('/form_cliente', (req,res) => {
        res.render("../views/form_cliente.ejs", {
            position: req.session.position
        });
    })

    app.get('/form_mascota', (req,res) => {
        res.render('../views/form_mascota.ejs', {
            position: req.session.position
        });
    })

    app.get('/form_historial', (req,res) => {
        res.render('../views/form_historial.ejs', {
            position: req.session.position
        });
    })

    app.get('/resumen_cliente', (req,res) => {
        connection.query("SELECT * FROM tb_clients JOIN tb_pets ON tb_clients.id_client = tb_pets.id_client", (err, result) => {
            if (err) {
                res.send("Something went wrong : (" + err);
            }else {
                res.render("../views/resumen_cliente.ejs", {
                    inventario: result,
                    position: req.session.position
                });
            }
        });
    })

    app.get('/resumen_mascota', (req,res) => {
        connection.query("SELECT * FROM tb_clients JOIN tb_pets ON tb_clients.id_client = tb_pets.id_client", (err, result) => {
            if (err) {
                res.send("Something went wrong : (" + err);
            }else {
                res.render("../views/resumen_mascota.ejs", {
                    inventario: result,
                    position: req.session.position
                });
            }
        });
    })
    //solicitudes POST en el registro de usuario
    app.post('/form_usuario', async (req, res) => {
        const {id_user, name, lastname, birth_date, gender, position, user, cel, pass} = req.body;
        let passwordHaash = await bcryptjs.hash(pass, 8);// 8 son ciclos para encriptar 
        connection.query("INSERT INTO tb_adm SET ?", {
            id_user: id_user,
            name: name,
            lastname: lastname,
            birth_date: birth_date,
            gender: gender,
            position: position,
            user: user,
            cel: cel,
            pass : passwordHaash
        }, async(error, results) => {
            if (error) {
                console.log(error);
            } else {
                res.render("form_usuario", {
                    position: req.session.position,
                    alert:true,
                    alertTitle: "Registrado",
                    alertMessage: "Registro Exitoso",
                    alertIcon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: "inicio"
                })
            }
        })
    })

    //solicitudes POST en el Login (autentificacion)
    app.post("/login", async(req, res)=>{
        const {user, pass} = req.body;
        let passwordHaash = await bcryptjs.hash(pass, 8);
        if (user && pass) {
            connection.query("SELECT * FROM tb_adm WHERE user = ?", [user], async (err, results)=>{
                if (results.length === 0 || !(await bcryptjs.compare(pass, results[0].pass))) {
                    // res.send('Usuario o contraseña incorrectas');
                    res.render("login", {
                        alert: true,
                        alertTitle : "Error",
                        alertMessage: "Usuario o contraseña incorrenta",
                        alertIcon: "error",
                        showConfirmButton: true,
                        timer: false,
                        ruta: "login"
                    })
                }else {
                    // res.send('Bienvenido');
                    req.session.name = results[0].name
                    req.session.position = results[0].position
                    res.render("../views/login.ejs", {
                    alert: true,
                    alertTitle : "Conexión exitosa",
                    alertMessage: "Login correcto",
                    alertIcon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: "inicio"
                    })
                }
            })
        }else {
            res.send("Por favor ingrese un usuario y/o contraseña");
        }
    });

    //logout
    app.get('/logout', (req,res) => {
        req.session.destroy(()=>{
            res.redirect('/')
        })
    })

    //solicitud POST en el formulario clientes
    app.post('/form_cliente', async (req, res) => {
        const {id_client, name_client, surname_client, second_surname_client, birth_date_client, gender_client, email, address, tel, cel} = req.body;
        connection.query("INSERT INTO tb_clients SET ?", {
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
        }, async(error, results) => {
            if (error) {
                console.log(error);
            } else {
                res.render("form_cliente", {
                    position: req.session.position,
                    alert:true,
                    alertTitle: "Registrado",
                    alertMessage: "Registro Exitoso",
                    alertIcon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: "form_mascota"
                })
            }
        })
    })

    //
  app.post('/form_mascota', async (req, res) => {
    const {id_pet, id_client, chip, name_pet, last_name_pet, birth_date_pet, species, race, gender_pet, reproductive_status, deworming, vaccination, state_pet} = req.body;
        connection.query("INSERT INTO tb_pets SET ?", {
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
        }, async(error, results) => {
            if (error) {
                console.log(error);
            } else {
                res.render("form_mascota", {
                    position: req.session.position,
                    alert:true,
                    alertTitle: "Registrado",
                    alertMessage: "Registro Exitoso",
                    alertIcon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: "form_historial"
                })
            }
        })
    })
}




//-------------------------------------------------//----------------------------------------------------//
