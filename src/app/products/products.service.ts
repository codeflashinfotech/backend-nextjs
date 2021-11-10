import {
  BadRequestException,
  Inject,
  Injectable,
  Scope,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AWSConfigService } from 'src/config/aws/config.service';
import { VendorProviderService } from 'src/providers/vendors/vendors.service';
import {
  DeleteResult,
  getManager,
  InsertResult,
  Repository,
  UpdateResult,
} from 'typeorm';

import { FileInterface } from '../../shared/module/upload/upload.interface';
import { UploadService } from '../../shared/module/upload/upload.service';
import { ShoppingListsService } from '../shopping-lists/shopping-lists.service';
import { Hub } from '../systems/entities/hub.entity';
import { ShoppingListProduct } from '../systems/entities/shopping-list-products.entity';
import { AddProductToCartCommand } from './cqrs/commands/impl/add-product-to-cart.command';
import {
  AddVendorsToCartDto,
  CreateFavoriteProductDto,
  CreateNewProductFailureDto,
  GetSensorProductStatusResponseDto,
  GetSensorsProductsResponseDto,
  SearchVendorDto,
  SearchVendorResultDto,
  UpdateCustomProductBodyDto,
  UpdateProductBodyDTO,
} from './dto';
import { CustomFoods } from './entities/custom-foods.entity';
import { FavoriteFoods } from './entities/favorite.foods.entity';
import {
  CreateNewProductErrorMsgEnum,
  CreateNewProductErrorStatusEnum,
  ResetProductInitialWeightErrorMsgEnum,
  ResetProductInitialWeightErrorStatusEnum,
  SearchVendorBadReqMsgEnum,
  SearchVendorErrorMsgEnum,
  SearchVendorErrorStatusEnum,
  UpdateProductErrorMsgEnum,
  UpdateProductErrorStatusEnum,
} from './products.enum';

import * as _ from 'lodash';
import { CommandBus } from '@nestjs/cqrs';
import { RemoveProductFromShoppingListCommand } from './cqrs/commands/impl/remove-product-from-shopping-list.command';
import { REQUEST } from '@nestjs/core';
import { BuyProductOnInMyPantryCommand } from './cqrs/commands/impl/buy-product-on-in-my-pantry.command';
import { BuyProductOnShoppingListCommand } from './cqrs/commands/impl/buy-product-on-shopping-list.command';
import { RemoveProductFromScaleCommand } from './cqrs/commands/impl/remove-product-from-scale.command';
import { AddProductToScaleCommand } from './cqrs/commands/impl/add-product-to-scale.command';
import { AddProductToFavoriteCommand } from './cqrs/commands/impl/add-product-to-favorite.command';
import to from 'await-to-js';
import { UnitConvert } from '../../shared/utils/unit-convert.util';
import { HttpLoggerService } from '../../shared/module/logger/http-logger.service';
import { SensorProductsListService } from '../../shared/module/sensor-products-list/sensor-products-list.service';
import { SettingsConfigService } from 'src/config/settings/config.service';
import { ShoppingList } from '../systems/entities/shopping-list.entity';
import { ShoppingListHub } from '../systems/entities/shopping-list-hub.entity';

//Types
type ImagePath = { ImageURL: string };
@Injectable({ scope: Scope.REQUEST })
export class ProductsService {
  private productBucket: string = this.awsConfigService.S3_PRODUCT_IMAGE_BUCKET;

  /**
   * return weight on grams unit
   */
  private productWeightLimit = 300;
  constructor(
    @InjectRepository(Hub)
    private hubsRepository: Repository<Hub>,
    @InjectRepository(ShoppingListProduct)
    private shoppingListProductRepo: Repository<ShoppingListProduct>,
    @InjectRepository(CustomFoods)
    private customFoodRepo: Repository<CustomFoods>,
    @InjectRepository(FavoriteFoods)
    private favoriteFoodsRepository: Repository<FavoriteFoods>,
    private shoppinglistService: ShoppingListsService,
    private uploadService: UploadService,
    private awsConfigService: AWSConfigService,
    private vendorProviderService: VendorProviderService,
    private unitConvert: UnitConvert,
    private logger: HttpLoggerService,
    private commandBus: CommandBus,
    private sensorProductListService: SensorProductsListService,
    private settingConfig: SettingsConfigService,
    @Inject(REQUEST) private request,
  ) {}

