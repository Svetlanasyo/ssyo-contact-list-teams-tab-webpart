import * as React from 'react';
import styles from './ContactListTeamsTab.module.scss';
import { IContactListTeamsTabProps } from './IContactListTeamsTabProps';
import { ContactListComponent } from './contactListComponent/ContactListComponent'

export default class ContactListTeamsTab extends React.Component<IContactListTeamsTabProps, {}> {
  public render(): React.ReactElement<IContactListTeamsTabProps> {
    return (
      <div className={ styles.contactListTeamsTab }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <ContactListComponent
              listName={this.props.listName}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
