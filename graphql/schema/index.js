const { buildSchema } = require("graphql");
const eventShema = require('./event');
const bookEvent = require('./book');

module.exports = buildSchema(`
${eventShema}
${bookEvent}
type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
}

type User {
  _id: ID!
  email: String!
  password: String
  createdEvents: [Event!]
}


input UserInput {
  email: String!
  password: String!
}

type RootQuery {
    events: [Event!]
    bookings: [Booking!]!
    login(email: String!, password: String!): AuthData!
}
type RootMutation {
    createEvent(eventInput: EventInput): Event
    createUser(userInput: UserInput): User
    bookEvent(eventId: ID!): Booking!
    cancelBooking(bookingId: ID!): Event!
}
schema {
    query: RootQuery
    mutation: RootMutation
}
`);
