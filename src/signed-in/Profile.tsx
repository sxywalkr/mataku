import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Avatar,
  Caption,
  FAB,
  Headline,
  Subheading,
  Theme,
  Title,
  withTheme,
  Divider,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationParams } from 'react-navigation';
import { UserContext } from '../App';
import Hero from '../components/Hero';
import database from '@react-native-firebase/database';
// import Provider from '../components/Provider';
// import Facebook from '../providers/Facebook';
// import Google from '../providers/Google';
// import { getProviders } from '../util/helpers';

interface Props {
  theme: Theme;
  navigation: NavigationParams;
}

function Profile({ theme, navigation }: Props) {
  const user = useContext(UserContext);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userHandphone, setUserHandphone] = useState('');
  const [userPuskesmas, setUserPuskesmas] = useState('');
  const [userDesaKelurahan, setUserDesaKelurahan] = useState('');
  const [userKecamatan, setUserKecamatan] = useState('');
  const [userKabupaten, setUserKabupaten] = useState('');


  if (!user) {
    return null;
  }

  useEffect(() => {
    const ref = database().ref(`users/${user.uid}`);
    ref.once('value', onSnapshot);
    return () => { ref.off() }
  }, [loadingUser]);

  function onSnapshot(snapshot) {
    // console.log(snapshot.val())
    // setUserName(snapshot.val().userName)
    setUserHandphone(snapshot.val().userHandphone)
    setUserPuskesmas(snapshot.val().userPuskesmas)
    setUserDesaKelurahan(snapshot.val().userDesaKelurahan)
    setUserKecamatan(snapshot.val().userKecamatan)
    setUserKabupaten(snapshot.val().userKabupaten)
    setLoadingUser(false);
  }

  return (
    <View style={styles.container}>
      <Hero
        height={120}
        colors={['rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 0.1)']}
        imageIcon={'https://firebasestorage.googleapis.com/v0/b/fbmataku.appspot.com/o/apps_assets%2Flogo1_title.png?alt=media&token=be4cab0a-3b0d-4f8c-8af5-5fcacd2e55f1'}
      />
      <View style={[styles.content, styles.profile]}>
        {user.photoURL ? (
          <Avatar.Image size={80} source={{ uri: user.photoURL }} />
        ) : (
            <Avatar.Text
              size={80}
              label={user.email ? user.email.substring(0, 2).toUpperCase() : 'A'}
              style={styles.avatar}
            />
          )}
      </View>
      <View style={styles.content}>
        <Headline>
          {user.displayName ? user.displayName : user.email}{' '}
        </Headline>
        {!!user.metadata.lastSignInTime && (
          <Caption>
            {`Last sign-in: ${dayjs(user.metadata.lastSignInTime).format(
              'DD/MM/YYYY HH:mm',
            )}`}
          </Caption>
        )}
        <Divider />
        {!!user.displayName && <Title>{user.email}</Title>}
        {!!user.phoneNumber && <Subheading>{user.phoneNumber}</Subheading>}
        {!!userHandphone && <Subheading>Handphone : {userHandphone}</Subheading>}
        {!!userPuskesmas && <Subheading>Puskesmas : {userPuskesmas}</Subheading>}
        {!!userDesaKelurahan && <Subheading>Desa/Kelurahan : {userDesaKelurahan}</Subheading>}
        {!!userKecamatan && <Subheading>Kecamatan : {userKecamatan}</Subheading>}
        {!!userKabupaten && <Subheading>Kabupaten : {userKabupaten}</Subheading>}

      </View>
      {/* <View style={styles.providers}>
        <Provider type="password" active={providers.includes('password')} />
        <Provider type="facebook" active={providers.includes('facebook.com')} />
        <Provider type="google" active={providers.includes('google.com')} />
        <Provider type="phone" active={providers.includes('phone')} />
      </View> */}
      <FAB
        color="#fff"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="settings"
        onPress={() => navigation.navigate('Settings')}
      />

      {/* <View style={styles.center}>
        <Facebook />
        <Google />
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff',
  },
  content: {
    paddingHorizontal: 20,
  },
  profile: {
    marginTop: -50,
    paddingVertical: 10,
  },
  avatar: {
    borderColor: '#fff',
    borderWidth: 5,
    elevation: 4,
  },
  providers: {
    backgroundColor: '#F6F7F8',
    elevation: 4,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 30,
    padding: 20,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  center: {
    width: '100%',
    alignItems: 'center',
  },
});

export default withTheme(Profile);
