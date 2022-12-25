import React, { createContext, useEffect, useRef, useState } from 'react';
import Home from './components/home/index';
import axios from 'axios';
import SideBar from './components/SideBar';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import CategoryRoute from './components/category/CategoryRoute';
import AllProductsRoute from './components/allProducts/AllProductsRoute';
import PageNotFound from './components/PageNotFound';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginRoute from './components/authComponents/LoginRoute';
import SignUpRoute from './components/authComponents/SignUpRoute';
import ContactRoute from './components/contact/ContactRoute';
import Favorites from './components/favorites/Favorites';
import Ordered from './components/ordered/Ordered';
import About from './components/about/About';

export const ProductsContext = createContext();

const App = () => {
  // reference to .sidebar-layout
  let layer = useRef();
  // reference to .sidebar-layout span
  let closeLayer = useRef();
  // reference to .sidebar
  let layerSideBar = useRef();
  // reference to .navbar
  const nav = useRef();
  // reference to .header
  const header = useRef();
  // reference to category route products
  const categoryRouteProducts = useRef([]);
  // reference to .allProducts
  const allProductsParent = useRef();
  // user email
  let [userEmail, setUserEmail] = useState("none");
  // if user show him view if !user show him another view
  let [user, setUser] = useState(false);
  // if admin show delete btn if !admin show order btn
  // let [admin, setAdmin] = useState(false);
  // arr of product status detection
  let [arrOfProductsStatus, setArrOfProductsStatus] = useState({
    books: [],
    computersAndAccessoires: [],
    dresses: [],
    toys: [],
    phones: [],
    kitchentools: []
  });
  // which url is opened
  let [openedRoute, setOpenedRoute] = useState(() => {
    if (window.location.pathname === "/") return 'Home';
    if (window.location.pathname === "/Favorites" || window.location.pathname === "/favorites") return 'Favorites';
    if (window.location.pathname === "/Ordered" || window.location.pathname === "/ordered") return 'Ordered';
  });
  // the opened Category
  let [category, setCategory] = useState(null);
  // if showCategories show the categories in sidebar component
  let [showCategories, setShowCategories] = useState(false);
  // products is set by all products stored in db
  let [products, setProducts] = useState([]);
  // if goingToAnotherRoute show loading line
  let [loading, setLoading] = useState(false);
  // if allProductsFetchingIsOn show rotating border of circle
  let [loadingProducts, setLoadingProducts] = useState(true);

  // arr of .product elements which is detected by clicking the tab of filtering products in all Products section
  let [allProducts, setAllProducts] = useState([]);
  // elements of the category opened in Category Route
  let [allCategoryProducts, setAllCategoryProducts] = useState([]);
  // arr of tabs elements in all Products section
  let [filterLis, setFilterLis] = useState([]);
  // arr of names used to create arr of tabs elements
  const filterLisNames = ["All Products", "Computers And Accessoires", "Dresses", "Toys", "Kitchen Tools", "Phones", "Books"];
  // arr of classes of tabs elements which used to detect to filter fn what tab is clicked
  const filterLisClasses = ["allProductsLi", "computersAndAccessoires", "dresses", "toys", "kitchentools", "phones", "books"];
  // if window scrolled to all Products section set this state by true
  let [filteredProductsIsSeen, setFilteredProductsIsSeen] = useState(false);
  // detect what tab is opened in all Products section
  let [filtered, setFiltered] = useState('allProductsLi');
  // the products that must be shown type 
  let [typeOfProducts, setTypeOfProducts] = useState(() => {
    if (window.location.pathname === "/") return "allProducts"
    if (window.location.pathname === "/Favorites" || window.location.pathname === "/Favorites".toLowerCase()) return "favorites"
    if (window.location.pathname === "/Ordered" || window.location.pathname === "/Ordered".toLowerCase()) return "ordered"
  });
  // detect the current route
  let { pathname } = useLocation();
  // navigate to specific roote
  const roote = useNavigate();

  // show .sidebar-layout
  const showLayer = () => {
    layer.current.classList.remove("hide");
    layer.current.style.backgroundColor = "#000000bd";
    // move .sidebar and closing span right after 100 ms
    setTimeout(() => {
      layerSideBar.current.classList.add("moveRight");
      closeLayer.current.classList.add("moveSpanRight")
    }, 100)
  }

  // hide .sidebar-layout and .sidebar
  const hideLayer = () => {
    layer.current.style.backgroundColor = "transparent";
    setTimeout(() => {
      layer.current.classList.add("hide")
    }, 400);
    setTimeout(() => {
      layerSideBar.current.classList.remove("moveRight");
      closeLayer.current.classList.remove("moveSpanRight")
    }, 100)
  }

  const favoriteFn = (category, id) => {
    if (user) {
      let arrOfProductsStatusClone = arrOfProductsStatus;
      let productExistsInTheArr = false;
      arrOfProductsStatusClone[category].forEach((element) => {
        if (element.id === id) {
          productExistsInTheArr = true;
          element.favorite = !element.favorite;
        }
      });
      if (!productExistsInTheArr) {
        arrOfProductsStatusClone[category].push({
          id, favorite: true, ordered: false
        })
      }
      axios.post('http://localhost:5001/favorite', { category, id, userEmail }, { withCredentials: true }).then((res) => {
      }).catch((err) => { console.log(err); })
      setArrOfProductsStatus(arrOfProductsStatusClone);
      if (pathname.includes('Favorites'.toLowerCase()) || pathname.includes('Favorites')) {
        filter(filtered, "favorites")
      }
    } else {
      roote("/Signin");
    }
  }

  const orderFn = (category, id) => {
    if (user) {
      let arrOfProductsStatusClone = arrOfProductsStatus;
      let productExistsInTheArr = false;
      arrOfProductsStatusClone[category].forEach((element) => {
        if (element.id === id) {
          productExistsInTheArr = true;
          element.ordered = !element.ordered;
        }
      });
      if (!productExistsInTheArr) {
        arrOfProductsStatusClone[category].push({
          id, favorite: false, ordered: true
        })
      }
      console.log("ordered click", { category, id, userEmail });
      axios.post('http://localhost:5001/order', { category, id, userEmail }, { withCredentials: true }).then((res) => {
      }).catch((err) => { console.log(err); });
      setArrOfProductsStatus(arrOfProductsStatusClone);
      if (pathname.includes('Ordered'.toLowerCase()) || pathname.includes('Ordered')) {
        filter(filtered, "ordered")
      }
    } else {
      roote("/Signin");
    }
  }

  // fn create elements and set it as value of allProducts state which will be rendered
  const filter = (tab, type) => {
    // tab is the class of the tab element which is clicked
    let allProductsClone = [];
    let counter = 0;
    if (type === "favorites") {
      let result;
      for (let p in products.products) {
        result = products.products[p].map((ele, ix) => {
          let stars = [];
          const yellowStars = [];
          const greyStars = [];
          for (let i = 0; i < ele.stars; i++) {
            yellowStars.push((<i className='fas fa-star yellow' key={i} />))
          }
          for (let i = 0; i < (5 - ele.stars); i++) {
            greyStars.push((<i className='fas fa-star grey' key={i + 6} />))
          }
          stars = [...yellowStars, ...greyStars];
          let isFavorite;
          let isOrdered;
          let padding = false;
          if (p === "books") {
            padding = true;
          }
          for (const category in arrOfProductsStatus) {
            let multipleIn = 1;
            for (let i = 0; i < arrOfProductsStatus[category].length; i++) {
              if (arrOfProductsStatus[category][i].id === ele.id && p === category) {
                if (arrOfProductsStatus[p][i].favorite) {
                  isFavorite = true;
                  if (arrOfProductsStatus[p][i].ordered) isOrdered = true;
                  return (
                    <div className="product" key={((ele.id + counter) * multipleIn).toString()}>
                      <div key="child1" className={`img ${padding ? "booksPad" : ""}`}>
                        <img src={ele.imgURL} alt={ele.name} />
                      </div>
                      <div key="child2" className="product-name">
                        <span className="name">{ele.name}</span>
                        <i onClick={(e) => {
                          e.target.classList.toggle("red");
                          favoriteFn(category, ele.id);
                        }} className={isFavorite ? "fa-solid fa-heart red" : "fa-solid fa-heart"} />
                      </div>
                      <div key="child3" className="product-price">
                        <span className="price">{ele.price}</span>
                        <div className="stars">
                          {stars}
                        </div>
                        <div onClick={(e) => {
                          if (e.target.classList.contains("order")) {
                            e.target.innerText = "Ordered"
                          } else {
                            e.target.innerText = "Order"
                          }
                          e.target.classList.toggle("ordered");
                          e.target.classList.toggle("order");
                          orderFn(category, ele.id)
                        }} className={isOrdered ? "ordered" : "order"}>
                          {isOrdered ? "Ordered" : "Order"}
                        </div>
                      </div>
                    </div>
                  )
                }
              }
            }
            multipleIn++
          }
        })
        counter += 12;
        let filteredResult = result.filter((e) => {
          if (e) return true
        })
        allProductsClone = [...allProductsClone, ...filteredResult]
      }
      if (allProductsClone.length === 0) {
        allProductsClone.push((
          <div key="noItems" className="no-items">
            There Is No Items
          </div>
        ))
      }
    }
    if (type === "ordered") {
      let result;
      for (let p in products.products) {
        result = products.products[p].map((ele, ix) => {
          let stars = [];
          const yellowStars = [];
          const greyStars = [];
          for (let i = 0; i < ele.stars; i++) {
            yellowStars.push((<i className='fas fa-star yellow' key={i} />))
          }
          for (let i = 0; i < (5 - ele.stars); i++) {
            greyStars.push((<i className='fas fa-star grey' key={i + 6} />))
          }
          stars = [...yellowStars, ...greyStars];
          let isFavorite;
          let isOrdered;
          let padding = false;
          if (p === "books") {
            padding = true;
          }
          for (const category in arrOfProductsStatus) {
            for (let i = 0; i < arrOfProductsStatus[category].length; i++) {
              if (arrOfProductsStatus[category][i].id === ele.id && p === category) {
                if (arrOfProductsStatus[p][i].ordered) {
                  isOrdered = true;
                  if (arrOfProductsStatus[p][i].favorite) isFavorite = true;
                  return (
                    <div className="product" key={ele.id + counter}>
                      <div className={`img ${padding ? "booksPad" : ""}`}>
                        <img src={ele.imgURL} alt={ele.name} />
                      </div>
                      <div className="product-name">
                        <span className="name">{ele.name}</span>
                        <i onClick={(e) => {
                          e.target.classList.toggle("red")
                          favoriteFn(category, ele.id);
                          setTypeOfProducts("ordered");
                        }} className={isFavorite ? "fa-solid fa-heart red" : "fa-solid fa-heart"} />
                      </div>
                      <div className="product-price">
                        <span className="price">{ele.price}</span>
                        <div className="stars">
                          {stars}
                        </div>
                        <div onClick={(e) => {
                          if (e.target.classList.contains("order")) {
                            e.target.innerText = "Ordered"
                          } else {
                            e.target.innerText = "Order"
                          }
                          e.target.classList.toggle("ordered");
                          e.target.classList.toggle("order");
                          orderFn(category, ele.id)
                        }} className={isOrdered ? "ordered" : "order"}>
                          {isOrdered ? "Ordered" : "Order"}
                        </div>
                      </div>
                    </div>
                  )
                }
              }
            }
          }
        })
        counter += 12;
        let filteredResult = result.filter((e) => {
          if (e) return true
        })
        allProductsClone = [...allProductsClone, ...filteredResult]
      }

      if (allProductsClone.length === 0) {
        allProductsClone.push((
          <div key="noItems" className="no-items">
            There Is No Items
          </div>
        ))
      }
    }
    if (type === "allProducts") {
      if (tab === 'allProductsLi') {
        for (let p in products.products) {
          let product = products.products[p].map((ele, ix) => {
            let isFavorite;
            let isOrdered;
            // arrOfProductsStatus === {books: [{}],...};
            for (let i = 0; i < arrOfProductsStatus[p].length; i++) {
              if (arrOfProductsStatus[p][i].id === ix + 1) {
                if (arrOfProductsStatus[p][i].favorite) isFavorite = true
                if (arrOfProductsStatus[p][i].ordered) isOrdered = true;
              }
            }
            let stars = [];
            const yellowStars = [];
            const greyStars = [];
            // ele.stars is the number of yellow stars each element doc field have
            for (let i = 0; i < ele.stars; i++) {
              yellowStars.push((<i className='fas fa-star yellow' key={i} />))
            }
            // 5 - ele.stars is the number of grey stars each product have
            for (let i = 0; i < (5 - ele.stars); i++) {
              greyStars.push((<i className='fas fa-star grey' key={i + 6} />))
            }
            stars = [...yellowStars, ...greyStars];
            let padding = false;
            // the size of books pictures have diffrent size from other products pictures so if the category is books detect that the parent element of picture must have padding 
            if (p === "books") {
              padding = true;
            }
            return (
              <div className="product" key={ix + counter}>
                <div className={`img ${padding ? "booksPad" : ""}`}>
                  <img src={ele.imgURL} alt={ele.name} />
                </div>
                <div className="product-name">
                  <span className="name">{ele.name}</span>
                  <i onClick={(e) => {
                    e.target.classList.toggle("red")
                    favoriteFn(p, ix + 1)
                  }} className={isFavorite ? "fa-solid fa-heart red" : "fa-solid fa-heart"} />
                </div>
                <div className="product-price">
                  <span className="price">{ele.price}</span>
                  <div className="stars">
                    {stars}
                  </div>
                  <div onClick={(e) => {
                    if (e.target.classList.contains("order")) {
                      e.target.innerText = "Ordered"
                    } else {
                      e.target.innerText = "Order"
                    }
                    e.target.classList.toggle("ordered");
                    e.target.classList.toggle("order");
                    orderFn(p, ix + 1)
                  }} className={isOrdered ? "ordered" : "order"}>
                    {isOrdered ? "Ordered" : "Order"}
                  </div>
                </div>
              </div>
            )
          });
          counter += 12;
          allProductsClone = [...allProductsClone, ...product].sort((a, b) => {
            return (Math.random() - 0.3)
          })
        }
      } else {
        let product = products.products[tab].map((ele, ix) => {
          let isFavorite;
          let isOrdered;
          // arrOfProductsStatus === {books: [{id:1,ordered:true,favorite:false}],...}
          for (let i = 0; i < arrOfProductsStatus[tab].length; i++) {
            if (arrOfProductsStatus[tab][i].id === ix + 1) {
              if (arrOfProductsStatus[tab][i].favorite) isFavorite = true
              if (arrOfProductsStatus[tab][i].ordered) isOrdered = true
            }
          }
          let stars = [];
          const yellowStars = [];
          const greyStars = [];
          for (let i = 0; i < ele.stars; i++) {
            yellowStars.push((<i className='fa fa-star yellow' key={i} />))
          }
          for (let i = 0; i < (5 - ele.stars); i++) {
            greyStars.push((<i className='fa fa-star grey' key={i + 6} />))
          }
          stars = [...yellowStars, ...greyStars];
          let padding = false;
          if (tab === "books") {
            padding = true;
          }
          return (
            <div className="product" key={ix + 1}>
              <div className={`img ${padding ? "booksPad" : ""}`}>
                <img src={ele.imgURL} alt={ele.name} />
              </div>
              <div className="product-name">
                <span className="name">{ele.name}</span>
                <i onClick={(e) => {
                  e.target.classList.toggle("red");
                  favoriteFn(tab, ix + 1)
                }} className={isFavorite ? "fa-solid fa-heart red" : "fa-solid fa-heart"} />
              </div>
              <div className="product-price">
                <span className="price">{ele.price}</span>
                <div className="stars">
                  {stars}
                </div>
                <div onClick={(e) => {
                  if (e.target.classList.contains("order")) {
                    e.target.innerText = "Ordered"
                  } else {
                    e.target.innerText = "Order"
                  }
                  e.target.classList.toggle("ordered");
                  e.target.classList.toggle("order");
                  orderFn(tab, ix + 1)
                }} className={isOrdered ? "ordered" : "order"}>
                  {isOrdered ? "Ordered" : "Order"}
                </div>
              </div>
            </div>
          )
        });
        allProductsClone = [...product];
      }
    }
    counter = 0;
    setAllProducts(allProductsClone);
  }

  const categoryRouteElementsFn = (categoryName, sorting) => {
    if (categoryName === "computersandaccessoires") categoryName = "computersAndAccessoires";
    let arrOfCategory = products.products[categoryName];
    if (sorting) {
      if (sorting === "price") {
        arrOfCategory.sort((a, b) => {
          return parseInt(a.price.split("$")[0]) - parseInt(b.price.split("$")[0])
        })
        arrOfCategory.reverse();
      }
      if (sorting === "stars") {
        const arrOfCategory = products.products[categoryName].sort((a, b) => {
          return a.stars - b.stars
        })
        arrOfCategory.reverse();
      }
      if (sorting === "name") {
        const arrOfNames = arrOfCategory.map((e) => {
          return e.name
        });
        let sortedNames = [...arrOfNames].sort();
        const arrOfCategoryClone = sortedNames.map((e) => {
          for (let i = 0; i < arrOfCategory.length; i++) {
            if (arrOfCategory[i].name === e) return arrOfCategory[i];
          }
        })
        arrOfCategory = arrOfCategoryClone
      }
    }
    let allCategoryProductsClone = arrOfCategory.map((ele, ix) => {
      let stars = [];
      const yellowStars = [];
      const greyStars = [];
      for (let i = 0; i < ele.stars; i++) {
        yellowStars.push((<i className='fa fa-star yellow' key={i} />))
      }
      for (let i = 0; i < (5 - ele.stars); i++) {
        greyStars.push((<i className='fa fa-star grey' key={i + 6} />))
      }
      stars = [...yellowStars, ...greyStars];
      let padding = false;
      if (category === "books") {
        padding = true;
      }
      let ordered, favorite;
      for (let p in arrOfProductsStatus) {
        for (let i = 0; i < arrOfProductsStatus[p].length; i++) {
          if (arrOfProductsStatus[p][i].id === ele.id && categoryName === p) {
            if (arrOfProductsStatus[p][i].ordered) ordered = true;
            if (arrOfProductsStatus[p][i].favorite) favorite = true;
          }
        }
      }
      return (
        <div className="product" key={ix + 1} ref={(el) => { return categoryRouteProducts.current[ix] = el }}>
          <div className={`img ${padding ? "booksPad" : ""}`}>
            <img src={ele.imgURL} alt={ele.name} />
          </div>
          <div className="product-name">
            <span className="name">{ele.name}</span>
            <i onClick={(e) => {
              e.target.classList.toggle("red")
              favoriteFn(categoryName, ele.id);
            }} className={favorite ? "fa-solid fa-heart red" : "fa-solid fa-heart"} />
          </div>
          <div className="product-price">
            <span className="price">{ele.price}</span>
            <div className="stars">
              {stars}
            </div>
            <div onClick={(e) => {
              if (e.target.classList.contains("order")) {
                e.target.innerText = "Ordered"
              } else {
                e.target.innerText = "Order"
              }
              e.target.classList.toggle("ordered");
              e.target.classList.toggle("order");
              orderFn(categoryName, ele.id)
            }} className={ordered ? "ordered" : "order"}>
              {ordered ? "Ordered" : "Order"}
            </div>
          </div>
        </div>
      )
    })
    setAllCategoryProducts(allCategoryProductsClone);
  }

  // fn create the tabs elements of all Products section
  const filterLisFn = () => {
    const filterLisClone = filterLisNames.map((e, i) => {
      return (
        <li key={i + 1} className={`${filterLisClasses[i]} ${filterLisClasses[i] === filtered ? "active" : ""}`} onClick={(event) => {
          setFilteredProductsIsSeen(true);
          setFiltered(event.target.classList[0]);
        }}>{e}</li>
      )
    });
    setFilterLis(filterLisClone);
  }

  // when allProducts is set comp will rerender then if all Products is already seen when a tab is clicked add lefter class to products then remove it to make animation
  useEffect(() => {
    if (allProductsParent.current) {
      if (filteredProductsIsSeen) {
        for (let i = 0; i < allProductsParent.current.children.length; i++) {
          allProductsParent.current.children[i].classList.add("lefter")
        }
        let n = 0;
        let m = 0;
        Array.from(allProductsParent.current.children).forEach((ele, ix) => {
          ele.key = ix;
          setTimeout(() => { ele.classList.remove("lefter") }, n - m)
          n += 220;
          m += 20;
        })
      }
    }
  }, [allProducts]);

  // if tab is clicked the filtered state will change and filterLisFn will change the view of tabs elements to detect which one is clicked
  useEffect(() => {
    filterLisFn();
    filter(filtered, typeOfProducts);
  }, [filtered, arrOfProductsStatus]);

  useEffect(() => {
    // when comp is rendered fill allProducts arr to be rendered in next render
    filter(filtered, typeOfProducts);
    if (openedRoute === "Categories") {
      if (products.products && !category) {
        let currentCategory = window.location.href.split("/Categories/")[1].toLowerCase();
        const categoryExist = ["computersandaccessoires", "dresses", "toys", "kitchentools", "phones", "books"].includes(currentCategory.toLowerCase());
        if (categoryExist) {
          categoryRouteElementsFn(currentCategory);
          setCategory(currentCategory);
        }
        else {
          categoryRouteElementsFn("computersAndAccessoires");
          setCategory("computersAndAccessoires");
        }
      } else if (products.products && category) {
        categoryRouteElementsFn(category)
      }
    }
  }, [products, category]);

  // whenevr the route is updated , update openedRoute state
  useEffect(() => {
    if (pathname === '/') {
      setOpenedRoute('Home');
      setTypeOfProducts("allProducts");
      setFiltered("allProductsLi");
      filter("allProductsLi", "allProducts")
    }
    if (pathname.includes('Categories/'.toLowerCase()) || pathname.includes('Categories/')) {
      setOpenedRoute('Categories');
      setTypeOfProducts("allProducts");
      let currentCategory = window.location.href.split("/Categories/")[1].toLowerCase();
      if (products.products) {
        const categoryExist = ["computersandaccessoires", "dresses", "toys", "kitchentools", "phones", "books"].includes(currentCategory.toLowerCase());
        if (categoryExist) {
          categoryRouteElementsFn(currentCategory);
          setCategory(currentCategory);
        } else {
          categoryRouteElementsFn("computersAndAccessoires");
          setCategory("computersAndAccessoires");
        }
      }
    }
    if (pathname.includes('AllProducts'.toLowerCase()) || pathname.includes('AllProducts')) {
      setOpenedRoute('All Products');
      setTypeOfProducts("allProducts");
      filter(filtered, "allProducts")
    }
    if (pathname.includes('Favorites'.toLowerCase()) || pathname.includes('Favorites')) {
      setOpenedRoute('Favorites');
      setFiltered("allProductsLi");
      setTypeOfProducts("favorites");
      filter(null, "favorites")
    }
    if (pathname.includes('Ordered'.toLowerCase()) || pathname.includes('Ordered')) {
      setOpenedRoute('Ordered');
      setFiltered("allProductsLi");
      setTypeOfProducts("ordered");
      filter(null, "ordered")
    }
    if (pathname.includes('Contact'.toLowerCase()) || pathname.includes('Contact')) {
      setOpenedRoute('Contact')
    }
    if (pathname.includes('About'.toLowerCase()) || pathname.includes('About')) {
      setOpenedRoute('About')
    }
    if (pathname.includes('Manager'.toLowerCase()) || pathname.includes('Manager')) {
      setOpenedRoute('Manager')
    };
  }, [pathname]);

  // fetch all products from db
  useEffect(() => {
    axios.get('http://localhost:5001/isUser', { withCredentials: true }).then((res) => {
      setUser(res.data.isUser);
      setArrOfProductsStatus(res.data.arr);
      setUserEmail(res.data.email);
    }).catch(err => console.log("isUser req err", err.message));
    axios.get('http://localhost:5001/store', { withCredentials: true }).then(({ data }) => {
      setProducts(data.doc);
      setLoadingProducts(false);
    }).catch(err => console.log(err.message));
    // eslint-disable-next-line
  }, []);

  return (
    <div className='App'>
      <ProductsContext.Provider value={{
        products, layer, closeLayer, layerSideBar, showLayer, hideLayer, loading, setLoading
        , loadingProducts, user, setUser, setUserEmail, showCategories, setShowCategories, nav, header, allProductsParent, category, setCategory, openedRoute, setOpenedRoute, filter, filtered, filterLis, allProducts, allCategoryProducts, setAllCategoryProducts, categoryRouteProducts, categoryRouteElementsFn, typeOfProducts, setTypeOfProducts, setFiltered, setArrOfProductsStatus, userEmail
      }}>
        <Header />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Categories/:id" exact element={<CategoryRoute />} />
          <Route path="/AllProducts" exact element={<AllProductsRoute />} />
          <Route path="/Contact" exact element={<ContactRoute />} />
          <Route path="/SignUp" exact element={<SignUpRoute />} />
          <Route path="/SignIn" exact element={<LoginRoute />} />
          <Route path="/Favorites" exact element={<Favorites />} />
          <Route path="/Ordered" exact element={<Ordered />} />
          <Route path="/About" exact element={<About />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        <Footer />
        <SideBar />
      </ProductsContext.Provider>
    </div >
  )
}

export default App