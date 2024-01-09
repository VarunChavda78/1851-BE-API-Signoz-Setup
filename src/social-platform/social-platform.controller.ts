import { Controller } from '@nestjs/common';

@Controller({
  version: '1',
  path: 'social-platform',
})
export class SocialPlatformController {
  constructor() {}
}
