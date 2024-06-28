import { Link } from 'react-router-dom'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BsPencil, BsTrash } from 'react-icons/bs';
import "../../App.css";

export default function Branch() {


    const [data, setData] = useState([]);

    useEffect(() => {
      const fetchData = async () => {

        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/branch/`);
          setData(response.data.branch); 
          console.log(response.data.branch);
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
                    Brunch
                       <Link to="/Admin/Branch/Add" className='btn btn-secondary float-end'>Add Branch</Link>
                    </h4>
                </div>
                <div className='card-body'>
                <table class="table table-striped table-hover">
                <thead>
                            <tr>
                            <th scope="col">Id</th>
                            <th scope="col">name</th>
                            <th scope="col">category_id</th>
                            <th scope="col">image</th>
                            <th scope="col">status</th>
                            </tr>
                        </thead>
                        <tbody>
                        {Array.isArray(data) && data.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td> 
                            <td>{item.name}</td> 
                            <td>{item.category_id}</td> 
                            <td>{item.image}</td> 
                            <td>
                            <img width="75px"  src={`http://127.0.0.1:8000/branches/${item.image}`} alt={item.name} />
                            </td> 
                            <td>{item.status}</td> 
                            <td>
                               <Link to={`edit-branch/${item.id}`} className="btn btn-success btn-sm">Edit</Link>
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
