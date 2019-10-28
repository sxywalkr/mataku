import auth from '@react-native-firebase/auth';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View, Image, PixelRatio, TouchableOpacity } from 'react-native';
import {
  Button,
  Paragraph,
  TextInput,
  Title,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import { firebase } from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-picker';

function AppSetting() {
  const user = auth().currentUser;

  const [error, setError] = useState('');
  const [savingItem, setSavingItem] = useState(false);
  const [namaItem, setNamaItem] = useState('');
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [avatarSource, setAvatarSource] = useState(null);


  useEffect(() => {
    if (error) {
      Alert.alert('Create Account - Error', error);
    }
  }, [error]);

  useEffect(() => {
    const dbref = async () => {
      const res = await database().ref(`/users/${user.uid}`).once('value')
      // console.log(res.val())
      setNamaItem(res.val().name)
    }
    dbref()
    return () => {
      database().ref(`/users/${user.uid}`).off();
    }
  }, [namaItem])

  async function handleItem() {
    if (!savingItem) {
      try {
        setSavingItem(true);
        await database().ref(`users/${user.uid}`).set({
          uid: user.uid,
          name: namaItem,
          role: 'ROLELESS'
        });
      } catch (e) {
        setError(e.message);
      } finally {
        setSavingItem(false);
      }
    }
  }

  const selectPhotoTapped = () => {
    setLoadingAvatar(true)
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.showImagePicker(options, response => {
      // console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let source = { uri: response.uri };

        // console.log(source)

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        setAvatarSource(source)

        const ref = firebase.storage().ref('invertase/new-logo.jpg');
        const path = response.uri
        // const path = `${firebase.utils.FilePath.DOCUMENT_DIRECTORY}/new-logo.png`;
        const task = ref.putFile(path, {
          cacheControl: 'no-store', // disable caching
        })
        .then(succ => console.log(succ))
        .catch(fail => console.log(fail))
        ;


      }
    });
    setLoadingAvatar(false)
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Title>Saving Role to Firebase {namaItem}</Title>
        <Paragraph>
          Set a custom display name for a personalized greeting.
        </Paragraph>
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Display Name"
          value={namaItem}
          onChangeText={setNamaItem}
        />
        <Button
          mode="outlined"
          loading={savingItem}
          onPress={handleItem}
          style={styles.button}>
          Save
        </Button>
      </View>
      <View>
        
        <View
          style={[styles.avatar, styles.avatarContainer, { marginBottom: 20 }]}
        >
          {avatarSource === null ? (
            <Title>Select a Photo</Title>
          ) : (
              <Image style={styles.avatar} source={avatarSource} />
            )}
        </View>
        
        <Button
          mode="outlined"
          loading={loadingAvatar}
          onPress={selectPhotoTapped}
          style={styles.button}>
          Ambil Gambar
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
    borderRadius: 75,
    width: 150,
    height: 150,
  },
});

export default AppSetting;
