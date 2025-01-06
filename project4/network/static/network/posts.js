document.addEventListener('DOMContentLoaded', () => {
    const posts = document.querySelectorAll('.post');
    let likeCountElement = document.querySelector('.like-count');
    
    posts.forEach(post => {
      const likeOverlay = post.querySelector('.like-overlay');
      const likeButton = post.querySelector('.like-button');
      const commentButton = post.querySelector('.bi-chat');
      let likeCountElement = post.querySelector('.like-count');
      
      commentButton.addEventListener('click', () => {
        const container = document.createElement('div');
        container.classList.add('comment-box');
        container.innerHTML = `
        <input type="text" class="comment-input" placeholder="Add a comment...">
        <button class="comment-button">Post</button>
        `;
        post.append(container);
      });


      
       // Convert string to number
      likeButton.addEventListener('click', () => {
        if (likeButton.classList.contains('liked')) {
          likeButton.classList.remove('liked');
          currentCount = parseInt(likeCountElement.innerHTML, 10)
          likeCountElement.innerHTML = currentCount - 1;
          likePost(post.dataset.id,currentCount,-1)
        } else {
          likeButton.classList.add('liked');
          likeOverlay.classList.add('animate');
          currentCount = parseInt(likeCountElement.innerHTML, 10)
          likeCountElement.innerHTML = currentCount + 1;
          likePost(post.dataset.id,currentCount,1)
        }
  
        setTimeout(() => {
          likeOverlay.classList.remove('animate');
        }, 500);
      });
      post.addEventListener('dblclick', () => {
        
          if (likeButton.classList.contains('liked')) {
            likeOverlay.classList.add('animate');         
          }
          else
          {
            likeOverlay.classList.add('animate');
            likeButton.classList.add('liked');
            currentCount = parseInt(likeCountElement.innerHTML, 10)
            likeCountElement.innerHTML = currentCount + 1;
            likePost(post.dataset.id,currentCount,1)
          }
          setTimeout(() => {
            likeOverlay.classList.remove('animate');
          }, 500);
      });
    });
  });

function likePost(postId,currentCount,add) {
    fetch(`/posts/${postId}`, {
    method: 'PUT',
    body: JSON.stringify({
      like_count : currentCount+add
    })
    });
  }