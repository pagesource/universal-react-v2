/* eslint import/no-extraneous-dependencies: off */

import React from 'react';
import { configure, storiesOf, setAddon } from '@storybook/react';
import chaptersAddon, { setDefaults } from 'react-storybook-addon-chapters';

setDefaults({
  sectionOptions: {
    showSource: false,
    allowSourceToggling: true,
    showPropTables: false,
    allowPropTablesToggling: false
  }
});

const req = require.context('../../src/components', true, /story\.tsx$/);

setAddon(chaptersAddon);

function loadStories() {
  req.keys().forEach((filename) => {
    const configs = Object.assign({}, req(filename).default);
    const Component = configs.component;
    let chapters = configs.componentChapters;
    // Dynamically create sections based on passed component configs.
    const stories = [];
    const chaptersArray =
      chapters && chapters[0].sections && chapters[0].sections.length
        ? chapters[0].sections
        : configs.sections;

    chapters = chaptersArray.forEach((section) => {
      let componentSections = [];

      if (section.sectionConfigs && section.sectionConfigs.length) {
        componentSections = section.sectionConfigs.map((cfg) => ({
          sectionFn: () => <Component {...cfg} />
        }));
      } else if (section.sectionFn && typeof section.sectionFn === 'function') {
        componentSections.push(section);
      }
      stories.push(
        storiesOf(
          `${configs.componentType}/${configs.componentName}`,
          module
        ).addWithChapters(section.title, {
          chapters: [
            {
              info: section.info,
              sections: componentSections,
              subtitle: section.subtitle
            }
          ]
        })
      );
    });
    return stories;
  });
}

configure(loadStories, module);
