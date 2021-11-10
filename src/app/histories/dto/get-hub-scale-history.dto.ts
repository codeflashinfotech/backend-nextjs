import { IsNotEmpty } from 'class-validator';

export class GetHubScaleHistoryQueryDto {
  @IsNotEmpty()
  hubId: number;

  @IsNotEmpty()
  scaleNumber: number;

  @IsNotEmpty()
  days: number;
}
