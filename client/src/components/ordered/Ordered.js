import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ProductsContext } from '../../App';
import LoadingProductsComp from '../home/main/LoadingProductsComp';

const Ordered = () => {
    const { filter, allProducts, loading, setLoading, setUser } = useContext(ProductsContext);
    let [authenticated, setAuthenticated] = useState(true);
    const goTo = useNavigate();
    useEffect(() => {
        filter(null, "ordered");
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
        if (!authenticated && !loading) {
            goTo('/SignIn');
        }
    }, [authenticated]);
    return (
        <>
            {
                loading ?
                    <LoadingProductsComp /> :
                    <div className='ordered-route'>
                        {allProducts}
                    </div>
            }
        </>
    )
}

export default Ordered