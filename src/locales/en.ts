import type { TranslationKeys } from './fr';

export const en: TranslationKeys = {
  // Navigation
  nav: {
    home: 'Home',
    movies: 'Movies',
    tvShows: 'TV Shows',
    myList: 'My List',
    favorites: 'Favorites',
    history: 'History',
    recommendations: 'Recommendations',
    profile: 'Profile',
  },

  // Common
  common: {
    loading: 'Loading...',
    error: 'An error occurred',
    retry: 'Retry',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    search: 'Search...',
    browseContent: 'Browse Content',
    seeAll: 'See All',
  },

  // Home page
  home: {
    trendingMovies: 'Trending movies',
    topRatedMovies: 'Top rated movies',
    trendingSeries: 'Trending series',
    topRatedSeries: 'Top rated series',
  },

  // Auth
  auth: {
    login: 'Login',
    signup: 'Sign Up',
    logout: 'Logout',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    profileName: 'Profile Name',
    optional: 'optional',
    forgotPassword: 'Forgot password?',
    noAccount: 'No account?',
    hasAccount: 'Already have an account?',
    createAccount: 'Create Account',
    signIn: 'Sign In',
    termsAgree: 'By creating an account, you agree to our Terms of Service and Privacy Policy',
  },

  // Detail page
  detail: {
    addToWatchlist: 'Add to Watchlist',
    inWatchlist: 'In Watchlist',
    addToFavorites: 'Add to Favorites',
    favorited: 'Favorited',
    readMore: 'Read more →',
    showLess: 'Show less ←',
    similar: 'Similar',
    movies: 'movies',
    series: 'series',
  },

  // Watchlist
  watchlist: {
    title: 'My Watchlist',
    empty: 'Your watchlist is empty',
    emptyMessage: 'Start adding movies and TV shows you want to watch. They\'ll appear here.',
    itemCount: (count: number) => `${count} ${count === 1 ? 'title' : 'titles'} saved to watch later`,
  },

  // Favorites
  favorites: {
    title: 'My Favorites',
    empty: 'No favorites yet',
    emptyMessage: 'Mark your favorite movies and TV shows with a heart. They\'ll appear here.',
    itemCount: (count: number) => `${count} ${count === 1 ? 'favorite' : 'favorites'}`,
  },

  // History
  history: {
    title: 'History',
    continueWatching: 'Continue Watching',
    empty: 'No history',
    emptyMessage: 'Start watching movies and TV shows. Your history will appear here.',
    clearAll: 'Clear All',
    confirmClear: 'Are you sure you want to clear all watch history?',
    itemCount: (count: number) => `${count} ${count === 1 ? 'item' : 'items'} in your watch history`,
    startWatching: 'Start Watching',
    completed: 'Completed',
    progress: 'Progress',
  },

  // Recommendations
  recommendations: {
    title: 'Recommendations',
    forYou: 'For You',
    based: 'Based on your preferences',
    empty: 'No recommendations',
    emptyMessage: 'Watch a few movies and TV shows to get personalized recommendations.',
  },

  // Profile
  profile: {
    title: 'Profile',
    subtitle: 'Manage your account settings and preferences',
    editProfile: 'Edit Profile',
    changeAvatar: 'Change avatar',
    username: 'Username',
    memberSince: 'Member since',
    saveChanges: 'Save Changes',
    saving: 'Saving...',
    updateSuccess: 'Profile updated successfully',
    updateError: 'Failed to update profile',
    avatarUpdateSuccess: 'Avatar updated successfully',
    avatarUploadError: 'Failed to upload avatar',
    preferences: 'Preferences',
    language: 'Language',
    languageDesc: 'Choose your preferred language',
    adultContent: 'Adult Content',
    adultContentDesc: 'Include adult content in search results',
    emailNotifications: 'Email Notifications',
    emailNotificationsDesc: 'Receive updates about new releases',
  },

  // Search
  search: {
    placeholder: 'Search movies & shows...',
    viewAll: 'View all results for',
    movie: 'Movie',
    tvShow: 'TV Show',
  },

  // Errors
  errors: {
    failedToLoad: 'Failed to load',
    somethingWentWrong: 'Something went wrong!',
    tryAgain: 'Please try again',
    invalidCredentials: 'Invalid credentials',
    passwordTooShort: 'Password must be at least 8 characters',
    passwordMismatch: 'Passwords do not match',
    emailInUse: 'Email is already in use',
    selectImageFile: 'Please select an image file',
    imageSizeLimit: 'Image size must be less than 2MB',
  },
};
