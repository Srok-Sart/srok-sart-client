import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    if (totalPages === 1) return null;

    const generatePaginationItems = () => {
        const items = [];

        items.push(
            <button
                key="first"
                onClick={() => onPageChange(1)}
                className={`px-3 py-1 rounded-md ${
                    currentPage === 1 
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                    disabled={currentPage === 1}
            >
                1
            </button>
        );

        if (currentPage > 3) {
            items.push (
                <span key="ellipsis-start">
                    ...
                </span>
            );
        }

        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            if (i === 1 || i === totalPages) continue;

            items.push(
                <button
                    key={i}
                    onClick={() => onPageChange(i)}
                    className={`px-3 py-1 rounded-md ${
                        currentPage === i
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                >
                    {i}
                </button>
            )
        }

        if (currentPage < totalPages - 2) {
            items.push(
                <span key="ellipsis-end" className='px-2 py-1'>
                    ...
                </span>
            );
        }

        if (totalPages > 1) { 
            items.push( 
                <button
                    key="last"
                    onClick={() => onPageChange(totalPages)}
                    className={`px-3 py-1 rounded-md ${
                        currentPage === totalPages
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                    disabled={currentPage === totalPages}
                >
                    {totalPages}
                </button>
            );
        }

        return items;
    };

    return (
        <div className='flex items-center justify-center mt-6 mb-4'>
            <button
                onClick={() => onPageChange(currentPage -1)}
                className="px-3 py-1 mr-2 rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === 1}
            >
                &laquo; Prev
            </button>

            <div className='flex items-center space-x-1'> 
                {generatePaginationItems()}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                className="px-3 py-1 ml-2 rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === totalPages}
            >
                Next &raquo;
            </button>
        </div>
    )
};

export default Pagination;