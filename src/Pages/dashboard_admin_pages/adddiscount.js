import React, { useState, useEffect } from 'react';
import axios from "axios";
import swal from "sweetalert";
import "../../App.css";
import { ClipLoader } from 'react-spinners';

const AddDiscount = () => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [percentage, setPercentage] = useState('');
  const [value, setValue] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [conditions, setConditions] = useState('');
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [stores, setStore] = useState([]);  
  const [selectedstore, setSelectedStore] = useState(); 

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/allstore").then(res => {
      if (res.data.status === 200) {
        setStore(res.data.store);
        setLoading(false);
      }
    });
  }, []);

  const validateForm = () => {
    const validationErrors = {};

    if (!name.trim()) {
      validationErrors.name = "Name is required";
    }

    if (!code.trim()) {
      validationErrors.code = "Code is required";
    }

    if (!startDate.trim()) {
      validationErrors.startDate = "Start Date is required";
    }

    if (!endDate.trim()) {
      validationErrors.endDate = "End Date is required";
    }

    if (!selectedstore) {
      validationErrors.selectedstore = "Please select a store";
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

    const data = {
      name,
      code,
      percentage,
      value,
      start_date: startDate,
      end_date: endDate,
      conditions,
      store_id: selectedstore
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/discountstore/', data);
      swal("success", response.data.message, "success");
    } catch (error) {
      console.error('Error adding discount:', error);
      swal("error", "Failed to add discount", "error");
    } finally {
      setLoading(false);
    }
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
              <div className='card-header'>
                <h4>Add Discount</h4>
              </div>
              <div className='card-body'>
                <form onSubmit={handleSubmit}>
                  <div className="row align-items-center mt-4">
                    <div className="col">
                      <label>Name:</label>
                      <input
                        type="text"
                        className={`form-control ${errors.name ? "is-invalid" : ""}`}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>
                    <div className="col">
                      <label>Code:</label>
                      <input
                        type="text"
                        className={`form-control ${errors.code ? "is-invalid" : ""}`}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                      />
                      {errors.code && <div className="invalid-feedback">{errors.code}</div>}
                    </div>
                  </div>
                  <div className="row align-items-center mt-4">
                    <div className="col">
                      <label>Percentage:</label>
                      <input
                        type="text"
                        className={`form-control ${errors.percentage ? "is-invalid" : ""}`}
                        value={percentage}
                        onChange={(e) => setPercentage(e.target.value)}
                      />
                      {errors.percentage && <div className="invalid-feedback">{errors.percentage}</div>}
                    </div>
                    <div className="col">
                      <label>Value:</label>
                      <input
                        type="text"
                        className={`form-control ${errors.value ? "is-invalid" : ""}`}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                      />
                      {errors.value && <div className="invalid-feedback">{errors.value}</div>}
                    </div>
                  </div>
                  <div className="row align-items-center mt-4">
                    <div className="col">
                      <label>Start Date:</label>
                      <input
                        type="date"
                        className={`form-control ${errors.startDate ? "is-invalid" : ""}`}
                        value={startDate.split('T')[0]} // تقسيم النص واستخدام الجزء الخاص بالتاريخ فقط
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                      {errors.startDate && <div className="invalid-feedback">{errors.startDate}</div>}
                    </div>
                    <div className="col">
                      <label>End Date:</label>
                      <input
                        type="date"
                        className={`form-control ${errors.endDate ? "is-invalid" : ""}`}
                        value={endDate.split('T')[0]} // تقسيم النص واستخدام الجزء الخاص بالتاريخ فقط
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                      {errors.endDate && <div className="invalid-feedback">{errors.endDate}</div>}
                    </div>
                  </div>
                  <div className="col mb-3 mt-3">
                    <label>Select Store</label>
                    <select
                      className={`form-control  ${errors.selectedstore ? "is-invalid" : ""}`}
                      name='store_id'
                      value={selectedstore || ''}
                      onChange={(e) => setSelectedStore(e.target.value)}>
                      <option value=''>Select Store</option>
                      {stores.map((store) => (
                        <option key={store.id} value={store.id}>
                          {store.name}
                        </option>
                      ))}
                    </select>
                    {errors.selectedstore && (
                      <div className='invalid-feedback'>
                        {errors.selectedstore}
                      </div>
                    )}
                  </div>
                  <div className="col mt-2 mb-2">
                    <label>Conditions:</label>
                    <textarea
                      className={`form-control ${errors.conditions ? "is-invalid" : ""}`}
                      value={conditions}
                      onChange={(e) => setConditions(e.target.value)}
                    />
                    {errors.conditions && <div className="invalid-feedback">{errors.conditions}</div>}
                  </div>
                  <div className="form-group">
                    <button type="submit" className="btn btn-secondary">Add Discount</button>
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

export default AddDiscount;
