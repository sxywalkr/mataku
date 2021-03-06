import React from 'react';
import {Text} from 'react-native';
import {createContext, ReactNode, useEffect, useState} from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {Provider} from 'react-native-paper';

import theme from './theme';
import SignedInStack from './signed-in/Stack';
import SignedOutStack from './signed-out/Stack';
import database from '@react-native-firebase/database';
/**
 * Types
 */
type User = FirebaseAuthTypes.User | null;

/**
 * Context
 */
export const UserContext = createContext<User>(null);
export const UserRoleContext = createContext<String>('')

function App() {
  const [initializing, setInitializing] = useState(true);
  const [listenUser, setListenUser] = useState(false);
  const [user, setUser] = useState<User>(null);
  const [userRole, setUserRole] = useState('ROLELESS');

  async function getUserRole(p) {
    if (p) {
      const uid = p.uid;
      const ref = database().ref(`users/${uid}/userRole`);
      const snapshot = await ref.once('value');
      setUserRole(snapshot.val());
      // console.log('User data: ', snapshot.val());
    }
  }

  /** Listen for auth state changes */
  useEffect(() => {
    const authListener = auth().onAuthStateChanged(result => {
      setUser(result);
      getUserRole(result)
      if (initializing && !listenUser) {
        setInitializing(false);
        setListenUser(true);
      }
    });

    return () => {
      if (authListener) {
        authListener();
      }
    };
  }, [initializing, listenUser]);

  /** Listen for user changes */
  useEffect(() => {
    let userListener: () => void;

    if (listenUser) {
      userListener = auth().onUserChanged(result => {
        setUser(result);
        getUserRole(result)
      });
    }

    return () => {
      if (userListener) {
        userListener();
      }
    };
  }, [listenUser]);

  if (initializing) {
    return <Text>Loading...</Text>;
  }

  function container(children: ReactNode | ReactNode[]) {
    return <Provider theme={theme}>{children}</Provider>;
  }

  return container(
    user ? (
      <UserContext.Provider value={user}>
        <UserRoleContext.Provider value={userRole}>
          <SignedInStack />
        </UserRoleContext.Provider>
      </UserContext.Provider>
    ) : (
      <SignedOutStack />
    ),
  );
}

export default App;
