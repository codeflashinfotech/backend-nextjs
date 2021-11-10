export enum FamilyRole {
  Admin = 'Admin',
  User = 'User',
}

// Assign Family Member (After add user in manage family)
export enum AssignFamilyMemberSuccessEnum {
  Message = 'Family member assigned to family successfully.',
}
export enum AssignFamilyMemberErrorEnum {
  AssignmentDuplicate = 'AssignmentDuplicate',
}
export enum AssignFamilyMemberErrorMsgEnum {
  AssignmentDuplicate = 'Assign member to family has already done.',
}

// Update My Family (accept invitation)
export enum UpdateMyFamilyMemberSuccessEnum {
  Message = 'Family member updated successfully.',
}

// Delete Family Member
export enum DeleteFamilyMemberSuccessEnum {
  Message = 'Family member deleted successfully.',
}

// Invite User to Family
export enum InviteFamilySuccessEnum {
  Message = 'User invited to family successfully.',
}
export enum InviteFamilyErrorEnum {
  UserNotExist = 'UserNotExist',
  AlreadyInvited = 'AlreadyInvited',
  EmailSentFail = 'EmailSentFail',
}
export enum InviteFamilyErrorMsgEnum {
  UserNotExist = 'The user does not exist.',
  AlreadyInvited = 'This user has already invited to the family.',
  EmailSentFail = 'Unable to send email from server.',
}
