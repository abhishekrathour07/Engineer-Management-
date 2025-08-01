import * as yup from "yup";

const loginSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
});

export type LoginForm = yup.InferType<typeof loginSchema>;

export default loginSchema;