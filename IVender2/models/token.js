const moment = require('moment');

module.exports = (sequelize, DataTypes) => {

    const Tokens = sequelize.define("Tokens", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        strID: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        strLaunchToken: {
            type: DataTypes.STRING,
        },
        strToken: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        strAgentCode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        strSecretCode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        strCallbackURL: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // ezugiToken: {
        //     type: DataTypes.STRING,
        // },
        // iAuth: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        // },
        createdAt: {
            type: DataTypes.DATE,
            get() {
                return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        updatedAt:{
            type:DataTypes.DATE,
            get() {
                return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
            }
        },
    });

    return Tokens;
};