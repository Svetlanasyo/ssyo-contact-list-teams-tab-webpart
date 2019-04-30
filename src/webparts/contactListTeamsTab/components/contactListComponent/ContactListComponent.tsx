import * as React from 'react';
import { ContactComponent } from '../contactComponent/ContactComponent';
import { ContactFormComponent } from '../contactFormComponent/ContactFormComponent';
import * as _ from '@microsoft/sp-lodash-subset';
import {SharePointRestService} from '../../services/SharePointRestService'
import styles from "./ContactListComponent.module.scss";

export interface IContactListComponentState {
    displayedContacts: any[];
    isAdd: boolean;
}

export class ContactListComponent extends React.Component<{}, IContactListComponentState> {

    private CONTACTS = [{
        id: 1,
        name: 'Darth Vader',
        phone: '+250966666666',
        image: 'http://cs7.pikabu.ru/images/big_size_comm_an/2014-03_7/13962622876915.gif',
        email: 'vader@starwars.com',

    }, {
        id: 2,
        name: 'Princess Leia',
        phone: '+250966344466',
        image: 'http://images6.fanpop.com/image/photos/33100000/CARRIE-FISHER-anakin-vader-and-princess-leia-33186069-190-149.gif',
        email: 'leia@starwars.com'
    }]

    constructor() {
        super({})
        this.state = 
        {
            displayedContacts: this.CONTACTS,
            isAdd: false
        }
        SharePointRestService.fetchContacts().then((items) => {
            this.CONTACTS = items;
            console.log(this.CONTACTS);
            this.setState({
                displayedContacts: this.CONTACTS
            })
        })
        }

    handleSearch(event) {
        var searchQuery = event.target.value.toLowerCase();
        var displayedContacts = this.CONTACTS.filter(function(el) {
            var searchValue = el.name.toLowerCase();
            return searchValue.indexOf(searchQuery) !== -1;
        });

        this.setState({
            displayedContacts: displayedContacts
        });
    }

    handleEdit(editContact) {
        let index = _.findIndex(this.CONTACTS, (contact) => contact.id === editContact.id);
        this.CONTACTS.splice(index - 1, 1, editContact);
        this.setState({
            displayedContacts: this.CONTACTS
        }) 
    }

    handleCreate(newContact) {
        this.CONTACTS.push(newContact)
        this.setState({
            displayedContacts: this.CONTACTS
        })
        SharePointRestService.addContacts(newContact);
    }

    handleAdd() {
        this.setState({
        isAdd : !this.state.isAdd
        }) 
    }

    
    render() {

        let showCreateForm;
        if(this.state.isAdd) {
            showCreateForm= (<ContactFormComponent name='Enter name'
                                                email='Enter email'
                                                phone='22 8888888'
                                                id={this.CONTACTS.length+1}
                                                onSubmit={this.handleCreate.bind(this)}
                                                image=''
                             />)
        }

        return (
            <div className="contacts">
                <div className="create-form">
                <button className="editButton" onClick={this.handleAdd.bind(this)}>Add new contact</button>
                {showCreateForm}
                </div>
                <input type="text" className="search-field" onChange={this.handleSearch.bind(this)} placeholder="Search" />
                <ul className={styles.contactList}>
                    {
                       this.state.displayedContacts.map((el) => {
                            return <ContactComponent
                                key={el.id}
                                id={el.id}
                                name={el.name}
                                phone={el.phone}
                                email={el.email}
                                image={el.image}
                                age={el.age}
                                onSubmit={this.handleEdit.bind(this)}
                            />;
                       })
                    }
                </ul>
            </div>
        );
    }
};
