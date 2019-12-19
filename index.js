const express = require('express')
const app = express()
const bodyParser = require('body-parser')
var morgan = require('morgan')
const cors = require('cors')

app.use(bodyParser.json())

app.use(express.static('build'))

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
app.use(requestLogger)

app.use(cors())

app.use(morgan('tiny'))

let persons = [
    {
      id: 1,
      name: "Arto Hellas",
      number: "225827922"
    },
    {
      id: 2,
      name: "Anna Lunde",
      number: "201435435"
    }
  ]

app.get('/', (req, res) => {
  res.send('<h1>Hello Everybody!</h1>')
})

app.get('/info',(req,res)=> {
  const number = persons.length
  const date = new Date()
  res.send(`<h1>Phonebook has info for ${number} people</h1> <h2>${date}</h2> `)
})

 
app.get('/api/persons', (req, res) => {
  res.json(persons)
  res.status(202).end()
})

app.get('/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
  })

 
app.post('/api/persons', (request, response) => {
    const date = new Date()
    morgan.token('type',date, function (req, res) { return req.headers['content-type'] })
    const person = request.body
    if (persons.filter(p => p.name === person.name).length){
      response.send({ error: 'name must be unique' })
      response.status(404).end()
    }

    if (person.name && person.number) {
      person.id = Math.floor(Math.random()*1000)
      persons = persons.concat(person)
      response.json(person)
    }
    else {
      response.send('Person must contain a name and number').status(404).end()
    }
    
  })


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
  app.use(unknownEndpoint) 


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})