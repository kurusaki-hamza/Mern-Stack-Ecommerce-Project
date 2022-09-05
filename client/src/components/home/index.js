import React from 'react';
import { ProductsContext } from '../../App';
import AllProducts from './main/AllProducts';
import BgComp from './main/BgComp';
import Categories from './main/Categories';
import LoadingProductsComp from './main/LoadingProductsComp';
const Home = () => {
    const { loadingProducts } = React.useContext(ProductsContext);
    return (
        <>
            <BgComp />
            {loadingProducts ? <LoadingProductsComp /> : <><Categories /><AllProducts /></>}
        </>
    )
}

export default Home