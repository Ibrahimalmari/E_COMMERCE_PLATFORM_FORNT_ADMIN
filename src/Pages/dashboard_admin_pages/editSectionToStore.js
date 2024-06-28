import React, { useState, useEffect } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import { useNavigate, useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import '../../App.css';

const EditSectionToStore = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // تحديد معرف القسم المضاف إلى المتجر

  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState('');
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    Promise.all([
      axios.get('http://127.0.0.1:8000/api/section'),
      axios.get('http://127.0.0.1:8000/api/allstore'),
    ])
      .then(([sectionRes, storeRes]) => {
        if (sectionRes.data.status === 200) {
          setSections(sectionRes.data.section);
        }
        if (storeRes.data.status === 200) {
          setStores(storeRes.data.store);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        // يمكنك إضافة التعامل مع الأخطاء هنا
      });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/SectionToStore/${id}`);
        const Data = response.data.store_section;
  
        if (Data) {
          const { section_id, store_id } = Data;
          setSelectedSection(section_id);
          setSelectedStore(store_id);
        } else {
          console.error('data not found in response');
        }
      } catch (error) {
        console.error('Error fetching section data: ', error);
      }
    };
  
    fetchData();
  }, [id]);
  

  const validateForm = () => {
    const validationErrors = {};

    if (!selectedSection) {
      validationErrors.selectedSection = 'Please select a section';
    }
    if (!selectedStore) {
      validationErrors.selectedStore = 'Please select a store';
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
    formDataToSend.append('section_id', selectedSection);
    formDataToSend.append('store_id', selectedStore);

    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/UpdateSectionToStore/${id}`, formDataToSend);
      if (response.data.status === 401 || response.data.status === 500) {
        console.log(response.data);
        swal('warning', response.data.message, 'warning');
        
      } else {
        console.log(response.data);
        swal('success', response.data.message, 'success').then(() => {
          navigate('/Admin/Section/SectionToStore');
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
                <h4>Edit Section To Store</h4>
              </div>
              <div className='card-body'>
                <form onSubmit={handleSubmit}>
                  <div className='col-md-6 mb-3'>
                    <label>Select Store</label>
                    <select
                      className={`form-control ${errors.selectedStore ? 'is-invalid' : ''}`}
                      name='store_id'
                      value={selectedStore}
                      onChange={(e) => setSelectedStore(e.target.value)}>
                      <option value=''>Select Store</option>
                      {stores.map((store) => (
                        <option key={store.id} value={store.id}>
                          {store.name}
                        </option>
                      ))}
                    </select>
                    {errors.selectedStore && <div className='invalid-feedback'>{errors.selectedStore}</div>}
                  </div>
                  <div className='col-md-6 mb-3'>
                    <label>Select Section</label>
                    <select
                      className={`form-control ${errors.selectedSection ? 'is-invalid' : ''}`}
                      name='section_id'
                      value={selectedSection}
                      onChange={(e) => setSelectedSection(e.target.value)}>
                      <option value=''>Select Section</option>
                      {sections.map((section) => (
                        <option key={section.id} value={section.id}>
                          {section.name}
                        </option>
                      ))}
                    </select>
                    {errors.selectedSection && <div className='invalid-feedback'>{errors.selectedSection}</div>}
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

export default EditSectionToStore;
