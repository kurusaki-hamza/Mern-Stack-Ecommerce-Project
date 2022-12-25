import React, { useContext, useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ProductsContext } from '../App';

const Navbar = () => {
    const { showLayer, nav, header, allProductsParent, setCategory, openedRoute, setOpenedRoute, admin, setTypeOfProducts, setFiltered } = useContext(ProductsContext);
    const categoriesLi = useRef();
    // routes tabs names of navbar
    const arrOfLis = ["Home", "Categories", "All Products", "Favorites", "Ordered", "Contact", "About"];
    // active class to detect which tab is the last clicked tab
    let lis = arrOfLis.map((e, i) => {
        if (e === "Categories") {
            return (
                <li key={i + 1} className={openedRoute === "Categories" ? "nav-categories active" : "nav-categories"} ref={categoriesLi} onClick={(event) => {
                    categoriesLi.current.classList.toggle('show-popup');
                }}>
                    <div>
                        <span>{e}</span>
                        <i className='fa'></i>
                    </div>
                    <ul>
                        <li onClick={() => {
                            setCategory("computersAndAccessoires");
                            setOpenedRoute('Categories');
                        }}><NavLink to="/Categories/ComputersAndAccessoires">Computers And Accessoires</NavLink></li>
                        <li onClick={() => {
                            setCategory("dresses");
                            setOpenedRoute('Categories');
                        }}><NavLink to="/Categories/Dresses">Dresses</NavLink></li>
                        <li onClick={() => {
                            setCategory("toys");
                            setOpenedRoute('Categories');
                        }}><NavLink to="/Categories/Toys">Toys</NavLink></li>
                        <li onClick={() => {
                            setCategory("kitchentools");
                            setOpenedRoute('Categories');
                        }}><NavLink to="/Categories/KitchenTools">Kitchen Tools</NavLink></li>
                        <li onClick={() => {
                            setCategory("phones");
                            setOpenedRoute('Categories');
                        }}><NavLink to="/Categories/Phones">Phones</NavLink></li>
                        <li onClick={() => {
                            setCategory("books");
                            setOpenedRoute('Categories');
                        }}><NavLink to="/Categories/Books">Books</NavLink></li>
                    </ul>
                </li>
            )
        } else {
            if (e === "Home") return (<li key={i + 1} className={openedRoute === e ? 'active' : ""} onClick={() => { setTypeOfProducts("allProducts"); setFiltered('allProductsLi'); setOpenedRoute("Home") }} ><NavLink to="/">{e}</NavLink></li>)

            if (e === 'All Products') return (<li key={i + 1} className={openedRoute === e ? 'active' : ""} onClick={() => { setTypeOfProducts("allProducts"); setFiltered('allProductsLi'); setOpenedRoute("All Products") }} ><NavLink to="/AllProducts">{e}</NavLink></li>)

            if (e === "Favorites") return (<li key={i + 1} className={openedRoute === e ? 'active' : ""} onClick={() => { setOpenedRoute("Favorites"); setTypeOfProducts("favorites"); }} ><NavLink to="/Favorites">{e}</NavLink></li>)

            if (e === "Ordered") return (<li key={i + 1} className={openedRoute === e ? 'active' : ""} onClick={() => { setOpenedRoute("Ordered"); setTypeOfProducts("ordered"); }} ><NavLink to="/Ordered">{e}</NavLink></li>)

            if (e === "Contact") return (<li key={i + 1} className={openedRoute === e ? 'active' : ""} onClick={() => setOpenedRoute("Contact")} ><NavLink to="/Contact">{e}</NavLink></li>)

            if (e === "About") return (<li key={i + 1} className={openedRoute === e ? 'active' : ""} onClick={() => setOpenedRoute("About")} ><NavLink to="/About">{e}</NavLink></li>)

            if (e === 'Manage') {
                if (admin) return (<li key={i + 1} className={openedRoute === e ? 'active' : ""} onClick={() => setOpenedRoute("Manage")} ><NavLink to="/Manage">{e}</NavLink></li>)
            }
        }
    });

    // if window scroll passed navbar make navbar fixed to the top of viewed window
    // make all product in left if window scroll arrive to all products section make them right
    useEffect(() => {
        // variable to detect if products is seen , if it is so the all products won't be left 
        let windowScrolledToProducts;
        window.addEventListener('scroll', async () => {
            if (nav.current && header.current) {
                if (header.current.offsetHeight < window.scrollY) {
                    nav.current.style.top = "0px";
                    nav.current.style.position = "sticky";
                }
                if (header.current.offsetHeight > window.scrollY) {
                    nav.current.style.position = "relative";
                }
            }
            let openedRouteVariable = window.location.pathname === "/" ? 'Home' : null;
            let productsSeen;
            if (typeof allProductsParent.current !== "undefined" && openedRouteVariable === "Home") {
                try {
                    productsSeen = ((allProductsParent.current.parentElement.offsetTop - 200) < window.scrollY)
                } catch (err) {
                    productsSeen = null;
                }
                if (productsSeen) windowScrolledToProducts = true
                if (allProductsParent.current && allProductsParent.current.children[0]) {
                    if (!windowScrolledToProducts) {
                        for (let i = 0; i < allProductsParent.current.children.length; i++) {
                            allProductsParent.current.children[i].classList.add("lefter")
                        }
                    }
                }
                if (windowScrolledToProducts && allProductsParent.current.children[0].classList.contains("lefter")) {
                    let n = 220;
                    let m = 0;
                    Array.from(allProductsParent.current.children).forEach((ele, ix) => {
                        ele.key = ix
                        setTimeout(() => { ele.classList.remove("lefter") }, n - m)
                        n += 70;
                    })
                }
            }
        });
    }, []);

    return (
        <div className='nav df jcs' ref={nav}>
            <div className="sidebarlines" onClick={() => {
                setTimeout(() => {
                    showLayer();
                }, 300)
            }}>
                <span className="sidebarline"></span>
                <span className="sidebarline"></span>
                <span className="sidebarline"></span>
            </div>
            <div className="navlinks">
                <ul className='df'>
                    {lis}
                </ul>
            </div>
        </div>
    )
}

export default Navbar