const express = require('express');
const cors = require('cors');
// require('../cron-jobs/checkContractsJob');
const mongoose = require('mongoose');
// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('../../swagger.json');
const { dbConnectiion } = require('../dataBase/config');
const user = require('../routes/userTaurasRotes');
const login = require('../routes/loginTaurasRoutes')
const employee = require('../routes/employeeTaurasRoutes')

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.paths = {
      auth: '/api/auth',
      employee:'/api/employee/',
      tauras: '/api/usertauras',
      
    };

    this.conectarDB();

    // Middlewares
    this.middlewares();

    // Rutas de mi aplicación
    this.routes();
  }

  async conectarDB() {
    try {
      await dbConnectiion();
      console.log('Base de datos conectada exitosamente');
    } catch (error) {
      console.error('Error al conectar a la base de datos:', error);
      process.exit(1);
    }
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    // this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }

  routes() {
    this.app.use(this.paths.auth, login);
    this.app.use(this.paths.employee, employee);
    // this.app.use( this.paths.buscar, require('../routes/buscar'));
    // this.app.use( this.paths.categorias, require('../routes/categorias'));
    // this.app.use( this.paths.productos, require('../routes/productos'));
    this.app.use(this.paths.tauras, user);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Servidor corriendo en puerto ${this.port}`);
    });
  }
}

module.exports = Server;