  /**
   * upload images to s3
   * @param {FileInterface} file file you want to upload
   * */
  private async uploadFile(file: FileInterface): Promise<ImagePath> {
    const uploadResult = await this.uploadService.uploadToS3({
      Bucket: this.productBucket,
      Body: file.buffer,
      Key: this.uploadService.uniqueFileName(file.originalname),
    });
    return { ImageURL: uploadResult.Key };
  }

  /**
   * @controllerService
   * @desc find list of hubs and it's shoppingListHubs and hubDataLatest based on familyId
   * @param {number} familyId id of the family
   * @param {number} ShowByStatus if 0 then returns all products, otherwise returns based on "Need to buy" and "In Good Shape"
   * @returns {Promise} of GetSensorsProductsResponseDto
   */
  async findSensorsProducts(
    familyId,
    ShowByStatus = 0,
  ): Promise<GetSensorsProductsResponseDto> {
    const hubs = await this.getLastetScaleDataByUserId(familyId);
    return this.getHubsWithDetails(hubs, ShowByStatus);
  }

  /**
   * @controllerService
   * @desc find list of hubs and it's products which are running low or needed
   * @param {number} familyId id of the family
   * @param {number} ShowByStatus if 0 then returns all products, otherwise returns based on "Need to buy" and "In Good Shape"
   * @returns {Promise} of ShoppingList[]
   */
  async findRunningLowProducts(familyId) {
    const hubs = await this.getLastetScaleDataByUserId(familyId);
    return this.getHubsRunningLowWithDetails(hubs);
  }

  async getLastetScaleDataByUserId(familyId): Promise<Hub[]> {
    const hubs = await this.hubsRepository
      .createQueryBuilder('hub')
      .leftJoinAndSelect(
        'hub.shoppingListHubs',
        'shoppingListHubs',
        'shoppingListHubs.HubAppId = hub.HubAppId',
      )
      .leftJoinAndSelect(
        'hub.hubDataLatests',
        'hubDataLatests',
        'hubDataLatests.HubAppId = hub.HubAppId',
      )
      .where('hub.familyId = :familyId', { familyId: familyId })
      .andWhere('hub.HubActive = 1')
      .getMany();
    return hubs;
  }

  getAllSensorsColorObj() {
    const OrderByCommonObj = {
      showAsScales: false,
      scalesReporting: 0,
      ImagePrevList: [],
      SortOrder: 1,
      showRefresh: false,
      isRefreshing: false,
      isShowListRefreshing: false,
      ProductList: [],
      visible: 'collapse',
    };
    const ShowByNoStatusList = {
      ...OrderByCommonObj,
      ShoppingListId: '-100',
      HubId: -100,
      Name: 'Your Products',
    };
    const OrderByRed = {
      ...OrderByCommonObj,
      ShoppingListId: '-100',
      HubId: -100,
      Name: 'Need to Buy',
    };
    const OrderByOrange = {
      ...OrderByCommonObj,
      ShoppingListId: '-101',
      HubId: -101,
      Name: 'Running Low',
    };
    const OrderByGreen = {
      ...OrderByCommonObj,
      ShoppingListId: '-103',
      HubId: -103,
      Name: 'In Good Shape',
    };
    const OrderByOther = {
      ...OrderByCommonObj,
      ShoppingListId: '-104',
      HubId: -104,
      Name: 'Other',
    };
    return {
      ShowByNoStatusList: ShowByNoStatusList,
      OrderByRed: OrderByRed,
      OrderByOrange: OrderByOrange,
      OrderByGreen: OrderByGreen,
      OrderByOther: OrderByOther,
    };
  }

  getRunningLowColorObj() {
    const OrderByCommonObj = {
      showAsScales: false,
      scalesReporting: 0,
      ImagePrevList: [],
      SortOrder: 1,
      ShowIcons: true,
      showRefresh: true,
      isRefreshing: false,
      isShowListRefreshing: false,
      ProductList: [],
      visible: 'collapse',
    };
    const OrderByRed = {
      ...OrderByCommonObj,
      ShoppingListId: '-102',
      HubId: -1,
      Name: 'Needed',
    };
    const OrderByOrange = {
      ...OrderByCommonObj,
      ShoppingListId: '-101',
      HubId: -1,
      Name: 'Running Low',
    };
    return {
      OrderByRed: OrderByRed,
      OrderByOrange: OrderByOrange,
    };
  }

