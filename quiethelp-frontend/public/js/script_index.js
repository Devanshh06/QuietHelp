document.addEventListener('DOMContentLoaded', function() {
    const bars = document.querySelectorAll('.bar-fill');
    
    setTimeout(() => {
      bars.forEach(bar => {
        const percent = bar.getAttribute('data-percent');
        bar.style.width = percent + '%';
      });
    }, 100);
  });

    // Navbar toggle for mobile
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('navbar-menu-active');
    });

    // Animate bar charts on scroll
    const observerOptions = {
      threshold: 0.5,
      rootMargin: '0px'
    };

    const animateBarChart = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bars = entry.target.querySelectorAll('.bar-fill');
          bars.forEach((bar, index) => {
            setTimeout(() => {
              bar.classList.remove('animate');
            }, index * 200);
          });
          observer.unobserve(entry.target);
        }
      });
    };

    const chartObserver = new IntersectionObserver(animateBarChart, observerOptions);
    
    // Initially set bars to 0 width
    document.addEventListener('DOMContentLoaded', () => {
      const barChart = document.querySelector('.bar-chart');
      if (barChart) {
        const bars = barChart.querySelectorAll('.bar-fill');
        bars.forEach(bar => {
          const targetWidth = bar.style.width;
          bar.setAttribute('data-width', targetWidth);
          bar.style.width = '0';
          bar.classList.add('animate');
        });
        chartObserver.observe(barChart);
      }
    });

    // Incident analysis function (if needed on this page)
    async function sendIncident() {
      const userInput = document.getElementById("incidentInput").value;
      const outputDiv = document.getElementById("outputContainer");

      outputDiv.innerHTML = "";

      if (!userInput.trim()) {
        outputDiv.innerHTML = "<p style='color:#DC2626;'>Please describe the incident.</p>";
        return;
      }

      outputDiv.innerHTML = "<p>Analyzing... please wait</p>";

      try {
        const response = await fetch("https://quiethelp-backend.onrender.com/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: userInput }),
        });

        const result = await response.json();

        if (!result.success) {
          outputDiv.innerHTML =
            "<p style='color:#DC2626;'>Something went wrong.</p>";
          return;
        }

        const data = result.data;

        outputDiv.innerHTML = `
          <h3>Analysis Result</h3>
          <p><strong>Incident Type:</strong> ${data.incident_type}</p>
          <p><strong>Urgency:</strong> ${data.urgency}</p>
          <p><strong>Emotion:</strong> ${data.emotion}</p>
          <p><strong>Summary:</strong> ${data.summary}</p>
          <h4>Guidance</h4>
          <ul>
            ${data.guidance.map(g => `<li>${g}</li>`).join("")}
          </ul>
        `;
      } catch (err) {
        outputDiv.innerHTML =
          "<p style='color:#DC2626;'>Server error.</p>";
      }
    }
      // Disable right click
  document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });

  // Disable key shortcuts
  document.addEventListener("keydown", function (e) {
    if (
      e.key === "F12" ||
      (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) ||
      (e.ctrlKey && e.key === "U")
    ) {
      e.preventDefault();
    }
  });