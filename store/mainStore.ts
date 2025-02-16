import { create } from 'zustand'
import Storage from 'expo-sqlite/kv-store';

const useMainStore = create((set) => ({
  theme: JSON.parse(Storage.getItemSync('application-theme')) || 'dark',
  changeTheme: () => {
    return set((state: any) => {
      let newTheme: any = state.theme;
      if (!newTheme) {
        newTheme = 'dark';
      
      } else {
        newTheme = (newTheme === 'dark') ? 'light' : 'dark';
      }
      Storage.setItem('application-theme', JSON.stringify(newTheme));
      return { theme: newTheme };
    })
  },

  currentStyleTheme: JSON.parse(Storage.getItemSync('current-style-theme')) || 'dark',
  changeCurrentStyleTheme: () => {
    return set((state: any) => {
      let newStyleTheme: any = state.currentStyleTheme;
      if (!newStyleTheme) {
        newStyleTheme = 'dark';
      
      } else {
        newStyleTheme = (newStyleTheme === 'dark') ? 'light' : 'dark';
      }
      
      Storage.setItem('current-style-theme', JSON.stringify(newStyleTheme));
      return { currentStyleTheme: newStyleTheme };
    })
  },
  logInForm: {
    status: 'off',
    email: '',
    password: '',
    errorMessage: ''
  },
  updateLogInForm: (value: any) => {
    return set((state: any) => {
      return { logInForm: { ...state.logInForm, ...value } }
    });
  },
  signUpForm: {
    status: 'off',
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false,
    errorMessage: '',
  },
  updateSignUpForm: (value: any) => {
    return set((state: any) => {
      return { signUpForm: { ...state.signUpForm, ...value } }
    });
  },
  networkStatus: {},
  updateNetworkStatus: (value: any) => {
    return set((state: any) => {
      return { networkStatus: value }
    });
  },
  currentActiveTab: 'storage',
  updateCurrentActiveTab: (value: any) => {
    return set((state: any) => {
      return { currentActiveTab: value }
    });
  },
  userSettingsChangePasswordForm: {
    status: 'off',
    password: '',
    confirmPassword: '',
    errorMessage: ''
  },
  updateUserSettingsChangePasswordForm: (value: any) => {
    return set((state: any) => {
      return { userSettingsChangePasswordForm: { ...state.userSettingsChangePasswordForm, ...value } };
    })
  },

  activeTab: 'storage',
  updateActiveTab: (value: any) => {
    return set((state: any) => {
      return { activeTab: value }
    });
  },
  userSettingsChangePasswordForm: {
    status: 'off',
    password: '',
    confirmPassword: '',
    message: ''
  },
  updateUserSettingsChangePasswordForm: (value: any) => {
    return set((state: any) => {
      return { userSettingsChangePasswordForm: { ...state.userSettingsChangePasswordForm, ...value } };
    })
  },
  resetUserSettingsChangePasswordForm: () => {
    return set(() => {
      return { userSettingsChangePasswordForm: { status: 'off', password: '', confirmPassword: '', message: '' } }
    })
  },
  insights: {
    filesUploaded: 0,
    fileTypesDataset: [],
  },
  updateInsights: (value: any) => {
    return set((state: any) => {
      return { insights: { ...state.insights, ...value } };
    });
  },

  storageTab: {
    resourceUrl: JSON.parse(Storage.getItemSync('application-insights-resource-url')) || '',
    resourceUri: JSON.parse(Storage.getItemSync('application-insights-resource-uri')) || '',
    loadingStatus: 'loading',
    errorMessage: ''
  },
  updateStorageTab: (value: any) => {
    return set((state: any) => {
      Storage.setItem('application-insights-resource-url', JSON.stringify(value.resourceUrl));
      Storage.setItem('application-insights-resource-uri', JSON.stringify(value.resourceUri));
      return { storageTab: { ...state.storageTab, ...value } }
    })
  }
}))

export default useMainStore;