  async getHubsRunningLowWithDetails(hubs) {
    const FinalList = [];
    const { OrderByRed, OrderByOrange } = this.getRunningLowColorObj();
    let neededCount = 0;
    let runningLowCount = 0;
    let products = [];
    const needed = _.cloneDeep(OrderByRed),
      runningLow = _.cloneDeep(OrderByOrange);

    for (const hub of hubs) {
      const shoppingListId = hub.shoppingListHubs[0].Id;
      const AppHubName = hub.AppHubName;
      products = await this.sensorProductListService.getAllSensorsProducts(
        AppHubName,
        'SLP.ShoppingListId = :shoppingListId',
        {
          shoppingListId,
        },
      );
      const ScaleImageList = [];
      for (const product of products) {
        const objImage = { ImageURL: product.ImageURL };
        ScaleImageList.push(objImage);
        if (product.AddToFMPantry == 2) {
          neededCount++;
          needed.ProductList.push(product);
          needed.ImagePrevList.push(objImage);
        } else if (product.AddToFMPantry == 1) {
          runningLowCount++;
          runningLow.ProductList.push(product);
          runningLow.ImagePrevList.push(objImage);
        }
      }
    }

    if (neededCount != 0) {
      needed.scalesReporting = neededCount;
      FinalList.push(needed);
    }

    if (runningLowCount != 0) {
      runningLow.scalesReporting = runningLowCount;
      FinalList.push(runningLow);
    }
    const GoodShape = neededCount + runningLowCount;
    return {
      ScaleList: FinalList,
      GoodShape: GoodShape,
      LocalData: false,
    };
  }

  async getHubsWithDetails(hubs, ShowByStatus) {
    const FinalList = [];
    const {
      ShowByNoStatusList,
      OrderByRed,
      OrderByOrange,
      OrderByGreen,
      OrderByOther,
    } = this.getAllSensorsColorObj();

    let rowcount = 0;
    let rowcountRed = 0;
    let rowcountOrange = 0;
    let rowcountGreen = 0;
    let rowcountOther = 0;
    let rowcountNoStatusList = 0;
    let totalHubs = 0;
    let products = [];

    for (const hub of hubs) {
      const shoppingListid = hub.shoppingListHubs[0].Id;
      const hubId = hub.Id;
      const AppHubName = hub.AppHubName;
      products = await this.sensorProductListService.getAllSensorsProducts(
        AppHubName,
        'SLP.ShoppingListId = :shoppingListId',
        {
          shoppingListId: shoppingListid,
        },
      );
      totalHubs++;
      const ScaleImageList = [];
      rowcount = 0;
      for (const product of products) {
        rowcount++;
        const objImage = { ImageURL: product.ImageURL };
        if (product.ImageURL != '~/assets/images/appicons/search.png') {
          ScaleImageList.push(objImage);
        }
        rowcountNoStatusList++;
        if (ShowByStatus == 1) {
          if (product.ScaleClassName == 'red') {
            rowcountRed++;
            OrderByRed.ProductList.push(product);
            if (product.ImageURL != '~/assets/images/appicons/search.png') {
              OrderByRed.ImagePrevList.push(objImage);
            }
          } else if (product.ScaleClassName == 'orange') {
            rowcountOrange++;
            OrderByOrange.ProductList.push(product);
            if (product.ImageURL != '~/assets/images/appicons/search.png') {
              OrderByOrange.ImagePrevList.push(objImage);
            }
          } else if (product.ScaleClassName == 'green') {
            rowcountGreen++;
            OrderByGreen.ProductList.push(product);
            if (product.ImageURL != '~/assets/images/appicons/search.png') {
              OrderByGreen.ImagePrevList.push(objImage);
            }
          } else {
            rowcountOther++;
            OrderByOther.ProductList.push(product);
            if (product.ImageURL != '~/assets/images/appicons/search.png') {
              OrderByOther.ImagePrevList.push(objImage);
            }
          }
        } else {
          ShowByNoStatusList.ProductList.push(product);
          if (product.ImageURL != '~/assets/images/appicons/search.png') {
            ShowByNoStatusList.ImagePrevList.push(objImage);
          }
        }
      }

      const GroupByHub = {
        showAsScales: true,
        ShoppingListId: shoppingListid,
        scalesReporting: rowcount,
        ImagePrevList: ScaleImageList,
        HubId: hubId,
        SortOrder: 1,
        Name: AppHubName,
        showRefresh: true,
        isRefreshing: false,
        isShowListRefreshing: false,
        ProductList: products,
        visible: 'collapse',
        HubCreation: hub.HubCreation,
        HubIP: hub.HubIP,
        WifiName: hub.WifiName,
      };
      FinalList.push(GroupByHub);
    }

    if (rowcountRed != 0) {
      OrderByRed.scalesReporting = rowcountRed;
      FinalList.push(OrderByRed);
    }
    if (rowcountOrange != 0) {
      OrderByOrange.scalesReporting = rowcountOrange;
      FinalList.push(OrderByOrange);
    }
    if (rowcountGreen != 0) {
      OrderByGreen.scalesReporting = rowcountGreen;
      FinalList.push(OrderByGreen);
    }
    if (rowcountOther != 0) {
      OrderByOther.scalesReporting = rowcountOther;
      FinalList.push(OrderByOther);
    }
    if (rowcountNoStatusList != 0 && ShowByStatus != 1) {
      ShowByNoStatusList.scalesReporting = rowcountNoStatusList;
      FinalList.push(ShowByNoStatusList);
    }
    return {
      ScaleList: FinalList,
      TotalScales: rowcountNoStatusList,
      TotalHubs: totalHubs,
      UpdateType: 'DB',
      LocalData: false,
    };
  }

