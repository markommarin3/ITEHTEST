import React from 'react';

const Input = ({ label, type = 'text', placeholder, value, onChange, error, name, required = false, className = '' }) => {
    return (
        <div className={`flex flex-col gap-1 mb-4 ${className}`}>
            {label && (
                <label className="text-sm font-semibold text-gray-700">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                className={`px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${error ? 'border-red-500' : 'border-gray-300 shadow-sm'
                    }`}
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
};

export default Input;
