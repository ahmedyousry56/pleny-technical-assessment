import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Brand, BrandDocument } from './schemas/brand.schema';
import { BrandsEnum } from '@/enums/brands.enum';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class BrandsService {
  private readonly logger = new Logger(BrandsService.name);

  constructor(
    @InjectModel(Brand.name)
    private readonly BrandModel: Model<BrandDocument>,
  ) { }

  async transform(): Promise<void> {
    const rawDocs: any[] = await this.BrandModel.find().lean().exec();

    this.logger.log(`Found ${rawDocs.length} brand documents to transform.`);

    for (const doc of rawDocs) {
      const $set: Record<string, any> = {};
      const $unset: Record<string, 1> = {};

      const brandName = (doc.brandName || doc.brand?.name)?.toString().trim();
      if (brandName) {
        $set['brandName'] = brandName;
      }

      const currentYear = new Date().getFullYear();

      let yearFounded = this.resolveNumericField(
        doc,
        'yearFounded',
        ['yearCreated', 'yearsFounded'],
      );

      if (yearFounded === null || yearFounded < BrandsEnum.MIN_YEAR || yearFounded > currentYear) {
        yearFounded = BrandsEnum.MIN_YEAR;
      }
      $set['yearFounded'] = yearFounded;

      let headquarters = doc.headquarters;
      if (!headquarters || typeof headquarters !== 'string' || !headquarters.trim()) {
        if (doc.hqAddress && typeof doc.hqAddress === 'string' && doc.hqAddress.trim()) {
          headquarters = doc.hqAddress.trim();
        }
      }
      if (typeof headquarters === 'string') {
        headquarters = headquarters.trim();
      }
      $set['headquarters'] = headquarters;

      let numberOfLocations = this.resolveNumericField(
        doc,
        'numberOfLocations',
        [],
      );
      if (!numberOfLocations || numberOfLocations < 1) {
        numberOfLocations = BrandsEnum.MIN_LOCATIONS;
      }
      $set['numberOfLocations'] = numberOfLocations;

      const allowedFields = Object.keys(this.BrandModel.schema.paths);

      for (const field of Object.keys(doc)) {
        if (!allowedFields.includes(field)) {
          $unset[field] = 1;
        }
      }

      const update: Record<string, any> = { $set };
      if (Object.keys($unset).length) {
        update['$unset'] = $unset;
      }

      await this.BrandModel.collection.updateOne(
        { _id: doc._id },
        update,
      );

      this.logger.log(`Transformed brand: ${$set['brandName']} (${doc._id})`);
    }

    this.logger.log('Validating all brand documents against schema …');
    const updatedDocs = await this.BrandModel.find().lean().exec();
    for (const doc of updatedDocs) {
      const instance = new this.BrandModel(doc);
      const err = instance.validateSync();
      if (err) {
        this.logger.error(
          `Validation failed for brand ${doc._id}: ${err.message}`,
        );
      } else {
        this.logger.log(`Brand ${doc.brandName} is valid.`);
      }
    }

    this.logger.log('Transformation complete.');
  }

  async seedBrands(): Promise<void> {
    const filePath = path.resolve(process.cwd(), 'data/extended-brands.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    const brands: Partial<Brand>[] = JSON.parse(raw);

    for (const data of brands) {
      const brand = new this.BrandModel(data);
      const err = brand.validateSync();
      if (err) {
        this.logger.error(
          `Seed validation failed for "${data.brandName}": ${err.message}`,
        );
        continue;
      }
      await brand.save();
      this.logger.log(`Seeded brand: ${data.brandName}`);
    }
  }

  async findAll() {
    return this.BrandModel.find().lean().exec();
  }

  private resolveNumericField(
    doc: Record<string, any>,
    primaryField: string,
    alternativeFields: string[],
  ): number | null {
    const candidates = [primaryField, ...alternativeFields];

    for (const field of candidates) {
      const raw = doc[field];
      if (!raw) continue;

      if (typeof raw === 'number' && !isNaN(raw)) {
        return raw;
      }
      if (typeof raw === 'string') {
        const parsed = Number(raw);
        if (!isNaN(parsed)) {
          return parsed;
        }
      }
    }

    return null;
  }
}
