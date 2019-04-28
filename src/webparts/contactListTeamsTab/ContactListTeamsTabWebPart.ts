import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';

import * as strings from 'ContactListTeamsTabWebPartStrings';
import ContactListTeamsTab from './components/ContactListTeamsTab';
import { IContactListTeamsTabProps } from './components/IContactListTeamsTabProps';

export interface IContactListTeamsTabWebPartProps {
  description: string;
}

export default class ContactListTeamsTabWebPart extends BaseClientSideWebPart<IContactListTeamsTabWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IContactListTeamsTabProps > = React.createElement(
      ContactListTeamsTab,
      {
        description: this.properties.description
      }
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
