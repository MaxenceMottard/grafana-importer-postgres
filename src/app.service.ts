import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { JSDOM } from 'jsdom';
import got from 'got';
import { stocks } from './config.json';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from './models/Stock';
import * as moment from 'moment';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Stock)
    private stockRepository: Repository<Stock>,
  ) {
    this.handleCron();
  }

  @Cron('*/10 * * * * *')
  async handleCron() {
    stocks.forEach((stock) => this.getAndSaveData(stock));
  }

  private getAndSaveData = async (stock: { index: string; url: string }) => {
    const value = await this.getCurrentValue(stock.url);
    const date = moment();

    if (date.hour() < 9 || date.hour() > 17) {
      return;
    }

    const data = {
      timestamp: date.format('YYYY-MM-DD HH:mm:ss'),
      index: stock.index,
      value: Number(value),
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await this.stockRepository.save(data);
  };

  private getCurrentValue = async (url: string): Promise<string> => {
    const response = await got(url);
    const { document } = new JSDOM(response.body).window;

    return document.querySelector('span.c-instrument--last').textContent;
  };
}