  /**
   * @controllerService
   * @description create a unique custom product
   * @param {Object} user authorized user detail
   * @param body body detail
   * @param {number} familyId id of family
   * @param {FileInterface} file uploaded file
   * @returns {Promise<InsertResult>} insert detail object
   */
  async create(
    user,
    body,
    familyId: number,
    file: FileInterface,
  ): Promise<InsertResult | CreateNewProductFailureDto> {
    let imageUrl: ImagePath = null;

    if (file) {
      imageUrl = await this.uploadFile(file);
    }
    const customFood = await this.customFoodRepo.findOne({
      Product_Identifier: body.Product_Identifier,
    });
    if (customFood)
      throw new UnprocessableEntityException({
        errorCode: CreateNewProductErrorStatusEnum.NotUnique,
        message: CreateNewProductErrorMsgEnum.NotUnique,
      });
    body['FoodName'] = body.Name;
    return await this.customFoodRepo.insert({
      family: { id: familyId },
      user,
      ...imageUrl,
      ...body,
    });
  }

  /**
   * @controllerService
   * @description update products
   * @param {boolean} isShoppingListItem check to know is shoppingList product (true) or default product (false) in this service consumption will update
   * if false state , Initial weight and QuantityMeasure set with custom value
   * @param familyId
   * @param {number} productId product id for find product and update it
   * @param {object} body  data of body for updating
   * @param {FileInterface} file uploaded file
   * @param isReplaced
   * @returns {Promise<ShoppingListProduct>} success message
   */
  async updateOne(
    isShoppingListItem: boolean,
    familyId: number,
    productId: number,
    body: UpdateProductBodyDTO,
    file: FileInterface,
    isReplaced = false,
  ): Promise<ShoppingListProduct | UnprocessableEntityException> {
    let imageUrl: ImagePath = null;

    const [productError, tempProduct] = await to(
      this.shoppingListProductRepo
        .createQueryBuilder('product')
        .leftJoinAndSelect(
          'ShoppingList',
          'shoppingList',
          'product.ShoppingListId=shoppingList.Id',
        )
        .leftJoinAndSelect(
          'ShoppingListHub',
          'shoppingListHub',
          'product.ShoppingListId=shoppingListHub.Id',
        )
        .where('product.Id=:productId AND product.Active=1', {
          productId: productId,
        })
        .getRawOne(),
    );
    if (!tempProduct) {
      throw new UnprocessableEntityException({
        errorCode: UpdateProductErrorStatusEnum.ProductNotFound,
        message: UpdateProductErrorMsgEnum.ProductNotFound,
      });
    }
    let product = new ShoppingListProduct();
    if (tempProduct) {
      product['shoppingList'] = new ShoppingList();
      product['shoppingListHub'] = new ShoppingListHub();
      for (const prop in tempProduct) {
        if (prop.includes('product_'))
          product[prop.replace('product_', '')] = tempProduct[prop];
        if (prop.includes('shoppingList_'))
          product['shoppingList'][prop.replace('shoppingList_', '')] =
            tempProduct[prop];
        if (prop.includes('shoppingListHub_'))
          product['shoppingListHub'][prop.replace('shoppingListHub_', '')] =
            tempProduct[prop];
      }
    }

    let shoppingListName = '';
    if (product.shoppingList.Id != null) {
      shoppingListName = product.shoppingList.Name;
    } else {
      shoppingListName = product['shoppingListHub']['AppHubName'];
    }
    delete product.shoppingList;
    delete product['shoppingListHub'];
    if (shoppingListName == null) shoppingListName = '';

    this.logger.error(
      'Error in find a product',
      productError,
      ProductsService.name,
    );

    const oldProduct: ShoppingListProduct = { ...product };

    if (!isShoppingListItem) {
      body.State = 0;

      this.logger.debug('state of replacing product', {
        isReset: product.isReset,
        isOldProduct: product.isOldProduct,
        isReplaceable: product.isReset && !product.isOldProduct,
        isProductReplaced:
          product.Product_Identifier !== body.Product_Identifier,
      });

      if (
        product.isOldProduct &&
        product.Product_Identifier !== body.Product_Identifier
      )
        throw new UnprocessableEntityException({
          errorCode:
            UpdateProductErrorStatusEnum.UnacceptableReplacementProduct,
          message: UpdateProductErrorMsgEnum.UnacceptableReplacementProduct,
        });

      if (product.isReset)
        throw new UnprocessableEntityException({
          errorCode: UpdateProductErrorStatusEnum.DeviceNotReported,
          message: UpdateProductErrorMsgEnum.DeviceNotReported,
        });

      this.logger.debug(
        'check for product weight limit when product replaceable',
        {
          productWeight: product.Weight,
          isLowerThanLimit:
            product.Weight <
            this.unitConvert.convertedWeightToDeviceWeight(
              this.productWeightLimit,
              'G',
            ),
        },
        ProductsService.name,
      );

      if (
        !product.isOldProduct &&
        product.Weight <
          this.unitConvert.convertedWeightToDeviceWeight(
            this.productWeightLimit,
            'G',
          )
      ) {
        // make is reset true because next time user should wait to sensor report to backend
        await this.shoppingListProductRepo.update(
          { Id: productId, Active: 1 },
          { isReset: true },
        );
        throw new UnprocessableEntityException({
          errorCode: ResetProductInitialWeightErrorMsgEnum.UnacceptableWeight,
          message: ResetProductInitialWeightErrorMsgEnum.UnacceptableWeight,
        });
      }
      if (!product.isOldProduct) product.InitialWeight = product.Weight;

      product.isOldProduct = true;
    }

    if (file) {
      imageUrl = await this.uploadFile(file);
    }

    Object.assign(product, body, {
      hub: { Id: body.hubId },
      ...imageUrl,
    });

    product = await this.shoppingListProductRepo.save(product);

    if (
      isShoppingListItem &&
      product.State == 0 &&
      product.hub.Id == -1 &&
      product.ScaleNumber == 0
    ) {
      const shoppingList = new ShoppingList();
      shoppingList.Name = shoppingListName;
      this.commandBus.execute(
        new RemoveProductFromShoppingListCommand(
          { ...product, shoppingList },
          this.request?.user?.id,
          familyId,
          this.request?.user?.fullName,
        ),
      );
    }

    if (
      isShoppingListItem &&
      product.State == 1 &&
      product.hub.Id != -1 &&
      product.ScaleNumber != 0
    ) {
      this.commandBus.execute(
        new BuyProductOnInMyPantryCommand(
          product,
          this.request?.user?.id,
          familyId,
        ),
      );
    }

    if (
      isShoppingListItem &&
      product.State == 1 &&
      product.hub.Id == -1 &&
      product.ScaleNumber == 0
    ) {
      const shoppingList = new ShoppingList();
      shoppingList.Name = shoppingListName;
      this.commandBus.execute(
        new BuyProductOnShoppingListCommand(
          { ...product, shoppingList },
          this.request?.user?.id,
          familyId,
          this.request?.user?.fullName,
        ),
      );
    }

    if (!isShoppingListItem && isReplaced) {
      // when product has been queried from db, hubid does not exist in the product and we add hubid according to following codes
      oldProduct.hub = new Hub();
      oldProduct.hub.Id = body.hubId;
      this.commandBus.execute(
        new RemoveProductFromScaleCommand(
          this.request?.user?.id,
          familyId,
          oldProduct,
          undefined,
        ),
      );

      this.commandBus.execute(
        new AddProductToScaleCommand(product, this.request?.user?.id, familyId),
      );
    }
    return product;
  }

