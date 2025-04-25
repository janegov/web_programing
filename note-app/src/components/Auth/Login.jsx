import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../context/AuthProvider';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email address')
                .required('Required'),
            password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('Required')
        }),
        onSubmit: async (values, { setSubmitting, setErrors }) => {
            try {
                await login(values.email, values.password);
                navigate('/notes');
            } catch (error) {
                setErrors({ submit: error.message });
            } finally {
                setSubmitting(false);
            }
        }
    });

    return (
        <div style={{
            maxWidth: '400px',
            margin: '2rem auto',
            padding: '2rem',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Login</h2>
            <form onSubmit={formik.handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #ddd',
                            borderRadius: '4px'
                        }}
                    />
                    {formik.touched.email && formik.errors.email ? (
                        <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                            {formik.errors.email}
                        </div>
                    ) : null}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #ddd',
                            borderRadius: '4px'
                        }}
                    />
                    {formik.touched.password && formik.errors.password ? (
                        <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                            {formik.errors.password}
                        </div>
                    ) : null}
                </div>

                {formik.errors.submit && (
                    <div style={{ color: 'red', marginBottom: '1rem' }}>
                        {formik.errors.submit}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={formik.isSubmitting}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    {formik.isSubmitting ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default Login;
