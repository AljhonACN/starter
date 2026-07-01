import PropTypes from "prop-types";

function Book({ book, getBookCover, getBookAuthors, handleShelfChange }) {
  return (
    <li>
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
}

Book.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    shelf: PropTypes.string,
    authors: PropTypes.arrayOf(PropTypes.string),
    imageLinks: PropTypes.shape({
      thumbnail: PropTypes.string,
    }),
  }).isRequired,

  getBookCover: PropTypes.func.isRequired,
  getBookAuthors: PropTypes.func.isRequired,
  handleShelfChange: PropTypes.func.isRequired,
};

export default Book;
