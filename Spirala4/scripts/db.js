const Sequelize = require('sequelize');

const sequelize = new Sequelize('wt22', 'username', 'password', {
    host: 'localhost',
    dialect: 'mysql', 
    pool: {
        max: 5,
        min: 0, 
        acquire: 30000, 
        idle: 10000
    }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.nastavnik = require(`./nastavnik.js`) (sequelize);
db.predmet = require(`./predmet.js`) (sequelize);
db.student = require(`./student.js`) (sequelize);
db.prisustvo = require(`./prisustvo.js`) (sequelize);


db.nastavnik.hasMany(db.predmet, {as: 'predmetiNastavnik'});
db.student.hasMany(db.prisustvo, {as: 'prisustvaStudent'});




module.exports = db; 