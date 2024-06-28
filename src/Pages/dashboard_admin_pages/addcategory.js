import React , { useState  } from 'react';
import axios from "axios";
import swal from "sweetalert";
import "../../App.css";
//  import {useNavigate} from "react-router-dom";

const  AddCategory = ({ handleAddCategory }) => {
//   const navigate = useNavigate()

    const [name ,setName] = useState('')
    const [image ,setImage] = useState([]);
    const [slug ,setSlug] = useState('')
    const [description ,setDescription] = useState('')



    
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const validationErrors = {};

    if (!name.trim()) {
      validationErrors.name = "Name is required";
    }
    
    if (image.length === 0) {
        validationErrors.image = 'Please upload at least one image';
      }
      
      if (!slug.trim()) {
        validationErrors.slug = "Slug is required";
      }
  
      if (!description.trim()) {
        validationErrors.description = "Description is required";
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
        const tokenname = localStorage.getItem('id');
    
        const isFormValid = validateForm();

          if (!isFormValid) {
            return;
          }

          const formDataToSend = new FormData();
            formDataToSend.append('name', name);
            formDataToSend.append('slug', slug);
            formDataToSend.append('description', description);
            formDataToSend.append('created_by', tokenname);
            image.forEach((image) => {
                formDataToSend.append('image[]', image);

            });

             try {
    const response = await axios.post('http://127.0.0.1:8000/api/CategoryAdd/', formDataToSend);
       if(response.data.status === 401){
    console.log(response.data);
     swal("warning",response.data.message,"warning")
    }
    else{
    console.log(response.data);
    swal("success",response.data.message,"success")
    //  navigate('seller/Category/');
    }
  } catch (error) {
    console.error(error.message);
    swal("error",error.message,"error")
  }
};

  return (
    <div className='main-container'>
    <div className='row'>
    <div className='col-md-12'>
        <div className='card'>
            <div className='card-header'>
                <h4>Add Category
                </h4>
            </div>
            <div className='card-body'>
                <form onSubmit={handleSubmit} >
                    <div className='col-md-6 mb-3'>
                        <label>Name</label>
                        <input type="text"  
                        className={`form-control  ${errors.name ? "is-invalid" : ""}`} 
                        name="name" 
                         value={name}  
                        onChange={(e) =>{setName(e.target.value)}}/>
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>
                    <div className='col-md-6 mb-3'>
                        <label>Slug</label>
                        <input type="text"  className={`form-control ${errors.slug ? "is-invalid" : ""}`} 
                         name="slug"value={slug}    
                         onChange={(e) =>{setSlug(e.target.value)}}/>
                       {errors.slug && <div className="invalid-feedback">{errors.slug}</div>}
                    </div>
                    <div className='col-md-6 mb-3'>
                        <label>description</label>
                        <input type="text" className={`form-control ${errors.description ? "is-invalid" : ""}`} 
                         name="description"value={description}    onChange={(e) =>{setDescription(e.target.value)}}/>
                       {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                    </div>
                    <div className='col-md-6 mb-3'>
                        <label>Image</label>
                        <input
                        type="file"
                        name="image[]"
                        className={`form-control-file ${errors.image ? "is-invalid" : ""}`}
                        onChange={handleFileChange}
                        />
                        {errors.image && <div className="invalid-feedback">{errors.image}</div>}
                    </div>
                    {/* <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault"/>
                        <label class="form-check-label " for="flexSwitchCheckDefault">Active</label>
                    </div> */}
                    <div className='col-md-12 mb-3'>
                        <button type="submit" className="btn btn-secondary float-end">Sava</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    </div>
    </div> 
  )
}
export default AddCategory;