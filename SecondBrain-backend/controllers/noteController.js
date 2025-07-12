
import Note from '../models/Note.js';
import logActivity from '../utils/logActivity.js';


//getnotes
export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id });
    res.json(notes);
  } catch {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
};


// createNote
export const createNote = async (req, res) => {
  try {
    const note = new Note({ ...req.body, user: req.user._id });
    await note.save();

    // Log user activity
    // await logActivity(
    //   req.user._id,
    //   'note_created',
    //   `Created note: ${note.title}`,
    //   note._id
    // );
    await logActivity(req.user._id, 'note_created', `Created note: ${note.title}`, note._id);


    // Return the full saved note, including _id
    res.status(201).json(note);
  } catch (error) {
    console.error("Create Note Error:", error); 
    res.status(500).json({ error: 'Failed to create note' });
  }
};



//updatenote
export const updateNote = async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  } catch {
    res.status(500).json({ error: 'Failed to update note' });
  }
};


//deletenote
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json({ message: 'Note deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete note' });
  }
};



//  Get Single Note
export const getSingleNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json(note);
  } catch (err) {
    console.error("Fetch single note error:", err);
    res.status(500).json({ error: "Failed to fetch note" });
  }
};

