import { useEffect, useState } from "react";
import { Auth } from "./components/auth";
import { db, auth, storage } from "./config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

const moviesColectionRef = collection(db, "movies");

function App() {
  const [movies, setMovies] = useState([]);
  const [newMovieTile, setNewMovieTile] = useState("");
  const [newMoiveStar, setNewMoiveStar] = useState(0);
  const [newMovieYear, setNewMovieYear] = useState(0);
  const [isUpdateMovie, setIsUpdateMovie] = useState({
    id: null,
    isShow: false,
  });

  const [fileUpload, setFileUpLoad] = useState(null);

  const getMovies = async () => {
    try {
      const data = await getDocs(moviesColectionRef);
      const firebaseData = data.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      });

      setMovies(firebaseData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  const listMovies = movies.map((movie) => {
    return (
      <ul key={movie.id}>
        {isUpdateMovie.id === movie.id && isUpdateMovie.isShow ? (
          <>
            <input
              type="text"
              placeholder="title"
              onChange={(e) => setNewMovieTile(e.target.value)}
            />
            <input
              type="number"
              placeholder="date"
              onChange={(e) => setNewMovieYear(Number(e.target.value))}
            />
            <input
              type="number"
              placeholder="star"
              onChange={(e) => setNewMoiveStar(Number(e.target.value))}
            />
            <li onClick={() => setIsUpdateMovie(false)}> cancel </li>
            <li onClick={() => handleUpdate(movie.id)}> yes </li>
          </>
        ) : (
          <>
            <li>{movie.title}</li>
            <li>{movie.year}</li>
            <li>{movie.rateStar}</li>
          </>
        )}

        <li style={{ color: "red" }} onClick={() => deleteMovive(movie.id)}>
          delete
        </li>
        <li style={{ color: "green" }} onClick={() => showUpdate(movie.id)}>
          update
        </li>
      </ul>
    );
  });

  const onAddMovie = async function () {
    try {
      await addDoc(moviesColectionRef, {
        title: newMovieTile,
        year: newMovieYear,
        rateStar: newMoiveStar,
        userId: auth?.currentUser.uid,
      });
      getMovies();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMovive = async function (id) {
    try {
      const movieDoc = doc(db, "movies", id);
      await deleteDoc(movieDoc);

      getMovies();
    } catch (err) {
      console.error(err);
    }
  };

  const showUpdate = function (id) {
    setIsUpdateMovie({ id: id, isShow: true });
  };

  const handleUpdate = async function (id) {
    try {
      const movieDoc = doc(db, "movies", id);
      await updateDoc(movieDoc, {
        title: newMovieTile,
        year: newMovieYear,
        rateStar: newMoiveStar,
      });

      getMovies();
    } catch (err) {
      console.error(err);
    }
  };

  const uploadFile = async function () {
    if (!fileUpload) return;
    const { name } = fileUpload[0];

    const filesFolderRef = ref(storage, "projectFile/" + name);
    try {
      await uploadBytes(filesFolderRef, fileUpload[0]);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <h1>
      {<Auth />}
      <div>
        <input
          type="text"
          placeholder="title"
          onChange={(e) => setNewMovieTile(e.target.value)}
        />
        <input
          type="number"
          placeholder="date"
          onChange={(e) => setNewMovieYear(Number(e.target.value))}
        />
        <input
          type="number"
          placeholder="star"
          onChange={(e) => setNewMoiveStar(Number(e.target.value))}
        />
        <button onClick={onAddMovie}> add movie </button>
      </div>
      <div>{listMovies}</div>
      <div>
        <input type="file" onChange={(e) => setFileUpLoad(e.target.files)} />
        <button onClick={uploadFile}> upload file </button>
      </div>
    </h1>
  );
}

export default App;
