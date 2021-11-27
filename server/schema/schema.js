const graphql = require("graphql");
const _=require('lodash')

const Book = require('../models/book')
const Author = require('../models/author')

const {GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLID} =  graphql

//dummy data
// var books = [
//     {name:'Name of the wind',genre:'Fantasy',id:'1',authorId:'1'},
//     {name:'The final empire',genre:'Fantasy',id:'2',authorId:'2'},
//     {name:'The Long Earth',genre:'Sci-Fi',id:'3',authorId:'3'},
//     {name:'The Hero of Ages',genre:'Fantasy',id:'4',authorId:'2'},
//     {name:'The Color of Magic',genre:'Fantasy',id:'5',authorId:'3'},
//     {name:'The Light Fantasy',genre:'Fantasy',id:'6',authorId:'3'},
// ]

// var authors = [
//     {name:'Patrick Rothfuss',age:44,id:'1'},
//     {name:'Brandon Sanderson',age:42,id:'2'},
//     {name:'Terry Pratchett',age:66,id:'3'},
// ]

const BookType = new GraphQLObjectType({
    name: "Book",
    //fields need to be a function as when diff types interact 
    //to let them know about each other object is needed
    fields:()=> ({
        id : {
            type: GraphQLID
        },
        name : {
            type: GraphQLString
        },
        genre : {
            type: GraphQLString
        },
        author : {
            type:AuthorType,
            resolve(parent,args){
                //parent will have all properties of books(parent request)
                console.log(parent)
                //look into authors array and find the record whose id matches with
                //authorId  of books(parent request)
                // return _.find(authors,{id: parent.authorId})
                return Author.findById(parent.authorId)
            }
        }

    })
})

const AuthorType = new GraphQLObjectType({
    name: "Author",
    fields:()=> ({
        id : {
            type: GraphQLID
        },
        name : {
            type: GraphQLString
        },
        age : {
            type: GraphQLInt

        },
        books:{
            type : new GraphQLList(BookType), 
             //only BookType would have meant single book  but an author would be having list of books 
            resolve(parent,args){
                // return _.filter(books,{authorId:parent.id})
                return Book.find({authorId:parent.id})
            }
        }

    })
})

//making root query
//how we'll be jumping in graph
//using GraphQLNonNull so as not to allow null entries
const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields:{
        //we don't worry about order here
        book:{
            //we wan't user to pass in query what book they want 
            type:BookType,
            args:{id:{type:GraphQLID}},
            //resolve function is fired when args are receieved
            
            resolve(parent,args){
                //code to get data from db/other source
               console.log(typeof(args.id))   //Id will always get converted to string in JS
            //    return  _.find(books,{id:args.id})
            return Book.findById(args.id)
            }
        },

        author: {
            type:AuthorType,
            args: {id: {type:GraphQLID}},
            resolve(parent,args){
                // return  _.find(authors,{id:args.id})
                return Author.findById(args.id)
            }
        },

        books:{
            type: new GraphQLList(BookType),
            resolve(parent,args){
                // return books
                return Book.find({})

            }
        },

        authors:{
            type: new GraphQLList(AuthorType),
            resolve(parent,args){
                // return authors
                return Author.find({})
            }
        }
    }
})

//adding mutation or cud prototype
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args:{
                name: {type:new GraphQLNonNull(GraphQLString)},
                age: {type:new GraphQLNonNull(GraphQLInt)},

            },
            resolve(parent,args){
                let author = new Author({
                    name:args.name,
                    age:args.age
                });
                return author.save() //return is required otherwise record will be saved but null would be returned
            }

        },
        addBook: {
            type: BookType,
            args: {
                name: {type:new GraphQLNonNull(GraphQLString)},
                genre: {type:new GraphQLNonNull(GraphQLString)},
                authorId:{type:new GraphQLNonNull(GraphQLID)},
            },
            resolve(parent,args){
                let book = new Book({
                    name:args.name,
                    genre:args.genre,
                    authorId:args.authorId
                });
                return book.save()
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query:RootQuery,
    mutation:Mutation
})