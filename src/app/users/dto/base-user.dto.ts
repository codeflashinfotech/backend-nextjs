import { IsEmail, IsEnum, IsOptional, MinLength } from 'class-validator';
import { Gender } from '../users.enum';

export class BaseUserDto {
  /**
   * User's email should goes here.
   * @example 'info@pantryon.com'
   */
  @IsEmail()
  email: string;

  /**
   * User's full name should goes here.
   * @example 'Alexferri'
   */
  @IsOptional()
  username?: string;

  /**
   * User's full name should goes here.
   * @example 'Alex Ferri'
   */
  @IsOptional()
  fullName?: string;

  /**
   * User's address should goes here.
   * @example 'Nulla St. Mankato Mississippi'
   */
  @IsOptional()
  address?: string;

  /**
   * User's city should goes here.
   * @example 'New York'
   */
  @IsOptional()
  city?: string;

  /**
   * User's state should goes here.
   * @example 'Michigan'
   */
  @IsOptional()
  state?: string;

  /**
   * User's zip code should goes here.
   * @example '12345'
   */
  @IsOptional()
  zipCode?: string;

  /**
   * User's country should goes here.
   * @example 'US'
   */
  @IsOptional()
  country?: string;

  /**
   * User's password should goes here.
   * @example 'pantryon123'
   */
  @IsOptional()
  @MinLength(6)
  password?: string;

  /**
   * User's avatar should goes here.
   * @example 'https://website.com/avatar.jpg'
   */
  @IsOptional()
  avatar?: string;

  /**
   * Age of user.
   * @example 23
   */
  @IsOptional()
  age?: number;

  /**
   * Age of user.
   */
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;
}
