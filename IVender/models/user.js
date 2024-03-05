const moment = require('moment');

module.exports = (sequelize, DataTypes) => {

    const Users = sequelize.define("Users", {
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
        strPassword: {
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
        iClass: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        strGroupID: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        iParentID: {
            type: DataTypes.INTEGER,
        },
        iCash: {
            type: DataTypes.DOUBLE(17,4),
            default: 0,
        },
        iPoint: {
            type: DataTypes.DOUBLE(17,4),
            default: 0,
        },
        iLoan: {
            type: DataTypes.INTEGER,
            default: 0,
        },
        fOdds: {
            type: DataTypes.FLOAT,
        },
        eState: {
            type:DataTypes.ENUM('NORMAL', 'NOTICE', 'BLOCK', 'STANDBY'),
        },
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

    return Users;
};