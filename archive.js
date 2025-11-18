console.log("Archive Loaded");

document.addEventListener("DOMContentLoaded", () => {
  const passwordGate = document.getElementById("passwordGate");
  const archiveContent = document.getElementById("archiveContent");
  const unlockBtn = document.getElementById("unlockArchive");
  const passwordInput = document.getElementById("archivePassword");
  const passwordError = document.getElementById("passwordError");
  const storyList = document.getElementById("storyList");
  const storyInput = document.getElementById("storyInput");
  const submitStory = document.getElementById("submitStory");
  const toggleLangBtn = document.getElementById("toggleLang");

  const ARCHIVE_PASSWORD = "Sudan2025";  // ← your password

  /* ----- LANGUAGE TOGGLE ----- */

  if (toggleLangBtn) {
    toggleLangBtn.addEventListener("click", () => {
      const body = document.body;
      const isEnglish = body.classList.contains("lang-en");

      if (isEnglish) {
        // Switch to Arabic
        body.classList.remove("lang-en");
        body.classList.add("lang-ar");
        body.setAttribute("dir", "rtl");
        toggleLangBtn.textContent = "English";

        if (passwordInput) {
          passwordInput.placeholder = "أدخل كلمة المرور...";
        }
        if (storyInput) {
          storyInput.placeholder = "اكتب قصتك...";
        }

      } else {
        // Switch back to English
        body.classList.remove("lang-ar");
        body.classList.add("lang-en");
        body.setAttribute("dir", "ltr");
        toggleLangBtn.textContent = "عربي";

        if (passwordInput) {
          passwordInput.placeholder = "Enter password...";
        }
        if (storyInput) {
          storyInput.placeholder = "Write your story...";
        }
      }
    });
  }

  /* ----- UNLOCK ARCHIVE ----- */

  unlockBtn.addEventListener("click", () => {
    if (passwordInput.value === ARCHIVE_PASSWORD) {
      passwordGate.classList.add("hidden");
      archiveContent.classList.remove("hidden");


      document.body.classList.add("archive-unlocked");
    } else {
      passwordError.textContent = "Incorrect password.";
      passwordError.style.color = "red";
    }
  });


function loadStories() {
  const stored = JSON.parse(localStorage.getItem("sudanStories")) || [];
  storyList.innerHTML = "";

  stored.forEach((story, index) => {
    const card = document.createElement("div");
    card.className = "story-card";

    card.innerHTML = `
      <p>${story.text}</p>
      <span class="story-date">${story.date}</span>
      <button class="deleteStory">Delete</button>
    `;

    card.querySelector(".deleteStory").addEventListener("click", () => {
      const updated = stored.filter((_, i) => i !== index);
      localStorage.setItem("sudanStories", JSON.stringify(updated));
      loadStories(); // refresh list
    });

    storyList.appendChild(card);
  });
}

submitStory.addEventListener("click", () => {
  const text = storyInput.value.trim();
  if (!text) return;

  const newStory = {
    text,
    date: new Date().toLocaleString()
  };

  const existing = JSON.parse(localStorage.getItem("sudanStories")) || [];
  existing.unshift(newStory);

  localStorage.setItem("sudanStories", JSON.stringify(existing));
  storyInput.value = "";
  loadStories();
});


  // initial load
  loadStories();
});
