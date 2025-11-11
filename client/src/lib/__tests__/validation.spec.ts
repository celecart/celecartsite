import { describe, it, expect } from 'vitest';
import { validateBrandProductInput } from '../validation';

describe('validateBrandProductInput', () => {
  const baseRaw = {
    name: 'Test Product',
    productCategory: 'Apparel',
    category: 'Luxury',
    description: 'A sample description',
    price: '199.99',
    website: 'https://example.com',
    purchaseLink: 'https://store.example.com/item',
    rating: 4,
    isActive: true,
    isFeatured: false,
    metadata: { tags: ['test'] }
  };

  it('passes with minimal valid input', () => {
    const { errors, normalized } = validateBrandProductInput({ name: 'Ok' }, undefined, 1);
    expect(errors).toEqual({});
    expect(normalized).toBeDefined();
    expect(normalized!.name).toBe('Ok');
    expect(normalized!.brandId).toBe(1);
  });

  it('requires brandId', () => {
    const { errors } = validateBrandProductInput({ name: 'Ok' }, undefined, undefined);
    expect(errors.brandId).toBeDefined();
  });

  it('validates name length', () => {
    const { errors: tooShort } = validateBrandProductInput({ name: 'A' }, undefined, 1);
    expect(tooShort.name).toBeDefined();

    const longName = 'x'.repeat(121);
    const { errors: tooLong } = validateBrandProductInput({ name: longName }, undefined, 1);
    expect(tooLong.name).toBeDefined();
  });

  it('normalizes price string', () => {
    const { errors, normalized } = validateBrandProductInput({ name: 'Ok', price: '$123.4' }, undefined, 1);
    expect(errors).toEqual({});
    expect(normalized!.price).toBe('123.40');
  });

  it('rejects invalid price', () => {
    const { errors } = validateBrandProductInput({ name: 'Ok', price: 'abc' }, undefined, 1);
    expect(errors.price).toBeDefined();
  });

  it('validates website and purchaseLink URLs', () => {
    const { errors } = validateBrandProductInput({ name: 'Ok', website: 'notaurl', purchaseLink: 'http:/bad' }, undefined, 1);
    expect(errors.website).toBeDefined();
    expect(errors.purchaseLink).toBeDefined();
  });

  it('accepts root-relative image URLs', () => {
    const { errors, normalized } = validateBrandProductInput(baseRaw, ['/uploads/products/img1.jpg'], 2);
    expect(errors).toEqual({});
    expect(normalized!.imageUrl).toEqual(['/uploads/products/img1.jpg']);
  });

  it('rejects invalid image URLs', () => {
    const { errors } = validateBrandProductInput(baseRaw, ['notaurl'], 2);
    expect(errors.imageUrl).toBeDefined();
  });

  it('validates rating range', () => {
    const { errors: badLow } = validateBrandProductInput({ name: 'Ok', rating: -1 }, undefined, 1);
    expect(badLow.rating).toBeDefined();
    const { errors: badHigh } = validateBrandProductInput({ name: 'Ok', rating: 6 }, undefined, 1);
    expect(badHigh.rating).toBeDefined();
  });
});