import dayjs from 'dayjs';
import React, { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Avatar,
  Caption,
  FAB,
  Headline,
  Divider,
  Subheading,
  Theme,
  Title,
  withTheme,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationParams } from 'react-navigation';
import { UserContext } from '../../App';
import BottomNavigation, {
  FullTab,
} from 'react-native-material-bottom-navigation'
import AppProfile from '../../signed-in/Profile';
import AppSetting from './AppSetting';
import AppMain from './AppMain';
import TMListItem from '../Surveyor/ListItem';
// import AppHowTo1 from '../Appx/AppHowto1';

interface Props {
  theme: Theme;
  navigation: NavigationParams;
}


function AppHome({ theme, navigation }: Props) {
  const user = useContext(UserContext);
  // const userRole = useContext(UserRoleContext)
  const [activeTab, setactiveTab] = useState('appHome')

  if (!user) {
    return null;
  }

  const tabs = [
    {
      key: 'appHome',
      icon: 'home',
      label: 'Home',
      barColor: '#388E3C',
      pressColor: 'rgba(255, 255, 255, 0.16)'
    },
    // {
    //   key: 'movies-tv',
    //   icon: 'movie',
    //   label: 'Movies & TV',
    //   barColor: '#B71C1C',
    //   pressColor: 'rgba(255, 255, 255, 0.16)'
    // },
    {
      key: 'appProfile',
      icon: 'account',
      label: 'Profile',
      barColor: '#E64A19',
      pressColor: 'rgba(255, 255, 255, 0.16)'
    }
  ]

  const renderIcon = icon => ({ isActive }) => (
    <Icon size={24} color="white" name={icon} />
  )

  const renderTab = ({ tab, isActive }) => (
    <FullTab
      isActive={isActive}
      key={tab.key}
      label={tab.label}
      renderIcon={renderIcon(tab.icon)}
    />
  )

  const handleTabPress = (newTab, oldTab) => {
    setactiveTab(newTab.key)
  }

  return (
    <View style={styles.container}>
      {activeTab === 'appHome' && <AppMain navigation={navigation} />}
      {/* {activeTab === 'movies-tv' && <TMListItem navigation={navigation} />} */}
      {activeTab === 'appProfile' && <AppProfile theme={theme} navigation={navigation} />}
      <BottomNavigation
        activeTab={activeTab}
        onTabPress={handleTabPress}
        renderTab={renderTab}
        tabs={tabs}
        useLayoutAnimation={true}
      />
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

export default withTheme(AppHome);
