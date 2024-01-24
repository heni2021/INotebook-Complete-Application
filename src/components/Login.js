import React, { useState } from 'react'
import { useNavigate } from 'react-router';
// require('dotenv').config();

const Login = (props) => {
    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    })
    const url = process.env.REACT_APP_LOGIN_URL;
    let navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials)
        });
        const json = await response.json();
        console.log(json);
        if (json.success) {
            //redirect
            localStorage.setItem('token', json.authToken);
            navigate('/home');
            props.showAlert("Logged In Successfully!", "success");

        }
        else {
            props.showAlert(json.error, "danger");
        }
    }

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    const clearField = (e) => {
        e.preventDefault();
        setCredentials({
            email : "",
            password : ""
        })
    }
    return (
        <div className='container my-3'>
            <form onSubmit={handleSubmit}>
                <div className="mb-3 row">
                    <label htmlFor="staticEmail" className="col-sm-2 col-form-label">Email</label>
                    <div className="col-sm-10">
                        <input type="email" className="form-control" id="email" name="email" value={credentials.email} onChange={handleChange} required/>
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Password</label>
                    <div className="col-sm-10">
                        <input type="password" className="form-control" name="password" id="password" value={credentials.password} onChange={handleChange} minLength={5} required/>
                    </div>
                </div>
                <button type="reset" className="btn btn-outline-primary mx-2" onClick={clearField}>Clear All Fields</button>
                <button type='submit' className='btn btn-outline-primary' >Submit</button>
            </form>
        </div>
    )
}

export default Login

// http://localhost:3030/api/auth/login