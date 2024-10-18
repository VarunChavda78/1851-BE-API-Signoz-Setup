import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { FaqRepository } from './faq.repository';
import { Faq } from './faq.entity';
import { IsNull } from 'typeorm';
import { CreateFaqDto } from './dtos/create-faq.dto';
import { UpdateFaqDto } from './dtos/update-faq.dto';

@Injectable()
export class FaqService {
  constructor(private faqRepository: FaqRepository) {}

  async findAll(brandId: number) {
    const data = await this.faqRepository.find({
      where: { brandId: brandId, deletedAt: IsNull() },
    });
    return data.map((item) => ({
      id: item?.id,
      question: item?.question,
      answer: item?.answer,
    }));
  }

  async create(brandId: number, createFaqDto: CreateFaqDto): Promise<Faq> {
    const newFaq = this.faqRepository.create({
      brandId,
      ...createFaqDto,
      createdBy: 4,
      updatedBy: 4,
    });
    return await this.faqRepository.save(newFaq);
  }

  async update(
    brandId: number,
    faqId: number,
    updateFaqDto: UpdateFaqDto,
  ): Promise<Faq> {
    const faq = await this.faqRepository.findOne({
      where: { id: faqId, brandId },
    });
    if (!faq) {
      throw new HttpException('FAQ not found', HttpStatus.NOT_FOUND);
    }
    await this.faqRepository.update(faqId, updateFaqDto);
    return { ...faq, ...updateFaqDto };
  }

  async delete(brandId: number, faqId: number): Promise<void> {
    const faq = await this.faqRepository.findOne({
      where: { id: faqId, brandId },
    });
    if (!faq) {
      throw new HttpException('FAQ not found', HttpStatus.NOT_FOUND);
    }
    await this.faqRepository.softDelete(faqId);
  }
}
