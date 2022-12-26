import axios from 'axios';
import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { ProductsContext } from '../App';

const SideBar = () => {
    const { user, setUser, layer, closeLayer, layerSideBar, hideLayer, setCategory, showCategories, setShowCategories, setOpenedRoute, setTypeOfProducts, filter, setArrOfProductsStatus
    } = useContext(ProductsContext);
    const logoutFn = () => {
        setArrOfProductsStatus({
            books: [],
            computersAndAccessoires: [],
            dresses: [],
            toys: [],
            phones: [],
            kitchentools: []
        });
        filter("allProductsLi", "allProducts");
        setUser(!user);
        axios.post("/logout", null, { withCredentials: true }).then((res) => {
        }).catch((err) => { console.log(err); })
    }
    return (
        <div className="sidebar-layout hide" ref={layer}>
            <div className={`sidebar`} ref={layerSideBar}>
                <div className='sign-in' >
                    {user ? <NavLink to="/" onClick={logoutFn}><i className="fa fa-user" />Logout</NavLink> : (<NavLink to="/SignIn" onClick={() => setOpenedRoute(null)}><i className="fa fa-user" />Sign-in</NavLink>)}
                </div>
                <hr />
                <div className="sidebar-items">
                    <div className="categories">
                        <h4 onClick={(e) => {
                            setTimeout(() => {
                                setShowCategories(!showCategories)
                            }, 300)
                        }}>
                            <span>Categories</span>
                            <i className={showCategories ? "fa fa-angle-down" : "fa fa-angle-right"}></i>
                        </h4>
                        <ul className={showCategories ? "showUL" : "hideUL"}>
                            <ul>
                                <li onClick={() => {
                                    hideLayer();
                                    setTimeout(() => {
                                        setShowCategories(false)
                                    }, 200);
                                    setCategory("computersAndAccessoires"); setOpenedRoute('Categories');
                                }}><NavLink to="/Categories/ComputersAndAccessoires">Computers And Accessoires</NavLink></li>
                                <li onClick={() => {
                                    hideLayer();
                                    setTimeout(() => {
                                        setShowCategories(false)
                                    }, 200); setCategory("dresses"); setOpenedRoute('Categories');
                                }}><NavLink to="/Categories/Dresses">Dresses</NavLink></li>
                                <li onClick={() => {
                                    hideLayer();
                                    setTimeout(() => {
                                        setShowCategories(false)
                                    }, 200); setCategory("toys"); setOpenedRoute('Categories');
                                }}><NavLink to="/Categories/Toys">Toys</NavLink></li>
                                <li onClick={() => {
                                    hideLayer();
                                    setTimeout(() => {
                                        setShowCategories(false)
                                    }, 200); setCategory("kitchentools"); setOpenedRoute('Categories');
                                }}><NavLink to="/Categories/KitchenTools">Kitchen Tools</NavLink></li>
                                <li onClick={() => {
                                    hideLayer();
                                    setTimeout(() => {
                                        setShowCategories(false)
                                    }, 200); setCategory("phones"); setOpenedRoute('Categories');
                                }}><NavLink to="/Categories/Phones">Phones</NavLink></li>
                                <li onClick={() => {
                                    hideLayer();
                                    setTimeout(() => {
                                        setShowCategories(false)
                                    }, 200); setCategory("books"); setOpenedRoute('Categories');
                                }}><NavLink to="/Categories/Books">Books</NavLink></li>
                            </ul>
                        </ul>
                    </div>
                    <h4 onClick={() => {
                        hideLayer();
                        setTimeout(() => {
                            setShowCategories(false)
                        }, 200); setOpenedRoute("Favorites"); setTypeOfProducts("favorites");
                    }} ><NavLink to="/Favorites">Favorites</NavLink></h4>
                    <h4 onClick={() => {
                        hideLayer();
                        setTimeout(() => {
                            setShowCategories(false)
                        }, 200); setOpenedRoute("Ordered"); setTypeOfProducts("ordered");
                    }} ><NavLink to="/Ordered">Ordered</NavLink></h4>
                    <h4 onClick={() => {
                        hideLayer();
                        setTimeout(() => {
                            setShowCategories(false)
                        }, 200); setOpenedRoute("Contact")
                    }} ><NavLink to="/Contact">Contact</NavLink></h4>
                    <h4 onClick={() => {
                        hideLayer();
                        setTimeout(() => {
                            setShowCategories(false)
                        }, 200); setOpenedRoute("About")
                    }} ><NavLink to="/About">About</NavLink></h4>
                </div>
            </div>
            <div className="sidebar-right" onClick={() => {
                hideLayer();
                setTimeout(() => {
                    setShowCategories(false)
                }, 200)
            }}>
            </div>
            <span onClick={() => {
                hideLayer();
                setTimeout(() => {
                    setShowCategories(false)
                }, 200)
            }} ref={closeLayer}>X</span>
        </div>
    )
}

export default SideBar