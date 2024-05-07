import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WeightclassModule } from './modules/weightclass/weightclass.module';

@Module({
  imports: [ConfigModule.forRoot(), WeightclassModule],
})
export class AppModule {}
