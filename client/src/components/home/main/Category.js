import React from 'react';
import { NavLink } from 'react-router-dom';
const Category = (props) => {
    return (
        <div className='category'>
            <div className="img">
                <img src={props.imgURL} alt={props.category} />
            </div>
            <div className="category-right">
                <span className="category-name">{props.category}</span>
                <div className="category-icon">
                    <i className="fa fa-store-alt" />
                    <span>Kanto Shop</span>
                </div>
                <div className="category-spans">
                    <span className='off'>{props.off} </span>
                    <span>On All Products</span>
                </div>
                <button className="btn categories-btn-a"><NavLink to={"/Categories" + props.categoryURL} >shop now</NavLink></button>
            </div>
        </div>
    )
}

export default Category