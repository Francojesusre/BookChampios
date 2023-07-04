import { useEffect, useState } from 'react';

import NewBook from '../NewBook/NewBook';
import BooksFilter from '../bookFilter/BookFilter';
import Books from '../books/Books';
const BOOKS = [
  {
    id: 1,
    title: '100 años de soledad',
    author: 'Gabriel García Marquez',
    dateRead: new Date(2021, 8, 12),
    pageCount: 410,
  },
  {
    id: 2,
    title: 'Todos los fuegos el fuego',
    author: 'Julio Cortazar',
    dateRead: new Date(2020, 6, 11),
    pageCount: 197,
  },
  {
    id: 3,
    title: 'Asesinato en el Orient Express',
    author: 'Agatha Christie',
    dateRead: new Date(2021, 5, 9),
    pageCount: 256,
  },
  {
    id: 4,
    title: 'Las dos torres',
    author: 'J.R.R Tolkien',
    dateRead: new Date(2020, 3, 22),
    pageCount: 352,
  },
];

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [yearFiltered, setYearFiltered] = useState('2023');

  useEffect(() => {
    fetch('http://localhost:8080/book', {
      headers: {
        Accept: 'application/json',
      },
    })
      .then((response) => response.json())
      .then((bookData) => {
        const booksMapped = bookData.map((book) => ({
          id: book.id,
          title: book.bookTitle,
          dateRead: new Date(book.date),
          pageCount: book.amountPages,
          author: book.author.authorName + ' ' + book.author.authorLastName,
        }));
        setBooks(booksMapped);
      })
      .catch((error) => console.log(error));
  }, []);

  const addBookHandler = (book) => {
    const dateString = book.dateRead.toISOString().slice(0, 10);
    const authorNameFull = book.author.split(' ');
    const authorName = authorNameFull[0];
    const authorLastName = authorNameFull[1];

    fetch('http://localhost:8080/book', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        bookTitle: book.title,
        date: dateString,
        amountPages: parseInt(book.pageCount, 10),
        author: { authorName: authorName, authorLastName: authorLastName },
      }),
    })
      .then((response) => {
        if (response.ok) return response.json();
        else {
          throw new Error('The response had some errors');
        }
      })
      .then(() => {
        const newBooksArray = [book, ...books];
        setBooks(newBooksArray);
      })
      .catch((error) => console.log(error));
  };

  const handleFilterChange = (year) => {
    setYearFiltered(year);
  };

  return (
    <>
      <h1 className='d-flex justify-content-center'>Books Champion App!</h1>
      <h3 className='d-flex justify-content-center'>¡Quiero leer libros!</h3>
      <NewBook onBookAdded={addBookHandler} />
      <BooksFilter yearFiltered={yearFiltered} onYearChange={handleFilterChange} />
      <Books yearFiltered={yearFiltered} books={books} />
    </>
  );
};

export default Dashboard;
