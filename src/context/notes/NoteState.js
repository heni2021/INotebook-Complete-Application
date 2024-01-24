import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
    const initialNotes = [];
    const[notes, setNotes] = useState(initialNotes);

    const fetchUrl = process.env.REACT_APP_FETCH_NOTES_URL;
    // get all notes
    const getAllNotes = async() =>{
        const response = await fetch(fetchUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            }
        });
        const json = await response.json();
        setNotes(json.notes);
    }

    // Add a note
    const addNotesUrl = process.env.REACT_APP_ADD_NOTES_URL;
    const addNote = async (title, description, tag) => {
       // ToDo : API CALL
       // const json = await response.json();
       console.log("Adding a new note!");
       let note = {
           "title": title,
           "description": description,
           "tag": tag,
        };
        const response = await fetch(addNotesUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify(note)
        });
        if(response.status !== 400){
            console.log("Note Added Successfully");
            getAllNotes();
        }
        else{
            console.log("Internal Server Error");
        }
    }
    
    const deleteNoteUrl = process.env.REACT_APP_DELETE_NOTES_URL;
    // Delete a note
    const deleteNote = async(id) => {
        const response = await fetch(`${deleteNoteUrl}${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            }
        });
        const json = await response.json();
        console.log(json);
        console.log("Deleting a Note with "+id+" id");
        const newNotes = notes.filter((note) => {
            return note._id !== id;
        });
        setNotes(newNotes);
    }
    // edit a note
    const updateNoteUrl = process.env.REACT_APP_UPDATE_NOTES_URL;
    const editNote = async (id, title, description, tag) => {
        // API Call
        const response = await fetch(`${updateNoteUrl}${id}`,{
            method: 'PUT',
            headers: {
                'Content-Type' : 'application/json',
                'auth-token':localStorage.getItem('token')
            },
            body : JSON.stringify({title, description, tag})
        });
        const json = await response.json();
        console.log(json);
        let newNotes = JSON.parse(JSON.stringify(notes))
        // Logic to edit in client
        for (let index = 0; index < newNotes.length; index++) {
            const element = newNotes[index];
            if (element._id === id) {
                newNotes[index].title = title;
                newNotes[index].description = description;
                newNotes[index].tag = tag;
                break;
            }
        }
        setNotes(newNotes);
    }
    return (
            <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getAllNotes, setNotes }}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;