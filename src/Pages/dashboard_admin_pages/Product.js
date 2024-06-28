import { Link } from 'react-router-dom'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BsPencil, BsTrash } from 'react-icons/bs';
import "../../App.css";

export default function Product() {


    const [data, setData] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:8000/api/product/');
          setData(response.data); // تعيين البيانات التي تم جلبها إلى الحالة
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
                     Product
                        <Link to="/Admin/Product/Add" className='btn btn-secondary float-end'>Add Product</Link>
                     </h4>
                 </div>
                 <div className='card-body'>
                 <table className="table table-striped table-hover">
                         <thead>
                             <tr>
                             <th scope="col">Id</th>
                             <th scope="col">name</th>
                             <th scope="col">description</th>
                             <th scope="col">price</th>
                             <th scope="col">images</th>
                             <th scope="col">quantity</th>
                             <th scope="col">category_id</th>
                             <th scope="col">branch_id</th>
                             <th scope="col">store_id</th>
                             </tr>
                         </thead>
                         <tbody>
                         {data.map((item) => (
                            <tr key={item.id}>
                            <td>{item.name}</td> 
                            <td>{item.description}</td> 
                            <td>{item.price}</td> 
                            <td>
                            <img width="75px"  src={`http://127.0.0.1:8000/products/${item.images}`} alt={item.name} />
                            </td> 
                            <td>{item.quantity}</td> 
                            <td>{item.category_id}</td> 
                            <td>{item.branch_id}</td> 
                            <td>{item.store_id}</td> 
                            <td>
                               <Link to={`edit-product/${item.id}`} className="btn btn-success btn-sm">Edit</Link>
                            </td>
                            <td>
                               <Link to={`edit-product/${item.id}`} className="btn btn-danger btn-sm">Delete</Link>
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
