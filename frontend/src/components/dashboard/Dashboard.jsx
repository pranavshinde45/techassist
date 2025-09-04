import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { searchContext } from '../contexts/searchContext';
import {ShimmerCards} from '../Shrimmer';
import { Link } from "react-router-dom";
import Footer from '../Footer';
import Navbar from '../Navbar';

function Dashboard() {
  const [shops, setShops] = useState([]);
  const { searchText } = useContext(searchContext);
  const [filteredShops, setFilteredShops] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const res = await axios.get("https://techassist-9iyg.onrender.com/techShops/getAllShops");
      console.log(res.data.allShops)
      setShops(res.data.allShops);
    };
    getData();
  }, []);

  useEffect(() => {
    if (searchText === "") {
      setFilteredShops(shops);
    } else {
      const filtered = shops.filter((shop) =>
        shop.name?.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredShops(filtered);
    }
  }, [searchText, shops]);



  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: '#f9f9f9' }}>
      <Navbar />
      {shops.length === 0 ?<ShimmerCards />:
      <main className="flex-grow-1" style={{ padding: "20px 110px" }}>
        <div className="shops-container">
          {filteredShops.map((shop) => (
            <div key={shop._id}>
              <Link to={`shop/${shop._id}`}>
                <div className="shop-card">
                  {shop.image && (
                    <img className="shopImage" src={shop.image} alt={shop.name} style={{ width: "200px", height: "auto", borderRadius: "8px" }} />
                  )}
                </div>
              </Link>
              <h5><i>{shop.name}</i></h5>
            </div>
          ))}
        </div>
      </main>}
      <Footer />
    </div>
  );
}

export default Dashboard;
