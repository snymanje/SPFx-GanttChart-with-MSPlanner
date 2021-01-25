import * as React from 'react';
import * as ReactDom from 'react-dom';
import { sp } from "@pnp/sp/presets/all";
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'ProjectManagementWebPartStrings';
import ProjectManagement from './components/ProjectManagement';
import { IProjectManagementProps } from './components/IProjectManagementProps';
import Chart from './components/GanttChart/GanttChart';

export interface IProjectManagementWebPartProps {
  description: string;
}

export default class ProjectManagementWebPart extends BaseClientSideWebPart<IProjectManagementWebPartProps> {

  protected onInit(): Promise<void> {

    return super.onInit().then(_ => {

      // other init code may be present

      sp.setup({
        spfxContext: this.context,
        sp: {
          headers: {
            Accept: "application/json;odata=verbose",
          },
          baseUrl:
            "https://tfgonline.sharepoint.com/sites/SharePointFrameworkTesting",
        },
      });
    });
  }

  public render(): void {
    const element: React.ReactElement<IProjectManagementProps> = React.createElement(
      /* ProjectManagement,
      {
        description: this.properties.description
      } */
      Chart
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
