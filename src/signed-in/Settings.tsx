import auth from '@react-native-firebase/auth';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { GoogleSignin } from 'react-native-google-signin';
import {
  Banner,
  Button,
  Divider,
  Paragraph,
  TextInput,
  Title,
  ActivityIndicator,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import database from '@react-native-firebase/database';

function EditProfile() {
  const user = auth().currentUser || '';

  const [error, setError] = useState('');
  const [loadingUser, setLoadingUser] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [savingName, setSavingName] = useState(false);
  const [displayName, setDisplayName] = useState(
    user ? user.displayName || '' : '',
  );
  const [userName, setUserName] = useState('');
  const [userHandphone, setUserHandphone] = useState('');
  const [userPuskesmas, setUserPuskesmas] = useState('');
  const [userDesaKelurahan, setUserDesaKelurahan] = useState('');
  const [userKecamatan, setUserKecamatan] = useState('');
  const [userKabupaten, setUserKabupaten] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (error) {
      Alert.alert('Create Account - Error', error);
    }
  }, [error]);

  useEffect(() => {
    GoogleSignin.configure({});
    const ref = database().ref(`users/${user.uid}`);
    ref.once('value', onSnapshot);
    return () => { ref.off() }
  }, [loadingUser]);

  function onSnapshot(snapshot) {
    // console.log(snapshot.val())
    setUserName(snapshot.val().userName)
    setUserHandphone(snapshot.val().userHandphone)
    setUserPuskesmas(snapshot.val().userPuskesmas)
    setUserDesaKelurahan(snapshot.val().userDesaKelurahan)
    setUserKecamatan(snapshot.val().userKecamatan)
    setUserKabupaten(snapshot.val().userKabupaten)
    setLoadingUser(false);
  }

  async function signOut() {
    setSigningOut(true);
    await GoogleSignin.signOut();
    await auth().signOut();
  }

  async function handleDisplayName() {
    if (!user) {
      return;
    }

    if (!savingName) {
      try {
        setSavingName(true);
        setLoadingUser(true)
        await user.updateProfile({
          displayName,
        });
        await database().ref(`users/${user.uid}`).update({
          userName: displayName,
          userHandphone,
          userPuskesmas,
          userDesaKelurahan,
          userKecamatan,
          userKabupaten,
        })
      } catch (e) {
        setError(e.message);
      } finally {
        setSavingName(false);
        setLoadingUser(false)
      }
    }
  }

  async function handlePassword() {
    if (!user || !user.email) {
      return;
    }
    if (!savingPassword) {
      try {
        setSavingPassword(true);
        await auth().signInWithEmailAndPassword(user.email, currentPassword);
        await user.updatePassword(newPassword);
      } catch (e) {
        setError(e.message);
      } finally {
        setSavingPassword(false);
      }
    }
  }

  if (!user) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <Banner
        visible={!user.emailVerified}
        actions={[
          {
            label: 'Re-send',
            onPress: () => {
              user.sendEmailVerification().then(() =>
                Alert.alert(
                  'Verification',
                  `A verification email has been sent to 
                    ${user.email}
                    . Please follow the instructions to verify your email address.`,
                ),
              );
            },
          },
        ]}
        image={({ size }) => (
          <Icon name="alert-decagram" size={size} color="#f44336" />
        )}
        style={styles.banner}>
        Please verify your email address to use the full features of this app!
        Click the button below to resend a verification email.
      </Banner>
      <View style={styles.content}>
        <Title>User Profile:</Title>
        <Paragraph>
          Mengatur profile user aplikasi.
        </Paragraph>
        <TextInput
          style={styles.input}
          mode="outlined"
          label="User Name"
          value={displayName}
          onChangeText={setDisplayName}
        />
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Handphone"
          value={userHandphone}
          onChangeText={setUserHandphone}
          keyboardType='phone-pad'
        />
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Puskesmas"
          value={userPuskesmas}
          onChangeText={setUserPuskesmas}
        />
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Desa/ Kelurahan"
          value={userDesaKelurahan}
          onChangeText={setUserDesaKelurahan}
        />
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Kecamatan"
          value={userKecamatan}
          onChangeText={setUserKecamatan}
        />
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Kabupaten"
          value={userKabupaten}
          onChangeText={setUserKabupaten}
        />
        <Button
          mode="outlined"
          loading={savingName}
          onPress={handleDisplayName}
          style={styles.button}>
          Save
        </Button>
      </View>
      <Divider />
      <View style={styles.content}>
        <Title>Password Update:</Title>
        <Paragraph>
          Update your account password. For security purposes, please enter your
          current account password.
        </Paragraph>
        <TextInput
          secureTextEntry
          style={styles.input}
          mode="outlined"
          label="Current Password"
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
        <TextInput
          secureTextEntry
          style={styles.input}
          mode="outlined"
          label="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          secureTextEntry
          style={styles.input}
          mode="outlined"
          label="Confirm New Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <Button
          disabled={!currentPassword || !newPassword || !confirmPassword}
          mode="outlined"
          loading={savingPassword}
          onPress={handlePassword}
          style={styles.button}>
          Update
        </Button>
      </View>
      <Divider />
      <View style={[styles.content, styles.actions]}>
        <Button
          mode="contained"
          loading={signingOut}
          onPress={() => (signingOut ? null : signOut())}
          style={[styles.button, styles.maxWidth]}>
          Sign Out
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  maxWidth: {
    width: '100%',
  },
  content: {
    padding: 16,
  },
  banner: {
    backgroundColor: '#ffebee',
  },
  input: {
    marginTop: 20,
  },
  button: {
    alignSelf: 'center',
    marginVertical: 20,
  },
  actions: {
    backgroundColor: '#F6F7F8',
  },
});

export default EditProfile;
