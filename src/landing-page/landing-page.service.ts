import { Injectable } from '@nestjs/common';
import { LandingPageRepository } from './landing-page.repository';
import { LandingPage } from './landing-page.entity'; // Ensure correct path
// import { CreateLandingPageDto } from './dto/create-landing-page.dto'; // Create DTO

@Injectable()
export class LandingPageService {
  constructor(private readonly landingPageRepository: LandingPageRepository) {}

  async findOne(brandId: number) {
    const data = await this.landingPageRepository.findOne({
      where: { brandId },
    });
    return data;
  }

  async createOrUpdate(
    brandId: number,
    createLandingPageDto: any,
  ) {
    const existingPage = await this.findOne(brandId);

    if (existingPage) {
      // Update existing landing page
      existingPage.content = createLandingPageDto?.content || '';
      existingPage.updatedAt = new Date(); // Set updatedAt to current timestamp
      return {
        page: await this.landingPageRepository.save(existingPage),
        message: 'Page content updated successfully',
      };
    } else {
      // Create new landing page
      const newPage = this.landingPageRepository.create({
        brandId,
        content: createLandingPageDto?.content || '',
        createdBy: 1,
        updatedBy: 1,
      });
      return {
        page: await this.landingPageRepository.save(newPage),
        message: 'Page content created successfully',
      };
    }
  }
}
