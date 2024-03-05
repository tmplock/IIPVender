'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

     Date.prototype.addDays = function (days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    }

    var dummyJSON = [];

    await queryInterface.sequelize.query(
      'SELECT * FROM Users WHERE iClass=7', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    }).then(users => {
      for (let user of users) {
        // console.log(user);

        for (var i = 0; i < Math.floor(Math.random() * 5) + 1; i++) {
          let iBettingMoney = 10000;
          if (user.iCash < iBettingMoney) {
            break;
          }

          dummyJSON.push({
            strID: user.strID,
            iPreviousCash: user.iCash,
            iGameCode: 0,
            iBetting: iBettingMoney,
            iWin: 0,
            iRolling: 1000,
            iRollingUser: 300,
            iRollingShop: 200,
            iRollingAgent: 200,
            iRollingVAdmin: 200,
            iRollingAdmin: 100,
            iTarget: 0,
            strGroupID: user.strGroupID,
            iComplete: 1,
            fRollingUser: 3,
            fRollingShop: 2,
            fRollingAgent: 2,
            fRollingVAdmin: 2,
            fRollingAdmin: 1,
            createdAt: new Date().addDays(i).toISOString().replace(/T/, ' ').replace(/\..+/, ''),
            updatedAt: new Date().addDays(i).toISOString().replace(/T/, ' ').replace(/\..+/, ''),
          });
          user.iCash -= iBettingMoney;
        }

        queryInterface.sequelize.query(
          `UPDATE Users set iCash = '${user.iCash}' where strID = '${user.strID}'`, {
          type: queryInterface.sequelize.QueryTypes.UPDATE
        });
      }

    });

    await queryInterface.bulkInsert('BettingRecords', dummyJSON, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('BettingRecords', null, {});
  }
};
