

import { getPosts } from './api.js';
import { initializeUI } from './ui.js';

async function main() {
  try {
    const posts = await getPosts();
    initializeUI(posts);
  } catch (error) {
    console.error('Error initializing the application:', error);
  }
}

main();