export enum KrogerUnauthorizedEnum {
  TOKEN_NOT_DEFINED = 'TOKEN_NOT_DEFINED',
  REFRESH_TOKEN_EXPIRED = 'RFERESH_TOKEN_EXPIRED',
  KROGER_UNAVALABLE = 'KROGER_UNAVALABLE',
}

export enum KrogerUnauthorizedMsgEnum {
  TOKEN_NOT_DEFINED = 'Token not defined, Please login to your kroger account',
  REFRESH_TOKEN_EXPIRED = 'Refresh token expired, Please login to your kroger account',
  KROGER_UNAVALABLE = 'Kroger site is not available',
}

export enum KrogerAddToCartMsgEnum {
  PRODUCT_ADDED_TO_CART = 'Given product have been added to family cart',
}

export enum KrogerAuthorizeMsgEnum {
  TOKEN_CREATED = 'Token created',
  TOKEN_ALREADY_EXIST = 'Token already exists',
}
