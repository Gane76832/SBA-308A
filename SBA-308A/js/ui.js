

import { createPost, updatePost, searchPosts, getPosts } from './api.js';

let allPosts = [];
let localPosts = []; 
let isEditing = false;
let currentPostId = null;

export function initializeUI(posts) {
  allPosts = posts;
  displayPosts([...localPosts, ...allPosts]);
  setupEventListeners();
}

function displayPosts(posts) {
  const postsContainer = document.getElementById('posts-container');
  postsContainer.innerHTML = '';

  if (posts.length === 0) {
    postsContainer.innerHTML = '<p>No posts found.</p>';
    return;
  }

  posts.forEach((post) => {
    const postElement = document.createElement('div');
    postElement.className = 'post';

    postElement.innerHTML = `
      <h2>${post.title}</h2>
      <p>${post.body.substring(0, 100)}...</p>
      <button data-id="${post.id}" class="view-post">View Post</button>
      <button data-id="${post.id}" class="edit-post">Edit Post</button>
    `;

    postsContainer.appendChild(postElement);
  });
}

function setupEventListeners() {
  const postsContainer = document.getElementById('posts-container');
  const postForm = document.getElementById('post-form');
  const searchInput = document.getElementById('search-input');

  
  postsContainer.addEventListener('click', handlePostButtons);

  
  postForm.addEventListener('submit', handleFormSubmit);

  
  searchInput.addEventListener('input', handleSearchInput);
}

function handlePostButtons(event) {
  const target = event.target;
  const postId = target.getAttribute('data-id');

  if (target.classList.contains('view-post')) {
    showPostDetails(postId);
  } else if (target.classList.contains('edit-post')) {
    prepareEditPost(postId);
  }
}

function showPostDetails(postId) {
  const post = findPostById(postId);
  if (post) {
    alert(`Title: ${post.title}\n\n${post.body}`);
  }
}

function prepareEditPost(postId) {
  const post = findPostById(postId);
  if (post) {
    const titleInput = document.getElementById('post-title');
    const bodyInput = document.getElementById('post-body');
    titleInput.value = post.title;
    bodyInput.value = post.body;

    const formButton = document.querySelector('#post-form button');
    formButton.textContent = 'Update Post';

    isEditing = true;
    currentPostId = postId;
  }
}

function findPostById(postId) {
  return (
    localPosts.find((p) => p.id == postId) ||
    allPosts.find((p) => p.id == postId)
  );
}

async function handleFormSubmit(event) {
  event.preventDefault();

  const titleInput = document.getElementById('post-title');
  const bodyInput = document.getElementById('post-body');
  const formButton = document.querySelector('#post-form button');

  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();

  if (!title || !body) {
    alert('Please fill in both the title and body section.');
    return;
  }

  try {
    if (isEditing && currentPostId) {
      const updatedPostData = { title, body };
      
      let post = findPostById(currentPostId);
      if (post) {
        post.title = title;
        post.body = body;
      }

      await updatePost(currentPostId, updatedPostData);

      isEditing = false;
      currentPostId = null;
      formButton.textContent = 'Create Post';
    } else {
      const newPostData = { title, body };
      const newPost = await createPost(newPostData);


      const maxId = Math.max(
        ...allPosts.map((p) => p.id),
        ...localPosts.map((p) => p.id),
        0
      );
      newPost.id = maxId + 1;

      localPosts.unshift(newPost);
    }

    
    titleInput.value = '';
    bodyInput.value = '';

    // Refresh posts display
    displayPosts([...localPosts, ...allPosts]);
  } catch (error) {
    console.error('Error submitting the form:', error);
  }
}

let searchTimeout;

function handleSearchInput(event) {
  const query = event.target.value.trim();

  // Clear any existing timeout to debounce input
  clearTimeout(searchTimeout);

  // Set a timeout to delay the API call until user stops typing to stop any errors
  searchTimeout = setTimeout(async () => {
    try {
      if (query === '') {
        // If query is empty, reset to all the posts
        const posts = await getPosts();
        allPosts = posts;
        displayPosts([...localPosts, ...allPosts]);
      } else {
        const [searchResultsFromAPI, localSearchResults] = await Promise.all([
          searchPosts(query),
          searchLocalPosts(query),
        ]);

        allPosts = searchResultsFromAPI;
        displayPosts([...localSearchResults, ...allPosts]);
      }
    } catch (error) {
      console.error('Error searching posts:', error);
    }
  }, 500);
}

function searchLocalPosts(query) {
  return new Promise((resolve) => {
    const results = localPosts.filter((post) => {
      return (
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.body.toLowerCase().includes(query.toLowerCase())
      );
    });
    resolve(results);
  });
}