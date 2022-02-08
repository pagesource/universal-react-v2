import base from './base';
import dev from './dev';

const config = {
  dev: { ...base, ...dev }
};

export default config;
