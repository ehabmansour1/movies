let typeSelect = document.querySelector(".category-select");
let container = document.querySelector(".boxes");
var loader = document.querySelector(".loader");
let results = [];
function fetchData(type) {
  loader.style.display = "flex";
  let xhr = new XMLHttpRequest();
  let url = `https://api.themoviedb.org/3/trending/${type}/day?language=en-US`;
  xhr.open("GET", url);
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader(
    "Authorization",
    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjM2IyNzIwYTg2NDFkYjI0MjlhY2M3MDM3NDAwYjVlMSIsIm5iZiI6MTczNDY3MzA4OC40MjUsInN1YiI6IjY3NjUwMmMwYjY3ZTQ1NDcyNTVkZThkNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.P8DRWcm4TUCu61w1tJYUiNm5wADg7qulMAgkyq6Hc04"
  );
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      let response = JSON.parse(xhr.responseText);
      results = response.results;
      console.log(results);
      container.innerHTML = "";
      for (result of results) {
        container.innerHTML += `
      <div class="movie-card" style="animation-delay: 0ms" id="${
        result.id
      }" onclick='getDetails(${result.id},"${result.media_type}")'>
        <div class="media-type">${result.media_type.toUpperCase()}</div>
        <div class="movie-bg">
          <img src="https://image.tmdb.org/t/p/w300_and_h450_bestv2${
            result.profile_path || result.poster_path
          }" alt="">
        </div>
        <div class="movie-info">
          <h3 class="movie-title">${result.title || result.name}</h3>
          <p class="movie-year">${
            type != "person"
              ? (result.release_date || result.first_air_date).substring(0, 4)
              : result.known_for_department
          }</p>
        </div>
      </div>
      `;
      }
    }
    loader.style.display = "none";
  };
  xhr.send();
}
fetchData("all");
typeSelect.addEventListener("change", () => {
  fetchData(typeSelect.value);
});

let searchInput = document.querySelector(".search-bar");
searchInput.addEventListener("input", search);
function search() {
  let cards = document.querySelectorAll(".movie-card");
  if (searchInput.value !== "") {
    for (card of cards) {
      card.classList.add("hide");
      if (
        card
          .querySelector(".movie-title")
          .innerHTML.toLowerCase()
          .includes(searchInput.value.toLowerCase())
      ) {
        card.classList.remove("hide");
      }
    }
  } else {
    for (card of cards) {
      card.classList.remove("hide");
    }
  }
}

function getDetails(id, type) {
  loader.style.display = "flex";
  var xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    `https://api.themoviedb.org/3/${type}/${id}?language=en-US`,
    true
  );
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader(
    "Authorization",
    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjM2IyNzIwYTg2NDFkYjI0MjlhY2M3MDM3NDAwYjVlMSIsIm5iZiI6MTczNDY3MzA4OC40MjUsInN1YiI6IjY3NjUwMmMwYjY3ZTQ1NDcyNTVkZThkNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.P8DRWcm4TUCu61w1tJYUiNm5wADg7qulMAgkyq6Hc04"
  );
  xhr.onload = function () {
    if (xhr.status === 200) {
      let result = JSON.parse(xhr.responseText);
      console.log(result);

      document.querySelector(
        ".modal-overlay"
      ).innerHTML = ` <div class="modal ${type}" w-tid="23" >
        <button class="modal-close" onclick="closeModal()" w-tid="24">✕</button>
        <h2 class="modal-title" w-tid="25">${result.title || result.name}</h2>
        <p class="modal-year" w-tid="26">${
          type != "person"
            ? (result.release_date || result.first_air_date).substring(0, 4)
            : result.known_for_department
        }</p>
                  <img src="https://image.tmdb.org/t/p/w780/${
                    result.profile_path || result.backdrop_path
                  }" alt="">
        <p class="modal-description" w-tid="27">
        ${
          type != "person"
            ? result.overview
            : result.biography.split(" ").splice(0, 50).join(" ")
        }
        </p>
        <div class="modal-meta" w-tid="28">
          <div class="meta-item" w-tid="29">
            <span class="meta-label" w-tid="30">Rating</span>
            <span class="meta-value" w-tid="31">${result.vote_average}</span>
          </div>
          <div class="meta-item" w-tid="35">
            <span class="meta-label" w-tid="36">Genre</span>
            <span class="meta-value" w-tid="37">${
              type != "person"
                ? result.genres.map((genre) => genre.name).join(", ")
                : null
            }</span>
          </div>
        </div>
      </div>`;
      document.querySelector(".modal-overlay").style.display = "grid";
    } else {
      console.error("Error: " + xhr.status);
    }
    loader.style.display = "none";
  };
  xhr.send();
}
function closeModal() {
  document.querySelector(".modal-overlay").style.display = "none";
}
