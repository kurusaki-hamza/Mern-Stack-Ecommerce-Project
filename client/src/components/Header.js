import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { ProductsContext } from '../App'

const Header = () => {
    const { user, setUser, header, setOpenedRoute, products, setFiltered, setTypeOfProducts, filter, setArrOfProductsStatus } = useContext(ProductsContext);
    let [ulLis, setUlLis] = useState('');
    let [searching, setSearching] = useState(false);
    const goTo = useNavigate();
    const input = useRef();
    let [searchingFirstMatchCategory, setSearchingFirstMatchCategory] = useState("allProductsLi");
    let productsNames = [];
    const searchBtnFn = () => {
        setTypeOfProducts("allProducts");
        setFiltered(searchingFirstMatchCategory);
        setSearching(false);
        goTo("/AllProducts");
        input.current.value = '';
    }
    const searchFn = (e) => {
        for (let p in products.products) {
            const categoryProductsNames = products.products[p].map((ele) => {
                return ele.name
            })
            productsNames = [...productsNames, ...categoryProductsNames];
        }
        setSearching(true);
        let matchedStrsArr = productsNames.map((ele) => {
            if (ele.toLowerCase().includes(e.target.value) || ele.includes(e.target.value)) {
                return ele
            }
        });
        let matchedStrs = matchedStrsArr.filter((ele) => {
            if (ele) return true
        })
        let fisrtEleCategoryAdded = false;
        let matchedStrsEles = matchedStrs.map((ele, ix) => {
            if (!fisrtEleCategoryAdded) {
                for (const p in products.products) {
                    products.products[p].forEach((element) => {
                        if (element.name.includes(ele)) {
                            setSearchingFirstMatchCategory(p);
                        }
                    });
                }
                fisrtEleCategoryAdded = true;
            }
            return (
                <li key={ix} onClick={() => {
                    let category;
                    for (const p in products.products) {
                        products.products[p].forEach((element) => {
                            if (element.name.includes(ele)) {
                                category = p;
                            }
                        });
                    }
                    setTypeOfProducts("allProducts");
                    setFiltered(category);
                    setSearching(false);
                    e.target.value = '';
                }}><NavLink to='/AllProducts'>{ele}</NavLink></li>
            )
        });
        setUlLis(matchedStrsEles)
        if (e.target.value.trim() === '') {
            setSearching(false);
            matchedStrsEles = "";
        }
    }
    const logoutFn = () => {
        setUser(!user);
        setArrOfProductsStatus({
            books: [],
            computersAndAccessoires: [],
            dresses: [],
            toys: [],
            phones: [],
            kitchentools: []
        });
        filter("allProductsLi", "allProducts");
        axios.post("http://localhost:5001/logout", null, { withCredentials: true }).then((res) => {
        }).catch((err) => { console.log(err); })
    }
    return (
        <div className='header df' id="header" ref={header}>
            <div className="logo">
                <span>Kanto</span>Shop
            </div>
            <div className="search">
                <input ref={input} type="text" name="search" placeholder="Search Product" className="search-ipt" onChange={(e) => { searchFn(e) }} />
                <button className='search bgorange' onClick={searchBtnFn}><i className="fa fa-search"></i></button>
            </div>
            {searching ? <ul>{ulLis}</ul> : ""}
            <div className="auth">
                {!user ? (<>
                    <div className="login">
                        <button className="btn dib">
                            <NavLink to="/SignIn" onClick={() => setOpenedRoute(null)}>Sign-in</NavLink>
                        </button>
                    </div>
                    <div className="logout">
                        <button className="btn dib">
                            <NavLink to="/SignUp" onClick={() => setOpenedRoute(null)}>Sign-up</NavLink>
                        </button>
                    </div>
                </>) : (<>
                    <div className="logout" >
                        <form action="/logout" method="post">
                            <button type="submit" className="btn dib" onClick={logoutFn} >
                                <NavLink to="/">Logout</NavLink>
                            </button>
                        </form>
                    </div>
                </>)}
            </div>
        </div >
    )
}

export default Header