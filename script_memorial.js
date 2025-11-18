console.log("Memorial JS Loaded");

let audioStarted = false;

document.addEventListener("click", () => {
  const audio = document.getElementById("backgroundSound");
  console.log("User clicked, trying to play audio...", audio);

  if (!audio || audioStarted) return;

  audio.play()
    .then(() => {
      audioStarted = true;
      console.log("Background audio is now playing");
    })
    .catch(err => {
      console.log("Audio play failed:", err);
    });
});

window.addEventListener("load", () => {
    setTimeout(() => {
      document.body.classList.add("loaded");
    }, 3200);
  });


// Allow autoplay after FIRST user click
// document.addEventListener("click", () => {
//   const audio = document.getElementById("backgroundSound");
//   if (audio && audio.paused) {
//     audio.play().catch(err => console.log("Autoplay blocked:", err));
//   }
// }, { once: true });


document.addEventListener("DOMContentLoaded", () => {
  const backgroundSound = document.getElementById("backgroundSound");
  const shadowContainer = document.getElementById("shadowContainer");

  const form = document.getElementById("offeringForm");
  const messageInput = document.getElementById("message");
  const status = document.getElementById("status");

  const offeringBox = document.getElementById("offering");
  const toggleBtn = document.getElementById("toggleOffering");
  const tooltip = document.getElementById("tooltip");

  const FORMSPREE_URL = "https://formspree.io/f/xnnlbgke";

  // Minimize / maximize offering box
  if (toggleBtn && offeringBox) {
    toggleBtn.addEventListener("click", () => {
      offeringBox.classList.toggle("minimized");

      if (offeringBox.classList.contains("minimized")) {
        toggleBtn.textContent = "Message";
      } else {
        toggleBtn.textContent = "Close";
      }
    });
  }

  const shadows = [
    "assets/shadow1.png",
    "assets/shadow2.png",
  ];

  let victims = [];

  // Load victims from JSON, then generate shadows
  fetch("victims.json")
    .then(res => res.json())
    .then(data => {
      victims = data;
      generateShadows(25); 
    })
    .catch(err => {
      console.error("Error loading victims.json", err);
      generateShadows(25);
    });

  // --- Shadows with tooltip ---
  function generateShadows(count) {
    console.log("✨ generating shadows:", count);
    for (let i = 0; i < count; i++) {
      const img = document.createElement("img");
      img.src = shadows[Math.floor(Math.random() * shadows.length)];
      img.classList.add("shadow");
      img.style.top = Math.random() * (window.innerHeight - 100) + "px";
      img.style.left = Math.random() * (window.innerWidth - 100) + "px";

      // Attach a victim if we have any
      if (victims.length > 0) {
        const person = victims[i % victims.length];
        img.dataset.name = person.name;
        img.dataset.age = person.age;
      }

      // Tooltip events
      img.addEventListener("mouseenter", () => {
        if (!img.dataset.name) return;

        let text = img.dataset.name;
        if (img.dataset.age && img.dataset.age !== "null") {
          text += `, ${img.dataset.age}`;
        }

        tooltip.textContent = text;
        tooltip.classList.remove("hidden");

        const rect = img.getBoundingClientRect();
        tooltip.style.left = rect.left + window.scrollX + rect.width / 2 + "px";
        tooltip.style.top = rect.top + window.scrollY - 10 + "px";
      });

      img.addEventListener("mousemove", (e) => {
        if (tooltip.classList.contains("hidden")) return;
        tooltip.style.left = e.pageX + 12 + "px";
        tooltip.style.top = e.pageY + 12 + "px";
      });

      img.addEventListener("mouseleave", () => {
        tooltip.classList.add("hidden");
      });

      // Fade animation
      setInterval(() => {
        img.classList.toggle("visible");
      }, 2000 + Math.random() * 3000);

      shadowContainer.appendChild(img);
    }
  }

  // --- Offerings: show on screen + send to your email via Formspree ---
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // don't leave the page

    const message = messageInput.value.trim();
    if (!message) return;

    // 1) VISUAL OFFERING on the memorial
    const offer = document.createElement("p");
    offer.textContent = message;
    offer.className = "offering-message";
    offer.style.top = Math.random() * (window.innerHeight - 80) + "px";
    offer.style.left = Math.random() * (window.innerWidth - 200) + "px";

    shadowContainer.appendChild(offer);
    messageInput.value = "";

    setTimeout(() => {
      offer.style.opacity = 0;
      setTimeout(() => offer.remove(), 5000);
    }, 3000);

    status.textContent = "Sending your offering...";
    status.style.color = "white";

    const formData = new FormData();
    formData.append("message", message);

    fetch(FORMSPREE_URL, {
      method: "POST",
      headers: { "Accept": "application/json" },
      body: formData
    })
      .then((response) => {
        if (response.ok) {
          status.textContent = "Thank you. Your offering has been sent.";
          status.style.color = "lightgreen";
        } else {
          status.textContent = "Something went wrong sending your offering.";
          status.style.color = "orange";
        }
      })
      .catch((err) => {
        console.error("Error sending message", err);
        status.textContent = "Could not send your offering. Please try again.";
        status.style.color = "red";
      });
  });
});
