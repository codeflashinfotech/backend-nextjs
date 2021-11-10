import { AuthorizeWithCodeResponseDto } from 'src/app/products/dto';

export interface IVendors {
  /**
   * generate token from api
   * */
  getToken?(extra?: any, grant_type?: string): Promise<any>;

  /**
   * search vendor with given search words
   * */
  searchVendor(vendor: ISearchVendor): Promise<ISearchVendorsResult[]>;

  /**
   *
   * @param vendors
   * @param token
   * @param providerServiceName
   * add given vendors to cart by token
   */
  addVendorsToCart(
    vendors: IAddVendorsToCart[],
    familyId: number,
    providerServiceName?: string,
  ): Promise<any>;

  authorizeWithCode(
    code: string,
    redirect_uri: string,
    familyId: number,
    providerServiceName?: string,
  ): Promise<AuthorizeWithCodeResponseDto>;

  checkConnection(
    familyId: number,
    providerServiceName?: string,
  ): Promise<boolean>;
}

export interface ISearchVendor {
  term?: string;
  upc?: string;
}

export interface ISearchVendorsResult {
  /**
   * image url of product
   * @example 'https://www.kroger.com/product/images/large/front/0085000917305'
   * */
  product_image_url: string;

  /**
   * name of product
   * @example 'RxSugar Nutritious Sugar Sticks 30 Count'
   * */
  product_name: string;

  /**
   * api used for searching product
   * @example 'Kroger'
   * */
  data_source: string;

  /**
   * id of product
   * @example '0085000917305'
   * */
  product_id: string;

  /**
   * nutrients in food of product
   * */
  food: Array<unknown>;

  /**
   * store of product
   * */
  store: string;

  /**
   * price of product
   * */
  price: string;
}

export interface IAddVendorsToCart {
  upc: string;
  quantity: number;
}
