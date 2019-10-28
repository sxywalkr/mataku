import dayjs from 'dayjs';
import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, ScrollView } from 'react-native';
import {
  Avatar,
  Caption,
  FAB,
  Headline,
  Subheading,
  Theme,
  Title,
  Text,
  Paragraph,
  withTheme,
  Button,
  ActivityIndicator,
} from 'react-native-paper';
import database from '@react-native-firebase/database';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationParams } from 'react-navigation';
import { UserContext } from '../../App';
import Hero from '../Hero';
import { getProviders } from '../../util/helpers';

interface Props {
  theme: Theme;
  navigation: NavigationParams;
}

function ListItem({ theme, navigation }: Props) {
  const user = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  if (!user) {
    return null;
  }

  useEffect(() => {
    // Create reference
    const ref = database().ref(`dbPasien`);
    ref
      .orderByChild('tmUid').equalTo(user.uid)
      .once('value', onSnapshot);
  }, [items]);

  function onSnapshot(snapshot) {
    const list = [];
    snapshot.forEach(item => {
      if (item.val().itemFlag === 'Item di register') {
        list.push({
          key: item.val().itemUid,
          ...item.val(),
        });
      }
    });
    setItems(list);
    setLoading(false);
  }

  function onSubmit(p) {
    const ref = database().ref(`dbPasien/${p.itemUid}`).update({
      itemFlag: 'Item di submit'
    })
  }

  if (loading) {
    return <ActivityIndicator style={styles.container} animating={true} />;
  }

  return (
    <View style={styles.container} >
      <FlatList data={items} renderItem={({ item }) =>
        <View style={styles.lists}>
          <Title>{item.itemNama}</Title>
          <Paragraph>{item.itemKabupaten} / {item.itemKecamatan} / {item.itemDesaKelurahan} / {item.itemPuskesmas}</Paragraph>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <Button mode='outlined' style={styles.button}
              onPress={() => navigation.navigate('SurveyorEditItem', { q: 'Ubah Data', r: item })}>Detail</Button>
            <Button mode='outlined' style={styles.button}
              onPress={() => onSubmit(item)}>Submit Data Ke Admin</Button>
          </View>
        </View>
      } />
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // position: 'relative',
    backgroundColor: '#fff',
  },
  content: {
    marginHorizontal: -20,
    // marginBottom: 50,
    // flex: 1,
  },
  lists: {
    backgroundColor: '#F6F7F8',
    elevation: 4,
    flexDirection: 'column',
    // justifyContent: 'space-evenly',
    marginVertical: 4,
    paddingHorizontal: 3,
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
  button: {
    alignSelf: 'center',
    marginVertical: 20,
  },
  center: {
    width: '100%',
    alignItems: 'center',
  },
});

export default withTheme(ListItem);
