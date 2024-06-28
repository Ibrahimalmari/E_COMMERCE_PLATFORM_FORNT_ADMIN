import React, { useState, useEffect } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import { useNavigate, useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

const EditDeliverWorker = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [vehicleImage, setVehicleImage] = useState([]);
  const [licenseImage, setLicenseImage] = useState([]);
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [nationalNumber, setNationalNumber] = useState('');
  const [photoOfPersonalID, setPhotoOfPersonalID] = useState('');
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesResponse, deliveryManResponse] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/role'),
          axios.get(`http://127.0.0.1:8000/api/delivery/${id}`), // Replace 123 with the actual seller ID
        ]);

        if (rolesResponse.data.status === 200) {
          setJobs(rolesResponse.data.roles);
        }

        if (deliveryManResponse.data.status === 200) {
          const deliveryData = deliveryManResponse.data.deliveryMan;
          setName(deliveryData.name || '');
          setEmail(deliveryData.email || '');
          setPhone(deliveryData.phone || '');
          setAddress(deliveryData.address || '');
          setJoiningDate(deliveryData.joining_date || '');
          setVehicleImage(deliveryData.vehicle_image || []);
          setLicenseImage(deliveryData.license_image || []);
          setVehicleType(deliveryData.vehicle_type || '');
          setVehicleNumber(deliveryData.vehicle_number || '');
          setNationalNumber(deliveryData.NationalNumber || '');
          setSelectedJob(deliveryData.role_id || '');
          setPhotoOfPersonalID(deliveryData.PhotoOfPersonalID || '');
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

    if (!address.trim()) {
      validationErrors.address = 'Address is required';
    }

    if (!joiningDate.trim()) {
      validationErrors.joiningDate = 'Joining date is required';
    }

    if (!vehicleType.trim()) {
      validationErrors.vehicleType = 'Vehicle type is required';
    }

    if (!vehicleNumber.trim()) {
      validationErrors.vehicleNumber = 'Vehicle number is required';
    }

    if (!nationalNumber.trim()) {
      validationErrors.nationalNumber = 'National number is required';
    }

    if (!selectedJob) {
      validationErrors.selectedJob = 'Please select a role';
    }

    if (vehicleImage && vehicleImage.length === 0) {
      validationErrors.vehicleImage = 'Please upload at least one image for the vehicle';
    }

    if (licenseImage && licenseImage.length === 0) {
      validationErrors.licenseImage = 'Please upload at least one image for the license';
    }

    if (!photoOfPersonalID) {
      validationErrors.photoOfPersonalID = 'Please upload a photo of your personal ID';
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const calculateMaxDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    const name = e.target.name;
  
    if (files.length === 0) {
      return;
    }
  
    if (name === 'vehicleImage') {
      setVehicleImage([...vehicleImage, ...files]);
    } else if (name === 'licenseImage') {
      setLicenseImage([...licenseImage, ...files]);
    } else if (name === 'photoOfPersonalID') {
      setPhotoOfPersonalID(files[0]);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const isFormValid = validateForm();
  
    if (!isFormValid) {
      setLoading(false);
      return;
    }
  
    // Check if there are any new images to upload
    const hasImages = vehicleImage.length > 0 || licenseImage.length > 0 || photoOfPersonalID;
  
    if (!hasImages) {
      // No new images, show success message or handle accordingly
      swal('success', 'No changes were made.', 'success');
      setLoading(false);
      return;
    }
  
    const formDataToSend = new FormData();
    formDataToSend.append('_method', 'PUT');
    formDataToSend.append('name', name);
    formDataToSend.append('email', email);
    formDataToSend.append('phone', phone);
    formDataToSend.append('address', address);
    formDataToSend.append('joining_date', joiningDate);
    formDataToSend.append('vehicle_type', vehicleType);
    formDataToSend.append('vehicle_number', vehicleNumber);
    formDataToSend.append('NationalNumber', nationalNumber);
    formDataToSend.append('role_id', selectedJob);
    formDataToSend.append('PhotoOfPersonalID', photoOfPersonalID);
  
    // Handle vehicle image if not empty
    if (Array.isArray(vehicleImage) && vehicleImage.length > 0) {
      vehicleImage.forEach((image) => {
        formDataToSend.append('vehicle_image', image);
      });
    }
  
    // Handle license image if not empty
    if (Array.isArray(licenseImage) && licenseImage.length > 0) {
      licenseImage.forEach((image) => {
        formDataToSend.append('license_image', image);
      });
    }
  
    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/updatedelivery/${id}}`, formDataToSend);
      if (response.data.status === 401 || response.data.status === 500) {
        console.log(response.data);
        swal('warning', response.data.message, 'warning');
      } else {
        console.log(response.data);
        swal('success', response.data.message, 'success');
      }
    } catch (error) {
      console.error(error.message);
      swal('error', error.message, 'error');
    } finally {
      setLoading(false);
    }
  };
  
  
  return (
    <div className="main-container">
      {loading ? (
        <div className="loading-container">
          <ClipLoader color="#1F3750" loading={loading} size={50} />
        </div>
      ) : (
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h4>Edit Deliver Worker</h4>
              </div>
              <div className='card-body'>
              <form onSubmit={handleSubmit}>
                {/* Add your form fields here */}
                {/* Name */}
                <div className="row align-items-center mt-4">
                <div className="col">
                  <label>Name:</label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                {/* Email */}
                <div className="col">
                  <label>Email:</label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
               </div>
                {/* Address */}
                <div className="row align-items-center mt-4">
                <div className="col">
                  <label>Address:</label>
                  <input
                    type="text"
                    className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                </div>

                {/* Joining Date */}
                <div className="col">
                  <label>Joining Date:</label>
                  <input
                    type="date"
                    className={`form-control ${errors.joiningDate ? 'is-invalid' : ''}`}
                    value={joiningDate}
                    max={calculateMaxDate()}
                    onChange={(e) => setJoiningDate(e.target.value)}
                  />
                  {errors.joiningDate && <div className="invalid-feedback">{errors.joiningDate}</div>}
                </div>
              </div>
                {/* Vehicle Type */}
              <div className="row align-items-center mt-4">
                <div className="col">
                  <label>Vehicle Type:</label>
                  <input
                    type="text"
                    className={`form-control ${errors.vehicleType ? 'is-invalid' : ''}`}
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                  />
                  {errors.vehicleType && <div className="invalid-feedback">{errors.vehicleType}</div>}
                </div>

                {/* Vehicle Number */}
                <div className="col">
                  <label>Vehicle Number:</label>
                  <input
                    type="text"
                    className={`form-control ${errors.vehicleNumber ? 'is-invalid' : ''}`}
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                  />
                  {errors.vehicleNumber && <div className="invalid-feedback">{errors.vehicleNumber}</div>}
                </div>
               </div>
                {/* National Number */}
               <div className="row align-items-center mt-4">
                <div className="col">
                  <label>National Number:</label>
                  <input
                    type="text"
                    className={`form-control ${errors.nationalNumber ? 'is-invalid' : ''}`}
                    value={nationalNumber}
                    onChange={(e) => setNationalNumber(e.target.value)}
                  />
                  {errors.nationalNumber && <div className="invalid-feedback">{errors.nationalNumber}</div>}
                </div>

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
                  </div>
                {/* Phone */}
                <div className="col">
                  <label>Phone:</label>
                  <input
                    type="text"
                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                 </div>
                {/* Photo of Personal ID */}
                <div className="form-group">
                  <label>Photo of Personal ID:</label>
                  <input
                    type="file"
                    className={`form-control ${errors.photoOfPersonalID ? 'is-invalid' : ''}`}
                    name="photoOfPersonalID"
                    onChange={handleFileChange}
                  />
                  {errors.photoOfPersonalID && <div className="invalid-feedback">{errors.photoOfPersonalID}</div>}
                </div>

                {/* Vehicle Image */}
                <div className="form-group">
                  <label>Vehicle Image:</label>
                  <input
                    type="file"
                    className={`form-control ${errors.vehicleImage ? 'is-invalid' : ''}`}
                    name="vehicleImage"
                    onChange={handleFileChange}
                    multiple
                  />
                  {errors.vehicleImage && <div className="invalid-feedback">{errors.vehicleImage}</div>}
                </div>

                {/* License Image */}
                <div className="form-group">
                  <label>License Image:</label>
                  <input
                    type="file"
                    className={`form-control ${errors.licenseImage ? 'is-invalid' : ''}`}
                    name="licenseImage"
                    onChange={handleFileChange}
                    multiple
                  />
                  {errors.licenseImage && <div className="invalid-feedback">{errors.licenseImage}</div>}
                </div>

                {/* Submit Button */}
                <div className="form-group">
                  <button type="submit" className="btn btn-secondary">Submit</button>
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

export default EditDeliverWorker;
