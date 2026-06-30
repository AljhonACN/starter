import "./App.css";
import { useState } from "react";

function App() {
  const [showSearchPage, setShowSearchPage] = useState(false);

  const [books, setBooks] = useState([
    {
      id: 1,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      shelf: "currentlyReading",
      likes: 0,
      cover:
        'url("http://books.google.com/books/content?id=PGR2AwAAQBAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api")',
      width: 128,
      height: 193,
    },
    {
      id: 2,
      title: "Ender's Game",
      author: "Orson Scott Card",
      shelf: "currentlyReading",
      likes: 0,
      cover:
        'url("http://books.google.com/books/content?id=yDtCuFHXbAYC&printsec=frontcover&img=1&zoom=1&source=gbs_api")',
      width: 128,
      height: 188,
    },
    {
      id: 3,
      title: "1776",
      author: "David McCullough",
      shelf: "wantToRead",
      likes: 0,
      cover:
        'url("http://books.google.com/books/content?id=uu1mC6zWNTwC&printsec=frontcover&img=1&zoom=1&source=gbs_api")',
      width: 128,
      height: 193,
    },
    {
      id: 4,
      title: "Harry Potter and the Sorcerer's Stone",
      author: "J.K. Rowling",
      shelf: "wantToRead",
      likes: 0,
      cover:
        'url("http://books.google.com/books/content?id=wrOQLV6xB-wC&printsec=frontcover&img=1&zoom=1&source=gbs_api")',
      width: 128,
      height: 192,
    },
    {
      id: 5,
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      shelf: "read",
      likes: 0,
      cover:
        'url("http://books.google.com/books/content?id=pD6arNyKyi8C&printsec=frontcover&img=1&zoom=1&source=gbs_api")',
      width: 128,
      height: 192,
    },
    {
      id: 6,
      title: "Oh, the Places You'll Go!",
      author: "Seuss",
      shelf: "read",
      likes: 0,
      cover:
        'url("http://books.google.com/books/content?id=1q_xAwAAQBAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api")',
      width: 128,
      height: 174,
    },
    {
      id: 7,
      title: "The Adventures of Tom Sawyer",
      author: "Mark Twain",
      shelf: "read",
      likes: 0,
      cover:
        'url("http://books.google.com/books/content?id=32haAAAAMAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api")',
      width: 128,
      height: 192,
    },
  ]);

  const shelves = [
    {
      key: "currentlyReading",
      title: "Currently Reading",
    },
    {
      key: "wantToRead",
      title: "Want to Read",
    },
    {
      key: "read",
      title: "Read",
    },
  ];

  const handleShelfChange = (id, newShelf) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === id ? { ...book, shelf: newShelf } : book,
      ),
    );
  };

  const handleLike = (id) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === id ? { ...book, likes: book.likes + 1 } : book,
      ),
    );
  };

  const renderBook = (book) => {
    return (
      <li key={book.id}>
        <div className="book">
          <div className="book-top">
            <div
              className="book-cover"
              style={{
                width: book.width,
                height: book.height,
                backgroundImage: book.cover,
              }}
            ></div>

            <div className="book-shelf-changer">
              <select
                value={book.shelf}
                onChange={(e) => handleShelfChange(book.id, e.target.value)}
              >
                <option value="currentlyReading">Currently Reading</option>
                <option value="wantToRead">Want to Read</option>
                <option value="read">Read</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>

          <div className="book-title">{book.title}</div>
          <div className="book-authors">{book.author}</div>

          <p>Current Shelf: {book.shelf}</p>
          <p>Likes: {book.likes}</p>

          <button onClick={() => handleLike(book.id)}>Like Book</button>
        </div>
      </li>
    );
  };

  return (
    <div className="app">
      {showSearchPage ? (
        <div className="search-books">
          <div className="search-books-bar">
            <button
              className="close-search"
              onClick={() => setShowSearchPage(false)}
            >
              Close
            </button>

            <div className="search-books-input-wrapper">
              <input
                type="text"
                placeholder="Search by title, author, or ISBN"
              />
            </div>
          </div>

          <div className="search-books-results">
            <ol className="books-grid"></ol>
          </div>
        </div>
      ) : (
        <div className="list-books">
          <div className="list-books-title">
            <h1>MyReads</h1>
          </div>

          <div className="list-books-content">
            <div>
              {shelves.map((shelf) => (
                <div className="bookshelf" key={shelf.key}>
                  <h2 className="bookshelf-title">{shelf.title}</h2>

                  <div className="bookshelf-books">
                    <ol className="books-grid">
                      {books
                        .filter((book) => book.shelf === shelf.key)
                        .map((book) => renderBook(book))}
                    </ol>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="open-search">
            <button onClick={() => setShowSearchPage(true)}>Add a book</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
