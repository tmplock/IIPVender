'use strict';

let returnID = 1;

var createUser = async (queryInterface, strID, iClass, strGroupID, iParentID) =>{
  let obj = {
    strID: strID,
    strPassword: strID,
    strNickname: strID,
    strMobile: "010-3300-0033",
    strBankname: "KB",
    strBankAccount: "099-21-0560-770",
    strBankOwner: "David",
    strBankPassword: "1234",
    iClass: iClass,
    strGroupID: strGroupID,
    iParentID: iParentID,
    iCash: 0,
    iLoan: 0,
    fBaccaratR: 0,
    fSlotR: 0,
    fUnderOverR: 0,
    createdAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
    updatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
  }
  await queryInterface.bulkInsert('Users', [obj], {});
  return returnID++;
};

module.exports = {
  async up (queryInterface, Sequelize) {

    
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    let admin = await createUser(queryInterface, "admin", 3, "0", null);
    
    let vadmin1 = await createUser(queryInterface, "vadmin1", 4, "001", admin);
    let vadmin2 = await createUser(queryInterface, "vadmin2", 4, "002", admin);
    let vadmin3 = await createUser(queryInterface, "vadmin3", 4, "003", admin);
    
    let agent1 = await createUser(queryInterface, "agent1", 5, "00101", vadmin1);
    await createUser(queryInterface, "agent2", 5, "00102", vadmin1);
    await createUser(queryInterface, "agent3", 5, "00103", vadmin1);
    await createUser(queryInterface, "agent4", 5, "00104", vadmin1);

    await createUser(queryInterface, "agent5", 5, "00201", vadmin2);
    let agent6 = await createUser(queryInterface, "agent6", 5, "00202", vadmin2);
    await createUser(queryInterface, "agent7", 5, "00203", vadmin2);
    await createUser(queryInterface, "agent8", 5, "00204", vadmin2);

    await createUser(queryInterface, "agent9", 5, "00301", vadmin3);
    await createUser(queryInterface, "agent10", 5, "00302", vadmin3);
    let agent7 = await createUser(queryInterface, "agent11", 5, "00303", vadmin3);
    await createUser(queryInterface, "agent12", 5, "00304", vadmin3);
    
    let shop1 = await createUser(queryInterface, "shop1", 6, "0010101", agent1);
    await createUser(queryInterface, "shop2", 6, "0010102", agent1);
    let shop3 = await createUser(queryInterface, "shop3", 6, "0010103", agent1);
    await createUser(queryInterface, "shop4", 6, "0010104", agent1);

    await createUser(queryInterface, "shop5", 6, "0020201", agent6);
    await createUser(queryInterface, "shop6", 6, "0020202", agent6);
    let shop7 = await createUser(queryInterface, "shop7", 6, "0020203", agent6);
    await createUser(queryInterface, "shop8", 6, "0020204", agent6);

    await createUser(queryInterface, "shop9", 6, "0030301", agent7);
    await createUser(queryInterface, "shop10", 6, "0030302", agent7);
    await createUser(queryInterface, "shop11", 6, "0030303", agent7);
    let shop12 = await createUser(queryInterface, "shop12", 6, "0030304", agent7);

    await createUser(queryInterface, "user1", 7, "001010101", shop1);
    await createUser(queryInterface, "user2", 7, "001010102", shop1);
    await createUser(queryInterface, "user3", 7, "001010103", shop1);
    await createUser(queryInterface, "user4", 7, "001010104", shop1);
    
    await createUser(queryInterface, "user5", 7, "001010301", shop3);
    await createUser(queryInterface, "user6", 7, "001010302", shop3);
    await createUser(queryInterface, "user7", 7, "001010303", shop3);
    await createUser(queryInterface, "user8", 7, "001010304", shop3);

    await createUser(queryInterface, "user9", 7, "002020301", shop7);
    await createUser(queryInterface, "user10", 7, "002020302", shop7);
    await createUser(queryInterface, "user11", 7, "002020303", shop7);
    await createUser(queryInterface, "user12", 7, "002020304", shop7);

    await createUser(queryInterface, "user13", 7, "003030401", shop12);
    await createUser(queryInterface, "user14", 7, "003030402", shop12);
    await createUser(queryInterface, "user15", 7, "003030403", shop12);
    await createUser(queryInterface, "user16", 7, "003030404", shop12);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', null, {});
  }
};
