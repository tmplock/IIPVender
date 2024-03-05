const moment = require('moment');

module.exports = (sequelize, DataTypes, strTableName) => {

    const Transactions = sequelize.define(strTableName, {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        strAgentCode: {
            type: DataTypes.STRING,
        },
        strID: {
            type: DataTypes.STRING,
        },
        eGameType: {
            type:DataTypes.ENUM('LIVE', 'SM'),
        },
        strVender: {
            type: DataTypes.STRING,
        },
        iGameCode:{
            type:DataTypes.INTEGER,
        },
        strGameID: {
            type: DataTypes.STRING,
        },
        strRoundID: {
            type: DataTypes.STRING,
        },
        strAmount: {
            type: DataTypes.STRING,
        },
        strTarget: {
            type: DataTypes.STRING,
        },
        strDesc: {
            type: DataTypes.STRING,
        },
        strTransactionID: {
            type: DataTypes.STRING,
        }, 
        eType: {
            type:DataTypes.ENUM('BET', 'WIN', 'REFUND'),
        },
        eState: {
            type:DataTypes.ENUM('COMPLETE', 'PENDING', 'EXCEPTION'),
        },
        createdAt:{
            type:DataTypes.DATE,
            get() {
                return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD hh:mm:ss');
            }
        },
        updatedAt:{
            type:DataTypes.DATE,
            get() {
                return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD hh:mm:ss');
            }
        },
    });

    return Transactions;
};