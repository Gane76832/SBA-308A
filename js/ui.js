

import { createPost, updatePost } from './api.js';

let allPosts = [];
let isEditing = false;
let currentPostId = null;

export function initializeUI(posts) {
  allPosts = posts;
  displayPosts(allPosts);
  setupEventListeners();
}

function displayPosts(posts) {
  const postsContainer = document.getElementById('posts-container');
  postsContainer.innerHTML = '';

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

  // The event listener for post buttons
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
  const post = allPosts.find((p) => p.id == postId);
  if (post) {
    alert(`Title: ${post.title}\n\n${post.body}`);
  }
}

function prepareEditPost(postId) {
  const post = allPosts.find((p) => p.id == postId);
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
      
      const updatedPost = { ...updatedPostData, id: Number(currentPostId) };

      
      const index = allPosts.findIndex((p) => p.id == currentPostId);
      if (index !== -1) {
        allPosts[index] = updatedPost;
      }

      await updatePost(currentPostId, updatedPostData); 

      isEditing = false;
      currentPostId = null;
      formButton.textContent = 'Create Post';
    } else {
      const newPostData = { title, body };
      const newPost = await createPost(newPostData);

      // Assign a unique ID since the JSONPlaceholder returns id 101 for new posts
      newPost.id = allPosts.length ? Math.max(...allPosts.map((p) => p.id)) + 1 : 1;

      allPosts.unshift(newPost);
    }

    
    titleInput.value = '';
    bodyInput.value = '';

    // Refresh posts display
    displayPosts(allPosts);
  } catch (error) {
    console.error('Error submitting the form:', error);
  }
}

function handleSearchInput(event) {
  const query = event.target.value.toLowerCase();

  const filteredPosts = allPosts.filter((post) => {
    return (
      post.title.toLowerCase().includes(query) ||
      post.body.toLowerCase().includes(query)
    );
  });

  displayPosts(filteredPosts);
}
