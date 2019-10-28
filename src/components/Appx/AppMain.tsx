import dayjs from 'dayjs';
import React, { useContext } from 'react';
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
  ActivityIndicator,
  Paragraph,
  Button,
} from 'react-native-paper';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationParams } from 'react-navigation';
import { UserContext, UserRoleContext } from '../../App';
import Hero from '../Hero';
// import { getProviders } from '../../util/helpers';
// import ListItem from '../Surveyor/ListItem';
// import SAListUser from '../SysAdmin/ListUser';
import AppHowTo1 from '../Appx/AppHowto1';

interface Props {
  theme: Theme;
  navigation: NavigationParams;
}

function AppMain({ theme, navigation }: Props) {
  const user = useContext(UserContext);
  const userRole = useContext(UserRoleContext)

  if (!user) {
    return null;
  }

  // Array of providers the the user is linked with
  // const providers = getProviders(user);

  return (
    <View style={styles.container}>
      {userRole === 'ROLELESS' ? <AppHowTo1 /> :
        <View style={styles.container}>
          <Hero
            height={120}
            colors={['rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 0.1)']}
            imageIcon={'https://firebasestorage.googleapis.com/v0/b/fbmataku.appspot.com/o/apps_assets%2Flogo1_title.png?alt=media&token=be4cab0a-3b0d-4f8c-8af5-5fcacd2e55f1'}
          />
          <View style={styles.content}>
            {/* <Headline>
              {userRole}
            </Headline>
            <Divider /> */}
            {userRole === 'System Admin' &&
              <View>
                <Title>List App User:</Title>
                <Paragraph>
                  Menampilkan list user aplikasi.
              </Paragraph>
                <Button mode="outlined" style={styles.button} onPress={() => navigation.navigate('SAListUser')}>Lihat</Button>
              </View>
            }
            {userRole === 'Admin' &&
              <View>
                <Title>List Pasien:</Title>
                <Paragraph>
                  Menampilkan list pasien yang sudah di data.
                </Paragraph>
                <Button mode="outlined" style={styles.button} onPress={() => navigation.navigate('AdminListItem')}>Lihat</Button>
              </View>
            }
            {userRole === 'Surveyor' &&
              <View>
                <Title>List Pasien:</Title>
                <Paragraph>
                  Menampilkan list pasien yang sudah di data.
                </Paragraph>
                <Button mode="outlined" style={styles.button} onPress={() => navigation.navigate('SurveyorListItem')}>Lihat</Button>
              </View>
            }
          </View>
          <AppHowTo1 />
          {userRole === 'Surveyor' &&
            <FAB
              color="#fff"
              style={[styles.fab, { backgroundColor: theme.colors.primary }]}
              icon="add-to-queue"
              onPress={() => navigation.navigate('SurveyorEditItem', { q: 'New Data', r: 'New Data' })}
            />
          }
        </View>
      }
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
  button: {
    alignSelf: 'center',
    marginVertical: 20,
  },

});

export default withTheme(AppMain);
