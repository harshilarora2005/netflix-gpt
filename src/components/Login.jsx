import Header from "./Header";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import bg from "/bg.jpg";
import { useState } from "react";

const Login = () => {
    const [isSignUp, setIsSignUp] = useState(false);

    const phoneRegex =/^\+?[0-9\s\-()]{7,20}$/;
    const schema = Yup.object({
        contact: Yup.string()
            .required("Email or phone is required")
            .test(
                "is-valid-contact",
                "Must be a valid email or phone number",
                (value) => {
                    if (!value) return false;
                    const isEmail = Yup.string().email().isValidSync(value);
                    const isPhone = phoneRegex.test(value);
                    return isEmail || isPhone;
                }
            ),
        password: Yup.string()
            .min(8, "Password must be at least 8 characters")
            .matches(/[A-Z]/, "Must contain an uppercase letter")
            .matches(/[0-9]/, "Must contain a number")
            .required("Required"),
        ...(isSignUp && {
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Required')
        })
    });

    const initialValues = isSignUp
        ? { contact: "", password: "", confirmPassword: "" }
        : { contact: "", password: "" };

    return (
        <div className="min-h-screen relative">
            <div className="fixed inset-0 z-0">
                <img src={bg} alt="" className="w-full h-full object-cover filter" />
                <div className="absolute inset-0 bg-black/60"></div>
            </div> 

            <div className="relative z-10">
                <Header />
                <div className="flex justify-center items-center min-h-[80vh] px-4">
                    <div className="bg-black/75 p-16 rounded-md w-full max-w-md">
                        <h1 className="text-white text-3xl font-bold mb-8">
                            {isSignUp ? "Sign Up" : "Sign In"}
                        </h1>

                        <Formik
                            initialValues={initialValues}
                            validationSchema={schema}
                            enableReinitialize={true}
                            onSubmit={(values, { setSubmitting }) => {
                                console.log(values);
                                setTimeout(() => {
                                    setSubmitting(false);
                                }, 500);
                            }}
                        >
                            {({
                                values,
                                errors,
                                touched,
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                isSubmitting,
                            }) => (
                                <Form onSubmit={handleSubmit} className="space-y-4">

                                    {/* Contact (Email or Phone) field */}
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="contact"
                                            value={values.contact}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="Email or phone number"
                                            className={`w-full bg-gray-700 text-white px-5 py-4 rounded-md focus:outline-none focus:ring-1 ${
                                                touched.contact && errors.contact
                                                    ? "border-2 border-red-500 focus:ring-red-500"
                                                    : "border border-gray-600 focus:ring-gray-400"
                                            }`}
                                        />
                                        {touched.contact && errors.contact && (
                                            <div className="text-red-500 text-sm mt-1">{errors.contact}</div>
                                        )}
                                    </div>

                                    {/* Password field */}
                                    <div className="relative">
                                        <input
                                            type="password"
                                            name="password"
                                            value={values.password}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="Password"
                                            className={`w-full bg-gray-700 text-white px-5 py-4 rounded-md focus:outline-none focus:ring-1 ${
                                                touched.password && errors.password
                                                    ? "border-2 border-red-500 focus:ring-red-500"
                                                    : "border border-gray-600 focus:ring-gray-400"
                                            }`}
                                        />
                                        {touched.password && errors.password && (
                                            <div className="text-red-500 text-sm mt-1">{errors.password}</div>
                                        )}
                                    </div>

                                    {/* Confirm password field - only for signup */}
                                    {isSignUp && (
                                        <div className="relative">
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={values.confirmPassword || ""}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                placeholder="Confirm Password"
                                                className={`w-full bg-gray-700 text-white px-5 py-4 rounded-md focus:outline-none focus:ring-1 ${
                                                    touched.confirmPassword && errors.confirmPassword
                                                        ? "border-2 border-red-500 focus:ring-red-500"
                                                        : "border border-gray-600 focus:ring-gray-400"
                                                }`}
                                            />
                                            {touched.confirmPassword && errors.confirmPassword && (
                                                <div className="text-red-500 text-sm mt-1">{errors.confirmPassword}</div>
                                            )}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-red-600 text-white py-4 rounded-md font-medium hover:bg-red-700 transition duration-200 mt-6"
                                    >
                                        {isSubmitting
                                            ? (isSignUp ? "Signing up..." : "Signing in...")
                                            : (isSignUp ? "Sign Up" : "Sign In")
                                        }
                                    </button>

                                    {/* Only show Remember me for Sign In */}
                                    {!isSignUp && (
                                        <div className="flex justify-between text-gray-400 text-sm mt-2">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="remember"
                                                    className="mr-1 bg-gray-700 border-gray-600"
                                                />
                                                <label htmlFor="remember">Remember me</label>
                                            </div>
                                            <a href="#" className="text-gray-400 hover:underline">Need help?</a>
                                        </div>
                                    )}
                                </Form>
                            )}
                        </Formik>

                        <div className="mt-16">
                            <p className="text-gray-400">
                                {isSignUp
                                    ? "Already have an account?"
                                    : "New to Netflix?"}{" "}
                                <a
                                    href="#"
                                    className="text-white hover:underline"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsSignUp(!isSignUp);
                                    }}
                                >
                                    {isSignUp ? "Sign in now" : "Sign up now"}
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
