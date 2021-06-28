import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import MovieResults from './components/MovieResults';
import MovieHeaders from './components/MovieHeaders';
import Search from './components/Search';
import AddFavs from './components/AddFavs';
import RemoveFavs from './components/RemoveFavs';


const BASE_URL ="https://omdb-api-demo.herokuapp.com/";
const App = () => {
	const [movies, setMovies] = useState([]);
	const [favourites, setFavourites] = useState([]);
	const [tittle, setSearchValue] = useState('');

	const getMovieRequest = async (tittle) => {
		const url = `https://omdb-api-demo.herokuapp.com/search/${tittle}`;

		const response = await fetch(url);
		const responseJson = await response.json();

		if (responseJson.Search) {
			setMovies(responseJson.Search);
		}
	};

	useEffect(() => {
		getMovieRequest(tittle);
	}, [tittle]);

	// useEffect(() => {
		// getFavourite();
		// const movieFavourites = JSON.parse(
		// 	localStorage.getItem('movie-favs')
		// );

		// if (movieFavourites) {
		// 	setFavourites(movieFavourites);
		// }
	// }, []);

	const getFavourite = async () => {
		let movieFavourites = await httpRequest("favourites");
		if (movieFavourites && movieFavourites.status)  {
			setFavourites(movieFavourites.data);
		}
	}

	// const saveToLocalStorage = (items) => {
	// 	localStorage.setItem('movie-favs', JSON.stringify(items));
	// };

	const addFavouriteMovie = (movie) => {
		const newFavouriteList = [...favourites, movie];
		setFavourites(newFavouriteList);
		console.log('movie', movie);
		httpRequest("favourites",movie, "POST");	
	};

	const removeFavouriteMovie = (movie) => {
		const newFavouriteList = favourites.filter(
			(favourite) => favourite.imdbID !== movie.imdbID
		);

		setFavourites(newFavouriteList);
		// saveToLocalStorage(newFavouriteList);
	};

	const resetFavourites = async () => {
		httpRequest("favourites",{}, "DELETE");
		setFavourites([]);
	}

	const httpRequest = async (endpoint, params = null, method = 'GET') => {
		let url = BASE_URL + endpoint;
		const config = {
		  method: method,
		  headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		  },
		};
		if (method !== 'GET') {
		  config['body'] = JSON.stringify(params);
		}
		console.log('config', config, url);
		return fetch(url, config).then((response) => response.json());
	  }


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
				<button style={{width: 150, marginRight: 20}} onClick={()=>{resetFavourites()}}>reset</button>
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