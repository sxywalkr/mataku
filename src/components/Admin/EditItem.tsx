import auth from '@react-native-firebase/auth';
import React, { useEffect, useState, useContext } from 'react';
import { Alert, ScrollView, StyleSheet, View, Image, PixelRatio } from 'react-native';
import {
  Button,
  Paragraph,
  TextInput,
  Title,
  Theme,
  Divider,
  Caption,
} from 'react-native-paper';
import { firebase } from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-picker';
import database from '@react-native-firebase/database';
import { NavigationParams, NavigationRoute } from 'react-navigation';
import { GoogleSignin, statusCodes } from 'react-native-google-signin';
import GDrive from "react-native-google-drive-api-wrapper";

import fs from 'react-native-fs';
import { UserContext, UserRoleContext } from '../../App';
// import axios from 'axios';
// import google from 'googleapis';


// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
interface Props {
  theme: Theme;
  navigation: NavigationParams;
  route: NavigationRoute;
}

function EditItem({ theme, navigation, route }: Props) {
  const user = auth().currentUser;
  const userRole = useContext(UserRoleContext)
  const { q, r } = route.params;
  // console.log(r, userRole)
  const [error, setError] = useState('');
  const [itemKey, setItemKey] = useState(q === 'New' ? '' : r.itemUid)
  const [itemNama, setItemNama] = useState(q === 'New' ? '' : r.itemNama)
  const [itemAlamat, setItemAlamat] = useState(q === 'New' ? '' : r.itemAlamat)
  const [itemUmur, setItemUmur] = useState(q === 'New' ? '' : r.itemUmur)
  const [itemJenisKelamin, setItemJenisKelamin] = useState(q === 'New' ? '' : r.itemJenisKelamin)
  const [itemPekerjaan, setItemPekerjaan] = useState(q === 'New' ? '' : r.itemPekerjaan)
  const [itemKabupaten, setItemKabupaten] = useState(q === 'New' ? '' : r.itemKabupaten)
  const [itemKecamatan, setItemKecamatan] = useState(q === 'New' ? '' : r.itemKecamatan)
  const [itemDesaKelurahan, setItemDesaKelurahan] = useState(q === 'New' ? '' : r.itemDesaKelurahan)
  const [itemPuskesmas, setItemPuskesmas] = useState(q === 'New' ? '' : r.itemPuskesmas)
  const [loadingAvatar1, setLoadingAvatar1] = useState(false);
  const [loadingAvatar2, setLoadingAvatar2] = useState(false);
  const [avatarSource1, setAvatarSource1] = useState(q === 'New' ? null : { uri: r.itemFoto1 });
  const [avatarSource2, setAvatarSource2] = useState(q === 'New' ? null : { uri: r.itemFoto2 });
  const [savingItem, setSavingItem] = useState(false);
  const [userInfo, setUserInfo] = useState()
  const [apiToken, setApiToken] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (error) {
      Alert.alert('Pesan Error', error);
    }
  }, [error]);

  const selectPhotoTapped1 = () => {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let source = { uri: response.uri };
        setAvatarSource1(source)
      }
    });
    setLoadingAvatar1(false)
  }

  const selectPhotoTapped2 = () => {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let source = { uri: response.uri };
        setAvatarSource2(source)
        // console.log(source)
      }
    });
    setLoadingAvatar2(false)
  }


  async function handleGoogle() {
    try {
      GoogleSignin.configure({
        scopes: ['https://www.googleapis.com/auth/drive'],
        // TODO change me
        // webClientId:
        //   '584321849841-e5elbqsqakfkt3v0c74ou142hslot0bt.apps.googleusercontent.com',
        webClientId: '519132597723-pl9f408gi168m0vm53tochluogvrs0ne.apps.googleusercontent.com',
      });
      await GoogleSignin.hasPlayServices();

      await GoogleSignin.signIn();
      const { accessToken, idToken } = await GoogleSignin.getTokens();
      console.log(idToken, accessToken)
      const credential = auth.GoogleAuthProvider.credential(
        idToken,
        accessToken,
      );
      // if (variant === 'LINK') {
      //   await user.linkWithCredential(credential);
      // } else if (variant === 'SIGN_IN') {
      await auth().signInWithCredential(credential);
      // }
    } catch (error) {
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          return Alert.alert('Google Auth Canceled');
        case statusCodes.IN_PROGRESS:
          return Alert.alert('Google Auth Already In Progress');
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          return Alert.alert('Google Auth Requires Play Services');
        default:
          Alert.alert('Google Auth Error', error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitItem() {
    if (!savingItem) {
      try {
        // const isSignedIn = await GoogleSignin.isSignedIn();
        // console.log('G sign in', isSignedIn)
        const {accessToken, idToken} = await GoogleSignin.getTokens();
        GDrive.setAccessToken(accessToken);
        GDrive.init();
        GDrive.isInitialized() ? console.log("TRUEEEEEEEE") : console.log("FALSEEEEEEEE")

        fs.readFile(avatarSource1.uri, 'base64')
          .then((res => {             //conversion of image to base64
            // console.log('init');
            GDrive.files.createFileMultipart(
              res,
              "'image/jpg'", {
              // parents: ["root"], //or any path
              name: "photo.jpg"
            },
              true)              //make it true because you are passing base64 string otherwise the uploaded file will be not supported
              .then(a => {
                console.log('succ', a);
              });
          }))

      } catch (e) {
        setError(e.message)
      } finally {
        setSavingItem(false)
        // navigation.navigate('AppHome')
      }
    }

  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Title>Profile Pasien</Title>
        <Paragraph>Nama : {itemNama}</Paragraph>
        <Paragraph>Alamat : {itemAlamat}</Paragraph>
        <Paragraph>Umur : {itemUmur}</Paragraph>
        <Paragraph>Jenis Kelamin : {itemJenisKelamin}</Paragraph>
        <Paragraph>Pekerjaan : {itemPekerjaan}</Paragraph>
        <Paragraph>Kabupaten : {itemKabupaten}</Paragraph>
        <Paragraph>Kecamatan : {itemKecamatan}</Paragraph>
        <Paragraph>Desa/Kelurahan : {itemDesaKelurahan}</Paragraph>
        <Paragraph>Puskesmas : {itemPuskesmas}</Paragraph>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
          <View style={{ flexDirection: 'column' }}>
            <View style={[styles.avatar, styles.avatarContainer]} >
              {avatarSource1 === null ? (
                <Title>Mata Kiri</Title>
              ) : (
                  <Image style={styles.avatar} source={avatarSource1} />
                )}
            </View>
            <Paragraph>Mata Kiri</Paragraph>
          </View>
          <View>
            <View style={[styles.avatar, styles.avatarContainer]} >
              {avatarSource2 === null ? (
                <Title>Mata Kanan</Title>
              ) : (
                  <Image style={styles.avatar} source={avatarSource2} />
                )}
            </View>
            <Paragraph>Mata Kanan</Paragraph>
          </View>
        </View>
        <Button
          disabled={!itemNama || !itemAlamat || !itemUmur || !itemJenisKelamin || !itemPekerjaan || !itemKabupaten || !itemKecamatan || !itemDesaKelurahan || !itemPuskesmas}
          mode="outlined"
          loading={savingItem}
          onPress={handleSubmitItem}
          style={styles.button}>
          Simpan
        </Button>

      </View>
    </ScrollView>
  );
}

EditItem.options = {
  title: 'Edit Item',
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    // borderRadius: 75,
    width: 150,
    height: 150,
  },
});

export default EditItem;
