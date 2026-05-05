const form = document.getElementById("searchForm");
const input = document.getElementById("searchInput");
const results = document.getElementById("results");

if (form) {
  form.addEventListener("submit", async function(e) {
    e.preventDefault();

    const query = input.value.trim();

    if (query === "") {
      results.innerHTML = "<p>Please type a book title or author.</p>";
      return;
    }

    results.innerHTML = "<p>Searching...</p>";

    try {
      const url = "https://www.googleapis.com/books/v1/volumes?q=" + encodeURIComponent(query) + "&maxResults=6";

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();

      results.innerHTML = "";

      if (!data.items || data.items.length === 0) {
        results.innerHTML = "<p>No books found.</p>";
        return;
      }

      data.items.forEach(function(book) {
        const info = book.volumeInfo;

        const title = info.title || "No title available";
        const authors = info.authors ? info.authors.join(", ") : "Unknown author";
        const image = info.imageLinks && info.imageLinks.thumbnail ? info.imageLinks.thumbnail : "";

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
          ${image ? `<img src="${image}" class="api-cover" alt="${title} cover">` : `<div class="book-cover">No Cover</div>`}
          <h3>${title}</h3>
          <p>${authors}</p>
        `;

        results.appendChild(card);
      });

    } catch (error) {
      console.log(error);
      results.innerHTML = "<p>The book search is being rate limited right now. Please wait a few minutes and try again.</p>";
    }
  });
}