// Create system
export enum CreateSystemErrorEnum {
  HubAppIdExist = 'HubAppIdExist',
}
export enum CreateSystemErrorMsgEnum {
  HubAppIdExist = 'HubAppId is already existed.',
}

// Delete Family System
export enum DeleteFamilySystemSuccessEnum {
  Message = 'Family system deleted successfully.',
}

// Update Family System
export enum UpdateFamilySystemSuccessEnum {
  Message = 'Family system updated successfully.',
}
// Update Family System
export enum ProcessShadowUpdateSystemSuccessEnum {
  Message = 'Shadow update Process completed',
}

export enum ProcessShadowUpdateSystemErrorEnum {
  /**
   * msg: HubNotFound
   * */
  HubNotFound = 'HubNotFound',
}
export enum ProcessShadowUpdateSystemErrorMsgEnum {
  /**
   * msg: HubNotFound
   * */
  HubNotFound = 'Unknown Hub.this hub not define in your hub list please add this hub then try again',
}
