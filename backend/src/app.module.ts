import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PatientsModule } from './patients/patients.module';
import { VisitsModule } from './visits/visits.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    MongooseModule.forRootAsync({
      useFactory: () => {
        const uri = process.env.MONGO_URI;
        if (!uri) throw new Error('❌ MONGO_URI is not defined');
        console.log('✅ Connecting to MongoDB Atlas:', uri);
        return { uri };
      },
    }),

    PatientsModule,
    VisitsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
