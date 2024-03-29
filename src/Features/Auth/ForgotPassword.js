import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useFormik } from 'formik';
import styled from '@emotion/styled';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForgotPasswordMutation } from './authApiSlice';
import Logo from '../../Assets/Images/logo.png';
import Loading from '../../Components/Loading';


const StyledTextField = styled(TextField)(() => ({
  margin: '10px',
}));
const StyledTypography = styled(Typography)(() => ({
  color: 'red',
}));

const ForgotPasswordValidationSchema = yup.object({
  email: yup
    .string()
    .min(5, 'Please enter a valid email address')
    .max(30, 'Enter an alternate email address')
    .required('Please provide a email address')
    .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Invalid format'),
});

const ForgotPassword = () => {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: ForgotPasswordValidationSchema,
    onSubmit: (values) => {
      forgotUserPassword(values); 
    },
  });

  const forgotUserPassword = (email) => {
    forgotPassword(email)
      .unwrap()
      .then((response) => toast.success(response.message))
      .then(() =>
        setTimeout(() => {
          navigate('/auth/login');
        }, 7000)
      )
      .catch((error) => {
        const errorMessage =
          error?.error?.message ||
          error?.data?.error?.message ||
          'An error occurred.';
        toast.error(errorMessage); 
      });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      {isLoading ? (
        <Loading open={isLoading} /> 
      ) : (
        <Paper
          sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ToastContainer /> 
          <Box sx={{ m: 2 }}>
            <img src={Logo} alt='logo' height='32' width='32' />
          </Box>
          <Typography component='h1' variant='h5'>
            Forgot Password
          </Typography>
          <Typography component='h1' variant='subtitle1'>
            Please enter your account details
          </Typography>
          {/* ----------- Form --------- */}
          <Box
            component='form'
            sx={{
              m: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            onSubmit={formik.handleSubmit}
          >
            <StyledTextField
              required
              id='email'
              label='E-mail'
              fullWidth
              name='email'
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <StyledTypography>
              {formik.touched.email && formik.errors.email
                ? formik.errors.email
                : ''}
            </StyledTypography>

            <Button variant='contained' type='submit' sx={{ m: 2 }} fullWidth>
              Next
            </Button>
          </Box>
          <Box>
            <Link to='/auth/login'>
              <Typography sx={{ fontWeight: '500', color: '#1a73e8' }}>
                Back to Login
              </Typography>
            </Link>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default ForgotPassword;
