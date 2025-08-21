const express = require('express')
const app = express()
app.use(express.json())

app.get('/', (request, response) => {
  response.send('Hello, backend is running!');
});

let lists = [
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
    id: "1", // <-- Change to string
    content: "HTML is easy",
    important: true 
  },
  {
    id: "2", // <-- Change to string
    content: "Browser can execute only Javascript",
    important: false
  }, 
  {
    id: "3", // <-- Change to string
    content : "GET and POST are the importan methods of HTTP Protocol",
    important : true
  }
]

app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id; // It's already a string, like "3"
  const note = notes.find(note => note.id === id); // "3" === "3" works!
  
  if(note) {
    response.json(note);
  } else {
    response.status(404).end(); // A simple .end() is common for 404
  }
});
 
app.get('/api/notes',(request,response) =>{
  response.json(notes)
})

app.get('/api/notes/:id',(request,response)=> {
  const id = Number(request.params.id);
  const note = notes.find(note=> note.id === id);
  if(note){
    response.json(note);
  }
  else{
    response.status(404).json({ error: 'content missing' });
  }
} 
);

const generateId = () => {
   const maxId = notes.length > 0 
   ? Math.max(...notes.map(n=> Number(n.id))) : 0
   return String(maxId + 1)
}

app.post('/api/notes', (request, response)=> {
  const body = request.body
  if (!body.content){
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  }

  notes = notes.concat(note)
  response.json(note)
})

app.post('/api/notes', (request,response)=>{
const maxId = notes.length > 0 ? Math.max(...notes.map(n=> Number(n.id))):0
  const note = request.body
  note.id = String(maxId + 1)
  notes = notes.concat(note)
  response.json(note)
})

app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id; // It's already a string
  notes = notes.filter(note => note.id !== id); // "1" !== "3" works!
  response.status(204).end();
});

app.get('/api/persons/5',(request,response)=> {
  response.status(404).send(`looks like there is no data for the given id`)
})

app.get('/api/persons', (request,response)=> {
  response.json(lists)
})
app.get('/info',(request,response)=>{
  const date = new Date();
  response.send( `<p>Phonebook has info for 2 people</p>
     <p>${date}</p>`)
})
const PORT= 3001
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})