import React, { useState } from 'react'
import { useNavigate } from 'react-router';

const Signup = (props) => {
    const[credentials, setCredentials] = useState({
        name: "",
        semail: "",
        spassword: ""
    })

    const signupUrl = process.env.REACT_APP_SIGNUP_URL;
    let navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(signupUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: credentials.name,
                email : credentials.semail,
                password : credentials.spassword
            })
        });
        const json = await response.json();
        console.log(json);
        if (json.success) {
            //redirect
            localStorage.setItem('token', json.authToken);
            navigate('/home');
            props.showAlert("Account created Successfully!", "success");
        }
        else {
            props.showAlert(json.error, "danger");
        }
    }
    const handleChange = (e) => {
        e.preventDefault();
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    const clearField = (e) => {
        e.preventDefault();
        setCredentials({
            name :"",
            semail : "",
            spassword: ""
        });
    }
  return (
    <div className='container my-3'>
          <form onSubmit={handleSubmit}>
              <div className="mb-3 row">
                  <label htmlFor="staticInput" className="col-sm-2 col-form-label">Name</label>
                  <div className="col-sm-10">
                      <input type="name" className="form-control" id="name" name="name" value={credentials.name} onChange={handleChange} />
                  </div>
              </div>
              <div className="mb-3 row">
                  <label htmlFor="staticEmail" className="col-sm-2 col-form-label">Email</label>
                  <div className="col-sm-10">
                      <input type="semail" className="form-control" id="semail" name="semail" value={credentials.semail} onChange={handleChange} required/>
                  </div>
              </div>
              
              <div className="mb-3 row">
                  <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Password</label>
                  <div className="col-sm-10">
                      <input type="password" className="form-control" name="spassword" id="spassword" value={credentials.spassword} onChange={handleChange} minLength={5} required/>
                  </div>
              </div>
              <button type="reset" className="btn btn-outline-primary mx-2" onClick={clearField}>Clear All Fields</button>
              <button type='submit' className='btn btn-outline-primary' >Submit</button>
          </form>
    </div>
  )
}

export default Signup
