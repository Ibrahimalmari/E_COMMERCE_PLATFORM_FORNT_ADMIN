import { Link } from 'react-router-dom'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BsPencil, BsTrash } from 'react-icons/bs';
import "../../App.css";


export default function Category() {

    const [data, setData] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        localStorage.getItem("id");

        try {
          const response = await axios.get('http://127.0.0.1:8000/api/category/');
          setData(response.data.category); 
          console(response.data.category);
        } catch (error) {
          console.error('Error fetching data: ', error);
        }
      };
  
      fetchData();
    }, []);    




  return (
   <div className='main-container'>
   <div className='row'>
        <div className='col-md-12'>
            <div className='card'>
                <div className='card-header'>     
                    <h4>
                    Category
                       <Link to="/Admin/Category/Add" className='btn btn-secondary float-end'>Add Category</Link>
                    </h4>
                </div>
                <div className='card-body'>
                <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                            <th scope="col">Id</th>
                            <th scope="col">name</th>
                            <th scope="col">slug</th>
                            <th scope="col">description</th>
                            <th scope="col">image</th>
                            <th scope="col">status</th>
                            </tr>
                        </thead>
                        <tbody>
                        {Array.isArray(data) && data.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td> 
                            <td>{item.name}</td> 
                            <td>{item.slug}</td> 
                            <td>{item.description}</td> 
                            <td>
                            <img width="75px"  src={`http://127.0.0.1:8000/categories/${item.image}`} alt={item.name} />
                            </td> 
                            <td>{item.status}</td> 
                            <td>
                               <Link to={`edit-category/${item.id}`} className="btn btn-success btn-sm">Edit</Link>
                            </td>
                            <td>
                               <Link to={`edit-branch/${item.id}`} className="btn btn-danger btn-sm">Delete</Link>
                            </td>
                            </tr>
                            
                        ))}
                        </tbody>
                        </table>
                </div>
            </div>
        </div>

    </div>

</div> 
  )
}
