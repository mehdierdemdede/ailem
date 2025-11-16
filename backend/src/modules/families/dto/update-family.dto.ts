import {Type} from 'class-transformer';
import {IsNumber, IsOptional, IsString, Min} from 'class-validator';

export class UpdateFamilyDto {
  @IsOptional()
  @IsString({message: 'Ebeveyn tam adı zorunludur.'})
  parentFullName?: string;

  @IsOptional()
  @IsString({message: 'Şehir bilgisi zorunludur.'})
  city?: string;

  @IsOptional()
  @IsString({message: 'İlçe bilgisi zorunludur.'})
  district?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, {message: 'Çocuk sayısı sayı olmalıdır.'})
  @Min(3, {message: 'Çocuk sayısı en az 3 olmalıdır.'})
  numberOfChildren?: number;
}