  /**
   * @controllerService
   * @description remove product from shopping list (delete product)
   * @param {number} productId product id for find product and update it
   * @returns {Promise<UpdateResult>} update result detail object
   */
  async delete(productId: number, familyId: number): Promise<UpdateResult> {
    const updatedProduct = await this.shoppingListProductRepo.update(
      productId,
      { Active: 0 },
    );
    if (updatedProduct.affected > 0) {
      this.commandBus.execute(
        new RemoveProductFromScaleCommand(
          this.request?.user?.id,
          familyId,
          undefined,
          productId,
        ),
      );
    }
    return updatedProduct;
  }

  /**
   * @controllerService
   * @description get custom product list
   * @param {number} familyId family id
   * @returns {Promise<CustomFoods[]>} found custom product list
   */
  async findCustomList(familyId: number): Promise<CustomFoods[]> {
    return await this.customFoodRepo.find({
      where: { family: { id: familyId } },
      order: { Date_Created: 'DESC' },
    });
  }

  /**
   * @description make product 100 percent
   * */
  async resetInitialWeight(
    productId: number,
  ): Promise<ShoppingListProduct | UnprocessableEntityException> {
    const [productError, product] = await to(
      this.shoppingListProductRepo.findOne({
        Id: productId,
        Active: 1,
      }),
    );

    this.logger.error(
      'error in search product to reset initial weight ',
      productError,
      ProductsService.name,
    );

    if (!product) {
      throw new UnprocessableEntityException({
        errorCode: UpdateProductErrorStatusEnum.ProductNotFound,
        message: UpdateProductErrorMsgEnum.ProductNotFound,
      });
    }

    this.logger.debug(
      'check for product weight limit',
      {
        productWeight: product.Weight,
        isLowerThanLimit:
          product.Weight <
          this.unitConvert.convertedWeightToDeviceWeight(300, 'G'),
      },
      ProductsService.name,
    );

    if (
      product.Weight < this.unitConvert.convertedWeightToDeviceWeight(300, 'G')
    ) {
      throw new UnprocessableEntityException({
        errorCode: ResetProductInitialWeightErrorStatusEnum.UnacceptableWeight,
        message: ResetProductInitialWeightErrorMsgEnum.UnacceptableWeight,
      });
    }

    product.InitialWeight = product.Weight;

    this.logger.debug(
      'set product initialWeight with product weight to make product 100%',
      { initialWeight: product.InitialWeight, weight: product.Weight },
      ProductsService.name,
    );
    const [saveError, saveResult] = await to(
      this.shoppingListProductRepo.save(product),
    );

    this.logger.error(
      'error in resetting product percent (save)',
      saveError,
      ProductsService.name,
    );
    return saveResult;
  }

