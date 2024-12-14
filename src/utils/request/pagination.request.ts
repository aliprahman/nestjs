/* eslint-disable max-classes-per-file */
import {
  IsEnum, IsNumber, IsString, IsOptional,
} from 'class-validator';

export class PaginationRequest {
  @IsOptional()
  @IsNumber()
  // @example 1
    page: number;

  @IsOptional()
  @IsNumber()
  // @example 10
    perPage: number;

  @IsOptional()
  @IsString()
  // @example field name
    order: string;

  @IsOptional()
  @IsString()
  @IsEnum(['ASC', 'DESC'])
  // @example ASC / DESC
    sort = 'DESC';

  @IsOptional()
  @IsString()
  // @example field name
    search: string;

  constructor(partial: Partial<PaginationRequest>) {
    Object.assign(this, partial);
    this.search = this.search || '';
    this.page = this.page || 1;
    this.perPage = this.perPage || 10;
    this.order = this.order || 'createdAt';
    this.sort = this.sort || 'DESC';
  }
}