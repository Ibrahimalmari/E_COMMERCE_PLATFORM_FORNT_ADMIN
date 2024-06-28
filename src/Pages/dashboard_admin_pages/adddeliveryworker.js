import React, { useState, useEffect } from 'react';
import axios from "axios";
import swal from "sweetalert";
import { ClipLoader } from 'react-spinners';

const AddDeliverWorker = () => {
        const [name, setName] = useState('');
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [phone, setPhone] = useState('');
        const [address, setAddress] = useState('');
        const [joiningDate, setJoiningDate] = useState('');
        const [vehicleImage, setVehicleImage] = useState([]);
        const [licenseImage, setLicenseImage] = useState([]);
        const [vehicleType, setVehicleType] = useState('');
        const [vehicleNumber, setVehicleNumber] = useState('');
        const [nationalNumber, setNationalNumber] = useState('');
        const [photoOfPersonalID, setPhotoOfPersonalID] = useState([]);
        const [loading, setLoading] = useState(true);
        const [errors, setErrors] = useState({});
        const [jobs, setJobs] = useState([]);
        const [selectedJob, setSelectedJob] = useState();


        useEffect(() => {
            axios.get("http://127.0.0.1:8000/api/role").then(res => {
                if (res.data.status === 200) {
                    setJobs(res.data.roles)
                    console.log(res.data.roles)
                    setLoading(false);

                }
            })
        }, [])

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

            if (!password.trim()) {
                validationErrors.password = "Password is required";
            }

            if (!phone.trim()) {
                validationErrors.phone = "Phone is required";
            }

            if (!address.trim()) {
                validationErrors.address = "Address is required";
            }

            // Add validations for other fields
            // Joining Date
            if (!joiningDate.trim()) {
                validationErrors.joiningDate = "Joining date is required";
            }

            // Vehicle Type
            if (!vehicleType.trim()) {
                validationErrors.vehicleType = "Vehicle type is required";
            }

            // Vehicle Number
            if (!vehicleNumber.trim()) {
                validationErrors.vehicleNumber = "Vehicle number is required";
            }

            // National Number
            if (!nationalNumber.trim()) {
                validationErrors.nationalNumber = "National number is required";
            }

            if (!selectedJob) {
                validationErrors.selectedJob = 'Please select a role';
            }

            if (vehicleImage.length === 0) {
                validationErrors.vehicleImage = 'Please upload at least one image for the vehicle';
            }

            if (licenseImage.length === 0) {
                validationErrors.licenseImage = 'Please upload at least one image for the license';
            }

            if (!photoOfPersonalID.length === 0) {
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
            const selectedFiles = e.target.files;
            setPhotoOfPersonalID([...photoOfPersonalID, ...selectedFiles]);
            const files = e.target.files;
            const name = e.target.name;
            if (name === "vehicleImage") {
                setVehicleImage([...vehicleImage, ...files]);
            } else if (name === "licenseImage") {
                setLicenseImage([...licenseImage, ...files]);
            }
        };

        const handleSubmit = async(e) => {
            e.preventDefault();
            setLoading(true);

            const isFormValid = validateForm();

            if (!isFormValid) {
                setLoading(false);
                return;
            }

            const formDataToSend = new FormData();

            formDataToSend.append('name', name);
            formDataToSend.append('email', email);
            formDataToSend.append('password', password);
            formDataToSend.append('phone', phone);
            formDataToSend.append('address', address);
            formDataToSend.append('joining_date', joiningDate); // تعديل الاسم هنا
            formDataToSend.append('vehicle_type', vehicleType);
            formDataToSend.append('vehicle_number', vehicleNumber);
            formDataToSend.append('NationalNumber', nationalNumber);
            formDataToSend.append('role_id', selectedJob);
            photoOfPersonalID.forEach((image) => {
                formDataToSend.append('PhotoOfPersonalID', image);
            });

            vehicleImage.forEach((image) => {
                formDataToSend.append('vehicle_image', image);
            });

            licenseImage.forEach((image) => {
                formDataToSend.append('license_image', image);
            });

            try {
                const response = await axios.post('http://127.0.0.1:8000/api/deliveryRegister/', formDataToSend);
                if (response.data.status === 401 || response.data.status === 500) {
                    console.log(response.data);
                    swal("warning", response.data.message, "warning")
                } else {
                    console.log(response.data);
                    swal("success", response.data.message, "success")
                        // navigate('/seller/Dashboard');
                }
            } catch (error) {
                console.error(error.message);
                swal("error", error.message, "error")
            } finally {
                setLoading(false);
            }
        };


        return ( <
                div className = 'main-container' > {
                    loading ? ( <
                        div className = "loading-container" >
                        <
                        ClipLoader color = "#1F3750"
                        loading = { loading }
                        size = { 50 }
                        /> <
                        /div>
                    ) : ( <
                            div className = 'row' >
                            <
                            div className = 'col-md-12' >
                            <
                            div className = 'card' >
                            <
                            div className = 'card-header' >
                            <
                            h4 > Add Deliver Worker < /h4> <
                            /div> <
                            div className = 'card-body' >
                            <
                            form onSubmit = { handleSubmit } >
                            <
                            div className = "row align-items-center mt-4" >
                            <
                            div className = "col" >
                            <
                            label > Name: < /label> <
                            input type = "text"
                            name = "name"
                            className = { `form-control ${errors.name ? "is-invalid" : ""}` }
                            value = { name }
                            onChange = {
                                (e) => setName(e.target.value) }
                            /> {
                                errors.name && < div className = "invalid-feedback" > { errors.name } < /div>} <
                                    /div> <
                                    div className = "col" >
                                    <
                                    label > Email: < /label> <
                                    input
                                type = "email"
                                name = "email"
                                className = { `form-control ${errors.email ? "is-invalid" : ""}` }
                                value = { email }
                                onChange = {
                                    (e) => setEmail(e.target.value) }
                                /> {
                                    errors.email && < div className = "invalid-feedback" > { errors.email } < /div>} <
                                        /div> <
                                        /div>  <
                                        div className = "row align-items-center mt-4" >

                                        <
                                        div className = "col" >
                                        <
                                        label > Password: < /label> <
                                        input
                                    type = "password"
                                    name = "password"
                                    className = { `form-control ${errors.password ? "is-invalid" : ""}` }
                                    value = { password }
                                    onChange = {
                                        (e) => setPassword(e.target.value) }
                                    /> {
                                        errors.password && < div className = "invalid-feedback" > { errors.password } < /div>} <
                                            /div> <
                                            div className = "col" >
                                            <
                                            label > Phone: < /label> <
                                            input
                                        type = "text"
                                        name = "phone"
                                        className = { `form-control ${errors.phone ? "is-invalid" : ""}` }
                                        value = { phone }
                                        onChange = {
                                            (e) => setPhone(e.target.value) }
                                        /> {
                                            errors.phone && < div className = "invalid-feedback" > { errors.phone } < /div>} <
                                                /div> <
                                                /div> <
                                                div className = "row align-items-center mt-4" >
                                                <
                                                div className = "col" >
                                                <
                                                label > Address: < /label> <
                                                input
                                            type = "text"
                                            name = "address"
                                            className = { `form-control ${errors.address ? "is-invalid" : ""}` }
                                            value = { address }
                                            onChange = {
                                                (e) => setAddress(e.target.value) }
                                            /> {
                                                errors.address && < div className = "invalid-feedback" > { errors.address } < /div>} <
                                                    /div> { /* Add other input fields similarly */ } <
                                                    div className = "col" >
                                                    <
                                                    label > Joining Date: < /label> <
                                                    input
                                                type = "date"
                                                name = "joiningDate"
                                                className = { `form-control ${errors.joiningDate ? "is-invalid" : ""}` }
                                                value = { joiningDate }
                                                max = { calculateMaxDate() }
                                                onChange = {
                                                    (e) => setJoiningDate(e.target.value) }
                                                /> {
                                                    errors.joiningDate && < div className = "invalid-feedback" > { errors.joiningDate } < /div>} <
                                                        /div> <
                                                        /div> <
                                                        div className = "row align-items-center mt-4" >
                                                        <
                                                        div className = "col" >
                                                        <
                                                        label > Vehicle Type: < /label> <
                                                        input
                                                    type = "text"
                                                    name = "vehicleType"
                                                    className = { `form-control ${errors.vehicleType ? "is-invalid" : ""}` }
                                                    value = { vehicleType }
                                                    onChange = {
                                                        (e) => setVehicleType(e.target.value) }
                                                    /> {
                                                        errors.vehicleType && < div className = "invalid-feedback" > { errors.vehicleType } < /div>} <
                                                            /div> <
                                                            div className = "col" >
                                                            <
                                                            label > Vehicle Number: < /label> <
                                                            input
                                                        type = "text"
                                                        name = "vehicleNumber"
                                                        className = { `form-control ${errors.vehicleNumber ? "is-invalid" : ""}` }
                                                        value = { vehicleNumber }
                                                        onChange = {
                                                            (e) => setVehicleNumber(e.target.value) }
                                                        /> {
                                                            errors.vehicleNumber && < div className = "invalid-feedback" > { errors.vehicleNumber } < /div>} <
                                                                /div> <
                                                                /div> <
                                                                div className = "row align-items-center mt-4" >
                                                                <
                                                                div className = "col" >
                                                                <
                                                                label > National Number: < /label> <
                                                                input
                                                            type = "text"
                                                            name = "nationalNumber"
                                                            className = { `form-control ${errors.nationalNumber ? "is-invalid" : ""}` }
                                                            value = { nationalNumber }
                                                            onChange = {
                                                                (e) => setNationalNumber(e.target.value) }
                                                            /> {
                                                                errors.nationalNumber && < div className = "invalid-feedback" > { errors.nationalNumber } < /div>} <
                                                                    /div> <
                                                                    div className = "col" >
                                                                    <
                                                                    label > role: < /label> <
                                                                    select
                                                                className = { `form-control  ${errors.selectedJob ? "is-invalid" : ""}` }
                                                                name = "role_id"
                                                                value = { selectedJob }
                                                                onChange = {
                                                                        (e) => { setSelectedJob(e.target.value) } } >
                                                                    <
                                                                    option value = "" > Select role < /option> {
                                                                        jobs.map((job) => ( <
                                                                            option key = { job.id }
                                                                            value = { job.id } > { job.name } <
                                                                            /option>
                                                                        ))
                                                                    } <
                                                                    /select> {
                                                                        errors.selectedJob && ( <
                                                                            div className = 'invalid-feedback' > { errors.selectedJob } <
                                                                            /div>
                                                                        )
                                                                    } <
                                                                    /div> <
                                                                    /div> <
                                                                    div className = "form-group" >
                                                                    <
                                                                    label > Photo of Personal ID: < /label> <
                                                                    input
                                                                type = "file"
                                                                className = { `form-control ${errors.photoOfPersonalID ? "is-invalid" : ""}` }
                                                                name = "PhotoOfPersonalID"
                                                                onChange = { handleFileChange }
                                                                /> {
                                                                    errors.photoOfPersonalID && < div className = "invalid-feedback" > { errors.photoOfPersonalID } < /div>} <
                                                                        /div> <
                                                                        div className = "form-group" >
                                                                        <
                                                                        label > Vehicle Image: < /label> <
                                                                        input
                                                                    type = "file"
                                                                    className = { `form-control ${errors.vehicleImage ? "is-invalid" : ""}` }
                                                                    name = "vehicleImage"
                                                                    onChange = { handleFileChange }
                                                                    multiple
                                                                        /
                                                                        > {
                                                                            errors.vehicleImage && < div className = "invalid-feedback" > { errors.vehicleImage } < /div>} <
                                                                            /div> <
                                                                            div className = "form-group" >
                                                                            <
                                                                            label > License Image: < /label> <
                                                                                input
                                                                            type = "file"
                                                                            className = { `form-control ${errors.licenseImage ? "is-invalid" : ""}` }
                                                                            name = "licenseImage"
                                                                            onChange = { handleFileChange }
                                                                            multiple /
                                                                            > {
                                                                                errors.licenseImage && < div className = "invalid-feedback" > { errors.licenseImage } < /div>} <
                                                                                /div> <
                                                                                div className = "form-group" >
                                                                                <
                                                                                button type = "submit"
                                                                                className = "btn btn-secondary" > Submit < /button> <
                                                                                /div> <
                                                                                /form> <
                                                                                /div> <
                                                                                /div> <
                                                                                /div> <
                                                                                /div>
                                                                            )
                                                                        } <
                                                                        /div>
                                                                );
                                                            };

                                                            export default AddDeliverWorker;