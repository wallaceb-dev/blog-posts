let posts = [];
let filteredPosts = [];
const POST_TO_SHOW = 6;
let maxDisplayLimit = POST_TO_SHOW;
const postContainer = document.querySelector('.post-container');
const search = document.querySelector('[type="search"]');

function generatePost(post) {
  const article = document.createElement('article');
  article.classList.add('post');
  article.innerHTML = `
    <div class="post__meta">
      <div class="post__tag--container">
      ${post.meta.tags
        .map((tag) => `<span class="post__tag">${tag}</span>`)
        .join('')}
      </div>
      <p class="post__date">${new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'medium',
      }).format(new Date(post.meta.date))}</p>
    </div>
    <h3 class="post__header">
      <a href="${post.meta.url}">${post.title}</a>
    </h3>
    <div class="post__author">
      <img src="${post.meta.author.avatar}" alt="${
    post.user.name[0].firstName
  } ${
    post.user.name[1].lastName
  }" class="post__author--avatar" width="55"></img>
      <div>
        <p class="post__author--name">${post.user.name[0].firstName} ${
    post.user.name[1].lastName
  }</p>
        <p class="post__author--role">
          <small>${post.meta.author.jobTitle}</small>
        </p>
      </div>
    </div>
    <div class="post__body">
      ${post.summary}
    </div>
    <a href="${post.meta.url}" class=" btn">Read Post</a>
    `;

  return article;
}

function loadPosts() {
  const frag = document.createDocumentFragment();

  filteredPosts
    .slice(0, maxDisplayLimit)
    .map((post) => frag.appendChild(generatePost(post)));
  postContainer.innerHTML = '';
  postContainer.appendChild(frag);
}

function filterPosts() {
  maxDisplayLimit = POST_TO_SHOW;
  const searchFilter = (post) =>
    [
      post.meta.tags.map((t) => t).join(''),
      new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'long',
      }).format(new Date(post.meta.date)),
      post.title,
      post.user.name[0].firstName,
      post.user.name[1].lastName,
      post.meta.author.jobTitle,
      post.summary,
    ]
      .join('')
      .toLowerCase()
      .indexOf(search.value.toLowerCase()) !== -1;

  filteredPosts = posts.filter(searchFilter);
  loadPosts();
}

async function fetchPosts() {
  await fetch('./posts.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return response.json();
    })
    .then((data) => {
      posts = data.sort(
        (a, b) => new Date(b.meta.date) - new Date(a.meta.date)
      );
      filterPosts();
    })
    .catch((error) => {
      console.log('There has been a problem with your fetch operation:', error);
    });
}
fetchPosts();

function viewMorePosts() {
  maxDisplayLimit += POST_TO_SHOW;
  loadPosts();
}

document.querySelector('.btn--view').addEventListener('click', viewMorePosts);

search.addEventListener('keyup', filterPosts);
