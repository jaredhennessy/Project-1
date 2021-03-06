$(document).ready(function () {
  var mediaType; // movies shows or books
  var genreList = []; // for dropdown
  var cardsArr = []; // holds MediaCard object instances
  var listSelection; // genre to be searched for
  var mediaTypeEl = $("#media-type");
  var myListArr;
  var genreNum;

  // media card object constructor
  function MediaCard(
    title,
    authorOrRating,
    score,
    imgURL,
    genre,
    summary,
    link
  ) {
    this.title = title;
    this.authorOrRating = authorOrRating;
    this.score = score;
    this.imgURL = imgURL;
    this.genre = genre;
    this.summary = summary;
    this.link = link;
  }

  // movie genres
  var genreDictionMovies = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western",
  };

  // tv show genres
  var genreDictionTV = {
    10759: "Action & Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    10762: "Kids",
    9648: "Mystery",
    10763: "News",
    10764: "Reality",
    10765: "Sci-Fi & Fantasy",
    10766: "Soap",
    10767: "Talk",
    10768: "War & Politics",
    37: "Western",
    28: "Action",
    12: "Adventure",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
  };

  function numToGenre(str, genreDictionType) {
    var genreDictionArr = Object.entries(genreDictionType);
    console.log(genreDictionArr);

    for (var i = 0; i < genreDictionArr.length; i++) {
      if (str === genreDictionArr[i][1]) {
        genreNum = genreDictionArr[i][0];
      }
    }

    return genreNum;
  }

  // event listeners
  $(document).ready(function () {
    // event listener for hamburger drop down menu
    $(".navbar-burger").each(function () {
      $(this).on("click", function () {
        // targets data-target attribute which is equal to regular nav bar menu's ID
        var targetAttribute = $(this).attr("data-target");
        var $navbarMenuID = $("#" + targetAttribute);

        // toggles active class between regular navbar menu and hamburger menu
        $(this).toggleClass("is-active");
        $navbarMenuID.toggleClass("is-active");
      });
    });

    // event handlers for movies, books, and shows links (from navbar or home page)
    $(".nav-to-list").click(
      // function for event handler when user clicks on media genre
      function (event) {
        event.preventDefault();
        url = "browse.html";
        mediaType = $(this).attr("data-type");
        console.log(mediaType);
        sessionStorage.setItem("mediaType", mediaType);
        renderTrendBrowsePage();
        window.location.href = url;
      }
    );

    // event handler for when user changes genre on dropdown menu and clicks search button
    $("#dropdown-search-btn").on("click", function () {
      var genreSelection = $("#dropdown-form").find("#media-dropdown").val();
      $("#browse-content-container").empty();
      genreList = [];
      cardsArr = [];

      if (genreSelection === "Trending") {
        renderTrendBrowsePage();
      } else if (genreSelection === "NYT Critics Picks") {
        nytCriticsPicks();
      } else {
        listSelection = genreSelection.replace(/\s+/g, "-");
        setStorage();

        if (mediaType === "books") {
          mediaTypeEl.text("Best Selling " + genreSelection);
          changeBookCards();
        } else if (mediaType === "movies") {
          mediaTypeEl.text("Trending Movies: " + genreSelection);
          numToGenre(genreSelection, genreDictionMovies);
          changeMovieOrTVCards("movie");
        } else if (mediaType === "shows") {
          mediaTypeEl.text("Trending TV Shows: " + genreSelection);
          numToGenre(genreSelection, genreDictionTV);
          changeMovieOrTVCards("tv");
        }
      }
    });
  });

  // sets local storage
  function setStorage() {
    sessionStorage.setItem("mediaType", mediaType);
    sessionStorage.setItem("listSelection", listSelection);
    // localStorage.setItem("myList", myListArr);
  }

  // pulls from local storage
  function getStorage() {
    mediaType = sessionStorage.getItem("mediaType");
    var storageList = localStorage.getItem("listSelection");
    if (
      localStorage.getItem("myList") !== null &&
      localStorage.getItem("myList") !== undefined &&
      localStorage.getItem("myList") !== "" &&
      localStorage.getItem("myList") !== "undefined"
    ) {
      myListArr = JSON.parse(localStorage.getItem("myList"));
    } else {
      myListArr = [];
    }
    // if list selection exists
    if (storageList !== null) {
      listSelection = storageList;
    }
  }

  // function for rendering dropdown menu based on genreList
  function renderDropdown() {
    $("#media-dropdown").empty();
    $("#media-dropdown").append($("<option>").text("Trending"));

    if (mediaType === "movies") {
      $("#media-dropdown").append($("<option>").text("NYT Critics Picks"));
    }

    for (var i = 0; i < genreList.length; i++) {
      var newOption = $("<option>");
      newOption.text(genreList[i]);
      $("#media-dropdown").append(newOption);
    }
  }

  function renderMediaCards() {
    // create new card elements based on how many objects are in the cardsArray
    for (var i = 0; i < cardsArr.length; i++) {
      var addDrop;
      if (mediaType === "mylist") {
        addDrop = '<a class="btnDrop" href = "#">Remove from My List</a>';
      } else {
        addDrop = '<a class="btnSave" href = "#">Add to My List</a>';
      }
      var mediaCardEl = $(
        '<div class="column is-half"><div id="mediaCard' +
          i +
          '" class= "card media-card"><div class="card-content columns is-mobile"><div class="column"><img src="' +
          cardsArr[i].imgURL +
          '" class="media-img"></div><div class="column has-text-centered is-scrollable"><p class="title is-4 media-title">' +
          cardsArr[i].title +
          '</p><p class="media-authorOrRating subtitle">' +
          cardsArr[i].authorOrRating +
          '</p><p class="media-score">' +
          cardsArr[i].score +
          '</p><br><div><p class="media-summary has-text-left">' +
          cardsArr[i].summary +
          '</p><br><p class="media-genre">' +
          cardsArr[i].genre +
          '</p></div></div></div><div class="fixed-bottom"><footer class="card-footer"><p class="card-footer-item"><span>' +
          addDrop +
          "</span></p>" +
          cardsArr[i].link +
          "</footer></div></div></div >"
      );

      // append new card element to content container
      $("#browse-content-container").append(mediaCardEl);
    }
    //define "Add to My List" click listener
    $(".btnSave").click(function (event) {
      event.preventDefault();
      $(event.target).text("Added!");
      $(event.target).removeClass("btnSave");
      console.log("clicked");
      var cardId = "#" + $(event.target).parents()[4].id;
      var saveTitle = $(cardId).find(".title")[0].textContent;
      var saveImgUrl = $(cardId).find(".media-img")[0].src;
      var saveAuthorOrRating = $(cardId).find(".media-authorOrRating")[0]
        .textContent;
      var saveScore = $(cardId).find(".media-score")[0].textContent;
      var saveSummary = $(cardId).find(".media-summary")[0].textContent;
      var saveGenre = $(cardId).find(".media-genre")[0].textContent;
      var saveLinkHref = $(cardId).find(".media-link")[0].href;
      var saveLinkText = $(cardId).find(".media-link")[0].textContent;
      var saveLink =
        '<p class="card-footer-item"><a class="media-link" href = "' +
        saveLinkHref +
        '">' +
        saveLinkText +
        "</a></p>";

      for (i = 0; i < myListArr.length; i++) {
        if (saveTitle === myListArr[i].title) {
          return;
        }
      }

      var myCard = new MediaCard(
        saveTitle,
        saveAuthorOrRating,
        saveScore,
        saveImgUrl,
        saveGenre,
        saveSummary,
        saveLink
      );
      myListArr.push(myCard);
      console.log(myListArr);
      localStorage.setItem("myList", JSON.stringify(myListArr));
    });

    //define "Remove from My List" click listener
    $(".btnDrop").click(function (event) {
      event.preventDefault();
      var cardId = "#" + $(this).parents()[4].id;
      var dropTitle = $(cardId).find(".title")[0].textContent;
      for (i = 0; i < myListArr.length; i++) {
        if (dropTitle === myListArr[i].title) {
          myListArr.splice(i, 1);
          localStorage.setItem("myList", JSON.stringify(myListArr));
          location.reload(true);
        }
      }
    });
  }

  // renders trending browse page depending on media type variable
  function renderTrendBrowsePage() {
    // empty cards container and cardsArr
    $("#browse-content-container").empty();
    cardsArr = [];

    if (mediaType === "books") {
      listSelection = "hardcover-fiction";
      mediaTypeEl.text("Best Selling Books");

      // renders dropdown
      var nytApiKey = "GOOGHDHZGwdBBruE3XTXgj3TIcGoewXU";
      var nytBooksUrl = "https://api.nytimes.com/svc/books/v3";
      var nytBookListsUrl =
        nytBooksUrl + "/lists/names.json?api-key=" + nytApiKey;

      $.ajax({
        url: nytBookListsUrl,
        method: "GET",
      }).then(function (response) {
        console.log(response);
        for (i = 0; i < response.results.length; i++) {
          var listYear = parseInt(
            response.results[i].newest_published_date.substring(0, 4)
          );
          if (listYear >= 2019) {
            var listItem = response.results[i].list_name;
            genreList.push(listItem);
          }
        }
        $("#genreDropDown").show();
        renderDropdown();
        changeBookCards();
      });
    } else if (mediaType === "movies") {
      mediaTypeEl.text("Trending Movies");
      $("#genreDropDown").show();
      renderTrendMovieOrTV("movie", genreDictionMovies);
    } else if (mediaType === "shows") {
      mediaTypeEl.text("Trending TV Shows");
      $("#genreDropDown").show();
      renderTrendMovieOrTV("tv", genreDictionTV);
    } else if (mediaType === "mylist") {
      mediaTypeEl.text("My List");
      $("#hero-subtitle").text("A list to save you time, when you find the time.");
      cardsArr = myListArr;
      $("#genreDropDown").hide();
      renderMediaCards();
    }
  }

  var nytApiSearchKey = "GOOGHDHZGwdBBruE3XTXgj3TIcGoewXU";
  var nytApiKey = "88AMoZ75UXmU3TRfoicRwpcK1WWWBhCa";
  var nytMoviesUrl = "https://api.nytimes.com/svc/movies/v2";

  function nytCriticsPicks() {
    mediaTypeEl.text("New York Times Critics' Picks");
    var nytMovieListUrl =
      nytMoviesUrl +
      "/reviews/picks.json?api-key=88AMoZ75UXmU3TRfoicRwpcK1WWWBhCa";
    $.ajax({
      url: nytMovieListUrl,
      method: "GET",
    }).then(function (response) {
      console.log(response);
      for (i = 0; i < response.results.length; i++) {
        title = response.results[i].display_title.toUpperCase();
        authorOrRating = response.results[i].mpaa_rating;
        score = '<span id="score' + i + '"></span>';
        imgURL = response.results[i].multimedia.src;
        genre = "";
        summary = response.results[i].summary_short;
        link =
          '<p class="card-footer-item"><a class="media-link" href = "' +
          response.results[i].link.url +
          '">Read NYT Review</a></p>';
        getTmdbData(title, i);
        // create new MediaCard object with variables
        var card = new MediaCard(
          title,
          authorOrRating,
          score,
          imgURL,
          genre,
          summary,
          link
        );

        // push new MediaCards to cardsArr
        cardsArr.push(card);
      }

      renderMediaCards();
    });
  }

  function getNytData(title, id) {
    nytMovieSearchUrl =
      nytMoviesUrl +
      "/reviews/search.json?query=" +
      title +
      "&api-key=" +
      nytApiSearchKey;

    var resultsLink = "";
    var resultsText = "";
    var resultsRating = "";

    $.ajax({
      url: nytMovieSearchUrl,
      method: "GET",
    }).then(function (data) {
      if (data.results.length >= 1) {
        resultsLink = data.results[0].link.url;
        resultsText = "Read NYT Review";
        resultsRating = data.results[0].mpaa_rating;
      }
      $("#reviewLink" + id).attr("href", resultsLink);
      $("#reviewLink" + id).html(resultsText);
      $("#rating" + id).html(resultsRating);
    });
  }

  function getTmdbData(title, id) {
    var searchUrl =
      "https://api.themoviedb.org/3/search/movie?api_key=660bf8330423e5658590b1cdb677dc08&query=" +
      title.replace(/\s/g, "%20");

    resultsScore = "";

    $.ajax({
      url: searchUrl,
      method: "GET",
    }).then(function (response) {
      if (response.results.length >= 1) {
        resultsScore = response.results[0].vote_average + " / 10";
      }
      $("#score" + id).html(resultsScore);
    });
  }

  function renderTrendMovieOrTV(type, genreDictionType) {
    // render dropdown based on genres
    var genresArr = Object.values(genreDictionType);
    for (var i = 0; i < genresArr.length; i++) {
      genreList.push(genresArr[i]);
    }

    renderDropdown();

    // get trending data
    var trendURL =
      "https://api.themoviedb.org/3/trending/" +
      type +
      "/day?api_key=660bf8330423e5658590b1cdb677dc08";

    $.ajax({
      url: trendURL,
      method: "GET",
    }).then(function (response) {
      console.log(response);

      for (var i = 0; i < response.results.length; i++) {
        // convert genre id's to text
        var myGenreids = response.results[i].genre_ids;
        var anyString = "";

        for (var j = 0; j < myGenreids.length; j++) {
          anyString = anyString + ", " + genreDictionType[myGenreids[j]];
        }

        var resString = anyString.substring(2);

        // save movie data to variables
        if (mediaType === "movies") {
          title = response.results[i].title.toUpperCase();
        } else {
          title = response.results[i].original_name.toUpperCase();
        }
        imgURL =
          "https://image.tmdb.org/t/p/w300/" + response.results[i].poster_path;
        authorOrRating = '<span id="rating' + i + '"></span>';
        score = response.results[i].vote_average + " / 10";
        genre = resString;
        summary = response.results[i].overview;
        link =
          '<p class="card-footer-item"><a class="media-link" id="reviewLink' +
          i +
          '" href = "" ></a></p>';
        getNytData(title, i);

        // create new MediaCard object with variables
        var card = new MediaCard(
          title,
          authorOrRating,
          score,
          imgURL,
          genre,
          summary,
          link
        );

        // push new MediaCards to cardsArr
        cardsArr.push(card);
      }

      // render cards form cardsArr to screen
      renderMediaCards();
    });
  }

  // change book cards when genre is switched from dropdown menu
  function changeBookCards() {
    // get data from NYT api
    var nytApiKey = "GOOGHDHZGwdBBruE3XTXgj3TIcGoewXU";
    var nytBooksUrl = "https://api.nytimes.com/svc/books/v3";
    var nytBookTitlesUrl =
      nytBooksUrl + "/lists/current/" + listSelection + "?api-key=" + nytApiKey;

    $.ajax({
      url: nytBookTitlesUrl,
      method: "GET",
    }).then(function (bookResponse) {
      for (j = 0; j < bookResponse.results.books.length; j++) {
        // save data to variables
        title = bookResponse.results.books[j].title;
        authorOrRating = bookResponse.results.books[j].contributor;
        score = "";
        imgURL = bookResponse.results.books[j].book_image;
        genre = "";
        summary = bookResponse.results.books[j].description;
        link =
          '<p class="card-footer-item"><a class="media-link" href = "' +
          bookResponse.results.books[j].amazon_product_url +
          '">Purchase</a></p>';

        // create new MediaCard object with variables
        var card = new MediaCard(
          title,
          authorOrRating,
          score,
          imgURL,
          genre,
          summary,
          link
        );

        // push new MediaCard to cardsArr
        cardsArr.push(card);
      }

      // render cards from cards array to screen
      renderMediaCards();
    });
  }

  // change movie cards when genre is switched from dropdown menu
  function changeMovieOrTVCards(type) {
    console.log("changed movies or tv genre");

    var genre = genreNum;
    var genreQuery =
      "https://api.themoviedb.org/3/discover/" +
      type +
      "?api_key=660bf8330423e5658590b1cdb677dc08&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=" +
      genre;

    $.ajax({
      url: genreQuery,
      method: "GET",
    }).then(function (response) {
      console.log(response);
      for (i = 0; i < response.results.length; i++) {
        console.log(response);
        if (type === "movie") {
          title = response.results[i].title.toUpperCase();
        } else {
          title = response.results[i].name.toUpperCase();
        }
        authorOrRating = "";
        score = response.results[i].vote_average + " / 10";
        imgURL =
          "https://image.tmdb.org/t/p/w300/" + response.results[i].poster_path;
        genre = "";
        summary = response.results[i].overview;
        if (type === "movie") {
          link =
            '<p class="card-footer-item"><a class="media-link" id="reviewLink' +
            i +
            '" href = "" ></a></p>';
          getNytData(title, i);
        } else {
          link = '<a class="media-link"></a>';
        }

        // create new MediaCard object with variables
        var card = new MediaCard(
          title,
          authorOrRating,
          score,
          imgURL,
          genre,
          summary,
          link
        );

        // push new MediaCards to cardsArr
        cardsArr.push(card);
      }

      renderMediaCards();
    });
  }

  // define init function
  function init() {
    getStorage();
    renderTrendBrowsePage();
  }

  // call init
  init();
});
