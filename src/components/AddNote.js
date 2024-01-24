import React, { useContext, useState } from 'react'
import noteContext from '../context/notes/noteContext';

const AddNote = (props) => {
    const context = useContext(noteContext);
    const { addNote } = context;
    const {showAlert} = props;
    const[note, setNote]  = useState({
        title: "",
        description: "",
        tag: ""
    })
    const addNewNote = (e) => {
        e.preventDefault();
        addNote(note.title, note.description, "default");
        showAlert("Note Added Successfully","success");
        setNote({ title: "", description: "", tag: "" });
    }

    const handleChange = (e) => {
        // ...note - mtlb jo bhi note hai voh to rhe pr nayi values add ho jye
        setNote({
            ...note, [e.target.name]: e.target.value
        })
    }
  return (
      <div className='container my-3'>
          <h1>Add a Note</h1>
          <form className='my-3'>
              <div className="mb-3">
                  <label htmlFor="title" className="form-label">Title</label>
                  <input type="text" className="form-control" id="title" name='title' aria-describedby="emailHelp" onChange={handleChange} minLength={5} required />
              </div>
              <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <input type="text" className="form-control" id="description" name='description' onChange={handleChange} minLength={5} required />
              </div>
              <div className="mb-3">
                  <label htmlFor="tag" className="form-label">Tag</label>
                  <input type="text" className="form-control" id="tag" name='tag' onChange={handleChange}/>
              </div>
              <button disabled={note.title.length < 5 || note.description.length < 5} type="submit" className="btn btn-outline-primary" onClick={addNewNote} style={{cursor:"pointer"}}>Add Note</button>
          </form>
    </div>
  )
}

export default AddNote
