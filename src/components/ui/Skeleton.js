import React from 'react';

const Skeleton = ({
    className = "",
    variant = "rectangular", // rectangular, circular, text
    width,
    height
}) => {
    const baseClasses = "animate-pulse bg-gray-200";

    const variantClasses = {
        rectangular: "rounded-md",
        circular: "rounded-full",
        text: "rounded h-4 w-full"
    };

    const style = {
        width: width,
        height: height
    };

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant] || variantClasses.rectangular} ${className}`}
            style={style}
            aria-hidden="true"
        />
    );
};

export default Skeleton;
