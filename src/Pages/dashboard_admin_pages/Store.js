import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { InputGroup, FormControl, Pagination, Button } from 'react-bootstrap';
import './store.css';

export default function Store() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/allstore/');
        if(response.data.store){
        setData(response.data.store);
        setLoading(false);
        }
        else{
          setLoading(false); 
          }
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/deletestore/${id}`);
      setData(data.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting seller: ', error);
    }
  };

  const filteredData = data.filter(item => {
    return (
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.seller.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="main-container">
      {loading ? (
        <div className="loading-container">
          <ClipLoader color="#1F3750" loading={loading} size={50} />
        </div>
      ) : (
        <>
          <div className="search-container">
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </div>
          <div className="restaurant-list">
            {currentItems.map(item => (
              <div key={item.id} className="restaurant-card">
                <div className="restaurant-cover">
                  <img src={`http://127.0.0.1:8000/stores/${item.coverPhoto}`} alt={item.name} className="cover-image" />
                </div>
                <div className="restaurant-info">
                  <h4 className="restaurant-name">{item.name}</h4>
                  <hr style={{ width: '50%' }} />
                  <p className="restaurant-address">{item.description}</p>
                  <p className="restaurant-hours">
                    Store Owner: {item.seller ? item.seller.name : 'N/A'} <br />
                    Email : {item.seller.email}
                    <br />
                    Phone : {item.seller.phone}
                  </p>
                  <div className="actions">
                    <Link to={`EditStore/${item.id}`} className="btn btn-success btn-sm">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(item.id)} className="btn btn-danger btn-sm">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <PaginationWrapper totalItems={filteredData.length} itemsPerPage={itemsPerPage} paginate={paginate} />
        </>
      )}
    </div>
  );
}

const PaginationWrapper = ({ totalItems, itemsPerPage, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination justify-content-center">
        {pageNumbers.map(number => (
          <li key={number} className="page-item">
            <button onClick={() => paginate(number)} className="page-link">
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};
