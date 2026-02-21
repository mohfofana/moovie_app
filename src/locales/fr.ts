export const fr = {
  // Navigation
  nav: {
    home: 'Accueil',
    catalogue: 'Catalogues',
    movies: 'Films',
    tvShows: 'Séries',
    anime: 'Animes',
    myList: 'Ma Liste',
    favorites: 'Favoris',
    history: 'Historique',
    recommendations: 'Recommandations',
    profile: 'Profil',
  },

  // Common
  common: {
    loading: 'Chargement...',
    error: 'Une erreur est survenue',
    retry: 'Réessayer',
    cancel: 'Annuler',
    save: 'Enregistrer',
    delete: 'Supprimer',
    edit: 'Modifier',
    close: 'Fermer',
    search: 'Rechercher...',
    browseContent: 'Parcourir le contenu',
    seeAll: 'Voir tout',
  },

  // Home page
  home: {
    trendingMovies: 'Films tendances',
    topRatedMovies: 'Films les mieux notés',
    trendingSeries: 'Séries tendances',
    topRatedSeries: 'Séries les mieux notées',
  },

  // Auth
  auth: {
    login: 'Connexion',
    signup: 'Inscription',
    logout: 'Déconnexion',
    email: 'Email',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    profileName: 'Nom du profil',
    optional: 'optionnel',
    forgotPassword: 'Mot de passe oublié ?',
    noAccount: 'Pas de compte ?',
    hasAccount: 'Déjà un compte ?',
    createAccount: 'Créer un compte',
    signIn: 'Se connecter',
    termsAgree: 'En créant un compte, vous acceptez nos Conditions d\'utilisation et notre Politique de confidentialité',
  },

  // Detail page
  detail: {
    addToWatchlist: 'Ajouter à la liste',
    inWatchlist: 'Dans la liste',
    addToFavorites: 'Ajouter aux favoris',
    favorited: 'Favori',
    readMore: 'Lire plus →',
    showLess: 'Réduire ←',
    similar: 'Similaires',
    movies: 'films',
    series: 'séries',
  },

  // Watchlist
  watchlist: {
    title: 'Ma Liste',
    empty: 'Votre liste est vide',
    emptyMessage: 'Commencez à ajouter des films et séries que vous voulez regarder. Ils apparaîtront ici.',
    itemCount: (count: number) => `${count} ${count === 1 ? 'titre' : 'titres'} à regarder plus tard`,
  },

  // Favorites
  favorites: {
    title: 'Mes Favoris',
    empty: 'Aucun favori pour le moment',
    emptyMessage: 'Marquez vos films et séries préférés avec un cœur. Ils apparaîtront ici.',
    itemCount: (count: number) => `${count} ${count === 1 ? 'favori' : 'favoris'}`,
  },

  // History
  history: {
    title: 'Historique',
    continueWatching: 'Continuer à regarder',
    empty: 'Aucun historique',
    emptyMessage: 'Commencez à regarder des films et séries. Votre historique apparaîtra ici.',
    clearAll: 'Tout effacer',
    confirmClear: 'Êtes-vous sûr de vouloir effacer tout l\'historique ?',
    itemCount: (count: number) => `${count} ${count === 1 ? 'élément' : 'éléments'} dans votre historique`,
    startWatching: 'Commencer à regarder',
    completed: 'Terminé',
    progress: 'Progression',
  },

  // Recommendations
  recommendations: {
    title: 'Recommandations',
    forYou: 'Pour vous',
    based: 'Basé sur vos préférences',
    empty: 'Aucune recommandation',
    emptyMessage: 'Regardez quelques films et séries pour recevoir des recommandations personnalisées.',
  },

  // Profile
  profile: {
    title: 'Profil',
    subtitle: 'Gérez vos paramètres de compte et préférences',
    editProfile: 'Modifier le profil',
    changeAvatar: 'Changer l\'avatar',
    username: 'Nom d\'utilisateur',
    memberSince: 'Membre depuis',
    saveChanges: 'Enregistrer les modifications',
    saving: 'Enregistrement...',
    updateSuccess: 'Profil mis à jour avec succès',
    updateError: 'Échec de la mise à jour du profil',
    avatarUpdateSuccess: 'Avatar mis à jour avec succès',
    avatarUploadError: 'Échec du téléchargement de l\'avatar',
    preferences: 'Préférences',
    language: 'Langue',
    languageDesc: 'Choisissez votre langue préférée',
    adultContent: 'Contenu pour adultes',
    adultContentDesc: 'Inclure le contenu pour adultes dans les résultats de recherche',
    emailNotifications: 'Notifications par email',
    emailNotificationsDesc: 'Recevoir des mises à jour sur les nouvelles sorties',
  },

  // Search
  search: {
    placeholder: 'Rechercher films et séries...',
    viewAll: 'Voir tous les résultats pour',
    movie: 'Film',
    tvShow: 'Série',
  },

  // Errors
  errors: {
    failedToLoad: 'Échec du chargement',
    somethingWentWrong: 'Une erreur s\'est produite !',
    tryAgain: 'Veuillez réessayer',
    invalidCredentials: 'Identifiants invalides',
    passwordTooShort: 'Le mot de passe doit contenir au moins 8 caractères',
    passwordMismatch: 'Les mots de passe ne correspondent pas',
    emailInUse: 'Cet email est déjà utilisé',
    selectImageFile: 'Veuillez sélectionner un fichier image',
    imageSizeLimit: 'La taille de l\'image doit être inférieure à 2 Mo',
  },
};

export type TranslationKeys = typeof fr;
