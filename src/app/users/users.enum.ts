// Gender
export enum Gender {
  Male = 'Male',
  Female = 'Female',
}

// Profile Put
export enum ProfilePutSuccessEnum {
  Message = 'Profile Updated Successfully.',
}

// Profile Avatar Delete
export enum ProfileAvatarDeleteSuccessEnum {
  Message = 'Avatar Deleted Successfully.',
}

// Profile Avatar Put
export enum ProfileAvatarPutSuccessEnum {
  Message = 'Avatar Updated Successfully.',
}
export enum ProfileAvatarPutErrorEnum {
  WrongFormat = 'WrongFormat',
}
export enum ProfileAvatarPutErrorMsgEnum {
  WrongFormat = 'File is not an image.',
}

// Create Member
export enum CreateMemberSuccessEnum {
  Message = 'User created successfully.',
}
export enum CreateMemberErrorEnum {
  DuplicateEmail = 'DuplicateEmail',
  EmailSentFail = 'EmailSentFail',
}
export enum CreateMemberErrorMsgEnum {
  DuplicateEmail = 'Email already exists.',
  EmailSentFail = 'Unable to send email from server.',
}
