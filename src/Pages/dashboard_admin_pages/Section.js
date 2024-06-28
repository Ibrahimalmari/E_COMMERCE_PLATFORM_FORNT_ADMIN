import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BsPencil, BsTrash, BsTable } from 'react-icons/bs';
import { ClipLoader } from 'react-spinners';
import { Link } from 'react-router-dom';
import '../../App.css';

export default function Section() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNumber, setPageNumber] = useState(0); // الصفحة الحالية
  const itemsPerPage = 5; // عدد العناصر في كل صفحة

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/section`);
        if(response.data.section){
        setData(response.data.section);
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

  // تابع لتنفيذ عملية البحث بناءً على الاسم
  const filteredData = data.filter((item) => {
    return item.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // حساب الصفحة الإجمالية
  const pageCount = Math.ceil(filteredData.length / itemsPerPage);

  // حساب البيانات المعروضة في الصفحة الحالية
  const displayedData = filteredData.slice(pageNumber * itemsPerPage, (pageNumber + 1) * itemsPerPage);

  // تغيير الصفحة
  const goToPage = (page) => {
    setPageNumber(page);
  };

  // دالة لحذف العنصر
  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/deletesection/${id}`);
      // تحديث البيانات بعد الحذف
      const updatedData = data.filter((item) => item.id !== id);
      setData(updatedData);
    } catch (error) {
      console.error('Error deleting item: ', error);
    }
  };

  return (
    <div className='main-container'>
      {loading ? (
        <div className='loading-container'>
          <ClipLoader color='#1F3750' loading={loading} size={50} />
        </div>
      ) : (
        <div className='row'>
          <div className='col-md-12'>
            <div className='card'>
              <div className='card-header justify-content-between align-items-center'>
                <h4 className='fw-bold'>
                  <BsTable size={24} color='#1F3750' className='me-1 mb-1' />
                  Section
                  <Link to='/Admin/Section/Add' className='btn btn-secondary float-end'>
                    Add Section
                  </Link>
                </h4>
              </div>
              <div className='card-body'>
                <input
                  type='text'
                  className='form-control mb-3'
                  placeholder='Search by name'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div style={{ overflowX: 'auto' }}>
                  <table className='table table-bordered table-striped'>
                    <thead className='text-white bg-dark'>
                      <tr>
                        <th scope='col'>Id</th>
                        <th scope='col'>Name</th>
                        <th scope='col'>Created By</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedData.map((item) => (
                        <tr key={item.id}>
                          <td>{item.id}</td>
                          <td>{item.name}</td>
                          <td>{item.create_section_admin ? item.create_section_admin.name : 'N/A'} - {item.create_section_admin ? item.create_section_admin.email : 'N/A'}</td>
                          <td>
                            <Link to={`EditSection/${item.id}`} className='btn btn-primary me-2'>
                              <BsPencil size={20} color='#fff' />
                            </Link>
                            <button className='btn btn-danger' onClick={() => deleteItem(item.id)}>
                              <BsTrash size={20} color='#fff' />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className='pagination justify-content-center'>
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
