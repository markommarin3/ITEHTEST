import React from 'react';

const Card = ({ title, subtitle, image, children, footer, className = '', onClick }) => {
    return (
        <div
            className={`bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 flex flex-col ${className} ${onClick ? 'cursor-pointer hover:shadow transition-shadow' : ''}`}
            onClick={onClick}
        >
            {image && (
                <img
                    src={image}
                    alt={title}
                    className="w-full h-48 object-cover"
                />
            )}
            <div className="p-4 flex-grow">
                {title && <h3 className="text-lg font-bold text-gray-900">{title}</h3>}
                {subtitle && <p className="text-sm text-gray-500 mb-2">{subtitle}</p>}
                <div className="mt-2 text-gray-700">
                    {children}
                </div>
            </div>
            {footer && (
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 mt-auto">
                    {footer}
                </div>
            )}
        </div>
    );
};

export default Card;
