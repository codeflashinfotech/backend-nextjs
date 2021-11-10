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
  AddProductToShoppingBodyDTO,
  AddProductToShoppingParamPostDTO,
  AddProductToShoppingQueryPostDTO,
  AddProductToShoppingResponseDto,
  CreateShoppingListDto,
  CreateShoppingListDtoResponse,
  DeleteShoppingListBodyDto,
  DeleteShoppingListParamDto,
  DeleteShoppingListResponseDto,
  GetShoppingListDto,
  GetShoppingListResponseDTO,
  UpdateShoppingListBodyDto,
  UpdateShoppingListParamDto,
  UpdateShoppingListResponseDto,
} from './dto';
import {
  AddProductToShoppingListPostDec,
  ShoppingListCreateDec,
  ShoppingListDeleteDec,
  ShoppingListGETDec,
  ShoppingListUpdateDec,
} from './shopping-lists.decorator';
import { ShoppingListsService } from './shopping-lists.service';
import {
  AddProductToShoppingListSuccessEnum,
  DeleteShoppingListSuccessEnum,
  UpdateShoppingListErrorMsgEnum,
  UpdateShoppingListErrorStatusEnum,
  UpdateShoppingListSuccessEnum,
} from './shopping-lists.enum';
import { FileInterface } from '../../shared/module/upload/upload.interface';

@ApiTags('shopping-lists')
@Controller('v1/shopping-lists')
export class ShoppingListsController {
  @Inject(REQUEST) private req;

  constructor(private shoppingListService: ShoppingListsService) {}

  @Get('')
  @ShoppingListGETDec()
  getShoppingList(
    @Query() dto: GetShoppingListDto,
  ): Promise<GetShoppingListResponseDTO[]> {
    return this.shoppingListService.findAll(dto);
  }

  @Put('/:listId')
  @ShoppingListUpdateDec()
  async updateShoppingList(
    @Param() paramDto: UpdateShoppingListParamDto,
    @Body() bodyDto: UpdateShoppingListBodyDto,
  ): Promise<UpdateShoppingListResponseDto> {
    const updateResult = await this.shoppingListService.updateOne(
      paramDto,
      bodyDto,
    );
    if (updateResult.affected == 0) {
      throw new UnprocessableEntityException({
        errorCode: UpdateShoppingListErrorStatusEnum.ShoppingListNotUpdated,
        message: UpdateShoppingListErrorMsgEnum.ShoppingListNotUpdated,
      });
    }
    return { message: UpdateShoppingListSuccessEnum.Message };
  }

  @Delete('/:listId')
  @ShoppingListDeleteDec()
  async deleteShoppingList(
    @Param() paramDto: DeleteShoppingListParamDto,
    @Body() bodyDto: DeleteShoppingListBodyDto,
  ): Promise<DeleteShoppingListResponseDto> {
    await this.shoppingListService.deleteOne(paramDto, bodyDto);
    return { message: DeleteShoppingListSuccessEnum.Message };
  }

  @Post('')
  @ShoppingListCreateDec()
  createShoppingList(
    @Body() createShoppingList: CreateShoppingListDto,
  ): Promise<CreateShoppingListDtoResponse> {
    return this.shoppingListService.create(
      this.req.user.id,
      createShoppingList,
    );
  }

  @Post(':listId/product')
  @AddProductToShoppingListPostDec()
  async addProductToShoppingList(
    @Param() paramDto: AddProductToShoppingParamPostDTO,
    @Body() bodyDto: AddProductToShoppingBodyDTO,
    @Query() queryDto: AddProductToShoppingQueryPostDTO,
    @UploadedFile() file: FileInterface,
  ): Promise<AddProductToShoppingResponseDto> {
    await this.shoppingListService.addProductToShoppingList(
      paramDto.listId,
      bodyDto,
      file,
      queryDto.familyId,
    );
    return { message: AddProductToShoppingListSuccessEnum.Message };
  }
}
