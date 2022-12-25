import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ProductsContext } from '../../App';
import LoadingProductsComp from '../home/main/LoadingProductsComp';

const LoginRoute = () => {
    const { setUser, setUserEmail, setArrOfProductsStatus, setLoading, loading } = useContext(ProductsContext);
    const [resErr, SetResErr] = useState(false);
    const [emailErr, SetEmailErr] = useState(false);
    const [passwordErr, SetPasswordErr] = useState(false);
    const [notUser, SetNotUser] = useState(null);
    let [authenticated, setAuthenticated] = useState(false);
    const goTo = useNavigate();
    const form = useRef();
    const route = useNavigate();
    const email = useRef();
    const password = useRef();
    const handleSubmit = (e) => {
        SetNotUser(null);
        SetResErr(false);
        SetPasswordErr(false);
        SetEmailErr(false);
        e.preventDefault();
        const formData = new URLSearchParams();
        for (const pair of new FormData(form.current)) {
            formData.append(pair[0], pair[1]);
        }
        axios.post('http://localhost:5001/login', formData, { withCredentials: true }).then((res) => {
            if (res.data.isUser) {
                setUserEmail(email.current.value);
                setArrOfProductsStatus(res.data.arr)
                setUser(true);
                route("/")
            } else if (typeof res.data.isUser === "undefined") {
                let raplicatedNames = res.data.validationArr.map((ele) => {
                    return ele.param
                });
                let names = Array.from(new Set(raplicatedNames));
                if (names.length === 0) {
                    SetEmailErr(false);
                    SetPasswordErr(false);
                } else if (names.length === 1) {
                    if (names[0] === "email") {
                        SetEmailErr(res.data.validationArr[0].msg);
                    } else {
                        SetPasswordErr(res.data.validationArr[0].msg);
                    }
                } else {
                    let emailAdded;
                    let passwordAdded;
                    res.data.validationArr.forEach((ele) => {
                        if (ele.param === "email" && !emailAdded) {
                            emailAdded = true;
                            SetEmailErr(ele.msg);
                        } else if (ele.param === "password" && !passwordAdded) {
                            passwordAdded = true;
                            SetPasswordErr(ele.msg);
                        }
                    });
                }
            } else if (res.data.isUser === false) {
                SetNotUser(true)
            }
        }).catch((err) => {
            SetResErr(true);
        })
    }
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
                    <div className='login-route'>
                        <h4>Login To Your Account</h4>
                        <form ref={form} onSubmit={handleSubmit}>
                            <input type="email" ref={email} name="email" placeholder='Type Your Email ...' />
                            {emailErr ? <div className='red'>{emailErr}</div> : ""}
                            <input type="password" ref={password} name="password" placeholder="Type Your Password" />
                            {passwordErr ? <div className='red'>{passwordErr}</div> : ""}
                            <input type="submit" value="Login" />
                        </form>
                        {notUser ? <div className="red">There's no User With This Email</div> : ""}
                        {resErr ? <div className="red">Something Went Wrong</div> : ""}
                    </div>
            }
        </>
    )
}

export default LoginRoute