import Sequelize from 'sequelize';
import _ from 'lodash';
import config from './config';

let dbLogging;
if (config.env === 'test') {
    dbLogging = false;
} else {
    dbLogging = console.log;
}

const db = {};

// connect to postgres db
const sequelizeOptions = {
    dialect: 'postgres',
    port: config.postgres.port,
    host: config.postgres.host,
    logging: dbLogging,
};
if (config.postgres.sslEnabled) {
    sequelizeOptions.ssl = config.postgres.sslEnabled;
    if (config.postgres.sslCaCert) {
        sequelizeOptions.dialectOptions = {
            ssl: {
                ca: config.postgres.sslCaCert,
            },
        };
    }
}

const sequelize = new Sequelize(
    config.postgres.db,
    config.postgres.user,
    config.postgres.password,
    sequelizeOptions
);

const User = sequelize.import('../server/models/user.model');
const Device = sequelize.import('../server/models/device.model');
const Notification = sequelize.import('../server/models/notification.model');

User.hasMany(Device);
Device.hasMany(Notification);
Notification.belongsTo(Device);
Device.belongsTo(User);

db.User = User;
db.Device = Device;
db.Notification = Notification;

// assign the sequelize variables to the db object and returning the db.
module.exports = _.extend({
    sequelize,
    Sequelize,
}, db);
