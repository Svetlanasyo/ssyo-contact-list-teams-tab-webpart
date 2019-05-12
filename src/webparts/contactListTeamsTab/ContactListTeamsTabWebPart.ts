import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, PropertyPaneDropdown } from '@microsoft/sp-webpart-base';
import {IPropertyPaneConfiguration, PropertyPaneTextField, IPropertyPaneDropdownOption} from '@microsoft/sp-property-pane';
import * as strings from 'ContactListTeamsTabWebPartStrings';
import ContactListTeamsTab from './components/ContactListTeamsTab';
import { IContactListTeamsTabProps } from './components/IContactListTeamsTabProps';
import {SharePointRestService} from './services/SharePointRestService'
import { sp, ItemAddResult } from '@pnp/sp';


export interface IContactListTeamsTabWebPartProps {
  listName: string;
  newListName: string;
  availableLists: IPropertyPaneDropdownOption[];
};

export default class ContactListTeamsTabWebPart extends BaseClientSideWebPart<IContactListTeamsTabWebPartProps> {

  public onInit(): Promise<void> {
      sp.web.lists.get().then((items) => {
        this.properties.availableLists = items.map((item) => ({key: item.Title, text: item.Title}));
      })
    
    SharePointRestService.checkListExistance(this.properties.listName);
    
    return Promise.resolve();
  };

  public onAfterPropertyPaneChangesApplied() {
   
    if (this.properties.newListName) {
      SharePointRestService.checkListExistance(this.properties.newListName).then(() =>{
        sp.web.lists.get().then((items) => {
          this.properties.availableLists = items.map((item) => ({key: item.Title, text: item.Title}));
          this.context.propertyPane.refresh()
        })
      })
    }
    console.log(this.properties.listName) 
  };
  
  public render(): void {
    const element: React.ReactElement<IContactListTeamsTabProps > = React.createElement(
      ContactListTeamsTab,
      {
        listName: this.properties.listName
      });

    ReactDom.render(element, this.domElement);
  };

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  };

  protected get disableReactivePropertyChanges() : boolean {
    return true;
  };

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  };

  private validateMessage(name: string) {
    if(name.trim().length === 0) {
      return strings.ErrorMessage;
    };

    return "";
};

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
                PropertyPaneDropdown('listName', {
                  label: strings.ListNameFieldLabel,
                  options: this.properties.availableLists,
                }),
                PropertyPaneTextField('newListName', {
                  label: 'Create List',
                })
              ]
            }
          ]
        }
      ]
    };
  };
}
