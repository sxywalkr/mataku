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
  withTheme,
  Button,
  ActivityIndicator,
  Paragraph,
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

function ListUser({ theme, navigation }: Props) {
  const user = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  // const [userRole, setUserRole] = useState('')

  if (!user) {
    return null;
  }

  useEffect(() => {
    // Create reference
    const ref = database().ref(`users`);
    ref.on('value', onSnapshot);
    return () => { ref.off()  }
  }, [items]);

  function onSnapshot(snapshot) {
    const list = [];
    snapshot.forEach(item => {
      list.push({
        key: item.val().userUid,
        ...item.val(),
      });
    });
    setItems(list);
    setLoading(false);
  }

  function onChangeRole(p) {
    const ref = database().ref(`users/${p.userUid}`);
    if (p.userRole === 'ROLELESS') {
      ref.update({ userRole: 'Surveyor' })
    } else if (p.userRole === 'Surveyor') {
      ref.update({ userRole: 'Admin' })
    } else if (p.userRole === 'Admin') {
      ref.update({ userRole: 'ROLELESS' })
    }
  }


  if (loading) {
    return <ActivityIndicator style={styles.container} animating={true} />;
  }

  return (
    <View style={styles.container} >
      <FlatList data={items} renderItem={({ item }) =>
        <View style={styles.lists}>
          <Title>{item.userName}</Title>
          <Paragraph>{item.userPuskesmas}</Paragraph>
          { item.userRole !== 'System Admin' && 
          <Button mode='outlined' style={styles.button} onPress={() => onChangeRole(item)}>{item.userRole}</Button>
          }
        </View>
      } />
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
    marginHorizontal: -20,
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
  lists: {
    backgroundColor: '#F6F7F8',
    elevation: 4,
    flexDirection: 'column',
    // justifyContent: 'space-evenly',
    marginVertical: 4,
    paddingHorizontal: 3,
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

export default withTheme(ListUser);
