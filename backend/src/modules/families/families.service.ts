import {Injectable} from '@nestjs/common';
import {CreateFamilyDto} from './dto/create-family.dto';

@Injectable()
export class FamiliesService {
  create(createFamilyDto: CreateFamilyDto) {
    return {
      mesaj: 'Aile kaydı başarıyla oluşturuldu.',
      aile: {
        id: '1',
        ebeveynTamAdi: createFamilyDto.parentFullName,
        sehir: createFamilyDto.city,
        ilce: createFamilyDto.district,
        cocukSayisi: createFamilyDto.numberOfChildren,
      },
    };
  }

  findOne(id: string) {
    return {
      id,
      ebeveynTamAdi: 'Ayşe Yılmaz',
      sehir: 'İstanbul',
      ilce: 'Kadıköy',
      cocukSayisi: 3,
      aciklama: 'Bu veriler örnek olarak sunulmuştur.',
    };
  }

  findAll() {
    return [
      {
        id: '1',
        ebeveynTamAdi: 'Fatma Demir',
        sehir: 'Ankara',
        ilce: 'Çankaya',
        cocukSayisi: 4,
      },
      {
        id: '2',
        ebeveynTamAdi: 'Mehmet Kaya',
        sehir: 'İzmir',
        ilce: 'Bornova',
        cocukSayisi: 5,
      },
    ];
  }
}
