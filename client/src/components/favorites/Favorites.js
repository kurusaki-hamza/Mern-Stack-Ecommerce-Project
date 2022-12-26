import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ProductsContext } from '../../App';
import LoadingProductsComp from '../home/main/LoadingProductsComp';

const Favorites = () => {
    const { loading, allProducts, setLoading, setUser, setOpenedRoute } = useContext(ProductsContext);
    let [authenticated, setAuthenticated] = useState(true);
    const goTo = useNavigate();
    useEffect(() => {
        async function isUserFn() {
            let isUser = false;
            setLoading(true);
            await axios.get('/isUser', { withCredentials: true }).then((res) => {
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
            setOpenedRoute(null);
            goTo('/SignIn');
        }
    }, [authenticated]);
    return (
        <>
            {
                loading ?
                    <LoadingProductsComp /> :
                    <div className='favorites'>
                        {allProducts}
                    </div>
            }
        </>
    )
}

export default Favorites