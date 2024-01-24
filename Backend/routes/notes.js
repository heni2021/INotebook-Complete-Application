const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser.js')
const { body, validationResult } = require('express-validator');
const Notes = require('../models/Notes.js')

// Route 1: Get all the notes from the database.
router.get('/fetchNotes', fetchUser, async (request, response) => {
    const success = true;
    const notes = await Notes.find({ user: request.user.id });
    response.json({success, notes});
});

// Route 2: Add Notes to the particular user - Login Required
router.post('/addNotes', fetchUser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Minimum 5 characters required').isLength({ min: 5 }),
], async (request, response) => {
    let success = false;
    try {
        const { title, description, tag } = request.body;
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({success, 
                errors: errors.array()
            });
        }

        const note = new Notes({
            title: title,
            description: description,
            tag: tag,
            user: request.user.id
        });
        const savedNote = await note.save();
        success = true;
        response.json(success, savedNote);
    } catch (err) {
        console.error(err.message);
        success = false;
        response.status(400).send({success,error : "Internal Error Occured!"});
    }
});


// Route 3: Update an existing Note - login required
router.put('/updateNote/:id', fetchUser, async (req, res) => {
    let success = false;
    try {
        // Create a newNote object
        const { title, description, tag } = req.body;
        let newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        // Find the note to be updated and check ownership
        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send({success, error: "Not Found"}) }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send({success, error:"Not Allowed"});
        }

        // Update the note using findByIdAndUpdate
        note = await Notes.findByIdAndUpdate(
            req.params.id,
            { $set: newNote },
            { new: true } // Important: useFindAndModify should be set to false
        );
        success = true;
        res.json({success, note });
    } catch (error) {
        console.error(error.message);
        success = false
        res.status(500).send({success, error: "Internal Server Error"});
    }
});

// Route 4 : Delete Notes - Login Required
router.delete('/deleteNote/:id', fetchUser, async (request, response) => {
    let success = false;
    try {
        // Find the note to be updated and check ownership
        let note = await Notes.findById(request.params.id);
        if (!note) { return response.status(404).send({success, error: "Not Found"}) }

        if (note.user.toString() !== request.user.id) {
            return response.status(401).send({success, error: "Unauthorized Access"});
        }

        // Update the note using findByIdAndUpdate
        note = await Notes.findByIdAndDelete(request.params.id);
        success = true;
        response.send( {success,"message": "Success! Note with id - " + request.params.id + " has been deleted successfully!"});
    } catch (error) {
        console.error(error.message);
        success = false;
        res.status(500).send({success, error: "Internal Server Error"});
    }
});

module.exports = router;
