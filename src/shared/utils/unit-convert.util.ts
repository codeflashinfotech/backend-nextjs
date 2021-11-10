import { Injectable } from '@nestjs/common';

type Unit = 'G' | 'LB';

type LBS = {
  lbs: number;
  oz: number;
};

@Injectable()
export class UnitConvert {
  /**
   * @description convert weight to given unit
   * @param {number} weight device given number for weight
   * @param {Unit} toUnit convert to that unit
   * */
  convertWeight(weight: number, unit: 'G'): number;
  convertWeight(weight: number, unit: 'LB'): LBS;
  convertWeight(weight: number, toUnit: Unit): number | LBS {
    if (isNaN(weight) && toUnit == 'G') {
      return 0;
    } else if (isNaN(weight) && toUnit == 'LB') {
      return {
        lbs: 0,
        oz: 0,
      };
    }

    if (toUnit == 'LB') {
      return {
        lbs: Math.floor((weight * 10 * 0.035274) / 16),
        oz: Number(((weight * 10 * 0.035274) % 16).toPrecision(3)),
      };
    }
    return weight * 10;
  }

  /**
   * @description convert to original device unit
   * @param {number|LBS} weight product weight
   * @param {Unit} unit unit of product weight
   * */
  convertedWeightToDeviceWeight(weight: number, unit: Unit): number;
  convertedWeightToDeviceWeight(weight: LBS, unit: Unit): number;
  convertedWeightToDeviceWeight(weight: any, unit: Unit): number {
    if (
      (unit == 'G' && typeof weight != 'number') ||
      (unit == 'LB' && typeof weight != 'object')
    ) {
      throw Error(
        `weight type ${typeof weight} not compatible with unit ${unit}`,
      );
    }
    if (unit == 'G') return weight / 10;
    return -1;
  }
}
