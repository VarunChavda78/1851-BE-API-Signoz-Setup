import { Controller } from '@nestjs/common';

@Controller({
  version: '1',
  path: 'user',
})
export class UserController {
  constructor() {}
}
