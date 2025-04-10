// Function to update page title
export const updateTitle = (pageTitle) => {
  const baseTitle = 'Events & Vibes';
  document.title = pageTitle ? `${pageTitle} | ${baseTitle}` : baseTitle;
}; 