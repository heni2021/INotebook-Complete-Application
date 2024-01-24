import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
}
  from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import NoteState from './context/notes/NoteState';
import Alert from './components/Alert'
import Login from './components/Login';
import Signup from './components/Signup';
import { useState } from 'react';

function App() {
  const [alert, setAlert] = useState(null);

  const showAlertMessage = (message, type) => {
    setAlert({
      msg: message,
      type: type
    });
    setTimeout(() => {
      setAlert(null);
    }, 1000);
  }
  return (
    <>
      <NoteState>
        <Router>
          <Navbar showAlert={showAlertMessage} />
          <Alert message={alert} />
          <div className="container">
            <Routes>
              <Route exact path='/' element={<Home showAlert={showAlertMessage} />} />
              {/* <Route exact path='/' element={<Navigate to='/Login'/>} /> */}
              <Route exact path='/about' element={<About />} />
              <Route exact path='/Login' element={<Login showAlert={showAlertMessage} />} />
              <Route exact path='/register' element={<Signup showAlert={showAlertMessage} />} />
            </Routes>
          </div>
        </Router>
      </NoteState>
    </>
  );
}

export default App;
