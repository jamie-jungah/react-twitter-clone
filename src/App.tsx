import { useState } from 'react';

import { Layout } from 'components/Layout';
import Router from 'components/Router';

import { getAuth } from 'firebase/auth';
import { app } from 'firebaseApp';

function App() {
  const auth = getAuth(app);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!auth?.currentUser
  );

  return (
    <Layout>
      <Router />
    </Layout>
  );
}

export default App;
