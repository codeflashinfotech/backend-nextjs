import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateSystemDto,
  CreateSystemResponseDto,
  DeleteFamilySystemResponseDto,
  GetSystemDto,
  ProcessShadowUpdateDto,
  UpdateFamilySystemDto,
  UpdateFamilySystemResponseDto,
} from './dto';
import {
  FamilySystemDeleteDec,
  FamilySystemPutDec,
  MySystemGetDec,
  ShadowUpdatePostDec,
  SystemPostDec,
} from './systems.decorator';
import {
  DeleteFamilySystemSuccessEnum,
  UpdateFamilySystemSuccessEnum,
} from './systems.enum';
import { SystemsService } from './systems.service';

@ApiTags('systems')
@Controller('v1/systems')
export class SystemsController {
  private lockRequest: Array<string>;
  constructor(
    private readonly systemsService: SystemsService,
    @Inject(REQUEST) private req,
  ) {}

  @Post()
  @SystemPostDec()
  async createSystem(
    @Body() createSystemDto: CreateSystemDto,
  ): Promise<CreateSystemResponseDto> {
    const hubId = await this.systemsService.createSystem(
      createSystemDto,
      this.req.user.id,
    );
    return { hubId: hubId };
  }

  @Get('family/:familyId')
  @MySystemGetDec()
  async geyFamilySystems(@Param() params): Promise<GetSystemDto[]> {
    return await this.systemsService.findHubs({
      family: { id: params.familyId },
    });
  }

  @Delete(':hubId/family/:familyId')
  @FamilySystemDeleteDec()
  async deleteFamilySystem(
    @Param() param,
  ): Promise<DeleteFamilySystemResponseDto> {
    await this.systemsService.deleteSystem(param.hubId);
    return {
      message: DeleteFamilySystemSuccessEnum.Message,
    };
  }

  @Put(':hubId/family/:familyId')
  @FamilySystemPutDec()
  async updateFamilySystem(
    @Param() param,
    @Body() body: UpdateFamilySystemDto,
  ): Promise<UpdateFamilySystemResponseDto> {
    await this.systemsService.updateSystem(param.hubId, body);
    return {
      message: UpdateFamilySystemSuccessEnum.Message,
    };
  }

  @Post('process-shadow-update')
  @ShadowUpdatePostDec()
  async processShadowUpdate(@Body() body: ProcessShadowUpdateDto) {
    return await this.systemsService.processDeviceData(
      body.value,
      body.requestId,
    );
  }
}
