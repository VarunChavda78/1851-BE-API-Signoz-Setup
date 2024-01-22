import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ClaimProfileRepository } from './repositories/claim-profile.repository';
import { ClaimProfileService } from './services/claim-profile.service';
import { ClaimProfileDto } from './dtos/claimProfileDto';

@Controller({
  version: '1',
  path: 'claim-profile',
})
export class ClaimProfileController {
  constructor(
    private repository: ClaimProfileRepository,
    private service: ClaimProfileService,
  ) {}

  @Post()
  async create(@Body() request: ClaimProfileDto) {
    const schedule = await this.repository.save(request);
    if (schedule) {
      await this.service.sendEmail(request);
      return {
        statusCode: HttpStatus.CREATED,
        status: 'Call Scheduled successfully!',
      };
    } else {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        status: 'Bad Request',
      };
    }
  }
}
