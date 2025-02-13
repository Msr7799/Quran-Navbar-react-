import React, { useEffect, useState } from 'react';
import Pagination from './Pagination';
const QuranPages = () => {
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pagesPerPage = 2; //Number of pages per page

  useEffect(() => {
    fetch('/data/pagesQuran.json')
      .then(response => response.json())
      .then(data => setPages(data));
  }, []);


  const indexOfLastPage = currentPage * pagesPerPage;
  const indexOfFirstPage = indexOfLastPage - pagesPerPage;
  const currentPages = pages.slice(indexOfFirstPage, indexOfLastPage);

  // تغيير الصفحة
  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div dir='rtl' className='p-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {currentPages.map(page => (
          <div key={page.page} className='shadow-lg rounded-lg overflow-hidden'>
            <img
              src={page.image.url}
              alt={`صفحة ${page.page}`}
              className='w-full h-auto object-cover'
            />
            <div className='p-2 bg-gray-100 dark:bg-gray-800 text-center'>
              <h3 className='text-lg font-semibold text-gray-700 dark:text-gray-200'>
                {`سورة ${page.start.name.ar} - آية ${page.start.verse}`}
              </h3>
            </div>
          </div>
        ))}
      </div>
      <Pagination
        pagesPerPage={pagesPerPage}
        totalPages={pages.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
};

export default QuranPages;