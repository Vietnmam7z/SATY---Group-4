let currentPage = 0;
const pages = document.querySelectorAll(".page");
const numPages = pages.length;
let isScrolling = false;
let currentRGB = [0, 45, 130];
let currentValues = {};
let currentTemp = 0;
let currentVoltage = 0;

const decimalMap = {
  temperature: 3,
  voltage: 3,
  operating_time: 0,
  level: 3,
  liquid_level: 3,
  mounting_height: 3,
};

function scrollToPage(id) {
  const page = document.getElementById(id);
  if (page) {
    page.scrollIntoView({
      behavior: "smooth"
    });
  }
  updateActiveDot(id);
}

function updateActiveDot(id) {
  document.querySelectorAll(".nav-row button").forEach((btn) => btn.classList.remove("active"));

  const targetDot = document.querySelector(`.nav-row button[onclick="scrollToPage('${id}')"]`);
  if (targetDot) {
    targetDot.classList.add("active");
  }

  const navContainer = document.querySelector(".nav-buttons");
  if (navContainer) {
    if (id === "page2") {
      navContainer.classList.add("green-theme");
    } else {
      navContainer.classList.remove("green-theme");
    }
  }
}

function triggerPageAnimations(id) {
  const smartfarm = document.getElementById("smartfarm");
  const welcome = document.getElementById("welcome");
  const heading = document.getElementById("device-heading");
  const device_info = document.getElementById("device-info");
  const panelIds = ["panel1", "panel2", "panel3", "panel4"];
  const circleImg = document.querySelector(".circle-img");
  const panels = document.querySelectorAll(".circle-grid .your-panel-class");

  if (id === "page1") {
    smartfarm?.classList.add("show");
    welcome?.classList.add("show");
    heading?.classList.remove("intro-text");
    device_info?.classList.remove("show");
    panelIds.forEach((id) => {
      const panel = document.getElementById(id);
      panel?.classList.remove("intro-text");
    });
    circleImg.classList.remove("show");
  } else if (id === "page2") {
    smartfarm?.classList.remove("show");
    welcome?.classList.remove("show");
    heading?.classList.add("intro-text");
    device_info?.classList.add("show");
    panelIds.forEach((id, i) => {
      const panel = document.getElementById(id);
      if (panel) {
        void panel.offsetWidth;
        panel.style.animationDelay = `${i * 0.1}s`;
        panel.classList.add("intro-text");
      }
    });
    if (circleImg) {
      void circleImg.offsetWidth;
      circleImg.classList.add("show");
    }
  } else {
    heading?.classList.remove("intro-text");
    device_info?.classList.remove("show");
    panelIds.forEach((id) => {
      const panel = document.getElementById(id);
      panel?.classList.remove("intro-text");
    });
    circleImg.classList.remove("show");
    panels.forEach((panel) => {
      panel.classList.remove("bounce-in");
      void panel.offsetWidth;
      panel.classList.add("bounce-in");
    });
  }
}

window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section.page");
  let currentId = null;

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const top = rect.top;
    const height = rect.height;

    if (top <= window.innerHeight / 2 && top + height > window.innerHeight / 2) {
      currentId = section.id;
    }
  });

  if (currentId) {
    updateActiveDot(currentId);
    triggerPageAnimations(currentId);
  }
});

function interpolateColor(value, min, max, colorStart, colorEnd) {
  const ratio = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const r = Math.round(colorStart[0] + ratio * (colorEnd[0] - colorStart[0]));
  const g = Math.round(colorStart[1] + ratio * (colorEnd[1] - colorStart[1]));
  const b = Math.round(colorStart[2] + ratio * (colorEnd[2] - colorStart[2]));
  return [r, g, b];
}

function animateRGBTransition(startRGB, targetRGB, onUpdate, onFinish, duration = 1000, easing = (t) => t * (2 - t)) {
  const startTime = performance.now();

  function animate(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easing(progress);

    const nextRGB = startRGB.map((startVal, i) =>
      Math.round(startVal + (targetRGB[i] - startVal) * easedProgress)
    );

    onUpdate(nextRGB);

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else if (onFinish) {
      onFinish();
    }
  }
  requestAnimationFrame((time) => animate(time));
}

function animateNumberTransition(startValue, endValue, onUpdate, onFinish, duration = 1000, easing = (t) => t * (2 - t), decimalPlaces = 1) {
  const startTime = performance.now();

  function animate(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easing(progress);
    const currentValue = startValue + (endValue - startValue) * easedProgress;

    onUpdate(currentValue.toFixed(decimalPlaces));

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else if (onFinish) {
      onFinish();
    }
  }

  requestAnimationFrame((time) => animate(time));
}

