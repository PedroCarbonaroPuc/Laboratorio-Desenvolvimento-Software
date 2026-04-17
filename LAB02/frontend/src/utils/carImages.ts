const IMAGIN_BASE = 'https://cdn.imagin.studio/getimage';
const CUSTOMER = 'hrjavascript-mastery';

export function getCarImageUrl(brand: string, model: string, year?: number, angle = 23): string {
  const params = new URLSearchParams({
    customer: CUSTOMER,
    make: brand,
    modelFamily: model.toLowerCase().replace(/\s+/g, '-'),
    modelYear: String(year || new Date().getFullYear()),
    angle: String(angle),
  });
  return `${IMAGIN_BASE}?${params.toString()}`;
}
