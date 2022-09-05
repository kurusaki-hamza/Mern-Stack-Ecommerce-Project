import React, { useContext, useEffect } from 'react';
import { ProductsContext } from '../../../App';

const AllProducts = () => {
    const { allProductsParent, allProducts, filterLis } = useContext(ProductsContext);

    return (
        <div className='allProducts'>
            <span>Products Overview</span>
            <div className="filter">
                <ul>
                    {filterLis}
                </ul>
            </div>
            <div className="allProductsMain" ref={allProductsParent}>
                {allProducts}
            </div>
        </div>
    )
}

export default AllProducts