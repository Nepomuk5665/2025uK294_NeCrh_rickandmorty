import React from 'react'
import { useFormik } from 'formik';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Alert from '@mui/material/Alert';
import { register, login } from './api/axios-functions';
import { checkAuthentication, logout } from './api/auth-utils';
import { setAuthData } from './api/axios-functions';

export default function Authentication() {
    const navigate = useNavigate();
    const [isSignUp, setIsSignUp] = React.useState(false);
    const [singedin, setSingedin] = useState<boolean>(false);

    useEffect(() => {
        onLoad();
    }, []);

    const handleSignUpToggle = (event) => {
        setIsSignUp(event.target.checked);
    };
    
    const validate = (values : string) => {
        const errors = {};
        
            if (!values.email) {
             errors.email = 'Required';
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
            errors.email = 'Invalid email address';
            }
        if (isSignUp) {
            if (!values.password) {
            errors.password = 'Required';
            } else if (values.password.length < 3) {
            errors.password = 'Password must be at least 3 characters';
            }
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
                register(values)
                .then((response) => {
                    console.log(response.data);
                    alert("Registration successful!");
                    
                    console.log("Token: ", response.data.accessToken);
                    console.log("User ID: ", response.data.user.id);

                    setAuthData(response.data.accessToken, response.data.user.id);
                    setSingedin(true);
                    navigate('/characters');
                })
                .catch((error) => {
                    console.error(error);
                    alert("Registration failed!")
                });
                
            } else {
                login(values)
                .then((response) => {
                    console.log(response.data);
                    alert("Login successful!");
                    
                    console.log("Token: ", response.data.accessToken);
                    console.log("User ID: ", response.data.user.id);

                    setAuthData(response.data.accessToken, response.data.user.id);
                    setSingedin(true);
                    navigate('/characters');
                })
                .catch((error) => {
                    console.error(error);
                    alert("Login failed!")
                });
            }
        },
    });

    function handleLogout() {
        logout();
        setSingedin(false);
    }

    async function onLoad() {
        const result = await checkAuthentication();
        setSingedin(result.isAuthenticated);
        if (result.isAuthenticated) {
            navigate('/characters');
        }
    }

    return (
        <div>
            <FormGroup>
                <FormControlLabel 
                    control={<Switch checked={isSignUp} onChange={handleSignUpToggle} />} 
                    label="Sign Up?" 
                />
            </FormGroup>

            {singedin ? <button onClick={handleLogout}>Logout</button> : null}
            
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
}