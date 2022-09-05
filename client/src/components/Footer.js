import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom';
import { ProductsContext } from '../App';

const Footer = () => {
    const { openedRoute } = useContext(ProductsContext);
    return (
        <div className="footer">
            {
                (openedRoute === "Home" || openedRoute === 'All Products') ? <div className="back-to-top"><a href="#header">Back To Top</a></div> : ""
            }
            <div className='footer-one'>
                <div className='footer-one-icon-and-name'>
                    <div className='footer-one-icon'>
                        <i className='fa fa-store-alt' />
                    </div>
                    <div className='footer-one-name'>
                        <span>World Wide</span>
                        <span>E-Commerce Store</span>
                    </div>
                </div>
                <div className='footer-one-ul'>
                    <ul>
                        <li><NavLink to='/About'>about</NavLink></li>
                        <li><NavLink to='/Contact'>contact</NavLink></li>
                    </ul>
                </div>
            </div>
            <div className='footer-two'>
                <a href="https://www.linkedin.com/in/hamza-ikram-25961b243"><i className="fa-brands fa-linkedin" /></a>Linkedin
                <a href="https://web.facebook.com/profile.php?id=100084920383940"><i className="fa-brands fa-facebook-square" /></a>Facebook
                <a href="https://twitter.com/kurusaki_hamza/"><i className="fa-brands fa-twitter-square" /></a>Twitter
                <a href="https://github.com/kurusaki-hamza"><i className="fa-brands fa-github-square" /></a>Github
                <a href="mailto:hamza.ikram.1120@gmail.com"><i className="fa fa-envelope" /></a>Gmail
            </div>
            <div className='footer-three'>
                &copy; 2007-2022 copyRights Reserved, <i className="fa fa-shopping-cart" /> E-Commerce Company
            </div>
        </div >
    )
}

export default Footer;