  /**
   * @desc Add a product to favorites
   * @param {number} userId
   * @param {CreateFavoriteProductDto} dto
   * @return {Promise} void
   */
  async addToFavorite(userId, dto: CreateFavoriteProductDto): Promise<void> {
    const insertedFood = await this.favoriteFoodsRepository.insert({
      ...dto,
      user: { id: userId },
    });
    const foodId: number = insertedFood.raw.insertId;
    this.commandBus.execute(
      new AddProductToFavoriteCommand(foodId, userId, dto.family.id),
    );
  }

  async findFavorite(condition) {
    return await this.favoriteFoodsRepository.find(condition);
  }

  async deleteFavorite(condition): Promise<DeleteResult> {
    return await this.favoriteFoodsRepository.delete(condition);
  }

  async searchVendor(
    vendor: SearchVendorDto,
  ): Promise<SearchVendorResultDto[]> {
    const { upc, term } = vendor;
    if (!upc && !term) {
      throw new BadRequestException({
        statusCode: 400,
        message: [SearchVendorBadReqMsgEnum.TermOrUpcNotExistError],
        error: 'Bad Request',
      });
    }
    try {
      return await this.vendorProviderService.searchVendor(vendor);
    } catch (error) {
      if (error.errors) {
        throw new UnprocessableEntityException({
          errorCode: SearchVendorErrorStatusEnum.SearchProductError,
          message: SearchVendorErrorMsgEnum.SearchProductError,
        });
      } else {
        return Promise.reject(error);
      }
    }
  }

