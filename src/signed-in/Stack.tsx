import { NavigationNativeContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Theme, withTheme } from 'react-native-paper';
import Profile from './Profile';
import Settings from './Settings';
import AppHome from '../components/Appx/AppHome';
import AppSetting from '../components/Appx/AppSetting';
import AdminListItem from '../components/Admin/ListItem';
import AdminEditItem from '../components/Admin/EditItem';
import SurveyorEditItem from '../components/Surveyor/EditItem';
import SurveyorListItem from '../components/Surveyor/ListItem';
import SAListUser from '../components/SysAdmin/ListUser';


interface Props {
  theme: Theme;
}

const Stack = createStackNavigator();

function SignedInStack({ theme }: Props) {
  return (
    <NavigationNativeContainer>
      <Stack.Navigator initialRouteName="AppHome"
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: theme.colors.accent,
        }}>
        <Stack.Screen
          name="AppHome"
          component={AppHome}
          options={{ header: null }}
        />
        <Stack.Screen name="AppSetting" component={AppSetting} />
        <Stack.Screen name="AdminEditItem" component={AdminEditItem} options={{ title: 'View' }} />
        <Stack.Screen name="AdminListItem" component={AdminListItem} options={{ title: 'List Pasien' }} />
        <Stack.Screen name="SurveyorEditItem" component={SurveyorEditItem} options={{ title: 'Edit' }} />
        <Stack.Screen name="SurveyorListItem" component={SurveyorListItem} options={{ title: 'List Pasien' }} />
        <Stack.Screen name="SAListUser" component={SAListUser} options={{ title: 'List User' }} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    </NavigationNativeContainer>
  );
}

export default withTheme(SignedInStack);
