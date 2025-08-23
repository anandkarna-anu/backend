const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.json())

const cors= require('cors')

// It's better to allow multiple origins for different environments (e.g., production and local development)
const allowedOrigins = [
  'https://notesapp-six-nu.vercel.app', // Your production frontend
  'http://localhost:3000', // A common port for local development
  'http://localhost:5173'
];
const corsOptions = {
  origin: allowedOrigins
}
app.use(cors(corsOptions))

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
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

let notes = [
  {
    "id": "1",
    "content": "HTML is easy",
    "important": true 
  },
  {
    "id": "2",
    "content": "Browser can execute only Javascript",
    "important": false
  }, 
  {
    "id": "3",
    "content" : "GET and POST are the important methods of HTTP Protocol",
    "important" : true
  }
]

app.get('/', (request, response) => {
  response.send('Hello, backend is running!');
});

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const date = new Date();
    response.send(
    `<p>Phonebook has info for ${persons.length} people</p>
     <p>${date}</p>`
  )
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).json({ error: `given id ${id} has no data` })
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

const generatePersonId = () => {
  const maxId = persons.length > 0
   ? Math.max(...persons.map(person => Number(person.id))) 
   : 0
   return String(maxId + 1)
} 

app.post('/api/persons', (request, response) => {
  const body = request.body;

  // Your validation logic here was already very good!
  if (!body.name) {
    return response.status(400).json({ error: "name is missing" });
  }
  if (!body.number) {
    return response.status(400).json({ error: "number is missing" });
  }
  if (persons.find(p => p.name === body.name)) {
    return response.status(400).json({ error: "name must be unique" });
  }

  const person = {
    id: generatePersonId(),
    name: body.name,
    number: body.number
  };
  persons = persons.concat(person);
  response.json(person);
});



app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id;
  const note = notes.find(note => note.id === id);
  
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});
 
const generateNoteId = () => {
   const maxId = notes.length > 0 
   ? Math.max(...notes.map(n=> Number(n.id))) : 0
   return String(maxId + 1)
}

app.post('/api/notes', (request, response) => {
  const body = request.body
  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = {
    id: generateNoteId(),
    content: body.content,
    important: body.important || false,
  }

  notes = notes.concat(note)
  response.json(note)
})

app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id;
  notes = notes.filter(note => note.id !== id);
  response.status(204).end();
});


const unknownEndPoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" })
}
app.use(unknownEndPoint)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
