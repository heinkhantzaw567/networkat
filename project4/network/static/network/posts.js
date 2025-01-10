document.addEventListener('DOMContentLoaded', () => {
    const posts = document.querySelectorAll('.post');
    let likeCountElement = document.querySelector('.like-count');
    const user = document.getElementById('username').innerHTML;
    const followButton = document.getElementById('follow-button');
    const buttons = document.querySelectorAll('.tab');
    const sections = document.querySelectorAll('.tab-content');
    console.log(buttons);
    console.log(sections);
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        // Remove 'active' class from all buttons and sections
        buttons.forEach((btn) => btn.classList.remove('active'));
        sections.forEach((section) => section.classList.remove('active'));

        // Add 'active' class to the clicked button and its associated section
        button.classList.add('active');
        const targetSection = document.getElementById(button.dataset.tab);
        if (targetSection) {
          targetSection.classList.add('active');
        }
      });
    });
    if (followButton) {
      // Add click event listener to the follow button
      followButton.addEventListener('click', () => {
        // Get the username from the element with id 'searchusername'
        const usernameElement = document.getElementById('searchusername');
        if (!usernameElement) {
          console.error('Username element not found!');
          return;
        }
        
        const followuser = usernameElement.innerHTML.trim();

        // Toggle follow/unfollow behavior
        if (followButton.innerHTML.trim() === 'Follow') {
          console.log('Following user:', followuser);
          followButton.innerHTML = 'Following';
          followUser(followuser, true); // Assuming followUser function is defined elsewhere
        } else if (followButton.innerHTML.trim() === 'Following') {
          console.log('Unfollowing user:', followuser);
          followButton.innerHTML = 'Follow';
          followUser(followuser, false); // Assuming followUser function is defined elsewhere
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
          console.log(currentCount);
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
    
      const editButton = post.querySelector('.edit-button');
      if (editButton) {
        editButton.addEventListener('click', () => {
          const content = post.querySelector('.post-content');
          const edit = document.createElement('input');
          edit.classList.add('edit-input');
          edit.value = content.innerHTML;
          content.replaceWith(edit);
          edit.focus();
          edit.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
              const newContent = edit.value;
              edit.replaceWith(content);
              content.innerHTML = newContent;
              console.log(newContent);
              fetch(`/posts/${post.dataset.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                  post: newContent
                })
              });
            }
  
          });
        });
      }
      
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
    const followercount = document.getElementById('follower_count');
    followercount.innerHTML = parseInt(followercount.innerHTML, 10) + 1;
  
    fetch('/follow',{
      method: 'PUT',
      body: JSON.stringify({
        following: following
      })
    }) ;
  }
  else{
    const followercount = document.getElementById('follower_count');
    followercount.innerHTML = parseInt(followercount.innerHTML, 10) - 1;
    fetch('/follow',{
      method: 'DELETE',
      body: JSON.stringify({
        following: following
      })
    }) ;
  }
  

 }