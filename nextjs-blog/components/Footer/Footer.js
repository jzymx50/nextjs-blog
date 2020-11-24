import React from 'react'
import { Link } from 'react-router-dom';
import '../CSS/Footer.css';
import Logo from '../Images/Logo1.svg';

function Footer(){
    return ( 
        <div className="footer">
            <p>Copyright &#169; Name Name</p>
            <Link to="/">
                <img id="logo" src={Logo} alt="logo"/>
            </Link>     
        </div>
    )
}
export default Footer;