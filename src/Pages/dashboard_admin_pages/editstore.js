import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import { ClipLoader } from 'react-spinners';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import Modal from 'react-modal';
import L from 'leaflet';

// Import necessary leaflet styles
import 'leaflet/dist/leaflet.css';

// Set default marker icon for the map
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const EditStore = () => {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [image, setImage] = useState([]);
    const [phone, setPhone] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const [address, setAddress] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [opentime, setOpenTime] = useState('');
    const [closetime, setCloseTime] = useState('');
    const [seller_men, setSeller] = useState([]);
    const [selectedseller, setSelectedSeller] = useState('');
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [suggestions, setSuggestions] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const searchInputRef = useRef(null);

    useEffect(() => {
        fetchStoreDetails();
        fetchSellers();
    }, [id]);

    const fetchStoreDetails = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/store/${id}`);
            if (response.status === 200) {
                const storeData = response.data.store;
                setName(storeData.name);
                setPhone(storeData.phone);
                setDescription(storeData.description);
                setType(storeData.type);
                setAddress(storeData.address);
                setLatitude(storeData.latitude);
                setLongitude(storeData.longitude);
                setOpenTime(storeData.openTime);
                setCloseTime(storeData.closeTime);
                setSelectedSeller(storeData.seller_id);
                setLoading(false);
            }
        } catch (error) {
            console.error('Error fetching store details:', error);
            setLoading(false);
        }
    };

    const fetchSellers = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/seller");
            if (response.status === 200) {
                setSeller(response.data.seller);
            }
        } catch (error) {
            console.error('Error fetching sellers:', error);
        }
    };

    const validateForm = () => {
        const validationErrors = {};
        if (!name.trim()) validationErrors.name = "Name is required";
        if (!address.trim()) validationErrors.address = "Address is required";
        if (!opentime.trim()) validationErrors.opentime = "Open Time is required";
        if (!closetime.trim()) validationErrors.closetime = "Close Time is required";
        if (!type.trim()) validationErrors.type = "Type is required";
        if (!phone.trim()) validationErrors.phone = "Phone is required";
        if (!description.trim()) validationErrors.description = "Description is required";
        if (!selectedseller) validationErrors.selectedseller = 'Please select a store owner';
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleFileChange = (e) => {
        const selectedFiles = e.target.files;
        setImage([...image, ...selectedFiles]);
    };

    const handleAddressChange = (e) => {
        setAddress(e.target.value);
        if (!e.target.value.trim()) {
            setSuggestions([]);
            return;
        }
        fetchAddressSuggestions(e.target.value);
    };

    const fetchAddressSuggestions = async (address) => {
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${address}&addressdetails=1&limit=5`);
            if (response.status === 200) {
                setSuggestions(response.data);
            }
        } catch (error) {
            console.error('Error fetching address suggestions:', error);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setAddress(suggestion.display_name);
        setLatitude(suggestion.lat);
        setLongitude(suggestion.lon);
        setSuggestions([]);
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
        formDataToSend.append('address', address);
        formDataToSend.append('latitude', latitude.toString());
        formDataToSend.append('longitude', longitude.toString());
        formDataToSend.append('description', description);
        formDataToSend.append('phone', phone);
        formDataToSend.append('type', type);
        formDataToSend.append('openTime', opentime);
        formDataToSend.append('closeTime', closetime);
        formDataToSend.append('seller_id', selectedseller);
        image.forEach((img) => {
            formDataToSend.append('image', img);
        });

        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/updatestore/${id}`, formDataToSend);
            if (response.data.status === 401 || response.data.status === 500) {
                swal("warning", response.data.message, "warning");
            } else {
                swal("success", response.data.message, "success");
            }
        } catch (error) {
            console.error(error.message);
            swal("error", error.message, "error");
        } finally {
            setLoading(false);
        }
    };

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const MapEventHandler = () => {
        useMapEvents({
            click: async (e) => {
                const { lat, lng } = e.latlng;
                setLatitude(lat);
                setLongitude(lng);

                try {
                    const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
                    if (response.status === 200) {
                        setAddress(response.data.display_name);
                    }
                } catch (error) {
                    console.error('Error fetching address:', error);
                }

                closeModal();
            }
        });
        return null;
    };

    return (
        <div className='main-container'>
            <style>{`
                .main-container {
                    padding: 20px;
                }
                .loading-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                }
                .card {
                    margin: 20px 0;
                }
                .invalid-feedback {
                    display: block;
                }
                .suggestions-container {
                    position: absolute;
                    background-color: white;
                    z-index: 1000;
                    width: 100%;
                    max-height: 200px;
                    overflow-y: auto;
                    border: 1px solid #ced4da;
                    border-radius: 0.25rem;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .suggestion-item {
                    padding: 10px;
                    cursor: pointer;
                }
                .suggestion-item:hover {
                    background-color: #f8f9fa;
                }
            `}</style>
            {loading ? (
                <div className="loading-container">
                    <ClipLoader color="#1F3750" loading={loading} size={50} />
                </div>
            ) : (
                <div className='row'>
                    <div className='col-md-12'>
                        <div className='card'>
                            <div className='card-body'>
                                <h5 className='card-title'>Edit Store</h5>
                                <form onSubmit={handleSubmit}>
                                    <div className='row'>
                                        <div className='col-md-6 mb-3'>
                                            <label>Name</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                        </div>

                                        <div className='col-md-6 mb-3'>
                                            <label>Address</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.address ? "is-invalid" : ""}`}
                                                value={address}
                                                onChange={handleAddressChange}
                                                ref={searchInputRef}
                                            />
                                            {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                                            {suggestions.length > 0 && (
                                                <div className="suggestions-container">
                                                    {suggestions.map((suggestion) => (
                                                        <div
                                                            key={                                                                suggestion.place_id}
                                                            className="suggestion-item"
                                                            onClick={() => handleSuggestionClick(suggestion)}
                                                        >
                                                            {suggestion.display_name}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className='col-md-6 mb-3'>
                                            <label>Type</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.type ? "is-invalid" : ""}`}
                                                value={type}
                                                onChange={(e) => setType(e.target.value)}
                                            />
                                            {errors.type && <div className="invalid-feedback">{errors.type}</div>}
                                        </div>

                                        <div className='col-md-6 mb-3'>
                                            <label>Phone</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                            />
                                            {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                                        </div>

                                        <div className='col-md-6 mb-3'>
                                            <label>Description</label>
                                            <textarea
                                                className={`form-control ${errors.description ? "is-invalid" : ""}`}
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                            ></textarea>
                                            {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                                        </div>

                                        <div className='col-md-6 mb-3'>
                                            <label>Open Time</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.opentime ? "is-invalid" : ""}`}
                                                value={opentime}
                                                onChange={(e) => setOpenTime(e.target.value)}
                                            />
                                            {errors.opentime && <div className="invalid-feedback">{errors.opentime}</div>}
                                        </div>

                                        <div className='col-md-6 mb-3'>
                                            <label>Close Time</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.closetime ? "is-invalid" : ""}`}
                                                value={closetime}
                                                onChange={(e) => setCloseTime(e.target.value)}
                                            />
                                            {errors.closetime && <div className="invalid-feedback">{errors.closetime}</div>}
                                        </div>

                                        <div className='col-md-6 mb-3'>
                                            <label>Store Owner</label>
                                            <select
                                                className={`form-control ${errors.selectedseller ? "is-invalid" : ""}`}
                                                value={selectedseller}
                                                onChange={(e) => setSelectedSeller(e.target.value)}
                                            >
                                                <option value=''>Select Owner</option>
                                                {seller_men.map((seller) => (
                                                    <option key={seller.id} value={seller.id}>{seller.name}</option>
                                                ))}
                                            </select>
                                            {errors.selectedseller && <div className="invalid-feedback">{errors.selectedseller}</div>}
                                        </div>

                                        <div className='col-md-6 mb-3'>
                                            <label>Image</label>
                                            <input
                                                type="file"
                                                className='form-control'
                                                onChange={handleFileChange}
                                                multiple
                                            />
                                        </div>

                                        <div className='col-md-12 mb-3'>
                                            <label>Map</label>
                                            <button type="button" className="btn btn-secondary" onClick={openModal}>
                                                حدد العنوان من على الخريطة
                                            </button>
                                            <Modal
                                                isOpen={modalIsOpen}
                                                onRequestClose={closeModal}
                                                contentLabel="حدد العنوان من على الخريطة"
                                                style={{
                                                    content: {
                                                        top: '50%',
                                                        left: '50%',
                                                        right: 'auto',
                                                        bottom: 'auto',
                                                        marginRight: '-50%',
                                                        transform: 'translate(-50%, -50%)'
                                                    }
                                                }}
                                            >
                                                <h2>حدد العنوان من على الخريطة</h2>
                                                <MapContainer center={[latitude || 0, longitude || 0]} zoom={15} scrollWheelZoom={false} style={{ height: "400px", width: "100%" }}>
                                                    <TileLayer
                                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                    />
                                                    <Marker position={[latitude || 0, longitude || 0]} draggable={true}>
                                                        <Popup>
                                                            Latitude: {latitude}, Longitude: {longitude}
                                                        </Popup>
                                                    </Marker>
                                                    <MapEventHandler />
                                                </MapContainer>
                                                <button className="btn btn-primary" onClick={closeModal}>اغلاق</button>
                                            </Modal>
                                        </div>

                                        <div className='col-md-12'>
                                            <button type='submit' className='btn btn-primary'>Update Store</button>
                                        </div>
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

export default EditStore;

