import AuthContext from 'context/AuthContext';
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db } from 'firebaseApp';
import useTranslation from 'hooks/useTranslation';
import { PostProps } from 'pages/home';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';

export interface CommentFormProps {
  post: PostProps | null;
}

export default function CommentForm({ post }: CommentFormProps) {
  const [comment, setComment] = useState<string>('');
  const { user } = useContext(AuthContext);
  const translation = useTranslation();

  const truncate = (str: string) => {
    return str?.length > 10 ? str?.substring(0, 10) + '...' : str;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (post && user) {
      try {
        const postRef = doc(db, 'posts', post?.id);
        const commentObj = {
          comment: comment,
          uid: user?.uid,
          email: user?.email,
          createdAt: new Date()?.toLocaleDateString('ko', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
        };

        await updateDoc(postRef, {
          comments: arrayUnion(commentObj),
        });

        // 댓글 생성 알림 만들기
        if (user?.uid !== post?.uid) {
          await addDoc(collection(db, 'notifications'), {
            createdAt: new Date()?.toLocaleDateString('ko', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }),
            uid: post?.uid,
            isRead: false,
            url: `/posts/${post?.id}`,
            content: `${truncate(post?.content)} ${translation(
              'COMMENT_NOTIFICATIONS'
            )}`,
          });
        }

        toast.success('댓글이 생성되었습니다.');
        setComment('');
      } catch (error: any) {
        console.log(error);
      }
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === 'comment') {
      setComment(value);
    }
  };

  return (
    <form className='post-form' onSubmit={onSubmit}>
      <textarea
        className='post-form__textarea'
        name='comment'
        id='comment'
        required
        placeholder={translation('COMMENT_PLACEHOLDER')}
        onChange={onChange}
        value={comment}
      />
      <div className='post-form__submit-area'>
        <div />
        <input
          type='submit'
          value={translation('BUTTON_COMMENT')}
          className='post-form__submit-btn'
          disabled={!comment}
        />
      </div>
    </form>
  );
}
