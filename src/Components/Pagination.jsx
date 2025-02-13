import React from 'react';

const Pagination = ({ pagesPerPage, totalPages, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPages / pagesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className='flex justify-center mt-4'>
      <ul className='inline-flex items-center -space-x-px'>
        {pageNumbers.map(number => (
          <li key={number}>
            <button
              onClick={() => paginate(number)}
              className={`px-3 py-2 leading-tight ${
                number === currentPage
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-500 bg-white'
              } border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
