import {Injectable}       from '@angular/core';
import {BlogPost}         from '../../models/blog-post';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable}       from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  constructor(private database: AngularFirestore) {}

  getPosts$(): Observable<BlogPost[]> {
    return this.database.collection<BlogPost>('posts').valueChanges();
  }

  getPublishedPosts$(): Observable<any[]> {
    return this.database.collection('posts', (ref) =>
      ref.where('isPublished', '==', true).orderBy('createdOn', 'desc')
    ).valueChanges();
  }

  getPost$ = (uid: string): Observable<BlogPost> => {
    return this.database.doc<BlogPost>(`posts/${uid}`).valueChanges();
  };

  /**
   * Adds a post if it isn't in the list
   * Updates a post if it is in the list
   * @param post
   */
  updatePost(post: BlogPost): Promise<void> {
    return this.database.doc<BlogPost>(`posts/${post.uid}`).set(post, { merge: true });
  }

  deletePost(post: BlogPost): Promise<void> {
    return this.database.doc<BlogPost>(`posts/${post.uid}`).delete();
  }

  getNewUid(): string {
    return this.database.createId();
  }

  set(data, path): Promise<void> {
    return this.database.doc(path).set(data, { merge: true });
  }
}
