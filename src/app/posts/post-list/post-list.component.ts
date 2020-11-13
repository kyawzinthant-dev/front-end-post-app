import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Post } from '../post.model';
import { PostsService } from '../post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   { title: 'First Post', content: 'This is first post content' },
  //   { title: 'Second Post', content: 'This is second post content' },
  //   { title: 'Third Post', content: 'This is third post content' },
  //   { title: 'Fourth Post', content: 'This is fourth post content' },
  // ]
  // @Input() posts: Post[] = [];
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [1,2,5,10];
  userIsAuthenticated = false;
  userId: string;
  private authStatusSub: Subscription;
  private postsSub: Subscription;

  constructor(public postsService: PostsService, private authService:AuthService) { }

  onChangedPage(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  ngOnInit(): void {

    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage,this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postData: {posts:Post[], postCount: number}) => { //emitted
        this.isLoading = false;
        this.totalPosts = postData.postCount; 
        this.posts = postData.posts;
      });
    this.userIsAuthenticated = this.authService.getIsAtuh();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      isAuthenticated=>{
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
        console.log(this.authService.getUserId())
      }
    );
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId).subscribe(()=>{
      this.postsService.getPosts(this.postsPerPage,this.currentPage);
    },()=>{
      this.isLoading = false;
    });
  }

}
