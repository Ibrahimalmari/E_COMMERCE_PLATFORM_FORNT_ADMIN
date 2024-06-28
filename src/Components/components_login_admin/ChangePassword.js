import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import swal from "sweetalert";

const ChangePassword = () => {
        const navigate = useNavigate();
        const [currentPassword, setCurrentPassword] = useState('');
        const [newPassword, setNewPassword] = useState('');
        const [confirmNewPassword, setConfirmNewPassword] = useState('');
        const [errorMessage, setErrorMessage] = useState('');
        const [showCurrentPassword, setShowCurrentPassword] = useState(false);
        const [showNewPassword, setShowNewPassword] = useState(false);
        const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
        const [loading, setLoading] = useState(true); // حالة الloading
        const id = localStorage.getItem('id');

        useEffect(() => {
            setLoading(false);
        }, []);

        const handleChangePassword = async(e) => {
            e.preventDefault();

            // Check if any of the fields are empty
            if (!currentPassword || !newPassword || !confirmNewPassword) {
                setErrorMessage('Please fill in all fields.');
                return;
            }

            try {
                setLoading(true); // قم بتعيين حالة الloading لتظهر الرمز
                // Send request if all fields are filled
                const response = await axios.post(`http://127.0.0.1:8000/api/changepassword/${id}`, {
                    currentPassword,
                    newPassword,
                    confirmNewPassword,
                });

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
                setLoading(false); // قم بتحديث حالة الloading إلى false بعد انتهاء العملية
            }
        };

        return ( <
            div className = "main-container" > {
                loading ? ( <
                    div className = "loading-container" >
                    <
                    ClipLoader color = "#1F3750"
                    loading = { loading }
                    size = { 50 }
                    /> <
                    /div>
                ) : ( <
                        >
                        <
                        h2 > Change Password < /h2> <
                        form onSubmit = { handleChangePassword } >
                        <
                        div className = "row" >
                        <
                        div className = "col-md-6 mb-3" >
                        <
                        label htmlFor = "currentPassword"
                        className = "form-label" > Current Password: < /label> <
                        div className = "input-group" >
                        <
                        input type = { showCurrentPassword ? 'text' : 'password' }
                        className = "form-control"
                        id = "currentPassword"
                        value = { currentPassword }
                        onChange = {
                            (e) => setCurrentPassword(e.target.value) }
                        /> <
                        button type = "button"
                        className = "btn btn-outline-secondary"
                        onClick = {
                            () => setShowCurrentPassword(!showCurrentPassword) } >
                        { showCurrentPassword ? < AiOutlineEyeInvisible / > : < AiOutlineEye / > } <
                        /button> <
                        /div> <
                        /div> <
                        div className = "col-md-6 mb-3" >
                        <
                        label htmlFor = "newPassword"
                        className = "form-label" > New Password: < /label> <
                        div className = "input-group" >
                        <
                        input type = { showNewPassword ? 'text' : 'password' }
                        className = "form-control"
                        id = "newPassword"
                        name = 'newPassword'
                        value = { newPassword }
                        onChange = {
                            (e) => setNewPassword(e.target.value) }
                        /> <
                        button type = "button"
                        className = "btn btn-outline-secondary"
                        onClick = {
                            () => setShowNewPassword(!showNewPassword) } >
                        { showNewPassword ? < AiOutlineEyeInvisible / > : < AiOutlineEye / > } <
                        /button> <
                        /div> <
                        /div> <
                        div className = "col-md-6 mb-3" >
                        <
                        label htmlFor = "confirmNewPassword"
                        className = "form-label" > Confirm New Password: < /label> <
                        div className = "input-group" >
                        <
                        input type = { showConfirmNewPassword ? 'text' : 'password' }
                        className = "form-control"
                        id = "confirmNewPassword"
                        name = 'confirmNewPassword'
                        value = { confirmNewPassword }
                        onChange = {
                            (e) => setConfirmNewPassword(e.target.value) }
                        /> <
                        button type = "button"
                        className = "btn btn-outline-secondary"
                        onClick = {
                            () => setShowConfirmNewPassword(!showConfirmNewPassword) } >
                        { showConfirmNewPassword ? < AiOutlineEyeInvisible / > : < AiOutlineEye / > } <
                        /button> <
                        /div> <
                        /div> <
                        div className = "col-md-12 mb-3" >
                        <
                        label htmlFor = "forgotPassword"
                        className = "form-label" > Forgot Password ? < /label> <
                        Link to = "/ForgotPassword"
                        className = "form-link" > Reset Password < /Link> <
                        /div> <
                        /div> {
                            errorMessage && < div className = "alert alert-danger" > { errorMessage } < /div>} <
                                button type = "submit"
                            className = "btn btn-primary"
                            disabled = { loading } >
                                Change Password <
                                /button> <
                                /form> <
                                />
                        )
                    } <
                    /div>
            );
        };

        export default ChangePassword;