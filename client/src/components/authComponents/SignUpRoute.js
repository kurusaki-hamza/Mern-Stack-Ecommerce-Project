import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ProductsContext } from '../../App';
import LoadingProductsComp from '../home/main/LoadingProductsComp';

const SignUpRoute = () => {
    const { setUser, setLoading, loading } = useContext(ProductsContext);
    const [resErr, SetResErr] = useState(false);
    const [usernameErr, SetUsernameErr] = useState(false);
    const [emailErr, SetEmailErr] = useState(false);
    const [passwordErr, SetPasswordErr] = useState(false);
    let [authenticated, setAuthenticated] = useState(false);
    const goTo = useNavigate();
    const form = useRef();
    const route = useNavigate();
    const username = useRef();
    const email = useRef();
    const password = useRef();
    const handleSubmit = (e) => {
        SetResErr(false);
        SetUsernameErr(false);
        SetEmailErr(false);
        SetPasswordErr(false);
        e.preventDefault();
        const formData = new URLSearchParams();
        for (const pair of new FormData(form.current)) {
            formData.append(pair[0], pair[1]);
        }
        axios.post('http://localhost:5001/signup', formData).then((res) => {
            if (res.data.signedUp) {
                route("/Signin")
            } else if (!res.data.signedUp) {
                let raplicatedNames = res.data.validationArr.map((ele) => {
                    return ele.param
                });
                let names = Array.from(new Set(raplicatedNames));
                if (names.length === 0) {
                    SetUsernameErr(false);
                    SetEmailErr(false);
                    SetPasswordErr(false);
                } else if (names.length === 1) {
                    if (names[0] === "username") {
                        SetEmailErr(res.data.validationArr[0].msg);
                    } else if (names[0] === "email") {
                        SetPasswordErr(res.data.validationArr[0].msg);
                    } else {
                        SetPasswordErr(res.data.validationArr[0].msg);
                    }
                } else if (names.length === 2 || names.length === 3) {
                    let emailAdded;
                    let passwordAdded;
                    let usernameAdded;
                    res.data.validationArr.forEach((ele) => {
                        if (ele.param === "email" && !emailAdded) {
                            emailAdded = true;
                            SetEmailErr(ele.msg);
                        } else if (ele.param === "password" && !passwordAdded) {
                            passwordAdded = true;
                            SetPasswordErr(ele.msg);
                        } else if (ele.param === "username" && !usernameAdded) {
                            usernameAdded = true;
                            SetUsernameErr(ele.msg);
                        }
                    });
                }
            }
        }).catch((err) => {
            SetResErr(true);
        })
    };
    useEffect(() => {
        async function isUserFn() {
            let isUser = false;
            setLoading(true);
            await axios.get('http://localhost:5001/isUser', { withCredentials: true }).then((res) => {
                isUser = res.data.isUser;
                setLoading(false);
                setAuthenticated(res.data.isUser);
            }).catch(err => console.log(err.message));
            setUser(isUser);
        };
        isUserFn();
    }, []);
    useEffect(() => {
        if (authenticated && !loading) {
            goTo('/');
        }
    }, [authenticated]);
    return (
        <>
            {
                loading ?
                    <LoadingProductsComp /> :
                    <div className='sign-up'>
                        <h4>Create Account</h4>
                        <form ref={form} onSubmit={handleSubmit}>
                            <input type="text" ref={username} name="username" placeholder='Type Your Username' />
                            {usernameErr ? <div className='red'>{usernameErr}</div> : ""}
                            <input type="email" ref={email} name="email" placeholder='Type Your Email' />
                            {emailErr ? <div className='red'>{emailErr}</div> : ""}
                            <input type="password" ref={password} name="password" placeholder='Enter Password' />
                            {passwordErr ? <div className='red'>{passwordErr}</div> : ""}
                            <input type="submit" value="Sign-Up" />
                        </form>
                        {resErr ? <div className="red">Something Went Wrong</div> : ""}
                    </div>
            }
        </>
    )
}

export default SignUpRoute