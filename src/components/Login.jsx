import Header from "./Header";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import bg from "/bg.jpg";
import { useState, useRef } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { DEFAULT_PROFILE } from "../utils/constants";

const Login = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [authError, setAuthError] = useState("");
    const dispatch = useDispatch();
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const usernameRef = useRef(null);
    
    const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
    
    const signUpSchema = Yup.object({
        username: Yup.string()
            .required("Username is required")
            .min(4, "Username must be minimum of 4 characters atleast")
            .max(20, "Username must be maximum of 20 characters")
            .matches(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),

        contact: Yup.string()
            .required("Email or phone is required")
            .test("is-valid-contact", "Must be a valid email or phone number", (value) => {
                if (!value) return false;
                const isEmail = Yup.string().email().isValidSync(value);
                const isPhone = phoneRegex.test(value);
                return isEmail || isPhone;
            }),
        password: Yup.string()
            .min(8, "Password must be at least 8 characters")
            .matches(/[A-Z]/, "Must contain an uppercase letter")
            .matches(/[0-9]/, "Must contain a number")
            .required("Required"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Required'),
    });

    const signInSchema = Yup.object({
        contact: Yup.string()
            .required("Email or phone is required")
            .test("is-valid-contact", "Must be a valid email or phone number", (value) => {
                if (!value) return false;
                const isEmail = Yup.string().email().isValidSync(value);
                const isPhone = phoneRegex.test(value);
                return isEmail || isPhone;
            }),
        password: Yup.string()
            .required("Password is required"),
    });

    const schema = isSignUp ? signUpSchema : signInSchema;

    const initialValues = isSignUp
        ? { username: "", contact: "", password: "", confirmPassword: "" }
        : { contact: "", password: "" };

    const handleFirebaseAuth = async (values, setSubmitting) => {
        const { contact, password, username } = values;
        const email = contact;
        setAuthError("");

        try {
            if (isSignUp) {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                
                await updateProfile(user, {
                    displayName: username,
                    photoURL: DEFAULT_PROFILE
                });
                const {uid, userEmail,displayName,photoURL} = auth.currentUser;
                console.log(photoURL);
                dispatch(addUser({
                    uid: uid,
                    email: userEmail,
                    displayName: displayName,
                    photoURL: photoURL
                }));

                console.log("User registered successfully!");
                setIsSignUp(false);
            } else {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                dispatch(addUser({
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                }));

                console.log("Login successful!");
            }
        } catch (error) {
            console.error("Firebase Auth Error:", error.message);
            let errorMessage = "";
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = "No account found with this email address.";
                    break;
                case 'auth/wrong-password':
                    errorMessage = "Incorrect password. Please try again.";
                    break;
                case 'auth/invalid-email':
                    errorMessage = "Invalid email address format.";
                    break;
                case 'auth/user-disabled':
                    errorMessage = "This account has been disabled.";
                    break;
                case 'auth/email-already-in-use':
                    errorMessage = "An account with this email already exists.";
                    break;
                case 'auth/weak-password':
                    errorMessage = "Password should be at least 6 characters.";
                    break;
                case 'auth/network-request-failed':
                    errorMessage = "Network error. Please check your connection.";
                    break;
                case 'auth/too-many-requests':
                    errorMessage = "Too many failed attempts. Please try again later.";
                    break;
                case 'auth/invalid-credential':
                    errorMessage = "Invalid email or password. Please check your credentials.";
                    break;
                default:
                    errorMessage = "Authentication failed. Please try again.";
            }
            
            setAuthError(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

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
                                handleFirebaseAuth(values, setSubmitting);
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
                                    {isSignUp && (
                                        <div className="relative">
                                            <input
                                                ref={usernameRef}
                                                type="text"
                                                name="username"
                                                value={values.username || ""}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                placeholder="Username"
                                                className={`w-full bg-gray-700 text-white px-5 py-4 rounded-md focus:outline-none focus:ring-1 ${
                                                    touched.username && errors.username
                                                        ? "border-2 border-red-500 focus:ring-red-500"
                                                        : "border border-gray-600 focus:ring-gray-400"
                                                }`}
                                            />
                                            {touched.username && errors.username && (
                                                <div className="text-red-500 text-sm mt-1">{errors.username}</div>
                                            )}
                                        </div>
                                    )}
                                    <div className="relative">
                                        <input
                                            ref={emailRef}
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
                                    <div className="relative">
                                        <input
                                            ref={passwordRef}
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
                                            : (isSignUp ? "Sign Up" : "Sign In")}
                                    </button>

                                    {authError && (
                                        <div className="text-red-500 text-sm mt-2 text-center">
                                            {authError}
                                        </div>
                                    )}

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
                                {isSignUp ? "Already have an account?" : "New to the app?"}{" "}
                                <a
                                    href="#"
                                    className="text-white hover:underline"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsSignUp(!isSignUp);
                                        setAuthError(""); // Clear error when switching modes
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