import React, { useState, useEffect } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import { ClipLoader } from 'react-spinners';
import Autosuggest from 'react-autosuggest';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const AddStore = () => {
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
    const [mapCenter, setMapCenter] = useState({ lat: 33.5138, lng: 36.2765 }); // Damascus coordinates
    const [mapZoom, setMapZoom] = useState(13); // Initial zoom level of the map
    const [modalIsOpen, setModalIsOpen] = useState(false); // State for modal visibility

    useEffect(() => {
        fetchSellers();
    }, []);

    const fetchSellers = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/seller");
            if (response.status === 200) {
                setSeller(response.data.seller);
                setLoading(false);
            }
        } catch (error) {
            console.error('Error fetching sellers:', error);
            setLoading(false);
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
        if (image.length === 0) validationErrors.image = 'Please upload at least one image';
        if (!selectedseller) validationErrors.selectedseller = 'Please select a store owner';
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleFileChange = (e) => {
        const selectedFiles = e.target.files;
        setImage([...image, ...selectedFiles]);
    };

    const getCoordinatesFromAddress = async (address) => {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

        try {
            const response = await axios.get(url);
            if (response.data && response.data.length > 0) {
                const { lat, lon } = response.data[0];
                return { latitude: lat, longitude: lon };
            } else {
                throw new Error('No coordinates found for the address');
            }
        } catch (error) {
            console.error('Error fetching coordinates:', error.message);
            throw error;
        }
    };

    const handleAddressChange = async (event, { newValue }) => {
        setAddress(newValue);
        try {
            const coordinates = await getCoordinatesFromAddress(newValue);
            setLatitude(coordinates.latitude);
            setLongitude(coordinates.longitude);
            setMapCenter({ lat: coordinates.latitude, lng: coordinates.longitude });
            setMapZoom(13); // You can adjust the zoom level as needed
        } catch (error) {
            console.error("Error fetching coordinates:", error);
            setLatitude('');
            setLongitude('');
        }
    };

    const onSuggestionsFetchRequested = async ({ value }) => {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}`;
        try {
            const response = await axios.get(url);
            if (response.data && response.data.length > 0) {
                const suggestions = response.data.map(item => ({
                    address: item.display_name,
                    latitude: item.lat,
                    longitude: item.lon
                }));
                setSuggestions(suggestions);
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };

    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    const getSuggestionValue = suggestion => suggestion.address;

    const renderSuggestion = suggestion => (
        <div className="suggestion-item">
            {suggestion.address}
        </div>
    );

    const handleMapClick = (e) => {
        const { lat, lng } = e.latlng;
        setLatitude(lat);
        setLongitude(lng);

        // Reverse geocode to get the address and update the input field
        reverseGeocode(lat, lng);
        closeModal();
    };

    const reverseGeocode = async (lat, lng) => {
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;

        try {
            const response = await axios.get(url);
            if (response.data) {
                const { display_name } = response.data;
                setAddress(display_name);
                setMapCenter({ lat, lng });
                setMapZoom(13); // You can adjust the zoom level as needed
            }
        } catch (error) {
            console.error('Error reverse geocoding:', error);
        }
    };

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const id = localStorage.getItem('id');
        const isFormValid = validateForm();

        if (!isFormValid) {
            setLoading(false);
            return;
        }

        const formDataToSend = new FormData();
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
            const response = await axios.post(`http://127.0.0.1:8000/api/StoreAdd/${id}`, formDataToSend);
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

    const MapEventHandler = ({ setLatitude, setLongitude, reverseGeocode }) => {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setLatitude(lat);
                setLongitude(lng);
                reverseGeocode(lat, lng);
            },
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
                .react-autosuggest__container {
                    position: relative;
                }
                .react-autosuggest__input {
                    width: 100%;
                    height: 40px;
                    padding: 10px;
                    font-family: 'Arial';
                    font-weight: 300;
                    font-size: 16px;
                    border: 1px solid #aaa;
                    border-radius: 4px;
                }
                .react-autosuggest__suggestions-container {
                    display: none;
                    position: absolute;
                    top: 100%;
                    width: 100%;
                    border: 1px solid #aaa;
                    background-color: #fff;
                    font-family: 'Arial';
                    font-weight: 300;
                    font-size: 16px;
                    border-radius: 4px;
                    z-index: 2;
                }
                .react-autosuggest__suggestions-container--open {
                    display: block;
                }
                .react-autosuggest__suggestions-list {
                    margin: 0;
                    padding: 0;
                    list-style-type: none;
                }
                .react-autosuggest__suggestion {
                    cursor: pointer;
                    padding: 10px 20px;
                    .react-autosuggest__suggestion--highlighted {
                        background-color: #ddd;
                    }
                    .suggestion-item {
                        padding: 10px;
                        cursor: pointer;
                    }
                    .suggestion-item:hover {
                        background-color: #ddd;
                    }
                    .map-container {
                        height: 400px;
                        margin-top: 20px;
                    }
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
                            <div className='card-header'>
                                <h4> Add Store</h4>
                            </div>
                            <div className='card-body'>
                                <form onSubmit={handleSubmit}>
                                    <div className="row align-items-center mt-4">
                                        <div className='col-md-6 mb-3'>
                                            <label> Name </label>
                                            <input type="text"
                                                name="name"
                                                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                                value={name}
                                                onChange={(e) => { setName(e.target.value) }}
                                            />
                                            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                        </div>
                                        <div className='col-md-6 mb-3'>
                                            <label htmlFor="address">Address</label>
                                            <Autosuggest
                                                suggestions={suggestions}
                                                onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                                                onSuggestionsClearRequested={onSuggestionsClearRequested}
                                                getSuggestionValue={getSuggestionValue}
                                                renderSuggestion={renderSuggestion}
                                                inputProps={{
                                                    id: 'address',
                                                    className: `form-control ${errors.address ? "is-invalid" : ""}`,
                                                    placeholder: 'Enter address...',
                                                    value: address,
                                                    onChange: handleAddressChange
                                                }}
                                            />
                                            {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                                        </div>
                                    </div>
                                    <div className="row align-items-center mt-4">
                                        <div className='col-md-6 mb-3'>
                                            <label>Phone:</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                                                name="phone"
                                                value={phone}
                                                onChange={(e) => { setPhone(e.target.value) }}
                                            />
                                            {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                                        </div>
                                        <div className='col-md-6 mb-3'>
                                            <label> Cover Photo </label>
                                            <input type="file"
                                                name="image"
                                                className={`form-control ${errors.image ? "is-invalid" : ""}`}
                                                onChange={handleFileChange}
                                            />
                                            {errors.image && <div className="invalid-feedback">{errors.image}</div>}
                                        </div>
                                    </div>
                                    <div className="row align-items-center mt-4">
                                        <div className="col-md-6 mb-3">
                                            <label>Select Seller</label>
                                            <select
                                                className={`form-control ${errors.selectedseller ? "is-invalid" : ""}`}
                                                name="seller_id"
                                                value={selectedseller}
                                                onChange={(e) => { setSelectedSeller(e.target.value) }}>
                                                <option value="">Select Seller</option>
                                                {seller_men.map((seller) => (
                                                    <option key={seller.id} value={seller.id}>
                                                        {seller.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.selectedseller && <div className='invalid-feedback'>{errors.selectedseller}</div>}
                                        </div>
                                        <div className='col-md-6 mb-3'>
                                            <label>Description</label>
                                            <input type="text" name="description"
                                                className={`form-control ${errors.description ? "is-invalid" : ""}`}
                                                value={description}
                                                onChange={(e) => { setDescription(e.target.value) }} />
                                            {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                                        </div>
                                    </div>
                                    <div className="row align-items-center mt-4">
                                        <div className='col-md-6 mb-3'>
                                            <label>Open Time:</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.opentime ? "is-invalid" : ""}`}
                                                name="openTime"
                                                value={opentime}
                                                onChange={(e) => { setOpenTime(e.target.value) }}
                                            />
                                            {errors.opentime && <div className="invalid-feedback">{errors.opentime}</div>}
                                        </div>
                                        <div className='col-md-6 mb-3'>
                                            <label> Type </label>
                                            <input type="text"
                                                name="type"
                                                className={`form-control ${errors.type ? "is-invalid" : ""}`}
                                                value={type}
                                                onChange={(e) => { setType(e.target.value) }}
                                            />
                                            {errors.type && <div className="invalid-feedback">{errors.type}</div>}
                                        </div>
                                    </div>
                                    <div className='row align-items-center mt-4'>
                                        <div className='col-md-6 mb-3'>
                                            <label>Close Time:</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.closetime ? "is-invalid" : ""}`}
                                                name="closeTime"
                                                value={closetime}
                                                onChange={(e) => { setCloseTime(e.target.value) }}
                                            />
                                            {errors.closetime && <div className="invalid-feedback">{errors.closetime}</div>}
                                        </div>
                                    </div>
                                    <div className='col-md-12 mb-3'>
                                        <button type="button" className="btn btn-primary" onClick={openModal}>Select Location from Map</button>
                                    </div>
                                    <div className='col-md-12 mb-3'>
                                        <button type="submit" className="btn btn-secondary float-end"> Save </button>
                                    </div>
                                </form>
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
                                    <MapContainer center={[latitude || 33.5138, longitude || 36.2765]} zoom={15} scrollWheelZoom={false} style={{ height: "400px", width: "100%" }}>
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        />
                                        <Marker position={[latitude || 33.5138, longitude || 36.2765]} draggable={true}>
                                            <Popup>
                                                Latitude: {latitude}, Longitude: {longitude}
                                            </Popup>
                                        </Marker>
                                        <MapEventHandler setLatitude={setLatitude} setLongitude={setLongitude} reverseGeocode={reverseGeocode} />
                                    </MapContainer>
                                    <button className="btn btn-primary" onClick={closeModal}>اغلاق</button>
                                </Modal>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddStore;
