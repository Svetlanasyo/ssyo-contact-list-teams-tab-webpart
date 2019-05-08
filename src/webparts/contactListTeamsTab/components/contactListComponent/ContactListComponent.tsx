import * as React from 'react';
import { ContactComponent } from '../contactComponent/ContactComponent';
import { ContactFormComponent } from '../contactFormComponent/ContactFormComponent';
import * as _ from '@microsoft/sp-lodash-subset';
import {SharePointRestService} from '../../services/SharePointRestService'
import styles from "./ContactListComponent.module.scss";
import Pagination from "react-js-pagination";
import {Environment, EnvironmentType} from '@microsoft/sp-core-library';

export interface IContactListComponentState {
    displayedContacts: any[];
    isAdd: boolean;
    activePage: number;
};

export interface IContactListComponentProps {
    listName: string
};

export class ContactListComponent extends React.Component<IContactListComponentProps, 
                                                    IContactListComponentState> {

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
    }];

    constructor(props) {
        super(props);
        this.state = {
            displayedContacts: [],
            isAdd: false,
            activePage: 1,
        };
        if (Environment.type === EnvironmentType.Local) {
            this.state = {
                displayedContacts: this.CONTACTS,
                isAdd: false,
                activePage: 1,
            };
        } else {
            SharePointRestService.fetchContacts(this.props.listName).then((items) => {
                this.CONTACTS = items;
                this.setState({
                    displayedContacts: this.CONTACTS,
                });
            })
        };
    };

    componentWillUpdate(nextProps) {
        if (nextProps.listName !== this.props.listName) {
            SharePointRestService.fetchContacts(nextProps.listName).then((items) => {
                this.CONTACTS = items;
                this.setState({
                    displayedContacts: this.CONTACTS,
                });
            })
        };
    };

    handleSearch(event) {
        var searchQuery = event.target.value.toLowerCase();
        var displayedContacts = this.CONTACTS.filter(function(el) {
            var searchValue = el.name.toLowerCase();
            return searchValue.indexOf(searchQuery) !== -1;
        });

        this.setState({
            displayedContacts: displayedContacts
        });
    };

    handleEdit(editContact) {
        let index = _.findIndex(this.CONTACTS, (contact) => contact.id === editContact.id);
        this.CONTACTS.splice(index - 1, 1, editContact);
        this.setState({
            displayedContacts: this.CONTACTS
        }); 
        SharePointRestService.editContacts(editContact, this.props.listName).then(() => {
            SharePointRestService.fetchContacts(this.props.listName).then((items) => {
                this.CONTACTS = items;
                console.log(this.CONTACTS);
                this.setState({
                    displayedContacts: this.CONTACTS
                })
            });
        });

    };

    handleCreate(newContact) {
        this.CONTACTS.push(newContact)
        this.setState({
            displayedContacts: this.CONTACTS
        });
        SharePointRestService.addContacts(newContact, this.props.listName).then(() => {
            SharePointRestService.fetchContacts(this.props.listName).then((items) => {
                this.CONTACTS = items;
                console.log(this.CONTACTS);
                this.setState({
                    displayedContacts: this.CONTACTS
                });
            });
        });

        this.handleAdd();
    };

    handleAdd() {
        this.setState({
        isAdd : !this.state.isAdd
        }); 
    };

    handlePageChange(pageNumber) {
        console.log(`active page is ${pageNumber}`);
        this.setState({activePage: pageNumber});
    };

    
    render() {

        let showCreateForm;
        if(this.state.isAdd) {
            showCreateForm= (<ContactFormComponent 
                                                id={this.CONTACTS.length+1}
                                                onSubmit={this.handleCreate.bind(this)}
                             />);
        };

        return (
            <div className="contacts">
                <div className="create-form">
                    <button className={styles.addButton} 
                            onClick={this.handleAdd.bind(this)}>
                    Add new contact</button>
                    {showCreateForm}
                </div>
                <div style={{display: !this.state.isAdd ? 'block' : 'none'}}>
                    <input type="text" 
                        className={styles.searchField} 
                        onChange={this.handleSearch.bind(this)} 
                        placeholder="Search"></input>
                    <div className={styles.pagination}>
                        <Pagination
                        activePage={this.state.activePage}
                        itemsCountPerPage={2}
                        totalItemsCount={this.state.displayedContacts.length}
                        pageRangeDisplayed={5}
                        onChange={this.handlePageChange.bind(this)}
                        />
                    </div>
                    <ul className={styles.contactList} >
                        {   
                        this.state.displayedContacts
                        .slice((this.state.activePage-1)*2, (this.state.activePage-1)*2+2)
                        .map((el) => {
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
            </div>
        );
    };
};
