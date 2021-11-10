import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, InsertResult, Repository, UpdateResult } from 'typeorm';
import { ShoppingListProduct } from '../systems/entities/shopping-list-products.entity';
import { ShoppingList } from '../systems/entities/shopping-list.entity';
import {
  AddProductToShoppingBodyDTO,
  AddProductToShoppingResponseDto,
  CreateShoppingListDto,
  CreateShoppingListDtoResponse,
  DeleteShoppingListBodyDto,
  DeleteShoppingListParamDto,
  GetShoppingListDto,
  UpdateShoppingListBodyDto,
  UpdateShoppingListParamDto,
} from './dto';
import { CreateShoppingListSuccessEnum } from './shopping-lists.enum';
import { LogsService } from '../logs/logs.service';
import { FileInterface } from '../../shared/module/upload/upload.interface';
import { UploadService } from '../../shared/module/upload/upload.service';
import { AWSConfigService } from 'src/config/aws/config.service';
import { REQUEST } from '@nestjs/core';
import { CommandBus } from '@nestjs/cqrs';
import { AddProductToShoppingListsCommand } from './cqrs/commands/impl/add-product-to-shopping-lists.command';
import { AddShoppingListCommand } from './cqrs/commands/impl/add-shopping-list.command';
import { RemoveShoppingListCommand } from './cqrs/commands/impl/remove-shopping-list.command';

@Injectable()
export class ShoppingListsService {
  private productBucket: string = this.awsConfigService.S3_PRODUCT_IMAGE_BUCKET;

  constructor(
    @InjectRepository(ShoppingList)
    private shoppingListRepo: Repository<ShoppingList>,
    @InjectRepository(ShoppingListProduct)
    private shoppingListProductRepo: Repository<ShoppingListProduct>,
    private logService: LogsService,
    private awsConfigService: AWSConfigService,
    private uploadService: UploadService,
    private commandBus: CommandBus,
    @Inject(REQUEST) private request,
  ) {}

  /**
   * @desc return list of shopping list or return null
   * @param {number} familyId  id of the family
   * @return {Promise} of ShoppingList[]
   */
  async findAll({ familyId }: GetShoppingListDto): Promise<ShoppingList[]> {
    return await this.getShoppingList(familyId);
  }

  /**
   * @desc get all Shopping list if active is 1 and match familyId and its productLis
   * @param {number} familyId  id of the family
   * @return {Promise} of ShoppingList[]
   */
  private async getShoppingList(familyId): Promise<ShoppingList[]> {
    const manager = getManager();

    const shoppingLists: ShoppingList[] = await this.shoppingListRepo
      .createQueryBuilder('SL')
      .distinct(true)
      .where('SL.Active=1 AND SL.FamilyId=:familyId', {
        familyId,
      })
      .orderBy('SL.DateCreated', 'DESC')
      .getMany();

    await Promise.all(
      shoppingLists.map(async (shoppingList) => {
        const query = `select DISTINCT SLP.*, case when FF.Product_Identifier is NULL then -1 else FF.Product_Identifier end as Favorite  
                from ShoppingListProducts SLP LEFT JOIN FavoriteFoods FF   
                on SLP.Product_Identifier = FF.Product_Identifier 
                where (SLP.Active=1 and SLP.State <> 2) and SLP.ScaleNumber=0 and SLP.ShoppingListId = ${shoppingList.Id}
                order by SLP.Name asc;`;
        shoppingList.shoppingListProducts = await manager.query(query);
      }),
    );

    return shoppingLists;
  }

  /**
   * @controllerService
   * @desc update shopping list name
   * @param {Object} paramDto Data Transfer Object for param
   * @param {number} paramDto.listId id of shopping list
   * @param {Object} bodyDto Data Transfer Object for body
   * @param {string} bodyDto.Name name of the shopping list (only this will be update)
   * @param {Object} bodyDto.family family of the user
   * @return {Promise<UpdateResult>}
   * */
  async updateOne(
    paramDto: UpdateShoppingListParamDto,
    bodyDto: UpdateShoppingListBodyDto,
  ): Promise<UpdateResult> {
    return await this.shoppingListRepo.update(
      { Id: paramDto.listId, family: bodyDto.family, Active: 1 },
      {
        Name: bodyDto.Name,
      },
    );
  }

