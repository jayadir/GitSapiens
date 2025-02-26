/** @type {import('next').NextConfig} */
import path from 'path';
const nextConfig = {
    images:{
        domains:['avatars.githubusercontent.com']
    },
    // webpack(config) {
    //     config.resolve.alias['@'] = path.join(__dirname, '/');
    //     return config;
    //   }
};


  
export default nextConfig;
