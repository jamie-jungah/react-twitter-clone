import HomePage from 'pages/home';
import NotificationsPage from 'pages/notifications';
import PostListPage from 'pages/posts';
import PostDetail from 'pages/posts/detail';
import EditPost from 'pages/posts/edit';
import NewPost from 'pages/posts/new';
import ProfilePage from 'pages/profile';
import EditProfile from 'pages/profile/edit';
import SearchPage from 'pages/search';
import LoginPage from 'pages/users/login';
import SignupPage from 'pages/users/signup';
import { Navigate, Route, Routes } from 'react-router-dom';

interface RouterProps {
  isAuthenticated: boolean;
}

export default function Router({ isAuthenticated }: RouterProps) {
  return (
    <Routes>
      {isAuthenticated ? (
        <>
          <Route path='/' element={<HomePage />} />
          <Route path='/posts' element={<PostListPage />} />
          <Route path='/posts/:id' element={<PostDetail />} />
          <Route path='/posts/new' element={<NewPost />} />
          <Route path='/posts/edit/:id' element={<EditPost />} />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/profile/edit' element={<EditProfile />} />
          <Route path='/notifications' element={<NotificationsPage />} />
          <Route path='/search' element={<SearchPage />} />
          <Route path='*' element={<Navigate replace to='/' />} />
        </>
      ) : (
        <>
          <Route path='/users/login' element={<LoginPage />} />
          <Route path='/users/signup' element={<SignupPage />} />
          <Route path='*' element={<Navigate replace to='/users/login' />} />
        </>
      )}
    </Routes>
  );
}
