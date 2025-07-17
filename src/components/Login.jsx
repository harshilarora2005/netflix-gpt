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
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { googleProvider } from "../utils/firebase";

const Login = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [authError, setAuthError] = useState("");
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
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

    const handleGoogleLogin = async () => {
        setAuthError("");
        setIsGoogleLoading(true);
        
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            dispatch(addUser({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL
            }));

            console.log("Google login successful!");
        } catch (error) {
            console.error("Google OAuth Error:", error.message);
            let errorMessage = "";
            switch (error.code) {
                case 'auth/popup-closed-by-user':
                    errorMessage = "Sign-in was cancelled.";
                    break;
                case 'auth/popup-blocked':
                    errorMessage = "Pop-up was blocked. Please allow pop-ups and try again.";
                    break;
                case 'auth/cancelled-popup-request':
                    errorMessage = "Only one sign-in request at a time.";
                    break;
                case 'auth/network-request-failed':
                    errorMessage = "Network error. Please check your connection.";
                    break;
                case 'auth/too-many-requests':
                    errorMessage = "Too many attempts. Please try again later.";
                    break;
                default:
                    errorMessage = "Google sign-in failed. Please try again.";
            }
            
            setAuthError(errorMessage);
        } finally {
            setIsGoogleLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative pt-24">
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

                                    {/* Google Sign-In Divider */}
                                    <div className="mt-6">
                                        <div className="relative">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-gray-600"></div>
                                            </div>
                                            <div className="relative flex justify-center text-sm">
                                                <span className="px-2 bg-black/75 text-gray-400">or</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleGoogleLogin}
                                        disabled={isGoogleLoading || isSubmitting}
                                        className="w-full bg-white text-gray-700 py-4 px-6 rounded-md font-medium hover:bg-gray-50 transition duration-200 mt-6 flex items-center justify-center space-x-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isGoogleLoading ? (
                                            <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-700 rounded-full animate-spin"></div>
                                        ) : (
                                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                                <path
                                                    fill="#4285F4"
                                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                />
                                                <path
                                                    fill="#34A853"
                                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                />
                                                <path
                                                    fill="#FBBC05"
                                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                />
                                                <path
                                                    fill="#EA4335"
                                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                />
                                            </svg>
                                        )}
                                        <span>
                                            {isGoogleLoading ? "Signing in..." : "Continue with Google"}
                                        </span>
                                    </button>
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
                                        setAuthError(""); 
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