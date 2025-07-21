/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getMovieRecommendations } from '../utils/gemini';
import useSearchContent from './hooks/useSearchContent';
import { useDispatch } from 'react-redux';
import { addRecommendedMovies, addSeenMovies, clearMovies, addPromptText} from '../utils/searchSlice';

const SearchBar = () => {
    const [isFocused, setIsFocused] = useState(false);
    const [loading, setLoading] = useState(false);
    const [debouncedQuery, setDebouncedQuery] = useState("");

    const searchContent = useSearchContent();
    const dispatch = useDispatch();

    const validationSchema = Yup.object({
        searchQuery: Yup.string()
        .min(2, 'Search must be at least 2 characters')
        .max(50, 'Search must be less than 50 characters')
        .required('Search cannot be empty'),
    });

    const formik = useFormik({
        initialValues: {
        searchQuery: '',
        },
        validationSchema,
        onSubmit: async (values) => {
        await handleRecommendationFlow(values.searchQuery);
        },
    });

    const handleRecommendationFlow = async (query) => {
        setLoading(true);
        try {
            dispatch(addPromptText(query));
            const response = await getMovieRecommendations(query);
            const contentNames = response.split(',').map((m) => m.trim()).filter(Boolean);

            const promiseArray = contentNames.map((content) => searchContent(content));
            const result = await Promise.all(promiseArray);
            const recommendedMovies = result.flat().filter(Boolean);
            dispatch(clearMovies());
            dispatch(addRecommendedMovies(recommendedMovies));
            dispatch(addSeenMovies(response));
        } catch (error) {
            console.error("Error fetching recommendations:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (debouncedQuery.length > 2) {
        const timeoutId = setTimeout(() => {
            handleRecommendationFlow(debouncedQuery);
        }, 1000);

        return () => clearTimeout(timeoutId);
        }
    }, [debouncedQuery]);

    const handleInputChange = (e) => {
        formik.handleChange(e);
        setDebouncedQuery(e.target.value);
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
                ${
                    isFocused
                    ? 'border-red-600 bg-black shadow-lg shadow-red-600/20'
                    : 'border-gray-700 hover:border-gray-600'
                }
                ${
                    formik.touched.searchQuery && formik.errors.searchQuery
                    ? 'border-red-500'
                    : ''
                }`}
            />

            {formik.values.searchQuery && (
                <button
                type="button"
                onClick={() => {
                    formik.setFieldValue('searchQuery', '');
                    setDebouncedQuery('');
                }}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors duration-200"
                >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
                </button>
            )}
            </div>

            {formik.touched.searchQuery && formik.errors.searchQuery && (
            <div className="mt-2 text-red-400 text-sm font-medium">
                {formik.errors.searchQuery}
            </div>
            )}

            <button type="submit" className="hidden">Search</button>
        </form>

        {loading && (
            <div className="mt-4 text-gray-400 text-sm italic">
            Searching for movies...
            </div>
        )}
        </div>
    );
};

export default SearchBar;