  async addVendorsToCart(
    vendors: AddVendorsToCartDto[],
    providerName: string,
    familyId: number,
  ) {
    const result = await this.vendorProviderService.addVendorsToCart(
      vendors,
      familyId,
      providerName,
    );
    this.commandBus.execute(
      new AddProductToCartCommand(
        vendors,
        familyId,
        this.request.user.id,
        providerName,
      ),
    );
    return result;
  }

  async authorizeWithCode(
    code: string,
    redirect_uri: string,
    familyId: number,
    providerServiceName: string,
  ) {
    return await this.vendorProviderService.authorizeWithCode(
      code,
      redirect_uri,
      familyId,
      providerServiceName,
    );
  }

  async checkConnection(familyId: number, providerServiceName: string) {
    return await this.vendorProviderService.checkConnection(
      familyId,
      providerServiceName,
    );
  }

  async updateCustomProduct(
    body: UpdateCustomProductBodyDto,
    customProductId: number,
    familyId: number,
    file: FileInterface,
  ): Promise<UpdateResult> {
    let imageUrl = null;
    if (file) {
      const uploadResult = await this.uploadService.uploadToS3({
        Bucket: this.productBucket,
        Body: file.buffer,
        Key: this.uploadService.uniqueFileName(file.originalname),
      });
      imageUrl = { ImageURL: uploadResult.Key };
    }
    body['FoodName'] = body.Name;
    delete body.Name;
    return this.customFoodRepo.update(
      { Id: customProductId, family: { id: familyId } },
      { ...body, ...imageUrl },
    );
  }

  /**
   * make product replaceable
   * */
  async setReplacementFlag(productId: number): Promise<UpdateResult> {
    const [error, result] = await to(
      this.shoppingListProductRepo.update(
        { Id: productId, Active: 1 },
        { isOldProduct: false, isReset: true },
      ),
    );
    this.logger.error(
      'error in set replacement flags',
      error,
      ProductsService.name,
    );
    return result;
  }

  async unSetReplacementFlag(productId: number): Promise<UpdateResult> {
    const [error, result] = await to(
      this.shoppingListProductRepo.update(
        { Id: productId, Active: 1 },
        { isOldProduct: true, isReset: false },
      ),
    );
    this.logger.error(
      'error in Irreplaceable flags',
      error,
      ProductsService.name,
    );
    return result;
  }

  async getSensorProductStatus(
    productId: number,
  ): Promise<GetSensorProductStatusResponseDto> {
    const [error, result] = await to(
      this.shoppingListProductRepo.findOne(productId),
    );

    this.logger.error(
      'error in finding product for get product result',
      error,
      ProductsService.name,
    );

    const data = {
      isOldProduct: result.isOldProduct,
      isReset: result.isReset,
      isWeightAcceptable:
        result.Weight >=
        this.unitConvert.convertedWeightToDeviceWeight(
          this.productWeightLimit,
          'G',
        ),
    };

    this.logger.debug('get sensor product status', data, ProductsService.name);

    return data;
  }
}
