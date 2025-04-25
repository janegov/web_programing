import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            confirmPassword: ''
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
            password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Please confirm your password')
        }),
        onSubmit: async (values, { setSubmitting, setErrors }) => {
            try {
                await register(values.email, values.password);
                navigate('/notes');
            } catch (error) {
                if (error.response?.data?.errors) {
                    const errors = {};
                    error.response.data.errors.forEach(err => {
                        if (err.field) {
                            errors[err.field] = err.message;
                        } else {
                            errors.submit = err.message;
                        }
                    });
                    setErrors(errors);
                } else {
                    setErrors({ submit: error.message || 'Registration failed' });
                }
            } finally {
                setSubmitting(false);
            }
        }
    });

    return (
        <div className="auth-container">
            <h2>Register</h2>
            <form className="auth-form" onSubmit={formik.handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        className={formik.touched.email && formik.errors.email ? 'error' : ''}
                    />
                    {formik.touched.email && formik.errors.email && (
                        <div className="error-message">{formik.errors.email}</div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                        className={formik.touched.password && formik.errors.password ? 'error' : ''}
                    />
                    {formik.touched.password && formik.errors.password && (
                        <div className="error-message">{formik.errors.password}</div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.confirmPassword}
                        className={formik.touched.confirmPassword && formik.errors.confirmPassword ? 'error' : ''}
                    />
                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                        <div className="error-message">{formik.errors.confirmPassword}</div>
                    )}
                </div>

                {formik.errors.submit && (
                    <div className="error-message">{formik.errors.submit}</div>
                )}

                <button type="submit" disabled={formik.isSubmitting}>
                    {formik.isSubmitting ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
};

export default Register;
