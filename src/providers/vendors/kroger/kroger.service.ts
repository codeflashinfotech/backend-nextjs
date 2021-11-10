import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  OnModuleInit,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import to from 'await-to-js';
import { Buffer } from 'buffer';
import * as qs from 'qs';
import { firstValueFrom } from 'rxjs';
import { AuthorizeWithCodeResponseDto } from 'src/app/products/dto';
import { KrogerConfigService } from 'src/config/vendors/kroger/config.service';
import { Repository } from 'typeorm';
import {
  IAddVendorsToCart,
  ISearchVendor,
  ISearchVendorsResult,
  IVendors,
} from '../vendors.interface';
import { KrogerAuth } from './entities/krogerauths.entity';
import * as KrogerConsts from './kroger.const';
import {
  KrogerAddToCartMsgEnum,
  KrogerAuthorizeMsgEnum,
  KrogerUnauthorizedEnum,
  KrogerUnauthorizedMsgEnum,
} from './kroger.enum';

@Injectable()
export class KrogerProviderService implements IVendors, OnModuleInit {
  krogerToken: string;
  constructor(
    private krogerConfigService: KrogerConfigService,
    private httpService: HttpService,
    @InjectRepository(KrogerAuth)
    private krogerAuthRepository: Repository<KrogerAuth>,
  ) {}

  onModuleInit() {
    this.getToken({
      scope: 'product.compact',
      grant_type: 'client_credentials',
    });
    setInterval(() => {
      this.getToken({
        scope: 'product.compact',
        grant_type: 'client_credentials',
      });
    }, 29.5 * 60 * 1000);
  }

  async getToken(tokenInfo?: any): Promise<any> {
    try {
      const data: string = qs.stringify(tokenInfo);
      const authorizeUrl = `${KrogerConsts.krogerBaseUrl}${KrogerConsts.krogerAuthorizePath}`;
      const Authorization = `Basic ${Buffer.from(
        `${this.krogerConfigService.CLIENT_ID}:${this.krogerConfigService.CLIENT_SECRET}`,
      ).toString('base64')}`;
      const token = await firstValueFrom(
        this.httpService.post(authorizeUrl, data, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization,
          },
        }),
      );
      if (tokenInfo.grant_type == 'client_credentials')
        this.krogerToken = token.data.access_token;

      return token;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async searchVendor(vendor: ISearchVendor): Promise<ISearchVendorsResult[]> {
    const access_token = this.krogerToken;
    const method = 'get';

    const data = qs.stringify({
      'filter.productId': vendor.upc,
      'filter.term': vendor.term,
      'filter.limit': 50,
    });

    const url = `${KrogerConsts.krogerBaseUrl}${KrogerConsts.krogerProductsPath}?${data}`;
    const Authorization = `Bearer ${access_token}`;
    const products = await firstValueFrom(
      this.httpService.request({
        method,
        url,
        headers: {
          Authorization,
        },
        validateStatus: (status: number) => status >= 200 && status <= 600,
      }),
    );
    if (products.status >= 300) {
      return Promise.reject(products.data);
    }
    const finalProducts: ISearchVendorsResult[] = [];
    for (const product of products.data.data) {
      const product_id = product.productId;
      const product_name = product.description;
      const data_source = 'Kroger';
      let product_image_url = '';
      for (const image of product.images) {
        if (image.perspective == 'front') {
          if (image.sizes.length > 1) {
            for (const size of image.sizes) {
              if (size.size == 'large') {
                product_image_url = size.url;
                break;
              }
            }
          } else if (image.sizes.length == 1) {
            product_image_url = image.sizes[0].url;
          }
          break;
        }
      }
      const tempVendor: ISearchVendorsResult = {
        product_id,
        product_name,
        data_source,
        product_image_url,
        food: [],
        price: '',
        store: '',
      };
      finalProducts.push(tempVendor);
    }
    return finalProducts;
  }

