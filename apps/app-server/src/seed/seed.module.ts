import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { UserModule } from 'modules/user/user.module';
import { MenuModule } from 'modules/menu/menu.module';

@Module({
    imports: [UserModule, MenuModule],
    providers: [SeedService],
})
export class SeedModule {}
