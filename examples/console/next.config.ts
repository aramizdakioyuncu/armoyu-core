import path from 'path';

const nextConfig: any = {
  transpilePackages: ['@armoyu/core'],
  allowedDevOrigins: ['localhost', '127.0.0.1'],
  outputFileTracingRoot: path.resolve(__dirname, '../../'),
};

export default nextConfig;
