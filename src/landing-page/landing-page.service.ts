import { Injectable } from '@nestjs/common';
import { LandingPageRepository } from './landing-page.repository';
import { LandingPage } from './landing-page.entity'; // Ensure correct path
import { LandingPageSectionRepository } from './landing-page-section.repository';
import { LandingPageCustomisationRepository } from './landing-page-customisation.repository';

@Injectable()
export class LandingPageService {
  constructor(
    private readonly landingPageRepository: LandingPageRepository,
    private readonly landingPageCustomisationRepository: LandingPageCustomisationRepository,
    private readonly landingPageSectionRepository: LandingPageSectionRepository,
  ) {}

  async findOne(brandId: number) {
    const data = await this.landingPageRepository.findOne({
      where: { brandId },
    });
    return data;
  }

  async createOrUpdate(brandId: number, createLandingPageDto: any) {
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

  async findSection(brandId: number, sectionSlug: string) {
    const section = await this.landingPageSectionRepository.findOne({
      where: { slug: sectionSlug },
    });

    if (!section) {
      throw new Error(`Section not found for slug: ${sectionSlug}`);
    }

    const customization = await this.landingPageCustomisationRepository.findOne(
      {
        where: { brandId, section: { id: section.id } },
      },
    );
    return customization;
  }

  async createOrUpdateSection(
    brandId: number,
    sectionSlug: string,
    createLandingPageDto: any,
  ) {
    const section = await this.landingPageSectionRepository.findOne({
      where: { slug: sectionSlug },
    });

    if (!section) {
      throw new Error(`Section not found for slug: ${sectionSlug}`);
    }

    const existingPage = await this.findSection(brandId, sectionSlug);

    if (existingPage) {
      // Update existing customization
      existingPage.content = createLandingPageDto?.data || '';
      existingPage.updatedAt = new Date();
      return {
        page: await this.landingPageCustomisationRepository.save(existingPage),
        message: 'Customization content updated successfully',
      };
    } else {
      // Create new customization
      const newPage = this.landingPageCustomisationRepository.create({
        brandId,
        section,
        content: createLandingPageDto?.data || '',
        createdBy: 1,
        updatedBy: 1,
      });
      return {
        page: await this.landingPageCustomisationRepository.save(newPage),
        message: 'Customization content created successfully',
      };
    }
  }
}
