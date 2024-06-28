import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BsPencil, BsTrash, BsTable } from 'react-icons/bs';
import { ClipLoader } from 'react-spinners';
import { Link } from 'react-router-dom';
import '../../App.css';

export default function SectionToStore() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/SectionToStore/`);
       if(response.data.Store_Section){
        setData(response.data.Store_Section);
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

  const pageCount = Math.ceil(data.length / itemsPerPage);

  const displayedData = data.slice(pageNumber * itemsPerPage, (pageNumber + 1) * itemsPerPage);

  const goToPage = (page) => {
    setPageNumber(page);
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/DeleteSectionToStore/${id}`);
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
              <div className='card-header'>
                <h4 className='fw-bold'>
                  <BsTable size={24} color='#1F3750' className='me-1 mb-1' />
                  Section to Store
                  <Link to='/Admin/Section/Add' className='btn btn-secondary float-end'>
                    Add Section to Store
                  </Link>
                </h4>
              </div>
              <div className='card-body'>
                <div style={{ overflowX: 'auto' }}>
                  <table className='table table-bordered table-striped table-hover'>
                    <thead className='text-white bg-dark'>
                      <tr>
                        <th scope='col'>Id</th>
                        <th scope='col'>Store Name</th>
                        <th scope='col'>Section Name</th>
                        <th scope='col'>Created By</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedData.map((item) => (
                        <tr key={item.id}>
                          <td>{item.id}</td>
                          <td>{item.store ? item.store.name : 'N/A'}</td>
                          <td>{item.section ? item.section.name : 'N/A'}</td>
                          <td>{item.create_section_to_store_admin ? `${item.create_section_to_store_admin.name} - ${item.create_section_to_store_admin.email}` : 'N/A'}</td>
                          <td>
                            <Link to={`EditSectionToStore/${item.id}`} className='btn btn-primary me-2'>
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
