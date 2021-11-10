import { Injectable } from '@nestjs/common';
import { AuthorizeWithCodeResponseDto } from 'src/app/products/dto';
import { KrogerProviderService } from './kroger/kroger.service';
import {
  IAddVendorsToCart,
  ISearchVendor,
  ISearchVendorsResult,
  IVendors,
} from './vendors.interface';

@Injectable()
export class VendorProviderService implements IVendors {
  constructor(private krogerProviderService: KrogerProviderService) {}
  async searchVendor(vendor: ISearchVendor): Promise<ISearchVendorsResult[]> {
    try {
      const krogerVendors = await this.krogerProviderService.searchVendor(
        vendor,
      );
      return [].concat(krogerVendors);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async addVendorsToCart(
    vendors: IAddVendorsToCart[],
    familyId: number,
    providerServiceName?: string,
  ) {
    try {
      return await this[
        `${providerServiceName}ProviderService`
      ].addVendorsToCart(vendors, familyId);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async authorizeWithCode(
    code: string,
    redirect_uri: string,
    familyId: number,
    providerServiceName?: string,
  ): Promise<AuthorizeWithCodeResponseDto> {
    try {
      return await this[
        `${providerServiceName}ProviderService`
      ].authorizeWithCode(code, redirect_uri, familyId);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async checkConnection(familyId: number, providerServiceName?: string) {
    return await this[`${providerServiceName}ProviderService`].checkConnection(
      familyId,
    );
  }
}
