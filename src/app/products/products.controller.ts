import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UnprocessableEntityException,
  UploadedFile,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ApiTags } from '@nestjs/swagger';
import {
  AddVendorsToCartBodyDto,
  AddVendorsToCartParamDto,
  AddVendorsToCartResponseDto,
  AuthorizeWithCodeDto,
  AuthorizeWithCodeParamDto,
  CheckConnectionParamDto,
  CheckConnectionResponseDto,
  CreateFavoriteProductDto,
  CreateFavoriteProductResponseDto,
  CreateNewProductBodyDto,
  CreateNewProductQueryDto,
  CreateNewProductResponseDto,
  DeleteFavoriteProductParamDto,
  DeleteFavoriteProductQueryDto,
  DeleteFavoriteProductResponseDto,
  DeleteProductResponseDto,
  GetFavoriteProductDto,
  GetFavoriteProductResponseDto,
  GetRunningLowProductsDto,
  GetRunningLowProductsResponseDto,
  GetSensorProductStatusResponseDto,
  GetSensorsProductsDto,
  GetSensorsProductsResponseDto,
  ResetProductInitialWeightBodyDto,
  ResetProductInitialWeightParamDto,
  ResetProductInitialWeightResponseDto,
  SearchVendorDto,
  SearchVendorResultDto,
  SetReplacementFlagBodyDto,
  SetReplacementFlagParamDto,
  SetReplacementFlagResponseDto,
  UpdateCustomProductBodyDto,
  UpdateCustomProductFailureDto,
  UpdateCustomProductParamDto,
  UpdateCustomProductQueryDto,
  UpdateCustomProductResponseDto,
  UpdateProductBodyDTO,
  UpdateProductParamDto,
  UpdateProductQueryDto,
  UpdateProductResponseDto,
} from './dto';

import {
  CreateFavoriteProductEnum,
  CreateNewProductSuccessEnum,
  DeleteFavoriteProductEnum,
  DeleteFavoriteProductErrorMsgEnum,
  DeleteFavoriteProductErrorStatusEnum,
  DeleteProductSuccessEnum,
  ResetProductInitialWeightSuccessEnum,
  SetReplacementFlagErrorMsgEnum,
  SetReplacementFlagErrorStatusEnum,
  SetReplacementFlagSuccessEnum,
  UnSetReplacementFlagErrorMsgEnum,
  UnSetReplacementFlagErrorStatusEnum,
  UpdateCustomProductErrorStatusEnum,
  UpdateCustomProductSuccessEnum,
  UpdateProductSuccessEnum,
} from './products.enum';
import {
  AddVendorsToCartDec,
  AuthorizeWithCodeDec,
  CheckConnectionDec,
  CreateCustomProductDec,
  DeleteProductDec,
  FavoriteCreateDec,
  FavoriteDeleteDec,
  FavoriteGetDec,
  GetCustomProductLisDec,
  resetProductInitialWeightDec,
  RunningLowProductsGetDec,
  SearchVendorsDec,
  SensorProductsGetDec,
  SetReplacementFlagDec,
  UnSetReplacementFlagDec,
  UpdateCustomProductDec,
  UpdateProductDec,
  GetSensorProductStatusDec,
} from './products.decorator';
import { ProductsService } from './products.service';
import { FileInterface } from '../../shared/module/upload/upload.interface';
import { HttpLoggerService } from '../../shared/module/logger/http-logger.service';

