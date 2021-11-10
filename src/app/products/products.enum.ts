export enum Consumptions {
  NonSelected,
  OnceAMonth,
  TwoTimesMonthly,
  ThreeTimesMonthly,
  FourTimesMonthly,
  OnceTimeWeekly,
  TwoOrThreeTimeWeekly,
  FourOrFiveTimeWeekly,
  Daily,
}

export enum CreateNewProductSuccessEnum {
  Message = 'Product Is Created',
}

export enum CreateNewProductErrorMsgEnum {
  NotUnique = 'product is created before you can not create product twice',
}

export enum CreateNewProductErrorStatusEnum {
  NotUnique = 'NotUnique',
}

export enum ResetProductInitialWeightSuccessEnum {
  Message = 'Product is 100 percent Now!',
}
export enum SetReplacementFlagSuccessEnum {
  Message = 'Now your product replaceable',
}
export enum UnSetReplacementFlagSuccessEnum {
  Message = 'You make this product irreplaceable',
}

export enum ResetProductInitialWeightErrorStatusEnum {
  /**
   * msg: UnacceptableWeight
   * */
  UnacceptableWeight = 'UnacceptableWeight',
}

export enum ResetProductInitialWeightErrorMsgEnum {
  /**
   * msg: This product weight is lower than 300g please increase product weight
   * */
  UnacceptableWeight = `This product weight is lower than 300g please increase product weight`,
}

export enum DeleteProductSuccessEnum {
  Message = 'Product Deleted',
}

export enum SearchVendorErrorStatusEnum {
  SearchProductError = 'SearchProductError',
}

export enum SearchVendorErrorMsgEnum {
  SearchProductError = 'Error in searching third party api for products',
}

export enum SearchVendorBadReqMsgEnum {
  TermOrUpcNotExistError = `Field 'term' or 'upc' must be used to request product information`,
}

export enum UpdateCustomProductSuccessEnum {
  Message = 'Custom product update successfully',
}

export enum UpdateCustomProductErrorMsgEnum {
  UpdateFailure = 'Fail to update custom product',
}

export enum UpdateCustomProductErrorStatusEnum {
  UpdateFailure = 'UpdateFailure',
}

export enum CreateFavoriteProductEnum {
  Message = 'Product added to the favorite list successfully.',
}

export enum DeleteFavoriteProductEnum {
  Message = 'Product deleted from favorite list.',
}

export enum DeleteFavoriteProductErrorStatusEnum {
  FavoriteNotDeleted = 'FavoriteNotDeleted',
}

export enum DeleteFavoriteProductErrorMsgEnum {
  FavoriteNotDeleted = 'We cant remove favorite! maybe favorite product not exist',
}

//Update product message's
export enum UpdateProductErrorStatusEnum {
  /**
   * msg: ProductNotFound
   * */
  ProductNotFound = 'ProductNotFound',

  /**
   * msg: UnacceptableReplacementProduct
   * */
  UnacceptableReplacementProduct = 'UnacceptableReplacementProduct',

  /**
   * msg: DeviceNotReported
   * */
  DeviceNotReported = 'DeviceNotReported',
}

export enum UpdateProductErrorMsgEnum {
  /**
   * msg: Product not found with this product Id
   * */
  ProductNotFound = 'Product not found with this product Id ',

  /**
   * msg: Cant replace with new product when isn't replaceable (press replace button)
   * */
  UnacceptableReplacementProduct = `Cant replace with new product when isn't replaceable (press replace button)`,

  /**
   * msg: Device Not reported yet please wait until device report to app.
   * */
  DeviceNotReported = `Device Not reported yet please wait until device report to app.`,
}

export enum UpdateProductSuccessEnum {
  /**
   * msg: Product updated
   * */
  Message = 'Product updated',
}

export enum VendorsProviderNamesEnum {
  KROGER = 'kroger',
}

export enum SetReplacementFlagErrorStatusEnum {
  /**
   * msg: UpdateFlagsFailure
   * */
  UpdateFlagsFailure = 'UpdateFlagsFailure',
}
export enum UnSetReplacementFlagErrorStatusEnum {
  /**
   * msg: UpdateFlagsFailure
   * */
  UpdateFlagsFailure = 'UpdateFlagsFailure',
}

export enum SetReplacementFlagErrorMsgEnum {
  /**
   * msg: product not set as replaceable.
   * */
  UpdateFlagsFailure = 'product not set as replaceable.',
}
export enum UnSetReplacementFlagErrorMsgEnum {
  /**
   * msg: cant restore product to Irreplaceable.
   * */
  UpdateFlagsFailure = 'cant restore product to Irreplaceable.',
}

export enum WeightStat {
  /**
   *  65534
   *  */
  Damaged = 65534,

  /**
   *  65535
   *  */
  NotSetup = 65535,
}

export enum FMPantry {
  RunningLow = 1,
  Needed = 2,
  OutOfWhatINeed = -1,
  UnNamed = -2,
}
