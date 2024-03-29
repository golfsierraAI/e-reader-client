import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import Book from "types/book";
import axios from "axios";
import { useNavigate } from "react-router";
const Home = () => {
  const [books, setBooks] = useState<Book[] | []>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const localStorageContent = localStorage.getItem("books-e-reader");
      if (localStorageContent !== null) {
        setBooks(JSON.parse(localStorageContent));
        return;
      }

      const response = await axios.get(
        "https://dreamy-pony-bb753e.netlify.app/.netlify/functions/api"
      );
      localStorage.setItem("books-e-reader", JSON.stringify(response.data));
      setBooks(response.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const renderBooks = () => {
    return books.map((book, index) => {
      return (
        <div key={book.coverURL + index}>
          <img
            alt={book.title}
            className={styles.cover}
            width={"300px"}
            height={"480px"}
            src={book.coverURL}
            onClick={() => navigate("/read", { state: book })}
          />
        </div>
      );
    });
  };

  useEffect(() => {
    fetchBooks();
  }, []);
  return (
    <div className={styles.root}>
      {loading ? (
        <div className={styles.loadingWrapper}>
          <div className={styles.loader}></div>
        </div>
      ) : (
        <div>
          <h1>Read from the best titles</h1>
          <div className={styles.booksWrapper}>{renderBooks()}</div>
        </div>
      )}
    </div>
  );
};

export default Home;
