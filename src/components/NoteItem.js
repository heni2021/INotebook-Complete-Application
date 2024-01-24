import React, { useContext } from 'react';
import noteContext from '../context/notes/noteContext';

const NoteItem = (props) => {
    const context = useContext(noteContext);
    const {deleteNote} = context;
    const { note, updateNote, showAlert } = props;
    const deleteANode = () =>{
        console.log(note._id);
        deleteNote(note._id);
        showAlert("Note Deleted Successfully!", "success");
    }
    const handleClick = () => {
        updateNote(note);
    }
    return (
        <div className='col-md-3 my-2'>
            <div className="card">
                <div className="card-body">
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {note.tag}
                    </span>
                    <h5 className="card-title">{note.title}</h5>
                    <p className="card-text">{note.description}</p>
                    <div className='d-flex align-item-center'>
                        <button type="button" className="btn btn-outline-primary mx-2 text-center" style={{ cursor: "pointer" }} onClick={handleClick}>Edit</button>
                        <button type="button" className="btn btn-outline-primary text-center" style={{ cursor: "pointer" }} onClick={deleteANode}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NoteItem
