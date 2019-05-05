import * as React from 'react';
import Files from 'react-files';

import styles from "./ContactFormComponent.module.scss";

export interface IFormComponentState {
    name: string;
    phone: string;
    email: string;
    image: string;
    id: number;
    file: File;
    errorNameMessage: string;
    errorPhoneMessage: string;
}

export class ContactFormComponent extends React.Component<any, IFormComponentState> {

    private onAdd;

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            phone: '',
            email: '',
            image: '',
            id: this.props.id,
            file: null,
            errorNameMessage: '',
            errorPhoneMessage:'',
        }
        this.onAdd = this.props.onSubmit;
    }

    public handleSubmit(event) {
        event.preventDefault();
        this.onAdd(this.state);
    }

    public onFilesChange(files) {

        let [file] = files;

        let reader = new FileReader();
        
        reader.onloadend = () => this.setState({ 
            image: reader.result.toString(),
            file: file
        });

        if(file) {
            reader.readAsDataURL(file);
        }
    }

    public onFilesError(error, file) {
        console.log('error code '+error.code + ': ' + error.message)
    }

    public isValidateLength(e, maxLength) { 
        const val = e.currentTarget.value;
        const max = maxLength;
        console.log(val.length > max);
        return val.length > max
    }

    render() {
        return (
        <form onSubmit={this.handleSubmit.bind(this)} className={styles.generalForm}>
            <label>Contact name: </label>
            <input type="text" 
                    placeholder="Enter name"
                    required 
                    onChange={(event) => {
                        this.isValidateLength(event, 30) ? this.setState({errorNameMessage:'Your name must be only 30 symbols'}):
                        this.setState({name: event.target.value, errorNameMessage: ""});
                    } }/>
            <label className={styles.errorMessage}>{this.state.errorNameMessage}</label>
                    
            <label>Contact phone: </label>
            <input type="number" 
                    placeholder="Enter Phone Number"
                    required 
                    onChange={(event) => {
                        this.isValidateLength(event, 10) ? this.setState({errorPhoneMessage:'Your phone must be only 10 symbols'}):
                        this.setState({phone: event.target.value, errorPhoneMessage:""})
                    }}/>
            <label className={styles.errorMessage}>{this.state.errorPhoneMessage}</label>
            <label>Contact e-mail: </label>
            <input type="email" 
                    placeholder="Enter email" 
                    required 
                    onChange={(event) => this.setState({email: event.target.value})}/>
            
            <div className="files">
            <label>Photo: </label>
            <Files
                className={styles.filesDropzone}
                onChange={this.onFilesChange.bind(this)}
                onError={this.onFilesError.bind(this)}
                accepts={['image/png',]}
                maxFiles={1}
                maxFileSize={1000000}
                minFileSize={0}
                clickable
                >
                Drop files here or click to upload
                </Files>
            </div>

            <button type="submit">Create</button>
        </form>
        )
    }
}