import {AfterViewChecked, Component}   from '@angular/core';
import {Observable}                    from 'rxjs';
import {BlogPost}                      from '../../../../shared/models/blog-post';
import {DatabaseService}               from '../../../../shared/services/database/database.service';
import {ActivatedRoute}                from '@angular/router';
import {filter, map, pluck, switchMap} from 'rxjs/operators';
import {objectExists}                  from '../../../../shared/services/utilites/utilities.service';

import 'clipboard';

import 'prismjs';
import 'prismjs/plugins/toolbar/prism-toolbar';
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-sass';
import 'prismjs/components/prism-scss';
import {DomSanitizer}                  from '@angular/platform-browser';

declare var Prism: any;

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.scss']
})
export class ViewPostComponent implements AfterViewChecked {
  post$: Observable<BlogPost> = this.router.params.pipe(
    pluck('uid'),
    filter(objectExists),
    switchMap(this.db.getPost$),
    map((post: BlogPost) => {
      const sanitizedBlog: any = post;
      if (sanitizedBlog.youtubeUrl) {
        sanitizedBlog.youtubeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(sanitizedBlog.youtubeUrl);
      }
      return sanitizedBlog;
    })
  );
  private highlighted: boolean;

  constructor(private db: DatabaseService, private router: ActivatedRoute, public sanitizer: DomSanitizer) {
  }

  ngAfterViewChecked(): void {
    if (!this.highlighted) {
      Prism.highlightAll();
    }
  }

}
