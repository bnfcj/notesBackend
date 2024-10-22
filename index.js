require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Note = require("./models/note.js");
const app = express();
app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

app.get("/api/notes", (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes);
  });
});
app.get("/api/notes/:id", (req, res) => {
  Note.findById(req.params.id).then((note) => {
    res.json(note);
  });
});

app.post("/api/notes", (req, res) => {
  const body = req.body;

  if (body.content === undefined) {
    return response.status(400).json({ error: "content missing" });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note.save().then((savedNote) => {
    res.json(savedNote);
  });
});
app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  Note.findByIdAndDelete(id)
    .then((n) => {
      if (n) res.status(200).json("Deleted note");
      else res.status(404).json({ error: "Unable to delete note" });
    })
    .catch((err) => {
      console.error(err);

      res.status(500).send("internal server error");
    });
});
app.patch("/api/notes/:id", (req, res) => {
  Note.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((updated) => {
      if (updated) {
        res.status(200).json(updated);
      } else {
        res.status(404).json({ error: "Unable to update note" });
      }
    })
    .catch((err) => console.error(err));
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
