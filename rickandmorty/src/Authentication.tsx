import React from 'react'
import { useFormik } from 'formik';
import { useState, useEffect } from 'react';
import axios from 'axios';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Alert from '@mui/material/Alert';
export default function Authentication() {


    const [isSignUp, setIsSignUp] = React.useState(false);
    const [singedin, setSingedin] = useState<boolean>(false);

    useEffect(() => {
        onLoad();
    }, []);

    const handleSignUpToggle = (event) => {
        setIsSignUp(event.target.checked);
    };
    
    const validate = values => {
        const errors = {};
      
        if (!values.email) {
          errors.email = 'Required';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
          errors.email = 'Invalid email address';
        }
      
        if (!values.password) {
          errors.password = 'Required';
        } else if (values.password.length < 3) {
          errors.password = 'Password must be at least 3 characters';
        }
      
        return errors;
      };

    const formik = useFormik({
        initialValues: {
          email: '',
          password: '',
        },
        validate,
        onSubmit: values => {
            if (isSignUp) {
                axios.post('http://localhost:3030/register', values)
                .then((response) => {
                    console.log(response.data);
                    alert("Registration successful!");
                    
                    console.log("Token: ", response.data.accessToken);

                    localStorage.setItem('token', response.data.accessToken);

                    localStorage.setItem('id', JSON.stringify(response.data.user.id));
                    console.log("User ID: ", response.data.user.id);

                    setSingedin(true);
                    

                    // account add score into cars into Displacement
                    const basicAccount = {
                        "Displacement": 0,
                    }
                    axios.post('http://localhost:3030/cars', basicAccount, {
                        headers: {
                            'Authorization': `Bearer ${response.data.accessToken}`
                        }
                    })
                    .then((response) => {
                        console.log(response.data);
                        console.log("Car ID: ", response.data.id);
                    })
                    .catch((error) => {
                        console.error(error);
                        alert("Signup Score failed!")
                    });
                })
                .catch((error) => {
                    console.error(error);
                    alert("Registration failed!")
                });
                
            } else {
                axios.post('http://localhost:3030/login', values)
                .then((response) => {
                    console.log(response.data);
                    alert("Login successful!");
                    
                    console.log("Token: ", response.data.accessToken);

                    localStorage.setItem('token', response.data.accessToken);

                    localStorage.setItem('id', JSON.stringify(response.data.user.id));
                    console.log("User ID: ", response.data.user.id);

                    setSingedin(true);
                    
                })
                .catch((error) => {
                    console.error(error);
                    alert("Login failed!")
                });
            }
        },
    });


    return (
        <div>
            <FormGroup>
                <FormControlLabel 
                    control={<Switch checked={isSignUp} onChange={handleSignUpToggle} />} 
                    label="Sign Up?" 
                />
            </FormGroup>

            {singedin ? <button onClick={logout}>Logout</button> : null}
            
            <form onSubmit={formik.handleSubmit}>
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
                {formik.errors.email ? <div>{formik.errors.email}</div> : null}
                <br />
                
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                />
                {formik.errors.password ? <div>{formik.errors.password}</div> : null}
                <br />
                <br />
                <button type="submit">{isSignUp ? 'Sign Up' : 'Login'}</button>
            </form>

            {singedin ? 
              <Alert severity="success">You are logged in</Alert> : 
              <Alert severity="info">{isSignUp ? 'Please sign up' : 'Please sign in'}</Alert>
            }
        </div>
    );

    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        setSingedin(false);
        
        console.log("Logged out");
    }

    function onLoad() {
        const token = localStorage.getItem('token');
        const id = localStorage.getItem('id');
        if (token && id) {
            console.log("User ID: ", id);
            console.log("Token found: ", token);

            axios.get('http://localhost:3030/600/users/' + id as string, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                console.log('Data:', response.data);
                setSingedin(true);
                
                console.log("YOU ARE SIGNED IN");
            })
            .catch(error => {
                console.error('Error:', error);
                
            });
        } else {
            console.log("No user ID found");
            console.log("No token found");
            
        }
        
    }

}
