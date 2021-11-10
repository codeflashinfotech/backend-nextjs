import { PickType } from '@nestjs/swagger';
import { CreateSystemDto } from '.';
import { UpdateFamilySystemSuccessEnum } from '../systems.enum';

export class UpdateFamilySystemDto extends PickType(CreateSystemDto, [
  'AppHubName',
  'AddressLocation',
  'WifiName',
  'RefreshRate',
  'TimeZone',
] as const) {}
export class UpdateFamilySystemResponseDto {
  message: UpdateFamilySystemSuccessEnum;
}
