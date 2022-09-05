import React, { useContext } from 'react'
import { ProductsContext } from '../../App';
import LoadingProductsComp from '../home/main/LoadingProductsComp';

const AllProductsRoute = () => {
    const { allProductsParent, allProducts, filterLis, loadingProducts } = useContext(ProductsContext);
    return (
        <>
            {loadingProducts ? <LoadingProductsComp /> : <div className='allProducts'>
                <span>Products Overview</span>
                <div className="filter">
                    <ul>
                        {filterLis}
                    </ul>
                </div>
                <div className="allProductsMain" ref={allProductsParent}>
                    {allProducts}
                </div>
            </div>}
        </>
    )
}

export default AllProductsRoute