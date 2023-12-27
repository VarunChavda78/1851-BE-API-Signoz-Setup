import { Controller } from '@nestjs/common';

@Controller({
  version: '1',
  path: 'role',
})
export class RoleController {
  constructor() {}
}