  /**
   * @controllerService
   * @desc Delete shopping list (Set Active to 0)
   * @param {Object} paramDto Data Transfer Object for param
   * @param {number} paramDto.listId id of shopping list
   * @param {Object} bodyDto Data Transfer Object for body
   * @param {Object} bodyDto.family family of the user
   * @return {Promise<DeleteShoppingListResponseDto>} { isDeleted: bool }
   * */
  async deleteOne(
    paramDto: DeleteShoppingListParamDto,
    bodyDto: DeleteShoppingListBodyDto,
  ): Promise<UpdateResult> {
    const result = await this.shoppingListRepo.update(
      { Id: paramDto.listId, family: bodyDto.family },
      {
        Active: 0,
      },
    );
    const shoppingList = await this.shoppingListRepo.findOne({
      Id: paramDto.listId,
      family: bodyDto.family,
      Active: 0,
    });
    this.commandBus.execute(
      new RemoveShoppingListCommand(
        shoppingList.Name,
        bodyDto.family.id,
        this.request.user.id,
        this.request.user.fullName,
      ),
    );
    return result;
  }

  /**
   * @controllerService
   * @desc create new shopping list
   * @param {number} userId login user's Id
   * @param {Object} createShoppingListDto Data Transfer Object of request body
   * @param {Object} createShoppingListDto.family User's one of the family ids (role should be user).
   * @param {string} createShoppingListDto.Name ShoppingList Name
   * @return {Promise<CreateShoppingListDtoResponse>} success message
   * */
  async create(
    userId,
    createShoppingListDto: CreateShoppingListDto,
  ): Promise<CreateShoppingListDtoResponse> {
    await this.shoppingListRepo.insert({
      user: userId,
      ...createShoppingListDto,
    });

    this.commandBus.execute(
      new AddShoppingListCommand(
        createShoppingListDto.Name,
        createShoppingListDto.family.id,
        this.request.user.id,
        this.request.user.fullName,
      ),
    );

    return {
      message: CreateShoppingListSuccessEnum.Message,
    };
  }

  /**
   * @controllerService
   * @description assign product to shopping list bt shopping list Id and returns success message
   * @param {number} shoppingListId id of ShoppingList
   * @param {AddProductToShoppingBodyDTO} body  data of body
   * @param {FileInterface} file file comes from body
   * @returns {Promise<AddProductToShoppingResponseDto>} a simple message
   */
  async addProductToShoppingList(
    shoppingListId,
    body: AddProductToShoppingBodyDTO,
    file: FileInterface,
    familyId: number,
  ): Promise<InsertResult> {
    let imageData: { ImageURL: string } = null;
    if (file) {
      const uploadResult = await this.uploadService.uploadToS3({
        Bucket: this.productBucket,
        Key: this.uploadService.uniqueFileName(file.originalname),
        Body: file.buffer,
      });
      imageData = { ImageURL: uploadResult.Key };
    }
    await this.logService.createLog(
      1100,
      'App',
      'updateShoppingList',
      'RequestApp',
      'HubID',
    );
    const product = await this.shoppingListProductRepo.insert({
      shoppingList: { Id: shoppingListId },
      ...body,
      QuantityMeasure: '0',
      ScaleNumber: 0,
      Weight: -1,
      hub: { Id: -1 },
      ...imageData,
    });
    this.commandBus.execute(
      new AddProductToShoppingListsCommand(
        product.raw.insertId,
        this.request?.user?.id,
        familyId,
        this.request?.user?.fullName,
      ),
    );

    return product;
  }
}
