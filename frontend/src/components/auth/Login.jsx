import React, { useContext } from 'react';
import { useState, useEffect } from 'react';
import { AuthContext } from "../contexts/authContext"
import axios from "axios"
import { useFormValidation } from './Validation.jsx';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

import { SignUpContainer, Card } from './authStyle.jsx';


function Login() {
    const { currUser, setCurrUser } = useContext(AuthContext)
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const res = await axios.post("https://techassist-9iyg.onrender.com/users/login", {
                username: username,
                password: password,
            })
            console.log(res.data.token);
            console.log(res.data.userId)
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("userId", res.data.userId);
            localStorage.setItem("role", res.data.role);

            setCurrUser(res.data.userId)
            window.location.href = "/";
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <div>
            <CssBaseline enableColorScheme />
            <SignUpContainer direction="column" justifyContent="space-between">
                <Card variant="outlined">
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
                    >
                        Sign in
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleLogin}
                        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                    >
                        <FormControl>
                            <FormLabel htmlFor="name">Full name</FormLabel>
                            <TextField
                                autoComplete="name"
                                name="name"
                                required
                                fullWidth
                                id="name"
                                placeholder="new user"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                placeholder="••••••"
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                                variant="outlined"
                            />
                        </FormControl>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                        >
                            Login
                        </Button>
                    </Box>
                    <Divider>
                        <Typography sx={{ color: 'text.secondary' }}>or</Typography>
                    </Divider>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Typography sx={{ textAlign: 'center' }}>
                            New to Techassist ? create an account?{' '}
                            <Link
                                href="/signup"
                                variant="body2"
                                sx={{ alignSelf: 'center' }}
                            >
                                sign up
                            </Link>
                        </Typography>
                    </Box>
                </Card>
            </SignUpContainer>
        </div>
    )
}

export default Login;