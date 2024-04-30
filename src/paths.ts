import 'module-alias/register';
import { addAliases } from 'module-alias';
import path from 'path';

addAliases({
    '@routes': path.join(__dirname, 'routes'),
    '@database': path.join(__dirname, 'database'),
    '@controllers': path.join(__dirname, 'controllers'),
    '@services': path.join(__dirname, 'services'),
    '@models': path.join(__dirname, 'models'),
    '@constants': path.join(__dirname, 'constants'),
    '@config': path.join(__dirname, 'config'),
    '@utils': path.join(__dirname, 'utils'),
    '@middleware': path.join(__dirname, 'middleware')
})
