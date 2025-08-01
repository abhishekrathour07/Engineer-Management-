import * as yup from 'yup'

export const signupSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
    role: yup.string().oneOf(['engineer', 'manager'], 'Please select a valid role').required('Role is required'),
})