@ApiTags('products')
@Controller('v1/products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    @Inject(REQUEST) private req,
    private logger: HttpLoggerService,
  ) {}

  @Get('sensors')
  @SensorProductsGetDec()
  findSensorProducts(
    @Query() dto: GetSensorsProductsDto,
  ): Promise<GetSensorsProductsResponseDto> {
    return this.productsService.findSensorsProducts(
      dto.familyId,
      dto.showByStatus,
    );
  }

  @Get('sensor/status/:productId')
  @GetSensorProductStatusDec()
  async getSensorProductStore(
    @Param('productId') productId: number,
    @Query('familyId') familyId: number,
  ): Promise<GetSensorProductStatusResponseDto> {
    return await this.productsService.getSensorProductStatus(productId);
  }

  @Put('/initial-weight/:productId')
  @resetProductInitialWeightDec()
  async restProductInitialWeight(
    @Param() { productId }: ResetProductInitialWeightParamDto,
    @Body() bodyDto: ResetProductInitialWeightBodyDto,
  ): Promise<ResetProductInitialWeightResponseDto> {
    await this.productsService.resetInitialWeight(productId);
    return { message: ResetProductInitialWeightSuccessEnum.Message };
  }

  @Put('/:productId')
  @UpdateProductDec()
  async updateProduct(
    @Query() queryDto: UpdateProductQueryDto,
    @Param() paramDto: UpdateProductParamDto,
    @UploadedFile() file: FileInterface,
    @Body() bodyDto: UpdateProductBodyDTO,
  ): Promise<UpdateProductResponseDto> {
    await this.productsService.updateOne(
      queryDto.isShoppingListItem,
      queryDto.familyId,
      paramDto.productId,
      bodyDto,
      file,
      queryDto.isReplaced,
    );
    return { message: UpdateProductSuccessEnum.Message };
  }

  @Put('/set-replacement-flag/:productId')
  @SetReplacementFlagDec()
  async setReplacementFlag(
    @Param() { productId }: SetReplacementFlagParamDto,
    @Body() bodyDto: SetReplacementFlagBodyDto,
  ): Promise<SetReplacementFlagResponseDto> {
    const updateResult = await this.productsService.setReplacementFlag(
      productId,
    );
    if (!updateResult.affected) {
      throw new UnprocessableEntityException({
        errorCode: SetReplacementFlagErrorStatusEnum.UpdateFlagsFailure,
        message: SetReplacementFlagErrorMsgEnum.UpdateFlagsFailure,
      });
    }

    this.logger.debug('set replaceable flags', {
      isReset: true,
      isOldProduct: false,
      isReplaceable: !!updateResult.affected,
    });

    return { message: SetReplacementFlagSuccessEnum.Message };
  }

  @Put('/unset-replacement-flag/:productId')
  @UnSetReplacementFlagDec()
  async unSetReplacementFlag(
    @Param() { productId }: SetReplacementFlagParamDto,
    @Body() bodyDto: SetReplacementFlagBodyDto,
  ): Promise<SetReplacementFlagResponseDto> {
    const updateResult = await this.productsService.unSetReplacementFlag(
      productId,
    );
    if (!updateResult.affected) {
      throw new UnprocessableEntityException({
        errorCode: UnSetReplacementFlagErrorStatusEnum.UpdateFlagsFailure,
        message: UnSetReplacementFlagErrorMsgEnum.UpdateFlagsFailure,
      });
    }

    this.logger.debug('set Irreplaceable flags', {
      isReset: false,
      isOldProduct: true,
      isReplaceable: !updateResult.affected,
    });

    return { message: SetReplacementFlagSuccessEnum.Message };
  }

  @Get('running-low')
  @RunningLowProductsGetDec()
  findRunningLowProducts(
    @Query() dto: GetRunningLowProductsDto,
  ): Promise<GetRunningLowProductsResponseDto> {
    return this.productsService.findRunningLowProducts(dto.familyId);
  }

  @Delete(':productId')
  @DeleteProductDec()
  async removeProductFromShoppingList(
    @Param('productId') productId: number,
    @Query('familyId') familyId: number,
  ): Promise<DeleteProductResponseDto> {
    await this.productsService.delete(productId, familyId);
    return { message: DeleteProductSuccessEnum.Message };
  }

  @FavoriteCreateDec()
  @Post('favorite')
  async addToFavorite(
    @Body() dto: CreateFavoriteProductDto,
  ): Promise<CreateFavoriteProductResponseDto> {
    await this.productsService.addToFavorite(this.req.user.id, dto);
    return {
      message: CreateFavoriteProductEnum.Message,
    };
  }

  @FavoriteGetDec()
  @Get('favorite')
  async getFavorite(
    @Query() dto: GetFavoriteProductDto,
  ): Promise<GetFavoriteProductResponseDto[]> {
    return await this.productsService.findFavorite({ family: dto.familyId });
  }

  @FavoriteDeleteDec()
  @Delete('favorite/:favoriteId')
  async deleteFavorite(
    @Query() dto: DeleteFavoriteProductQueryDto,
    @Param() params: DeleteFavoriteProductParamDto,
  ): Promise<DeleteFavoriteProductResponseDto> {
    const deleteResult = await this.productsService.deleteFavorite({
      Id: params.favoriteId,
      family: dto.familyId,
    });
    if (!deleteResult.affected) {
      throw new UnprocessableEntityException({
        errorCode: DeleteFavoriteProductErrorStatusEnum.FavoriteNotDeleted,
        message: DeleteFavoriteProductErrorMsgEnum.FavoriteNotDeleted,
      });
    }
    return {
      message: DeleteFavoriteProductEnum.Message,
    };
  }

  @SearchVendorsDec()
  @Get('vendors')
  async searchVendor(
    @Query() vendor: SearchVendorDto,
  ): Promise<SearchVendorResultDto[]> {
    return this.productsService.searchVendor(vendor);
  }

  @Post('vendors/:vendorProvider/authorize')
  @AuthorizeWithCodeDec()
  async authorizeWithCode(
    @Body() bodyDto: AuthorizeWithCodeDto,
    @Param() paramDto: AuthorizeWithCodeParamDto,
  ) {
    const { code, redirect_uri, family } = bodyDto;
    const familyId = family.id;
    return this.productsService.authorizeWithCode(
      code,
      redirect_uri,
      Number(familyId),
      paramDto.vendorProvider,
    );
  }

  @Get('vendors/:vendorProvider/connection/:familyId')
  @CheckConnectionDec()
  async checkConnection(
    @Param() paramDto: CheckConnectionParamDto,
  ): Promise<CheckConnectionResponseDto> {
    const { vendorProvider, familyId } = paramDto;
    const message = await this.productsService.checkConnection(
      Number(familyId),
      vendorProvider,
    );
    return { message };
  }

  @Put('vendors/:vendorProvider/cart')
  @AddVendorsToCartDec()
  async addVendorsToCart(
    @Param() paramDto: AddVendorsToCartParamDto,
    @Body() bodyDto: AddVendorsToCartBodyDto,
  ): Promise<AddVendorsToCartResponseDto> {
    const message = await this.productsService.addVendorsToCart(
      bodyDto.vendors,
      paramDto.vendorProvider,
      bodyDto.family.id,
    );
    return { message };
  }

  @Get('customs')
  @GetCustomProductLisDec()
  getCustomProduct(@Query('familyId') familyId: number) {
    return this.productsService.findCustomList(familyId);
  }

  @Post('custom')
  @CreateCustomProductDec()
  async createCustomProduct(
    @Body() bodyDto: CreateNewProductBodyDto,
    @Query() queryDto: CreateNewProductQueryDto,
    @UploadedFile() file: FileInterface,
  ): Promise<CreateNewProductResponseDto> {
    await this.productsService.create(
      this.req.user,
      bodyDto,
      queryDto.familyId,
      file,
    );
    return { message: CreateNewProductSuccessEnum.Message };
  }

  @Put('custom/:customProductId')
  @UpdateCustomProductDec()
  async updateCustomProduct(
    @Query() queryDto: UpdateCustomProductQueryDto,
    @Body() bodyDto: UpdateCustomProductBodyDto,
    @Param() paramDto: UpdateCustomProductParamDto,
    @UploadedFile() file: FileInterface,
  ): Promise<UpdateCustomProductResponseDto | UpdateCustomProductFailureDto> {
    const updateResult = await this.productsService.updateCustomProduct(
      bodyDto,
      paramDto.customProductId,
      queryDto.familyId,
      file,
    );
    if (!updateResult.affected) {
      throw new UnprocessableEntityException({
        errorCode: UpdateCustomProductErrorStatusEnum.UpdateFailure,
        message: DeleteFavoriteProductErrorMsgEnum.FavoriteNotDeleted,
      });
    }
    return { message: UpdateCustomProductSuccessEnum.Message };
  }
}
