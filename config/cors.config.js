// Configuration options: https://www.npmjs.com/package/cors#configuration-options

// const originsAllowed = process.env.CORS_ORIGINS || [
const originsAllowed =  [
  'http://localhost:4200',
  'http://localhost:3000',
  'https://wht-api.herokuapp.com/',
  'https://mario1velasco.github.io/WHT-WEB/'
];

module.exports = {
  origin: function (origin, cb) {
    const allowed = originsAllowed.indexOf(origin) !== -1;
    cb(null, allowed);
  },
  credentials: true,
}