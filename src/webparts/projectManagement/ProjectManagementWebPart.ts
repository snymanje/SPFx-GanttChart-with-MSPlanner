import * as React from "react";
import * as ReactDom from "react-dom";

import { setup as pnpSetup } from "@pnp/common";
import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";

import { Index } from "./components/Index";

export interface IProjectManagementWebPartProps {
  title: string;
  range: number;
  plannerId: string;
  excludedBuckets: string;
}

export default class ProjectManagementWebPart extends BaseClientSideWebPart<IProjectManagementWebPartProps> {
  public onInit(): Promise<void> {
    pnpSetup({
      spfxContext: this.context,
    });
    return Promise.resolve();
  }

  public render(): void {
    const element: React.ReactElement<IProjectManagementWebPartProps> = React.createElement(
      Index,
      {
        title: this.properties.title,
        range: this.properties.range,
        plannerId: this.properties.plannerId,
        excludedBuckets: this.properties.excludedBuckets,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  // @ts-ignore
  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: "Gantt Chart Properties",
          },
          groups: [
            {
              groupName: "Chart Properties",
              groupFields: [
                PropertyPaneTextField("title", {
                  label: "Name",
                }),
                PropertyPaneTextField("range", {
                  label: "Default range in days",
                }),
                PropertyPaneTextField("plannerId", {
                  label: "Your MS Planner Plan Id",
                }),
                PropertyPaneTextField("excludedBuckets", {
                  label: "Excluded Buckets seperated by comma",
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
