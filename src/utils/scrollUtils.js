/**
 * Scroll to a specific section on the page
 * @param {Event} e - Click event
 * @param {string} sectionId - ID of the section to scroll to
 */
export const scrollToSection = (e, sectionId) => {
  e.preventDefault();
  
  const section = document.getElementById(sectionId);
  
  if (section) {
    // Get the header height
    const header = document.querySelector('header');
    const headerHeight = header ? header.offsetHeight : 0;
    
    // Calculate the top position of the section
    const sectionTop = section.getBoundingClientRect().top + window.pageYOffset;
    
    // Scroll to the section with offset for the header
    window.scrollTo({
      top: sectionTop - headerHeight - 20, // Adding 20px padding
      behavior: 'smooth',
    });
  }
};

/**
 * Scroll to the top of the page
 * @param {boolean} smooth - Whether to use smooth scrolling
 */
export const scrollToTop = (smooth = true) => {
  window.scrollTo({
    top: 0,
    behavior: smooth ? 'smooth' : 'auto',
  });
};