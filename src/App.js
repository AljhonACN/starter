import "./App.css";
import { useEffect, useState } from "react";
import * as BooksAPI from "./BooksAPI";

function App() {
  const [showSearchPage, setShowSearchPage] = useState(false);
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

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

  useEffect(() => {
    const getAllBooks = async () => {
      const allBooks = await BooksAPI.getAll();
      setBooks(allBooks);
    };

    getAllBooks();
  }, []);

  useEffect(() => {
    const searchBooks = async () => {
      if (query.trim() === "") {
        setSearchResults([]);
        return;
      }

      const results = await BooksAPI.search(query);

      if (results.error) {
        setSearchResults([]);
        return;
      }

      const updatedSearchResults = results.map((searchBook) => {
        const existingBook = books.find((book) => book.id === searchBook.id);

        if (existingBook) {
          return {
            ...searchBook,
            shelf: existingBook.shelf,
          };
        }

        return {
          ...searchBook,
          shelf: "none",
        };
      });

      setSearchResults(updatedSearchResults);
    };

    searchBooks();
  }, [query, books]);

  const handleShelfChange = async (book, newShelf) => {
    await BooksAPI.update(book, newShelf);

    setBooks((prevBooks) => {
      const bookExists = prevBooks.some(
        (currentBook) => currentBook.id === book.id,
      );

      if (newShelf === "none") {
        return prevBooks.filter((currentBook) => currentBook.id !== book.id);
      }

      if (bookExists) {
        return prevBooks.map((currentBook) =>
          currentBook.id === book.id
            ? {
                ...currentBook,
                shelf: newShelf,
              }
            : currentBook,
        );
      }

      return [
        ...prevBooks,
        {
          ...book,
          shelf: newShelf,
        },
      ];
    });

    setSearchResults((prevResults) =>
      prevResults.map((currentBook) =>
        currentBook.id === book.id
          ? {
              ...currentBook,
              shelf: newShelf,
            }
          : currentBook,
      ),
    );
  };

  const getBookCover = (book) => {
    if (book.imageLinks && book.imageLinks.thumbnail) {
      return `url("${book.imageLinks.thumbnail}")`;
    }

    return "none";
  };

  const getBookAuthors = (book) => {
    if (book.authors && book.authors.length > 0) {
      return book.authors.join(", ");
    }

    return "Unknown Author";
  };

  const renderBook = (book) => {
    return (
      <li key={book.id}>
        <div className="book">
          <div className="book-top">
            <div
              className="book-cover"
              style={{
                width: 128,
                height: 193,
                backgroundImage: getBookCover(book),
              }}
            ></div>

            <div className="book-shelf-changer">
              <select
                value={book.shelf || "none"}
                onChange={(e) => handleShelfChange(book, e.target.value)}
              >
                <option value="move" disabled>
                  Move to...
                </option>

                <option value="currentlyReading">Currently Reading</option>

                <option value="wantToRead">Want to Read</option>

                <option value="read">Read</option>

                <option value="none">None</option>
              </select>
            </div>
          </div>

          <div className="book-title">{book.title}</div>

          <div className="book-authors">{getBookAuthors(book)}</div>
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
              onClick={() => {
                setShowSearchPage(false);
                setQuery("");
                setSearchResults([]);
              }}
            >
              Close
            </button>

            <div className="search-books-input-wrapper">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, author, or ISBN"
              />
            </div>
          </div>

          <div className="search-books-results">
            <ol className="books-grid">
              {searchResults.map((book) => renderBook(book))}
            </ol>
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
