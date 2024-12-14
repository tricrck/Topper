const apiUrl = "http://localhost:5000/api"; // Replace with your API URL if deployed

// Fetch Portfolio Items
async function fetchPortfolio() {
  const response = await fetch(`${apiUrl}/portfolio`);
  const portfolioItems = await response.json();
  const portfolioContainer = document.getElementById("portfolio-container");

  portfolioItems.forEach((item) => {
    const portfolioCard = `
      <div class="card">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <p><strong>Technologies:</strong> ${item.technologies.join(", ")}</p>
        ${item.link ? `<a href="${item.link}" target="_blank">View Project</a>` : ""}
      </div>
    `;
    portfolioContainer.innerHTML += portfolioCard;
  });
}

// Fetch Testimonials
async function fetchTestimonials() {
  const response = await fetch(`${apiUrl}/testimonials`);
  const testimonials = await response.json();
  const testimonialsContainer = document.getElementById("testimonials-container");

  testimonials.forEach((testimonial) => {
    const testimonialCard = `
      <div class="card">
        <h4>${testimonial.name}</h4>
        <p>${testimonial.testimonial}</p>
        ${testimonial.designation ? `<p><strong>${testimonial.designation}</strong></p>` : ""}
      </div>
    `;
    testimonialsContainer.innerHTML += testimonialCard;
  });
}

// Initialize Fetching Data
if (document.getElementById("portfolio-container")) {
  fetchPortfolio();
}

if (document.getElementById("testimonials-container")) {
  fetchTestimonials();
}
