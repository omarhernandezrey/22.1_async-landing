(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))i(t);new MutationObserver(t=>{for(const n of t)if(n.type==="childList")for(const g of n.addedNodes)g.tagName==="LINK"&&g.rel==="modulepreload"&&i(g)}).observe(document,{childList:!0,subtree:!0});function o(t){const n={};return t.integrity&&(n.integrity=t.integrity),t.referrerPolicy&&(n.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?n.credentials="include":t.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(t){if(t.ep)return;t.ep=!0;const n=o(t);fetch(t.href,n)}})();const I="UCTZFAzSm3V3Mt3v1Xqv9Oxg",p=document.getElementById("content"),a=document.getElementById("load-more"),L=document.getElementById("theme-toggle"),d=document.getElementById("theme-toggle-dark-icon"),m=document.getElementById("theme-toggle-light-icon"),T=document.getElementById("scroll-progress"),y=document.getElementById("back-to-top"),E=document.getElementById("mobile-theme-toggle"),u=document.getElementById("mobile-theme-text");let l="",h=!1;const B={method:"GET",headers:{"X-RapidAPI-Host":"youtube-v31.p.rapidapi.com","X-RapidAPI-Key":"c68edbdba9mshc3cb6eb8038f3b2p1f444ajsna5de19fe1256"}};function b(){document.documentElement.classList.contains("dark")?(d&&d.classList.add("hidden"),m&&m.classList.remove("hidden"),u&&(u.textContent="(Actual: Oscuro)")):(m&&m.classList.add("hidden"),d&&d.classList.remove("hidden"),u&&(u.textContent="(Actual: Claro)"))}localStorage.theme==="dark"||!("theme"in localStorage)&&window.matchMedia("(prefers-color-scheme: dark)").matches?document.documentElement.classList.add("dark"):document.documentElement.classList.remove("dark");b();L&&L.addEventListener("click",()=>{document.documentElement.classList.toggle("dark"),document.documentElement.classList.contains("dark")?localStorage.theme="dark":localStorage.theme="light",b()});E&&E.addEventListener("click",()=>{document.documentElement.classList.toggle("dark"),document.documentElement.classList.contains("dark")?localStorage.theme="dark":localStorage.theme="light",b()});window.addEventListener("scroll",()=>{const e=document.body.scrollTop||document.documentElement.scrollTop,s=document.documentElement.scrollHeight-document.documentElement.clientHeight,o=e/s*100;T.style.width=o+"%",e>300?y.classList.remove("opacity-0","translate-y-10"):y.classList.add("opacity-0","translate-y-10")});y.addEventListener("click",()=>{window.scrollTo({top:0,behavior:"smooth"})});async function x(e=""){if(h)return;h=!0,e&&(a.textContent="Cargando...",a.disabled=!0);let o=`https://youtube-v31.p.rapidapi.com/search?channelId=${I}&part=snippet%2Cid&order=date&maxResults=9`;e&&(o+=`&pageToken=${e}`);try{const i=await fetch(o,B);if(!i.ok)throw new Error(`HTTP error! status: ${i.status}`);return await i.json()}catch(i){return console.error("Error fetching data:",i),null}finally{h=!1,e&&(a.textContent="Cargando más videos",a.disabled=!1)}}function M(e){return`
    <div class="group relative block transform hover:-translate-y-1 transition-transform duration-300">
      <div class="w-full bg-gray-200 aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg dark:shadow-gray-800">
        <iframe 
          class="w-full h-full"
          src="https://www.youtube.com/embed/${e.id.videoId}" 
          title="${e.snippet.title}" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen>
        </iframe>
      </div>
      <div class="mt-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
          ${e.snippet.title}
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400 mb-3">
          ${new Date(e.snippet.publishedAt).toLocaleDateString("es-ES",{year:"numeric",month:"long",day:"numeric"})}
        </p>
        <a href="https://www.youtube.com/watch?v=${e.id.videoId}" target="_blank" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors">
          <svg class="mr-2 -ml-1 h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
          </svg>
          Ver en YouTube
        </a>
      </div>
    </div>
  `}function k(e,s=!1){const o=e.map(M).join("");s?p.insertAdjacentHTML("beforeend",o):p.innerHTML=o}function A(){p.innerHTML=`
    <div class="col-span-full text-center text-red-500 dark:text-red-400 py-8">
      <p class="text-xl font-semibold">Lo sentimos, no se pudieron cargar los videos.</p>
      <p class="mt-2">Por favor verifica tu conexión o intenta más tarde.</p>
    </div>
  `}async function S(){const e=await x();e&&e.items?(k(e.items),l=e.nextPageToken,l&&a.classList.remove("hidden")):A()}a.addEventListener("click",async()=>{if(!l)return;const e=await x(l);e&&e.items&&(k(e.items,!0),l=e.nextPageToken,l||a.classList.add("hidden"))});const C={root:null,rootMargin:"0px",threshold:.1},P=new IntersectionObserver((e,s)=>{e.forEach(o=>{o.isIntersecting&&(o.target.classList.add("animate-fade-in-up"),o.target.classList.remove("opacity-0","translate-y-4"),s.unobserve(o.target))})},C);document.querySelectorAll("section, main, .group").forEach(e=>{e.classList.add("opacity-0","translate-y-4","transition-all","duration-700"),P.observe(e)});const f=document.getElementById("mobile-menu-btn"),c=document.getElementById("mobile-menu"),r=document.getElementById("mobile-menu-overlay"),w=document.getElementById("mobile-menu-close-btn");function O(){r&&c&&(r.classList.remove("hidden"),r.offsetWidth,r.classList.remove("opacity-0"),c.classList.remove("-translate-x-full"),f.setAttribute("aria-expanded","true"))}function v(){r&&c&&(r.classList.add("opacity-0"),c.classList.add("-translate-x-full"),f.setAttribute("aria-expanded","false"),setTimeout(()=>{r.classList.add("hidden")},300))}f&&f.addEventListener("click",O);w&&w.addEventListener("click",v);r&&r.addEventListener("click",v);c&&c.querySelectorAll("a").forEach(e=>{e.addEventListener("click",v)});S();
