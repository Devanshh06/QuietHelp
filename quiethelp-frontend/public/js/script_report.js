const SUPABASE_URL = "https://yhajpttqiuygvofycsek.supabase.co";
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloYWpwdHRxaXV5Z3ZvZnljc2VrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4ODMxMTUsImV4cCI6MjA4MzQ1OTExNX0.MY3MwiEGy_GmPZIW3xxtR64tkNAuPHAvcAwg-cN3miM";

    const supabaseClient = supabase.createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY
    );

    function generateAnonymousId() {
      return "anon_" + crypto.randomUUID();
    }

    function closeSuccessPopup() {
      const popup = document.getElementById("successPopup");
      popup.classList.remove("active");
    }

    function showSuccessPopup() {
      const popup = document.getElementById("successPopup");
      popup.classList.add("active");
      
      // Create confetti effect
      createConfetti();
    }

    function createConfetti() {
      const popup = document.querySelector(".success-popup");
      const colors = ["#EC4899", "#8B5CF6", "#10B981", "#F59E0B"];
      
      for (let i = 0; i < 30; i++) {
        setTimeout(() => {
          const confetti = document.createElement("div");
          confetti.className = "confetti";
          confetti.style.left = Math.random() * 100 + "%";
          confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
          confetti.style.animationDelay = Math.random() * 0.5 + "s";
          confetti.style.animationDuration = Math.random() * 2 + 2 + "s";
          popup.appendChild(confetti);
          
          setTimeout(() => confetti.remove(), 3000);
        }, i * 50);
      }
    }

    function showAIGuidance(ai) {
      const div = document.getElementById("ai-guidance");

      const urgencyClass =
        ai.urgency === "High" ? "high" :
        ai.urgency === "Medium" ? "medium" :
        "low";

      const urgencyListClass =
        ai.urgency === "High" ? "urgency-high" :
        ai.urgency === "Medium" ? "urgency-medium" :
        "urgency-low";

      div.innerHTML = `
        <!-- Header Section -->
        <div class="ai-guidance-header">
          <div class="ai-icon-wrapper">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.86-.92-6.54-4.65-6.54-8.5V8.83l6.54-3.27 6.54 3.27v2.67c0 3.85-2.68 7.58-6.54 8.5z"/>
              <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
            </svg>
          </div>
          <h3>Your Safety Action Plan</h3>
          <p class="ai-guidance-subtitle">AI-powered personalized guidance based on your situation</p>
        </div>

        <!-- Meta Information Grid -->
        <div class="ai-meta-grid">
          <div class="ai-meta-card">
            <div class="ai-meta-label">Incident Type</div>
            <div class="ai-meta-value">${ai.incident_type}</div>
          </div>
          <div class="ai-meta-card">
            <div class="ai-meta-label">Urgency Level</div>
            <div class="ai-meta-value">
              <span class="urgency-badge ${urgencyClass}">
                <span class="urgency-dot"></span>
                ${ai.urgency}
              </span>
            </div>
          </div>
          <div class="ai-meta-card">
            <div class="ai-meta-label">Emotional Tone</div>
            <div class="ai-meta-value">${ai.emotion}</div>
          </div>
        </div>

        <!-- Summary Section -->
        <div class="ai-summary">
          <p>${ai.summary}</p>
        </div>

        <!-- Guidance List -->
        <div class="guidance-section-header">
          <h4>Recommended Actions</h4>
          <span class="guidance-count">${ai.guidance.length}</span>
        </div>
        <ul class="guidance-list">
          ${ai.guidance.map(g =>
            `<li class="${urgencyListClass}">${g}</li>`
          ).join("")}
        </ul>

        <!-- Support Resources Section -->
        <div class="support-resources">
          <div class="support-content">
            <div class="support-header">
              <div class="support-icon">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                  <path d="M7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/>
                </svg>
              </div>
              <h4>Need More Support?</h4>
            </div>
            <p class="support-description">
              Access comprehensive resources about women's safety, emergency helplines, and support services available in your area. We're here to help you every step of the way.
            </p>
            <a href="support.html" class="support-button">
              <span>View Support Resources</span>
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
              </svg>
            </a>
          </div>
        </div>
      `;

      div.classList.remove("hidden");
      
      // Smooth scroll to the guidance section
      setTimeout(() => {
        div.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 300);
    }

    const form = document.getElementById("complaintForm");
    const statusDiv = document.getElementById("status");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      statusDiv.innerText = "Analyzing and submitting…";
      statusDiv.className = "loading";

      const complaint = {
        anonymous_user_id: generateAnonymousId(),
        description: description.value,
        type: type.value,
        location: location.value || null,
        incident_time: time.value || null,
        visibility: document.querySelector(
          'input[name="visibility"]:checked'
        ).value
      };

      try {
        const aiRes = await fetch(
          "https://quiethelp-backend.onrender.com/analyze",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: complaint.description })
          }
        );

        const aiResult = await aiRes.json();

        if (aiResult.success) {
          complaint.ai_analysis = aiResult.data;
          showAIGuidance(aiResult.data);
        }

        await supabaseClient.from("complaints").insert([complaint]);

        statusDiv.innerText = "✓ Submitted anonymously. Your report has been received.";
        statusDiv.className = "success";
        form.reset();
        
        // Show success popup
        showSuccessPopup();
      } catch (error) {
        statusDiv.innerText = "⚠ An error occurred. Please try again.";
        statusDiv.className = "error";
        console.error("Error:", error);
      }
    });
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