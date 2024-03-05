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
        let iAmount = 0;

        for (var i = 0; i < Math.floor(Math.random() * 100) + 1; i++) {
          let iAddMoney = (Math.floor(Math.random() * 3) + 1) * 10000;
          dummyJSON.push({
            strID: user.strID,
            strName: "Bill Gates",
            strGroupID: user.strGroupID,
            strAccountOwner: "Bill Gates",
            strBankName: "Citi Bank",
            strAccountNumber: "110-223-3233",
            iPreviousCash: iAmount,
            iAmount: iAddMoney,
            eType: 'INPUT',
            eState: 'COMPLETE',
            completedAt: new Date().addDays(i).toISOString().replace(/T/, ' ').replace(/\..+/, ''),
            createdAt: new Date().addDays(i).toISOString().replace(/T/, ' ').replace(/\..+/, ''),
            updatedAt: new Date().addDays(i).toISOString().replace(/T/, ' ').replace(/\..+/, ''),
          });
          iAmount += iAddMoney;
        }

        queryInterface.sequelize.query(
          `UPDATE Users set iCash = '${iAmount}' where strID = '${user.strID}'`, {
          type: queryInterface.sequelize.QueryTypes.UPDATE
        });
      }

    });

    await queryInterface.bulkInsert('Inouts', dummyJSON, {});

  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Inouts', null, {});
  }
};
