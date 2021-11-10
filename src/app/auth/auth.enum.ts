// Signup
export enum SignupErrorEnum {
  DuplicateEmail = 'DuplicateEmail',
  EmailSentFail = 'EmailSentFail',
}

export enum SignupErrorMsgEnum {
  DuplicateEmail = 'Email already exists.',
  EmailSentFail = 'Unable to send email from server.',
}

export enum LoginErrorEnum {
  PasswordNotset = 'PasswordNotSet',
}

export enum LoginErrorMsgEnum {
  PasswordNotset = 'Password has not been set. Please login with one of the social buttons or use forget password to set password',
}

export enum SignupSuccessEnum {
  Message = 'Signup done. Confirmation code sent to the email.',
}

// Signup Confirm
export enum SignupConfirmErrorEnum {
  CodeNotValid = 'CodeNotValid',
  AlreadyConfirmed = 'AlreadyConfirmed',
}

export enum SignupConfirmErrorMsgEnum {
  CodeNotValid = 'Confirm Code is not valid.',
  AlreadyConfirmed = 'Email is already confirmed.',
}

// Forget Password
export enum ForgetPassErrorEnum {
  EmailNotFound = 'EmailNotFound',
  EmailSentFail = 'EmailSentFail',
}

export enum ForgetPassErrorMsgEnum {
  EmailNotFound = 'Email is not found or not confirmed yet.',
  EmailSentFail = 'Unable to send email from server.',
}

export enum ForgetPassSuccessEnum {
  Message = 'Forget pass done. Confirmation code sent to the email.',
}

// Forget Password Confirm
export enum ForgetpassConfirmErrorEnum {
  CodeNotValid = 'CodeNotValid',
}

export enum ForgetpassConfirmErrorMsgEnum {
  CodeNotValid = 'Confirm Code is not valid.',
}

export enum ForgetPassConfirmSuccessEnum {
  Message = 'Password changed. Please login with new password.',
}

// OAuth
export enum OAuthErrorEnum {
  InvalidToken = 'InvalidToken',
}

export enum OAuthErrorMsgEnum {
  InvalidToken = 'Unable to verify the account.',
}

export enum SocialOAuthProvidersEnum {
  GOOGLE = 'googleProviderService',
  FACEBOOK = 'facebookProviderService',
  APPLE = 'appleProviderService',
}

export enum SocialOAuthNamesEnum {
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  APPLE = 'apple',
}
