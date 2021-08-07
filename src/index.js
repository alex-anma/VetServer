const app = require('./config/server');
const connection = require('./config/db');

require('./app/routes/rutas')(app);

//escuchar el servidor en el puerto 3000
app.listen(app.get('port'), () => {
    console.log( `servidor en el puerto: http://localhost:${app.get('port')}`)
});
