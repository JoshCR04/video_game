function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    const content = document.querySelector('.content');
    const footer = document.querySelector('.footer');


    navLinks.classList.toggle('active');


    if (navLinks.classList.contains('active')) {
        content.classList.add('hidden');
        footer.classList.add('hidden');
    } else {
        content.classList.remove('hidden');
        footer.classList.remove('hidden');
    }
}
