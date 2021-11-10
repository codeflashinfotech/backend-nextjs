import { IsOptional, IsString, MinLength } from 'class-validator';
import {
  SearchVendorErrorMsgEnum,
  SearchVendorErrorStatusEnum,
} from '../products.enum';

export class SearchVendorDto {
  /**
   * a term to search product like sugar, milk, cake, etc. please consider that the minimun length of term must be equal to 3.
   * @example 'sugar'
   * */
  @IsString()
  @MinLength(3)
  @IsOptional()
  term?: string;

  /**
   * The upc of the products(s) to return. For more than one item, the list must be comma-separated. When used, all other query parameters are ignored.please consider that the length of every upc must be equal to 13
   * @example '0001111041700'
   * */
  @IsOptional()
  @IsString()
  @MinLength(13)
  upc?: string;
}

export class SearchVendorResultDto {
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

export class SearchVendorFailureDto {
  /**
   * A short code for the error that happened.
   */
  errorCode: SearchVendorErrorStatusEnum;

  /**
   * Description for error code.
   */
  message: SearchVendorErrorMsgEnum;
}
