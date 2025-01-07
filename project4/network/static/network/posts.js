document.addEventListener('DOMContentLoaded', () => {
    const posts = document.querySelectorAll('.post');
    let likeCountElement = document.querySelector('.like-count');
    const user = document.getElementById('username').innerHTML;
    const followButton = document.getElementById('follow-button');
    console.log(followButton.innerHTML.trim())
    if (followButton) {
      followButton.addEventListener('click', () => {
        
        if (followButton.innerHTML === 'Follow') {
          console.log(1)
          followButton.innerHTML = 'Unfollow';
          followuser = document.getElementById('searchusername').innerHTML;
          followUser(followuser,true);
        } 
        if (followButton.innerHTML === 'Unfollow') {
          followButton.innerHTML = 'Follow';
          followuser = document.getElementById('searchusername').innerHTML;
          followUser(followuser,false);
        }
      });
    }
    posts.forEach(post => {
      const likeOverlay = post.querySelector('.like-overlay');
      const likeButton = post.querySelector('.like-button');
      const commentButton = post.querySelector('.bi-chat');
      let likeCountElement = post.querySelector('.like-count');
      const comment_section = post.querySelector('.comments');
      
      commentButton.addEventListener('click', () => {
        if (post.querySelector('.comment-section')) {
        }
        else
        {
          const container = document.createElement('div');
        container.classList.add('comment-section');
        container.innerHTML = `
        <input type="text" class="comment-input" placeholder="Add a comment...">
        <button class="comment-button">Post</button>
        `;
        post.append(container);
        const commentinput = post.querySelector('.comment-input');
        const commentbutton = post.querySelector('.comment-button');
        commentbutton.addEventListener('click', () => {
          const comment = commentinput.value;
          commentinput.value = '';
          commentPost(post.dataset.id,comment,comment_section,user)
        });
        commentinput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            const comment = commentinput.value;
            commentinput.value = '';
            commentPost(post.dataset.id,comment,comment_section,user)
          }
        });
        }
        
        
      
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

function commentPost(postId,comment,comment_section,user) {
  if (comment === '') {
    return;
  }
  const commentjs = document.createElement('div');
  commentjs.classList.add('comment');
  commentjs.innerHTML = `<span class="username">${user}</span>: ${comment}`;
  comment_section.prepend(commentjs);
    fetch(`/posts/${postId}`, {
    method: 'PUT',
    body: JSON.stringify({
      comment: comment
    })
    });
  }

 function followUser(following,bool)
 {
  if (bool) {
    console.log(1)
    fetch('/follow',{
      method: 'PUT',
      body: JSON.stringify({
        following: following
      })
    }) ;
  }
  else{
    fetch('/follow',{
      method: 'DELETE',
      body: JSON.stringify({
        following: following
      })
    }) ;
  }
  

 }