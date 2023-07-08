const  authResolver = require('./auth');
const  bookingResolver = require('./booking');
const  eventResolver = require('./events');

const rootResolvers = {
    ...authResolver,
    ...bookingResolver,
    ...eventResolver
};

module.exports = rootResolvers;