const apiUrl = "https://topper.onrender.com/api"; // API Base URL

/* Helper: Create a Loader */
function createLoader() {
  const loaderContainer = document.createElement("div");
  loaderContainer.className = "loader-container";

  const loader = document.createElement("l-cardio");
  loader.setAttribute("size", "80");
  loader.setAttribute("stroke", "4");
  loader.setAttribute("speed", "2");
  loader.setAttribute("color", "black");

  loaderContainer.appendChild(loader);
  return loaderContainer;
}

/* Helper: Append HTML to Container */
function appendHTML(container, htmlString) {
  container.insertAdjacentHTML("beforeend", htmlString);
}

/* Helper: Handle Errors */
function handleError(container, message) {
  console.error(message);
  container.innerHTML = `<p class="error-message">Failed to load data. Please try again later.</p>`;
}

/* Fetch Portfolio Items */
async function fetchPortfolio() {
  const portfolioContainer = document.getElementById("portfolio-container");
  if (!portfolioContainer) return;

  portfolioContainer.innerHTML = ""; // Clear previous content
  const loader = createLoader();
  portfolioContainer.appendChild(loader);

  try {
    const response = await fetch(`${apiUrl}/portfolio`);
    if (!response.ok) throw new Error(`Error: ${response.statusText}`);

    const portfolioItems = await response.json();
    loader.remove();

    portfolioItems.forEach((item) => {
      appendHTML(
        portfolioContainer,
        `
        <div class="card">
          ${item.image ? `<img src="${item.image}" alt="${item.title}" class="card-image">` : ""}
          <h3>${item.title}</h3>
          ${item.role ? `<p><strong>Role:</strong> ${item.role}</p>` : ""}
          <p>${item.description}</p>
          <p><strong>Technologies:</strong> ${item.technologies.join(", ")}</p>
          ${item.skills ? `<p><strong>Skills:</strong> ${item.skills.join(", ")}</p>` : ""}
          ${item.link ? `<a href="${item.link}" target="_blank" class="card-link">View Project</a>` : ""}
          <button class="btn update" data-id="${item._id}">Edit</button>
          <button class="btn delete" data-id="${item._id}">Delete</button>
        </div>
        `
      );
    });

    // Add event listeners for Edit and Delete buttons
    document.querySelectorAll(".btn.update").forEach((button) => {
      button.addEventListener("click", () => editPortfolio(button.dataset.id));
    });
    document.querySelectorAll(".btn.delete").forEach((button) => {
      button.addEventListener("click", () => deletePortfolio(button.dataset.id));
    });
  } catch (error) {
    handleError(portfolioContainer, error.message);
    loader.remove();
  }
}

/* Add or Update Portfolio Item */
async function savePortfolio(event) {
  event.preventDefault();

  const form = event.target;
  const id = form.querySelector("#portfolio-id").value;
  const title = form.querySelector("#title").value;
  const role = form.querySelector("#role").value;
  const description = form.querySelector("#description").value;
  const technologies = form.querySelector("#technologies").value.split(",");
  const skills = form.querySelector("#skills").value.split(",");
  const link = form.querySelector("#link").value;
  const image = form.querySelector("#image").value;

  const payload = { title, role, description, technologies, skills, link, image };
  const method = id ? "PUT" : "POST";
  const url = id ? `${apiUrl}/portfolio/${id}` : `${apiUrl}/portfolio`;

  try {
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    form.reset();
    fetchPortfolio(); // Refresh portfolio list
  } catch (error) {
    console.error("Failed to save portfolio item:", error.message);
  }
}

/* Edit Portfolio Item */
async function editPortfolio(id) {
  try {
    const response = await fetch(`${apiUrl}/portfolio/${id}`);
    const item = await response.json();

    const form = document.getElementById("portfolio-form");
    form.querySelector("#portfolio-id").value = item._id;
    form.querySelector("#title").value = item.title;
    form.querySelector("#role").value = item.role;
    form.querySelector("#description").value = item.description;
    form.querySelector("#technologies").value = item.technologies.join(",");
    form.querySelector("#skills").value = item.skills.join(",");
    form.querySelector("#link").value = item.link;
    form.querySelector("#image").value = item.image;
  } catch (error) {
    console.error("Failed to fetch portfolio item:", error.message);
  }
}

/* Delete Portfolio Item */
async function deletePortfolio(id) {
  if (!confirm("Are you sure you want to delete this item?")) return;

  try {
    await fetch(`${apiUrl}/portfolio/${id}`, { method: "DELETE" });
    fetchPortfolio(); // Refresh portfolio list
  } catch (error) {
    console.error("Failed to delete portfolio item:", error.message);
  }
}

/* Search Portfolio Items */
async function searchPortfolio() {
  const query = document.getElementById("search-query").value;

  try {
    const response = await fetch(`${apiUrl}/portfolio/search/${query}`);
    const results = await response.json();

    const portfolioContainer = document.getElementById("portfolio-container");
    portfolioContainer.innerHTML = ""; // Clear previous content

    results.forEach((item) => {
      appendHTML(
        portfolioContainer,
        `
        <div class="card">
          <h3>${item.title}</h3>
          <p><strong>Technologies:</strong> ${item.technologies.join(", ")}</p>
        </div>
        `
      );
    });
  } catch (error) {
    console.error("Failed to search portfolio items:", error.message);
  }
}

/* Initialize Event Listeners */
document.addEventListener("DOMContentLoaded", () => {
  fetchPortfolio();

  const form = document.getElementById("portfolio-form");
  if (form) form.addEventListener("submit", savePortfolio);

  const searchButton = document.getElementById("search-btn");
  if (searchButton) searchButton.addEventListener("click", searchPortfolio);
});
