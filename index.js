const express = require('express')
const morgan = require('morgan')
const app = express() 

morgan.token('body', function getBody(request) {
  return JSON.stringify(request.body) 
})

app.use(express.json())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello world!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const people_number = persons.length
  const date = new Date().toUTCString()

  // Only do GMT time, not GMT + 2.
  response.send(
    `<p>Phonebook has info for ${people_number} people.</p>
    <p>${date}</p>`
  )
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  // It seems to work, but the localhost does not change
  // because the website gets reset.
  response.status(204).end()
})

// Some stupid bug is happening here.
const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(person => person.id))
    : 0
  // Not sure if this is big enough but okay.
  // The problem asks us to use Math.random()
  return Math.floor(Math.random() * maxId ** 2) + maxId
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  var cond = true

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing'
    })
  }
  
  // I think we do some forEach here.
  persons.forEach(person => {
    if (JSON.stringify(person.name) === JSON.stringify(body.name)) {
      cond = false
      return response.status(400).json({
        error: 'name must be unique'
      })
    }
  })

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  //console.log("fuck id", generateId())

  persons = persons.concat(person)
  if (cond) {
    response.json(person)
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)