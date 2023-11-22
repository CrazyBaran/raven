const { getJestProjects } = require('@nx/jest');

export default { projects: getJestProjects() };
module.exports = {
  moduleNameMapper: {
    'use-resize-observer': 'use-resize-observer/polyfilled',
  },
};
