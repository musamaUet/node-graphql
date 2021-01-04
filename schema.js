const { gql } = require('apollo-server-express');
const Movie = require('./models/movie').Movies;

const typeDefs = gql `

    type Movie {
        id: ID!
        name: String!
        producer: String!
        rating: Float!
    }

    type Query {
        getMovies: [Movie]
        getMovie(id: ID!): Movie
    }

    type Mutation {
        addMovie(name: String!, producer: String!, rating: Float!): Movie
        updateMovie(name: String!, producer: String!, rating: Float!): Movie
        deleteMovie(id: ID!): Movie
    }
`
const resolvers = {
    Query: {
        getMovie: async (parent, args) => {
            return await Movie.findById({ id: args.id });
        },
        getMovies: (parent, args) => {
            return Movie.find({});
        }
    },
    Mutation: {
        addMovie: async (parent, args) => {
            console.log('args', args);
            let Movies = await new Movie({
                name: args.name,
                producer: args.producer,
                rating: args.rating,
            });
            console.log('Movie', Movies);
            return await Movies.save();
        },
        updateMovie: async (parent, args) => {
            console.log('updateMovie', args);
            if (!args.id) return;
            return Movie.findByIdAndUpdate({ _id: args.id }, {
                $set: {
                    name: args.name,
                    producer: args.producer,
                    rating: args.rating
                }
            }, { new: true }, (err, Movie) => {
                if (err) {
                    console.log('Something went wrong when updating the movie');
                }
            });
        },
        deleteMovie: async (parent, args) => {
            console.log('deleteMovie', args);
            const deletedMovie = await Movie.findByIdAndRemove({ _id: args.id });
            console.log('deletedMovie', deletedMovie);
            return deletedMovie;
        }
    }
}

module.exports = {
    typeDefs,
    resolvers
}