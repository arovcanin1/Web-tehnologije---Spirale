const Sequelize = require("sequelize");
const sequelize = require("./db.js");


module.exports = function (sequelize, DataTypes) {
    const Prisustvo = sequelize.define('Prisustvo', {
        sedmica: Sequelize.INTEGER,
        predavanja: Sequelize.INTEGER,
        vjezbe: Sequelize.INTEGER,
        index: Sequelize.INTEGER
    });

    return Prisustvo;
}