const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const schema = require('./schema');
const cors = require('cors');

const { ApolloServer } = require('apollo-server-express');

const url = "mongodb://localhost:27017/moviesdb";
const connect = mongoose.connect(url, { useNewUrlParser: true });
connect.then((db) => {
    console.log('Connected correctly to server!');
}, (err) => {
    console.log(err);
});

const server = new ApolloServer({
    typeDefs:schema.typeDefs,
    resolvers: schema.resolvers
});

const app = express();

app.use(bodyParser.json());
app.use('*', cors());

server.applyMiddleware({ app });
const port = process.env.port || 5000;
app.listen({port: port}, () => {
    console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`);
});