function updateTemperatureColor(tempValue) {
  const temperatureEl = document.getElementById("temperature");
  const indicator = temperatureEl?.closest(".circle-indicator");
  const bgLayer = indicator?.querySelector(".background");

  if (!indicator || !bgLayer || isNaN(tempValue)) return;

  let targetRGB = [0, 45, 130];
  if (tempValue <= 25) {
    targetRGB = interpolateColor(tempValue, 0, 25, [0, 45, 130], [80, 180, 80]);
  } else if (tempValue <= 40) {
    targetRGB = interpolateColor(tempValue, 25, 40, [80, 180, 80], [235, 180, 45]);
  } else {
    targetRGB = interpolateColor(tempValue, 40, 50, [235, 180, 45], [200, 35, 35]);
  }

  animateRGBTransition(
    currentRGB,
    targetRGB,
    (rgb) => {
      const [r, g, b] = rgb;
      const base = `rgb(${r}, ${g}, ${b})`;
      const darker = `rgb(${Math.floor(r * 0.8)}, ${Math.floor(g * 0.65)}, ${Math.floor(b * 0.65)})`;
      const lighter = `rgb(${Math.min(255, r + 40)}, ${Math.min(255, g + 40)}, ${Math.min(255, b + 40)})`;

      bgLayer.style.background = `linear-gradient(135deg, ${darker} 0%, ${base} 50%, ${lighter} 100%)`;
      bgLayer.style.boxShadow = `0 0 10px ${base}`;
    },
    () => {
      currentRGB = [...targetRGB];
    },
    2000
  );
}

function updateVoltageGlow(voltageValue) {
  const el = document.getElementById("voltage");
  if (!el || isNaN(voltageValue)) return;

  const min = 18,
    max = 28;
  const v = Math.min(max, Math.max(min, voltageValue));
  const t = Math.pow((v - min) / (max - min), 1.8);
  const glowSize = Math.floor(6 + t * 60);
  const yellowOpacity = (0.35 + t * 0.5).toFixed(2);
  const yellowGlow = `0 0 ${glowSize}px rgba(255, 215, 0, ${yellowOpacity})`;
  const outerGlow = [
    `0 0 ${glowSize + 25}px rgba(255, 200, 0, ${yellowOpacity})`,
    `0 0 ${glowSize + 40}px rgba(255, 255, 224, ${yellowOpacity})`,
  ];

  el.style.textShadow = [yellowGlow, ...outerGlow].join(", ");
  el.style.opacity = 1;
  el.style.webkitTextStroke = "0px transparent";
}

function animateVoltageGlow(targetVoltage) {
  const el = document.getElementById("voltage");
  if (!el || isNaN(targetVoltage)) return;

  const min = 18,
    max = 28;
  targetVoltage = Math.min(max, Math.max(min, targetVoltage));

  const duration = 1200;
  const start = performance.now();
  const initialVoltage = currentVoltage;

  function animate(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = Math.pow(progress, 1.6);
    const voltageNow = initialVoltage + (targetVoltage - initialVoltage) * easedProgress;

    updateVoltageGlow(voltageNow);

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      currentVoltage = targetVoltage;
      el.textContent = `${targetVoltage.toFixed(decimalMap.voltage)} V`;
    }
  }
  requestAnimationFrame(animate);
}

function formatValue(key, val) {
  const dec = decimalMap[key] || 1;
  const value = parseFloat(val).toFixed(dec);
  switch (key) {
    case "temperature":
      return `${value} °C`;
    case "voltage":
      return `${value} V`;
    case "operating_time":
      return `${value} giây`;
    default:
      return value;
  }
}

function updateTimeDisplay(operatingTime) {
  const day = Math.floor(operatingTime / (60 * 60 * 24));
  const hour = Math.floor((operatingTime % (60 * 60 * 24)) / (60 * 60));
  const minute = Math.floor((operatingTime % (60 * 60)) / 60);
  const second = operatingTime % 60;

  document.querySelector(".day").textContent = `${day} d`;
  document.querySelector(".hour").textContent = `${hour} h`;
  document.querySelector(".minute").textContent = `${minute} m`;
  document.querySelector(".second").textContent = `${second} s`;
}

