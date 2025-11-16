import {Type} from 'class-transformer';
import {IsNumber, IsString, Min} from 'class-validator';

export class CreateFamilyDto {
  @IsString({message: 'Ebeveyn tam adı zorunludur.'})
  parentFullName!: string;

  @IsString({message: 'Şehir bilgisi zorunludur.'})
  city!: string;

  @IsString({message: 'İlçe bilgisi zorunludur.'})
  district!: string;

  @Type(() => Number)
  @IsNumber({}, {message: 'Çocuk sayısı sayı olmalıdır.'})
  @Min(3, {message: 'Çocuk sayısı en az 3 olmalıdır.'})
  numberOfChildren!: number;
}
