import React, { useState, useEffect } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import { useNavigate, useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import '../../App.css';

const EditSection = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [name, setName] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/section/${id}`);
        const sectionData = response.data.section;
        setName(sectionData.name || '');
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, [id]);

  const validateForm = () => {
    const validationErrors = {};

    if (!name.trim() ) {
      validationErrors.name = 'Name is required';
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const isFormValid = validateForm();

    if (!isFormValid) {
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('_method', 'PUT');
    formDataToSend.append('name', name); 
    console.log(name);

    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/updatesection/${id}`, formDataToSend);
      if (response.data.status === 401 || response.data.status === 500) {
        console.log(response.data);
        swal('warning', response.data.message, 'warning');
      } else {
        console.log(response.data);
        swal('success', response.data.message, 'success').then(() => {
          navigate('/Admin/Section/');
        });
      }
    } catch (error) {
      console.error(error.message);
      swal('error', error.message, 'error');
    }
    finally {
      setLoading(false);
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
                <h4>Edit Section</h4>
              </div>
              <div className='card-body'>
                <form onSubmit={handleSubmit}>
                  <div className='col-md-6 mb-3'>
                    <label>Name</label>
                    <input
                      type='text'
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      name='name'
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                    />
                    {errors.name && <div className='invalid-feedback'>{errors.name}</div>}
                  </div>
                  <div className='col-md-12 mb-3'>
                    <button type='submit' className='btn btn-secondary float-end'>
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditSection;
