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
            <div className="contact-number"> 
                <label className={styles.detailedInfoLabel}>Phone: </label>
                <span className={styles.detailedInfoSpan}>{this.props.phone}</span>
            </div>
            <div className="contact-email">
                <label className={styles.detailedInfoLabel}>E-mail: </label>
                <span className={styles.detailedInfoSpan}>{this.props.email}</span>
            </div>
            </React.Fragment>
        )}

        let showEditForm;
        if(this.state.isEdit) {
            showEditForm = (<ContactFormComponent name={this.props.name} 
                                                email={this.props.email} 
                                                phone={this.props.phone}
                                                id={this.props.id}
                                                onSubmit={(e)=> {this.props.onSubmit(e); this.handleEdit()}}
                                                image={this.props.image}
                                                buttonName='Update'/>)
        }

            return (
                <div className={styles.contact}>
                <li className={styles.content} onClick={this.handleOpened.bind(this)}>
                    <div className="contact-info">
                        <div className={styles.contactName}>
                            <img className={styles.contactImage} src={this.props.image} alt="" width="50px" height="50px" />
                            <label className={styles.nameLabel}>{this.props.name}</label>  
                        </div>
                        {detailedInfo}
                    </div>   
                </li>
                <button className={styles.editButton} onClick={this.handleEdit.bind(this)}>Edit</button>
                {showEditForm}
                </div>
            );
           
        
    }
}
