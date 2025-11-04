import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-gray-100 text-gray-500 text-xs py-2 px-4 sm:px-6 lg:px-8">
            <div className="relative flex justify-center items-center max-w-7xl mx-auto">
                <span className="font-medium">Tripathi &amp; Co</span>
                <span className="absolute right-0">unofficial, for test purpose</span>
            </div>
        </footer>
    );
};

export default Footer;
