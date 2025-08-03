import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { searchContext } from './contexts/searchContext';
import { AuthContext } from './contexts/authContext';
function Navbar() {
    let searchText = '';
    let setSearchText = () => {};
    const context = useContext(searchContext);
    if (context) {
       searchText = context.searchText;
       setSearchText = context.setSearchText;
    }
    const location = useLocation();
    const isDashboard = location.pathname === "/";

    const {currUser,setCurrUser}=useContext(AuthContext)
    const handleLogout=()=>{
        localStorage.removeItem("token");
        localStorage.removeItem("userId")
        localStorage.removeItem("role")
        setCurrUser(null)
    }

    const role=localStorage.getItem("role")
    return (
        <nav className="navbar navbar-expand-lg border-bottom sticky-top" style={{ backgroundColor: "aliceblue" }}>
            <div className="container-fluid p-2">
                <Link className="navbar-brand ps-3" to="/"><i className="fas fa-screwdriver-wrench"></i></Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse ps-2" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to="/">Explore</Link>
                        </li>
                    </ul>
                    {
                        isDashboard && <form className="d-flex" role="search">
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" style={{ width: "18rem" }} onChange={(e) => setSearchText(e.target.value)} />
                            <button className="btn btn-outline-success" type="submit">Search</button>
                        </form>
                    }
                    <div className="navbar-nav ms-auto pe-3">
                        {role==="owner" &&<Link className="nav-link" to="/newShop" style={{ color: '#4B7BEC', fontWeight: '600', fontSize: '16px', }}>Create a TechShop</Link>}
                        <Link className="nav-link" to="/" style={{ color: '#D64545', fontWeight: '700', fontSize: '16px' }}>
                        <button style={{backgroundColor:"aliceblue",border:"none"}} onClick={handleLogout}>Logout</button>
                        </Link>
                    </div>

                </div>
            </div>
        </nav>
    );
}

export default Navbar;