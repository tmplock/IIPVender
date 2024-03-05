const moment = require('moment');

module.exports = (sequelize, DataTypes) => {

    const Inouts = sequelize.define("Inouts", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        strRequestNickname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        strResponseNickname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        strGroupID: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        eType: {
            type:DataTypes.ENUM('INPUT', 'OUTPUT', 'GIVE', 'TAKE'),
        },
        eState: {
            type:DataTypes.ENUM('STANDBY', 'COMPLETE', 'CANCEL', 'NONE'),
        },
        iAmount: {
            type: DataTypes.INTEGER,
            allowNull: false,
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

    return Inouts;
};