const token = localStorage.getItem("authority_token");

    if (!token) {
      window.location.href = "authority-login.html";
    }

    // Initialize Map
    let map;
    function initMap() {
      // Nashik coordinates
      const nashikCenter = [19.9975, 73.7898];
      
      map = L.map('map').setView(nashikCenter, 12);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      // Demo complaint zones (simulated data)
      const complaintZones = [
        { lat: 20.0100, lng: 73.7800, intensity: 'high', count: 12 },
        { lat: 19.9850, lng: 73.7950, intensity: 'medium', count: 7 },
        { lat: 20.0050, lng: 73.8100, intensity: 'low', count: 3 },
        { lat: 19.9900, lng: 73.7700, intensity: 'medium', count: 8 },
        { lat: 20.0200, lng: 73.7950, intensity: 'high', count: 15 },
        { lat: 19.9750, lng: 73.8000, intensity: 'low', count: 4 }
      ];

      // Add circles for each zone
      complaintZones.forEach(zone => {
        let color, radius;
        if (zone.intensity === 'high') {
          color = 'rgba(192, 57, 43, 0.6)';
          radius = 800;
        } else if (zone.intensity === 'medium') {
          color = 'rgba(230, 126, 34, 0.6)';
          radius = 600;
        } else {
          color = 'rgba(241, 196, 15, 0.6)';
          radius = 400;
        }

        L.circle([zone.lat, zone.lng], {
          color: color,
          fillColor: color,
          fillOpacity: 0.5,
          radius: radius
        }).addTo(map).bindPopup(`
          <strong>${zone.intensity.toUpperCase()} Activity Zone</strong><br>
          Approx. ${zone.count} complaints<br>
          <small style="color: #999;">Demo data</small>
        `);
      });

      // Update zone count
      document.getElementById('zoneCount').innerText = complaintZones.length;
    }

    async function fetchStats() {
      try {
        const res = await fetch(
          "https://quiethelp-backend.onrender.com/authority/stats",
          {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }
        );

        if (res.status === 401 || res.status === 403) {
          logout();
          return;
        }

        const data = await res.json();
        renderDashboard(data);

      } catch (err) {
        console.error("Failed to load authority data:", err);
        // Still initialize map with demo data
        initMap();
      }
    }

    function renderDashboard(data) {
      // Safety check
      if (!data || !data.authority || !data.awareness) {
        console.error("Invalid authority stats response:", data);
        alert("No authority data available yet");
        initMap();
        return;
      }

      // Default fallbacks
      const authority = {
        count: data.authority.count || 0,
        complaints: data.authority.complaints || [],
        typeCount: data.authority.typeCount || {}
      };

      const awareness = {
        count: data.awareness.count || 0,
        complaints: data.awareness.complaints || [],
        typeCount: data.awareness.typeCount || {}
      };

      // Update counts
      document.getElementById("authorityCount").innerText = authority.count;
      document.getElementById("authorityCountText").innerText = authority.count;
      document.getElementById("awarenessCount").innerText = awareness.count;
      document.getElementById("awarenessCountText").innerText = awareness.count;
      document.getElementById("totalCount").innerText = authority.count + awareness.count;

      // Authority list
      const authList = document.getElementById("authorityList");
      authList.innerHTML = "";

      if (authority.complaints.length === 0) {
        authList.innerHTML = "<li>No authority-visible complaints yet.</li>";
      } else {
        authority.complaints.forEach(c => {
          const li = document.createElement("li");
          li.innerHTML = `
            <b>${c.type}</b>
            <small>${c.summary}</small>
            ${c.location ? `<small>📍 ${c.location}</small>` : ""}
          `;
          authList.appendChild(li);
        });
      }

      // Awareness list
      const awareList = document.getElementById("awarenessList");
      awareList.innerHTML = "";

      if (awareness.complaints.length === 0) {
        awareList.innerHTML = "<li>No awareness-only complaints yet.</li>";
      } else {
        awareness.complaints.forEach(c => {
          const li = document.createElement("li");
          li.innerHTML = `
            <b>${c.type}</b>
            <small>${c.summary}</small>
            ${c.location ? `<small>📍 ${c.location}</small>` : ""}
          `;
          awareList.appendChild(li);
        });
      }

      // Authority Pie
      const authLabels = Object.keys(authority.typeCount);
      const authData = Object.values(authority.typeCount);
      
      if (authLabels.length > 0) {
        new Chart(document.getElementById("authorityPie"), {
          type: "pie",
          data: {
            labels: authLabels,
            datasets: [{
              data: authData,
              backgroundColor: [
                'rgba(192, 57, 43, 0.7)',
                'rgba(230, 126, 34, 0.7)',
                'rgba(241, 196, 15, 0.7)',
                'rgba(52, 152, 219, 0.7)',
                'rgba(142, 68, 173, 0.7)',
                'rgba(47, 111, 106, 0.7)'
              ],
              borderWidth: 2,
              borderColor: '#fff'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  padding: 15,
                  font: {
                    size: 12
                  }
                }
              }
            }
          }
        });
      }

      // Awareness Pie
      const awareLabels = Object.keys(awareness.typeCount);
      const awareData = Object.values(awareness.typeCount);
      
      if (awareLabels.length > 0) {
        new Chart(document.getElementById("awarenessPie"), {
          type: "pie",
          data: {
            labels: awareLabels,
            datasets: [{
              data: awareData,
              backgroundColor: [
                'rgba(46, 204, 113, 0.7)',
                'rgba(52, 152, 219, 0.7)',
                'rgba(155, 89, 182, 0.7)',
                'rgba(52, 73, 94, 0.7)',
                'rgba(241, 196, 15, 0.7)',
                'rgba(230, 126, 34, 0.7)'
              ],
              borderWidth: 2,
              borderColor: '#fff'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  padding: 15,
                  font: {
                    size: 12
                  }
                }
              }
            }
          }
        });
      }

      // Initialize map
      initMap();
    }

    function logout() {
      localStorage.removeItem("authority_token");
      window.location.href = "authority-login.html";
    }

    // Load stats on page load
    fetchStats();
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