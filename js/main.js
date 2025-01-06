
import { getPosts } from './api.js';
import { initializeUI } from './ui.js';

async function initApp() {
  try {
    const posts = await getPosts();
    initializeUI(posts);
  } catch (error) {
    console.error('Error initializing app:', error);
  }
}

document.addEventListener('DOMContentLoaded', initApp);
