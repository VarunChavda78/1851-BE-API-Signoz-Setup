import { Injectable, Logger } from '@nestjs/common';
import { LandingPageRepository } from './landing-page.repository';
import { LandingPage } from './landing-page.entity'; // Ensure correct path
import { LandingPageSectionRepository } from './landing-page-section.repository';
import { LandingPageCustomisationRepository } from './landing-page-customisation.repository';
import { RollbarLogger } from 'nestjs-rollbar';

@Injectable()
export class LandingPageService {
  private logger = new Logger('LandingPageService');
  constructor(
    private readonly landingPageRepository: LandingPageRepository,
    private readonly landingPageCustomisationRepository: LandingPageCustomisationRepository,
    private readonly landingPageSectionRepository: LandingPageSectionRepository,
    private readonly rollbarLogger: RollbarLogger,
  ) {}

  async findOne(brandId: number) {
    try {
      const data = await this.landingPageRepository.findOne({
        where: { brandId },
      });
      return data;
    } catch (error) {
      this.logger.error('Error fetching brand details', error);
      this.rollbarLogger.error(
        `${this.constructor.name}.${this.findOne.name} - ${error.message}`,
        error,
      );
      throw error;
    }
  }

  async createOrUpdate(brandId: number, createLandingPageDto: any) {
    try {
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
    } catch (error) {
      this.logger.error(`Error creating or updating landing page`, error);
      this.rollbarLogger.error(
        `${this.constructor.name}.${this.createOrUpdate.name} - ${error.message}`,
        error,
      );
      throw error;
    }
  }

  async findSection(brandId: number, sectionSlug: string) {
    try {
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
    } catch (error) {
      this.logger.error('Error fetching landing page section', error);
      this.rollbarLogger.error(
        `${this.constructor.name}.${this.findSection.name} - ${error.message}`,
        error,
      );
      throw error;
    }
  }

  async createOrUpdateSection(
    brandId: number,
    sectionSlug: string,
    createLandingPageDto: any,
  ) {
    try {
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
    } catch (error) {
      this.logger.error('Error creating or updating section', error);
      this.rollbarLogger.error(
        `${this.constructor.name}.${this.createOrUpdateSection.name} - ${error.message}`,
        error,
      );
      throw error;
    }
  }
}
