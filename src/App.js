import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import MovieResults from './components/MovieResults';
import MovieHeaders from './components/MovieHeaders';
import Search from './components/Search';
import AddFavs from './components/AddFavs';
import RemoveFavs from './components/RemoveFavs';

const App = () => {
	const [movies, setMovies] = useState([]);
	const [favourites, setFavourites] = useState([]);
	const [tittle, setSearchValue] = useState('');

	const getMovieRequest = async (tittle) => {
		const url = `http://www.omdbapi.com/?s=${tittle}&apikey=5cb03411`;

		const response = await fetch(url);
		const responseJson = await response.json();

		if (responseJson.Search) {
			setMovies(responseJson.Search);
		}
	};

	useEffect(() => {
		getMovieRequest(tittle);
	}, [tittle]);

	useEffect(() => {
		const movieFavourites = JSON.parse(
			localStorage.getItem('movie-favs')
		);

		if (movieFavourites) {
			setFavourites(movieFavourites);
		}
	}, []);

	const saveToLocalStorage = (items) => {
		localStorage.setItem('movie-favs', JSON.stringify(items));
	};

	const addFavouriteMovie = (movie) => {
		const newFavouriteList = [...favourites, movie];
		setFavourites(newFavouriteList);
		saveToLocalStorage(newFavouriteList);
	};

	const removeFavouriteMovie = (movie) => {
		const newFavouriteList = favourites.filter(
			(favourite) => favourite.imdbID !== movie.imdbID
		);

		setFavourites(newFavouriteList);
		saveToLocalStorage(newFavouriteList);
	};

	return (
		<div className='container-fluid movie-app'>
			<div className='row d-flex align-items-center mt-4 mb-4'>
				<MovieHeaders heading='Movies' />
				<Search tittle={tittle} setSearchValue={setSearchValue} />
			</div>
			<div className='row'>
				<MovieResults
					movies={movies}
					handleFavouritesClick={addFavouriteMovie}
					favouriteComponent={AddFavs}
				/>
			</div>
			<div className='row d-flex align-items-center mt-4 mb-4'>
				<MovieHeaders heading='Favourites' />
			</div>
			<div className='row'>
				<MovieResults
					movies={favourites}
					handleFavouritesClick={removeFavouriteMovie}
					favouriteComponent={RemoveFavs}
				/>
			</div>
		</div>
	);
};

export default App;
