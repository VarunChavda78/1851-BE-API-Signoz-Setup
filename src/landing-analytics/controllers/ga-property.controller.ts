import {
  Controller,
  Put,
  Body,
  Param,
  Logger,
} from '@nestjs/common';
import { GACredentialsRepository } from '../repositories/ga-credentials.repository';

@Controller({
  version: '1',
  path: 'landing-analytics/property',
})
export class GAPropertyController {
  private readonly logger = new Logger(GAPropertyController.name);

  constructor(
    private gaCredentialsRepository: GACredentialsRepository,
  ) {}

  @Put(':id')
  async updatePropertyId(
    @Param('id') id: number,
    @Body() body: { propertyId: string },
  ) {
    try {
      const credential = await this.gaCredentialsRepository.findOne({ where: { id } });
      if (!credential) {
        return { success: false, message: 'Credential not found' };
      }

      credential.propertyId = body.propertyId;
      await this.gaCredentialsRepository.save(credential);

      return { success: true, message: 'Property ID updated successfully' };
    } catch (error) {
      this.logger.error(
        `Error updating property ID for credential ${id}`,
        error,
      );
      return {
        success: false,
        message: 'Failed to update property ID',
        error: error.message,
      };
    }
  }
}
