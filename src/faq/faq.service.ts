import { Injectable } from '@nestjs/common';
import { FaqRepository } from './faq.repository';

@Injectable()
export class FaqService {
  constructor(private faqRepository: FaqRepository) {}
  async hello() {
    return await this.faqRepository.find();
  }
}
