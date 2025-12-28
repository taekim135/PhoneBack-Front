const express = require("express") // import express library
const morgan = require("morgan") // HTTP request logger middleware for node.js
const app = express() // express application instance (object)
app.use(express.json()) // allows auto parsing of json @ incoming request - Content-Type: application/json
app.use(express.static('dist')) //grab static files from frontend


// token = placeholder
// Define what :body should be replaced with 
morgan.token('body', (request) => {
    if (request.method === 'POST') {
        return JSON.stringify(request.body)
  }
})


app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))


// import, create, config



let contacts = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


// app.get("/", (request,response)=>{
//     response.send("working")
// })


app.get("/api/persons", (request,response) =>{
    response.json(contacts)
})

app.get("/api/persons/:id",(request,response) =>{
    const target = request.params.id
    const contact = contacts.find(person=> person.id === target)

    return contact ? response.json(contact) : response.status(204).end()
})


app.get("/api/info", (request,response) =>{
    const timeStamp = new Date().toString()
    const amount = contacts.length
    
    return response.send(`
            <p> Phonebook has info for ${amount} people </p>
            <p> ${timeStamp} </p>
        `)
})


app.delete("/api/persons/:id", (request,response)=>{
    const targetID = request.params.id
    const out = contacts.find(person => person.id === targetID)
    
    if (!out){
        return response.status(204).end()
    }

    contacts = contacts.filter(person => person.id !== targetID)
})


app.post("/api/persons", (request, response) =>{
    const details = request.body
    const id = Math.random()

    if (!details || details.num == "" || details.name == "") {
        return response.status(400).json({
            "error": "Missing fields"
        }).end()
    }else if(contacts.find(person => person.name === details.name)){
        return response.status(400).json({
            "error": "Contact already exists "
        }).end()
    }

   //console.log(newPerson);

    const newPerson = {
        "id": id,
        "name": details.name, 
        "number": details.number
    }

    contacts = contacts.concat(newPerson)

    console.log('new contact added');
    response.json(newPerson)
})



const port = 3001
app.listen(port, ()=>{
    console.log(`Server started on http://localhost:${port}`);
})