function formatOperatingTime(value) {
  const str = value.toString().padStart(7, "0");
  return `
    <span class="line1">${str.slice(0, 2)}</span><br>
    <span class="line2">${str.slice(2, 4)}</span><br>
    <span class="line3">${str.slice(4)} s</span>
  `;
}

function updateFormattedOperatingTime(value) {
  const el = document.getElementById("operating_time");
  if (el) {
    el.innerHTML = formatOperatingTime(value);
  } else {
    console.warn("Không tìm thấy phần tử #operating_time");
  }
}

function updateLiquidLevel(newValue) {
  const wave = document.querySelector(".Wave");
  if (!wave) return;

  const computed = window.getComputedStyle(wave);
  const currentHeightPx = parseFloat(computed.getPropertyValue("height"));
  const containerHeight = wave.parentElement.clientHeight;
  const currentPercent = (currentHeightPx / containerHeight) * 100;
  const targetPercent = Math.min((newValue / 8) * 100, 100);

  if (targetPercent < currentPercent) {
    wave.classList.add("lowering");
  } else {
    wave.classList.remove("lowering");
  }
  wave.style.height = `${targetPercent}%`;
}

async function updateStatus() {
  try {
    const res = await fetch("/status");
    const data = await res.json();
    const keys = Object.keys(decimalMap);

    keys.forEach((key) => {
      const el = document.getElementById(key);
      const newValue = parseFloat(data[key]);
      const decimals = decimalMap[key];

      if (el && !isNaN(newValue)) {
        const currentValue = parseFloat(el.textContent) || 0;

        animateNumberTransition(
          currentValue,
          newValue,
          (val) => {
            const formatted = formatValue(key, val);
            el.textContent = formatted;
            if (key === "operating_time") {
              updateTimeDisplay(parseInt(val));
              updateFormattedOperatingTime(parseInt(val));
            }
            if (key === "temperature") updateTemperatureColor(parseFloat(val));
            if (key === "voltage") animateVoltageGlow(parseFloat(val));
            if (key === "liquid_level") {
              updateLiquidLevel(parseFloat(val));
              document.getElementById("liquid_level").textContent = val !== null ? val + " m" : "-- m";
            }
            if (key === "mounting_height") document.getElementById("mounting_height").textContent = val !== null ? val + " m" : "-- m";
            if (key === "level") document.getElementById("level").textContent = val !== null ? val + " m" : "-- m";
          },
          () => {
            if (key === "temperature") currentTemp = newValue;
            if (key === "voltage") currentVoltage = newValue;
          },
          1000,
          undefined,
          decimals
        );
      }
    });
  } catch (err) {
    console.error("Lỗi khi tải dữ liệu:", err);
  }
}

window.addEventListener("load", () => {
  window.scrollTo(0, 0);
  document.getElementById("smartfarm")?.classList.add("show");
  document.getElementById("welcome")?.classList.add("show");
  document.getElementById("top-right-note").onclick = togglePanel;
  updateStatus();
});

window.addEventListener("wheel", (e) => {
  if (isScrolling) return;

  const direction = e.deltaY > 0 ? 1 : -1;
  const nextPage = currentPage + direction;

  if (nextPage < 0 || nextPage >= numPages) return;

  currentPage = nextPage;
  isScrolling = true;

  pages[currentPage].scrollIntoView({
    behavior: "smooth"
  });

  setTimeout(() => {
    isScrolling = false;
  }, 1000);
});

function togglePanel() {
  const panel = document.getElementById("credentials-panel");
  panel.style.display = panel.style.display === "none" ? "block" : "none";
}

function updateApi() {
  console.log("🚀 Gửi request update-api...");
  const token = document.getElementById("jwt").value.trim();
  const deviceId = document.getElementById("device_id").value.trim();

  fetch("/update-api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token,
        device_id: deviceId
      }),
    })
    .then((res) => res.text())
    .then((msg) => {
      console.log("✅ Phản hồi từ server:", msg);
      alert(msg);
      const panel = document.getElementById("credentials-panel");
      if (panel) panel.style.display = "none";
    })
    .catch((err) => console.error("❌ Lỗi khi gửi:", err));
}
function checkOrientation() {
  const isPortrait = window.innerHeight > window.innerWidth;
  const notice = document.getElementById('rotate-notice');
  if (isPortrait) {
    notice.style.display = 'flex';
  } else {
    notice.style.display = 'none';
  }
}

window.addEventListener('resize', checkOrientation);
window.addEventListener('load', checkOrientation);



setInterval(updateStatus, 5000);
window.onload = updateStatus;