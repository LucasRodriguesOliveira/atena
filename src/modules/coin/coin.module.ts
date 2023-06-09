import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coin } from './entity/coin.entity';
import { CoinService } from './coin.service';
import { CoinController } from './coin.controller';
import { ServicePack } from '../service-pack/service/entity/service-pack.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Coin, ServicePack])],
  providers: [CoinService],
  controllers: [CoinController],
})
export class CoinModule {}
