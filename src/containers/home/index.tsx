import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import Book from "types/book";
import axios from "axios";
import { useNavigate } from "react-router";
const Home = () => {
  const [books, setBooks] = useState<Book[] | []>([]);
  const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
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
    } catch (err) {}
  };

  const renderBooks = () => {
    return books.map((book) => {
      return (
        <div key={book.coverURL}>
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
      <div className={styles.booksWrapper}>{renderBooks()}</div>
    </div>
  );
};

export default Home;
