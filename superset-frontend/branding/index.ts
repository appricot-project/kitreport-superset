// @ts-ignore - webpack defines process.env at build time
const brand = process.env.REACT_APP_BRAND || 'verk';

interface BrandingConfig {
  appName: string;
  logoPath: string;
  primaryColor: string;
  secondaryColor: string;
}

import { branding as algoritmyResheniyBranding } from './algoritmyResheniy/algoritmyResheniy';
import { branding as lfkFinserviceBranding } from './lfk-finservice/lfk-finservice';
import { branding as kodDostupaBranding } from './kod-dostupa/kod-dostupa';
import { branding as triKitaBranding } from './tri-kita/tri-kita';
import { branding as verkBranding } from './verk/verk';

let brandingConfig: BrandingConfig;

switch (brand) {
  case 'algoritmyResheniy':
    brandingConfig = algoritmyResheniyBranding;
    break;
  case 'lfk-finservice':
    brandingConfig = lfkFinserviceBranding;
    break;
  case 'kod-dostupa':
    brandingConfig = kodDostupaBranding;
    break;
  case 'tri-kita':
    brandingConfig = triKitaBranding;
    break;
  case 'verk':
  default:
    brandingConfig = verkBranding;
}

console.log('BRAND:', brand);
console.log('BRANDING CONFIG:', brandingConfig);

export default brandingConfig;
