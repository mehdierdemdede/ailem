import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {FamiliesService} from './families.service';
import {CreateFamilyDto} from './dto/create-family.dto';

@Controller('families')
export class FamiliesController {
  constructor(private readonly familiesService: FamiliesService) {}

  @Post()
  create(@Body() createFamilyDto: CreateFamilyDto) {
    return this.familiesService.create(createFamilyDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.familiesService.findOne(id);
  }

  @Get()
  findAll() {
    return this.familiesService.findAll();
  }
}
