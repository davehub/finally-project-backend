// models/index.js
module.exports = {
    User: require('./User'), // User.js contient le schema et model
    Equipment: require('./Equipment'),
    Software: require('./Software'),
    Assignment: require('./Assignment'),
    Maintenance: require('./Maintenance'),
    SystemUser: require('./SystemUser')
};