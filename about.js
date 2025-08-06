document.addEventListener("DOMContentLoaded", function () {
  // --- PEMILIHAN ELEMEN DOM ---
  const iconTerminal = document.getElementById("icon-terminal");
  const iconInfo = document.getElementById("icon-info");
  const infoView = document.querySelector(".info-view");
  const terminalView = document.querySelector(".terminal-view");
  const snippetInput = document.getElementById("snippet-input");
  const snippetAuthorInput = document.getElementById("snippet-author");
  const submitSnippetBtn = document.getElementById("submit-snippet-btn");
  const snippetShowcaseContainer = document.getElementById("snippet-container");
  const sidebarLinks = document.querySelectorAll(".sidebar-list [data-key]");
  const tabsContainer = document.querySelector(".info-view .window-tabs");
  const contentContainer = document.querySelector(".info-view .window-content");
  let openTabs = {};

  const contentData = {
    bio: `<pre><code>/**
 * Biography
 * * Saya adalah seorang front-end developer dengan
 * * antusiasme tinggi terhadap UI/UX yang interaktif.
 * * Selama 5 tahun terakhir, saya fokus pada...
 */</code></pre>`,
    interests: `<pre><code>/**
 * Interests
 * * Di luar coding, saya suka bermain catur,
 * * fotografi, dan menjelajahi kedai kopi baru
 * * untuk mencari inspirasi.
 */</code></pre>`,
    education: `<pre><code>/**
 * Education Path
 * * Saya percaya pada pembelajaran berkelanjutan.
 * * Berikut adalah riwayat pendidikan formal saya.
 */</code></pre>`,
    "high-school": `<pre><code>/**
 * SMA Negeri 1 Contoh (2015-2018)
 * * Jurusan Ilmu Pengetahuan Alam
 * * Aktif di klub robotika dan olimpiade komputer.
 */</code></pre>`,
    university: `<pre><code>/**
 * Universitas Gadjah Mada (2018-2022)
 * * Sarjana Ilmu Komputer, lulus dengan predikat cumlaude.
 * * Proyek akhir saya berfokus pada implementasi
 * * WebGL untuk visualisasi data interaktif.
 */</code></pre>`,
  };

  function setContentVisible(visible) {
    const contentAreaParent = contentContainer.parentElement;
    if (contentAreaParent) {
      contentAreaParent.style.visibility = visible ? "visible" : "hidden";
      if (!visible) tabsContainer.innerHTML = "";
    }
  }

  function createTab(key, label) {
    const tabElement = document.createElement("div");
    tabElement.className = "tab";
    tabElement.dataset.key = key;
    const sidebarItem = document.querySelector(
      `.sidebar-list [data-key="${key}"]`
    );
    const iconSpan = sidebarItem ? sidebarItem.querySelector("span") : null;
    const iconHTML = iconSpan ? iconSpan.outerHTML : "";
    tabElement.innerHTML = `${iconHTML} ${label} <span class="close-icon">x</span>`;
    tabsContainer.appendChild(tabElement);
    openTabs[key] = tabElement;
    tabElement.querySelector(".close-icon").addEventListener("click", (e) => {
      e.stopPropagation();
      closeTab(key);
    });
    tabElement.addEventListener("click", () => setActiveTab(key));
  }

  function closeTab(key) {
    const tabElement = openTabs[key];
    if (!tabElement) return;
    const wasActive = tabElement.classList.contains("active");
    tabElement.remove();
    delete openTabs[key];
    const remainingKeys = Object.keys(openTabs);
    if (remainingKeys.length === 0) {
      setContentVisible(false);
      syncSidebarActiveState(null);
    } else if (wasActive) {
      setActiveTab(remainingKeys[remainingKeys.length - 1]);
    }
  }

  function setActiveTab(key) {
    if (!key || !openTabs[key]) return;
    setContentVisible(true);
    Object.values(openTabs).forEach((tab) => tab.classList.remove("active"));
    openTabs[key].classList.add("active");
    contentContainer.innerHTML =
      contentData[key] || `<pre><code>// Konten belum ada.</code></pre>`;
    syncSidebarActiveState(key);
  }

  function syncSidebarActiveState(activeKey) {
    sidebarLinks.forEach((link) => {
      const liParent = link.closest("li");
      if (link.dataset.key === activeKey) {
        liParent.classList.add("active");
      } else {
        liParent.classList.remove("active");
      }
    });
  }

  iconTerminal.addEventListener("click", () => {
    infoView.style.display = "none";
    terminalView.style.display = "flex";
    iconTerminal.classList.add("active");
    iconInfo.classList.remove("active");
  });

  iconInfo.addEventListener("click", () => {
    terminalView.style.display = "none";
    infoView.style.display = "flex";
    iconInfo.classList.add("active");
    iconTerminal.classList.remove("active");
  });

   submitSnippetBtn.addEventListener('click', async () => {
        const authorName = snippetAuthorInput.value || 'guest';
        const authorEmail = snippetEmailInput.value;
        const userCode = snippetInput.value;
        errorMessage.textContent = '';

        if (userCode.trim() === '' || authorEmail.trim() === '' || !authorEmail.includes('@')) {
            errorMessage.textContent = 'Error: Please fill all fields correctly.';
            return;
        }

        try {
            esprima.parseScript(userCode); // Validasi sintaks
        } catch (e) {
            errorMessage.textContent = `Syntax Error: ${e.description}`;
            return;
        }

        try {
            const response = await fetch('/api/submit-snippet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: authorEmail, author: authorName, code: userCode }),
            });

            if (!response.ok) throw new Error('Failed to submit snippet to server');
            
            // Jika berhasil, baru bersihkan input dan kembali
            snippetInput.value = '';
            snippetAuthorInput.value = '';
            snippetEmailInput.value = '';
            iconInfo.click();

            iconInfo.click();
            loadSnippets();
            
        } catch (error) {
            errorMessage.textContent = error.message;
        }
    });

  snippetShowcaseContainer.addEventListener("click", function (e) {
    if (
      e.target.classList.contains("star-btn") ||
      e.target.parentElement.classList.contains("star-btn")
    ) {
      const starCountElement = e.target
        .closest(".star-btn")
        .querySelector(".star-count");
      let currentStars = parseInt(starCountElement.textContent);
      starCountElement.textContent = currentStars + 1;
    }
  });

  sidebarLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const key = link.dataset.key;
      const label = key.replace("-", " ");
      if (!openTabs[key]) {
        createTab(key, label);
      }
      setActiveTab(key);
    });
  });

  function initializePage() {
    tabsContainer.innerHTML = '';
    createTab('bio', 'bio');
    setActiveTab('bio');
    loadSnippets(); // PANGGIL FUNGSI DI SINI
}

  initializePage();
});

async function loadSnippets() {
    try {
        const response = await fetch('/api/get-snippets');
        if (!response.ok) throw new Error('Failed to load snippets');

        const snippets = await response.json();
        
        // Kosongkan kontainer sebelum menampilkan yang baru
        snippetShowcaseContainer.innerHTML = '';

        // Urutkan snippet dari yang terbaru
        snippets.sort((a, b) => b.createdAt - a.createdAt); // Asumsi kita akan menambahkan timestamp

        // Loop melalui setiap snippet dan buat kartu HTML-nya
        snippets.forEach(snippet => {
            const newSnippetCard = document.createElement('div');
            newSnippetCard.className = 'snippet-card';
            newSnippetCard.innerHTML = `
                <div class="card-header">
                    <div class="author"><span>@${snippet.author}</span></div>
                    <div class="card-meta">
                        <span class="star-btn">&#x272A; <span class="star-count">${snippet.stars || 0}</span> stars</span>
                    </div>
                </div>
                <div class="card-code">
                    <pre><code>${snippet.code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>
                </div>
            `;
            snippetShowcaseContainer.appendChild(newSnippetCard);
        });

    } catch (error) {
        console.error(error);
        // Anda bisa menampilkan pesan error di UI jika perlu
    }
}