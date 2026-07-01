import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import * as BooksAPI from "./BooksAPI";
import Book from "./components/Book";

function App() {
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

  const clearSearch = () => {
    setQuery("");
    setSearchResults([]);
  };

  return (
    <BrowserRouter>
      <div className="app">
        <Switch>
          <Route exact path="/">
            <ListBooks
              shelves={shelves}
              books={books}
              getBookCover={getBookCover}
              getBookAuthors={getBookAuthors}
              handleShelfChange={handleShelfChange}
            />
          </Route>

          <Route path="/search">
            <SearchBooks
              query={query}
              setQuery={setQuery}
              searchResults={searchResults}
              getBookCover={getBookCover}
              getBookAuthors={getBookAuthors}
              handleShelfChange={handleShelfChange}
              clearSearch={clearSearch}
            />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

function ListBooks({
  shelves,
  books,
  getBookCover,
  getBookAuthors,
  handleShelfChange,
}) {
  return (
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
                    .map((book) => (
                      <Book
                        key={book.id}
                        book={book}
                        getBookCover={getBookCover}
                        getBookAuthors={getBookAuthors}
                        handleShelfChange={handleShelfChange}
                      />
                    ))}
                </ol>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="open-search">
        <Link to="/search">Add a book</Link>
      </div>
    </div>
  );
}

function SearchBooks({
  query,
  setQuery,
  searchResults,
  getBookCover,
  getBookAuthors,
  handleShelfChange,
  clearSearch,
}) {
  return (
    <div className="search-books">
      <div className="search-books-bar">
        <Link to="/" className="close-search" onClick={clearSearch}>
          Close
        </Link>

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
          {searchResults.map((book) => (
            <Book
              key={book.id}
              book={book}
              getBookCover={getBookCover}
              getBookAuthors={getBookAuthors}
              handleShelfChange={handleShelfChange}
            />
          ))}
        </ol>
      </div>
    </div>
  );
}

export default App;
