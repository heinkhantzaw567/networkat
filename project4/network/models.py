from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass
    

class Comment(models.Model):
    userid = models.ForeignKey(User,on_delete=models.CASCADE)
    comment = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

class Post(models.Model):
    userid = models.ForeignKey(User,on_delete=models.CASCADE)
    post = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    like_count = models.IntegerField(default=0)
    like = models.ManyToManyField(User,related_name="liked",blank=True)
    comment_count = models.IntegerField(default=0)
    comments =models.ManyToManyField(Comment,related_name="post",blank=True)
    shares = models.IntegerField(default=0)

class Follow(models.Model):
    follower = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="following"
    )  # The user who is following
    following = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="followers"
    )  # The user being followed
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)







