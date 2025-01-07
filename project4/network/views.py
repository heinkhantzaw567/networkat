from django.contrib.auth import authenticate, login, logout
from django.core.serializers import serialize
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.http import JsonResponse
from .models import User,Post,Comment,Follow
import json
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.db.models import Prefetch




def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
    
def index(request):
    if request.method == "POST":
        post = request.POST["post"]
        user = request.user
        post = Post(userid=user,post=post)
        
        post.save()
        return HttpResponseRedirect(reverse("index"))
    else:
        user=request.user
        if request.user.is_anonymous:
            user = None
        
        posts = Post.objects.prefetch_related(
            Prefetch('comments', queryset=Comment.objects.order_by('-created_at'))
        ).order_by('-created_at')
        
        
        return render(request, "network/index.html",{
            "posts":posts,
            "user":user
        })

def posts(request):
    posts = Post.objects.all().order_by("-created_at")
    data = serialize('json', posts)
    return JsonResponse(data, safe=False)

@csrf_exempt
@login_required
def post (request,post_id):
    if request.method == "PUT":
        if request.user.is_anonymous:
            return JsonResponse({"error": "User must login in to like post."}, status=400)
        
        user = request.user
        data = json.loads(request.body)
        if data.get("like_count") is  not None:
            post = Post.objects.get(id=post_id)
            post.like_count = data["like_count"]
            post.like.add(user)
            post.save()
            return HttpResponse(status=204)
        elif data.get("comment") is not None:
            comment = Comment(userid=user,comment=data["comment"])
            comment.save()
            post = Post.objects.get(id=post_id)
            post.comment_count += 1
            post.comments.add(comment)
            post.save()
            return HttpResponse(status=204)

    post = Post.objects.get(id=post_id)
    data = serialize('json', [post])
    return JsonResponse(data, safe=False)

from django.shortcuts import render
from django.db.models import Prefetch

def profile(request, username):
    if request.method == "GET":
        # Get the logged-in user and the searched user
        user = request.user if not request.user.is_anonymous else None
        searchuser = User.objects.get(username=username)

        # Initialize the `bool` variable
        bool = False

        # Determine if the logged-in user follows the searched user
        if user and user != searchuser:
            if Follow.objects.filter(follower=user, following=searchuser).exists():
                bool = True

        # Fetch follow information based on whether the profile belongs to the logged-in user or another user
        profile_user = searchuser if user != searchuser else user
        following = Follow.objects.filter(follower=profile_user)
        followers = Follow.objects.filter(following=profile_user)
        following_count = Follow.objects.filter(follower=profile_user).count()
        followers_count = Follow.objects.filter(following=profile_user).count()

        # Get all posts of the searched user, with comments prefetched
        posts = Post.objects.filter(userid=searchuser).prefetch_related(
            Prefetch('comments', queryset=Comment.objects.order_by('-created_at'))
        ).order_by('-created_at')
        posts_count = posts.count()

        # Render the profile page
        return render(request, "network/profile.html", {
            "user": user,  # Logged-in user (can be None if anonymous)
            "searchuser": searchuser,  # Profile owner
            "following_count": following_count,
            "followers_count": followers_count,
            "followers":followers,
            "following":following,
            "posts": posts,
            "posts_count": posts_count,
            "bool": bool,  # Whether the logged-in user follows the searched user
        })

@csrf_exempt
@login_required
def follow(request):
    if request.method == "PUT":
        user = request.user
        data = json.loads(request.body)
        following = User.objects.get(username=data["following"])
        follow = Follow(follower=user,following=following)
        follow.save()
        return HttpResponse(status=204)
    elif request.method == "DELETE":
        user = request.user
        data = json.loads(request.body)
        following = User.objects.get(username=data["following"])
        follow = Follow.objects.get(follower=user,following=following)
        follow.delete()
        return HttpResponse(status=204)
    else:
        return JsonResponse({"error": "PUT or DELETE request required."}, status=400)