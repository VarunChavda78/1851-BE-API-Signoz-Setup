import { Controller, Get } from '@nestjs/common';

@Controller({
    version: '1',
    path: 'hello-world',
  })
export class HelloWorldController {

    @Get()
    helloWorld(){
        return 'Hello World';
    }
}
