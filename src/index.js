let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyForm = document.querySelector(".add-toy-form");
  const toyCollection = document.getElementById("toy-collection");
  const TOYS_URL = "http://localhost:3000/toys";

  // Toggle form display
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    toyFormContainer.style.display =
addToy ? "block" : "none";
  });

  // Fetch and render toys
  fetch(TOYS_URL)
    .then(res => res.json())
    .then(toys => {
      toys.forEach(renderToyCard);
    });

  // Handle form submission (POST)
  toyForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const image = e.target.image.value;
fetch(TOYS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name,
        image,
        likes: 0,
      }),
    })
      .then(res => res.json())
      .then(newToy => {
        renderToyCard(newToy);
        toyForm.reset();
        toyFormContainer.style.display = "none";
        addToy = false;
      });
  });
// Render one toy card
  function renderToyCard(toy) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;
    
// Like button event
    const likeBtn = card.querySelector(".like-btn");
    likeBtn.addEventListener("click", () => {
      const likesP = card.querySelector("p");
      const newLikes = toy.likes + 1;

      fetch(`${TOYS_URL}/${toy.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
body: JSON.stringify({ likes: newLikes }),
      })
        .then(res => res.json())
        .then(updatedToy => {
          toy.likes = updatedToy.likes; // update local count
          likesP.textContent = `${updatedToy.likes} Likes`;
        });
    });

    toyCollection.appendChild(card);
  }
});