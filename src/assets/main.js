const channelId = 'UCTZFAzSm3V3Mt3v1Xqv9Oxg';
const content = document.getElementById('content');
const loadMoreBtn = document.getElementById('load-more');
const themeToggleBtn = document.getElementById('theme-toggle');
const darkIcon = document.getElementById('theme-toggle-dark-icon');
const lightIcon = document.getElementById('theme-toggle-light-icon');
const scrollProgress = document.getElementById('scroll-progress');
const backToTopBtn = document.getElementById('back-to-top');
const mobileThemeToggleBtn = document.getElementById('mobile-theme-toggle');
const mobileThemeText = document.getElementById('mobile-theme-text');

let nextPageToken = '';
let isLoading = false;

const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com',
    'X-RapidAPI-Key': 'c68edbdba9mshc3cb6eb8038f3b2p1f444ajsna5de19fe1256'
  }
};

// --- Dark Mode Logic ---
function updateThemeIcons() {
  const isDark = document.documentElement.classList.contains('dark');
  if (isDark) {
    // If dark mode is active, show the SUN icon (to switch to light)
    if (darkIcon) darkIcon.classList.add('hidden');
    if (lightIcon) lightIcon.classList.remove('hidden');
    if (mobileThemeText) mobileThemeText.textContent = '(Actual: Oscuro)';
  } else {
    // If light mode is active, show the MOON icon (to switch to dark)
    if (lightIcon) lightIcon.classList.add('hidden');
    if (darkIcon) darkIcon.classList.remove('hidden');
    if (mobileThemeText) mobileThemeText.textContent = '(Actual: Claro)';
  }
}

// Initialize icons based on current theme
// Check local storage or system preference
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}
updateThemeIcons();

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    // Toggle the class on the html element
    document.documentElement.classList.toggle('dark');
    
    // Update local storage based on the NEW state
    if (document.documentElement.classList.contains('dark')) {
      localStorage.theme = 'dark';
    } else {
      localStorage.theme = 'light';
    }
    
    updateThemeIcons();
  });
}

if (mobileThemeToggleBtn) {
  mobileThemeToggleBtn.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    if (document.documentElement.classList.contains('dark')) {
      localStorage.theme = 'dark';
    } else {
      localStorage.theme = 'light';
    }
    updateThemeIcons();
  });
}

// --- Scroll Progress & Back to Top ---
window.addEventListener('scroll', () => {
  // Progress Bar
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  scrollProgress.style.width = scrolled + "%";

  // Back to Top Button
  if (winScroll > 300) {
    backToTopBtn.classList.remove('opacity-0', 'translate-y-10');
  } else {
    backToTopBtn.classList.add('opacity-0', 'translate-y-10');
  }
});

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// --- Video Fetching Logic ---

async function fetchVideos(pageToken = '') {
  if (isLoading) return;
  isLoading = true;
  
  // Show loading state on button if it's a "load more" action
  if (pageToken) {
    loadMoreBtn.textContent = 'Cargando...';
    loadMoreBtn.disabled = true;
  }

  const maxResults = 9; // Fetch 9 videos at a time
  let url = `https://youtube-v31.p.rapidapi.com/search?channelId=${channelId}&part=snippet%2Cid&order=date&maxResults=${maxResults}`;
  
  if (pageToken) {
    url += `&pageToken=${pageToken}`;
  }

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  } finally {
    isLoading = false;
    if (pageToken) {
      loadMoreBtn.textContent = 'Cargando más videos';
      loadMoreBtn.disabled = false;
    }
  }
}

function createVideoCard(video) {
  return `
    <div class="group relative block transform hover:-translate-y-1 transition-transform duration-300">
      <div class="w-full bg-gray-200 aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg dark:shadow-gray-800">
        <iframe 
          class="w-full h-full"
          src="https://www.youtube.com/embed/${video.id.videoId}" 
          title="${video.snippet.title}" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen>
        </iframe>
      </div>
      <div class="mt-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
          ${video.snippet.title}
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400 mb-3">
          ${new Date(video.snippet.publishedAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <a href="https://www.youtube.com/watch?v=${video.id.videoId}" target="_blank" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors">
          <svg class="mr-2 -ml-1 h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
          </svg>
          Ver en YouTube
        </a>
      </div>
    </div>
  `;
}

function renderVideos(videos, append = false) {
  const videoHTML = videos.map(createVideoCard).join('');
  
  if (append) {
    content.insertAdjacentHTML('beforeend', videoHTML);
  } else {
    content.innerHTML = videoHTML;
  }
}

function showError() {
  content.innerHTML = `
    <div class="col-span-full text-center text-red-500 dark:text-red-400 py-8">
      <p class="text-xl font-semibold">Lo sentimos, no se pudieron cargar los videos.</p>
      <p class="mt-2">Por favor verifica tu conexión o intenta más tarde.</p>
    </div>
  `;
}

async function init() {
  const data = await fetchVideos();

  if (data && data.items) {
    renderVideos(data.items);
    nextPageToken = data.nextPageToken;
    
    if (nextPageToken) {
      loadMoreBtn.classList.remove('hidden');
    }
  } else {
    showError();
  }
}

loadMoreBtn.addEventListener('click', async () => {
  if (!nextPageToken) return;
  
  const data = await fetchVideos(nextPageToken);
  
  if (data && data.items) {
    renderVideos(data.items, true);
    nextPageToken = data.nextPageToken;
    
    if (!nextPageToken) {
      loadMoreBtn.classList.add('hidden');
    }
  }
});

// --- Scroll Animations ---
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-fade-in-up');
      entry.target.classList.remove('opacity-0', 'translate-y-4'); // Remove initial hidden state
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Apply animation classes to elements
document.querySelectorAll('section, main, .group').forEach(el => {
  el.classList.add('opacity-0', 'translate-y-4', 'transition-all', 'duration-700'); // Initial state
  observer.observe(el);
});

// --- Mobile Menu Logic ---
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
const mobileMenuCloseBtn = document.getElementById('mobile-menu-close-btn');

function openMobileMenu() {
  if (mobileMenuOverlay && mobileMenu) {
    mobileMenuOverlay.classList.remove('hidden');
    // Force reflow
    void mobileMenuOverlay.offsetWidth;
    mobileMenuOverlay.classList.remove('opacity-0');
    mobileMenu.classList.remove('-translate-x-full');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
  }
}

function closeMobileMenu() {
  if (mobileMenuOverlay && mobileMenu) {
    mobileMenuOverlay.classList.add('opacity-0');
    mobileMenu.classList.add('-translate-x-full');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    
    // Wait for transition to finish before hiding overlay
    setTimeout(() => {
      mobileMenuOverlay.classList.add('hidden');
    }, 300);
  }
}

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', openMobileMenu);
}

if (mobileMenuCloseBtn) {
  mobileMenuCloseBtn.addEventListener('click', closeMobileMenu);
}

if (mobileMenuOverlay) {
  mobileMenuOverlay.addEventListener('click', closeMobileMenu);
}

// Close menu when clicking a link
if (mobileMenu) {
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
}

// Start the app
init();

