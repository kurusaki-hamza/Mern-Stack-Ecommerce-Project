import React, { useContext } from 'react'
import { ProductsContext } from '../../App'
import LoadingProductsComp from '../home/main/LoadingProductsComp';

const CategoryRoute = () => {
    const { allProductsParent, loadingProducts, allCategoryProducts, category, categoryRouteElementsFn } = useContext(ProductsContext);

    const filterBy = (filterName) => {
        if (filterName === "price") {
            categoryRouteElementsFn(category, "price")
        } else if (filterName === "stars") {
            categoryRouteElementsFn(category, "stars")
        } else if (filterName === "name") {
            categoryRouteElementsFn(category, "name")
        }
    }
    return (
        <>
            <div className='category-route'>
                <div>
                    <ul>
                        <li>Filter By:</li>
                        <li onClick={() => { filterBy("price") }}>Price</li>
                        <li onClick={() => { filterBy("stars") }}>Rating</li>
                        <li onClick={() => { filterBy("name") }}>Name</li>
                    </ul>
                </div>
                {loadingProducts ? <LoadingProductsComp /> : <div className="allProductsMain" ref={allProductsParent}>
                    {allCategoryProducts && allCategoryProducts}
                </div>}
            </div>
        </>
    )
}

export default CategoryRoute