import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BsPencil, BsTrash, BsTable } from 'react-icons/bs';
import { ClipLoader } from 'react-spinners';
import { Link } from 'react-router-dom';
import swal from "sweetalert";
import "../../App.css";
import "../dashboard_admin_pages/seller.css"

export default function Seller() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNumber, setPageNumber] = useState(0); // الصفحة الحالية
  const sellersPerPage = 2; // عدد البائعين في كل صفحة

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/seller/`);
        if(response.data.seller){
        setData(response.data.seller);
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
      await axios.delete(`http://127.0.0.1:8000/api/deleteseller/${id}`);
      setData(data.filter(item => item.id !== id));
      swal("Success", "Seller deleted successfully", "success");
    } catch (error) {
      console.error('Error deleting seller: ', error);
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 500) {
          swal("Error", "An error occurred while deleting the seller", "error");
        }
      } else {
        swal("Error", "An error occurred while deleting the seller", "error");
      }
    }
  };

  // تابع لتنفيذ عملية البحث بناءً على الاسم أو البريد الإلكتروني أو الرقم الوطني
  const filteredData = data.filter(item => {
    return (
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.NationalNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // حساب عدد الصفحات الإجمالي
  const pageCount = Math.ceil(filteredData.length / sellersPerPage);

  // حساب البائعين المعروضين في الصفحة الحالية
  const sellersDisplayed = filteredData.slice(pageNumber * sellersPerPage, (pageNumber + 1) * sellersPerPage);

  // تغيير الصفحة
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
                  Seller
                  <Link to="/Admin/Seller/Add" className='btn btn-secondary float-end'>Add Seller</Link>
                </h4>
              </div>
              <div className='card-body'>
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Search by name, email, or national number"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="table-responsive">
                  <table className="table table-bordered table-striped">
                    <thead className='bg-dark text-white'>
                      <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Personal Number</th>
                        <th scope="col">Address</th>
                        <th scope="col">Gender</th>
                        <th scope="col">Photo Of Personal ID</th>
                        <th scope="col">Phone</th>
                        <th scope="col">DateOfBirth</th>
                        <th scope="col">Status</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sellersDisplayed.map((item) => (
                        <tr key={item.id}>
                          <td>{item.id}</td>
                          <td>{item.name}</td>
                          <td>{item.email}</td>
                          <td>{item.NationalNumber}</td>
                          <td>{item.address}</td>
                          <td>{item.gender}</td>
                          <td>
                            <img width="75px" src={`http://127.0.0.1:8000/seller_men/${item.PhotoOfPersonalID}`} alt={item.name} />
                          </td>
                          <td>{item.phone}</td>
                          <td>{item.DateOfBirth}</td>
                          <td>{item.status}</td>
                          <td>
                            <Link to={`EditSeller/${item.id}`} className="btn btn-primary me-2">
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
}
