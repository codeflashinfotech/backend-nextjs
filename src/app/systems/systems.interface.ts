import {
  ProcessShadowUpdateValue,
  WeightOfProcessShadowUpdateValue,
} from './dto/process-shadow-update.dto';
export type ProcessShadowUpdateValueInterface = ProcessShadowUpdateValue;
export type WeightOfProcessShadowUpdateValueInterface =
  WeightOfProcessShadowUpdateValue;

export interface ICreateShadow {
  ShadowData: string;
  HubAppId;
  Temperature;
  HubMac;
  RequestId;
  UpdateType;
  HubIP;
}

export interface IDeviceData {
  ShadowData: string;
  RequestId: string;
  HubMac: string;
  HubIP: string;
  HubAppId: string;
  Temperature: number;
  UpdateType: string;
  value: ProcessShadowUpdateValueInterface;
}
