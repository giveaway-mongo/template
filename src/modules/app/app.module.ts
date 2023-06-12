import { Module } from '@nestjs/common';
import { SamplesModule } from '../samples/samples.module';
import { ConfigModule } from '@nestjs/config';
import { isTestEnvironment } from '@common/utils/environment';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !isTestEnvironment() ? '.env' : '.env.test',
    }),
    SamplesModule,
  ],
})
export class AppModule {}
