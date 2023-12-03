import { useCallback, useContext, useEffect, useState } from 'react';
import { FiImage } from 'react-icons/fi';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from 'firebaseApp';
import { toast } from 'react-toastify';

import { useNavigate, useParams } from 'react-router-dom';
import { PostProps } from 'pages/home';

export default function PostEditForm() {
  const [content, setContent] = useState<string>('');
  const [post, setPost] = useState<PostProps | null>(null);
  const [hashtag, setHastag] = useState<string>('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const params = useParams();
  const navigate = useNavigate();

  const handleFileUpload = () => {};

  const getPost = useCallback(async () => {
    if (params.id) {
      const docRef = doc(db, 'posts', params.id);
      const docSnap = await getDoc(docRef);
      setPost({ ...(docSnap?.data() as PostProps), id: docSnap.id });
      setContent(docSnap?.data()?.content);
      setHashtags(docSnap?.data()?.hashtags);
    }
  }, [params.id]);

  const onSubmit = async (e: any) => {
    e.preventDefault();

    try {
      if (post) {
        const postRef = doc(db, 'posts', post?.id);
        await updateDoc(postRef, {
          content: content,
          hashtags: hashtags,
        });
        toast.success('게시글을 수정했습니다.');
        navigate(`posts/${post?.id}`);
      }
    } catch (e: any) {
      console.log(e);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === 'content') {
      setContent(value);
    }
  };

  const removeHashtag = (tag: string) => {
    setHashtags(hashtags?.filter((value) => value !== tag));
  };

  const onChangeHashtag = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHastag(e?.target?.value?.trim());
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ' && e.currentTarget.value.trim() !== '') {
      // 같은 태그가 있으면 에러 띄우기 아니라면 생성
      if (hashtags?.includes(e.currentTarget.value.trim())) {
        toast.error('이미 입력한 태그가 있습니다.');
      } else {
        setHashtags((prev) =>
          prev?.length > 0 ? [...prev, hashtag] : [hashtag]
        );
        setHastag('');
      }
    }
  };

  useEffect(() => {
    if (params.id) {
      getPost();
    }
  }, [getPost]);

  return (
    <form className='post-form' onSubmit={onSubmit}>
      <textarea
        className='post-form__textarea'
        required
        name='content'
        id='content'
        placeholder='What is happening?'
        onChange={onChange}
        value={content}
      />
      <div className='post-form__hashtags'>
        <span className='post-form__hastags-outputs'>
          {hashtags?.map((tag, index) => (
            <span
              className='post-form__hashtags-tag'
              key={index}
              onClick={() => removeHashtag(tag)}
            >
              #{tag}
            </span>
          ))}
        </span>
        <input
          className='post-form__input'
          name='hashtag'
          id='hashtag'
          placeholder='해시태그 + 스페이스 바 입력'
          onChange={onChangeHashtag}
          onKeyUp={handleKeyUp}
          value={hashtag}
        />
      </div>
      <div className='post-form__submit-area'>
        <label htmlFor='file-input' className='post-form__file'>
          <FiImage className='post-form__file-icon' />
        </label>
        <input
          type='file'
          name='file-input'
          accept='image/*'
          onChange={handleFileUpload}
          className='hidden'
        />
        <input type='submit' value='수정' className='post-form__submit-btn' />
      </div>
    </form>
  );
}
