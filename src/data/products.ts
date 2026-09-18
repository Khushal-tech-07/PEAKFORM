import { Product } from '../types';
import { PRODUCTS_PART_1 } from './productsPart1';
import { PRODUCTS_PART_2 } from './productsPart2';
import { getProductImageData } from './productImages';

const RAW_PRODUCTS: Product[] = [
  ...PRODUCTS_PART_1,
  ...PRODUCTS_PART_2,
];

export const INITIAL_PRODUCTS: Product[] = RAW_PRODUCTS.map((p) => {
  const imgData = getProductImageData(p.id, p.categoryId);
  return {
    ...p,
    imageUrl: imgData.primary,
    images: imgData.gallery,
  };
});
