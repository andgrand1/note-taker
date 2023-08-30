const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files
app.use(express.static('public'));

// HTML routes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

// API routes
app.get('/api/notes', (req, res) => {
  console.log('API request received');
  const notes = JSON.parse(fs.readFileSync('db/db.json', 'utf-8'));
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  console.log('Notes:', notes); 

  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const newNote = {
    title: req.body.title,
    text: req.body.text,
  };
  const notes = JSON.parse(fs.readFileSync('db/db.json', 'utf-8'));

console.log('testing');
console.log(newNote);

  notes.push(newNote);
  fs.writeFileSync('db/db.json', JSON.stringify(notes));

  res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
  const notes = JSON.parse(fs.readFileSync('db/db.json', 'utf-8'));
  const idToDelete = parseInt(req.params.id); // Convert id to integer
  // Add code to remove the note with the specified id from 'notes' array

  // Write updated notes back to the file
  fs.writeFileSync('./db/db.json', JSON.stringify(notes, null, 2));

  res.sendStatus(204); // Send a successful status
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
