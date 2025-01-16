const apiUrl = "https://topper.onrender.com/api"; // Replace with http://localhost:5000/api or https://topper.onrender.com/api

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
          </div>
        `
      );
    });
  } catch (error) {
    handleError(portfolioContainer, error.message);
    loader.remove();
  }
}

/* Fetch Testimonials */
async function fetchTestimonials() {
  const testimonialsContainer = document.getElementById("testimonials-container");
  if (!testimonialsContainer) return;

  try {
    const response = await fetch(`${apiUrl}/testimonials`);
    if (!response.ok) throw new Error(`Error: ${response.statusText}`);

    const testimonials = await response.json();
    testimonials.forEach((testimonial) => {
      appendHTML(
        testimonialsContainer,
        `
          <div class="testimonial-card">
            <div class="testimonial-content">
              <h4 class="testimonial-name">${testimonial.name}</h4>
              ${testimonial.designation ? `<p class="testimonial-designation"><strong>${testimonial.designation}</strong></p>` : ""}
              <p class="testimonial-text">"${testimonial.testimonial}"</p>
            </div>
            ${testimonial.link ? `<a href="${testimonial.link}" target="_blank" class="testimonial-link">Read more</a>` : ""}
          </div>
        `
      );
    });
  } catch (error) {
    handleError(testimonialsContainer, error.message);
  }
}

/* Fetch Blog Items */
async function fetchBlogs() {
  const blogContainer = document.getElementById("blog-container");
  if (!blogContainer) return;

  const loader = createLoader();
  blogContainer.appendChild(loader);

  try {
    const response = await fetch(`${apiUrl}/blogs`);
    if (!response.ok) throw new Error(`Error: ${response.statusText}`);

    const blogItems = await response.json();
    loader.remove();

    blogItems.forEach((item) => {
      appendHTML(
        blogContainer,
        `
          <div class="blog-card">
            ${item.image ? `<img src="${item.image}" alt="${item.title}" class="blog-image">` : ""}
            <h3 class="blog-title" data-id="${item._id}">${item.title}</h3>
          </div>
        `
      );
    });

    // Add click event listeners for detailed blog view
    document.querySelectorAll(".blog-title").forEach((title) =>
      title.addEventListener("click", async (event) => {
        await fetchSingleBlog(event.target.getAttribute("data-id"));
      })
    );
  } catch (error) {
    handleError(blogContainer, error.message);
    loader.remove();
  }
}

/* Fetch Single Blog Content */
async function fetchSingleBlog(id) {
  const blogContainer = document.getElementById("blog-container");
  if (!blogContainer) return;

  const loader = createLoader();
  blogContainer.appendChild(loader);

  try {
    const response = await fetch(`${apiUrl}/blogs/${id}`);
    if (!response.ok) throw new Error(`Error: ${response.statusText}`);

    const blog = await response.json();
    loader.remove();

    blogContainer.innerHTML = `
      <div class="full-blog">
        <h2>${blog.title}</h2>
        ${blog.image ? `<img src="${blog.image}" alt="${blog.title}" class="full-blog-image">` : ""}
        <p><strong>By:</strong> ${blog.author}</p>
        <p><strong>Published on:</strong> ${new Date(blog.createdAt).toLocaleDateString()}</p>
        <div class="blog-content">
          <p>${blog.content}</p>
        </div>
      </div>
    `;
  } catch (error) {
    handleError(blogContainer, error.message);
    loader.remove();
  }
}

/* Initialize Data Fetching */
document.addEventListener("DOMContentLoaded", () => {
  fetchPortfolio();
  fetchTestimonials();
  fetchBlogs();
});
