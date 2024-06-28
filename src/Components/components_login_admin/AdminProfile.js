import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
import "../../App.css";
import { ClipLoader } from 'react-spinners';


const AdminProfile = () => {


  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
//   const [address, setAddress] = useState('');
  const [data, setData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  const id = localStorage.getItem('id');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ adminResponse] = await Promise.all([
          axios.get(`http://127.0.0.1:8000/api/admin/${id}`),
          setLoading(false)

        ]);

        if (adminResponse.data.status === 200) {
          const adminData = adminResponse.data.admin;
          setData(adminData);
          setName(adminData.name || '');
          setEmail(adminData.email || '');
        //   setAddress(adminData.address || '');
          setPhone(adminData.phone || '');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  const validateForm = () => {
    const validationErrors = {};

    if (!name.trim()) {
      validationErrors.name = 'Name is required';
    }

    if (!email.trim()) {
      validationErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      validationErrors.email = 'Email address is invalid';
    }

    if (!phone.trim()) {
      validationErrors.phone = 'Phone is required';
    }

    // if (!address.trim()) {
    //   validationErrors.address = 'Address is required';
    // }


    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)

    const isFormValid = validateForm();

    if (!isFormValid) {
      setLoading(false)
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('_method', 'PUT');
    formDataToSend.append('name', name);
    formDataToSend.append('email', email);
    // formDataToSend.append('address', address);
    formDataToSend.append('phone', phone);
    
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/updateadminprofile/${id}`,
        formDataToSend);

        if(response.data.status === 401|| response.data.status === 500){
          console.log(response.data);
           swal("warning",response.data.message,"warning")
          }
          else{
          console.log(response.data);
          swal("success",response.data.message,"success")
          }
        } catch (error) {
          console.error(error.message);
          swal("error",error.message,"error")
        }
        finally {
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
                <h4>
                  Edit Admin Profile
                </h4>
            </div>
         <div className='card-body'>
        <form onSubmit={handleSubmit}>
        <div className="row align-items-center">  
        <div className="form-group">
        <label>Name:</label>
        <input
          type="text"
          className={`form-control ${errors.name ? "is-invalid" : ""}`}
          name="name"
          value={name}
          onChange={(e) =>{setName(e.target.value)}}
        />
         {errors.name && <div className="invalid-feedback">{errors.name}</div>}
      </div>
          {/* Email */}
      <div className="col">
        <label>Email:</label>
        <input
          type="email"
          className={`form-control ${errors.email ? "is-invalid" : ""}`}
          name="email"
          value={email}
          onChange={(e) =>{setEmail(e.target.value)}}
        />
         {errors.email && <div className="invalid-feedback">{errors.email}</div>}
      </div>
         {/* Address */}
      {/* <div className="col">
        <label>Address:</label>
        <input
          type="text"
          className={`form-control ${errors.address ? "is-invalid" : ""}`}
          name="address"
          value={address}
          onChange={(e) =>{setAddress(e.target.value)}}
        />
         {errors.address && <div className="invalid-feedback">{errors.address}</div>}
      </div> */}
      
      {/* Phone */}
      <div className="col">
        <label>Phone:</label>
        <input
          type="text"
          className={`form-control ${errors.phone ? "is-invalid" : ""} `}
          name="phone"
          value={phone}
          onChange={(e) =>{setPhone(e.target.value)}}
        />
         {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
      </div>
      {/* Submit Button */}
      <div className="form-group mt-3">
        <button type="submit" className="btn btn-secondary">
          Update
        </button>
           </div>
          </div>
        </form>
       </div>
     </div>
    </div>  
   </div>
      )}
  </div>
  )}


export default AdminProfile;
