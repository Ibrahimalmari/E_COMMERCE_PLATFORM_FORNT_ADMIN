import React, { useState ,useEffect } from 'react';
import axios from "axios";
import swal from "sweetalert";
import "../../App.css";
import { ClipLoader } from 'react-spinners';


// import {useNavigate} from "react-router-dom";

const AddSeller = () => {
//   const navigate = useNavigate()

  const [name ,setName] = useState('')
  const [email ,setEmail] = useState('')
  const [address ,setAddress] = useState('')
  const [gender ,setGenger] = useState('')
  const [DateOfBirth, SetDateOfBirth] = useState('')
  const [phone ,setPhone] = useState('')
  const [NationalNumber ,setNationalNumber] = useState('')
  const [password ,setPassword] = useState('')
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState();
  const [image ,setImage] = useState([]);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);

     
  useEffect(() => {
     axios.get("http://127.0.0.1:8000/api/role").then(res =>{
        if(res.data.status === 200 ){
         setJobs(res.data.roles)
        console.log(res.data.roles)
          setLoading(false);

        }
     })
  }, [])

  const calculateMaxDateOfBirth = () => {  // for select date_of_birth >= 18 
    const today = new Date();
    const maxDateOfBirth = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return maxDateOfBirth.toISOString().split('T')[0];
  };  

  
  
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const validationErrors = {};

    if (!name.trim()) {
      validationErrors.name = "Name is required";
    }

    if (!email.trim()) {
      validationErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      validationErrors.email = "Email address is invalid";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const validDomains = ['com', 'org', 'edu', 'gov'];
  
      if (!emailRegex.test(email)) {
        validationErrors.email = 'Invalid email address format';
      } else {
        const domain = email.split('@')[1];
        const domainParts = domain.split('.');
        const topLevelDomain = domainParts[domainParts.length - 1].toLowerCase();
  
        if (!validDomains.includes(topLevelDomain)) {
          validationErrors.email = 'Invalid top-level domain';
        }
      }
    }

    if (!address.trim()) {
      validationErrors.address = "Address is required";
    }

    if (!gender) {
      validationErrors.gender = "Gender is required";
    }

    if (!DateOfBirth) {
      validationErrors.DateOfBirth = "DateOfBirth is required";
    }

    if (!phone.trim()) {
      validationErrors.phone = "Phone is required";
    }
    if (!selectedJob) {
        validationErrors.selectedJob = 'Please select a role';
      }
  
      if (image.length === 0) {
        validationErrors.image = 'Please upload at least one image';
      }

    if (!NationalNumber.trim()) {
      validationErrors.NationalNumber = "National Number is required";
    }

    if (!password.trim()) {
      validationErrors.password = "Password is required";
    }

    if (!confirmPassword.trim()) {
      validationErrors.confirmPassword = "Confirm Password is required";
    } else if (confirmPassword !== password) {
      validationErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };



  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    setImage([...image, ...selectedFiles]);
  }
 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

        // Check if passwords match
        if (password !== confirmPassword) {
            swal("error", "Passwords do not match", "error");
            setLoading(false);
            return;
          }
      
          const isFormValid = validateForm();

          if (!isFormValid) {
            setLoading(false);
            return;
          }

  const formDataToSend = new FormData();

  formDataToSend.append('name', name);
  formDataToSend.append('email', email);
  formDataToSend.append('address', address);
  formDataToSend.append('gender', gender);
  formDataToSend.append('phone', phone);
  image.forEach((image) => {
    formDataToSend.append('image', image);
  });
  formDataToSend.append('DateOfBirth', DateOfBirth);
  formDataToSend.append('NationalNumber',NationalNumber);
  console.log(NationalNumber);
  formDataToSend.append('password', password);
  formDataToSend.append('role_id', selectedJob);
  if (!selectedJob) {
    console.error('No role selected'); // Check if selectedJob is undefined or empty
    return; // Exit the function if selectedJob is not set
  }
  else{
    console.log(selectedJob);
  }

  try {
    const response = await axios.post('http://127.0.0.1:8000/api/sellerRegister/', formDataToSend);
    if(response.data.status === 401 || response.data.status === 500  ){
      console.log(response.data);
     swal("warning",response.data.message,"warning")
    }
    else{
    console.log(response.data);
    swal("success",response.data.message,"success")
    // navigate('/seller/Dashboard');
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
                  Add Seller
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
        </div>
        <div className="row align-items-center mt-4">
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
      </div>
      <br/>
       {/* Identity Photo */}
       <div className="form-group">
        <label>Identity Photo:</label>
        <input
          type="file"
          name="image"
          className={`form-control-file ${errors.image ? "is-invalid" : ""}`}
          onChange={handleFileChange}
        />
         {errors.image && <div className="invalid-feedback">{errors.image}</div>}
      </div>
        <div className="row align-items-center mt-4">
           {/* Address */}
      <div className="col">
        <label>Address:</label>
        <input
          type="text"
          className={`form-control ${errors.address ? "is-invalid" : ""}`}
          name="address"
          value={address}
          onChange={(e) =>{setAddress(e.target.value)}}
        />
         {errors.address && <div className="invalid-feedback">{errors.address}</div>}
      </div>
         {/* Gender */}
      <div className="col">
        <label>Gender:</label>
        <select
          className={`form-control ${errors.gender ? "is-invalid" : ""}`}
          name="gender"
          value={gender}
          onChange={(e) =>{setGenger(e.target.value)}}
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
      </div>
         </div>
      <div className="row align-items-center mt-4">
       {/* role */}
       <div className="col">
        <label>role:</label>
        <select
          className={`form-control  ${errors.selectedJob ? "is-invalid" : ""}`} 
          name="role_id"
          value={selectedJob}
          onChange={(e) =>{setSelectedJob(e.target.value)}}
        >
          <option value="">Select role</option>
           {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.name}
            </option>
          ))}
        </select>
        {errors.selectedJob && (
             <div className='invalid-feedback'>
            {errors.selectedJob}
              </div>
         )}    
         </div>
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
        </div>
      <div className="row align-items-center mt-4">
            {/* DateOfBirth */}
            <div className="col">
        <label>DateOfBirth:</label>
        <input
          type="date"
          className={`form-control ${errors.DateOfBirth ? "is-invalid" : ""} `}
          name="DateOfBirth"
          value={DateOfBirth}
          max={calculateMaxDateOfBirth()}
          onChange={(e) =>{SetDateOfBirth(e.target.value)}}
        />
         {errors.DateOfBirth && <div className="invalid-feedback">{errors.DateOfBirth}</div>}
      </div>
       {/* Personal Number */}
  <div className="col">
        <label>National Number:</label>
        <input
          type="text"
          className={`form-control ${errors.NationalNumber ? "is-invalid" : ""}  `}
          name="NationalNumber"
          value={NationalNumber}
          onChange={(e) =>{setNationalNumber(e.target.value)}}
        />
         {errors.NationalNumber && <div className="invalid-feedback">{errors.NationalNumber}</div>}
        </div>
        </div>
        <br/>
        <div className="row align-items-center mt-4">
      {/* Password */}
      <div className="col">
        <label>Password:</label>
        <input
          type="password"
          className={`form-control ${errors.password ? "is-invalid" : ""} `}
          name="password"
          value={password}
          onChange={(e) =>{setPassword(e.target.value)}}
        />
         {errors.password && <div className="invalid-feedback">{errors.password}</div>}
      </div>
      <div className="col">
          <label>Confirm Password:</label>
          <input
            type="password"
            className={`form-control ${errors.confirmPassword ? "is-invalid" : ""} `}
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value) }}
          />
           {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
        </div>

        </div>
        <br/>
         {/* Submit Button */}
      <div className="form-group">
        <button type="submit" className="btn btn-secondary">
          Register
        </button>
          </div>
        </form>
       </div>
     </div>
    </div>  
   </div>
      )}
  </div>
  )}


export default AddSeller;