  async authorizeWithCode(
    code: string,
    redirect_uri: string,
    familyId: number,
  ): Promise<AuthorizeWithCodeResponseDto> {
    try {
      const data = {
        grant_type: 'authorization_code',
        code,
        redirect_uri,
      };

      const krogerToken = await this.krogerAuthRepository.findOne({
        select: ['expires_in', 'access_token', 'refresh_token'],
        where: { familyId },
      });

      if (krogerToken == undefined) {
        const drivenToken = await this.getToken(data);
        await this.insertKrogerTokenIntoDb(drivenToken, familyId);
        return { message: KrogerAuthorizeMsgEnum.TOKEN_CREATED };
      }

      if (new Date() < new Date(Number(krogerToken.expires_in))) {
        return { message: KrogerAuthorizeMsgEnum.TOKEN_ALREADY_EXIST };
      } else {
        const drivenToken = await this.getToken(data);
        await this.insertKrogerTokenIntoDb(drivenToken, familyId);
        return { message: KrogerAuthorizeMsgEnum.TOKEN_CREATED };
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async insertKrogerTokenIntoDb(drivenToken: any, familyId: number) {
    const { refresh_token, expires_in, access_token, token_type } =
      drivenToken.data;
    const date = new Date().getTime();
    await this.krogerAuthRepository.delete({ familyId });

    await this.krogerAuthRepository.insert({
      refresh_token,
      expires_in: expires_in * 1000 + date,
      access_token,
      token_type,
      familyId,
    });
  }

  async addVendorsToCart(vendors: IAddVendorsToCart[], familyId: number) {
    try {
      const addToCartUrl = `${KrogerConsts.krogerBaseUrl}${KrogerConsts.krogerAddToCartPath}`;

      const krogerToken = await this.krogerAuthRepository.findOne({
        select: ['expires_in', 'access_token', 'refresh_token'],
        where: { familyId },
      });

      if (krogerToken == undefined) {
        throw new UnprocessableEntityException({
          errorCode: KrogerUnauthorizedEnum.TOKEN_NOT_DEFINED,
          message: KrogerUnauthorizedMsgEnum.TOKEN_NOT_DEFINED,
        });
      }

      let Authorization = `Bearer ${krogerToken.access_token}`;
      if (new Date() > new Date(Number(krogerToken.expires_in))) {
        const [error, drivenToken] = await to(
          this.getToken({
            grant_type: 'refresh_token',
            refresh_token: krogerToken.refresh_token,
          }),
        );

        if (error) {
          if (error.message.includes('400')) {
            await this.krogerAuthRepository.delete({ familyId });
            throw new UnprocessableEntityException({
              errorCode: KrogerUnauthorizedEnum.REFRESH_TOKEN_EXPIRED,
              message: KrogerUnauthorizedMsgEnum.REFRESH_TOKEN_EXPIRED,
            });
          } else {
            throw new UnprocessableEntityException({
              errorCode: KrogerUnauthorizedEnum.KROGER_UNAVALABLE,
              message: KrogerUnauthorizedMsgEnum.KROGER_UNAVALABLE,
            });
          }
        }

        await this.insertKrogerTokenIntoDb(drivenToken, familyId);
        Authorization = `Bearer ${drivenToken.data.access_token}`;
      }

      const [error, addToCartResult] = await to(
        firstValueFrom(
          this.httpService.put(
            addToCartUrl,
            { items: vendors },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization,
              },
            },
          ),
        ),
      );
      if (error)
        throw new UnprocessableEntityException({
          errorCode: KrogerUnauthorizedEnum.KROGER_UNAVALABLE,
          message: KrogerUnauthorizedMsgEnum.KROGER_UNAVALABLE,
        });
      return KrogerAddToCartMsgEnum.PRODUCT_ADDED_TO_CART;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async checkConnection(familyId: number) {
    const count = await this.krogerAuthRepository.count({
      where: { familyId },
    });

    return count == 1;
  }
}
