// swagger.js
import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Mon API',
    version: '1.0.0',
    description: 'Documentation générée automatiquement',
  },
  host: 'localhost:3000',
  schemes: ['http'],
};

const outputFile = './swagger.json';
const routes = ['../routes/*.js'];

swaggerAutogen()(outputFile, routes, doc);