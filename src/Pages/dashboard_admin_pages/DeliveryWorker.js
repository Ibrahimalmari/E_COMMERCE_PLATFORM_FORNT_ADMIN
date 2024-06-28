import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BsPencil, BsTrash, BsTable } from 'react-icons/bs';
import { ClipLoader } from 'react-spinners';
import { Link } from 'react-router-dom';
import './DeliveryWorker.css';

const DeliveryWorker = () => {
  const [deliveryWorkers, setDeliveryWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/delivery");
        if (response.data.status === 200) {
          setDeliveryWorkers(response.data.deliveryMen);
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

  const pageCount = Math.ceil(deliveryWorkers.length / itemsPerPage);

  const displayedData = deliveryWorkers.slice(pageNumber * itemsPerPage, (pageNumber + 1) * itemsPerPage);

  const goToPage = (page) => {
    setPageNumber(page);
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/deletedelivery/${id}`);
      const updatedData = deliveryWorkers.filter((item) => item.id !== id);
      setDeliveryWorkers(updatedData);
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
                  Delivery Workers
                  <Link to='/Admin/DeliveryWorker/Add' className='btn btn-secondary float-end'>
                    Add Delivery Worker
                  </Link>
                </h4>
              </div>
              <div className='card-body'>
                <div style={{ overflowX: 'auto' }}>
                  <table className='table table-bordered table-striped '>
                    <thead className='text-white bg-dark'>
                      <tr>
                        <th scope='col'>Id</th>
                        <th scope='col'>Name</th>
                        <th scope='col'>Email</th>
                        <th scope='col'>Phone</th>
                        <th scope='col'>Address</th>
                        <th scope='col'>Joining Date</th>
                        <th scope='col'>Vehicle Type</th>
                        <th scope='col'>Vehicle Number</th>
                        <th scope='col'>National Number</th>
                        <th scope='col'>ID photo</th>
                        <th scope='col'>Image of the vehicle</th>
                        <th scope='col'>image of the license</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedData.map((worker) => (
                        <tr key={worker.id}>
                          <td>{worker.id}</td>
                          <td>{worker.name}</td>
                          <td>{worker.email}</td>
                          <td>{worker.phone}</td>
                          <td>{worker.address}</td>
                          <td>{worker.joining_date}</td>
                          <td>{worker.vehicle_type}</td>
                          <td>{worker.vehicle_number}</td>
                          <td>{worker.NationalNumber}</td>
                          <td><img className="table-image" src={`http://127.0.0.1:8000/delivery_worker/${worker.PhotoOfPersonalID}`} alt={worker.name} /></td>
                          <td><img className="table-image" src={`http://127.0.0.1:8000/delivery_worker/${worker.vehicle_image}`} alt={worker.name} /></td>
                          <td><img className="table-image" src={`http://127.0.0.1:8000/delivery_worker/${worker.license_image}`} alt={worker.name} /></td>
                          <td className="d-flex pt-3">
                            <Link to={`EditDeliveryWorker/${worker.id}`} className='btn btn-primary me-2'>
                              <BsPencil size={15} color='#fff' />
                            </Link>
                            <button className='btn btn-danger' onClick={() => deleteItem(worker.id)}>
                              <BsTrash size={15} color='#fff' />
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
};

export default DeliveryWorker;
