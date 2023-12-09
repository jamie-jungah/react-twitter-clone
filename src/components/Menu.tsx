import { useNavigate } from 'react-router-dom';
import { BsHouse } from 'react-icons/bs';
import { BiUserCircle } from 'react-icons/bi';
import { MdLogout, MdLogin } from 'react-icons/md';
import { AiOutlineSearch } from 'react-icons/ai';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { useContext } from 'react';
import AuthContext from 'context/AuthContext';
import { getAuth, signOut } from 'firebase/auth';
import { app } from 'firebaseApp';
import { toast } from 'react-toastify';
import useTranslation from 'hooks/useTranslation';

export default function MenuList() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const translation = useTranslation();

  return (
    <div className='footer'>
      <div className='footer__grid'>
        <button type='button' onClick={() => navigate('/')}>
          <BsHouse />
          {translation('MENU_HOME')}
        </button>
        <button type='button' onClick={() => navigate('/profile')}>
          <BiUserCircle />
          {translation('MENU_PROFILE')}
        </button>
        <button type='button' onClick={() => navigate('/search')}>
          <AiOutlineSearch />
          {translation('MENU_SEARCH')}
        </button>
        <button type='button' onClick={() => navigate('/notifications')}>
          <IoMdNotificationsOutline />
          {translation('MENU_NOTI')}
        </button>
        {user === null ? (
          <button type='button' onClick={() => navigate('/users/login')}>
            <MdLogin />
            {translation('MENU_LOGIN')}
          </button>
        ) : (
          <button
            type='button'
            onClick={async () => {
              const auth = getAuth(app);
              await signOut(auth);
              toast.success('로그아웃 되었습니다.');
            }}
          >
            <MdLogout />
            {translation('MENU_LOGOUT')}
          </button>
        )}
      </div>
    </div>
  );
}
