export function translateErrors(errCode) {
  switch (errCode.toString()) {
    //login
    case "Logging in the user failed. com.google.firebase.auth.FirebaseAuthInvalidUserException: There is no user record corresponding to this identifier. The user may have been deleted.": {
      return "Nie znaleziono użytkownika";
    }
    case "Logging in the user failed. com.google.firebase.auth.FirebaseAuthInvalidCredentialsException: The password is invalid or the user does not have a password.": {
      return "Błędne hasło";
    }
    case "Logging in the user failed. com.google.firebase.auth.FirebaseAuthInvalidCredentialsException: The email address is badly formatted.": {
      return "Błędny format email";
    }
    //register
    case "Creating a user failed. com.google.firebase.auth.FirebaseAuthUserCollisionException: The email address is already in use by another account.": {
      return "Email jest zajęty";
    }
    case "Creating a user requires an email and password argument": {
      return "Wymagany adres e-mail i hasło";
    }
    case "Creating a user failed. Password should be at least 6 characters": {
      return "Hasło musi składać się z co najmniej 6 znaków";
    }
    case "Creating a user failed. com.google.firebase.auth.FirebaseAuthInvalidCredentialsException: The email address is badly formatted.": {
      return "Błędny format email";
    }
    //updates
    case "Updating email failed. com.google.firebase.auth.FirebaseAuthInvalidCredentialsException: The email address is badly formatted.": {
      return "Niepoprawny format nowego adresu e-mail!";
    }
    case "Updating email failed. com.google.firebase.auth.FirebaseAuthUserCollisionException: The email address is already in use by another account.": {
      return "Podany adres e-mail jest już zajęty!";
    }
    case "Auth type PASSWORD requires an 'passwordOptions.email' and 'passwordOptions.password' argument": {
      return "Zmiana adresu e-mail lub hasła wymaga podania aktualnego hasła!";
    }
    case "com.google.firebase.auth.FirebaseAuthInvalidCredentialsException: The password is invalid or the user does not have a password.": {
      return "Podano niepoprawne aktualne hasło!";
    }

    //too many failed auth requests
    case "com.google.firebase.FirebaseTooManyRequestsException: We have blocked all requests from this device due to unusual activity. Try again later. [ Access to this account has been temporarily disabled due to many failed login attempts." +
      " You can immediately restore it by resetting your password or you can try again later. ]": {
      return "Zbyt dużo nieudanych prób logowania! Spróbuj później!";
    }
    case "Logging in the user failed. com.google.firebase.FirebaseTooManyRequestsException: We have blocked all requests from this device due to unusual activity. Try again later. [ Access to this account has been temporarily disabled due to" +
      " many failed login attempts. You can immediately restore it by resetting your password or you can try again later. ]": {
      return "Zbyt dużo nieudanych prób logowania! Spróbuj później!";
    }
    //default
    default: {
      return "Autoryzacja nieudana";
    }
  }
}
