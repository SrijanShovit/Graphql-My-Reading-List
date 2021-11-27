const express = require('express')
const {graphqlHTTP} = require('express-graphql')
const schema = require('./schema/schema')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

//allow cross origin requests
app.use(cors())

//connect to database
mongoose.connect('mongodb://localhost:27017/gql');
mongoose.connection.once('open', () =>{
    console.log('Connected to database')
})

//middleware
app.use('/graphql',graphqlHTTP({
    //express-graphql needs a schema of graph of our data
    schema,
    graphiql:true   //use graphiql tool when we hit this endpoint
}))

app.listen(4000,()=>{
    console.log('listening on port 4000')
})

