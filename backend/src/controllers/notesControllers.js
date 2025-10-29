import Note from "../model/Note.js";
import mongoose from "mongoose"; // <-- **FIX 1:** Import mongoose

export async function getAllNotes(_, res) {
  try {
    const notes = await Note.find().sort({ createdAt: -1 }); // newest first
    // **FIX 2:** Add return (good practice)
    return res.status(200).json(notes);
  } catch (error) {
    console.error("Error in getallNotes controller", error);
    // **FIX 3:** Add return
    return res.status(500).json({ message: "Internal server issue!" });
  }
}

export async function createNote(req, res) {
  try {
    const { title, content } = req.body;
    
    // Basic validation
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required." });
    }

    const note = new Note({ title, content });
    const savedNote = await note.save();
    
    // **FIX 4:** Add return (good practice)
    return res.status(201).json(savedNote);
  } catch (error) {
    console.error("Error in crateNotes controller", error);
    // **FIX 5:** Corrected error sending and added return
    return res.status(500).json({ message: "Internal server issue!" });
  }
}

export async function getNoteById(req, res) {
  try {
    const { id } = req.params; 

    // --- **FIX 6:** ADD ID VALIDATION ---
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Note ID format" });
    }
    // ---------------------------------

    const note = await Note.findById(id);
    
    if (!note) {
      // **FIX 7:** Add return
      return res.status(404).json({ message: "Note not found!" });
    }
    
    // **FIX 8:** Add return
    return res.json(note);

  } catch (error) {
    console.error("Error in getNoteById controller", error);
    // **FIX 9:** Add return
    return res.status(500).json({ message: "Internal server issue!" });
  }
}

export async function updateNote(req, res) {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    // --- **FIX 10:** ADD ID VALIDATION ---
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Note ID format" });
    }
    // ----------------------------------

    // Basic validation
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required." });
    }

    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { title, content },
      {
        new: true, // This ensures you get the updated document back
        runValidators: true, // This ensures model validations are run
      }
    );

    // **FIX 11:** Corrected variable name
    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found" });
    }
    
    // **FIX 12:** Send back the updated note
    return res.status(200).json(updatedNote);

  } catch (error) {
    console.error("Error in updateNotes controller", error);
    // **FIX 13:** Corrected error sending and added return
    return res.status(500).json({ message: "Internal server issue!" });
  }
}

export async function deleteNote(req, res) {
  try {
    const { id } = req.params;

    // --- **FIX 14:** ADD ID VALIDATION ---
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Note ID format" });
    }
    // ---------------------------------

    // **FIX 15:** Cleaned up delete logic
    const deletedNote = await Note.findByIdAndDelete(id);

    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    }
    
    // **FIX 16:** Send back a success message and the ID of the deleted note
    return res.status(200).json({ message: "Note deleted successfully", _id: deletedNote._id });

  } catch (error) {
    console.error("Error in deleteNotes controller", error);
    // **FIX 17:** Corrected error sending and added return
    return res.status(500).json({ message: "Internal server issue!" });
  }
}