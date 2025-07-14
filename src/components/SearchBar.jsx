import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const SearchBar = () => {
    const [isFocused, setIsFocused] = useState(false);

    const validationSchema = Yup.object({
        searchQuery: Yup.string()
        .min(2, 'Search must be at least 2 characters')
        .max(50, 'Search must be less than 50 characters')
        .required('Search cannot be empty')
    });

    const formik = useFormik({
        initialValues: {
        searchQuery: ''
        },
        validationSchema,
        onSubmit: (values) => {
        console.log('Search for:', values.searchQuery);
        // Handle search logic here
        }
    });

    const handleInputChange = (e) => {
        formik.handleChange(e);
        if (e.target.value.length > 2) {
        console.log('Real-time search:', e.target.value);
        }
    };

    return (
        <div className="pt-24 w-full max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={formik.handleSubmit} className="relative">
            <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg 
                className={`w-5 h-5 transition-colors duration-200 ${
                    isFocused ? 'text-white' : 'text-gray-400'
                }`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                >
                <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
                </svg>
            </div>

            <input
                type="text"
                name="searchQuery"
                value={formik.values.searchQuery}
                onChange={handleInputChange}
                onBlur={(e) => {
                formik.handleBlur(e);
                setIsFocused(false);
                }}
                onFocus={() => setIsFocused(true)}
                placeholder="Search for movies, TV shows, documentaries..."
                className={`w-full bg-gray-900 text-white placeholder-gray-400 
                pl-12 pr-4 py-4 rounded-md border-2 transition-all duration-300 
                focus:outline-none focus:ring-0 text-lg
                ${isFocused 
                    ? 'border-red-600 bg-black shadow-lg shadow-red-600/20' 
                    : 'border-gray-700 hover:border-gray-600'
                }
                ${formik.touched.searchQuery && formik.errors.searchQuery 
                    ? 'border-red-500' 
                    : ''
                }`}
            />
            {formik.values.searchQuery && (
                <button
                type="button"
                onClick={() => formik.setFieldValue('searchQuery', '')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors duration-200"
                >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                </button>
            )}
            </div>

            {/* Error Message */}
            {formik.touched.searchQuery && formik.errors.searchQuery && (
            <div className="mt-2 text-red-400 text-sm font-medium">
                {formik.errors.searchQuery}
            </div>
            )}

            <button type="submit" className="hidden">
            Search
            </button>
        </form>
        {formik.values.searchQuery && !formik.errors.searchQuery && (
            <div className="mt-4 text-gray-300 text-sm">
            Searching for "{formik.values.searchQuery}"...
            </div>
        )}
        </div>
    );
};

export default SearchBar;