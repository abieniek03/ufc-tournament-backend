import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WeightclassModule } from './modules/weightclass/weightclass.module';
import { FightersModule } from './modules/fighters/fighters.module';

@Module({
  imports: [ConfigModule.forRoot(), WeightclassModule, FightersModule],
})
export class AppModule {}
