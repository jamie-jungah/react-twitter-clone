import { useContext, useEffect, useState } from 'react';
import PostBox from 'components/posts/PostBox';
import { PostProps } from 'pages/home';
import AuthContext from 'context/AuthContext';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { db } from 'firebaseApp';
import useTranslation from 'hooks/useTranslation';

export default function SearchPage() {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [tagQuery, setTagQuery] = useState<string>('');
  const { user } = useContext(AuthContext);
  const translation = useTranslation();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagQuery(e?.target?.value?.trim());
  };

  useEffect(() => {
    if (user) {
      let postsRef = collection(db, 'posts');
      let postsQuery = query(
        postsRef,
        where('hashtags', 'array-contains-any', [tagQuery]),
        orderBy('createdAt', 'desc')
      );

      onSnapshot(postsQuery, (snapshot) => {
        let dataObj = snapshot?.docs?.map((doc) => ({
          ...doc?.data(),
          id: doc?.id,
        }));

        setPosts(dataObj as PostProps[]);
      });
    }
  }, [tagQuery, user]);

  return (
    <div className='home'>
      <div className='home__top'>
        <div className='home__title'>
          <div className='home__title-text'>{translation('MENU_SEARCH')}</div>
        </div>
        <div className='home__search-div'>
          <input
            className='home__search'
            placeholder={translation('SEARCH_HASHTAGS')}
            onChange={onChange}
          />
        </div>
      </div>
      <div className='post'>
        {posts.length > 0 ? (
          posts?.map((post) => <PostBox post={post} key={post?.id} />)
        ) : (
          <div className='post__no-posts'>
            <div className='post__text'>{translation('NO_POSTS')}</div>
          </div>
        )}
      </div>
    </div>
  );
}
