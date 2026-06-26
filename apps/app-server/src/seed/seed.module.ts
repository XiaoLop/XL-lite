import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { UserModule } from 'modules/base/user/user.module';
import { MenuModule } from 'modules/base/menu/menu.module';

@Module({
    imports: [UserModule, MenuModule],
    providers: [SeedService],
})
export class SeedModule {}
