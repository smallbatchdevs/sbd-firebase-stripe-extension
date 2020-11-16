import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable, of } from 'rxjs';
import { DatabaseService } from 'src/app/shared/services/database/database.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { filter, map, pluck, switchMap, take, tap } from 'rxjs/operators';
import { objectExists } from '../../../../shared/services/utilites/utilities.service';
import { AuthorEnum } from '../../../../shared/enums/author.enum';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss']
})
export class EditPostComponent {
  AUTHOR_ENUM = AuthorEnum;
  private isExistingPost: boolean;
  readonly form$: Observable<FormGroup> = this.router.params.pipe(
    pluck('uid'),
    filter(objectExists),
    switchMap((uid) => combineLatest([of(uid), this.database.getPost$(uid)])),
    map(([uid, post]) => {
      this.isExistingPost = !!post;
      return this.formBuilder.group({
        uid: post ? post.uid : uid,
        header: post ? post.header : 'Blog Post Header',
        subheader: post ? post.subheader : 'This is the sub header section!',
        youtubeUrl: post ? post.youtubeUrl : '',
        isPublished: post ? post.isPublished : false,
        updatedOn: new Date(),
        createdOn: post && post.createdOn ? post.createdOn : new Date(),
        prettyUrl: post ? post.prettyUrl : '',
        author: post ? post.author : '',
        previewImage: post ? post.previewImage : '',
        content: post ? post.content : []
      });
    })
  );
  errorMessage: string;

  constructor(
    private router: ActivatedRoute,
    private route: Router,
    private database: DatabaseService,
    private formBuilder: FormBuilder
  ) {}

  onSubmit(blogPostData) {
    blogPostData.uid = blogPostData.prettyUrl;
    console.log('blog post submitted', blogPostData);
    if (!this.isExistingPost) {
      this.database
        .getPost$(blogPostData.prettyUrl)
        .pipe(
          tap((existingBlogPost) => {
            if (existingBlogPost) {
              this.errorMessage = 'A blog post with that url already exists';
            } else {
              this.errorMessage = '';
              this.database.updatePost(blogPostData);
            }
          }),
          take(1)
        )
        .subscribe();
    } else {
      this.database.updatePost(blogPostData);
    }
  }
}
