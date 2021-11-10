import { IsNotEmpty } from 'class-validator';
import {
  ProcessShadowUpdateSystemErrorEnum,
  ProcessShadowUpdateSystemErrorMsgEnum,
  ProcessShadowUpdateSystemSuccessEnum,
} from '../systems.enum';

export class ProcessShadowUpdateValue {
  state: {
    reported: {
      Weight: Array<WeightOfProcessShadowUpdateValue>;
      /**
       * @expamle 129
       */
      Temperature: number;
      /**
       * @expamle '7e03238b'
       */
      UniqueID: string;
      /**
       * @expamle 'test-mac'
       */
      MAC: string;
      /**
       * @expamle '192.168.1.5'
       */
      IP: string;
      /**
       * @expamle 'Orion'
       */
      HubType: string;
      /**
       * @expamle 'RealTime'
       */
      UpdateType: string;
      /**
       * @expamle 1618830890
       */
      TimeStamp: number;
    };
  };
  /**
   * @expamle 135
   */
  version: number;
  /**
   * @expamle 1618830891
   */
  timestamp: number;
}

export class WeightOfProcessShadowUpdateValue {
  /**
   * @example 1
   */
  ScaleNumber: number;
  /**
   * @example 20
   */
  ScaleWeight: number;
  /**
   * @example 0
   */
  OldWeight: number;
}

export class ProcessShadowUpdateDto {
  /**
   * aws request id => context
   * */
  @IsNotEmpty()
  requestId: string;
  /**
   * main device response
   * */
  @IsNotEmpty()
  value: ProcessShadowUpdateValue;
}

export class ProcessShadowUpdateDtoResponse {
  message: ProcessShadowUpdateSystemSuccessEnum;
}

export class ProcessShadowUpdateFailureDto {
  /**
   * A short code for the error that happended.
   */
  errorCode: ProcessShadowUpdateSystemErrorEnum;

  /**
   * Description for error code.
   */
  message: ProcessShadowUpdateSystemErrorMsgEnum;
}



