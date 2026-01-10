async function initAnalysis() {
      const res = await fetch("https://quiethelp-backend.onrender.com/stats");
      const stats = await res.json();

      document.getElementById("totalReports").innerText = stats.total;

      const types = Object.keys(stats.typeCount);
      document.getElementById("topIncident").innerText =
        types.sort((a, b) => stats.typeCount[b] - stats.typeCount[a])[0] || "—";

      new Chart(document.getElementById("typeChart"), {
        type: "pie",
        data: {
          labels: Object.keys(stats.typeCount),
          datasets: [{
            data: Object.values(stats.typeCount),
            backgroundColor: [
              "#2f6f6a",
              "#e67e22",
              "#c0392b",
              "#8e44ad",
              "#3498db"
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });

      new Chart(document.getElementById("timeChart"), {
        type: "bar",
        data: {
          labels: stats.hourCount.map((_, i) => `${i}:00`),
          datasets: [{
            label: "Reports",
            data: stats.hourCount,
            backgroundColor: "#2f6f6a"
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });

      loadMap();
    }

    function loadMap() {
      const map = L.map("map").setView([19.9975, 73.7898], 12);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors"
      }).addTo(map);

      const demoZones = [
        { lat: 20.005, lng: 73.78, text: "Higher evening reports", color: "#c0392b", radius: 1200 },
        { lat: 19.99, lng: 73.80, text: "Late night activity zone", color: "#e67e22", radius: 1000 },
        { lat: 20.01, lng: 73.77, text: "Repeated complaints area", color: "#c0392b", radius: 1100 }
      ];

      demoZones.forEach(z => {
        L.circle([z.lat, z.lng], {
          radius: z.radius,
          color: z.color,
          fillColor: z.color,
          fillOpacity: 0.4,
          weight: 2
        })
        .addTo(map)
        .bindPopup(`<strong>${z.text}</strong><br><small>Aggregated data zone</small>`);
      });
    }

    initAnalysis();
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