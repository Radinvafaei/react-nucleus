import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';
import { IConfig } from '@interfaces/config.interface';

export default class BootstrapConfig {
  private static defaultConfig: IConfig = {
    settings: {
      rootDirectory: `./src`,
    },
    categories: [{ name: `Atom`, path: `/atom` }],
    templates: {
      component: {
        extensions: [],
        files: [
          {
            name: `{{componentName}}.tsx`,
            content: `
              import React from 'react';
              import { I{{componentName}}Props } from './interface';

              const {{componentName}}: React.FC<I{{componentName}}Props> = ({}) => {
                return <div>{{componentName}}</div>;
              };

              export default {{componentName}};
            `,
          },
          {
            name: `interface.ts`,
            content: `export interface I{{componentName}}Props {};`,
          },
          {
            name: `index.ts`,
            content: `
              export { default } from './{{componentName}}';
              export * from './interface';
            `,
          },
          {
            name: `{{componentName}}.test.tsx`,
            condition: `storybook`,
            content: `
            import React from 'react';
            import { ComponentMeta, ComponentStory } from '@storybook/react';
            import {{componentName}} from './{{componentName}}';

            export default {
              title: '{{category}}/{{subcategory}}/{{componentName}}',
              component: {{componentName}},
              argTypes: {
                // Add controls for props if needed
              },
            } as ComponentMeta<typeof {{componentName}}>;

            const Template: ComponentStory<typeof {{componentName}}> = (args) => <{{componentName}} {...args} />;

            export const Default = Template.bind({});
            Default.args = {
              // Define default props here
            };
            `,
          },
        ],
      },
    },
  };
  static run(filePath: string = `.nucleus.yml`): void {
    const targetPath = path.resolve(process.cwd(), filePath);

    if (fs.existsSync(targetPath)) {
      console.log(`✅ Configuration file "${filePath}" already exists.`);
      return;
    }

    const yamlContent = yaml.dump(this.defaultConfig);
    fs.writeFileSync(targetPath, yamlContent, `utf8`);
    console.log(`🚀 Created default configuration at "${filePath}"`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  BootstrapConfig.run();
}
