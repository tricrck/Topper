const apiUrl = "http://localhost:5000/api"; // Replace with your API URL if deployed

// Fetch Portfolio Items
async function fetchPortfolio() {
  const portfolioContainer = document.getElementById("portfolio-container");

  try {
    const response = await fetch(`${apiUrl}/portfolio`);
    if (!response.ok) {
      throw new Error(`Failed to fetch portfolio items: ${response.statusText}`);
    }

    const portfolioItems = await response.json();

    portfolioItems.forEach((item) => {
      const portfolioCard = `
        <div class="card">
          ${item.image ? `<img src="${item.image}" alt="${item.title}" class="card-image">` : ""}
          <h3>${item.title}</h3>
          ${item.role ? `<p><strong>Role:</strong> ${item.role}</p>` : ""}
          <p>${item.description}</p>
          <p><strong>Technologies:</strong> ${item.technologies.join(", ")}</p>
          ${item.skills ? `<p><strong>Skills:</strong> ${item.skills.join(", ")}</p>` : ""}
          ${item.link ? `<a href="${item.link}" target="_blank" class="card-link">View Project</a>` : ""}
        </div>
      `;
      portfolioContainer.innerHTML += portfolioCard;
    });
  } catch (error) {
    console.error("Error fetching portfolio items:", error);
    portfolioContainer.innerHTML = `<p class="error-message">Failed to load portfolio items. Please try again later.</p>`;
  }
}


// Fetch Testimonials
async function fetchTestimonials() {
  const response = await fetch(`${apiUrl}/testimonials`);
  const testimonials = await response.json();
  const testimonialsContainer = document.getElementById("testimonials-container");

  testimonials.forEach((testimonial) => {
    const testimonialCard = `
      <div class="testimonial-card">
        <div class="testimonial-content">
          <h4 class="testimonial-name">${testimonial.name}</h4>
          ${testimonial.designation ? `<p class="testimonial-designation"><strong>${testimonial.designation}</strong></p>` : ""}
          <p class="testimonial-text">"${testimonial.testimonial}"</p>
        </div>
        ${testimonial.link ? `<a href="${testimonial.link}" target="_blank" class="testimonial-link">Read more</a>` : ""}
      </div>
    `;
    testimonialsContainer.innerHTML += testimonialCard;
  });
}

// Fetch Blog Items
async function fetchBlogs() {
  const blogContainer = document.getElementById("blog-container");

  try {
    const response = await fetch(`${apiUrl}/blogs`);
    if (!response.ok) {
      throw new Error(`Failed to fetch blog items: ${response.statusText}`);
    }

    const blogItems = await response.json();

    blogItems.forEach((item) => {
      const blogCard = `
        <div class="blog-card">
          ${item.image ? `<img src="${item.image}" alt="${item.title}" class="blog-image">` : ""}
          <h3 class="blog-title" data-id="${item._id}">${item.title}</h3>
        </div>
      `;
      blogContainer.innerHTML += blogCard;
    });

    // Add click event listeners to blog titles
    const blogTitles = document.querySelectorAll('.blog-title');
    blogTitles.forEach((title) => {
      title.addEventListener('click', async (event) => {
        const blogId = event.target.getAttribute('data-id');
        await fetchSingleBlog(blogId);
      });
    });

  } catch (error) {
    console.error("Error fetching blog items:", error);
    blogContainer.innerHTML = `<p class="error-message">Failed to load blogs. Please try again later.</p>`;
  }
}

// Fetch Single Blog Content
async function fetchSingleBlog(id) {
  const blogContainer = document.getElementById("blog-container");

  try {
    const response = await fetch(`${apiUrl}/blogs/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch blog content: ${response.statusText}`);
    }

    const blog = await response.json();

    // Replace the blog container content with the full blog content
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
    console.error("Error fetching single blog:", error);
    blogContainer.innerHTML = `<p class="error-message">Failed to load the blog. Please try again later.</p>`;
  }
}

// Initialize Fetching Data
if (document.getElementById("portfolio-container")) {
  fetchPortfolio();
}

if (document.getElementById("testimonials-container")) {
  fetchTestimonials();
}

if (document.getElementById("blog-container")) {
  fetchBlogs();
}


