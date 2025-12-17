const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const htmlElement = document.documentElement;

if (localStorage.getItem('lite-client-ui-theme') === 'dark' || 
    (!('lite-client-ui-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    htmlElement.classList.add('dark');
    themeIcon.textContent = '☀️';
} else {
    htmlElement.classList.remove('dark');
    themeIcon.textContent = '🌙';
}

themeToggleBtn.addEventListener('click', () => {
    if (htmlElement.classList.contains('dark')) {
        htmlElement.classList.remove('dark');
        localStorage.setItem('lite-client-ui-theme', 'light');
        themeIcon.textContent = '🌙';
    } else {
        htmlElement.classList.add('dark');
        localStorage.setItem('lite-client-ui-theme', 'dark');
        themeIcon.textContent = '☀️';
    }
});