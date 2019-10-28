import auth from '@react-native-firebase/auth';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View, Image, PixelRatio } from 'react-native';
import {
  Button,
  Paragraph,
  TextInput,
  Title,
  Theme,
} from 'react-native-paper';
import { firebase } from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-picker';
import database from '@react-native-firebase/database';
import { NavigationParams, NavigationRoute } from 'react-navigation';
// import GDrive from "react-native-google-drive-api-wrapper";
// import fs from 'react-native-fs';

// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
interface Props {
  theme: Theme;
  navigation: NavigationParams;
  route: NavigationRoute;
}

function EditItem({ theme, navigation, route }: Props) {
  const user = auth().currentUser;
  const { q, r } = route.params;
  // console.log(r)
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

  async function handleSubmitItem() {
    if (!savingItem) {
      try {
        setSavingItem(true)
        const itemQ = database().ref(`dbPasien/${user.uid}`).push();
        const QQ = itemKey ? itemKey : itemQ.key;
        // console.log(q ,itemQ.key)
        await database().ref('dbPasien/' + QQ).set({
          tmUid: user.uid,
          tmName: user.displayName,
          itemUid: QQ,
          itemNama,
          itemAlamat,
          itemUmur,
          itemJenisKelamin,
          itemPekerjaan,
          itemKabupaten,
          itemKecamatan,
          itemDesaKelurahan,
          itemPuskesmas,
          itemFoto1: avatarSource1.uri,
          itemFoto2: avatarSource2.uri,
          itemFlag: 'Item di register'
        });
        const ref1 = firebase.storage().ref(`${user.uid}/${QQ}/1.jpg`);
        const path1 = avatarSource1.uri
        const task1 = ref1.putFile(path1, {
          cacheControl: 'no-store', // disable caching
        })
          .then(succ => console.log(succ))
          .catch(e => setError(e))
          ;
        const ref2 = firebase.storage().ref(`${user.uid}/${QQ}/2.jpg`);
        const path2 = avatarSource2.uri
        const task2 = ref2.putFile(path2, {
          cacheControl: 'no-store', // disable caching
        })
          .then(succ => console.log(succ))
          .catch(e => setError(e))
          ;
        //   if (path1.uri) {
        //     // response.data is the actual image data.
        //     // response.type can give you the mime for pictures only
        //     // response.fileName for the name of the file.
        //     GDrive.files.createFileMultipart(
        //         response.data,
        //         response.type, {
        //             parents: ["root"],
        //             name: response.fileName,
        //         }, false);
        // }
        // fs.readFile(path1, 'base64')
        //   .then((res => {             //conversion of image to base64
        //     console.log(res);
        //     GDrive.files.createFileMultipart(
        //       res,
        //       "'image/jpg'", {
        //       parents: ["root"], //or any path
        //       name: "photo.jpg"
        //     },
        //       true)              //make it true because you are passing base64 string otherwise the uploaded file will be not supported
        //       .then(a => {
        //         console.log(a);
        //       });
        //   }))
      } catch (e) {
        setError(e.message)
      } finally {
        setSavingItem(false)
        navigation.navigate('AppHome')
      }
    }

  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Title>Profile Pasien</Title>
        <Paragraph>
          Input data profile pasien katarak. Ambil gambar mata.
        </Paragraph>
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Nama"
          value={itemNama}
          onChangeText={setItemNama}
        />
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Alamat"
          value={itemAlamat}
          onChangeText={setItemAlamat}
        />
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Umur"
          value={itemUmur}
          keyboardType='number-pad'
          onChangeText={setItemUmur}
        />
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Jenis Kelamin"
          value={itemJenisKelamin}
          onChangeText={setItemJenisKelamin}
        />
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Pekerjaan"
          value={itemPekerjaan}
          onChangeText={setItemPekerjaan}
        />
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Kabupaten"
          value={itemKabupaten}
          onChangeText={setItemKabupaten}
        />
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Kecamatan"
          value={itemKecamatan}
          onChangeText={setItemKecamatan}
        />
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Desa/Kelurahan"
          value={itemDesaKelurahan}
          onChangeText={setItemDesaKelurahan}
        />
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Puskesmas"
          value={itemPuskesmas}
          onChangeText={setItemPuskesmas}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
          <View style={{ flexDirection: 'column' }}>
            <View style={[styles.avatar, styles.avatarContainer]} >
              {avatarSource1 === null ? (
                <Title>Mata Kiri</Title>
              ) : (
                  <Image style={styles.avatar} source={avatarSource1} />
                )}
            </View>
            <Button
              mode="text"
              loading={loadingAvatar1}
              onPress={selectPhotoTapped1}
              style={styles.button}>
              Mata Kiri
          </Button>
          </View>
          <View>
            <View style={[styles.avatar, styles.avatarContainer]} >
              {avatarSource2 === null ? (
                <Title>Mata Kanan</Title>
              ) : (
                  <Image style={styles.avatar} source={avatarSource2} />
                )}
            </View>
            <Button
              mode="text"
              loading={loadingAvatar2}
              onPress={selectPhotoTapped2}
              style={styles.button}>
              Mata Kanan
          </Button>
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
