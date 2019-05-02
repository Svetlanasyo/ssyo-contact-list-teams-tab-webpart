import * as React from 'react';
import {ContactFormComponent} from '../contactFormComponent/ContactFormComponent'

import styles from './ContactComponent.module.scss';

export interface IContactComponentState {
    isOpened: boolean;
    isEdit: boolean;
}


export class ContactComponent extends React.Component<any, IContactComponentState> {

    constructor() {
        super({});
        this.state =
        {
            isOpened: false,
            isEdit: false
        }
    }

    handleOpened() {
        this.setState({
            isOpened : !this.state.isOpened
        })
    }

    handleEdit() {
        this.setState({
        isEdit : !this.state.isEdit
        }) 
    }

    public render(): React.ReactElement<{}> {
        let detailedInfo;
        if(this.state.isOpened) {
            detailedInfo = (<React.Fragment>
            <div className="contact-number"> {this.props.phone} </div>
            <div className="contact-email"> {this.props.email} </div>
            </React.Fragment>
        )}

        let showEditForm;
        if(this.state.isEdit) {
            showEditForm = (<ContactFormComponent name={this.props.name} 
                                                email={this.props.email} 
                                                phone={this.props.phone}
                                                id={this.props.id}
                                                onSubmit={(e)=> {this.props.onSubmit(e); this.handleEdit()}}
                                                image={this.props.image}/>)
        }

            return (
                <div className={styles.contact}>
                <li className={styles.content} onClick={this.handleOpened.bind(this)}>
                    <img className={styles.contactImage} src={this.props.image} alt="" width="60px" height="60px" />
                    <div className="contact-info">
                        <div className="contact-name"> {this.props.name} </div>
                        {detailedInfo}
                    </div>   
                </li>
                <button className="editButton" onClick={this.handleEdit.bind(this)}>Edit</button>
                {showEditForm}
                </div>
            );
           
        
    }
}
