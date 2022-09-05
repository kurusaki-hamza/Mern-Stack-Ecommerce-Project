import React, { useContext } from 'react';
import { ProductsContext } from '../../../App';
import Category from './Category'

const Categories = () => {
    const { products } = useContext(ProductsContext);
    const categories = products.categories.map(category => {
        return <Category key={category.id} off={category.off} category={category.category} imgURL={category.imgURL} categoryURL={category.categoryURL} />
    });
    return (
        <div className='categories'>
            <span>Categories</span>
            <div className="categories-items">
                {categories && categories}
            </div>
        </div>
    )
}

export default Categories;