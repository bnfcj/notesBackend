const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
const notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];
app.get("/api/notes", (req, res) => {
  res.status(200).json(notes);
});
app.get("/api/notes/:id", (req, res) => {
  const note = notes.find((n) => n.id === Number(req.params.id));
  if (!note) {
    res.status(404).send("Person not found");
  } else {
    res.status(200).json(note);
  }
});
app.post("/api/notes", (req, res) => {
  const { content, important = true } = req.body;
  if (!content || typeof important !== "boolean") {
    res.status(400).send("Some fields are missing");
    return;
  }
  if (notes.length === 0) {
    const newNote = { content, important, id: 1 };
    notes.push(newNote);
    res.status(200).send(newNote);
  } else {
    const id = notes[notes.length - 1].id + 1;
    const newNote = { content, important, id };
    notes.push(newNote);
    res.status(200).send(newNote);
  }
});
app.delete("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  let foundIndex = -1;
  for (let i = 0; i < notes.length; i++) {
    if (notes[i].id === id) {
      foundIndex = i;
      break;
    }
  }
  if (foundIndex !== -1) {
    notes.splice(foundIndex, 1);

    res.status(200).send(notes);
  } else {
    res.status(404).send("Could not find id" + id);
  }
});
app.patch("/api/notes/:id", (req, res) => {
  const { important } = req.body;
  const id = Number(req.params.id);
  let note = notes.find((n, i) => {
    if (n.id === id) {
      notes[i].important = important;
      return true;
    } else {
      return false;
    }
  });

  if (typeof important === "boolean" && note) {
    res.status(200).send(note);
  } else {
    res.status(404).send("Note not found");
  }
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
