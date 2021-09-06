import React, { Component } from 'react';
import './App.css';
import Cell from './Cell.js';
import Button from './Button.js';
import Search from './Search.js';
import Dock from './Dock.js';
import ReactPageScroller from 'react-page-scroller';

class App extends Component {
  constructor(props) {
    super(props)
    this.onClick = this.onClick.bind(this);
    this.search = this.search.bind(this);
    this.searchFilter = this.searchFilter.bind(this);
    this.getFilms = this.getFilms.bind(this);
    this.state = {
      filter: "Old",
      list: [],
      filteredList: [],
      search: "",
			isLoaded: false,
    }
  }

  componentDidMount() {
    this.getFilms();
  }

  getFilms() {
		fetch('/api/films')
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            list: result,
            filteredList: result
          });
        },
        (error) => {
          console.log(error);
        }
      )
  }

  onClick(e, sort) {
    e.preventDefault();

		let sortedList = [];

    if(sort === "Bad") {
			sortedList = this.state.list.sort((a,b) => {
				return a.rating - b.rating;
			})
    }

    if(sort === "Good") {
			sortedList = this.state.list.sort((a,b) => {
				return b.rating - a.rating;
			})
    }

    if(sort === "New") {
			sortedList = this.state.list.sort((a,b) => {
				return b.year - a.year;
			})
    }

    if(sort === "Old") {
			sortedList = this.state.list.sort((a,b) => {
				return a.year - b.year;
			})
    }

    if(sort === "Title") {
			sortedList = this.state.list.sort((a,b) => {
				const nameA = a.name.toUpperCase();
				const nameB = b.name.toUpperCase();
				if (nameA < nameB) {
					return -1;
				}
				if (nameA > nameB) {
					return 1;
				}

				return 0;
			})
    }

    if(sort === "Period") {
			sortedList = this.state.list.sort((a,b) => {
				const nameA = a.period.toUpperCase();
				const nameB = b.period.toUpperCase();
				if (nameA < nameB) {
					return -1;
				}
				if (nameA > nameB) {
					return 1;
				}

				return 0;
			})
    }

    if(sort === "Director") {
			sortedList = this.state.list.sort((a,b) => {
				const nameA = a.director.toString().toUpperCase();
				const nameB = b.director.toString().toUpperCase();
				if (nameA < nameB) {
					return -1;
				}
				if (nameA > nameB) {
					return 1;
				}

				return 0;
			})
    }

		if(sort === "Must-Watch") {
			sortedList = this.state.list.filter(movie => movie.must === true);
		}

		if(sort === "Action") {
			sortedList = this.state.list.filter(movie => movie.genre.includes("Action"));
		}

		if(sort === "Comedy") {
			sortedList = this.state.list.filter(movie => movie.genre.includes("Comedy"));
		}

		if(sort === "Drama") {
			sortedList = this.state.list.filter(movie => movie.genre.includes("Drama"));
		}

		if(sort === "Kung Fu") {
			sortedList = this.state.list.filter(movie => movie.genre.includes("Kung Fu"));
		}

		if(sort === "Romance") {
			sortedList = this.state.list.filter(movie => movie.genre.includes("Romance"));
		}

		if(sort === "Random") {
      if(this.state.filter === "Search") {
        sortedList = [this.state.filteredList[this.getRandomInt(this.state.filteredList.length)]]
      } else {
        const newList = this.onClick(e, this.state.filter);
        sortedList = [newList[this.getRandomInt(newList.length)]];
      }
		}

    this.setFilter(sort, sortedList);

		return sortedList;
  };

  up() {
    window.scroll({
      top: 0,
      behavior: "smooth"
    });
  }

	setFilter(filter, list) {
		if(filter !== "Random") {
			this.setState({filter: filter, filteredList: list});
		} else {
			this.setState({filteredList: list});
		};

	};

	getRandomInt(max) {
		return Math.floor(Math.random() * Math.floor(max));
	};

  search(search) {
    const reg = new RegExp(search, 'gi');
    this.setState({filteredList:
      this.state.list.filter(movie => {
        return (movie.name + movie.year + movie.period + movie.review + movie.synopsis + movie.director.toString() + movie.genre.toString()).match(reg) !== null
      })
    });
  };

  searchFilter() {
    this.setState({filter: "Search", filteredList: this.state.list});
  };

  render() {
    const listMovies = this.state.filteredList.map(film => <Cell key={film.name} movie={film} getFilms={this.getFilms}/>)
    return (
      <div className="App">

        {
          listMovies.length === 0
            ? <div>Loading...</div>
            : listMovies.length === 1
              ? listMovies[0]
              : <ReactPageScroller
                animationTimer={100}
              >
                {listMovies}
              </ReactPageScroller>
        }

        <Dock>
          <Search filter={this.state.filter} searchFilter={this.searchFilter} handleClick={this.search}/>
          <Button tab="" filter={this.state.filter} click={this.onClick} size="small" position="left" title="Action"/>
          <Button tab="" filter={this.state.filter} click={this.onClick} size="small" position="middle" title="Kung Fu"/>
          <Button tab="" filter={this.state.filter} click={this.onClick} size="small" position="middle" title="Comedy"/>
          <Button tab="" filter={this.state.filter} click={this.onClick} size="small" position="middle" title="Drama"/>
          <Button tab="" filter={this.state.filter} click={this.onClick} size="small" position="right" title="Romance"/>
          <Button tab="" filter={this.state.filter} click={this.onClick} size="small" position="" title="Director"/>
          <Button tab="" filter={this.state.filter} click={this.onClick} size="small" position="" title="Period"/>
          <Button tab="" filter={this.state.filter} click={this.onClick} size="small" position="" title="Must-Watch"/>
          <Button tab="" filter={this.state.filter} click={this.onClick} size="small" position="" title="Title"/>
          <Button tab="" filter={this.state.filter} click={this.onClick} size="small" position="" title="Random"/>
          <Button tab="" filter={this.state.filter} click={this.onClick} size="small" position="left" title="Old"/>
          <Button tab="" filter={this.state.filter} click={this.onClick} size="small" position="right" title="New"/>
          <Button tab="" filter={this.state.filter} click={this.onClick} size="small" position="left" title="Good"/>
          <Button tab="" filter={this.state.filter} click={this.onClick} size="small" position="right" title="Bad"/>
        </Dock>

      </div>
    );
  }
}
export default App;
