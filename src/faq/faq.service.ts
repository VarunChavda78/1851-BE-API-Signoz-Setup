import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { FaqRepository } from './faq.repository';
import { Faq } from './faq.entity';
import { IsNull } from 'typeorm';
import { CreateFaqDto } from './dtos/create-faq.dto';
import { UpdateFaqDto } from './dtos/update-faq.dto';
import { RollbarLogger } from 'nestjs-rollbar';

@Injectable()
export class FaqService {
  private logger = new Logger('FaqService');
  constructor(private faqRepository: FaqRepository, private rollbarLogger: RollbarLogger) {}

  async findAll(brandId: number) {
    try {
      const data = await this.faqRepository.find({
        where: { brandId: brandId, deletedAt: IsNull() },
        order: {
          id: 'ASC'
        }
      });
      return data.map((item) => ({
        id: item?.id,
        question: item?.question,
        answer: item?.answer,
      }));
    }
    catch (error) {
      this.logger.error('Error fetching FAQs', error);
      this.rollbarLogger.error(
        `${this.constructor.name}.${this.findAll.name} - ${error.message}`,
        error,
      );
      throw error;
    }
    } 

  async create(brandId: number, createFaqDto: CreateFaqDto): Promise<Faq> {
    try {
      const newFaq = this.faqRepository.create({
        brandId,
        ...createFaqDto,
        createdBy: 4,
        updatedBy: 4,
      });
      return await this.faqRepository.save(newFaq);
    } catch (error) {
      this.logger.error('Error creating FAQ', error);
      this.rollbarLogger.error(
        `${this.constructor.name}.${this.create.name} - ${error.message}`,
        error,
      );
      throw error;
    }
  }

  async update(
    brandId: number,
    faqId: number,
    updateFaqDto: UpdateFaqDto,
  ): Promise<Faq> {
    try {
      const faq = await this.faqRepository.findOne({
        where: { id: faqId, brandId },
      });
      if (!faq) {
        throw new HttpException('FAQ not found', HttpStatus.NOT_FOUND);
      }
      await this.faqRepository.update(faqId, updateFaqDto);
      return { ...faq, ...updateFaqDto };
    } catch (error) {
      this.logger.error('Error updating FAQ', error);
      this.rollbarLogger.error(
        `${this.constructor.name}.${this.update.name} - ${error.message}`,
        error,
      );
      throw error;
    }
  }

  async delete(brandId: number, faqId: number): Promise<void> {
    try {
      const faq = await this.faqRepository.findOne({
        where: { id: faqId, brandId },
      });
      if (!faq) {
        throw new HttpException('FAQ not found', HttpStatus.NOT_FOUND);
      }
      await this.faqRepository.softDelete(faqId);
    } catch (error) {
      this.logger.error('Error deleting FAQ', error);
      this.rollbarLogger.error(
        `${this.constructor.name}.${this.delete.name} - ${error.message}`,
        error,
      );
      throw error;
    }
  }
}
