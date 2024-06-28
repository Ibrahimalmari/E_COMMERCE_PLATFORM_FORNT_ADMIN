import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { BsPencil, BsTrash, BsTable } from 'react-icons/bs';
import { Link } from 'react-router-dom';

const Discount = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNumber, setPageNumber] = useState(0);
  const discountsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/discount');
        if (response.data.status === 200) {
          setData(response.data.discounts);
          setLoading(false);
        } else {
          console.error('Error fetching data: ', response.data.message);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/deletediscount/${id}`);
      const updatedData = data.filter((item) => item.id !== id);
      setData(updatedData);
    } catch (error) {
      console.error('Error deleting discount: ', error);
    }
  };

  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageCount = Math.ceil(filteredData.length / discountsPerPage);

  const displayedData = filteredData.slice(pageNumber * discountsPerPage, (pageNumber + 1) * discountsPerPage);

  const goToPage = (page) => {
    setPageNumber(page);
  };

  return (
    <div className='main-container'>
      {loading ? (
        <div className="loading-container">
          <ClipLoader color="#1F3750" loading={loading} size={50} />
        </div>
      ) : (
        <div className='row'>
          <div className='col-md-12'>
            <div className='card'>
              <div className='card-header justify-content-between align-items-center'>
                <h4 className='fw-bold'>
                  <BsTable size={24} color="#1F3750" className="me-1 mb-1" />
                  Discounts
                  <Link to="/Admin/Discount/Add" className='btn btn-secondary float-end'>Add Discount</Link>
                </h4>
              </div>
              <div className='card-body'>
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Search by name or code"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {data && data.length >= 0 ? (
                  <div className="table-responsive"> {/* استخدام الفئة لجعل الجدول قابل للتمرير */}
                    <table className="table table-bordered table-striped">
                      <thead className='bg-dark text-white'>
                        <tr>
                          <th scope="col">Id</th>
                          <th scope="col">Name</th>
                          <th scope="col">Code</th>
                          <th scope="col">Percentage</th>
                          <th scope="col">Value</th>
                          <th scope="col">Start Date</th>
                          <th scope="col">End Date</th>
                          <th scope="col">Conditions</th>
                          <th scope="col">Store Name</th>
                          <th scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayedData.map((item) => (
                          <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.code}</td>
                            <td>{item.percentage ? item.percentage : '-'}</td>
                            <td>{item.value ? item.value : '-'}</td>
                            <td>{item.start_date}</td>
                            <td>{item.end_date}</td>
                            <td>{item.conditions ? item.conditions : '-'}</td>
                            <td>{item.store.name ? item.store.name : '-'}</td>
                            <td>
                              <Link to={`EditDiscount/${item.id}`} className="btn btn-primary me-2">
                                <BsPencil size={20} color="#fff" />
                              </Link>
                              <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>
                                <BsTrash size={20} color="#fff" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div>No data available</div>
                )}
                <div className="pagination justify-content-center">
                  {[...Array(pageCount)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToPage(index)}
                      className={`btn btn-primary ${index === pageNumber ? 'active' : ''}`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discount;
