import React from "react";

const Navbar = () =>{
    
    return       <nav className="main-header navbar navbar-expand-md navbar-light navbar-white">
    <div className="container">
      <a href="/" className="navbar-brand">
        <img src="../../dist/img/logo-new.png" alt="plugin" className="img-size-32" style={{opacity: '.8'}} />
        <span className="brand-text font-weight-normal"> Plugin Pollution Tracker</span>
      </a>
      {/* Right navbar links */}
      <ul className="order-1 order-md-3 navbar-nav navbar-no-expand ml-auto">
        <li className="nav-item">
        {/* <button type="button" className="btn  btn-outline-dark">Wallet Connect</button> */}
        </li>
      </ul>
    </div>
  </nav>
}

export default Navbar;